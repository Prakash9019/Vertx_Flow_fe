import React, { createContext, useContext } from "react";
import { deckReducer } from "./deckReducer";
import { useDeckHistory } from "./useDeckHistory";

const DeckStateContext = createContext(null);

export function DeckProvider({ initialDeck, children }) {
  const { present: deck, dispatch, undo, redo, canUndo, canRedo } = useDeckHistory(deckReducer, initialDeck);
  return (
    <DeckStateContext.Provider value={{ deck, dispatch, undo, redo, canUndo, canRedo }}>
      {children}
    </DeckStateContext.Provider>
  );
}

export function useDeck() {
  const context = useContext(DeckStateContext);
  if (!context) {
    throw new Error("useDeck must be used within a DeckProvider");
  }
  return context;
}
