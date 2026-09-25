import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TemplateGalleryModal from "./TemplateGalleryModal";
import deckApi from "../../../utils/deckApi";
import { TEMPLATE_LIBRARY } from "./templateLibrary";

vi.mock("../../../utils/deckApi", () => ({
  default: { createDeck: vi.fn() },
}));

describe("TemplateGalleryModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a card for every template in the library", () => {
    render(<TemplateGalleryModal onClose={() => {}} onDeckCreated={() => {}} />);
    for (const template of TEMPLATE_LIBRARY) {
      expect(screen.getByText(template.name)).toBeInTheDocument();
    }
  });

  it("creates a deck from the picked template and calls onDeckCreated with its id", async () => {
    deckApi.createDeck.mockResolvedValue({ data: { data: { _id: "deck-123" } } });
    const onDeckCreated = vi.fn();
    render(<TemplateGalleryModal onClose={() => {}} onDeckCreated={onDeckCreated} />);

    fireEvent.click(screen.getByText(TEMPLATE_LIBRARY[0].name));

    await waitFor(() => expect(onDeckCreated).toHaveBeenCalledWith("deck-123"));

    const builtDeck = deckApi.createDeck.mock.calls[0][0];
    expect(builtDeck.title).toBe(TEMPLATE_LIBRARY[0].name);
    expect(builtDeck.slides).toHaveLength(TEMPLATE_LIBRARY[0].slides.length);
  });

  it("calls onClose when Cancel is clicked", () => {
    const onClose = vi.fn();
    render(<TemplateGalleryModal onClose={onClose} onDeckCreated={() => {}} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });
});
