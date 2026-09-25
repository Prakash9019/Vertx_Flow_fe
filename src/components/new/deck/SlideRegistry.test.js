import { describe, it, expect } from "vitest";
import { LAYOUT_IDS } from "./deckTypes";
import { SlideRegistry, getRegistryEntry } from "./SlideRegistry";

describe("SlideRegistry", () => {
  it("has one entry per LAYOUT_ID with a component and a defaultContent factory", () => {
    for (const layoutId of LAYOUT_IDS) {
      const entry = SlideRegistry[layoutId];
      expect(entry, `missing registry entry for "${layoutId}"`).toBeDefined();
      expect(typeof entry.component).toBe("function");
      expect(typeof entry.defaultContent).toBe("function");
      expect(typeof entry.defaultContent()).toBe("object");
    }
  });

  it("getRegistryEntry returns undefined for an unknown layout id", () => {
    expect(getRegistryEntry("not-a-layout")).toBeUndefined();
  });

  it("getRegistryEntry returns the entry for a known layout id", () => {
    expect(getRegistryEntry("title")).toBe(SlideRegistry.title);
  });
});
