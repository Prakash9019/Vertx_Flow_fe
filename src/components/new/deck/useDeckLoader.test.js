import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useDeckLoader } from "./useDeckLoader";
import deckApi from "../../../utils/deckApi";

vi.mock("../../../utils/deckApi", () => ({
  default: { getDeck: vi.fn() },
}));

describe("useDeckLoader", () => {
  beforeEach(() => {
    deckApi.getDeck.mockReset();
  });

  it("is immediately ready with a null deck when deckId is null", () => {
    const { result } = renderHook(() => useDeckLoader(null));
    expect(result.current).toEqual({ status: "ready", deck: null, error: null });
    expect(deckApi.getDeck).not.toHaveBeenCalled();
  });

  it("loads and migrates the deck for a given deckId", async () => {
    deckApi.getDeck.mockResolvedValue({
      data: { data: { _id: "d1", title: "My Deck", theme: "dark", slides: [] } },
    });

    const { result } = renderHook(() => useDeckLoader("d1"));
    expect(result.current.status).toBe("loading");

    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(deckApi.getDeck).toHaveBeenCalledWith("d1");
    expect(result.current.deck.id).toBe("d1");
    expect(result.current.deck.schemaVersion).toBe(2);
    // v1's bare-string theme must come out migrated into a structured token object.
    expect(result.current.deck.theme).toMatchObject({ id: "dark" });
  });

  it("sets status to error when the fetch fails", async () => {
    deckApi.getDeck.mockRejectedValue(new Error("network down"));

    const { result } = renderHook(() => useDeckLoader("d2"));
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.deck).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("reloads when deckId changes", async () => {
    deckApi.getDeck.mockResolvedValue({
      data: { data: { _id: "d1", title: "First", theme: "dark", slides: [] } },
    });
    const { result, rerender } = renderHook(({ id }) => useDeckLoader(id), {
      initialProps: { id: "d1" },
    });
    await waitFor(() => expect(result.current.status).toBe("ready"));

    deckApi.getDeck.mockResolvedValue({
      data: { data: { _id: "d2", title: "Second", theme: "dark", slides: [] } },
    });
    rerender({ id: "d2" });
    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current.deck?.id).toBe("d2"));
  });
});
