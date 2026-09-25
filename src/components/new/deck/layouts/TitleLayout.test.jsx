import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TitleLayout, defaultTitleContent } from "./TitleLayout";

describe("defaultTitleContent", () => {
  it("returns a title and empty subtitle", () => {
    expect(defaultTitleContent()).toEqual({ title: "Title Only", subtitle: "" });
  });
});

describe("TitleLayout", () => {
  it("renders the title and subtitle from content", () => {
    render(<TitleLayout content={{ title: "Vertx Flow", subtitle: "Pitch better" }} onChangeContent={() => {}} />);
    expect(screen.getByText("Vertx Flow")).toBeInTheDocument();
    expect(screen.getByText("Pitch better")).toBeInTheDocument();
  });

  it("does not render a subtitle element when subtitle is empty", () => {
    const { container } = render(<TitleLayout content={{ title: "Vertx Flow", subtitle: "" }} onChangeContent={() => {}} />);
    expect(container.querySelector('[data-field="subtitle"]')).toBeNull();
  });

  it("sizes the heading/subtitle fonts off the theme's scale tokens, not a fixed class", () => {
    render(<TitleLayout content={{ title: "Vertx Flow", subtitle: "Pitch better" }} onChangeContent={() => {}} />);
    expect(screen.getByText("Vertx Flow").style.fontSize).toBe("calc(4.5rem * var(--theme-heading-scale, 1))");
    expect(screen.getByText("Pitch better").style.fontSize).toBe("calc(1.5rem * var(--theme-body-scale, 1))");
  });
});
