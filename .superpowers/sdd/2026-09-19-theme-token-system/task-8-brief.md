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
