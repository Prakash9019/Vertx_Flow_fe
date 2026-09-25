import { describe, it, expect } from "vitest";
import { pickRemixLayout } from "./remix";
import { LAYOUT_IDS } from "./deckTypes";

function semantic(overrides = {}) {
  return { heading: "Heading", body: null, items: null, media: null, metrics: null, ...overrides };
}

describe("pickRemixLayout", () => {
  it("picks metrics-grid when the content has metrics", () => {
    const s = semantic({ metrics: [{ value: "10x", label: "Growth" }] });
    expect(pickRemixLayout("title", s)).toBe("metrics-grid");
  });

  it("picks team-grid when items all have a title (people, not bullets)", () => {
    const s = semantic({ items: [{ title: "Ada", body: "CEO", media: null }, { title: "Grace", body: "CTO", media: null }] });
    expect(pickRemixLayout("title", s)).toBe("team-grid");
  });

  it("picks media-3points when items have no titles (plain bullets)", () => {
    const s = semantic({ items: [{ title: "", body: "First point", media: null }, { title: "", body: "Second point", media: null }] });
    expect(pickRemixLayout("title", s)).toBe("media-3points");
  });

  it("picks media-description when there's media and body but no items/metrics", () => {
    const s = semantic({ body: "<p>Some body</p>", media: { url: "https://x/y.png", type: "image" } });
    expect(pickRemixLayout("title", s)).toBe("media-description");
  });

  it("picks problem when there's only a body", () => {
    const s = semantic({ body: "<p>Some body</p>" });
    expect(pickRemixLayout("title", s)).toBe("problem");
  });

  it("picks title when the content is just a bare heading", () => {
    const s = semantic();
    expect(pickRemixLayout("cta", s)).toBe("title");
  });

  it("never returns the current layout", () => {
    const s = semantic({ metrics: [{ value: "1", label: "a" }] });
    expect(pickRemixLayout("metrics-grid", s)).not.toBe("metrics-grid");
  });

  it("respects excludeLayouts, cycling to the next-best fit", () => {
    const s = semantic({ items: [{ title: "Ada", body: "CEO", media: null }] });
    const first = pickRemixLayout("title", s);
    expect(first).toBe("team-grid");
    const second = pickRemixLayout("title", s, [first]);
    expect(second).not.toBe(first);
    expect(second).not.toBe("title");
  });

  it("returns null when every layout is excluded", () => {
    const s = semantic();
    const others = LAYOUT_IDS.filter((l) => l !== "title");
    expect(pickRemixLayout("title", s, others)).toBeNull();
  });
});
