import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SlideCanvas } from "./SlideCanvas";
import { DeckProvider, useDeck } from "./DeckContext";
import { createDeck, createSlide } from "./deckTypes";

// Regression test for the perf pass (roadmap #16): dragging/resizing/rotating
// one free element dispatches on every pointermove, which replaces that one
// element's object in `slide.freeElements` (see deckReducer's
// UPDATE_FREE_ELEMENT) while every *other* element keeps its same object
// reference. `FreeElement` is wrapped in React.memo and every callback prop
// reaching it (from SlideCanvas and FreeElementLayer) is now stabilized via
// useCallback, so an untouched sibling element should not re-render during
// another element's drag. Before that fix, `FreeElementLayer` recreated its
// toolbar callbacks and `SlideCanvas` recreated its dispatch callbacks on
// every render, so every element re-rendered on every pointermove regardless
// of which one was being dragged.
//
// Render counts are observed by mocking `ShapeWidget` (what `shape`-type
// free elements render through `FreeElementRenderer`) with a spy that
// records which element it was called for, without changing any other
// behavior under test.
const shapeRenderSpy = vi.fn();
vi.mock("./widgets/ShapeWidget", () => ({
  ShapeWidget: ({ element }) => {
    shapeRenderSpy(element.id);
    return <div data-testid={`shape-${element.id}`} />;
  },
}));

beforeAll(() => {
  Element.prototype.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 1000,
    bottom: 600,
    width: 1000,
    height: 600,
    toJSON() {},
  });
});

afterAll(() => {
  delete Element.prototype.getBoundingClientRect;
});

// Stable, module-level no-ops - matching how the real `EditorPage.jsx` wires
// this up: `onSelectElement={setSelectedElementId}` / `onStartEditing={setEditingElementId}`
// are React state setters (referentially stable across renders), not inline
// arrows recreated on every render. Using an inline `() => {}` here instead
// would defeat `FreeElement`'s memoization for every element on every
// render, regardless of the fix under test - so the harness has to mirror
// the real prop-stability contract, not just any callable.
function noop() {}

function Host() {
  const { deck, dispatch } = useDeck();
  const slide = deck.slides[0];
  return (
    <div>
      <button
        onClick={() => dispatch({ type: "UPDATE_SLIDE_CONTENT", slideId: slide.id, content: { title: "Changed" } })}
      >
        Edit title
      </button>
      <SlideCanvas
        slide={slide}
        selectedElementId="el-dragged"
        editingElementId={null}
        onSelectElement={noop}
        onStartEditing={noop}
      />
    </div>
  );
}

function renderTwoShapes() {
  const dragged = {
    id: "el-dragged",
    type: "shape",
    x: 10,
    y: 10,
    w: 20,
    h: 10,
    rotation: 0,
    zIndex: 0,
    locked: false,
    props: {},
  };
  const sibling = {
    id: "el-sibling",
    type: "shape",
    x: 50,
    y: 50,
    w: 20,
    h: 10,
    rotation: 0,
    zIndex: 1,
    locked: false,
    props: {},
  };
  const slide = createSlide({
    layout: "title",
    content: { title: "Hello", subtitle: "" },
    freeElements: [dragged, sibling],
    order: 0,
  });
  const deck = createDeck({ title: "Deck", theme: "dark", slides: [slide] });
  return render(
    <DeckProvider initialDeck={deck}>
      <Host />
    </DeckProvider>
  );
}

describe("FreeElement render optimization (regression for roadmap #16)", () => {
  it("does not re-render a sibling element while another element is dragged", () => {
    renderTwoShapes();

    const initialSiblingRenders = shapeRenderSpy.mock.calls.filter((call) => call[0] === "el-sibling").length;
    const initialDraggedRenders = shapeRenderSpy.mock.calls.filter((call) => call[0] === "el-dragged").length;
    expect(initialSiblingRenders).toBe(1);
    expect(initialDraggedRenders).toBe(1);

    const wrapper = screen.getByTestId("shape-el-dragged").closest('[data-element-id="el-dragged"]');
    expect(wrapper).toBeTruthy();

    fireEvent.pointerDown(wrapper, { clientX: 100, clientY: 100, pointerId: 1, button: 0 });
    fireEvent.pointerMove(wrapper, { clientX: 150, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(wrapper, { clientX: 200, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(wrapper, { clientX: 250, clientY: 100, pointerId: 1 });
    fireEvent.pointerUp(wrapper, { clientX: 250, clientY: 100, pointerId: 1 });

    const siblingRendersAfterDrag = shapeRenderSpy.mock.calls.filter((call) => call[0] === "el-sibling").length;
    const draggedRendersAfterDrag = shapeRenderSpy.mock.calls.filter((call) => call[0] === "el-dragged").length;

    // The untouched sibling must not have re-rendered at all...
    expect(siblingRendersAfterDrag).toBe(initialSiblingRenders);
    // ...while the dragged element re-rendered on (at least some of) the
    // pointermove frames, proving the spy/harness itself is sensitive to
    // real re-renders and this isn't a vacuously-passing assertion.
    expect(draggedRendersAfterDrag).toBeGreaterThan(initialDraggedRenders);
  });

  it("does not re-render any free element when an unrelated slide-content edit happens", () => {
    renderTwoShapes();
    shapeRenderSpy.mockClear();

    // Editing the layout's own content (title/subtitle) goes through
    // `UPDATE_SLIDE_CONTENT`, a completely different reducer branch from
    // `UPDATE_FREE_ELEMENT` - it doesn't touch `slide.freeElements` at all
    // (deckReducer only replaces `slide.content`), so neither free element's
    // `element` prop reference changes, and neither should re-render.
    fireEvent.click(screen.getByText("Edit title"));

    expect(shapeRenderSpy).not.toHaveBeenCalled();
  });
});
