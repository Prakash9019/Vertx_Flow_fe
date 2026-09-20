import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SlideCanvas, slideBackgroundStyle } from "./SlideCanvas";
import { DeckProvider, useDeck } from "./DeckContext";
import { createDeck, createSlide, createFreeElement } from "./deckTypes";
import { getTheme } from "./theme/themeTokens";

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

  it("falls back to the deck theme's default background when the slide has no override", () => {
    const slide = createSlide({ layout: "title", content: { title: "Hello Deck", subtitle: "" }, order: 0 });
    expect(slide.background).toBeNull();
    const deck = createDeck({ title: "Deck", theme: getTheme("dark"), slides: [slide] });
    render(
      <DeckProvider initialDeck={deck}>
        <Host />
      </DeckProvider>
    );
    expect(screen.getByTestId("slide-canvas")).toHaveStyle({ backgroundColor: getTheme("dark").defaultBackground.color });
  });

  it("an explicit per-slide background wins over the deck theme's default", () => {
    const slide = createSlide({
      layout: "title",
      content: { title: "Hello Deck", subtitle: "" },
      background: { kind: "solid", color: "#00ffcc" },
      order: 0,
    });
    const deck = createDeck({ title: "Deck", theme: getTheme("dark"), slides: [slide] });
    render(
      <DeckProvider initialDeck={deck}>
        <Host />
      </DeckProvider>
    );
    expect(screen.getByTestId("slide-canvas")).toHaveStyle({ backgroundColor: "#00ffcc" });
  });

  it("renders a video element for a media/video background", () => {
    const slide = createSlide({
      layout: "title",
      content: { title: "Hello Deck", subtitle: "" },
      background: { kind: "media", type: "video", url: "https://example.com/bg.mp4" },
      order: 0,
    });
    renderSlide(slide);
    const video = screen.getByTestId("slide-background-video");
    expect(video.tagName).toBe("VIDEO");
    expect(video).toHaveAttribute("src", "https://example.com/bg.mp4");
  });

  it("renders a color overlay layer when the background has one, independent of its kind", () => {
    const slide = createSlide({
      layout: "title",
      content: { title: "Hello Deck", subtitle: "" },
      background: { kind: "image", url: "https://example.com/bg.png", overlay: { color: "#000000", opacity: 0.5 } },
      order: 0,
    });
    renderSlide(slide);
    const overlay = screen.getByTestId("slide-background-overlay");
    expect(overlay).toHaveStyle({ backgroundColor: "#000000" });
    expect(overlay.style.opacity).toBe("0.5");
  });

  it("renders no overlay layer when the background has none", () => {
    const slide = createSlide({
      layout: "title",
      content: { title: "Hello Deck", subtitle: "" },
      background: { kind: "solid", color: "#fff" },
      order: 0,
    });
    renderSlide(slide);
    expect(screen.queryByTestId("slide-background-overlay")).toBeNull();
  });

  it("remounts the layout when navigating to a different slide sharing the same layout type", () => {
    const slideOne = createSlide({ layout: "title", content: { title: "Slide One", subtitle: "" }, order: 0 });
    const slideTwo = createSlide({ layout: "title", content: { title: "Slide Two", subtitle: "" }, order: 1 });

    function TwoSlideHost({ index }) {
      const { deck } = useDeck();
      return <SlideCanvas slide={deck.slides[index]} />;
    }

    const deck = createDeck({ title: "Deck", theme: "dark", slides: [slideOne, slideTwo] });
    const { rerender } = render(
      <DeckProvider initialDeck={deck}>
        <TwoSlideHost index={0} />
      </DeckProvider>
    );
    expect(screen.getByText("Slide One")).toBeInTheDocument();

    rerender(
      <DeckProvider initialDeck={deck}>
        <TwoSlideHost index={1} />
      </DeckProvider>
    );

    expect(screen.queryByText("Slide One")).toBeNull();
    expect(screen.getByText("Slide Two")).toBeInTheDocument();
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
