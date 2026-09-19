import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DeckProvider, useDeck } from "./DeckContext";
import { createDeck, createSlide } from "./deckTypes";

function TestConsumer() {
  const { deck, dispatch } = useDeck();
  return (
    <div>
      <span data-testid="slide-count">{deck.slides.length}</span>
      <span data-testid="first-title">{deck.slides[0]?.content.title}</span>
      <button
        onClick={() =>
          dispatch({ type: "UPDATE_SLIDE_CONTENT", slideId: deck.slides[0].id, content: { title: "Changed" } })
        }
      >
        Change
      </button>
    </div>
  );
}

describe("DeckProvider / useDeck", () => {
  it("provides the initial deck and dispatches actions that update it", () => {
    const slide = createSlide({ layout: "title", content: { title: "Original" }, order: 0 });
    const initialDeck = createDeck({ title: "Deck", theme: "dark", slides: [slide] });

    render(
      <DeckProvider initialDeck={initialDeck}>
        <TestConsumer />
      </DeckProvider>
    );

    expect(screen.getByTestId("slide-count").textContent).toBe("1");
    expect(screen.getByTestId("first-title").textContent).toBe("Original");

    fireEvent.click(screen.getByText("Change"));

    expect(screen.getByTestId("first-title").textContent).toBe("Changed");
  });
});
