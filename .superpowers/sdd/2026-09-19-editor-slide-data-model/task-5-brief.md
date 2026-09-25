## Task 5: DeckProvider context

**Files:**
- Create: `src/components/new/deck/DeckContext.jsx`
- Test: `src/components/new/deck/DeckContext.test.jsx`

**Interfaces:**
- Consumes: `deckReducer` (Task 4), `createDeck` (Task 2).
- Produces:
  - `DeckProvider({ initialDeck, children })` — React component; wraps `children` in context, initializes state from `initialDeck` (a `Deck` object) via `useReducer(deckReducer, initialDeck)`.
  - `useDeck()` — hook returning `{ deck, dispatch }`. `dispatch` accepts the same action objects `deckReducer` handles. Every later task that needs to read or mutate deck state calls `useDeck()` — no task reads deck state through any other channel.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/new/deck/DeckContext.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DeckProvider, useDeck } from "./DeckContext";
import { createDeck, createSlide } from "./deckTypes";

function TestConsumer() {
  const { deck, dispatch } = useDeck();
  return (
    <div>
      <span data-testid="slide-count">{deck.slides.length}</span>
      <span data-testid="first-title">{deck.slides[0]?.content.title}</span>
      <button
        onClick={() =>
          dispatch({ type: "UPDATE_SLIDE_CONTENT", slideId: deck.slides[0].id, content: { title: "Changed" } })
        }
      >
        Change
      </button>
    </div>
  );
}

describe("DeckProvider / useDeck", () => {
  it("provides the initial deck and dispatches actions that update it", () => {
    const slide = createSlide({ layout: "title", content: { title: "Original" }, order: 0 });
    const initialDeck = createDeck({ title: "Deck", theme: "dark", slides: [slide] });

    render(
      <DeckProvider initialDeck={initialDeck}>
        <TestConsumer />
      </DeckProvider>
    );

    expect(screen.getByTestId("slide-count").textContent).toBe("1");
    expect(screen.getByTestId("first-title").textContent).toBe("Original");

    fireEvent.click(screen.getByText("Change"));

    expect(screen.getByTestId("first-title").textContent).toBe("Changed");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- DeckContext`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the implementation**

```jsx
// src/components/new/deck/DeckContext.jsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- DeckContext`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/DeckContext.jsx src/components/new/deck/DeckContext.test.jsx
git commit -m "feat(deck): add DeckProvider context and useDeck hook"
```

---

