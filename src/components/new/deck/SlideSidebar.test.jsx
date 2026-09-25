import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SlideSidebar } from "./SlideSidebar";
import { createSlide } from "./deckTypes";

// jsdom doesn't implement scrollIntoView - SlideSidebarItem calls it to keep
// the active thumbnail visible, so every mount needs this stub.
beforeAll(() => {
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

function makeSlides(n) {
  return Array.from({ length: n }, (_, i) =>
    createSlide({ layout: "title", content: { title: `Slide ${i + 1}`, subtitle: "" }, order: i })
  );
}

function renderSidebar(overrides = {}) {
  const slides = overrides.slides ?? makeSlides(3);
  const handlers = {
    onSelectSlide: vi.fn(),
    onAddSlide: vi.fn(),
    onInsertAfter: vi.fn(),
    onDuplicateSlide: vi.fn(),
    onDeleteSlide: vi.fn(),
    onReorderSlide: vi.fn(),
    onMoveSlide: vi.fn(),
    ...overrides,
  };
  const utils = render(
    <SlideSidebar
      slides={slides}
      currentSlideId={overrides.currentSlideId ?? slides[0].id}
      onSelectSlide={handlers.onSelectSlide}
      onAddSlide={handlers.onAddSlide}
      onInsertAfter={handlers.onInsertAfter}
      onDuplicateSlide={handlers.onDuplicateSlide}
      onDeleteSlide={handlers.onDeleteSlide}
      onReorderSlide={handlers.onReorderSlide}
      onMoveSlide={handlers.onMoveSlide}
    />
  );
  return { ...utils, slides, handlers };
}

function openMenu(container, index) {
  const items = container.querySelectorAll("[data-slide-id]");
  const menuButton = items[index].querySelector('button[title="Slide options"]');
  fireEvent.click(menuButton);
  return items[index];
}

describe("SlideSidebar", () => {
  it("renders one item per slide with 1-based position labels", () => {
    const { container } = renderSidebar();
    const items = container.querySelectorAll("[data-slide-id]");
    expect(items.length).toBe(3);
    expect(items[0].textContent).toContain("1");
    expect(items[2].textContent).toContain("3");
  });

  it("calls onSelectSlide when an item is clicked", () => {
    const { container, slides, handlers } = renderSidebar();
    const items = container.querySelectorAll("[data-slide-id]");
    fireEvent.click(items[1]);
    expect(handlers.onSelectSlide).toHaveBeenCalledWith(slides[1].id);
  });

  it("calls onAddSlide when the Add Slide button is clicked", () => {
    const { handlers } = renderSidebar();
    fireEvent.click(screen.getByText("Add Slide"));
    expect(handlers.onAddSlide).toHaveBeenCalledTimes(1);
  });

  it("marks the active slide distinctly from the others", () => {
    const { container, slides } = renderSidebar({ currentSlideId: undefined });
    const items = container.querySelectorAll("[data-slide-id]");
    // slides[0] is active by default in renderSidebar (currentSlideId defaults to slides[0].id)
    expect(items[0].className).toContain("border-teal-400");
    expect(items[1].className).not.toContain("border-teal-400");
    void slides;
  });

  describe("per-slide menu", () => {
    it("opens the menu and fires onDuplicate", () => {
      const { container, slides, handlers } = renderSidebar();
      openMenu(container, 0);
      fireEvent.click(screen.getByText("Duplicate"));
      expect(handlers.onDuplicateSlide).toHaveBeenCalledWith(slides[0].id);
    });

    it("opens the menu and fires onInsertAfter", () => {
      const { container, slides, handlers } = renderSidebar();
      openMenu(container, 0);
      fireEvent.click(screen.getByText("Insert after"));
      expect(handlers.onInsertAfter).toHaveBeenCalledWith(slides[0].id);
    });

    it("disables Delete and shows a tooltip when it's the only slide", () => {
      const { container } = renderSidebar({ slides: makeSlides(1) });
      openMenu(container, 0);
      const deleteButton = screen.getByText("Delete").closest("button");
      expect(deleteButton).toBeDisabled();
      expect(deleteButton.title).toMatch(/at least one slide/i);
    });

    it("enables Delete and fires onDeleteSlide when there's more than one slide", () => {
      const { container, slides, handlers } = renderSidebar();
      openMenu(container, 0);
      const deleteButton = screen.getByText("Delete").closest("button");
      expect(deleteButton).not.toBeDisabled();
      fireEvent.click(deleteButton);
      expect(handlers.onDeleteSlide).toHaveBeenCalledWith(slides[0].id);
    });

    it("hides Move up on the first slide and Move down on the last slide", () => {
      const { container } = renderSidebar();
      openMenu(container, 0);
      expect(screen.queryByText("Move up")).toBeNull();
      expect(screen.getByText("Move down")).toBeTruthy();

      fireEvent.click(screen.getByText("Move down")); // closes menu as a side effect

      openMenu(container, 2);
      expect(screen.getByText("Move up")).toBeTruthy();
      expect(screen.queryByText("Move down")).toBeNull();
    });

    it("fires onMoveSlide('up'/'down') with the slide id", () => {
      const { container, slides, handlers } = renderSidebar();
      openMenu(container, 1);
      fireEvent.click(screen.getByText("Move up"));
      expect(handlers.onMoveSlide).toHaveBeenCalledWith(slides[1].id, "up");

      openMenu(container, 1);
      fireEvent.click(screen.getByText("Move down"));
      expect(handlers.onMoveSlide).toHaveBeenCalledWith(slides[1].id, "down");
    });

    it("closes the menu when clicking outside it", () => {
      const { container } = renderSidebar();
      openMenu(container, 0);
      expect(screen.getByText("Duplicate")).toBeTruthy();

      fireEvent.pointerDown(document.body);
      expect(screen.queryByText("Duplicate")).toBeNull();
    });
  });

  describe("drag-to-reorder", () => {
    it("calls onReorderSlide with the dragged slide id and drop index", () => {
      const { container, slides, handlers } = renderSidebar();
      const items = container.querySelectorAll("[data-slide-id]");

      fireEvent.dragStart(items[0], { dataTransfer: { effectAllowed: "" } });
      fireEvent.dragOver(items[2], { dataTransfer: { dropEffect: "" } });
      fireEvent.drop(items[2], { dataTransfer: {} });

      expect(handlers.onReorderSlide).toHaveBeenCalledWith(slides[0].id, 2);
    });

    it("does nothing on drop if no drag was in progress", () => {
      const { container, handlers } = renderSidebar();
      const items = container.querySelectorAll("[data-slide-id]");
      fireEvent.drop(items[1], { dataTransfer: {} });
      expect(handlers.onReorderSlide).not.toHaveBeenCalled();
    });

    it("clears drag state on dragEnd without reordering", () => {
      const { container, handlers } = renderSidebar();
      const items = container.querySelectorAll("[data-slide-id]");
      fireEvent.dragStart(items[0], { dataTransfer: { effectAllowed: "" } });
      fireEvent.dragEnd(items[0]);
      fireEvent.drop(items[2], { dataTransfer: {} });
      expect(handlers.onReorderSlide).not.toHaveBeenCalled();
    });
  });
});
