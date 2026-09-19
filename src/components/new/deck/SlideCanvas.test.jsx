import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SlideCanvas } from "./SlideCanvas";
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
