import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProblemLayout, defaultProblemContent } from "./ProblemLayout";

describe("defaultProblemContent", () => {
  it("returns a heading and placeholder body", () => {
    const content = defaultProblemContent();
    expect(content.heading).toBe("The Problem");
    expect(content.body).toContain("Describe the problem");
  });
});

describe("ProblemLayout", () => {
  it("renders heading and body from content", () => {
    render(<ProblemLayout content={{ heading: "The Problem", body: "<p>Users churn fast.</p>" }} onChangeContent={() => {}} />);
    expect(screen.getByText("The Problem")).toBeInTheDocument();
    expect(screen.getByText("Users churn fast.")).toBeInTheDocument();
  });

  it("sizes the heading/body fonts off the theme's scale tokens, not a fixed class", () => {
    render(<ProblemLayout content={{ heading: "The Problem", body: "<p>Users churn fast.</p>" }} onChangeContent={() => {}} />);
    expect(screen.getByText("The Problem").style.fontSize).toBe("calc(3rem * var(--theme-heading-scale, 1))");
    // "Users churn fast." sits inside the RichText field's own <p> (from its
    // html value); the fontSize style lives on the wrapping "div" RichText
    // itself renders as, one level up.
    expect(screen.getByText("Users churn fast.").closest("div").style.fontSize).toBe(
      "calc(1.25rem * var(--theme-body-scale, 1))"
    );
  });
});
