import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import EditorPage from "./EditorPage";
import deckApi from "../../utils/deckApi";
import { createDeck, createSlide } from "./deck/deckTypes";
import { getTheme, DEFAULT_THEME_ID } from "./deck/theme/themeTokens";
import { defaultTitleContent } from "./deck/layouts/TitleLayout";

// EditorPage.jsx composes DeckProvider/useDeckLoader/useAutosave/SlideSidebar/
// SlideCanvas into two routes (no-id demo deck vs. /editor/:deckId persisted
// deck). Everything it composes has its own unit/integration tests; this
// file covers the composition itself - routing to loading/error/ready
// states, and that the no-id route never touches the backend.
vi.mock("../../utils/deckApi", () => ({
  default: {
    getDeck: vi.fn(),
    updateDeck: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

function renderAtDemoRoute() {
  return render(
    <MemoryRouter initialEntries={["/editorPage"]}>
      <Routes>
        <Route path="/editorPage" element={<EditorPage />} />
        <Route path="/editor/:deckId" element={<EditorPage />} />
      </Routes>
    </MemoryRouter>
  );
}

function renderAtDeckRoute(deckId) {
  return render(
    <MemoryRouter initialEntries={[`/editor/${deckId}`]}>
      <Routes>
        <Route path="/editorPage" element={<EditorPage />} />
        <Route path="/editor/:deckId" element={<EditorPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("EditorPage", () => {
  // jsdom doesn't implement scrollIntoView; SlideSidebar calls it to keep
  // the active thumbnail visible.
  beforeAll(() => {
    Element.prototype.scrollIntoView = () => {};
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("no-id demo route renders the seeded 7-slide deck without hitting the backend", () => {
    renderAtDemoRoute();

    expect(deckApi.getDeck).not.toHaveBeenCalled();
    expect(document.querySelectorAll("[data-slide-id]")).toHaveLength(7);
  });

  it("/editor/:deckId shows a loading state, then renders the loaded deck's slides", async () => {
    const deck = createDeck({
      title: "Saved Deck",
      theme: getTheme(DEFAULT_THEME_ID),
      slides: [createSlide({ layout: "title", content: defaultTitleContent(), order: 0 })],
    });
    deckApi.getDeck.mockResolvedValue({ data: { data: deck } });

    renderAtDeckRoute("deck-1");

    expect(screen.getByText(/loading deck/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(document.querySelectorAll("[data-slide-id]")).toHaveLength(1);
    });
    expect(deckApi.getDeck).toHaveBeenCalledWith("deck-1");
  });

  it("/editor/:deckId shows an error state when the load fails", async () => {
    deckApi.getDeck.mockRejectedValue(new Error("network down"));

    renderAtDeckRoute("deck-2");

    await waitFor(() => {
      expect(screen.getByText(/couldn't load this deck/i)).toBeInTheDocument();
    });
    expect(screen.getByText("network down")).toBeInTheDocument();
  });
});
