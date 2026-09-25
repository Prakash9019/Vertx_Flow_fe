import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DeckListPage from "./DeckListPage";
import deckApi from "../../utils/deckApi";
import { TEMPLATE_LIBRARY } from "./deck/templateLibrary";

vi.mock("../../utils/deckApi", () => ({
  default: {
    getDecks: vi.fn(() => Promise.resolve({ data: { data: [] } })),
    createDeck: vi.fn(),
    deleteDeck: vi.fn(),
  },
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <DeckListPage />
    </MemoryRouter>
  );
}

describe("DeckListPage - Start from Template", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deckApi.getDecks.mockResolvedValue({ data: { data: [] } });
  });

  it("opens the template gallery and creates a deck from the picked template", async () => {
    deckApi.createDeck.mockResolvedValue({ data: { data: { _id: "deck-1" } } });
    renderPage();

    await waitFor(() => expect(screen.queryByText(/loading decks/i)).not.toBeInTheDocument());

    fireEvent.click(screen.getByText("Start from Template"));
    expect(screen.getByText(TEMPLATE_LIBRARY[0].name)).toBeInTheDocument();

    fireEvent.click(screen.getByText(TEMPLATE_LIBRARY[0].name));

    await waitFor(() => expect(deckApi.createDeck).toHaveBeenCalledTimes(1));
    expect(deckApi.createDeck.mock.calls[0][0].title).toBe(TEMPLATE_LIBRARY[0].name);
  });
});
