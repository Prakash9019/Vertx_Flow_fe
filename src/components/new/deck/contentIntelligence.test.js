import { describe, it, expect } from "vitest";
import { extractMetrics, extractListItems, extractImagePrompt, enrichSemanticContent } from "./contentIntelligence";

describe("extractMetrics", () => {
  it("returns null when there is nothing numeric", () => {
    expect(extractMetrics("Just a plain sentence with no numbers.")).toBeNull();
  });

  it("returns null for empty/undefined input", () => {
    expect(extractMetrics(null)).toBeNull();
    expect(extractMetrics("")).toBeNull();
  });

  it("extracts a percentage stat with a label", () => {
    const result = extractMetrics("Revenue grew 45% year over year.");
    expect(result).toEqual([{ label: "Revenue grew year over year.", value: "45%" }]);
  });

  it("extracts a currency stat", () => {
    const result = extractMetrics("We raised $2.4M in seed funding.");
    expect(result[0].value).toBe("$2.4M");
  });

  it("extracts a multiplier stat", () => {
    const result = extractMetrics("Our growth is 10x faster than competitors.");
    expect(result[0].value).toBe("10x");
  });

  it("extracts multiple metrics from multiple sentences", () => {
    const result = extractMetrics("We grew 45%. We raised $2M. Users are up 3x.");
    expect(result).toHaveLength(3);
  });

  it("caps at 6 metrics", () => {
    const sentences = Array.from({ length: 10 }, (_, i) => `Stat ${i} is ${i}%.`).join(" ");
    expect(extractMetrics(sentences)).toHaveLength(6);
  });
});

describe("extractListItems", () => {
  it("returns null when there is no list", () => {
    expect(extractListItems("Just a plain paragraph.")).toBeNull();
  });

  it("returns null for a single marker line (not enough for a list)", () => {
    expect(extractListItems("- only one item")).toBeNull();
  });

  it("extracts dash-marked lines", () => {
    const result = extractListItems("- First point\n- Second point\n- Third point");
    expect(result).toEqual([
      { title: "", body: "First point", media: null },
      { title: "", body: "Second point", media: null },
      { title: "", body: "Third point", media: null },
    ]);
  });

  it("extracts numbered lines", () => {
    const result = extractListItems("1. First\n2. Second");
    expect(result.map((i) => i.body)).toEqual(["First", "Second"]);
  });
});

describe("extractImagePrompt", () => {
  it("returns null when there is no image cue", () => {
    expect(extractImagePrompt("Just some text.")).toBeNull();
  });

  it("extracts a bracketed image cue, case-insensitively", () => {
    expect(extractImagePrompt("Some text [Image: a team celebrating a launch] more text")).toBe(
      "a team celebrating a launch"
    );
  });

  it("accepts img/photo/picture synonyms", () => {
    expect(extractImagePrompt("[photo: a rocket launching]")).toBe("a rocket launching");
  });
});

describe("enrichSemanticContent", () => {
  function base(overrides = {}) {
    return { heading: "Heading", body: null, items: null, media: null, metrics: null, ...overrides };
  }

  it("does not mutate the input object", () => {
    const input = base({ body: "Revenue grew 45%." });
    enrichSemanticContent(input);
    expect(input.metrics).toBeNull();
  });

  it("leaves already-structured content untouched", () => {
    const input = base({ items: [{ title: "a", body: "b", media: null }], body: "some prose" });
    const result = enrichSemanticContent(input);
    expect(result.items).toEqual(input.items);
  });

  it("derives metrics from body prose without overwriting existing metrics", () => {
    const withMetrics = base({ metrics: [{ label: "x", value: "1" }], body: "Grew 45%." });
    const result = enrichSemanticContent(withMetrics);
    expect(result.metrics).toEqual([{ label: "x", value: "1" }]);
  });

  it("derives metrics from plain body text", () => {
    const result = enrichSemanticContent(base({ body: "We grew 45% this year." }));
    expect(result.metrics).toEqual([{ label: "We grew this year.", value: "45%" }]);
  });

  it("derives items from a list embedded in body and strips the list from body", () => {
    const result = enrichSemanticContent(base({ body: "Some intro\n- Point one\n- Point two" }));
    expect(result.items).toEqual([
      { title: "", body: "Point one", media: null },
      { title: "", body: "Point two", media: null },
    ]);
    expect(result.body).not.toMatch(/Point one/);
  });

  it("derives a media prompt from an image cue and strips it from body", () => {
    const result = enrichSemanticContent(base({ body: "Great product. [image: a happy customer]" }));
    expect(result.media).toEqual({ url: "", type: "image", prompt: "a happy customer" });
    expect(result.body).not.toMatch(/image:/i);
  });

  it("does not touch existing media", () => {
    const existing = { url: "https://x/y.png", type: "image" };
    const result = enrichSemanticContent(base({ media: existing, body: "[image: ignored]" }));
    expect(result.media).toBe(existing);
  });

  it("leaves body as null when there was nothing to begin with", () => {
    const result = enrichSemanticContent(base());
    expect(result.body).toBeNull();
  });
});
