import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { FreeElementLayer } from "./FreeElementLayer";

describe("FreeElementLayer", () => {
  it("positions each element by percentage and stacks by zIndex", () => {
    const elements = [
      { id: "b", type: "text", x: 10, y: 20, w: 30, h: 5, rotation: 0, zIndex: 2, locked: false, props: { html: "Back" } },
      { id: "a", type: "text", x: 0, y: 0, w: 10, h: 5, rotation: 0, zIndex: 1, locked: false, props: { html: "Front" } },
    ];
    const { container } = render(<FreeElementLayer elements={elements} onUpdateElement={() => {}} />);
    const nodes = container.querySelectorAll("[data-element-id]");
    expect(nodes).toHaveLength(2);
    expect(nodes[0].dataset.elementId).toBe("a");
    expect(nodes[0].style.left).toBe("0%");
    expect(nodes[0].style.top).toBe("0%");
    expect(nodes[0].style.width).toBe("10%");
    expect(nodes[0].style.zIndex).toBe("1");
    expect(nodes[1].dataset.elementId).toBe("b");
    expect(nodes[1].style.zIndex).toBe("2");
  });

  it("renders an image element's src from props", () => {
    const elements = [
      { id: "img1", type: "image", x: 0, y: 0, w: 20, h: 20, rotation: 0, zIndex: 0, locked: false, props: { src: "https://example.com/x.png" } },
    ];
    const { getByRole } = render(<FreeElementLayer elements={elements} onUpdateElement={() => {}} />);
    expect(getByRole("img")).toHaveAttribute("src", "https://example.com/x.png");
  });

  it("renders a placeholder with data-type for shape/divider/icon elements", () => {
    const elements = [
      { id: "s1", type: "shape", x: 0, y: 0, w: 10, h: 10, rotation: 0, zIndex: 0, locked: false, props: {} },
    ];
    const { container } = render(<FreeElementLayer elements={elements} onUpdateElement={() => {}} />);
    expect(container.querySelector('[data-element-id="s1"]').dataset.type).toBe("shape");
  });
});
