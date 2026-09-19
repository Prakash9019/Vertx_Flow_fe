import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RichText } from "./RichText";

describe("RichText", () => {
  it("renders the given value as HTML inside the requested element", () => {
    render(<RichText value="<b>Hello</b>" onChange={() => {}} as="h1" className="heading" />);
    const el = screen.getByText("Hello");
    expect(el.tagName).toBe("B");
    expect(el.closest("h1")).not.toBeNull();
    expect(el.closest("h1").className).toBe("heading");
  });

  it("does not throw when window.FroalaEditor is unavailable (e.g. in tests)", () => {
    expect(() =>
      render(<RichText value="<p>Text</p>" onChange={() => {}} as="div" />)
    ).not.toThrow();
  });
});
