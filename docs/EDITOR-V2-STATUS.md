# Editor V2: Status & Roadmap to Production

**Branch:** `editor-deck-model` (worktree at `.worktrees/editor-deck-model`, not yet merged to `main`)
**Architecture principles:** see `docs/superpowers/specs/2026-09-19-editor-v2-architecture-principles.md` — binding constraints every future sub-project below must follow (keep the hybrid layout+freeform model, build the semantic transform layer, wrap undo/redo around the existing reducer, etc.)

**Grading rule for this document:** a feature counts as **Complete** only when
the corresponding user-facing interaction works end-to-end. Having the data
structure or a reducer action for something is not completion — it's
listed separately as "data model ready" so the gap is visible.

---

## 1. What's genuinely complete

- **Deck/Slide/FreeElement data model** (`deckTypes.js`) — factories, `LAYOUT_IDS`, immutable-by-construction shapes.
- **`deckReducer.js`** — action types for slides, free elements, and theme, fully immutable, validated at the boundary, tested for every action + every invalid-input branch.
- **`DeckContext` (`DeckProvider`/`useDeck`)** — single source of truth; wraps `deckReducer` in `useDeckHistory` (see Undo/redo below), so `useDeck()` returns `{ deck, dispatch, undo, redo, canUndo, canRedo }`. No duplicated slide-shaped state anywhere else in `EditorPage.jsx`.
- **`SlideRegistry.js`** — all 7 layouts correctly registered.
- **`SlideCanvas.jsx`** — renders the active layout + free elements, correctly remounts per slide (`key={slide.id}`), and now forwards element selection/editing state into `FreeElementLayer` (see Insert/free-element engine below).
- **`RichText.jsx`** — shared Froala field; the stale-closure/DOM-fight bug that caused silent edit loss is fixed and regression-tested.
- **7 layout components** — Title, Problem, MediaDescription, Media3Points, MetricsGrid, TeamGrid, Cta — each editable end-to-end via `RichText`, each fills its 16:9 container correctly.
- **Adding a slide** — `handleAddSlide` → `ADD_SLIDE` → renders correctly. End-to-end working.
- **Per-slide background** — toolbar → `SET_SLIDE_BACKGROUND` → `SlideCanvas` renders it. End-to-end working for `solid`/`gradient`/`image` kinds (not `video`, see below).
- **Undo/redo** — `useDeckHistory.js` wraps `deckReducer` in a past/present/future history shape, supports coalescing a burst of dispatches (e.g. every pointermove frame of a drag) sharing a `coalesceId` into a single undo step, and is wired into `DeckContext` so every dispatch in the app is undoable. Unit-tested in isolation (`useDeckHistory.test.js`) and exercised end-to-end by the free-element interaction tests (drag/delete produce exactly one undo step).
- **Insert/free-element interaction engine** — `useFreeElementInteraction.js` (pointer-driven drag/resize/rotate with center/edge snapping), `FreeElementSelection.jsx` (bounding box, resize handles, rotate handle, snap guides), and `FreeElementToolbar.jsx` (bring forward/send backward/duplicate/delete) are now wired together in `FreeElementLayer.jsx`, which previously only rendered static elements with no selection or interaction at all. End-to-end working: select, drag, resize, rotate, delete (Delete key), duplicate, and reorder z-index via the toolbar, all through `SlideCanvas`/`DeckContext` so every change is a single undoable step.
- **Layer/element controls** — bring-forward/send-backward (`reorderZIndex` in `freeElementFactory.js`) and duplicate (`duplicateWidget`) are implemented as part of the Insert engine above and exposed through `FreeElementToolbar`.
- **Slide sidebar component** — `SlideSidebar.jsx`/`SlideThumbnail.jsx`/`SlideThumbnailContent.jsx` render thumbnails with active-slide highlighting; unit-tested (`SlideThumbnail.test.jsx`). Not yet imported into `EditorPage.jsx` — see limitations below.
- **Schema versioning + persistence plumbing** — `deckSchema.js` (`migrateDeck`/`serializeDeck`, `CURRENT_SCHEMA_VERSION`) and `src/utils/deckApi.js` exist as the migration/save-load contract. Not yet imported into `EditorPage.jsx` or exercised against a real backend/DB — see limitations below.
- **109 tests / 21 files**, all passing; suite has grown, not shrunk, across every task and fix round, including this one (see §5 below).

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

**Tests**: `themeTokens.test.js` (registry shape, `getTheme`, `normalizeTheme` including idempotency and partial-object fill-in, `themeToCssVars`/`themeToRootStyle`), `deckSchema.test.js` (new - migration from bare-string/partial/already-current theme), `deckReducer.test.js` additions (`SET_DECK_THEME`), `RichText.test.jsx` addition (`style` passthrough), `CtaLayout.test.jsx` addition (button no longer hardcodes a color), `ThemeDefaults.test.jsx` (new - widget theme-var fallback vs. explicit-override behavior). Full suite: 109 tests / 21 files passing (up from the 94/19 baseline). `npm run build` succeeds (only pre-existing "chunk larger than 500 kB" warnings for image assets, unrelated to this work — not an error).

**Not verified**: an actual browser click-through of the brief's §21 sanity flow (open deck → choose Theme A → all slides update → edit content → content intact → choose Theme B → all slides update again → insert free element → theme doesn't break its position → save/autosave → refresh → theme persists; plus: existing slide-specific background + theme change → slide-specific background remains intact). No headless/interactive browser tool was available in this session, the same limitation noted for sub-projects #3 and #5.

## 2. Data model ready, but the user-facing feature is not wired into `EditorPage.jsx` yet

These have working, unit-tested implementations as standalone modules, but
**`EditorPage.jsx` does not import or render them yet** — do not read this
section as "half done," read it as "the component/module is done and
tested in isolation, the integration into the live editor page is not
started":

- **Deleting/duplicating/reordering slides** — `DELETE_SLIDE`, `DUPLICATE_SLIDE`, `REORDER_SLIDES` all exist and are tested at the reducer level. `SlideSidebar.jsx` renders thumbnails but nothing in `EditorPage.jsx` calls these actions from a button/drag handle yet.
- **Persistence / real backend save-load** — `deckSchema.js`/`deckApi.js` give a migration chain and a client for the save/load contract, but nothing in `EditorPage.jsx` calls them, and neither has been verified against the actual backend/DB (no integration test hits a real API).
- **Layout switching** — `SET_SLIDE_LAYOUT` exists and never crashes, because it merges onto the target's `defaultContent()`. But only one content pair (`problem→media-3points`) actually preserves meaningful content — every other switch effectively **resets to placeholder content**, which is exactly the failure mode the new architecture principles doc says must not happen. This needs the semantic normalize/denormalize layer (architecture doc §3) before it's a real feature.

## 3. Not started at all

- **Remix system** — no design or implementation yet, and per the architecture doc it's explicitly a different operation from Layout Change (§4 of the architecture doc), not a variant of it.
- **AI storyline / 10+ slide generation, content intelligence** (detect numbers→metrics, lists→bullets, image prompts→media).
- **Change Case tool** (separate from the color tool — the original reported bug is untouched).
- **Slide/element animations.** The old scroll-stack animation was removed as an unavoidable side effect of the data-model rewrite (`SlideCanvas` renders one slide at a time; the old animation needed all slides mounted as siblings). Navigation still works (nav dots, mouse-wheel); the drag-transition itself does not exist.
- **Background overlay/opacity, deck-level default background, video-background rendering** — the `SlideBackground` union doesn't yet have overlay fields, there's no deck-level background tier, and `{kind:"media", type:"video"}` renders nothing.
- **Widget renderers** — `widgets/` (`TextWidget.jsx`, `ShapeWidget.jsx`, `ImageWidget.jsx`, `VideoWidget.jsx`, `DividerWidget.jsx`, `IconWidget.jsx`) exist but are not yet referenced anywhere; `FreeElementLayer`'s own inline `ElementContent` switch (text/image/video/default) is still what actually renders elements today.

## 4. Known defects / rough edges (not urgent, but real)

- `DUPLICATE_SLIDE` copies `background` by reference, not cloned (harmless while every write path replaces it wholesale).
- `UPDATE_SLIDE_CONTENT`/`ADD_FREE_ELEMENT` don't validate payload shape before merging (fine until untrusted/deserialized data enters the picture — relevant once persistence/schema versioning lands).
- `MetricsGridLayout`/`TeamGridLayout` use array-index React keys (fine for today's fixed-size lists; would need real ids once those lists become reorderable via the Insert Widget engine).
- `slideBackgroundStyle`'s `url(${...})` isn't quote-escaped (latent — nothing produces an unsafe URL today).
- `BACKGROUND_PRESET_MODELS` in `EditorPage.jsx` is a hand-mapped approximation of legacy Tailwind swatches to hex/gradient values — a swatch preview can cosmetically differ from the applied result. Gets fixed as a side effect of building a real background picker (§6 of the architecture doc).
- ~3,700 lines of the old hardcoded slide components (`TheChallangePage`, `OurSolutionPage`, `TitleOnlyPage`, and ~18 others) still exist in `EditorPage.jsx`, unreferenced. Deletion is still explicitly deferred, not scheduled in the dependency order below — revisit once the theme-token refactor touches every layout anyway (natural point to also delete the dead legacy layouts that duplicate them).
- **Real-browser verification gap.** Everything in §1 is verified by jsdom/Vitest (including the free-element drag/resize/rotate math, which relies on a test-only `getBoundingClientRect` mock — see `FreeElementInteraction.integration.test.jsx`). None of it — insert engine, undo/redo, persistence plumbing — has been clicked through in an actual browser against the real `EditorPage.jsx` yet. Treat "tests pass" and "works in the app" as separate claims until that manual pass happens, especially for anything not yet imported into `EditorPage.jsx` (see §2).

---

## 5. Test status

**109/109 tests passing** across 21 files (`npm run test`), `npm run build` passing. This includes the Theme Token System sub-project's additions (see §1e) on top of the previous 94/19 baseline.

This count includes a fix round on `FreeElementInteraction.integration.test.jsx` (5 tests that were failing after an untracked-file recovery). Root cause was not a test or environment bug: `FreeElementLayer.jsx` was a stale stub that rendered `freeElements[]` statically and never wired in the already-implemented `useFreeElementInteraction.js`/`FreeElementSelection.jsx`/`FreeElementToolbar.jsx`, and `DeckContext.jsx` never wired in the already-implemented `useDeckHistory.js` (so `useDeck()` had no `undo`/`redo`/`canUndo`/`canRedo` at all). Fixed by wiring both together; no test assertions were weakened and no reducer/hook logic changed.

## 6. Recommended implementation order

Per the architecture review, this supersedes the ordering in the previous
version of this document. Full rationale for each item and its
dependencies is in `docs/superpowers/specs/2026-09-19-editor-v2-architecture-principles.md`.

Items 1–5 below now have working, tested implementations (§1); what remains
for each is wiring into `EditorPage.jsx` (§2) or, for #6/#7, has not been
started.

| Order | Sub-project | Depends on | Status |
|---|---|---|---|
| 1 | Editor persistence + schema versioning | — | `deckSchema.js`/`deckApi.js` implemented, not wired into `EditorPage.jsx`, not verified against a real backend |
| 2 | Undo/redo | — (wraps `deckReducer` without changing it) | Implemented and wired into `DeckContext` |
| 3 | Insert/free-element interaction engine | — | Implemented and wired into `SlideCanvas`/`FreeElementLayer` |
| 4 | Layer/element controls | #3 | Implemented as part of #3 (toolbar bring-forward/send-backward/duplicate/delete) |
| 5 | Slide sidebar | — (reducer actions already exist) | Component implemented and unit-tested, not wired into `EditorPage.jsx` |
| 6 | Theme token system | — | **Implemented** (see §1e) — needed before background's deck-level default (§7) can hang off it cleanly |
| 7 | Background system (overlay, deck-level default, video, real picker UI) | #6 | Not started |
| 8 | Semantic layout transformation/reflow | — | Not started |
| 9 | Remix | #8 | Not started |
| 10 | AI storyline generation | benefits from #8/#12 but not blocked by them | Not started |
| 11 | AI 10+ slide generation | #10 | Not started |
| 12 | Content intelligence | overlaps #10/#11, may co-design | Not started |
| 13 | Inline text editing audit/fixes | — | Not started |
| 14 | Change Case tool | — | Not started |
| 15 | Slide/element animations | benefits from #3 (element engine) for element-level animation | Not started |
| 16 | Performance optimization | most other items | Not started |
| 17 | Full regression testing | everything | Not started (109/109 automated; real-browser pass still outstanding, see §4) |

Do not implement the full list in one pass. Sub-project #6 (Theme Token System) has been
implemented (see §1e). Next up is the Background system (#7) — awaiting explicit go-ahead
before starting it.
