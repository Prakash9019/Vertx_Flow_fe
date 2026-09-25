import React, { useState } from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, waitFor, screen, act, fireEvent } from "@testing-library/react";
import { DeckProvider, useDeck } from "./DeckContext";
import { ProblemLayout } from "./layouts/ProblemLayout";
import { createDeck, createSlide } from "./deckTypes";
import { SlideCanvas } from "./SlideCanvas";

// Roadmap #13 regression: SlideCanvas keys its rendered layout on `slide.id`
// only (see SlideCanvas.jsx), so undo/redo - which reverts `deck.present`
// without changing any slide's id - does NOT remount the layout or its
// RichText fields. Before the RichText fix, this meant undo reverted the
// deck's *state* but left the previously-typed text visibly on screen.

function installFroalaStub() {
  const instances = [];
  function FakeFroalaEditor(el, options) {
    this.el = el;
    this.options = options;
    this.html = {
      get: () => el.innerHTML,
      set: (html) => {
        el.innerHTML = html;
      },
    };
    this.destroy = () => {};
    instances.push(this);
  }
  window.FroalaEditor = FakeFroalaEditor;
  return instances;
}

function Harness({ slideId }) {
  const { deck, dispatch, undo } = useDeck();
  const slide = deck.slides.find((s) => s.id === slideId);
  return (
    <div>
      <button onClick={() => undo()}>undo</button>
      <ProblemLayout
        content={slide.content}
        onChangeContent={(patch) => dispatch({ type: "UPDATE_SLIDE_CONTENT", slideId, content: patch })}
      />
    </div>
  );
}

describe("Undo/redo visually reverts inline text edits (roadmap #13)", () => {
  let instances;

  beforeEach(() => {
    instances = installFroalaStub();
  });

  afterEach(() => {
    delete window.FroalaEditor;
  });

  it("shows the reverted heading text after undo, not the stale typed text", async () => {
    const slide = createSlide({
      layout: "problem",
      content: { heading: "<h1>Original heading</h1>", body: "<p>Body</p>" },
      order: 0,
    });
    const deck = createDeck({ title: "Test Deck", theme: {}, slides: [slide] });

    render(
      <DeckProvider initialDeck={deck}>
        <Harness slideId={slide.id} />
      </DeckProvider>
    );

    await waitFor(() => expect(instances.length).toBeGreaterThanOrEqual(2));
    const headingInstance = instances.find((i) => i.el.innerHTML.includes("Original heading"));

    // User types a new heading.
    act(() => {
      headingInstance.el.innerHTML = "<h1>Edited heading</h1>";
      headingInstance.options.events.contentChanged.call(headingInstance);
    });
    await waitFor(() => expect(screen.getByText("Edited heading")).toBeTruthy());

    // Undo - deck.present reverts, but slide.id is unchanged so the layout
    // and its RichText fields stay mounted.
    act(() => {
      screen.getByText("undo").click();
    });

    await waitFor(() => expect(screen.getByText("Original heading")).toBeTruthy());
    expect(screen.queryByText("Edited heading")).toBeNull();
  });
});

// Additional coverage for the same resync fix, added during roadmap #17
// regression testing: redo, the "echo" case (a re-render whose `value` merely
// reflects what this instance itself just committed), and field independence.
function typeInto(instance, html) {
  instance.el.innerHTML = html;
  act(() => {
    instance.options.events.contentChanged.call(instance);
  });
}

function HostWithRedo({ slideId }) {
  const { deck, dispatch, undo, redo } = useDeck();
  const slide = deck.slides.find((s) => s.id === slideId);
  return (
    <div>
      <button onClick={() => undo()}>undo</button>
      <button onClick={() => redo()}>redo</button>
      <ProblemLayout
        content={slide.content}
        onChangeContent={(patch) => dispatch({ type: "UPDATE_SLIDE_CONTENT", slideId, content: patch })}
      />
    </div>
  );
}

function renderHostWithRedo() {
  const slide = createSlide({
    layout: "problem",
    content: { heading: "<h1>Original heading</h1>", body: "<p>Original body</p>" },
    order: 0,
  });
  const deck = createDeck({ title: "Test Deck", theme: {}, slides: [slide] });
  return render(
    <DeckProvider initialDeck={deck}>
      <HostWithRedo slideId={slide.id} />
    </DeckProvider>
  );
}

describe("Undo/redo of rich-text slide content - additional coverage (roadmap #17)", () => {
  let instances;

  beforeEach(() => {
    instances = installFroalaStub();
  });

  afterEach(() => {
    delete window.FroalaEditor;
  });

  it("redo re-applies the edited text to the visible DOM as well", async () => {
    renderHostWithRedo();
    await waitFor(() => expect(instances.length).toBeGreaterThanOrEqual(2));
    const headingInstance = instances.find((i) => i.el.innerHTML.includes("Original heading"));

    typeInto(headingInstance, "<h1>Edited heading</h1>");
    await waitFor(() => expect(screen.getByText("Edited heading")).toBeTruthy());

    fireEvent.click(screen.getByText("undo"));
    await waitFor(() => expect(screen.getByText("Original heading")).toBeTruthy());

    fireEvent.click(screen.getByText("redo"));
    await waitFor(() => expect(screen.getByText("Edited heading")).toBeTruthy());
  });

  it("does not disturb the DOM on a normal render where the value prop merely echoes what this instance itself last emitted", async () => {
    renderHostWithRedo();
    await waitFor(() => expect(instances.length).toBeGreaterThanOrEqual(2));
    const headingInstance = instances.find((i) => i.el.innerHTML.includes("Original heading"));

    typeInto(headingInstance, "<h1>Edited heading</h1>");
    // The dispatch above causes a re-render with `value` now equal to what
    // was just typed - the ordinary "parent echoes my own change back as a
    // prop" case, which must never fight the live DOM/caret.
    expect(headingInstance.el.innerHTML).toBe("<h1>Edited heading</h1>");
  });

  it("undoing the body field does not affect the heading field, and vice versa", async () => {
    renderHostWithRedo();
    await waitFor(() => expect(instances.length).toBeGreaterThanOrEqual(2));
    const headingInstance = instances.find((i) => i.el.innerHTML.includes("Original heading"));
    const bodyInstance = instances.find((i) => i.el.innerHTML.includes("Original body"));

    typeInto(bodyInstance, "<p>Edited body</p>");
    expect(bodyInstance.el.innerHTML).toBe("<p>Edited body</p>");
    expect(headingInstance.el.innerHTML).toBe("<h1>Original heading</h1>");

    fireEvent.click(screen.getByText("undo"));
    await waitFor(() => expect(bodyInstance.el.innerHTML).toBe("<p>Original body</p>"));
    expect(headingInstance.el.innerHTML).toBe("<h1>Original heading</h1>");
  });
});

// Same bug class, but for a free-element TextWidget (a plain contentEditable
// box, not Froala) - FreeElementLayer keys each widget on `element.id`,
// which also doesn't change across an undo, so this needed the identical
// fix independently.
function FreeTextHost() {
  const { deck, undo } = useDeck();
  const slide = deck.slides[0];
  const [editingElementId, setEditingElementId] = useState(null);
  return (
    <div>
      <SlideCanvas
        slide={slide}
        selectedElementId={slide.freeElements[0]?.id ?? null}
        editingElementId={editingElementId}
        onSelectElement={() => {}}
        onStartEditing={setEditingElementId}
      />
      <button onClick={undo}>Undo Free Text</button>
    </div>
  );
}

function renderFreeTextHost() {
  const slide = createSlide({
    layout: "title",
    content: { title: "T", subtitle: "" },
    freeElements: [
      {
        id: "el-1",
        type: "text",
        x: 10,
        y: 10,
        w: 30,
        h: 10,
        rotation: 0,
        zIndex: 0,
        locked: false,
        props: { html: "Free text original" },
      },
    ],
    order: 0,
  });
  const deck = createDeck({ title: "Deck", theme: {}, slides: [slide] });
  return render(
    <DeckProvider initialDeck={deck}>
      <FreeTextHost />
    </DeckProvider>
  );
}

describe("Undo/redo of a free-element text widget's edit (integration)", () => {
  it("reverts the visible DOM text of a free TextWidget when its edit is undone", () => {
    renderFreeTextHost();
    const node = document.querySelector('[data-element-id="el-1"]');
    expect(node.textContent).toBe("Free text original");

    fireEvent.doubleClick(node); // enters editing mode
    const editable = node.querySelector('[contenteditable="true"]');
    expect(editable).toBeTruthy();
    editable.innerHTML = "Free text edited";
    fireEvent.blur(editable); // commits the edit -> UPDATE_FREE_ELEMENT

    expect(node.textContent).toBe("Free text edited");

    fireEvent.click(screen.getByText("Undo Free Text"));
    expect(node.textContent).toBe("Free text original");
  });
});
