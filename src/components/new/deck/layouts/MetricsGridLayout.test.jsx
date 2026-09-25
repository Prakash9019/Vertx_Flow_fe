import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricsGridLayout, defaultMetricsGridContent } from "./MetricsGridLayout";

describe("defaultMetricsGridContent", () => {
  it("returns a heading and 3 zeroed metrics", () => {
    const content = defaultMetricsGridContent();
    expect(content.heading).toBe("Metrics & Traction");
    expect(content.metrics).toHaveLength(3);
  });
});

describe("MetricsGridLayout", () => {
  it("renders every metric's value and label", () => {
    const content = {
      heading: "Metrics & Traction",
      metrics: [
        { value: "120%", label: "YoY growth" },
        { value: "40k", label: "Active users" },
      ],
    };
    render(<MetricsGridLayout content={content} onChangeContent={() => {}} />);
    expect(screen.getByText("120%")).toBeInTheDocument();
    expect(screen.getByText("YoY growth")).toBeInTheDocument();
    expect(screen.getByText("40k")).toBeInTheDocument();
    expect(screen.getByText("Active users")).toBeInTheDocument();
  });

  it("sizes the heading/metric-value fonts off the theme's scale tokens, not a fixed class", () => {
    const content = {
      heading: "Metrics & Traction",
      metrics: [{ value: "120%", label: "YoY growth" }],
    };
    render(<MetricsGridLayout content={content} onChangeContent={() => {}} />);
    expect(screen.getByText("Metrics & Traction").style.fontSize).toBe("calc(2.25rem * var(--theme-heading-scale, 1))");
    expect(screen.getByText("120%").style.fontSize).toBe("calc(3rem * var(--theme-heading-scale, 1))");
  });
});
