import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ChartWidget } from "./ChartWidget";

describe("ChartWidget", () => {
  it("renders one bar per data point, sized proportionally to its value", () => {
    const element = { props: { data: [{ label: "A", value: 25 }, { label: "B", value: 100 }] } };
    const { container, getByText } = render(<ChartWidget element={element} />);

    const bars = container.querySelectorAll("[data-chart-bar]");
    expect(bars).toHaveLength(2);
    expect(bars[0].style.height).toBe("25%");
    expect(bars[1].style.height).toBe("100%");
    expect(getByText("A")).toBeInTheDocument();
    expect(getByText("B")).toBeInTheDocument();
  });

  it("defaults bar color to the theme primary token", () => {
    const element = { props: { data: [{ label: "A", value: 10 }] } };
    const { container } = render(<ChartWidget element={element} />);
    expect(container.querySelector("[data-chart-bar]").style.backgroundColor).toBe("var(--theme-primary)");
  });

  it("keeps an explicit color override", () => {
    const element = { props: { data: [{ label: "A", value: 10 }], color: "#ff0000" } };
    const { container } = render(<ChartWidget element={element} />);
    expect(container.querySelector("[data-chart-bar]").style.backgroundColor).toBe("rgb(255, 0, 0)");
  });
});
