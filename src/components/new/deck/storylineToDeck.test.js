import { describe, it, expect } from "vitest";
import { buildDeckFromStoryline } from "./storylineToDeck";

const STORYLINE = {
  title: "AI Generated Deck",
  slides: [
    { heading: "Welcome", body: null, items: null, metrics: null },
    { heading: "Traction", body: null, items: null, metrics: [{ label: "Growth", value: "10x" }] },
    {
      heading: "Our Team",
      body: null,
      items: [
        { title: "Ada", body: "CEO" },
        { title: "Grace", body: "CTO" },
      ],
      metrics: null,
    },
  ],
};

describe("buildDeckFromStoryline", () => {
  it("builds a deck with the given title", () => {
    const deck = buildDeckFromStoryline(STORYLINE);
    expect(deck.title).toBe("AI Generated Deck");
    expect(deck.id).toBeTruthy();
  });

  it("produces one slide per storyline entry, in order", () => {
    const deck = buildDeckFromStoryline(STORYLINE);
    expect(deck.slides).toHaveLength(3);
    expect(deck.slides.map((s) => s.order)).toEqual([0, 1, 2]);
  });

  it("picks layouts based on each slide's semantic content", () => {
    const deck = buildDeckFromStoryline(STORYLINE);
    expect(deck.slides[0].layout).toBe("title");
    expect(deck.slides[1].layout).toBe("metrics-grid");
    expect(deck.slides[2].layout).toBe("team-grid");
  });

  it("gives every slide a unique id and inherits-background default", () => {
    const deck = buildDeckFromStoryline(STORYLINE);
    const ids = deck.slides.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    deck.slides.forEach((slide) => {
      expect(slide.background).toBeNull();
      expect(slide.freeElements).toEqual([]);
    });
  });

  it("handles an empty slide list", () => {
    const deck = buildDeckFromStoryline({ title: "Empty", slides: [] });
    expect(deck.slides).toEqual([]);
  });
});
