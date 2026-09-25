import { describe, it, expect } from "vitest";
import { TEMPLATE_LIBRARY, buildDeckFromTemplate } from "./templateLibrary";
import { LAYOUT_IDS } from "./deckTypes";
import { getRegistryEntry } from "./SlideRegistry";

describe("TEMPLATE_LIBRARY", () => {
  it("has at least 3 templates, each with an id, name, category, and at least one slide", () => {
    expect(TEMPLATE_LIBRARY.length).toBeGreaterThanOrEqual(3);
    for (const template of TEMPLATE_LIBRARY) {
      expect(template.id).toBeTruthy();
      expect(template.name).toBeTruthy();
      expect(template.category).toBeTruthy();
      expect(template.slides.length).toBeGreaterThan(0);
    }
  });

  it("only uses layouts registered in LAYOUT_IDS", () => {
    for (const template of TEMPLATE_LIBRARY) {
      for (const slide of template.slides) {
        expect(LAYOUT_IDS).toContain(slide.layout);
      }
    }
  });

  it("has unique template ids", () => {
    const ids = TEMPLATE_LIBRARY.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("buildDeckFromTemplate", () => {
  it("builds a deck with one slide per template slide, in order, using the template's layout", () => {
    const template = TEMPLATE_LIBRARY[0];
    const deck = buildDeckFromTemplate(template);

    expect(deck.slides).toHaveLength(template.slides.length);
    deck.slides.forEach((slide, index) => {
      expect(slide.layout).toBe(template.slides[index].layout);
      expect(slide.order).toBe(index);
    });
  });

  it("merges each slide's content over its layout's defaultContent, so a template can omit fields", () => {
    const template = {
      id: "t1",
      name: "T1",
      category: "Test",
      slides: [{ layout: "title", content: { title: "Custom Title" } }],
    };
    const deck = buildDeckFromTemplate(template);
    const defaults = getRegistryEntry("title").defaultContent();

    expect(deck.slides[0].content.title).toBe("Custom Title");
    expect(deck.slides[0].content.subtitle).toBe(defaults.subtitle);
  });

  it("uses the template's name as the deck title", () => {
    const deck = buildDeckFromTemplate(TEMPLATE_LIBRARY[0]);
    expect(deck.title).toBe(TEMPLATE_LIBRARY[0].name);
  });
});
