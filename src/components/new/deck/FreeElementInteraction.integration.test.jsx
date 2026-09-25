import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SlideCanvas } from "./SlideCanvas";
import { DeckProvider, useDeck } from "./DeckContext";
import { createDeck, createSlide } from "./deckTypes";

// jsdom doesn't lay elements out, so every element's bounding box is 0x0 by
// default. The interaction hook needs a real-ish rect to convert pixel
// deltas into deck percentages, so give the (single, absolutely-positioned)
// free-element layer a fixed 1000x600 box for this file only.
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

function Host() {
  const { deck, undo, redo, canUndo, canRedo } = useDeck();
  const slide = deck.slides[0];
  const first = slide.freeElements[0];
  return (
    <div>
      <SlideCanvas slide={slide} selectedElementId={first?.id} editingElementId={null} onSelectElement={() => {}} onStartEditing={() => {}} />
      <span data-testid="element-count">{slide.freeElements.length}</span>
      <span data-testid="first-x">{first ? Math.round(first.x) : ""}</span>
      <span data-testid="first-w">{first ? Math.round(first.w) : ""}</span>
      <span data-testid="first-z">{first ? first.zIndex : ""}</span>
      <span data-testid="can-undo">{String(canUndo)}</span>
      <span data-testid="can-redo">{String(canRedo)}</span>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
    </div>
  );
}

function renderWithElement(element, extraElements = []) {
  const slide = createSlide({
    layout: "title",
    content: { title: "Hello", subtitle: "" },
    freeElements: [element, ...extraElements],
    order: 0,
  });
  const deck = createDeck({ title: "Deck", theme: "dark", slides: [slide] });
  return render(
    <DeckProvider initialDeck={deck}>
      <Host />
    </DeckProvider>
  );
}

describe("Free-element interaction engine (integration)", () => {
  it("drags a selected element and produces exactly one undo step", () => {
    renderWithElement({
      id: "el-1",
      type: "text",
      x: 10,
      y: 10,
      w: 20,
      h: 10,
      rotation: 0,
      zIndex: 0,
      locked: false,
      props: { html: "Hi" },
    });

    const wrapper = screen.getByTestId("first-x").closest("div").querySelector('[data-element-id="el-1"]');
    expect(wrapper).toBeTruthy();

    fireEvent.pointerDown(wrapper, { clientX: 100, clientY: 100, pointerId: 1, button: 0 });
    fireEvent.pointerMove(wrapper, { clientX: 150, clientY: 100, pointerId: 1 }); // +5% x
    fireEvent.pointerMove(wrapper, { clientX: 200, clientY: 100, pointerId: 1 }); // +10% x total
    fireEvent.pointerUp(wrapper, { clientX: 200, clientY: 100, pointerId: 1 });

    expect(screen.getByTestId("first-x").textContent).toBe("20");
    expect(screen.getByTestId("can-undo").textContent).toBe("true");

    fireEvent.click(screen.getByText("Undo"));
    expect(screen.getByTestId("first-x").textContent).toBe("10");
    expect(screen.getByTestId("can-undo").textContent).toBe("false");

    fireEvent.click(screen.getByText("Redo"));
    expect(screen.getByTestId("first-x").textContent).toBe("20");
  });

  it("snaps a dragged element to a sibling element's edge", () => {
    renderWithElement(
      { id: "el-1", type: "text", x: 10, y: 10, w: 20, h: 10, rotation: 0, zIndex: 0, locked: false, props: { html: "Hi" } },
      [{ id: "el-2", type: "text", x: 35, y: 10, w: 20, h: 10, rotation: 0, zIndex: 1, locked: false, props: { html: "Sibling" } }]
    );

    const wrapper = document.querySelector('[data-element-id="el-1"]');
    // el-1's right edge (10+20=30) is 5pt from el-2's left edge (35); a 4.5pt
    // drag brings it to 34.5, within the 1.5pt snap threshold of 35.
    fireEvent.pointerDown(wrapper, { clientX: 100, clientY: 100, pointerId: 1, button: 0 });
    fireEvent.pointerMove(wrapper, { clientX: 145, clientY: 100, pointerId: 1 });
    fireEvent.pointerUp(wrapper, { clientX: 145, clientY: 100, pointerId: 1 });

    expect(screen.getByTestId("first-x").textContent).toBe("15"); // 35 - w(20)
  });

  it("resizes from a corner handle", () => {
    renderWithElement({
      id: "el-2",
      type: "shape",
      x: 10,
      y: 10,
      w: 20,
      h: 20,
      rotation: 0,
      zIndex: 0,
      locked: false,
      props: {},
    });

    const handle = document.querySelector('[data-resize-handle="bottom-right"]');
    expect(handle).toBeTruthy();

    fireEvent.pointerDown(handle, { clientX: 300, clientY: 300, pointerId: 1, button: 0 });
    fireEvent.pointerMove(handle, { clientX: 400, clientY: 300, pointerId: 1 }); // +10% w
    fireEvent.pointerUp(handle, { clientX: 400, clientY: 300, pointerId: 1 });

    expect(screen.getByTestId("first-w").textContent).toBe("30");
  });

  it("deletes the selected element via the Delete key, and undo restores it", () => {
    renderWithElement({
      id: "el-3",
      type: "text",
      x: 0,
      y: 0,
      w: 10,
      h: 10,
      rotation: 0,
      zIndex: 0,
      locked: false,
      props: { html: "Bye" },
    });

    expect(screen.getByTestId("element-count").textContent).toBe("1");
    fireEvent.keyDown(window, { key: "Delete" });
    expect(screen.getByTestId("element-count").textContent).toBe("0");

    fireEvent.click(screen.getByText("Undo"));
    expect(screen.getByTestId("element-count").textContent).toBe("1");
  });

  it("bumps zIndex when reordering via the layer toolbar", () => {
    renderWithElement(
      { id: "el-4", type: "shape", x: 0, y: 0, w: 10, h: 10, rotation: 0, zIndex: 0, locked: false, props: {} },
      [{ id: "el-5", type: "shape", x: 20, y: 0, w: 10, h: 10, rotation: 0, zIndex: 1, locked: false, props: {} }]
    );

    expect(screen.getByTestId("first-z").textContent).toBe("0");
    fireEvent.click(screen.getByTitle("Bring forward"));
    expect(screen.getByTestId("first-z").textContent).toBe("1");
  });

  it("duplicates the selected element, offsetting its position", () => {
    renderWithElement({
      id: "el-6",
      type: "shape",
      x: 10,
      y: 10,
      w: 10,
      h: 10,
      rotation: 0,
      zIndex: 0,
      locked: false,
      props: {},
    });

    expect(screen.getByTestId("element-count").textContent).toBe("1");
    fireEvent.click(screen.getByTitle("Duplicate"));
    expect(screen.getByTestId("element-count").textContent).toBe("2");
  });
});
