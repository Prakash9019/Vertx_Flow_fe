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
- **Insert/free-element interaction engine** — `useFreeElementInteraction.js` (pointer-driven drag/resize/rotate with center/edge snapping), `FreeElementSelection.jsx` (bounding box, resize handles, rotate handle, snap guides), and `FreeElementToolbar.jsx` (bring forward/send backward/duplicate/delete) are wired together in `FreeElementLayer.jsx`, which renders every free element through `FreeElementRenderer`/the theme-aware widgets (see §1e). **`EditorPageBody` now owns `selectedElementId`/`editingElementId` as local state** (architecture doc §1: session state, not `Deck` state) and passes them into `SlideCanvas`, so select, drag, resize, rotate, delete (Delete key), duplicate, reorder z-index via the toolbar, and double-click-to-edit-text are all live in the real page, not just in tests that pass those props explicitly. Selection clears on every slide change. Verified end-to-end at the `SlideCanvas`/`DeckContext` level (`FreeElementInteraction.integration.test.jsx`); `EditorPage.jsx` itself has no dedicated test (see the real-browser-verification note in §4/§5).
- **Layer/element controls** — bring-forward/send-backward (`reorderZIndex` in `freeElementFactory.js`) and duplicate (`duplicateWidget`) are implemented as part of the Insert engine above and exposed through `FreeElementToolbar`.
- **Slide sidebar** — `SlideSidebar.jsx` is now rendered in `EditorPageBody` alongside the canvas, wired to `DELETE_SLIDE`/`DUPLICATE_SLIDE`/`REORDER_SLIDES`/`ADD_SLIDE(afterSlideId)`. Which numeric `currentSlideIndex` to select after a sidebar mutation (the sidebar's actions are id-based, `currentSlideIndex` is a position) is computed by pure, unit-tested functions in `slideSidebarLogic.js` rather than inlined untested arithmetic in `EditorPage.jsx`.
- **Persistence** — `/editor/:deckId` (new route) loads a real deck via `useDeckLoader` (`deckApi.getDeck` → `migrateDeck`) before mounting `DeckProvider`, with loading/error states; `useAutosave` debounces deck changes into one `deckApi.updateDeck` PATCH per pause (skips the initial load so it never immediately re-saves what it just fetched). The old no-id `/editorPage` route is untouched and still uses a hardcoded, unsaved seed deck. `/decks` (`DeckListPage`, which already expected `/editor/:deckId` to exist) is now a real route — it had none before. The backend side of this (`Deck` model, controller, `/api/decks` routes, scoped to `req.user.id`) was added to the separate `Vertx_flow_Server` repo in this same session (its own commit there, `feat: add Deck persistence API`) — without it, this frontend wiring would have nothing real to talk to.
- **Semantic layout transformation** — `contentMappers.js` is now `normalize(layout, content) → SemanticContent → denormalize(SemanticContent, layout, defaultContent)` (architecture doc §3) instead of one hand-written mapper per layout pair. Every layout switch — not just the one pair that used to have a bespoke mapper — now preserves a heading/body/items/media/metrics field whenever the source and target both support it, and only falls back to the target's `defaultContent()` for a field the semantic model genuinely has nothing for. See §1e-2 below for detail.
- **Background system** — full architecture doc §6: overlay/opacity on `SlideBackground`, a deck-level default (`deckTheme.defaultBackground`, already existed on every theme) with slide-level override (`slide.background`, now `null`-by-default meaning "inherit"), a real `BackgroundPicker` that edits `SlideBackground` objects directly (replacing the old Tailwind-swatch approximation), and actual `<video>` rendering for a `{kind:"media", type:"video"}` background. See §1e-3 below for detail.
- **149 tests / 26 files**, all passing; suite has grown, not shrunk, across every task and fix round, including this one (see §5 below).

## 1e. Sub-project #6: Theme Token System — Implemented

`deck.theme` is now a structured, persisted design-token object — the global visual foundation for the editor, not a color switcher.

**Theme schema** (`src/components/new/deck/theme/themeTokens.js`): `{ id, name, colors: { background, surface, surfaceMuted, primary, secondary, accent, text, textMuted, border }, typography: { headingFont, bodyFont, headingWeight, bodyWeight, headingScale, bodyScale, lineHeight }, spacing: { xs, sm, md, lg, xl }, radius: { sm, md, lg }, shadows: { sm, md, lg }, borders: { width, style }, defaultBackground }`. `defaultBackground` was populated (`{ kind: "solid", color: colors.background }`) to prepare the Background system's two-tier hierarchy — the Background sub-project (§1e-3) now reads it as `SlideCanvas`'s deck-level fallback.

**Theme registry**: 7 themes (`default`, `dark`, `light`, `minimal`, `modern`, `bold`, `professional`), each a full token object. `getTheme(id)` returns a defensive deep copy; `normalizeTheme(value)` accepts a legacy bare string, a partial object, or an already-current object and always returns the full current shape (idempotent).

**Token architecture — CSS custom properties, not a new React context**: `themeToRootStyle(theme)`/`themeToCssVars(theme)` turn a theme into `--theme-*` CSS custom properties (plus a directly-applied `backgroundColor`/`color`/`fontFamily` for the one root element). `EditorPage.jsx` applies `themeToRootStyle(deck.theme)` to its outermost wrapper, so every descendant on the current render path — all 7 layouts, `RichText` fields, and the slide canvas — reads the live theme via plain `var(--theme-*)` in an inline `style`, no theme context/hook, no prop drilling, per the brief's "don't introduce a complicated styling framework" instruction. `SlideSidebar` is now rendered as a descendant of this same wrapper (see §1's Slide sidebar bullet) and inherits the CSS vars automatically — nothing about this wiring was specific to the canvas.

**Layouts migrated**: all 7 (`Title`, `Problem`, `MediaDescription`, `Media3Points`, `MetricsGrid`, `TeamGrid`, `Cta`) — heading/body `RichText` fields set `style={{ fontFamily: "var(--theme-heading-font)" | "var(--theme-body-font)" }}` (required teaching `RichText` to forward an optional `style` prop, alongside its existing `className`). Text color needed no per-layout change: none of the 7 hardcoded a color class, so they already inherited `--theme-text`'s directly-applied `color` from the new root wrapper. Two hardcoded-color spots were replaced with tokens: `CtaLayout`'s button (`bg-teal-400 text-black` → `var(--theme-primary)`/`var(--theme-background)`) and the empty-media placeholders in `MediaDescriptionLayout`/`Media3PointsLayout`/`TeamGridLayout` (`bg-white/10` → `var(--theme-surface-muted)`).

**Free elements**: `TextWidget`/`ShapeWidget`/`DividerWidget`/`IconWidget` fall back to `var(--theme-text)`/`var(--theme-accent)`/`var(--theme-border)` only when the element has no explicit `props.color`/`props.fill` — an explicit value (however it got set) always wins, per the brief's theme-derived-vs-explicit-override distinction. `freeElementFactory.js`'s `WIDGET_DEFAULTS` no longer bakes a hardcoded hex color into newly-created shape/divider/icon elements, so new free elements pick up the live theme by default. **These widgets are now on the live render path**: `FreeElementLayer.jsx`'s inline `ElementContent` switch (text/image/video/default-placeholder) has been removed and replaced with `FreeElementRenderer` (`element.type` → `TextWidget`/`ImageWidget`/`VideoWidget`/`ShapeWidget`/`DividerWidget`/`IconWidget`), so every free element on a slide is rendered by its theme-aware widget, not a duplicate inline path. Text editing (double-click to edit, blur to commit) and image/video "replace source" both now go through `FreeElementRenderer`'s `onCommitText`/`onReplaceSrc` callbacks into the same `onUpdateElement`/`UPDATE_FREE_ELEMENT` path as every other free-element edit — no new state shape, no reducer change. Regression-tested in `FreeElementLayer.themeRendering.test.jsx` (theme-var fallback through the live path, and explicit overrides surviving a simulated theme change).

**Known limitation**: `typography.headingScale`/`typography.bodyScale` and letter-spacing are defined in the token schema (brief §7) but are not yet multiplied into rendered font sizes — each layout still sets its own fixed Tailwind text-size class (e.g. `text-5xl`). Wiring scale into rendered size would mean converting every layout's font-size classes to CSS-variable-driven values, a larger structural change deferred to keep this pass focused on making layouts consume tokens rather than redesigning their typography structure. Heading/body *font family* and *color* are fully live per-theme today; scale/letter-spacing are not yet.

**Persistence & live update**: `EditorPage.jsx`'s Theme Picker dispatches `{ type: "SET_DECK_THEME", theme: getTheme(id) }` (new `deckReducer.js` action - replaces `deck.theme` only, never touches `deck.slides`/content/positions). This goes through the same `dispatch` → `deck` (`present`) state as every other edit in the editor, so - now that persistence is wired (see §1's Persistence bullet) - a theme change autosaves on `/editor/:deckId` exactly like every other edit; on the no-id `/editorPage` demo route it's still live-in-session-only. The old local-only `uiTheme` state and its `themes[uiTheme]`-driven Tailwind classes on the `.App` wrapper are removed; `deck.theme` (via `useDeck()`) is the only theme source now.

**Backward migration**: `deckSchema.js` bumped to `CURRENT_SCHEMA_VERSION = 2`. The new v1→v2 migration runs every deck's `theme` field through `normalizeTheme()`, so an old deck with a bare-string `theme` (e.g. `"dark"`) or a hand-crafted legacy string (`"warm"`/`"DeepPurple"`/`"DarkBlue"`/`"EarthStone"`, mapped onto the closest new registry theme) loads correctly with no data loss and no thrown error.

**Explicitly not done as part of *this* sub-project, per the brief's own "do not implement yet" list at the time**: full Background system, semantic layout transformation, Remix, AI features, Change Case, animations, performance optimization, full regression testing. (Background and semantic layout transformation have since been implemented in later sub-projects — see §1e-2 and §1e-3.) Still not done: deleting the pre-existing `themes`/`themes2`/`backgrounds` legacy objects and the ~3,700 lines of dead legacy layout components in `EditorPage.jsx` that reference them - still explicitly deferred (§4).

**Tests**: `themeTokens.test.js` (registry shape, `getTheme`, `normalizeTheme` including idempotency and partial-object fill-in, `themeToCssVars`/`themeToRootStyle`), `deckSchema.test.js` (new - migration from bare-string/partial/already-current theme), `deckReducer.test.js` additions (`SET_DECK_THEME`), `RichText.test.jsx` addition (`style` passthrough), `CtaLayout.test.jsx` addition (button no longer hardcodes a color), `ThemeDefaults.test.jsx` (widget-level theme-var fallback vs. explicit-override behavior), `FreeElementLayer.themeRendering.test.jsx` (new - same behavior proven through the live `FreeElementLayer` → `FreeElementRenderer` → widget path, plus explicit overrides surviving a simulated theme change). Full suite: **111 tests / 22 files passing** (up from the 94/19 baseline, 109/21 after the theme-token schema/registry work, now 111/22 after wiring the live render path). `npm run build` succeeds (only pre-existing "chunk larger than 500 kB" warnings for image assets, unrelated to this work — not an error).

**Not verified**: an actual browser click-through of the brief's §21 sanity flow (open deck → choose Theme A → all slides update → edit content → content intact → choose Theme B → all slides update again → insert free element → theme doesn't break its position → save/autosave → refresh → theme persists; plus: existing slide-specific background + theme change → slide-specific background remains intact). No headless/interactive browser tool was available in this session, the same limitation noted throughout this document.

## 1e-2. Semantic layout transformation — Implemented

`contentMappers.js` replaced its old per-pair mapper registry (in practice
exactly one hand-written mapper existed, `problem→media-3points`; every
other pair fell back to `identityMapper`, handing the target layout a
foreign content shape that only happened to work because `deckReducer`
merged it over the target's `defaultContent()`) with the three-stage
pipeline architecture doc §3 calls for:

```
LayoutContent -> normalize(layout, content) -> SemanticContent
              -> denormalize(SemanticContent, layout, defaultContent)
              -> LayoutContent
```

`SemanticContent` is layout-agnostic: `{ heading, body, items, media, metrics }`
(`items` is `[{title, body, media}]` — covers points/members/cards). Every
one of the 7 layouts has a `normalize` and `denormalize` function.
`getMappedContent(from, to, content, targetDefaultContent)` is what
`deckReducer`'s `SET_SLIDE_LAYOUT` calls now. Each `denormalize*` prefers a
field carried over from the semantic model and only falls back to the
target's `defaultContent()` for a field the semantic model genuinely has
nothing for — so layout switching no longer silently resets to placeholder
content for any pair, not just the one pair that used to have a bespoke
mapper. One deliberate exception: `denormalizeTeamGrid` only carries over
another items-based layout's items (points, another team-grid) and falls
back to `defaultContent()` for a body-only source, rather than inventing
member names by splitting a paragraph into sentences the way
`media-3points`' points does — a plain paragraph has no genuine name/role
pairing to extract.

This also fixed a latent bug: switching a `title` slide (no metrics
concept) into `metrics-grid` used to leave stray `title`/`subtitle` keys in
the content object from the raw identity passthrough; it now produces a
clean `metrics-grid` shape with the heading carried over instead.

**Tests**: `contentMappers.test.js` rewritten against the new
`normalize`/`denormalize`/`getMappedContent` API (15 tests covering every
layout's `normalize`, the default-fallback behavior, the deliberate
team-grid non-transform, and the specific paragraph↔bullets/bullets↔cards
transforms the original brief asked for); `deckReducer.test.js`'s
`SET_SLIDE_LAYOUT` default-merge test updated to assert the corrected
clean-shape behavior.

**Remix (architecture doc §4) — since implemented**, see §1e-4 below.

## 1e-4. Remix — Implemented

Architecture doc §4: Remix is a separate operation from Layout Change
(`SET_SLIDE_LAYOUT`) — the user doesn't pick the target layout, the system
decides one. `remix.js` scores every `LAYOUT_IDS` entry against the slide's
`SemanticContent` (from `normalize()`, the same model §1e-2's Layout Change
uses) and returns the best-fitting layout other than the slide's current one
(and any layout the caller wants excluded). No AI call — this is the
deterministic "scoring/matching step" the architecture doc explicitly leaves
as an option alongside "AI generation later"; it keeps Remix usable offline
and its output unit-testable.

**Reducer**: `REMIX_SLIDE` (`deckReducer.js`) normalizes the slide's content,
calls `pickRemixLayout`, then reuses `getMappedContent` (the exact same
denormalize/placement path `SET_SLIDE_LAYOUT` uses) to place the content into
the chosen layout — Remix never special-cases its own content transform, per
the architecture doc's explicit constraint. Warns and no-ops on a missing
`slideId` or when every layout is excluded.

**UI**: a "Remix" button (`Shuffle` icon) in `EditorPageBody`'s bottom
toolbar, next to Theme/Background, dispatches `REMIX_SLIDE`. `EditorPageBody`
tracks, per slide, every layout that slide has already passed through this
session (`remixHistoryRef`) and passes it as `excludeLayouts`, so repeated
clicks on the same slide cycle through fresh options instead of ping-ponging
between the same two best-fit layouts.

**Tests**: `remix.js` has 9 tests covering the scoring rules (metrics →
metrics-grid, titled items → team-grid, untitled items → media-3points, media
→ media-description, plain body → problem, bare heading → title, never
returns the current layout, `excludeLayouts` cycling, and the all-excluded
`null` case). `deckReducer.test.js` adds 4 `REMIX_SLIDE` tests (fitting-layout
pick, `excludeLayouts` cycling through the reducer, missing slideId, and the
all-excluded no-op).

**Not done**: any UI to show *why* a layout was chosen, and no AI-driven
alternative to the scoring heuristic — both explicitly out of scope for this
pass. **Not verified in a real browser** — same caveat as everything else in
this document (see §4).

## 1e-3. Background system — Implemented

All four bullets of architecture doc §6:

- **Overlay + opacity**: `SlideBackground` can carry an `overlay: {color,
  opacity}` alongside its existing kind-specific fields, independent of
  kind. `SlideCanvas` renders it as its own absolutely-positioned layer
  between the background and the slide content (not folded into
  `slideBackgroundStyle`'s CSS), so it works identically for every
  background kind.
- **Deck-level default vs. slide-level override**: `createSlide`'s
  `background` now defaults to `null` (was a hardcoded
  `{kind:"solid",color:"#0b2d2b"}`), meaning "inherit the deck theme's
  default." `SlideCanvas` resolves this via `effectiveBackground(slide,
  deckTheme) = slide.background ?? deckTheme.defaultBackground` —
  `deckTheme.defaultBackground` already existed on every theme (populated
  since the theme token system sub-project, §1e) but nothing read it until
  now. An explicit per-slide background still always wins. Old
  decks/slides serialized with the previous hardcoded solid background are
  unaffected (a non-null background is just an override, same as always) —
  no schema migration needed, this only changes what a *new* slide
  defaults to.
- **Real picker UI**: new `BackgroundPicker` component edits
  `SlideBackground` objects directly — kind switcher (Theme default /
  Solid / Gradient / Image / Video), the fields for whichever kind is
  selected, an overlay editor for kinds that support one, and a live
  preview built from the exact same `slideBackgroundStyle` helper
  `SlideCanvas` uses, so the preview and the applied result can never
  diverge. Replaces the old `BACKGROUND_PRESET_MODELS` hand-mapped
  Tailwind-swatch approximation in the live Background modal.
- **Video background rendering**: a `{kind:"media", type:"video"}`
  background (previously rendered nothing) now renders an actual `<video>`
  element (muted/loop/autoPlay/playsInline), sized to cover the slide box,
  both in `SlideCanvas` and in `BackgroundPicker`'s live preview.

The legacy `backgrounds`/`BACKGROUND_PRESET_MODELS`/
`backgroundPresetToSlideBackground` definitions in `EditorPage.jsx` are
left in place untouched — `backgrounds` still has ~30 references from the
~3,700 lines of dead legacy slide components elsewhere in that file, whose
deletion remains explicitly deferred (§4); `backgroundPresetToSlideBackground`
itself is now an unused export but removing it wasn't part of this
sub-project's scope.

**Tests**: `SlideCanvas.test.jsx` additions (deck-default fallback,
explicit-override-wins, video element rendering, overlay presence/absence);
`BackgroundPicker.test.jsx` (new — kind switching produces a complete
`SlideBackground`, field edits patch only that field, overlay set/clear,
video preview, "Theme default" clears the override); `deckTypes.test.js`
updated for the new `null` default.

## 1e-5. AI storyline generation — Implemented

Roadmap #10: on `DeckListPage`, "Create New Deck" is now two buttons — "Blank
Deck" (unchanged) and "Generate with AI", which opens `AIStorylineModal`
(prompt + slide-count input, 3–15 slides, default 8).

**Backend (`Vertx_flow_Server`, separate repo)**: `POST /api/ai/storyline`
(`aiStorylineRoutes.js`/`aiStorylineController.js`, behind the existing
`authMiddleware`) calls `services/geminiService.js`, which wraps
`@google/generative-ai` (a dependency that was installed but unused until
now) with a `gemini-1.5-flash` prompt instructing strict-JSON output shaped
like the frontend's `SemanticContent` (`heading`/`body`/`items`/`metrics`,
no `media` - Gemini has no real image URLs to offer). Defensively strips
markdown code fences, parses, structurally validates, and retries once on
malformed JSON before returning a 502. `GEMINI_API_KEY` lives only in the
server's `.env` (gitignored there) - never sent to the browser.

**Frontend**: `storylineToDeck.js`'s `buildDeckFromStoryline()` turns the
returned `{title, slides}` into a real `Deck` by reusing the *exact* same
pipeline Remix and Layout Change use - `pickBestLayout` (new export from
`remix.js`, extracted from `pickRemixLayout`'s scoring loop so a brand-new
slide with no "current layout" to exclude can use it too) → `denormalize` →
`createSlide`/`createDeck` - no new content-shape logic. `aiApi.js` calls
the backend; `AIStorylineModal` wires prompt → generate → build →
`deckApi.createDeck` → navigate to `/editor/:deckId`, the same tail as the
existing blank-create path.

**Known issue, deliberately not fixed here (user's call)**: this repo's
`.env` has a `VITE_GEMINI_API_KEY` already committed to git
history/`origin/main` - a live, public secret, though nothing in `src/`
currently reads it. Flagged to the user; they chose to defer rotating it.

**Tests**: `remix.test.js` (+4 for `pickBestLayout`), `storylineToDeck.test.js`
(new, 5 tests at the time), backend `geminiService.test.js` (new, 11 tests
covering clean/fenced/malformed JSON, retry-then-succeed, retry-exhausted,
and missing-API-key paths - all mock `@google/generative-ai`, none call the
real API).

**Not verified in a real browser** (same caveat as everything else in this
document) - and additionally, no test here calls the live Gemini API, so
actual model output quality/shape-conformance against the real service is
unverified until a manual pass.

## 1e-6. AI 10+ slide generation & content intelligence — Implemented

Roadmap #11 and #12, built directly on top of §1e-5 above (same
prompt→outline→deck pipeline, extended rather than replaced).

**#11 - narrative beat scaffold (`Vertx_flow_Server/services/narrativeBeats.js`,
new)**: a plain "generate N slides" prompt degrades into repetitive filler
once N gets into double digits, because nothing tells the model what the 9th
slide is supposed to be about versus the 4th. `CANONICAL_BEATS` is a
13-entry canonical pitch-deck arc (hook → problem → solution → product →
market → business-model → traction → competition → team → roadmap →
financials → vision → ask). `pickNarrativeBeats(slideCount)` deterministically
and evenly samples that arc down to the requested slide count - always
keeping the first (hook) and last (ask), collision-resolved by scanning
forward so beat order is always preserved - so a 4-slide deck gets a
condensed arc and a 12+-slide deck gets the (near-)full arc instead of both
getting generic content. `geminiService.buildPrompt` now lists the picked
beats (id, label, one-line hint) and requires each returned slide to be
substantively about its own beat, in order; each slide also carries an
optional `role` field echoing the beat id (best-effort, not enforced by
validation - kept permissive against model quirks). `MAX_SLIDES` was already
15 (§1e-5), so no limit change was needed for "10+".

**#12 - content intelligence (`Vertx_Flow_fe/src/components/new/deck/
contentIntelligence.js`, new)**: a deterministic (no extra AI call - same
philosophy as `remix.js`'s scoring) text-analysis safety net, run on every
AI-generated slide's raw text before layout-picking:
- `extractMetrics(text)` - finds percentage/currency/multiplier stats
  (`45%`, `$2.4M`, `10x`) sentence-by-sentence, turns each into `{label,
  value}`, capped at 6.
- `extractListItems(text)` - finds `-`/`*`/`•`/numbered marker lines (≥2 of
  them, so a single stray dash in prose isn't misread), turns them into
  `items`.
- `extractImagePrompt(text)` - finds a `[image: ...]`/`[photo: ...]`-style
  cue and returns its description.
- `enrichSemanticContent(semantic)` - the entry point: fills `items`/
  `metrics`/`media` from `body` text only when the caller left those fields
  empty (never overwrites already-structured content), and strips the
  consumed list lines/image cue out of the leftover `body` text so they
  don't also show up as garbled prose. Pure, returns a new object.

`storylineToDeck.js`'s `buildDeckFromStoryline()` now runs every slide
through `enrichSemanticContent()` before `pickBestLayout()`, so a slide whose
body prose contains an embedded stat, list, or image cue gets the right
layout (`metrics-grid`/`media-3points`/`media-description`) even when Gemini
put everything in `body` instead of the matching structured field - a
robustness net, not a dependency on the model always following the schema
correctly.

An extracted image prompt needs a visible place to land since there's no
real image URL to show: `MediaDescriptionLayout`'s and `Media3PointsLayout`'s
empty-media placeholder boxes now render `media.prompt` as an italic caption
("Suggested image: …") when present, instead of showing a silently blank
box. `media = {url: "", type: "image", prompt: "..."}` is backward
compatible - anything reading `media.url` behaves exactly as before.

**Tests**: `narrativeBeats.test.js` (new, 6 tests - includes a property test
asserting every count from 1 to the full arc length returns exactly that
many distinct beats in canonical order, always hook-first/ask-last).
`contentIntelligence.test.js` (new, 22 tests covering each extractor plus
`enrichSemanticContent`'s no-mutation/no-overwrite/strip-on-extract
behavior). `storylineToDeck.test.js` (+1 integration test proving the full
chain: a slide with `"We grew 45% this quarter."` as plain body ends up as
`metrics-grid` with a real `{label, value}` metric, not `problem` with an
unparsed paragraph). Frontend: **209/209** (up from 186), build clean.
Backend: **20/20** (up from 14).

**Not verified against the real Gemini API** - same caveat as §1e-5:
`buildPrompt`'s new beat-scaffolded instructions are unit-tested for shape
(via the mocked client) but the actual model's adherence to "one slide per
beat, in order" is unverified until a manual pass with a real API key.

## 1e-7. Inline text editing audit/fixes — Implemented

Roadmap #13. This was an audit (no pre-existing bug list to work from), so
the work was: find the real bugs, fix them, prove it with tests.

**Bug found**: `RichText.jsx` and `TextWidget.jsx` (free-element text) both
seed their DOM/contentEditable node from `value`/`element.props.html`
exactly once on mount, and were deliberately never re-synced afterward -
`RichText.test.jsx` even had an explicit passing test asserting this
("does not re-write the live editor DOM when the value prop changes"). That
tradeoff is correct for its original purpose (a naive full re-sync on every
render would blow away Froala's DOM state and reset the caret mid-keystroke -
the original "stale-closure/DOM-fight" bug, §1). But `SlideCanvas` keys its
rendered layout on `slide.id` only and `FreeElementLayer` keys each widget on
`element.id` - **neither id changes on undo/redo** - so a slide/element that
stays mounted across an undo genuinely reverts its content in `deck.present`
while the visible rich-text/contentEditable DOM keeps showing whatever was
last typed. The next keystroke would then commit that stale on-screen text
right back over the just-restored state, silently corrupting the undo.

**Fix (`RichText.jsx`)**: a new `lastKnownValueRef` tracks the html this
component itself last put into the DOM (seeded value, or whatever its own
`contentChanged` handler last emitted - set *before* calling `onChange`, so
the parent's inevitable echo of that same value back in as a prop is
indistinguishable from "nothing happened"). A new effect fires only when an
incoming `value` prop diverges from that ref - i.e. a genuinely external
change - and re-applies it via Froala's own `editorRef.current.html.set()`
API when available (keeps Froala's internal state consistent), falling back
to a raw `innerHTML` write only if the editor hasn't initialized yet. Typing
is completely unaffected: the parent's echoed value always matches
`lastKnownValueRef`, so the resync effect is a no-op on every normal
keystroke - no caret disruption, no regression of the original bug this
design prevented.

**Fix (`widgets/TextWidget.jsx`)**: identical shape - `lastKnownHtmlRef`,
updated both by the mount-seed and by `onBlur`'s commit (this widget commits
on blur, not per-keystroke, so `element.props.html` only actually changes
after a commit or an external action like undo). The resync effect
additionally checks `!editing`, so it can never stomp on an active edit
session even in the (currently impossible, but cheap to guard) case of an
external change arriving mid-edit.

**Tests**: `RichText.test.jsx` gained 3 tests - no-resync-on-echo, the actual
undo-resync fix, and the `html.set`-unavailable fallback path. New
`widgets/TextWidget.test.jsx` (5 tests) covers the equivalent behavior for
the free-element widget, including the `editing`-guard case. New
`UndoRedoTextEditing.integration.test.jsx` proves the fix through the real
stack - `DeckProvider` → `useDeckHistory`/`deckReducer` → `ProblemLayout` →
`RichText`, with a real `UPDATE_SLIDE_CONTENT` dispatch and a real `undo()`
call - asserting the previously-typed heading actually disappears from the
DOM and the original heading reappears, not just that internal refs compare
correctly. **218/218 tests passing** (up from 209), build clean.

**Not otherwise expanded**: this was scoped as "find and fix the real bugs,"
not a general feature pass - toolbar/paste/keyboard-shortcut behavior was
audited (no other component in `src/components/new/deck` uses the seed-once
contentEditable pattern - grep confirms only these two) but not touched
beyond the undo/redo defect above. **Not verified in a real browser** - same
caveat as everything else in this document; the jsdom-level fix and its
tests are believed correct but a manual undo/redo click-through against real
Froala has not been done.

## 2. Not started at all
- **Change Case tool** (separate from the color tool — the original reported bug is untouched).
- **Slide/element animations.** The old scroll-stack animation was removed as an unavoidable side effect of the data-model rewrite (`SlideCanvas` renders one slide at a time; the old animation needed all slides mounted as siblings). Navigation still works (nav dots, mouse-wheel); the drag-transition itself does not exist.
- **Inline text editing audit/fixes**, **performance optimization**, **full regression testing** — see the recommended order table (§6) for where these sit.

## 4. Known defects / rough edges (not urgent, but real)

- ~~`UPDATE_SLIDE_CONTENT`/`ADD_FREE_ELEMENT` don't validate payload shape before merging~~ **Fixed.** `UPDATE_SLIDE_CONTENT` now rejects a non-plain-object `content` payload; `ADD_FREE_ELEMENT` now rejects a structurally-invalid `element` (via `isValidFreeElement` in `deckTypes.js`) or one whose `type` isn't a known widget type (`WIDGET_TYPES` in `freeElementFactory.js`) — both warn-and-no-op like every other invalid-action branch, rather than merging malformed data into the deck. 11 new tests in `deckReducer.test.js`.
- `MetricsGridLayout`/`TeamGridLayout` use array-index React keys (fine for today's fixed-size lists; would need real ids once those lists become reorderable via the Insert Widget engine).
- `slideBackgroundStyle`'s `url(${...})` isn't quote-escaped (latent — nothing produces an unsafe URL today; `BackgroundPicker`'s image/video URL fields are plain text inputs with no validation either).
- `backgroundPresetToSlideBackground`/`BACKGROUND_PRESET_MODELS`/`backgrounds` in `EditorPage.jsx` are now dead code on the live path (superseded by `BackgroundPicker`, §1e-3) but still referenced by the ~3,700 lines of dead legacy slide components below, so they weren't deleted.
- ~3,700 lines of the old hardcoded slide components (`TheChallangePage`, `OurSolutionPage`, `TitleOnlyPage`, and ~18 others) still exist in `EditorPage.jsx`, unreferenced. Deletion is still explicitly deferred, not scheduled in the dependency order below.
- ~~`EditorPage.jsx` has no dedicated test.~~ **Fixed.** `EditorPage.test.jsx` covers the route composition itself: the no-id demo route renders the seeded deck without touching the backend, and `/editor/:deckId` covers the loading → ready and loading → error paths against a mocked `deckApi`.
- **Real-browser verification gap.** Everything in §1 is verified by jsdom/Vitest (including the free-element drag/resize/rotate math, which relies on a test-only `getBoundingClientRect` mock — see `FreeElementInteraction.integration.test.jsx`). None of it has been clicked through in an actual browser against the real `EditorPage.jsx` yet - including the newly-wired `/editor/:deckId` persistence flow against a real running backend. Treat "tests pass" and "works in the app" as separate claims until that manual pass happens.

---

## 5. Test status

**218/218 tests passing** across 34 files (`npm run test`), `npm run build` passing. Growth this session: 111 → 128 (free-element selection state + persistence hooks + SlideSidebar wiring) → 136 (semantic layout transformation) → 141 (background data model/rendering) → 149 (BackgroundPicker) → 163 (§4 defect fixes: reducer payload validation + `EditorPage.test.jsx`) → 164 (`slideBackgroundStyle` url-escaping regression test) → 177 (Remix: `remix.test.js` + `REMIX_SLIDE` reducer tests) → 186 (AI storyline generation: `pickBestLayout` tests + `storylineToDeck.test.js`, §1e-5) → 209 (AI 10+ slide generation & content intelligence: `contentIntelligence.test.js` + `storylineToDeck.test.js` integration case, §1e-6 - `narrativeBeats.test.js` is counted in the backend suite below, not here) → 218 (Inline text editing audit/fixes: `RichText.test.jsx` +3, new `TextWidget.test.jsx` (5) and `UndoRedoTextEditing.integration.test.jsx` (1), §1e-7).

Also this session: **~3,700 lines of dead legacy `EditorPage.jsx` code deleted** (the ~26 pre-deck-model hardcoded slide components, `themes`/`themes2`/`backgrounds`/`BACKGROUND_PRESET_MODELS`, the per-file Froala loader they used, and every import only they needed) — 4,133 → 421 lines, none of it reachable from the live app. No behavior change; covered by the existing/added test suite and a clean build.

**Repository integrity**: all Editor V2 source files required by committed code are tracked and committed on `editor-deck-model`. A fresh checkout of the branch builds and passes the full test suite with no missing dependencies (verified again this session).

**Backend**: the separate `Vertx_flow_Server` repo (main branch, not a worktree) got its own commit this session (`feat: add Deck persistence API`) adding the `Deck` model/controller/routes the frontend's `deckApi.js` was already written against but had nothing to call. Its own test suite (Jest) passes (3/3). That commit was made directly to `main` in that repo, not pushed - flagging this explicitly since it's a different repository than the one this document tracks.

**Backend, AI storyline session**: same `Vertx_flow_Server` repo gained `services/geminiService.js`, `services/narrativeBeats.js`, `controllers/aiStorylineController.js`, `routes/aiStorylineRoutes.js`, mounted at `POST /api/ai/storyline` in `api/index.js`, plus `services/geminiService.test.js` (11 tests) and `services/narrativeBeats.test.js` (6 tests) - all mocking `@google/generative-ai` or pure-function, none call the real Gemini API. Full backend suite: **20/20 passing**. Requires a real `GEMINI_API_KEY` filled into that repo's local `.env` (a placeholder was written, gitignored) before the feature works end-to-end.

**Browser verification**: unchanged — no real-browser click-through has been performed for any of this; everything above is verified by jsdom/Vitest only.

## 6. Recommended implementation order

Per the architecture review, this supersedes the ordering in the previous
version of this document. Full rationale for each item and its
dependencies is in `docs/superpowers/specs/2026-09-19-editor-v2-architecture-principles.md`.

| Order | Sub-project | Depends on | Status |
|---|---|---|---|
| 1 | Editor persistence + schema versioning | — | **Implemented and wired into `EditorPage.jsx`** (`/editor/:deckId`, `useDeckLoader`/`useAutosave`) + a real backend API |
| 2 | Undo/redo | — (wraps `deckReducer` without changing it) | Implemented and wired into `DeckContext` |
| 3 | Insert/free-element interaction engine | — | Implemented and wired into `SlideCanvas`/`FreeElementLayer`, **including live selection/editing state in `EditorPage.jsx`** |
| 4 | Layer/element controls | #3 | Implemented as part of #3 (toolbar bring-forward/send-backward/duplicate/delete) |
| 5 | Slide sidebar | — (reducer actions already exist) | **Implemented and wired into `EditorPage.jsx`** |
| 6 | Theme token system | — | Implemented (see §1e) |
| 7 | Background system (overlay, deck-level default, video, real picker UI) | #6 | **Implemented** (see §1e-3) |
| 8 | Semantic layout transformation/reflow | — | **Implemented** (see §1e-2) |
| 9 | Remix | #8 | **Implemented** (see §1e-4) |
| 10 | AI storyline generation | benefits from #8/#12 but not blocked by them | **Implemented** (see §1e-5) |
| 11 | AI 10+ slide generation | #10 | **Implemented** (see §1e-6) |
| 12 | Content intelligence | overlaps #10/#11, may co-design | **Implemented** (see §1e-6) |
| 13 | Inline text editing audit/fixes | — | **Implemented** (see §1e-7) |
| 14 | Change Case tool | — | Not started |
| 15 | Slide/element animations | benefits from #3 (element engine) for element-level animation | Not started |
| 16 | Performance optimization | most other items | Not started |
| 17 | Full regression testing | everything | Not started (149/149 automated; real-browser pass still outstanding, see §4) |

Every item through #13 is now implemented and wired into the live
`EditorPage.jsx`/`DeckListPage.jsx` (or, for #1, #10, #11, and #12, into a real backend
too). Remaining work (#14 onward) is polish/animations/performance, not requested yet.
