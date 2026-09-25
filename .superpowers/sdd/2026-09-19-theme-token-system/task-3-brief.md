### Task 3: Schema migration normalizes `theme` to the structured shape

**Files:**
- Modify: `src/components/new/deck/deckSchema.js`
- Create: `src/components/new/deck/deckSchema.test.js`

**Interfaces:**
- Consumes: `normalizeTheme` from `./theme/themeTokens` (Task 1).
- Produces: `migrateDeck(rawDeck).theme` is always a full structured theme object; `CURRENT_SCHEMA_VERSION` becomes `2`.

- [ ] **Step 1: Write the failing test**

```js
// src/components/new/deck/deckSchema.test.js
import { describe, it, expect } from "vitest";
import { migrateDeck, serializeDeck, CURRENT_SCHEMA_VERSION } from "./deckSchema";
import { getTheme, DEFAULT_THEME_ID } from "./theme/themeTokens";

describe("migrateDeck", () => {
  it("normalizes a v1 deck with a bare-string theme into a structured theme", () => {
    const raw = { _id: "d1", title: "My Deck", theme: "dark", slides: [] };
    const migrated = migrateDeck(raw);
    expect(migrated.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(migrated.theme.id).toBe("dark");
    expect(migrated.theme.colors.background).toBe(getTheme("dark").colors.background);
  });

  it("defaults a deck with no theme at all to the default theme", () => {
    const raw = { _id: "d2", title: "No Theme", slides: [] };
    const migrated = migrateDeck(raw);
    expect(migrated.theme.id).toBe(DEFAULT_THEME_ID);
  });

  it("passes an already-current structured theme through unchanged", () => {
    const currentTheme = getTheme("modern");
    const raw = { id: "d3", schemaVersion: CURRENT_SCHEMA_VERSION, title: "Current", theme: currentTheme, slides: [] };
    const migrated = migrateDeck(raw);
    expect(migrated.theme).toEqual(currentTheme);
  });

  it("fills in missing token groups on a partially-structured theme", () => {
    const raw = { id: "d4", title: "Partial", theme: { id: "bold", colors: { primary: "#custom" } }, slides: [] };
    const migrated = migrateDeck(raw);
    expect(migrated.theme.colors.primary).toBe("#custom");
    expect(migrated.theme.colors.background).toBe(getTheme("bold").colors.background);
    expect(migrated.theme.typography.headingFont).toBeTruthy();
  });

  it("returns null/undefined unchanged", () => {
    expect(migrateDeck(null)).toBe(null);
    expect(migrateDeck(undefined)).toBe(undefined);
  });
});

describe("serializeDeck", () => {
  it("round-trips the structured theme unchanged", () => {
    const theme = getTheme("light");
    const deck = { schemaVersion: CURRENT_SCHEMA_VERSION, title: "T", theme, slides: [] };
    expect(serializeDeck(deck).theme).toBe(theme);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/new/deck/deckSchema.test.js`
Expected: FAIL — `migrated.theme.id` is `undefined` (theme is still the bare string `"dark"` / a plain unstructured value), and `CURRENT_SCHEMA_VERSION` is `1`.

- [ ] **Step 3: Write the implementation**

Replace the top of `src/components/new/deck/deckSchema.js`:

```js
// Owns the persisted deck shape and its migration chain. The backend stores
// `theme`/`slides` as opaque (Mixed) data precisely so this file - not a
// backend migration - is what evolves the deck shape over time.
import { normalizeTheme } from "./theme/themeTokens";

export const CURRENT_SCHEMA_VERSION = 2;

// Each entry migrates a raw deck FROM its key version TO key+1. Add v3 here
// (and bump CURRENT_SCHEMA_VERSION) rather than editing v1/v2 in place.
const MIGRATIONS = {
  1: (raw) => ({
    id: raw._id ?? raw.id,
    title: raw.title ?? 'Untitled Deck',
    theme: raw.theme ?? 'dark',
    slides: raw.slides ?? [],
  }),
  // v1 decks had `theme` as a bare string (e.g. "dark"); this normalizes any
  // shape `theme` might already be in (bare string, partial object, or an
  // already-current object) into the full structured token shape.
  2: (deck) => ({
    ...deck,
    theme: normalizeTheme(deck.theme),
  }),
};
```

The rest of `migrateDeck` and `serializeDeck` stay exactly as they are — the existing "run every migration in the chain, then re-run the current version's migration unconditionally" logic already does the right thing here because `normalizeTheme` is idempotent (Task 1, verified by its own test).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/new/deck/deckSchema.test.js`
Expected: PASS.

- [ ] **Step 5: Run the full suite to confirm no regression**

Run: `npm test`
Expected: PASS, test count higher than the 82-test baseline (status doc §1d).

- [ ] **Step 6: Commit**

```bash
git add src/components/new/deck/deckSchema.js src/components/new/deck/deckSchema.test.js
git commit -m "feat: migrate deck.theme to structured theme tokens (schema v2)"
```

---

