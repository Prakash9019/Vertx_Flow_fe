import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { DeckProvider, useDeck } from "./DeckContext";
import { useAutosave } from "./useAutosave";
import { createDeck, createSlide } from "./deckTypes";
import deckApi from "../../../utils/deckApi";

vi.mock("../../../utils/deckApi", () => ({
  default: { updateDeck: vi.fn() },
}));

// Real-stack coverage (DeckProvider -> useDeckHistory/deckReducer) for two
// claims useAutosave's own isolated unit tests can't make on their own,
// since they drive the hook directly with hand-built `deck` props rather
// than through an actual dispatch/undo cycle:
//   1. autosave stays silent through the initial load AND through every
//      no-op/invalid dispatch that deckReducer bounces back as the same
//      `deck` reference (deckReducer returns the identical object for an
//      unknown/invalid action - useDeckHistory doesn't even create a new
//      history entry for it, so `deck` here never changes reference either).
//   2. autosave resumes correctly after an undo - an undo is "just another
//      deck change" to useAutosave (it only watches the `deck` reference),
//      so the reverted state must be saved like any other edit, not
//      swallowed because it came from history rather than a dispatch.
function Host({ deckId }) {
  const { deck, dispatch, undo } = useDeck();
  const status = useAutosave(deckId, deck, { delay: 10 });
  const slide = deck.slides[0];
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="heading">{slide.content.heading}</span>
      <button onClick={() => dispatch({ type: "UPDATE_SLIDE_CONTENT", slideId: slide.id, content: { heading: "Edited" } })}>
        Edit
      </button>
      <button onClick={() => dispatch({ type: "UPDATE_SLIDE_CONTENT", slideId: "does-not-exist", content: { heading: "x" } })}>
        Invalid Dispatch
      </button>
      <button onClick={undo}>Undo</button>
    </div>
  );
}

function renderHost(deckId = "deck-1") {
  const slide = createSlide({ layout: "problem", content: { heading: "Original", body: "" }, order: 0 });
  const deck = createDeck({ title: "Deck", theme: "dark", slides: [slide] });
  return render(
    <DeckProvider initialDeck={deck}>
      <Host deckId={deckId} />
    </DeckProvider>
  );
}

describe("Autosave + undo (integration)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    deckApi.updateDeck.mockReset();
    deckApi.updateDeck.mockResolvedValue({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not save on initial mount, and does not save for an invalid/no-op dispatch", () => {
    renderHost();
    act(() => vi.advanceTimersByTime(500));
    expect(deckApi.updateDeck).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText("Invalid Dispatch")); // deckReducer warns and returns the same deck reference
    act(() => vi.advanceTimersByTime(500));
    expect(deckApi.updateDeck).not.toHaveBeenCalled();
  });

  it("saves a real edit, then resumes saving correctly after an undo reverts it", async () => {
    renderHost();
    act(() => vi.advanceTimersByTime(500)); // consume the initial-load skip

    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByTestId("heading").textContent).toBe("Edited");
    act(() => vi.advanceTimersByTime(10));
    expect(deckApi.updateDeck).toHaveBeenCalledTimes(1);
    expect(deckApi.updateDeck.mock.calls[0][1]).toEqual(
      expect.objectContaining({ slides: expect.arrayContaining([expect.objectContaining({ content: expect.objectContaining({ heading: "Edited" }) })]) })
    );

    fireEvent.click(screen.getByText("Undo"));
    expect(screen.getByTestId("heading").textContent).toBe("Original");
    act(() => vi.advanceTimersByTime(10));

    // The undo is a genuine deck change (new `present` reference) - autosave
    // must fire again and persist the reverted content, not silently skip it.
    expect(deckApi.updateDeck).toHaveBeenCalledTimes(2);
    expect(deckApi.updateDeck.mock.calls[1][1]).toEqual(
      expect.objectContaining({ slides: expect.arrayContaining([expect.objectContaining({ content: expect.objectContaining({ heading: "Original" }) })]) })
    );
  });

  it("does not resave on the next mount's initial load after switching deckId", () => {
    const { rerender } = renderHost("deck-1");
    act(() => vi.advanceTimersByTime(500));

    // Simulate navigating to a different deck (a fresh DeckProvider + new deckId).
    const slide2 = createSlide({ layout: "problem", content: { heading: "Deck 2", body: "" }, order: 0 });
    const deck2 = createDeck({ title: "Deck 2", theme: "dark", slides: [slide2] });
    rerender(
      <DeckProvider initialDeck={deck2}>
        <Host deckId="deck-2" />
      </DeckProvider>
    );
    act(() => vi.advanceTimersByTime(500));
    expect(deckApi.updateDeck).not.toHaveBeenCalled();
  });
});
