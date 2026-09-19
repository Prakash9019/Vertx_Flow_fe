import { describe, it, expect, vi } from "vitest";
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
});
