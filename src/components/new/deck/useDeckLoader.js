import { useEffect, useState } from "react";
import deckApi from "../../../utils/deckApi";
import { migrateDeck } from "./deckSchema";

// Loads a deck from the backend by id and runs it through `migrateDeck` so
// `DeckProvider` only ever sees the current schema shape, whatever version it
// was saved under. `deckId == null` means "no deck to load" (e.g. the
// no-id demo route) - status is `ready` immediately with `deck: null`, and
// the caller falls back to its own seed deck.
export function useDeckLoader(deckId) {
  const [state, setState] = useState(() => ({
    status: deckId ? "loading" : "ready",
    deck: null,
    error: null,
  }));

  useEffect(() => {
    if (!deckId) {
      setState({ status: "ready", deck: null, error: null });
      return;
    }
    let cancelled = false;
    setState({ status: "loading", deck: null, error: null });
    deckApi
      .getDeck(deckId)
      .then((res) => {
        if (cancelled) return;
        const raw = res.data?.data;
        setState({ status: "ready", deck: migrateDeck(raw), error: null });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({ status: "error", deck: null, error });
      });
    return () => {
      cancelled = true;
    };
  }, [deckId]);

  return state;
}
