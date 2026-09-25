# Theme Token System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the bare-string `deck.theme` and the local-only `uiTheme` cosmetic state with a structured, persisted theme-token object that every layout and free-element widget consumes live via CSS custom properties, with a `SET_DECK_THEME` reducer action and a schema migration for old decks.

**Architecture:** A new `themeTokens.js` module defines the token shape, a 7-theme registry, and `normalizeTheme()`/`themeToCssVars()` helpers. `deckReducer.js` gains one new action (`SET_DECK_THEME`) that replaces `deck.theme` wholesale — no other reducer logic changes. `deckSchema.js` gains a v1→v2 migration that runs every deck's `theme` field (bare string or partial object) through `normalizeTheme()` so `DeckProvider` only ever sees the current structured shape. `EditorPage.jsx`'s Theme Picker dispatches `SET_DECK_THEME` instead of setting local state, and renders the deck's current theme as CSS custom properties (`--theme-*`) on the top-level wrapper div, so every descendant (layouts, free-element widgets, the sidebar) can read them with plain `var(--theme-*)` CSS — no new React context, no prop drilling, per the brief's "don't introduce a complicated styling framework" constraint. The 7 layout components and 4 theme-aware widgets (Text/Shape/Divider/Icon) are refactored to reference those CSS variables instead of hardcoded Tailwind colors, with free-element widgets falling back to the CSS variable only when the element has no explicit `props` override, preserving the theme-derived-vs-explicit-override distinction the brief requires.

**Tech Stack:** React 18, Vite, Vitest + @testing-library/react, Tailwind (utility classes for structure/spacing only — colors/fonts move to inline `style`/CSS vars).

**Spec:** The pasted brief in this conversation ("Proceed to Sub-project #6: Theme Token System") plus the binding constraints in `docs/superpowers/specs/2026-09-19-editor-v2-architecture-principles.md` §5 ("Theme token system") and §8 ("What must NOT be thrown away").

## Global Constraints

- Do not implement Background overlay/opacity, video backgrounds, semantic layout transformation, Remix, AI features, Change Case, animations, or a performance/regression pass — all explicitly out of scope for this sub-project (brief §20).
- Every layout must consume tokens, not hardcode Tailwind color/font classes — this is a refactor of all 7 existing layouts (architecture doc §5).
- Theme changes must be live (no reload) and persistent (part of `Deck`, saved via the existing autosave path) — no reload/hard refresh anywhere in the flow.
- Changing a theme must never delete content, change slide order/positions, remove free elements, or reset layouts (brief §10) — `SET_DECK_THEME` only ever touches `deck.theme`, never `deck.slides`.
- Do not overwrite an explicit user style override on a free element with a theme-derived default (brief §12).
- `migrateDeck()` must normalize old bare-string `theme` values into the new structured shape without throwing on old saved decks (brief §17).
- Do not leave two theme systems operating simultaneously once this lands — `EditorPage.jsx`'s old local `uiTheme` state is removed, `deck.theme` (via `DeckContext`) is the only source of truth (brief §18).
- Prefer CSS custom properties for live updates over a new styling framework or a new React context (brief §6) — this plan's chosen mechanism.
- Leave the ~3,700 lines of legacy dead layout components in `EditorPage.jsx` (`TheChallangePage`, `themes`, `themes2`, `backgrounds`, etc.) untouched — their deletion is explicitly deferred (status doc §4), and they still reference `themes`/`themes2` by name, so removing those objects would break lint/build for no reason.
- Full test suite must keep growing, never shrinking (architecture doc §8) — current baseline is 82 tests / 18 files (status doc §1d).

---

## File Structure

| File | Responsibility |
|---|---|
| `src/components/new/deck/theme/themeTokens.js` (new) | Token shape, 7-theme registry, `getTheme`, `normalizeTheme`, `themeToCssVars`, `themeToRootStyle`. |
| `src/components/new/deck/theme/themeTokens.test.js` (new) | Unit tests for the above. |
| `src/components/new/deck/deckReducer.js` (modify) | Add `SET_DECK_THEME` case. |
| `src/components/new/deck/deckReducer.test.js` (modify) | Add `SET_DECK_THEME` tests. |
| `src/components/new/deck/deckSchema.js` (modify) | Bump `CURRENT_SCHEMA_VERSION` to 2, add the v1→v2 migration that normalizes `theme`. |
| `src/components/new/deck/deckSchema.test.js` (new) | Migration tests (bare-string theme, partial object, already-current). |
| `src/components/new/deck/RichText.jsx` (modify) | Accept and forward an optional `style` prop so layouts can set theme font-family on heading/body fields. |
| `src/components/new/deck/RichText.test.jsx` (modify) | Test the new `style` passthrough. |
| `src/components/new/EditorPage.jsx` (modify) | Remove `uiTheme` local state; Theme Picker modal renders `THEME_REGISTRY` and dispatches `SET_DECK_THEME`; apply `themeToRootStyle(deck.theme)` on the outermost wrapper; `buildSeedDeck` uses the registry default theme. |
| `src/components/new/DeckListPage.jsx` (modify) | New decks are created with a structured default theme instead of the bare string `"dark"`. |
| `src/components/new/deck/layouts/*.jsx` (7 files, modify) | Replace hardcoded color/accent Tailwind classes with `var(--theme-*)` references; add `style` for heading/body font-family. |
| `src/components/new/deck/widgets/TextWidget.jsx`, `ShapeWidget.jsx`, `DividerWidget.jsx`, `IconWidget.jsx` (modify) | Default to theme CSS variables when the element has no explicit color/fill override. |
| `src/components/new/deck/freeElementFactory.js` (modify) | Stop baking an explicit color/fill into new shape/divider/icon elements, so they pick up the theme default (an explicit override, e.g. a future color picker, still works exactly as before). |
| `docs/EDITOR-V2-STATUS.md` (modify) | Document sub-project #6 completion per the brief's §22 checklist. |

---

### Task 1: Theme token schema, registry, and CSS-variable helpers

**Files:**
- Create: `src/components/new/deck/theme/themeTokens.js`
- Test: `src/components/new/deck/theme/themeTokens.test.js`

**Interfaces:**
- Produces: `THEME_REGISTRY` (array of 7 full theme objects), `DEFAULT_THEME_ID = "default"`, `getTheme(id)` (returns a deep-cloned theme object from the registry, falls back to default), `normalizeTheme(value)` (string | partial object | null/undefined → full theme object), `themeToCssVars(theme)` (theme → `{ "--theme-background": ..., ... }` style object), `themeToRootStyle(theme)` (theme → `{ ...themeToCssVars(theme), backgroundColor, color, fontFamily }`, for the one wrapper element that should visibly repaint).
- Consumed by: Task 2 (`deckReducer.js`), Task 3 (`deckSchema.js`), Task 5 (`EditorPage.jsx`, `DeckListPage.jsx`).

- [ ] **Step 1: Write the failing test**

```js
// src/components/new/deck/theme/themeTokens.test.js
import { describe, it, expect } from "vitest";
import { THEME_REGISTRY, DEFAULT_THEME_ID, getTheme, normalizeTheme, themeToCssVars, themeToRootStyle } from "./themeTokens";

const REQUIRED_COLOR_KEYS = ["background", "surface", "surfaceMuted", "primary", "secondary", "accent", "text", "textMuted", "border"];
const REQUIRED_TYPOGRAPHY_KEYS = ["headingFont", "bodyFont", "headingWeight", "bodyWeight", "headingScale", "bodyScale", "lineHeight"];

describe("THEME_REGISTRY", () => {
  it("has exactly the 7 expected themes, each with a complete token shape", () => {
    const ids = THEME_REGISTRY.map((t) => t.id);
    expect(ids).toEqual(["default", "dark", "light", "minimal", "modern", "bold", "professional"]);

    for (const theme of THEME_REGISTRY) {
      expect(typeof theme.name).toBe("string");
      REQUIRED_COLOR_KEYS.forEach((key) => expect(theme.colors[key]).toBeTruthy());
      REQUIRED_TYPOGRAPHY_KEYS.forEach((key) => expect(theme.typography[key]).toBeDefined());
      expect(theme.spacing).toMatchObject({ xs: expect.any(String), sm: expect.any(String), md: expect.any(String), lg: expect.any(String), xl: expect.any(String) });
      expect(theme.radius).toMatchObject({ sm: expect.any(String), md: expect.any(String), lg: expect.any(String) });
      expect(theme.shadows).toMatchObject({ sm: expect.any(String), md: expect.any(String), lg: expect.any(String) });
      expect(theme.borders).toMatchObject({ width: expect.any(String), style: expect.any(String) });
      expect(theme.defaultBackground).toMatchObject({ kind: "solid", color: theme.colors.background });
    }
  });

  it("has a default theme matching DEFAULT_THEME_ID", () => {
    expect(THEME_REGISTRY.some((t) => t.id === DEFAULT_THEME_ID)).toBe(true);
  });
});

describe("getTheme", () => {
  it("returns the matching registry theme by id", () => {
    expect(getTheme("dark").id).toBe("dark");
  });

  it("falls back to the default theme for an unknown id", () => {
    expect(getTheme("not-a-real-theme").id).toBe(DEFAULT_THEME_ID);
  });

  it("returns an independent copy each call (mutating one does not affect the registry)", () => {
    const a = getTheme("dark");
    a.colors.primary = "#000000";
    const b = getTheme("dark");
    expect(b.colors.primary).not.toBe("#000000");
  });
});

describe("normalizeTheme", () => {
  it("maps a legacy bare-string theme to a full structured theme", () => {
    const result = normalizeTheme("dark");
    expect(result.id).toBeTruthy();
    REQUIRED_COLOR_KEYS.forEach((key) => expect(result.colors[key]).toBeTruthy());
  });

  it("falls back to the default theme for an unrecognized legacy string", () => {
    expect(normalizeTheme("some-unknown-legacy-value").id).toBe(DEFAULT_THEME_ID);
  });

  it("returns the default theme for null/undefined", () => {
    expect(normalizeTheme(null).id).toBe(DEFAULT_THEME_ID);
    expect(normalizeTheme(undefined).id).toBe(DEFAULT_THEME_ID);
  });

  it("fills in missing groups on a partial structured theme without discarding provided values", () => {
    const partial = { id: "dark", colors: { primary: "#custom-primary" } };
    const result = normalizeTheme(partial);
    expect(result.colors.primary).toBe("#custom-primary");
    // Every other color key still gets filled in from the "dark" base theme.
    expect(result.colors.background).toBe(getTheme("dark").colors.background);
    expect(result.typography.headingFont).toBeTruthy();
  });

  it("is idempotent on an already-current full theme object", () => {
    const full = getTheme("modern");
    const result = normalizeTheme(full);
    expect(result).toEqual(full);
  });
});

describe("themeToCssVars", () => {
  it("produces --theme-* custom properties for colors and typography", () => {
    const vars = themeToCssVars(getTheme("light"));
    expect(vars["--theme-background"]).toBe(getTheme("light").colors.background);
    expect(vars["--theme-text"]).toBe(getTheme("light").colors.text);
    expect(vars["--theme-primary"]).toBe(getTheme("light").colors.primary);
    expect(vars["--theme-heading-font"]).toBe(getTheme("light").typography.headingFont);
    expect(vars["--theme-body-font"]).toBe(getTheme("light").typography.bodyFont);
    expect(vars["--theme-radius-md"]).toBe(getTheme("light").radius.md);
  });
});

describe("themeToRootStyle", () => {
  it("includes the CSS vars plus a directly-applied background/text color", () => {
    const theme = getTheme("bold");
    const style = themeToRootStyle(theme);
    expect(style["--theme-primary"]).toBe(theme.colors.primary);
    expect(style.backgroundColor).toBe(theme.colors.background);
    expect(style.color).toBe(theme.colors.text);
    expect(style.fontFamily).toBe(theme.typography.bodyFont);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/new/deck/theme/themeTokens.test.js`
Expected: FAIL — `Cannot find module './themeTokens'` (the file doesn't exist yet).

- [ ] **Step 3: Write the implementation**

```js
// src/components/new/deck/theme/themeTokens.js
// Global design-token foundation for the editor. Every layout and
// free-element widget reads these values through CSS custom properties
// (see themeToCssVars/themeToRootStyle) rather than hardcoding Tailwind
// color/font classes, per the theme sub-project brief.

export const DEFAULT_THEME_ID = "default";

function theme({
  id,
  name,
  colors,
  typography,
  spacing = { xs: "0.5rem", sm: "1rem", md: "1.5rem", lg: "2.5rem", xl: "4rem" },
  radius = { sm: "0.375rem", md: "0.75rem", lg: "1.5rem" },
  shadows = {
    sm: "0 1px 2px rgba(0,0,0,0.08)",
    md: "0 4px 12px rgba(0,0,0,0.16)",
    lg: "0 12px 32px rgba(0,0,0,0.24)",
  },
  borders = { width: "1px", style: "solid" },
}) {
  return {
    id,
    name,
    colors,
    typography,
    spacing,
    radius,
    shadows,
    borders,
    // Prepares the future Background system's two-tier hierarchy (deck
    // default vs. slide override) without implementing it yet - nothing
    // reads this field this sub-project.
    defaultBackground: { kind: "solid", color: colors.background },
  };
}

export const THEME_REGISTRY = [
  theme({
    id: "default",
    name: "Default",
    colors: {
      background: "#0b2d2b",
      surface: "#123c39",
      surfaceMuted: "rgba(255,255,255,0.08)",
      primary: "#2dd4bf",
      secondary: "#14b8a6",
      accent: "#5eead4",
      text: "#ffffff",
      textMuted: "rgba(255,255,255,0.7)",
      border: "rgba(255,255,255,0.14)",
    },
    typography: {
      headingFont: "Inter, system-ui, sans-serif",
      bodyFont: "Inter, system-ui, sans-serif",
      headingWeight: 700,
      bodyWeight: 400,
      headingScale: 1,
      bodyScale: 1,
      lineHeight: 1.5,
    },
  }),
  theme({
    id: "dark",
    name: "Dark",
    colors: {
      background: "#0f1115",
      surface: "#1a1d24",
      surfaceMuted: "rgba(255,255,255,0.06)",
      primary: "#6366f1",
      secondary: "#818cf8",
      accent: "#a5b4fc",
      text: "#f5f5f7",
      textMuted: "rgba(245,245,247,0.65)",
      border: "rgba(255,255,255,0.12)",
    },
    typography: {
      headingFont: "Inter, system-ui, sans-serif",
      bodyFont: "Inter, system-ui, sans-serif",
      headingWeight: 700,
      bodyWeight: 400,
      headingScale: 1,
      bodyScale: 1,
      lineHeight: 1.5,
    },
  }),
  theme({
    id: "light",
    name: "Light",
    colors: {
      background: "#ffffff",
      surface: "#f4f4f5",
      surfaceMuted: "rgba(0,0,0,0.04)",
      primary: "#2563eb",
      secondary: "#1d4ed8",
      accent: "#60a5fa",
      text: "#111827",
      textMuted: "rgba(17,24,39,0.6)",
      border: "rgba(0,0,0,0.1)",
    },
    typography: {
      headingFont: "Inter, system-ui, sans-serif",
      bodyFont: "Inter, system-ui, sans-serif",
      headingWeight: 700,
      bodyWeight: 400,
      headingScale: 1,
      bodyScale: 1,
      lineHeight: 1.5,
    },
  }),
  theme({
    id: "minimal",
    name: "Minimal",
    colors: {
      background: "#fafaf9",
      surface: "#f0efec",
      surfaceMuted: "rgba(0,0,0,0.03)",
      primary: "#18181b",
      secondary: "#3f3f46",
      accent: "#71717a",
      text: "#18181b",
      textMuted: "rgba(24,24,27,0.55)",
      border: "rgba(0,0,0,0.08)",
    },
    typography: {
      headingFont: "'Helvetica Neue', Arial, sans-serif",
      bodyFont: "'Helvetica Neue', Arial, sans-serif",
      headingWeight: 600,
      bodyWeight: 400,
      headingScale: 0.95,
      bodyScale: 1,
      lineHeight: 1.6,
    },
    radius: { sm: "0.125rem", md: "0.25rem", lg: "0.5rem" },
  }),
  theme({
    id: "modern",
    name: "Modern",
    colors: {
      background: "#0b1120",
      surface: "#111827",
      surfaceMuted: "rgba(255,255,255,0.05)",
      primary: "#f97316",
      secondary: "#fb923c",
      accent: "#fbbf24",
      text: "#f8fafc",
      textMuted: "rgba(248,250,252,0.65)",
      border: "rgba(255,255,255,0.1)",
    },
    typography: {
      headingFont: "Poppins, system-ui, sans-serif",
      bodyFont: "Inter, system-ui, sans-serif",
      headingWeight: 700,
      bodyWeight: 400,
      headingScale: 1.05,
      bodyScale: 1,
      lineHeight: 1.5,
    },
    radius: { sm: "0.5rem", md: "1rem", lg: "2rem" },
  }),
  theme({
    id: "bold",
    name: "Bold",
    colors: {
      background: "#18181b",
      surface: "#27272a",
      surfaceMuted: "rgba(255,255,255,0.07)",
      primary: "#ef4444",
      secondary: "#dc2626",
      accent: "#f87171",
      text: "#ffffff",
      textMuted: "rgba(255,255,255,0.7)",
      border: "rgba(255,255,255,0.15)",
    },
    typography: {
      headingFont: "'Archivo Black', Inter, system-ui, sans-serif",
      bodyFont: "Inter, system-ui, sans-serif",
      headingWeight: 800,
      bodyWeight: 500,
      headingScale: 1.1,
      bodyScale: 1,
      lineHeight: 1.4,
    },
    radius: { sm: "0rem", md: "0.25rem", lg: "0.5rem" },
    borders: { width: "2px", style: "solid" },
  }),
  theme({
    id: "professional",
    name: "Professional",
    colors: {
      background: "#0a1a2f",
      surface: "#10233d",
      surfaceMuted: "rgba(255,255,255,0.05)",
      primary: "#c9a24b",
      secondary: "#b8933d",
      accent: "#e2c275",
      text: "#f1f5f9",
      textMuted: "rgba(241,245,249,0.65)",
      border: "rgba(255,255,255,0.12)",
    },
    typography: {
      headingFont: "Georgia, 'Times New Roman', serif",
      bodyFont: "Inter, system-ui, sans-serif",
      headingWeight: 700,
      bodyWeight: 400,
      headingScale: 1,
      bodyScale: 1,
      lineHeight: 1.6,
    },
    radius: { sm: "0.25rem", md: "0.5rem", lg: "1rem" },
  }),
];

const THEME_BY_ID = new Map(THEME_REGISTRY.map((t) => [t.id, t]));

// Legacy bare-string theme values (the only shape `deck.theme` could hold
// before this sub-project) mapped onto the closest new registry theme.
const LEGACY_STRING_THEME_MAP = {
  dark: "dark",
  light: "light",
  warm: "modern",
  DeepPurple: "bold",
  DarkBlue: "professional",
  EarthStone: "minimal",
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getTheme(id) {
  const found = THEME_BY_ID.get(id);
  return deepClone(found ?? THEME_BY_ID.get(DEFAULT_THEME_ID));
}

function mergeGroup(base, override) {
  if (!override || typeof override !== "object") return { ...base };
  return { ...base, ...override };
}

// Accepts whatever `deck.theme` might currently hold - a legacy bare
// string, a partial/future-shaped object, or an already-current full
// theme object - and always returns a complete, current-shape theme.
// Must be idempotent: running it twice in a row is a no-op the second time.
export function normalizeTheme(value) {
  if (typeof value === "string") {
    return getTheme(LEGACY_STRING_THEME_MAP[value] ?? DEFAULT_THEME_ID);
  }
  if (!value || typeof value !== "object") {
    return getTheme(DEFAULT_THEME_ID);
  }

  const base = getTheme(THEME_BY_ID.has(value.id) ? value.id : DEFAULT_THEME_ID);

  return {
    id: value.id ?? base.id,
    name: value.name ?? base.name,
    colors: mergeGroup(base.colors, value.colors),
    typography: mergeGroup(base.typography, value.typography),
    spacing: mergeGroup(base.spacing, value.spacing),
    radius: mergeGroup(base.radius, value.radius),
    shadows: mergeGroup(base.shadows, value.shadows),
    borders: mergeGroup(base.borders, value.borders),
    defaultBackground: value.defaultBackground ?? base.defaultBackground,
  };
}

// Vars every layout/widget can reference via var(--theme-*) regardless of
// where in the tree they're rendered, as long as they're a descendant of
// whatever element themeToRootStyle/themeToCssVars was applied to.
export function themeToCssVars(theme) {
  return {
    "--theme-background": theme.colors.background,
    "--theme-surface": theme.colors.surface,
    "--theme-surface-muted": theme.colors.surfaceMuted,
    "--theme-primary": theme.colors.primary,
    "--theme-secondary": theme.colors.secondary,
    "--theme-accent": theme.colors.accent,
    "--theme-text": theme.colors.text,
    "--theme-text-muted": theme.colors.textMuted,
    "--theme-border": theme.colors.border,
    "--theme-heading-font": theme.typography.headingFont,
    "--theme-body-font": theme.typography.bodyFont,
    "--theme-heading-weight": theme.typography.headingWeight,
    "--theme-body-weight": theme.typography.bodyWeight,
    "--theme-line-height": theme.typography.lineHeight,
    "--theme-radius-sm": theme.radius.sm,
    "--theme-radius-md": theme.radius.md,
    "--theme-radius-lg": theme.radius.lg,
  };
}

// For the single root element that should visibly repaint on theme change
// (the editor's outermost wrapper) - the CSS vars plus a directly-applied
// background/text/font so the change is visible even before any descendant
// references a var(--theme-*).
export function themeToRootStyle(theme) {
  return {
    ...themeToCssVars(theme),
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontFamily: theme.typography.bodyFont,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/new/deck/theme/themeTokens.test.js`
Expected: PASS (all cases above).

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/theme/themeTokens.js src/components/new/deck/theme/themeTokens.test.js
git commit -m "feat: add theme token schema, 7-theme registry, and CSS var helpers"
```

---

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

### Task 4: `RichText` accepts an optional `style` prop

**Files:**
- Modify: `src/components/new/deck/RichText.jsx`
- Test: `src/components/new/deck/RichText.test.jsx`

**Interfaces:**
- Produces: `<RichText style={{...}} .../>` renders that `style` on the underlying tag, exactly like `className` already does. No other prop or behavior changes.
- Consumed by: Task 6 (layouts set `style={{ fontFamily: "var(--theme-heading-font)" }}` etc. on heading/body `RichText` fields).

- [ ] **Step 1: Write the failing test**

Add to `src/components/new/deck/RichText.test.jsx` (check the existing file first for its exact render/setup helper and reuse it — the shape below matches the component's public API):

```js
it("forwards a style prop to the underlying element", () => {
  render(<RichText as="h1" className="text-5xl" style={{ fontFamily: "Georgia, serif" }} value="Hi" onChange={() => {}} />);
  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading.style.fontFamily).toBe("Georgia, serif");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/new/deck/RichText.test.jsx`
Expected: FAIL — `heading.style.fontFamily` is `""` because `style` is never forwarded.

- [ ] **Step 3: Write the implementation**

In `src/components/new/deck/RichText.jsx`:

```js
export function RichText({ value, onChange, toolbarButtons, className, style, as: Tag = "div" }) {
```

and:

```js
  return <Tag ref={ref} className={className} style={style} />;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/new/deck/RichText.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/RichText.jsx src/components/new/deck/RichText.test.jsx
git commit -m "feat: RichText forwards an optional style prop"
```

---

### Task 5: Wire the theme registry into `EditorPage.jsx` and deck creation

**Files:**
- Modify: `src/components/new/EditorPage.jsx`
- Modify: `src/components/new/DeckListPage.jsx`

**Interfaces:**
- Consumes: `THEME_REGISTRY`, `getTheme`, `DEFAULT_THEME_ID`, `themeToRootStyle` from `./deck/theme/themeTokens` (Task 1); dispatches `{ type: "SET_DECK_THEME", theme }` (Task 2).
- Produces: no new exports; `EditorPageBody` no longer has `uiTheme`/`currentTheme` local state — `deck.theme` (already a full structured object by the time it reaches `EditorPageBody`, via `buildSeedDeck` or `migrateDeck`) is the only theme source.

**Do not touch:** the `themes`, `themes2`, `backgrounds` consts or any of the ~3,700 lines of legacy dead layout components (`TheChallangePage`, `TitleOnlyPage`, `LayoutPicker`'s internal `themes[theme]`/`backgrounds[background]` lookups, etc.) — they are pre-existing dead code, explicitly deferred for deletion (status doc §4), and `LayoutPicker`'s `theme`/`background` props are already inert today (the caller passes a resolved theme *object* into a lookup keyed by *string id*, so `themes[theme]` is already always `undefined` before this change — confirm this by reading current `EditorPage.jsx` lines 3732-3772 and 4194-4200 before editing). This task only removes the now-dead `theme={currentTheme}` prop being passed into `LayoutPicker`, it does not touch `LayoutPicker` itself.

- [ ] **Step 1: Add the theme registry import**

Add to the top imports of `src/components/new/EditorPage.jsx`, alongside the other `./deck/...` imports:

```js
import { THEME_REGISTRY, getTheme, DEFAULT_THEME_ID, themeToRootStyle } from "./deck/theme/themeTokens";
```

- [ ] **Step 2: Update `buildSeedDeck` to use a structured theme**

Change:

```js
export function buildSeedDeck(title = "Untitled Deck") {
  return createDeck({
    title,
    theme: "dark",
```

to:

```js
export function buildSeedDeck(title = "Untitled Deck") {
  return createDeck({
    title,
    theme: getTheme(DEFAULT_THEME_ID),
```

- [ ] **Step 3: Remove `uiTheme` local state and the old `currentTheme` derivation**

In `EditorPageBody`, delete:

```js
  // NOTE: building a richer background/theme *picker UI* is out of scope (see the
  // plan's "Explicitly out of scope"). The existing background swatches, however,
  // write through to the deck model: per-slide background lives on
  // `currentSlide.background` and is applied by `SlideCanvas`.
  // `uiTheme` is still local - no reducer action exists for deck theme yet.
  const [uiTheme, setUiTheme] = useState(deck.theme || 'dark');
```

and delete the line:

```js
  const currentTheme = themes[uiTheme] || themes.dark;
```

Add in its place (same location, right before the `useEffect` that follows it):

```js
  // `deck.theme` is always a full structured theme by the time it reaches
  // this component - either from `buildSeedDeck` (new/local deck) or
  // `migrateDeck` (loaded from the backend) - so no normalization happens
  // here; this component only ever reads/dispatches it.
  const deckTheme = deck.theme;
```

- [ ] **Step 4: Replace `handleThemeChange` to dispatch `SET_DECK_THEME`**

Change:

```js
  const handleThemeChange = (newTheme) => {
    setUiTheme(newTheme);
    setShowThemeModal(false);
  };
```

to:

```js
  const handleThemeChange = (themeId) => {
    dispatch({ type: "SET_DECK_THEME", theme: getTheme(themeId) });
    setShowThemeModal(false);
  };
```

- [ ] **Step 5: Apply the theme as CSS vars on the outermost wrapper**

Find the top-level return's outermost wrapper (the element with `className="font-sans antialiased h-screen w-screen flex overflow-hidden"`, which is a sibling of `<SlideSidebar>` and the `.App` div — applying the vars here, not on `.App`, means `SlideSidebar`'s thumbnails can also read `var(--theme-*)` later without another wiring pass). Add a `style` prop:

```jsx
    <div className="font-sans antialiased h-screen w-screen flex overflow-hidden" style={themeToRootStyle(deckTheme)}>
```

Then remove the now-dead dynamic classes from the `.App` div right below it:

```jsx
      <div className={`App relative flex-1 h-screen overflow-hidden ${currentTheme.bg} ${currentTheme.text}`}>
```

becomes:

```jsx
      <div className="App relative flex-1 h-screen overflow-hidden">
```

(`SlideSidebar` keeps its own explicit dark chrome background classes unchanged — those are more specific than the inherited wrapper background, so its appearance does not change.)

- [ ] **Step 6: Stop passing the now-meaningless `theme` prop to `LayoutPicker`**

Change:

```jsx
      {showLayoutPicker && (
        <LayoutPicker
          theme={currentTheme}
          onSelect={handleAddSlide}
          onClose={() => { setShowLayoutPicker(false); setInsertAfterSlideId(null); }}
        />
      )}
```

to:

```jsx
      {showLayoutPicker && (
        <LayoutPicker
          onSelect={handleAddSlide}
          onClose={() => { setShowLayoutPicker(false); setInsertAfterSlideId(null); }}
        />
      )}
```

- [ ] **Step 7: Rewrite the Theme Selection Modal to render the registry**

Replace the entire `{/* Theme Selection Modal */}` block (the `showThemeModal &&` block with the 6 hardcoded `Dark`/`Light`/`Warm`/`DeepPurple`/`DarkBlue`/`EarthStone` buttons) with:

```jsx
      {/* Theme Selection Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[100]">
          <div className="bg-[#0b2d2b] border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-6 text-white/90">Choose a Theme</h2>
            <div className="flex gap-4 flex-wrap justify-center max-w-2xl">
              {THEME_REGISTRY.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => handleThemeChange(themeOption.id)}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl w-28 h-28 border-2 transition-colors ${
                    deckTheme.id === themeOption.id ? "border-teal-400" : "border-transparent hover:border-teal-400/50"
                  }`}
                  style={{ backgroundColor: themeOption.colors.background }}
                >
                  {deckTheme.id === themeOption.id && (
                    <Check size={16} className="absolute top-2 right-2" style={{ color: themeOption.colors.primary }} />
                  )}
                  <div className="w-10 h-10 rounded-full mb-2" style={{ backgroundColor: themeOption.colors.primary }} />
                  <span className="text-sm font-medium" style={{ color: themeOption.colors.text }}>
                    {themeOption.name}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowThemeModal(false)}
              className="mt-6 px-5 py-2 bg-white/10 text-white/90 rounded-xl hover:bg-white/20 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
```

(`Check` is already imported at the top of the file — `import { ImageIcon, Check } from 'lucide-react';`.)

- [ ] **Step 8: Update `DeckListPage.jsx`'s create-deck default theme**

Read `src/components/new/DeckListPage.jsx` around its `deckApi.createDeck(...)` call. Add the import:

```js
import { getTheme, DEFAULT_THEME_ID } from "./deck/theme/themeTokens";
```

Change:

```js
const res = await deckApi.createDeck({ title: "Untitled Deck", theme: "dark", slides: [] });
```

to:

```js
const res = await deckApi.createDeck({ title: "Untitled Deck", theme: getTheme(DEFAULT_THEME_ID), slides: [] });
```

- [ ] **Step 9: Run the full test suite and the build**

Run: `npm test`
Expected: PASS, no regressions.

Run: `npm run build`
Expected: succeeds with no new errors.

Run: `npx eslint src/components/new/EditorPage.jsx src/components/new/DeckListPage.jsx`
Expected: no new lint errors introduced by this task (pre-existing lint errors in the untouched legacy dead-code section, if any, are unrelated and unchanged).

- [ ] **Step 10: Commit**

```bash
git add src/components/new/EditorPage.jsx src/components/new/DeckListPage.jsx
git commit -m "feat: wire theme registry into EditorPage - live SET_DECK_THEME picker, CSS vars"
```

---

### Task 6: Refactor the 7 layouts to consume theme tokens

**Files:**
- Modify: `src/components/new/deck/layouts/TitleLayout.jsx`
- Modify: `src/components/new/deck/layouts/ProblemLayout.jsx`
- Modify: `src/components/new/deck/layouts/MediaDescriptionLayout.jsx`
- Modify: `src/components/new/deck/layouts/Media3PointsLayout.jsx`
- Modify: `src/components/new/deck/layouts/MetricsGridLayout.jsx`
- Modify: `src/components/new/deck/layouts/TeamGridLayout.jsx`
- Modify: `src/components/new/deck/layouts/CtaLayout.jsx`
- Modify: `src/components/new/deck/layouts/CtaLayout.test.jsx`

**Interfaces:**
- Consumes: the `--theme-heading-font`/`--theme-body-font`/`--theme-primary`/`--theme-background`/`--theme-surface-muted` CSS variables (Task 1), which are available on every layout because they're rendered as a descendant of the wrapper `EditorPage.jsx` applies `themeToRootStyle` to (Task 5); and the `style` prop `RichText` now forwards (Task 4).
- No prop signature changes — every layout keeps its existing `({ content, onChangeContent })` interface, so `SlideCanvas.jsx` and `SlideRegistry.js` need no changes.

Text color itself needs no change in any layout: none of the 7 layouts sets its own text-color Tailwind class today (color already cascades from the ancestor wrapper, which Task 5 now paints with `--theme-text` via `themeToRootStyle`). This task only needs to: (a) put heading/body font-family on theme tokens, and (b) replace the two spots that hardcode a Tailwind color/accent instead of inheriting: `CtaLayout`'s button and the `MediaDescriptionLayout`/`Media3PointsLayout` empty-media placeholders.

- [ ] **Step 1: `TitleLayout.jsx`**

```jsx
import React from "react";
import { RichText } from "../RichText";

export function defaultTitleContent() {
  return { title: "Title Only", subtitle: "" };
}

export function TitleLayout({ content, onChangeContent }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 sm:p-16 text-center">
      <RichText
        as="h1"
        className="text-7xl font-bold"
        style={{ fontFamily: "var(--theme-heading-font)" }}
        value={content.title}
        onChange={(html) => onChangeContent({ title: html })}
      />
      {content.subtitle ? (
        <div data-field="subtitle" className="mt-4">
          <RichText
            as="p"
            className="text-2xl opacity-60"
            style={{ fontFamily: "var(--theme-body-font)" }}
            value={content.subtitle}
            onChange={(html) => onChangeContent({ subtitle: html })}
          />
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: `ProblemLayout.jsx`**

```jsx
import React from "react";
import { RichText } from "../RichText";

export function defaultProblemContent() {
  return { heading: "The Problem", body: "<p>Describe the problem your customers face.</p>" };
}

export function ProblemLayout({ content, onChangeContent }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 sm:p-16">
      <RichText
        as="h1"
        className="text-5xl font-bold text-center"
        style={{ fontFamily: "var(--theme-heading-font)" }}
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <RichText
        as="div"
        className="mt-8 text-xl opacity-80 max-w-3xl text-left"
        style={{ fontFamily: "var(--theme-body-font)" }}
        toolbarButtons={["bold", "italic", "underline", "fontSize", "textColor", "backgroundColor", "formatUL", "formatOL"]}
        value={content.body}
        onChange={(html) => onChangeContent({ body: html })}
      />
    </div>
  );
}
```

- [ ] **Step 3: `MediaDescriptionLayout.jsx`**

```jsx
import React from "react";
import { RichText } from "../RichText";

export function defaultMediaDescriptionContent() {
  return {
    heading: "Product Overview",
    body: "<p>Describe what you've built.</p>",
    media: { url: "", type: "image" },
    mediaPosition: "left",
  };
}

function MediaColumn({ media }) {
  if (!media.url) {
    return (
      <div
        data-col="media"
        data-testid="media-placeholder"
        className="flex-1 rounded-2xl min-h-[300px]"
        style={{ backgroundColor: "var(--theme-surface-muted)" }}
      />
    );
  }
  if (media.type === "video") {
    return (
      <div data-col="media" className="flex-1">
        <video src={media.url} controls className="w-full rounded-2xl" />
      </div>
    );
  }
  return (
    <div data-col="media" className="flex-1">
      <img src={media.url} alt="" className="w-full rounded-2xl object-cover" />
    </div>
  );
}

export function MediaDescriptionLayout({ content, onChangeContent }) {
  const textColumn = (
    <div data-col="text" className="flex-1 flex flex-col justify-center">
      <RichText
        as="h2"
        className="text-4xl font-bold"
        style={{ fontFamily: "var(--theme-heading-font)" }}
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <RichText
        as="div"
        className="mt-6 text-lg opacity-80"
        style={{ fontFamily: "var(--theme-body-font)" }}
        value={content.body}
        onChange={(html) => onChangeContent({ body: html })}
      />
    </div>
  );
  const mediaColumn = <MediaColumn media={content.media} />;

  return (
    <div className="grid place-items-center h-full w-full p-8 sm:p-16">
      <div className="flex gap-10 w-full max-w-6xl items-center">
        {content.mediaPosition === "left" ? mediaColumn : textColumn}
        {content.mediaPosition === "left" ? textColumn : mediaColumn}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: `Media3PointsLayout.jsx`**

```jsx
import React from "react";
import { RichText } from "../RichText";

export function defaultMedia3PointsContent() {
  return {
    heading: "Key Features",
    media: { url: "", type: "image" },
    points: [
      { title: "Feature 1", body: "" },
      { title: "Feature 2", body: "" },
      { title: "Feature 3", body: "" },
    ],
  };
}

export function Media3PointsLayout({ content, onChangeContent }) {
  const visiblePoints = content.points.slice(0, 3);

  function updatePoint(index, patch) {
    const points = content.points.map((p, i) => (i === index ? { ...p, ...patch } : p));
    onChangeContent({ points });
  }

  return (
    <div className="flex flex-col h-full w-full p-8 sm:p-16">
      <RichText
        as="h2"
        className="text-4xl font-bold text-center"
        style={{ fontFamily: "var(--theme-heading-font)" }}
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <div className="mt-10 flex gap-8">
        {content.media.url ? (
          <img src={content.media.url} alt="" className="flex-1 rounded-2xl object-cover" />
        ) : (
          <div className="flex-1 rounded-2xl min-h-[300px]" style={{ backgroundColor: "var(--theme-surface-muted)" }} />
        )}
        <div className="flex-1 flex flex-col gap-6">
          {visiblePoints.map((point, index) => (
            <div key={index}>
              {point.title ? (
                <RichText
                  as="h3"
                  className="text-xl font-semibold"
                  style={{ fontFamily: "var(--theme-heading-font)" }}
                  value={point.title}
                  onChange={(html) => updatePoint(index, { title: html })}
                />
              ) : null}
              <RichText
                as="p"
                className="opacity-80"
                style={{ fontFamily: "var(--theme-body-font)" }}
                value={point.body}
                onChange={(html) => updatePoint(index, { body: html })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: `MetricsGridLayout.jsx`**

```jsx
import React from "react";
import { RichText } from "../RichText";

export function defaultMetricsGridContent() {
  return {
    heading: "Metrics & Traction",
    metrics: [
      { value: "0", label: "Metric 1" },
      { value: "0", label: "Metric 2" },
      { value: "0", label: "Metric 3" },
    ],
  };
}

export function MetricsGridLayout({ content, onChangeContent }) {
  function updateMetric(index, patch) {
    const metrics = content.metrics.map((m, i) => (i === index ? { ...m, ...patch } : m));
    onChangeContent({ metrics });
  }

  return (
    <div className="flex flex-col h-full w-full p-8 sm:p-16">
      <RichText
        as="h2"
        className="text-4xl font-bold text-center"
        style={{ fontFamily: "var(--theme-heading-font)" }}
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {content.metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <RichText
              as="div"
              className="text-5xl font-bold"
              style={{ fontFamily: "var(--theme-heading-font)", color: "var(--theme-primary)" }}
              value={metric.value}
              onChange={(html) => updateMetric(index, { value: html })}
            />
            <RichText
              as="div"
              className="mt-2 opacity-70"
              style={{ fontFamily: "var(--theme-body-font)" }}
              value={metric.label}
              onChange={(html) => updateMetric(index, { label: html })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: `TeamGridLayout.jsx`**

```jsx
import React from "react";
import { RichText } from "../RichText";

export function defaultTeamGridContent() {
  return { heading: "Team", members: [{ photoUrl: "", name: "Name", role: "Role" }] };
}

export function TeamGridLayout({ content, onChangeContent }) {
  function updateMember(index, patch) {
    const members = content.members.map((m, i) => (i === index ? { ...m, ...patch } : m));
    onChangeContent({ members });
  }

  return (
    <div className="flex flex-col h-full w-full p-8 sm:p-16">
      <RichText
        as="h2"
        className="text-4xl font-bold text-center"
        style={{ fontFamily: "var(--theme-heading-font)" }}
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {content.members.map((member, index) => (
          <div key={index} className="text-center">
            {member.photoUrl ? (
              <img src={member.photoUrl} alt={member.name} className="w-24 h-24 rounded-full mx-auto object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full mx-auto" style={{ backgroundColor: "var(--theme-surface-muted)" }} />
            )}
            <RichText
              as="div"
              className="mt-4 font-semibold"
              style={{ fontFamily: "var(--theme-heading-font)" }}
              value={member.name}
              onChange={(html) => updateMember(index, { name: html })}
            />
            <RichText
              as="div"
              className="opacity-70"
              style={{ fontFamily: "var(--theme-body-font)" }}
              value={member.role}
              onChange={(html) => updateMember(index, { role: html })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: `CtaLayout.jsx`**

```jsx
import React from "react";
import { RichText } from "../RichText";

export function defaultCtaContent() {
  return { heading: "Join Us", body: "<p>Let's build the future together.</p>", buttonLabel: "Get in touch" };
}

export function CtaLayout({ content, onChangeContent }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 sm:p-16 text-center">
      <RichText
        as="h1"
        className="text-5xl font-bold"
        style={{ fontFamily: "var(--theme-heading-font)" }}
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <RichText
        as="div"
        className="mt-6 text-xl opacity-80 max-w-2xl"
        style={{ fontFamily: "var(--theme-body-font)" }}
        value={content.body}
        onChange={(html) => onChangeContent({ body: html })}
      />
      <RichText
        as="div"
        className="mt-10 inline-block px-8 py-3 rounded-full font-semibold"
        style={{ backgroundColor: "var(--theme-primary)", color: "var(--theme-background)", fontFamily: "var(--theme-body-font)" }}
        value={content.buttonLabel}
        onChange={(html) => onChangeContent({ buttonLabel: html })}
      />
    </div>
  );
}
```

- [ ] **Step 8: Add a regression test that the CTA button no longer hardcodes a color**

Add to `src/components/new/deck/layouts/CtaLayout.test.jsx` (inside the existing `describe("CtaLayout", ...)` block):

```js
  it("styles the button from theme tokens instead of a hardcoded color", () => {
    render(
      <CtaLayout
        content={{ heading: "Join Us", body: "<p>Reach out.</p>", buttonLabel: "Contact us" }}
        onChangeContent={() => {}}
      />
    );
    const button = screen.getByText("Contact us");
    expect(button.className).not.toMatch(/bg-teal-400|text-black/);
    expect(button.style.backgroundColor).toBe("var(--theme-primary)");
    expect(button.style.color).toBe("var(--theme-background)");
  });
```

- [ ] **Step 9: Run the full suite**

Run: `npm test`
Expected: PASS — every pre-existing layout test still passes unchanged (none of them asserted on color, only on text content — verified by reading each `*.test.jsx` in this directory before this task), plus the new CTA test.

- [ ] **Step 10: Commit**

```bash
git add src/components/new/deck/layouts/*.jsx src/components/new/deck/layouts/CtaLayout.test.jsx
git commit -m "refactor: layouts consume theme tokens via CSS variables instead of hardcoded colors"
```

---

### Task 7: Free-element widgets default to theme tokens, explicit overrides win

**Files:**
- Modify: `src/components/new/deck/widgets/TextWidget.jsx`
- Modify: `src/components/new/deck/widgets/ShapeWidget.jsx`
- Modify: `src/components/new/deck/widgets/DividerWidget.jsx`
- Modify: `src/components/new/deck/widgets/IconWidget.jsx`
- Modify: `src/components/new/deck/freeElementFactory.js`
- Test: `src/components/new/deck/widgets/ThemeDefaults.test.jsx` (new)

**Interfaces:**
- Consumes: `--theme-text`/`--theme-body-font`/`--theme-accent`/`--theme-border` CSS variables (Task 1).
- Produces: no prop/signature changes to any widget or to `createWidget`/`duplicateWidget` — only the *values* baked into `WIDGET_DEFAULTS` and the fallback used when a prop is absent change. `duplicateWidget` is unaffected (it copies `element.props` verbatim, whatever they are).

**Design point this task must preserve:** an element with an explicit `props.fill`/`props.color` (however it got set — future color picker, or a value already saved in an existing deck) always keeps rendering that exact value. Only a *missing* prop key falls back to the theme's CSS variable. Newly-created shape/divider/icon elements no longer bake in a hardcoded hex default, so they pick up the live theme by default — that's the actual "free elements inherit theme" behavior the brief asks for.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/new/deck/widgets/ThemeDefaults.test.jsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TextWidget } from "./TextWidget";
import { ShapeWidget } from "./ShapeWidget";
import { DividerWidget } from "./DividerWidget";
import { IconWidget } from "./IconWidget";
import { createWidget } from "../freeElementFactory";

describe("widgets default to theme CSS variables when no explicit style is set", () => {
  it("TextWidget defaults color/font to theme vars", () => {
    const element = { props: { html: "hi" } };
    const { container } = render(<TextWidget element={element} editing={false} onCommit={() => {}} />);
    const div = container.firstChild;
    expect(div.style.color).toBe("var(--theme-text)");
    expect(div.style.fontFamily).toBe("var(--theme-body-font)");
  });

  it("TextWidget keeps an explicit color/font override", () => {
    const element = { props: { html: "hi", color: "#ff0000", fontFamily: "Comic Sans MS" } };
    const { container } = render(<TextWidget element={element} editing={false} onCommit={() => {}} />);
    const div = container.firstChild;
    expect(div.style.color).toBe("#ff0000");
    expect(div.style.fontFamily).toBe("Comic Sans MS");
  });

  it("ShapeWidget defaults fill to the theme accent var", () => {
    const element = { props: { shape: "rectangle" } };
    const { container } = render(<ShapeWidget element={element} />);
    expect(container.firstChild.style.backgroundColor).toBe("var(--theme-accent)");
  });

  it("ShapeWidget keeps an explicit fill override", () => {
    const element = { props: { shape: "rectangle", fill: "#123456" } };
    const { container } = render(<ShapeWidget element={element} />);
    expect(container.firstChild.style.backgroundColor).toBe("#123456");
  });

  it("DividerWidget defaults color to the theme border var", () => {
    const element = { props: {} };
    const { container } = render(<DividerWidget element={element} />);
    expect(container.firstChild.firstChild.style.backgroundColor).toBe("var(--theme-border)");
  });

  it("IconWidget defaults color to the theme accent var", () => {
    const element = { props: { icon: "Star" } };
    const { container } = render(<IconWidget element={element} />);
    expect(container.firstChild.style.color).toBe("var(--theme-accent)");
  });

  it("createWidget no longer bakes a hardcoded color/fill into new shape/divider/icon elements", () => {
    expect(createWidget("shape").props.fill).toBeUndefined();
    expect(createWidget("divider").props.color).toBeUndefined();
    expect(createWidget("icon").props.color).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/new/deck/widgets/ThemeDefaults.test.jsx`
Expected: FAIL — every default-color assertion fails (widgets currently hardcode `text-white`/`#14b8a6`/`rgba(255,255,255,0.6)`/`#ffffff`, and `createWidget` bakes those same values into `props`).

- [ ] **Step 3: Update the widgets**

`src/components/new/deck/widgets/TextWidget.jsx` — change the `className`/`style`:

```jsx
    <div
      ref={ref}
      contentEditable={editing}
      suppressContentEditableWarning
      className="w-full h-full outline-none text-base leading-snug"
      style={{
        cursor: editing ? "text" : "inherit",
        color: element.props.color || "var(--theme-text)",
        fontFamily: element.props.fontFamily || "var(--theme-body-font)",
      }}
      onBlur={() => onCommit?.(ref.current?.innerHTML ?? "")}
      onPointerDown={(event) => {
        if (editing) event.stopPropagation();
      }}
    />
```

(Removed the hardcoded `text-white` class.)

`src/components/new/deck/widgets/ShapeWidget.jsx`:

```jsx
export function ShapeWidget({ element }) {
  const fill = element.props.fill ?? "var(--theme-accent)";
  const shape = element.props.shape ?? "rectangle";

  return (
    <div
      className="w-full h-full"
      style={{
        backgroundColor: fill,
        borderRadius: shape === "circle" ? "50%" : shape === "rounded" ? "12%" : 0,
      }}
    />
  );
}
```

`src/components/new/deck/widgets/DividerWidget.jsx`:

```jsx
export function DividerWidget({ element }) {
  const color = element.props.color ?? "var(--theme-border)";
  return (
    <div className="w-full h-full flex items-center">
      <div className="w-full" style={{ height: 2, backgroundColor: color }} />
    </div>
  );
}
```

`src/components/new/deck/widgets/IconWidget.jsx`:

```jsx
export function IconWidget({ element }) {
  const Icon = ICONS[element.props.icon] ?? Star;
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ color: element.props.color ?? "var(--theme-accent)" }}>
      <Icon className="w-full h-full" />
    </div>
  );
}
```

- [ ] **Step 4: Stop baking a hardcoded default into new elements**

In `src/components/new/deck/freeElementFactory.js`, change `WIDGET_DEFAULTS`:

```js
const WIDGET_DEFAULTS = {
  text: { w: 28, h: 10, props: { html: "Double-click to edit" } },
  image: { w: 30, h: 30, props: { src: "", alt: "" } },
  video: { w: 40, h: 24, props: { src: "" } },
  shape: { w: 18, h: 18, props: { shape: "rectangle" } },
  divider: { w: 40, h: 1.5, props: {} },
  icon: { w: 8, h: 8, props: { icon: "Star" } },
};
```

(Only the `fill`/`color` keys are removed from `shape`/`divider`/`icon` — `shape`/`icon`'s own type-selector keys stay, since those aren't color/theme concerns.)

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/new/deck/widgets/ThemeDefaults.test.jsx`
Expected: PASS.

- [ ] **Step 6: Run the full suite**

Run: `npm test`
Expected: PASS — in particular, `FreeElementInteraction.integration.test.jsx` should still pass unchanged (it exercises drag/resize/duplicate/layering on shape/divider/etc. elements but doesn't assert on their default color).

- [ ] **Step 7: Commit**

```bash
git add src/components/new/deck/widgets/*.jsx src/components/new/deck/freeElementFactory.js src/components/new/deck/widgets/ThemeDefaults.test.jsx
git commit -m "feat: free-element widgets default to theme tokens, explicit overrides still win"
```

---

### Task 8: Update `docs/EDITOR-V2-STATUS.md`

**Files:**
- Modify: `docs/EDITOR-V2-STATUS.md`

**Interfaces:** none — documentation only.

- [ ] **Step 1: Add a new "Sub-project #6: Theme Token System — Implemented" section**

Insert a new section after "## 1d. Sub-project #5: Slide Sidebar — Implemented" (before "## 2. Not started at all") with this content (fill in the actual final test count from Task 7's Step 6 run and the actual final `npm run build`/`npx eslint` results before writing this — do not guess the numbers):

```markdown
## 1e. Sub-project #6: Theme Token System — Implemented

`deck.theme` is now a structured, persisted design-token object — the global visual foundation for the editor, not a color switcher.

**Theme schema** (`src/components/new/deck/theme/themeTokens.js`): `{ id, name, colors: { background, surface, surfaceMuted, primary, secondary, accent, text, textMuted, border }, typography: { headingFont, bodyFont, headingWeight, bodyWeight, headingScale, bodyScale, lineHeight }, spacing: { xs, sm, md, lg, xl }, radius: { sm, md, lg }, shadows: { sm, md, lg }, borders: { width, style }, defaultBackground }`. `defaultBackground` is populated (`{ kind: "solid", color: colors.background }`) to prepare the future Background system's two-tier hierarchy (brief §11) but nothing reads it yet — the per-slide background system (`SlideCanvas`'s `slideBackgroundStyle`) is unchanged.

**Theme registry**: 7 themes (`default`, `dark`, `light`, `minimal`, `modern`, `bold`, `professional`), each a full token object. `getTheme(id)` returns a defensive deep copy; `normalizeTheme(value)` accepts a legacy bare string, a partial object, or an already-current object and always returns the full current shape (idempotent).

**Token architecture — CSS custom properties, not a new React context**: `themeToRootStyle(theme)`/`themeToCssVars(theme)` turn a theme into `--theme-*` CSS custom properties (plus a directly-applied `backgroundColor`/`color`/`fontFamily` for the one root element). `EditorPage.jsx` applies `themeToRootStyle(deck.theme)` to its outermost wrapper (a shared ancestor of both `SlideSidebar` and the slide canvas), so every layout, `RichText` field, and free-element widget reads the live theme via plain `var(--theme-*)` in an inline `style` — no theme context/hook, no prop drilling, per the brief's "don't introduce a complicated styling framework" instruction.

**Layouts migrated**: all 7 (`Title`, `Problem`, `MediaDescription`, `Media3Points`, `MetricsGrid`, `TeamGrid`, `Cta`) — heading/body `RichText` fields set `style={{ fontFamily: "var(--theme-heading-font)" | "var(--theme-body-font)" }}` (required teaching `RichText` to forward an optional `style` prop, alongside its existing `className`). Text color needed no per-layout change: none of the 7 hardcoded a color class, so they already inherited `--theme-text`'s directly-applied `color` from the new root wrapper. Two hardcoded-color spots were replaced with tokens: `CtaLayout`'s button (`bg-teal-400 text-black` → `var(--theme-primary)`/`var(--theme-background)`) and the empty-media placeholders in `MediaDescriptionLayout`/`Media3PointsLayout`/`TeamGridLayout` (`bg-white/10` → `var(--theme-surface-muted)`).

**Free elements**: `TextWidget`/`ShapeWidget`/`DividerWidget`/`IconWidget` fall back to `var(--theme-text)`/`var(--theme-accent)`/`var(--theme-border)` only when the element has no explicit `props.color`/`props.fill` — an explicit value (however it got set) always wins, per the brief's theme-derived-vs-explicit-override distinction. `freeElementFactory.js`'s `WIDGET_DEFAULTS` no longer bakes a hardcoded hex color into newly-created shape/divider/icon elements, so new free elements pick up the live theme by default.

**Known limitation**: `typography.headingScale`/`typography.bodyScale` and letter-spacing are defined in the token schema (brief §7) but are not yet multiplied into rendered font sizes — each layout still sets its own fixed Tailwind text-size class (e.g. `text-5xl`). Wiring scale into rendered size would mean converting every layout's font-size classes to CSS-variable-driven values, a larger structural change deferred to keep this pass focused on making layouts consume tokens rather than redesigning their typography structure. Heading/body *font family* and *color* are fully live per-theme today; scale/letter-spacing are not yet.

**Persistence & live update**: `EditorPage.jsx`'s Theme Picker dispatches `{ type: "SET_DECK_THEME", theme: getTheme(id) }` (new `deckReducer.js` action - replaces `deck.theme` only, never touches `deck.slides`/content/positions). This goes through the same `dispatch` → `deck` (`present`) state `DeckProvider`'s existing autosave effect already watches, so a theme change autosaves exactly like any other edit - no new persistence path. The old local-only `uiTheme` state and its `themes[uiTheme]`-driven Tailwind classes on the `.App` wrapper are removed; `deck.theme` (via `useDeck()`) is the only theme source now.

**Backward migration**: `deckSchema.js` bumped to `CURRENT_SCHEMA_VERSION = 2`. The new v1→v2 migration runs every deck's `theme` field through `normalizeTheme()`, so an old deck with a bare-string `theme` (e.g. `"dark"`) or a hand-crafted legacy string (`"warm"`/`"DeepPurple"`/`"DarkBlue"`/`"EarthStone"`, mapped onto the closest new registry theme) loads correctly with no data loss and no thrown error.

**Explicitly not done, per the brief's own "do not implement yet" list**: full Background system (overlay/opacity/video, deck-level default actually rendering), semantic layout transformation, Remix, AI features, Change Case, animations, performance optimization, full regression testing. Also not done: deleting the pre-existing `themes`/`themes2`/`backgrounds` legacy objects and the ~3,700 lines of dead legacy layout components in `EditorPage.jsx` that reference them - still explicitly deferred (§4), and this sub-project's changes only touch the live `EditorPageBody` theme code path, not that dead code.

**Tests**: `themeTokens.test.js` (registry shape, `getTheme`, `normalizeTheme` including idempotency and partial-object fill-in, `themeToCssVars`/`themeToRootStyle`), `deckSchema.test.js` (new - migration from bare-string/partial/already-current theme), `deckReducer.test.js` additions (`SET_DECK_THEME`), `RichText.test.jsx` addition (`style` passthrough), `CtaLayout.test.jsx` addition (button no longer hardcodes a color), `ThemeDefaults.test.jsx` (new - widget theme-var fallback vs. explicit-override behavior). Full suite: <FILL IN ACTUAL COUNT> tests / <FILL IN ACTUAL FILE COUNT> files passing (up from the 82/18 baseline). `npm run build` and `npx eslint` on every new/touched file: <FILL IN ACTUAL RESULT>.

**Not verified**: an actual browser click-through of the brief's §21 sanity flow (open deck → choose Theme A → all slides update → edit content → content intact → choose Theme B → all slides update again → insert free element → theme doesn't break its position → save/autosave → refresh → theme persists; plus: existing slide-specific background + theme change → slide-specific background remains intact). No headless/interactive browser tool was available in this session, the same limitation noted for sub-projects #3 and #5.
```

- [ ] **Step 2: Update the "Recommended implementation order" table row for item 6**

In the table under "## 5. Recommended implementation order", change the row:

```
| 6 | Theme token system | — | Needed before background's deck-level default (§7) can hang off it cleanly |
```

to:

```
| 6 | Theme token system | — | **Implemented** (see §1e) — needed before background's deck-level default (§7) can hang off it cleanly |
```

And update the closing paragraph's last sentence:

```
has been implemented (§1d, pending the same kind of real-browser
click-through). Get explicit sign-off before starting sub-project #6
(theme token system) or any later item.
```

to:

```
has been implemented (§1d, pending the same kind of real-browser
click-through), and sub-project #6 (theme token system) has been
implemented (§1e, pending the same kind of real-browser click-through).
Get explicit sign-off before starting sub-project #7 (background system)
or any later item.
```

- [ ] **Step 3: Commit**

```bash
git add docs/EDITOR-V2-STATUS.md
git commit -m "docs: mark theme token system (sub-project #6) implemented"
```

---

## Final check before handing back to the user

After Task 8's commit, run once more:

```bash
npm test
npm run build
```

Report the actual final test count/file count and confirm the build succeeds — these are the numbers Task 8 Step 1 needs filled in (do not leave the `<FILL IN ACTUAL ...>` placeholders in the committed status doc). Per this sub-project's brief: stop after this. Do not start the Background system (sub-project #7) without explicit sign-off.
