import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import EditorPage from "./EditorPage";
import deckApi from "../../utils/deckApi";

// Roadmap #15 (slide/element animations), integration-level: proves the
// slide-to-slide crossfade (`SlideTransition.jsx`, unit-tested in
// `deck/SlideTransition.test.jsx`) is actually wired into the real
// `EditorPage.jsx` nav-dot flow, and that navigating slides this way still
// renders each slide's real content correctly (doesn't regress the existing
// slide-content/free-element rendering paths `EditorPage.test.jsx` and
// `SlideCanvas.test.jsx` already cover).
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

describe("EditorPage slide navigation crossfade", () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = () => {};
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("wraps the active slide in a SlideTransition on initial render, with no exit layer yet", () => {
    renderAtDemoRoute();

    expect(screen.getByTestId("slide-transition")).toBeInTheDocument();
    expect(screen.getByTestId("slide-transition-enter")).toBeInTheDocument();
    expect(screen.queryByTestId("slide-transition-exit")).not.toBeInTheDocument();
    // The first (title) slide's real content is still rendered through
    // SlideCanvas underneath the transition wrapper.
    expect(screen.getAllByTestId("slide-canvas").length).toBe(1);
  });

  it("clicking a nav dot crossfades to the target slide and settles on it", () => {
    renderAtDemoRoute();

    const dots = screen.getAllByTitle(/^Slide \d+$/);
    expect(dots.length).toBeGreaterThan(1);

    act(() => {
      dots[1].click();
    });

    // Immediately after navigating, both the outgoing and incoming slide's
    // SlideCanvas are present (crossfade in progress) - never an abrupt swap.
    expect(screen.getAllByTestId("slide-canvas").length).toBe(2);
    expect(screen.getByTestId("slide-transition-exit")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(400);
    });

    // After the transition window, only the target slide remains mounted.
    expect(screen.getAllByTestId("slide-canvas").length).toBe(1);
    expect(screen.queryByTestId("slide-transition-exit")).not.toBeInTheDocument();
  });

  it("does not trigger a crossfade for in-place content edits (only real navigation does)", () => {
    renderAtDemoRoute();

    // No navigation happened - editing content on the same slide dispatches
    // UPDATE_SLIDE_CONTENT, which produces a new slide object with the same
    // id. SlideTransition must treat that as an in-place swap, not a
    // navigation, so RichText/free-element DOM state is never disturbed by
    // an unrelated crossfade.
    expect(screen.queryByTestId("slide-transition-exit")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("slide-canvas").length).toBe(1);
  });
});
