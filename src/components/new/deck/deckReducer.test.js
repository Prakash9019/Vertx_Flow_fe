import { describe, it, expect, vi } from "vitest";
import { deckReducer } from "./deckReducer";
import { createDeck, createSlide, createFreeElement, LAYOUT_IDS } from "./deckTypes";
import { getRegistryEntry } from "./SlideRegistry";
import { defaultMetricsGridContent } from "./layouts/MetricsGridLayout";

function deckWithOneSlide() {
  const slide = createSlide({ layout: "title", content: { title: "Hi" }, order: 0 });
  const deck = createDeck({ title: "Deck", theme: "dark", slides: [slide] });
  return { deck, slide };
}

describe("deckReducer", () => {
  it("ADD_SLIDE appends a new slide with the given layout and content", () => {
    const { deck } = deckWithOneSlide();
    const next = deckReducer(deck, { type: "ADD_SLIDE", layout: "problem", content: { heading: "Problem" } });
    expect(next.slides).toHaveLength(2);
    expect(next.slides[1].layout).toBe("problem");
    expect(next.slides[1].content).toEqual({ heading: "Problem" });
    expect(next.slides[1].order).toBe(1);
  });

  it("ADD_SLIDE warns and no-ops on an unknown layout", () => {
    const { deck } = deckWithOneSlide();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const next = deckReducer(deck, { type: "ADD_SLIDE", layout: "not-a-layout", content: {} });
    expect(next).toBe(deck);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("DELETE_SLIDE removes the slide by id", () => {
    const { deck, slide } = deckWithOneSlide();
    const next = deckReducer(deck, { type: "DELETE_SLIDE", slideId: slide.id });
    expect(next.slides).toHaveLength(0);
  });

  it("DELETE_SLIDE warns and no-ops on a missing slideId", () => {
    const { deck } = deckWithOneSlide();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const next = deckReducer(deck, { type: "DELETE_SLIDE", slideId: "missing" });
    expect(next).toBe(deck);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("DUPLICATE_SLIDE inserts a copy with a new id right after the original", () => {
    const { deck, slide } = deckWithOneSlide();
    const next = deckReducer(deck, { type: "DUPLICATE_SLIDE", slideId: slide.id });
    expect(next.slides).toHaveLength(2);
    expect(next.slides[1].id).not.toBe(slide.id);
    expect(next.slides[1].content).toEqual(slide.content);
    expect(next.slides[1].layout).toBe(slide.layout);
  });

  it("DUPLICATE_SLIDE clones the background instead of sharing it by reference", () => {
    const original = createSlide({
      layout: "title",
      content: { title: "Hi" },
      background: { kind: "gradient", angle: 90, stops: ["#000", "#fff"] },
      order: 0,
    });
    const deck = createDeck({ title: "Deck", theme: "dark", slides: [original] });
    const next = deckReducer(deck, { type: "DUPLICATE_SLIDE", slideId: original.id });
    const duplicate = next.slides[1];

    expect(duplicate.background).toEqual(original.background);
    expect(duplicate.background).not.toBe(original.background);
    expect(duplicate.background.stops).not.toBe(original.background.stops);

    // Mutating the duplicate's background must never affect the original.
    duplicate.background.stops.push("#f00");
    expect(original.background.stops).toEqual(["#000", "#fff"]);
  });

  it("REORDER_SLIDES moves a slide to the target index and renumbers order", () => {
    const { deck, slide } = deckWithOneSlide();
    const withSecond = deckReducer(deck, { type: "ADD_SLIDE", layout: "problem", content: {} });
    const second = withSecond.slides[1];
    const reordered = deckReducer(withSecond, { type: "REORDER_SLIDES", slideId: second.id, toIndex: 0 });
    expect(reordered.slides.map((s) => s.id)).toEqual([second.id, slide.id]);
    expect(reordered.slides[0].order).toBe(0);
    expect(reordered.slides[1].order).toBe(1);
  });

  it("SET_SLIDE_LAYOUT changes layout and remaps content via the registered mapper", () => {
    const problemSlide = createSlide({
      layout: "problem",
      content: { heading: "The Problem", body: "<p>Onboarding takes weeks. Support tickets pile up.</p>" },
      order: 0,
    });
    const deck = createDeck({ title: "Deck", theme: "dark", slides: [problemSlide] });
    const next = deckReducer(deck, { type: "SET_SLIDE_LAYOUT", slideId: problemSlide.id, layout: "media-3points" });
    expect(next.slides[0].layout).toBe("media-3points");
    expect(next.slides[0].content.heading).toBe("The Problem");
    expect(next.slides[0].content.points).toEqual([
      { title: "", body: "Onboarding takes weeks" },
      { title: "", body: "Support tickets pile up." },
    ]);
  });

  it("SET_SLIDE_LAYOUT fills unmapped fields from the target layout's defaults", () => {
    // title -> metrics-grid has NO bespoke mapper, so identityMapper would
    // otherwise hand MetricsGridLayout a content object with no `metrics`.
    const { deck, slide } = deckWithOneSlide();
    const next = deckReducer(deck, { type: "SET_SLIDE_LAYOUT", slideId: slide.id, layout: "metrics-grid" });
    expect(next.slides[0].layout).toBe("metrics-grid");
    expect(Array.isArray(next.slides[0].content.metrics)).toBe(true);
    expect(next.slides[0].content.metrics.length).toBeGreaterThan(0);
    expect(next.slides[0].content).toEqual({
      ...defaultMetricsGridContent(),
      ...slide.content,
    });
  });

  it("SET_SLIDE_LAYOUT never leaves any layout missing its required fields", () => {
    const { deck, slide } = deckWithOneSlide();
    for (const layout of LAYOUT_IDS) {
      const next = deckReducer(deck, { type: "SET_SLIDE_LAYOUT", slideId: slide.id, layout });
      const defaults = getRegistryEntry(layout).defaultContent();
      for (const key of Object.keys(defaults)) {
        expect(next.slides[0].content[key]).toBeDefined();
      }
    }
  });

  it("UPDATE_SLIDE_CONTENT shallow-merges into existing content", () => {
    const { deck, slide } = deckWithOneSlide();
    const next = deckReducer(deck, { type: "UPDATE_SLIDE_CONTENT", slideId: slide.id, content: { subtitle: "New" } });
    expect(next.slides[0].content).toEqual({ title: "Hi", subtitle: "New" });
  });

  it("SET_SLIDE_BACKGROUND replaces the slide's background", () => {
    const { deck, slide } = deckWithOneSlide();
    const bg = { kind: "gradient", stops: ["#000", "#fff"], angle: 45 };
    const next = deckReducer(deck, { type: "SET_SLIDE_BACKGROUND", slideId: slide.id, background: bg });
    expect(next.slides[0].background).toEqual(bg);
  });

  it("ADD_FREE_ELEMENT appends an element to the slide's freeElements", () => {
    const { deck, slide } = deckWithOneSlide();
    const el = createFreeElement({ type: "text", x: 5, y: 5, w: 20, h: 10 });
    const next = deckReducer(deck, { type: "ADD_FREE_ELEMENT", slideId: slide.id, element: el });
    expect(next.slides[0].freeElements).toEqual([el]);
  });

  it("UPDATE_FREE_ELEMENT patches an existing element by id", () => {
    const { deck, slide } = deckWithOneSlide();
    const el = createFreeElement({ type: "text", x: 5, y: 5, w: 20, h: 10 });
    const withEl = deckReducer(deck, { type: "ADD_FREE_ELEMENT", slideId: slide.id, element: el });
    const next = deckReducer(withEl, { type: "UPDATE_FREE_ELEMENT", slideId: slide.id, elementId: el.id, patch: { x: 50 } });
    expect(next.slides[0].freeElements[0].x).toBe(50);
    expect(next.slides[0].freeElements[0].y).toBe(5);
  });

  it("REMOVE_FREE_ELEMENT removes an element by id", () => {
    const { deck, slide } = deckWithOneSlide();
    const el = createFreeElement({ type: "text", x: 5, y: 5, w: 20, h: 10 });
    const withEl = deckReducer(deck, { type: "ADD_FREE_ELEMENT", slideId: slide.id, element: el });
    const next = deckReducer(withEl, { type: "REMOVE_FREE_ELEMENT", slideId: slide.id, elementId: el.id });
    expect(next.slides[0].freeElements).toEqual([]);
  });

  it("returns the same deck and warns for an unknown action type", () => {
    const { deck } = deckWithOneSlide();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const next = deckReducer(deck, { type: "NOT_A_REAL_ACTION" });
    expect(next).toBe(deck);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
