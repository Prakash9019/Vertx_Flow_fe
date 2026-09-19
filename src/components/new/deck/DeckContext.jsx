import React, { createContext, useContext, useReducer } from "react";
import { deckReducer } from "./deckReducer";

const DeckStateContext = createContext(null);

export function DeckProvider({ initialDeck, children }) {
  const [deck, dispatch] = useReducer(deckReducer, initialDeck);
  return <DeckStateContext.Provider value={{ deck, dispatch }}>{children}</DeckStateContext.Provider>;
}

export function useDeck() {
  const context = useContext(DeckStateContext);
  if (!context) {
    throw new Error("useDeck must be used within a DeckProvider");
  }
  return context;
}
