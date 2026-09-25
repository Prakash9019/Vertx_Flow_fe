import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, waitFor, screen, act } from "@testing-library/react";
import { DeckProvider, useDeck } from "./DeckContext";
import { ProblemLayout } from "./layouts/ProblemLayout";
import { createDeck, createSlide } from "./deckTypes";

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
