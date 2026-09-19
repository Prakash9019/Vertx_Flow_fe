import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SlideCanvas, slideBackgroundStyle } from "./SlideCanvas";
import { DeckProvider, useDeck } from "./DeckContext";
import { createDeck, createSlide, createFreeElement } from "./deckTypes";

function Host() {
  const { deck } = useDeck();
  return <SlideCanvas slide={deck.slides[0]} />;
}

function renderSlide(slide) {
  const deck = createDeck({ title: "Deck", theme: "dark", slides: [slide] });
  return render(
    <DeckProvider initialDeck={deck}>
      <Host />
    </DeckProvider>
  );
}

describe("SlideCanvas", () => {
  it("renders the registered layout component for the slide's layout", () => {
    const slide = createSlide({ layout: "title", content: { title: "Hello Deck", subtitle: "" }, order: 0 });
    renderSlide(slide);
    expect(screen.getByText("Hello Deck")).toBeInTheDocument();
  });

  it("renders freeElements on top of the layout", () => {
    const element = createFreeElement({ type: "text", x: 0, y: 0, w: 10, h: 10, props: { html: "Overlay" } });
    const slide = createSlide({
      layout: "title",
      content: { title: "Hello Deck", subtitle: "" },
      freeElements: [element],
      order: 0,
    });
    renderSlide(slide);
    expect(screen.getByText("Overlay")).toBeInTheDocument();
  });

  it("applies the slide's own background to the slide box", () => {
    const slide = createSlide({
      layout: "title",
      content: { title: "Hello Deck", subtitle: "" },
      background: { kind: "solid", color: "#ff0000" },
      order: 0,
    });
    renderSlide(slide);
    expect(screen.getByTestId("slide-canvas")).toHaveStyle({ backgroundColor: "#ff0000" });
  });

  it("warns and renders nothing for an unknown layout instead of throwing", () => {
    const slide = createSlide({ layout: "not-a-layout", content: {}, order: 0 });
    const warn = vi.fn();
    const originalWarn = console.warn;
    console.warn = warn;
    const { container } = renderSlide(slide);
    console.warn = originalWarn;
    expect(warn).toHaveBeenCalled();
    expect(container.querySelector("[data-element-id]")).toBeNull();
  });
});

describe("slideBackgroundStyle", () => {
  it("maps each SlideBackground kind to a style, and unknown/absent to nothing", () => {
    expect(slideBackgroundStyle({ kind: "solid", color: "#123456" })).toEqual({ backgroundColor: "#123456" });
    expect(slideBackgroundStyle({ kind: "gradient", stops: ["#000", "#fff"], angle: 90 })).toEqual({
      backgroundImage: "linear-gradient(90deg, #000, #fff)",
    });
    expect(slideBackgroundStyle({ kind: "image", url: "a.png", fit: "contain" })).toMatchObject({
      backgroundImage: "url(a.png)",
      backgroundSize: "contain",
    });
    expect(slideBackgroundStyle(undefined)).toEqual({});
    expect(slideBackgroundStyle({ kind: "nope" })).toEqual({});
  });
});
