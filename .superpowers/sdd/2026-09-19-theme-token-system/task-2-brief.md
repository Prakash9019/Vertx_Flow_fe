### Task 2: `SET_DECK_THEME` reducer action

**Files:**
- Modify: `src/components/new/deck/deckReducer.js`
- Test: `src/components/new/deck/deckReducer.test.js`

**Interfaces:**
- Consumes: nothing new from Task 1 directly (the reducer stays theme-shape-agnostic — it just validates "is this a plausible theme object" and replaces `deck.theme`), but callers will pass it a `getTheme(id)`/`normalizeTheme(...)` result.
- Produces: `deckReducer(deck, { type: "SET_DECK_THEME", theme })` → `{ ...deck, theme }` deck.

- [ ] **Step 1: Write the failing test**

Add to `src/components/new/deck/deckReducer.test.js` (inside the existing `describe("deckReducer", ...)` block, alongside the other action tests):

```js
  it("SET_DECK_THEME replaces deck.theme", () => {
    const { deck } = deckWithOneSlide();
    const newTheme = { id: "dark", colors: { background: "#000000" } };
    const next = deckReducer(deck, { type: "SET_DECK_THEME", theme: newTheme });
    expect(next.theme).toBe(newTheme);
    expect(next.slides).toBe(deck.slides); // slides/content are untouched
  });

  it("SET_DECK_THEME warns and no-ops when theme is missing colors", () => {
    const { deck } = deckWithOneSlide();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const next = deckReducer(deck, { type: "SET_DECK_THEME", theme: { id: "dark" } });
    expect(next).toBe(deck);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("SET_DECK_THEME warns and no-ops when theme is missing entirely", () => {
    const { deck } = deckWithOneSlide();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const next = deckReducer(deck, { type: "SET_DECK_THEME" });
    expect(next).toBe(deck);
    warn.mockRestore();
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/new/deck/deckReducer.test.js`
Expected: FAIL — `SET_DECK_THEME warns and no-ops...` cases currently hit the `default` branch's "unknown action type" warning (so the no-op assertions incidentally pass), but the first new test (`SET_DECK_THEME replaces deck.theme`) fails because `next.theme` is still the old theme (the reducer doesn't handle this action type yet).

- [ ] **Step 3: Write the implementation**

In `src/components/new/deck/deckReducer.js`, add a new case just before `default:`:

```js
    case "SET_DECK_THEME": {
      if (!action.theme || typeof action.theme !== "object" || !action.theme.colors) {
        warnInvalid(action, "theme is missing or has no colors");
        return deck;
      }
      return { ...deck, theme: action.theme };
    }

```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/new/deck/deckReducer.test.js`
Expected: PASS — full file (all pre-existing + 3 new tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/deckReducer.js src/components/new/deck/deckReducer.test.js
git commit -m "feat: add SET_DECK_THEME reducer action"
```

---

