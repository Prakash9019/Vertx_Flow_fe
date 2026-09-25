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
});
