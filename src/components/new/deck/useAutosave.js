import { useEffect, useRef, useState } from "react";
import deckApi from "../../../utils/deckApi";
import { serializeDeck } from "./deckSchema";

const DEFAULT_DELAY_MS = 1000;

// Debounces `deck` changes into a single PATCH per pause in editing, so a
// drag's every pointermove or a burst of keystrokes doesn't fire one request
// per intermediate state - matching the same "one checkpoint per gesture"
// idea `useDeckHistory` uses for undo. `deckId == null` (no real deck to
// save to, e.g. the no-id demo route) makes this a permanent no-op.
export function useAutosave(deckId, deck, { delay = DEFAULT_DELAY_MS } = {}) {
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error
  const timeoutRef = useRef(null);
  const skipNextRef = useRef(true);

  useEffect(() => {
    skipNextRef.current = true;
  }, [deckId]);

  useEffect(() => {
    if (!deckId) return undefined;
    if (skipNextRef.current) {
      // Don't immediately re-save the deck we just loaded.
      skipNextRef.current = false;
      return undefined;
    }

    setStatus("saving");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      deckApi
        .updateDeck(deckId, serializeDeck(deck))
        .then(() => setStatus("saved"))
        .catch(() => setStatus("error"));
    }, delay);

    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, deckId, delay]);

  return status;
}
