import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
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

  it("lets the user change the current slide's layout, preserving carried-over content", () => {
    renderAtDemoRoute();

    // Slide 2 is "problem" ({ heading: "The Problem", body: "..." }) in the
    // seed deck. The bottom toolbar (Layout/Remix/etc.) only renders once
    // past the first slide.
    fireEvent.click(screen.getByTitle("Slide 2"));

    fireEvent.click(screen.getByRole("button", { name: /layout/i }));
    expect(screen.getByText(/change layout/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /call to action/i }));

    // "cta" has no button-label concept in the semantic model, so it always
    // gets its own default - proof the layout actually switched. Scoped to
    // the active slide canvas since the sidebar thumbnail also previews
    // slide content.
    const activeCanvas = document.querySelectorAll('[data-testid="slide-canvas"]')[1];
    expect(within(activeCanvas).getByText(/get in touch/i)).toBeInTheDocument();
    // "problem"'s heading has a direct semantic equivalent in "cta" and
    // should carry over rather than reset to a placeholder.
    expect(within(activeCanvas).getByText("The Problem")).toBeInTheDocument();
  });

  it("lets the user insert a new free element (including a newly added widget type) onto the current slide", () => {
    renderAtDemoRoute();

    fireEvent.click(screen.getByTitle("Slide 2"));
    fireEvent.click(screen.getByRole("button", { name: /^elements$/i }));
    fireEvent.click(screen.getByTitle("Chart"));

    expect(document.querySelector('[data-type="chart"]')).toBeTruthy();
  });

  it("commits an in-progress free-text edit before the user navigates to a different slide, even without a blur", () => {
    renderAtDemoRoute();

    fireEvent.click(screen.getByTitle("Slide 2"));
    fireEvent.click(screen.getByRole("button", { name: /^elements$/i }));
    fireEvent.click(screen.getByTitle("Text"));

    const wrapper = document.querySelector('[data-type="text"]');
    fireEvent.doubleClick(wrapper);
    const editable = wrapper.querySelector("[contenteditable]");
    // Simulates the user typing new text and then navigating away - no blur
    // event fires (they never clicked elsewhere on the page first).
    editable.innerHTML = "New free text";

    fireEvent.click(screen.getByTitle("Slide 3"));
    fireEvent.click(screen.getByTitle("Slide 2"));

    expect(document.querySelector('[data-type="text"]').querySelector("[contenteditable]").innerHTML).toBe(
      "New free text"
    );
  });

  it("commits an in-progress free-text edit before double-clicking a different element to edit it", () => {
    renderAtDemoRoute();

    fireEvent.click(screen.getByTitle("Slide 2"));
    fireEvent.click(screen.getByRole("button", { name: /^elements$/i }));
    fireEvent.click(screen.getByTitle("Text"));
    fireEvent.click(screen.getByRole("button", { name: /^elements$/i }));
    fireEvent.click(screen.getByTitle("Shape"));

    const [textWrapper] = document.querySelectorAll('[data-type="text"]');
    fireEvent.doubleClick(textWrapper);
    textWrapper.querySelector("[contenteditable]").innerHTML = "Second widget's text";

    // Double-click the shape (a different element) to start editing it
    // instead - no blur ever fires on the text widget first.
    const shapeWrapper = document.querySelector('[data-type="shape"]');
    fireEvent.doubleClick(shapeWrapper);

    // Round-trip through another slide to prove the text was actually
    // committed to the deck (not just still showing, unpersisted, in a DOM
    // node that switching editingElementId never happened to overwrite).
    fireEvent.click(screen.getByTitle("Slide 3"));
    fireEvent.click(screen.getByTitle("Slide 2"));

    expect(document.querySelector('[data-type="text"]').querySelector("[contenteditable]").innerHTML).toBe(
      "Second widget's text"
    );
  });

  it("undoes and redoes a free-element insert via the Undo/Redo toolbar buttons", () => {
    renderAtDemoRoute();

    fireEvent.click(screen.getByTitle("Slide 2"));
    expect(screen.getByRole("button", { name: /^undo$/i })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /^elements$/i }));
    fireEvent.click(screen.getByTitle("Text"));
    expect(document.querySelector('[data-type="text"]')).toBeTruthy();
    expect(screen.getByRole("button", { name: /^undo$/i })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /^redo$/i })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /^undo$/i }));
    expect(document.querySelector('[data-type="text"]')).toBeNull();
    expect(screen.getByRole("button", { name: /^redo$/i })).not.toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /^redo$/i }));
    expect(document.querySelector('[data-type="text"]')).toBeTruthy();
  });

  it("undoes via Ctrl+Z when nothing is being actively edited", () => {
    renderAtDemoRoute();

    fireEvent.click(screen.getByTitle("Slide 2"));
    fireEvent.click(screen.getByRole("button", { name: /^elements$/i }));
    fireEvent.click(screen.getByTitle("Text"));
    expect(document.querySelector('[data-type="text"]')).toBeTruthy();

    fireEvent.keyDown(window, { key: "z", ctrlKey: true });

    expect(document.querySelector('[data-type="text"]')).toBeNull();
  });

  it("does not undo via Ctrl+Z while a free-text element is actively being edited", () => {
    renderAtDemoRoute();

    fireEvent.click(screen.getByTitle("Slide 2"));
    fireEvent.click(screen.getByRole("button", { name: /^elements$/i }));
    fireEvent.click(screen.getByTitle("Text"));
    const wrapper = document.querySelector('[data-type="text"]');
    fireEvent.doubleClick(wrapper);

    fireEvent.keyDown(window, { key: "z", ctrlKey: true });

    // The insert is still there - Ctrl+Z was left for the field's own
    // native/Froala undo, not intercepted as a deck-level undo.
    expect(document.querySelector('[data-type="text"]')).toBeTruthy();
  });
});
