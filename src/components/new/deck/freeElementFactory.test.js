import { describe, it, expect } from "vitest";
import { createWidget, duplicateWidget, reorderZIndex, maxZIndex, WIDGET_TYPES } from "./freeElementFactory";

describe("freeElementFactory", () => {
  describe("WIDGET_TYPES", () => {
    it("lists every widget type with defaults", () => {
      expect(WIDGET_TYPES).toEqual(
        expect.arrayContaining(["text", "image", "video", "shape", "divider", "icon"])
      );
      expect(WIDGET_TYPES.length).toBe(6);
    });
  });

  describe("createWidget", () => {
    it("creates a text widget centered on the slide by default", () => {
      const el = createWidget("text");
      expect(el.type).toBe("text");
      expect(el.w).toBe(28);
      expect(el.h).toBe(10);
      expect(el.x).toBeCloseTo(50 - 28 / 2, 5);
      expect(el.y).toBeCloseTo(50 - 10 / 2, 5);
      expect(el.zIndex).toBe(1);
      expect(el.props.html).toBe("Double-click to edit");
    });

    it("staggers position based on existingCount, wrapping every 5", () => {
      const el0 = createWidget("shape", { existingCount: 0 });
      const el1 = createWidget("shape", { existingCount: 1 });
      const el5 = createWidget("shape", { existingCount: 5 }); // wraps back to stagger 0

      expect(el1.x).toBeGreaterThan(el0.x);
      expect(el5.x).toBeCloseTo(el0.x, 5);
      expect(el5.y).toBeCloseTo(el0.y, 5);
    });

    it("sets zIndex to existingMaxZIndex + 1", () => {
      const el = createWidget("icon", { existingMaxZIndex: 7 });
      expect(el.zIndex).toBe(8);
    });

    it("clamps position so a large staggered widget never goes negative or past the slide", () => {
      // divider is w=40 - a large stagger must not push x below 0 or past 100-w.
      const el = createWidget("divider", { existingCount: 4 }); // stagger = 12
      expect(el.x).toBeGreaterThanOrEqual(0);
      expect(el.x).toBeLessThanOrEqual(100 - 40);
    });

    it("throws for an unknown widget type", () => {
      expect(() => createWidget("not-a-real-type")).toThrow(/unknown widget type/);
    });

    it("copies props (not the same defaults object) across calls", () => {
      const a = createWidget("shape");
      const b = createWidget("shape");
      expect(a.props).not.toBe(b.props);
      a.props.shape = "circle";
      expect(b.props.shape).toBe("rectangle");
    });
  });

  describe("duplicateWidget", () => {
    it("offsets position by a fixed amount and bumps zIndex above existingMaxZIndex", () => {
      const original = { type: "shape", x: 10, y: 10, w: 20, h: 20, rotation: 15, zIndex: 3, props: { shape: "circle" } };
      const dup = duplicateWidget(original, { existingMaxZIndex: 5 });

      expect(dup.x).toBe(14);
      expect(dup.y).toBe(14);
      expect(dup.w).toBe(20);
      expect(dup.h).toBe(20);
      expect(dup.rotation).toBe(15);
      expect(dup.zIndex).toBe(6);
      expect(dup.props).toEqual({ shape: "circle" });
      expect(dup.props).not.toBe(original.props);
      expect(dup.id).not.toBe(original.id);
    });

    it("clamps the offset so a duplicate near the edge stays on the slide", () => {
      const original = { type: "shape", x: 98, y: 98, w: 10, h: 10, rotation: 0, zIndex: 0, props: {} };
      const dup = duplicateWidget(original, { existingMaxZIndex: 0 });
      expect(dup.x).toBeLessThanOrEqual(90);
      expect(dup.y).toBeLessThanOrEqual(90);
    });
  });

  describe("reorderZIndex", () => {
    const elements = [
      { id: "a", zIndex: 0 },
      { id: "b", zIndex: 1 },
      { id: "c", zIndex: 2 },
    ];

    it("moves an element forward one position", () => {
      const result = reorderZIndex(elements, "a", "forward");
      expect(result).toEqual([
        { id: "b", zIndex: 0 },
        { id: "a", zIndex: 1 },
        { id: "c", zIndex: 2 },
      ]);
    });

    it("moves an element backward one position", () => {
      const result = reorderZIndex(elements, "c", "backward");
      expect(result).toEqual([
        { id: "a", zIndex: 0 },
        { id: "c", zIndex: 1 },
        { id: "b", zIndex: 2 },
      ]);
    });

    it("moves an element to front", () => {
      const result = reorderZIndex(elements, "a", "front");
      expect(result.find((r) => r.id === "a").zIndex).toBe(2);
    });

    it("moves an element to back", () => {
      const result = reorderZIndex(elements, "c", "back");
      expect(result.find((r) => r.id === "c").zIndex).toBe(0);
    });

    it("returns null when already at the front and moving forward", () => {
      expect(reorderZIndex(elements, "c", "forward")).toBeNull();
    });

    it("returns null when already at the back and moving backward", () => {
      expect(reorderZIndex(elements, "a", "backward")).toBeNull();
    });

    it("returns null for an unknown element id", () => {
      expect(reorderZIndex(elements, "does-not-exist", "forward")).toBeNull();
    });

    it("returns null for an unknown direction", () => {
      expect(reorderZIndex(elements, "a", "sideways")).toBeNull();
    });

    it("is a no-op (null) on a single-element list moved to front or back", () => {
      const single = [{ id: "only", zIndex: 0 }];
      expect(reorderZIndex(single, "only", "front")).toBeNull();
      expect(reorderZIndex(single, "only", "back")).toBeNull();
    });
  });

  describe("maxZIndex", () => {
    it("returns the highest zIndex among elements", () => {
      expect(maxZIndex([{ zIndex: 0 }, { zIndex: 5 }, { zIndex: 2 }])).toBe(5);
    });

    it("returns -1 for an empty list", () => {
      expect(maxZIndex([])).toBe(-1);
    });
  });
});
