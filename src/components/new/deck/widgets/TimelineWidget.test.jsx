import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TimelineWidget } from "./TimelineWidget";

describe("TimelineWidget", () => {
  it("renders a marker with label and date for every item", () => {
    const element = {
      props: {
        items: [
          { label: "Founded", date: "2020", description: "" },
          { label: "Series A", date: "2022", description: "" },
        ],
      },
    };
    const { container, getByText: findText } = render(<TimelineWidget element={element} />);

    expect(container.querySelectorAll("[data-timeline-item]")).toHaveLength(2);
    expect(findText("Founded")).toBeInTheDocument();
    expect(findText("2020")).toBeInTheDocument();
    expect(findText("Series A")).toBeInTheDocument();
  });

  it("defaults marker color to the theme accent token", () => {
    const element = { props: { items: [{ label: "A", date: "", description: "" }] } };
    const { container } = render(<TimelineWidget element={element} />);
    expect(container.querySelector("[data-timeline-marker]").style.backgroundColor).toBe("var(--theme-accent)");
  });
});
