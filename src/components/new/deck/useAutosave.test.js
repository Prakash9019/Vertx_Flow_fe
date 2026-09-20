import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAutosave } from "./useAutosave";
import deckApi from "../../../utils/deckApi";

vi.mock("../../../utils/deckApi", () => ({
  default: { updateDeck: vi.fn() },
}));

const deckV1 = { title: "Deck", theme: "dark", slides: [] };
const deckV2 = { title: "Deck (edited)", theme: "dark", slides: [] };

describe("useAutosave", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    deckApi.updateDeck.mockReset();
    deckApi.updateDeck.mockResolvedValue({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("is a no-op when deckId is null", () => {
    const { result, rerender } = renderHook(({ deck }) => useAutosave(null, deck), {
      initialProps: { deck: deckV1 },
    });
    rerender({ deck: deckV2 });
    act(() => vi.advanceTimersByTime(5000));
    expect(deckApi.updateDeck).not.toHaveBeenCalled();
    expect(result.current).toBe("idle");
  });

  it("does not save on the initial load, only on a subsequent deck change", () => {
    const { rerender } = renderHook(({ deck }) => useAutosave("d1", deck), {
      initialProps: { deck: deckV1 },
    });
    act(() => vi.advanceTimersByTime(5000));
    expect(deckApi.updateDeck).not.toHaveBeenCalled();

    rerender({ deck: deckV2 });
    act(() => vi.advanceTimersByTime(1000));
    expect(deckApi.updateDeck).toHaveBeenCalledTimes(1);
    expect(deckApi.updateDeck).toHaveBeenCalledWith("d1", expect.objectContaining({ title: "Deck (edited)" }));
  });

  it("debounces a burst of changes into a single save", () => {
    const { rerender } = renderHook(({ deck }) => useAutosave("d1", deck, { delay: 1000 }), {
      initialProps: { deck: deckV1 },
    });

    rerender({ deck: { ...deckV1, title: "A" } });
    act(() => vi.advanceTimersByTime(400));
    rerender({ deck: { ...deckV1, title: "B" } });
    act(() => vi.advanceTimersByTime(400));
    rerender({ deck: { ...deckV1, title: "C" } });
    act(() => vi.advanceTimersByTime(1000));

    expect(deckApi.updateDeck).toHaveBeenCalledTimes(1);
    expect(deckApi.updateDeck).toHaveBeenCalledWith("d1", expect.objectContaining({ title: "C" }));
  });

  it("reports saving then saved, and error on failure", async () => {
    vi.useRealTimers();
    const { result, rerender } = renderHook(({ deck }) => useAutosave("d1", deck, { delay: 10 }), {
      initialProps: { deck: deckV1 },
    });

    rerender({ deck: deckV2 });
    expect(result.current).toBe("saving");
    await waitFor(() => expect(result.current).toBe("saved"));

    deckApi.updateDeck.mockRejectedValueOnce(new Error("boom"));
    rerender({ deck: { ...deckV2, title: "fails" } });
    await waitFor(() => expect(result.current).toBe("error"));
  });
});
