import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SlideThumbnail } from "./SlideThumbnail";
import { createSlide, createFreeElement } from "./deckTypes";

describe("SlideThumbnail", () => {
  it("renders the slide's own text content for its layout, not hardcoded content", () => {
    const slide = createSlide({ layout: "title", content: { title: "Q3 Fundraise", subtitle: "Series A" }, order: 0 });
    render(<SlideThumbnail slide={slide} />);
    expect(screen.getByText("Q3 Fundraise")).toBeInTheDocument();
    expect(screen.getByText("Series A")).toBeInTheDocument();
  });

  it("updates when given a different slide's content", () => {
    const slide = createSlide({ layout: "cta", content: { heading: "Join Us", body: "", buttonLabel: "" }, order: 0 });
    const { rerender } = render(<SlideThumbnail slide={slide} />);
    expect(screen.getByText("Join Us")).toBeInTheDocument();

    const nextSlide = { ...slide, content: { ...slide.content, heading: "Let's Talk" } };
    rerender(<SlideThumbnail slide={nextSlide} />);
    expect(screen.getByText("Let's Talk")).toBeInTheDocument();
    expect(screen.queryByText("Join Us")).not.toBeInTheDocument();
  });

  it("renders free elements positioned from the same slide data", () => {
    const element = createFreeElement({ type: "text", x: 10, y: 20, w: 30, h: 5, props: { html: "Overlay note" } });
    const slide = createSlide({
      layout: "title",
      content: { title: "Title", subtitle: "" },
      freeElements: [element],
      order: 0,
    });
    render(<SlideThumbnail slide={slide} />);
    expect(screen.getByText("Overlay note")).toBeInTheDocument();
  });

  it("renders a placeholder box when given no slide", () => {
    const { container } = render(<SlideThumbnail slide={null} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
