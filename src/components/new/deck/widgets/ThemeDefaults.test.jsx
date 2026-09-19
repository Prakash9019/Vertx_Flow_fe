import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TextWidget } from "./TextWidget";
import { ShapeWidget } from "./ShapeWidget";
import { DividerWidget } from "./DividerWidget";
import { IconWidget } from "./IconWidget";
import { createWidget } from "../freeElementFactory";

describe("widgets default to theme CSS variables when no explicit style is set", () => {
  it("TextWidget defaults color/font to theme vars", () => {
    const element = { props: { html: "hi" } };
    const { container } = render(<TextWidget element={element} editing={false} onCommit={() => {}} />);
    const div = container.firstChild;
    expect(div.style.color).toBe("var(--theme-text)");
    expect(div.style.fontFamily).toBe("var(--theme-body-font)");
  });

  it("TextWidget keeps an explicit color/font override", () => {
    const element = { props: { html: "hi", color: "#ff0000", fontFamily: "Comic Sans MS" } };
    const { container } = render(<TextWidget element={element} editing={false} onCommit={() => {}} />);
    const div = container.firstChild;
    expect(getComputedStyle(div).color).toBe("rgb(255, 0, 0)");
    expect(getComputedStyle(div).fontFamily).toContain("Comic Sans MS");
  });

  it("ShapeWidget defaults fill to the theme accent var", () => {
    const element = { props: { shape: "rectangle" } };
    const { container } = render(<ShapeWidget element={element} />);
    expect(container.firstChild.style.backgroundColor).toBe("var(--theme-accent)");
  });

  it("ShapeWidget keeps an explicit fill override", () => {
    const element = { props: { shape: "rectangle", fill: "#123456" } };
    const { container } = render(<ShapeWidget element={element} />);
    expect(getComputedStyle(container.firstChild).backgroundColor).toBe("rgb(18, 52, 86)");
  });

  it("DividerWidget defaults color to the theme border var", () => {
    const element = { props: {} };
    const { container } = render(<DividerWidget element={element} />);
    expect(container.firstChild.firstChild.style.backgroundColor).toBe("var(--theme-border)");
  });

  it("IconWidget defaults color to the theme accent var", () => {
    const element = { props: { icon: "Star" } };
    const { container } = render(<IconWidget element={element} />);
    expect(container.firstChild.style.color).toBe("var(--theme-accent)");
  });

  it("createWidget no longer bakes a hardcoded color/fill into new shape/divider/icon elements", () => {
    expect(createWidget("shape").props.fill).toBeUndefined();
    expect(createWidget("divider").props.color).toBeUndefined();
    expect(createWidget("icon").props.color).toBeUndefined();
  });
});
