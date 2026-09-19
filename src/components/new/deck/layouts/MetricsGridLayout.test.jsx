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
});
