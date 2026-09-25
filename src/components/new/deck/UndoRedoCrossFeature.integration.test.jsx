import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DeckProvider, useDeck } from "./DeckContext";
import { createDeck, createSlide } from "./deckTypes";
import { getTheme } from "./theme/themeTokens";

// Regression coverage for how undo/redo interacts with the other
// "whole-deck" actions (theme change, background change) that - unlike a
// drag/resize/rotate - are never coalesced, so each one should always
// produce its own undo step, and undoing one must not disturb unrelated
// slide content or a separately-made background/content change.
function Host() {
  const { deck, dispatch, undo, redo, canUndo, canRedo } = useDeck();
  const slide = deck.slides[0];
  return (
    <div>
      <span data-testid="theme-id">{deck.theme.id}</span>
      <span data-testid="bg-color">{slide.background?.color ?? "inherit"}</span>
      <span data-testid="heading">{slide.content.heading}</span>
      <span data-testid="can-undo">{String(canUndo)}</span>
      <span data-testid="can-redo">{String(canRedo)}</span>
      <button onClick={() => dispatch({ type: "SET_DECK_THEME", theme: getTheme("dark") })}>Set Dark Theme</button>
      <button onClick={() => dispatch({ type: "SET_DECK_THEME", theme: getTheme("bold") })}>Set Bold Theme</button>
      <button
        onClick={() =>
          dispatch({ type: "SET_SLIDE_BACKGROUND", slideId: slide.id, background: { kind: "solid", color: "#ff0000" } })
        }
      >
        Set Red Background
      </button>
      <button onClick={() => dispatch({ type: "SET_SLIDE_BACKGROUND", slideId: slide.id, background: null })}>
        Clear Background
      </button>
      <button onClick={() => dispatch({ type: "UPDATE_SLIDE_CONTENT", slideId: slide.id, content: { heading: "Edited" } })}>
        Edit Content
      </button>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
    </div>
  );
}

function renderHost() {
  const slide = createSlide({ layout: "problem", content: { heading: "Original", body: "" }, order: 0 });
  const deck = createDeck({ title: "Deck", theme: getTheme("default"), slides: [slide] });
  return render(
    <DeckProvider initialDeck={deck}>
      <Host />
    </DeckProvider>
  );
}

describe("Undo/redo across theme, background, and content changes (integration)", () => {
  it("undoes a theme change independently, leaving content untouched", () => {
    renderHost();
    expect(screen.getByTestId("theme-id").textContent).toBe("default");

    fireEvent.click(screen.getByText("Set Dark Theme"));
    expect(screen.getByTestId("theme-id").textContent).toBe("dark");
    expect(screen.getByTestId("heading").textContent).toBe("Original");

    fireEvent.click(screen.getByText("Undo"));
    expect(screen.getByTestId("theme-id").textContent).toBe("default");
  });

  it("undoes a background change independently of a theme change made before it", () => {
    renderHost();
    fireEvent.click(screen.getByText("Set Dark Theme"));
    fireEvent.click(screen.getByText("Set Red Background"));
    expect(screen.getByTestId("bg-color").textContent).toBe("#ff0000");
    expect(screen.getByTestId("theme-id").textContent).toBe("dark");

    fireEvent.click(screen.getByText("Undo")); // undoes only the background change
    expect(screen.getByTestId("bg-color").textContent).toBe("inherit");
    expect(screen.getByTestId("theme-id").textContent).toBe("dark"); // theme change survives

    fireEvent.click(screen.getByText("Undo")); // now undoes the theme change
    expect(screen.getByTestId("theme-id").textContent).toBe("default");
  });

  it("a content edit after undoing a theme change clears redo (standard branching-history behavior)", () => {
    renderHost();
    fireEvent.click(screen.getByText("Set Dark Theme"));
    fireEvent.click(screen.getByText("Undo"));
    expect(screen.getByTestId("can-redo").textContent).toBe("true");

    fireEvent.click(screen.getByText("Edit Content"));
    expect(screen.getByTestId("can-redo").textContent).toBe("false");
    expect(screen.getByTestId("theme-id").textContent).toBe("default");
    expect(screen.getByTestId("heading").textContent).toBe("Edited");
  });

  it("redo restores a theme change after undo, then a further theme change starts a fresh step", () => {
    renderHost();
    fireEvent.click(screen.getByText("Set Dark Theme"));
    fireEvent.click(screen.getByText("Undo"));
    fireEvent.click(screen.getByText("Redo"));
    expect(screen.getByTestId("theme-id").textContent).toBe("dark");

    fireEvent.click(screen.getByText("Set Bold Theme"));
    expect(screen.getByTestId("theme-id").textContent).toBe("bold");
    fireEvent.click(screen.getByText("Undo"));
    expect(screen.getByTestId("theme-id").textContent).toBe("dark");
  });

  it("interleaves content edits and background changes across multiple undo steps in the correct order", () => {
    renderHost();
    fireEvent.click(screen.getByText("Edit Content")); // step 1: heading -> Edited
    fireEvent.click(screen.getByText("Set Red Background")); // step 2
    fireEvent.click(screen.getByText("Clear Background")); // step 3

    expect(screen.getByTestId("bg-color").textContent).toBe("inherit");
    expect(screen.getByTestId("heading").textContent).toBe("Edited");

    fireEvent.click(screen.getByText("Undo")); // undo step 3 -> red background back
    expect(screen.getByTestId("bg-color").textContent).toBe("#ff0000");

    fireEvent.click(screen.getByText("Undo")); // undo step 2 -> no background
    expect(screen.getByTestId("bg-color").textContent).toBe("inherit");
    expect(screen.getByTestId("heading").textContent).toBe("Edited");

    fireEvent.click(screen.getByText("Undo")); // undo step 1 -> original heading
    expect(screen.getByTestId("heading").textContent).toBe("Original");
    expect(screen.getByTestId("can-undo").textContent).toBe("false");
  });
});
