import { describe, it, expect } from "vitest";
import {
  LAYOUT_IDS,
  createSlide,
  createFreeElement,
  createDeck,
  generateId,
} from "./deckTypes";

describe("generateId", () => {
  it("produces unique, prefixed ids", () => {
    const a = generateId("slide");
    const b = generateId("slide");
    expect(a).not.toBe(b);
    expect(a.startsWith("slide-")).toBe(true);
  });
});

describe("LAYOUT_IDS", () => {
  it("lists the 7 supported layouts", () => {
    expect(LAYOUT_IDS).toEqual([
      "title",
      "problem",
      "media-description",
      "media-3points",
      "metrics-grid",
      "team-grid",
      "cta",
    ]);
  });
});

describe("createSlide", () => {
  it("defaults background, freeElements, and generates an id", () => {
    const slide = createSlide({ layout: "title", content: { title: "Hi" }, order: 0 });
    expect(slide.id).toMatch(/^slide-/);
    expect(slide.layout).toBe("title");
    expect(slide.content).toEqual({ title: "Hi" });
    // null = "inherit the deck theme's default background" (architecture doc §6).
    expect(slide.background).toBeNull();
    expect(slide.freeElements).toEqual([]);
    expect(slide.order).toBe(0);
  });

  it("accepts explicit background and freeElements", () => {
    const bg = { kind: "solid", color: "#ffffff" };
    const els = [createFreeElement({ type: "text", x: 0, y: 0, w: 10, h: 10 })];
    const slide = createSlide({ layout: "title", content: {}, background: bg, freeElements: els, order: 1 });
    expect(slide.background).toBe(bg);
    expect(slide.freeElements).toBe(els);
  });
});

describe("createFreeElement", () => {
  it("defaults rotation, zIndex, locked, props, and generates an id", () => {
    const el = createFreeElement({ type: "image", x: 10, y: 20, w: 30, h: 40 });
    expect(el.id).toMatch(/^element-/);
    expect(el.type).toBe("image");
    expect(el.x).toBe(10);
    expect(el.y).toBe(20);
    expect(el.w).toBe(30);
    expect(el.h).toBe(40);
    expect(el.rotation).toBe(0);
    expect(el.zIndex).toBe(0);
    expect(el.locked).toBe(false);
    expect(el.props).toEqual({});
  });
});

describe("createDeck", () => {
  it("defaults slides to an empty array and generates an id", () => {
    const deck = createDeck({ title: "My Deck", theme: "dark" });
    expect(deck.id).toMatch(/^deck-/);
    expect(deck.title).toBe("My Deck");
    expect(deck.theme).toBe("dark");
    expect(deck.slides).toEqual([]);
  });
});
