import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { FreeElementLayer } from "./FreeElementLayer";

// Regression coverage for wiring FreeElementLayer -> FreeElementRenderer -> the
// theme-aware widgets, replacing the old inline `ElementContent` render path
// that bypassed them entirely.
describe("FreeElementLayer live render path uses theme-aware widgets", () => {
  it("renders a shape/divider/icon element with no explicit color via its theme CSS var, not the old dashed placeholder", () => {
    const elements = [
      { id: "shape-1", type: "shape", x: 0, y: 0, w: 10, h: 10, rotation: 0, zIndex: 0, locked: false, props: {} },
      { id: "divider-1", type: "divider", x: 20, y: 0, w: 10, h: 2, rotation: 0, zIndex: 0, locked: false, props: {} },
      { id: "icon-1", type: "icon", x: 40, y: 0, w: 10, h: 10, rotation: 0, zIndex: 0, locked: false, props: { icon: "Star" } },
    ];
    const { container } = render(<FreeElementLayer elements={elements} onUpdateElement={() => {}} />);

    const shapeWrapper = container.querySelector('[data-element-id="shape-1"]');
    expect(shapeWrapper.querySelector("div").style.backgroundColor).toBe("var(--theme-accent)");
    expect(shapeWrapper.querySelector(".border-dashed")).toBeNull();

    const dividerWrapper = container.querySelector('[data-element-id="divider-1"]');
    expect(dividerWrapper.querySelector('[style*="background-color"]').style.backgroundColor).toBe(
      "var(--theme-border)"
    );

    const iconWrapper = container.querySelector('[data-element-id="icon-1"]');
    expect(iconWrapper.querySelector("div").style.color).toBe("var(--theme-accent)");
  });

  it("preserves an explicit shape fill and text color through the live render path across a theme change", () => {
    const elements = [
      { id: "shape-2", type: "shape", x: 0, y: 0, w: 10, h: 10, rotation: 0, zIndex: 0, locked: false, props: { fill: "#123456" } },
      { id: "text-2", type: "text", x: 20, y: 0, w: 10, h: 10, rotation: 0, zIndex: 0, locked: false, props: { html: "hi", color: "#ff0000" } },
    ];

    const { container, rerender } = render(<FreeElementLayer elements={elements} onUpdateElement={() => {}} />);
    const shapeWrapper = container.querySelector('[data-element-id="shape-2"]');
    const textWrapper = container.querySelector('[data-element-id="text-2"]');
    expect(getComputedStyle(shapeWrapper.querySelector("div")).backgroundColor).toBe("rgb(18, 52, 86)");
    expect(getComputedStyle(textWrapper.querySelector("div")).color).toBe("rgb(255, 0, 0)");

    // Simulate a theme change: only the ambient --theme-* CSS vars would change
    // (via the root wrapper's inline style in the real app), never the
    // elements' own props, so a re-render with unchanged elements must keep
    // rendering the exact same explicit overrides.
    rerender(<FreeElementLayer elements={elements} onUpdateElement={() => {}} />);
    expect(getComputedStyle(shapeWrapper.querySelector("div")).backgroundColor).toBe("rgb(18, 52, 86)");
    expect(getComputedStyle(textWrapper.querySelector("div")).color).toBe("rgb(255, 0, 0)");
  });
});
