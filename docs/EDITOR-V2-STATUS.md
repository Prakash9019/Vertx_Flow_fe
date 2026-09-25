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

## 1e-8. Change Case tool — Implemented

Roadmap #14, explicitly scoped as separate from the pre-existing
textColor/backgroundColor toolbar buttons - a previously reported bug there
(no detail survived into this document; it predates it) is deliberately
**untouched** by this work, per the roadmap line's own framing. Nothing in
`caseTransforms.js` or the new Froala command touches color logic at all.

**`caseTransforms.js`** (new, pure, no Froala/React dependency): `toUpperCase`,
`toLowerCase`, `toTitleCase`, `toSentenceCase`, plus a `CASE_TRANSFORMS`
lookup map. Each walks a detached DOM tree (`document.createTreeWalker`,
`NodeFilter.SHOW_TEXT`) and transforms only text-node content, leaving every
tag/attribute untouched - so a selection like `hello <b>world</b>` case-
transforms correctly without corrupting its bold formatting.
`toSentenceCase` is the one exception to "transform each node in isolation":
it tracks a running "capitalize next letter" flag across the *entire* walk,
so a sentence boundary that falls inside a `<b>`/`<i>` span still capitalizes
correctly on the far side of the tag.

**`RichText.jsx`**: registers a custom Froala dropdown command, `changeCase`
(UPPERCASE / lowercase / Title Case / Sentence case), the first time a real
`FroalaEditor` class is seen - keyed by a `WeakSet` on the class object
itself (not a plain module boolean), since Froala commands register on the
class once for the page's lifetime but a test needs to install a fresh fake
class per test without the guard silently no-op'ing every registration after
the first. The command is appended to whatever toolbar buttons a field
already resolves to (the shared default, or a layout's custom list like
`ProblemLayout`'s body field) rather than requiring every call site to opt
in. Its callback: if there's a live selection (`editor.html.getSelected()`
is non-empty), transform and replace just that (`editor.html.insert()`);
otherwise transform and replace the whole field (`editor.html.set()`) - the
standard word-processor convention. Both APIs are "silent" in Froala (they
don't fire its own change events), so the callback manually triggers
`contentChanged` afterward, which is what actually persists the edit through
this component's existing `onChange` path - no new persistence wiring
needed.

**Tests**: `caseTransforms.test.js` (new, 13 tests - each transform, HTML-tag
preservation, sentence-case across a tag boundary, falsy-input handling).
`RichText.test.jsx` +6 (command registration, once-only-per-class guard
across two mounts, whole-field transform, selection-only transform, all
four case options end-to-end through the real registered callback, and the
existing no-`DefineIcon`/`RegisterCommand` stub not throwing). **237/237
tests passing** (up from 218), build clean.

**Not verified against real Froala** - same caveat as everywhere else in
this document: `html.getSelected`/`html.insert`/`events.trigger` are Froala's
long-documented, stable v2-v4 API, but this environment has no way to load
the real library and click through it, so the command's wiring is verified
against a test stub that models that API, not the genuine one.

## 1e-9. Performance optimization — Implemented

Roadmap #16, scoped narrowly per the recommended-order table: route-level
code splitting plus stopping unnecessary free-element re-renders during
drag/resize/rotate. Not a general perf audit.

**Route-level code splitting (`App.jsx`)**: `EditorPage.jsx`, `DeckListPage.jsx`
and `NewEditor.jsx` (the `/sample` route) are now loaded via `React.lazy()`
instead of static imports, with a single `<Suspense>` boundary wrapping
`<Routes>` and a plain loading fallback. Before this, all three pulled
framer-motion, aos, `EditorPage.jsx`'s remaining hardcoded slide-component
imports and a large icon set into the single eagerly-loaded main JS chunk,
regardless of route — including for a user who only ever visits `/login`.
Confirmed by the build output: `EditorPage`, `DeckListPage` and `NewEditor`
now emit as their own separate chunks (`EditorPage-*.js`, `DeckListPage-*.js`,
`NewEditor-*.js`) rather than being inlined into `index-*.js`.

**Free-element re-render reduction (`FreeElementLayer.jsx`, `SlideCanvas.jsx`)**:
`SlideCanvas` and both the outer `FreeElementLayer` and inner per-element
`FreeElement` component are now wrapped in `React.memo`. This only pays off if
the props each element receives are actually referentially stable across a
drag/resize/rotate pointermove (which dispatches on every frame via
`useFreeElementInteraction`), so three things had to change together:
`elements` is already immutably updated by `deckReducer` (only the touched
element's object reference changes), `SlideCanvas` now wraps its
`onChangeContent`/`onUpdateElement`/`onDeleteElement`/`onDuplicateElement`/
`onReorderElements` callbacks it hands to `FreeElementLayer` in `useCallback`
(keyed on `slide.id`, not recreated per render), and `FreeElementLayer`'s own
toolbar handlers (bring-forward/send-backward/duplicate/delete) read the
current `elements`/`selectedElementId` off a ref rather than closing over them
directly, so their own identity stays stable too. Net effect: a pointermove
during a drag now only re-renders the one `FreeElement` actually being
manipulated, not every element on the slide.

**Tests**: `FreeElementLayer.renderOptimization.test.jsx` (new) asserts the
render-count behavior directly — an unrelated element's render count does not
increase while a different element is being dragged. No existing test's
assertions changed; this is a render-count optimization, not a behavior
change, and the entire pre-existing free-element interaction/selection test
suite (`FreeElementInteraction.integration.test.jsx`,
`FreeElementLayer.test.jsx`, `FreeElementLayer.themeRendering.test.jsx`)
continues to pass unmodified.

**Not measured**: no Lighthouse/bundle-size-before-vs-after numbers were
captured; the win is architectural (fewer/smaller eagerly-loaded chunks,
fewer re-renders per frame during drag) and verified by the build output
chunk list and the render-count test, not by a benchmark run.

## 1e-10. Full regression testing — Implemented

Roadmap #17. Added test coverage across the free-element interaction stack,
undo/redo, autosave, and deck-reducer/content-mapper edge cases that
previously had thinner or no dedicated coverage. This does **not** include
the roadmap #13 inline-text-editing undo/redo DOM-resync fix — that is
pre-existing work (§1e-7), already implemented and already documented there;
it is not re-claimed as new here.

**Real bug fix found and fixed**: `useFreeElementInteraction.js`'s
`beginDrag`/`beginResize`/`beginRotate` and the shared `handlePointerMove`/
`endGesture` did not check which pointer a gesture belonged to. A second
pointer (e.g. a second touch) landing on the same element mid-gesture would
silently steal/overwrite the active gesture's `gestureRef`, corrupting the
math for both pointers (the first pointer's subsequent moves would then be
interpreted against the second pointer's start position). Fixed by filtering
every gesture entry point and the shared move/end handlers on
`gesture.pointerId === event.pointerId` — a gesture already in progress from
a different pointer is now ignored rather than stolen. New tests in
`useFreeElementInteraction.test.js` cover the fix directly (a second
pointer's `beginDrag`/`beginResize`/`beginRotate` is ignored while a gesture
from a different pointer is active; `handlePointerMove`/`handlePointerUp`
from a non-owning pointer are no-ops).

**New test files** (net-new coverage; `RichText.test.jsx`,
`widgets/TextWidget.test.jsx` and `UndoRedoTextEditing.integration.test.jsx`
already existed from §1e-7 and only got a handful of additional cases each,
noted separately below):
- `useFreeElementInteraction.test.js` — the pointerId gesture-corruption fix above, plus drag/resize/rotate math coverage for the hook in isolation.
- `FreeElementLayer.renderOptimization.test.jsx` — the render-count assertions backing §1e-9.
- `FreeElementRenderer.test.jsx`, `FreeElementSelection.test.jsx`, `FreeElementToolbar.test.jsx` — previously untested in isolation (only exercised indirectly through `FreeElementLayer.test.jsx`/the integration tests).
- `domUtils.test.js`, `freeElementFactory.test.js` — previously untested in isolation.
- `SlideSidebar.test.jsx`, `SlideThumbnailContent.test.jsx` — previously untested in isolation (only exercised indirectly through `EditorPage.test.jsx`).
- `AutosaveUndo.integration.test.jsx` — autosave (`useAutosave`) interacting with undo/redo (`useDeckHistory`) through the real `DeckContext` stack.
- `UndoRedoCrossFeature.integration.test.jsx` — undo/redo interacting with other reducer-driven features (Remix, background changes, free-element ops) in combination, rather than each in isolation.

**Additional cases added to existing files**:
- `UndoRedoTextEditing.integration.test.jsx` +4 (redo re-applies to the visible DOM; a normal render that merely echoes the widget's own just-emitted value doesn't disturb the DOM; undoing one field doesn't affect a sibling field; a free-element `TextWidget`'s edit reverts through the real `SlideCanvas`/`FreeElementLayer` stack, not just `ProblemLayout`/Froala).
- `widgets/TextWidget.test.jsx` +1 (`contentEditable` reflects the `editing` prop).
- `contentMappers.test.js` +4 (`normalize`/`denormalize` don't throw on an unknown layout or a fully-empty content object; `denormalize` returns `targetDefaultContent` unchanged for an unknown target layout).
- `deckReducer.test.js` +13 (`it.each` table covering the shared "missing/invalid slideId or elementId warns and no-ops" contract across every slide-scoped action — `ADD_SLIDE`, `DUPLICATE_SLIDE`, `REORDER_SLIDES`, `SET_SLIDE_LAYOUT` (including an unknown layout id), `UPDATE_SLIDE_CONTENT`, `SET_SLIDE_BACKGROUND`, `ADD_FREE_ELEMENT`, `UPDATE_FREE_ELEMENT`, `REMOVE_FREE_ELEMENT` — plus `REORDER_SLIDES` out-of-range `toIndex` and `REMOVE_FREE_ELEMENT` for a non-existent `elementId`).

**365/365 tests passing** (up from 237), build clean.

**Not covered**: no real-browser/E2E pass — same caveat as everywhere else in
this document; all of the above is jsdom/Vitest-level. No visual regression
tooling was introduced.

## 1e-11. Slide/element animations — Implemented

Roadmap #15. The user's own decision (relayed into this task) was: a simple
CSS-transition-based fade/slide crossfade between slides on navigation, not a
recreation of the old scroll-stack effect — that effect mounted every slide
as a sibling, which is structurally incompatible with the current
architecture (`SlideCanvas` renders one slide at a time via `key={slide.id}`
remount, and other features — free-element selection clearing, `RichText`
re-seeding — depend on that remount, see §1e-7). So this is new orchestration
around the existing remount behavior, not a change to it.

**`SlideTransition.jsx`** (new): a small wrapper component,
`<SlideTransition slide={currentSlide} render={(slide) => <SlideCanvas ... />} />`,
now used in `EditorPage.jsx` in place of the bare `<SlideCanvas .../>` that
used to sit directly under the canvas container. It tracks `current`/
`previous` slide objects in local state. On a real navigation (`slide.id`
changes), it keeps the outgoing slide's `previous` around for
`TRANSITION_MS` (300ms) alongside the new `current`, rendering both through
the caller's `render(slide)` — i.e. two real `<SlideCanvas>` instances,
briefly, each still keying its own `LayoutComponent` on `slide.id` exactly as
before — inside two absolutely-positioned layers (`EnterLayer`/`ExitLayer`)
whose `opacity`/`transform` are toggled via plain inline `style.transition`
(CSS transition, not a library) after a `requestAnimationFrame`, so the
browser actually animates the change instead of jumping straight to the end
state. After the timeout, `previous` is dropped and only the new slide stays
mounted — an abrupt swap never happens, but neither does anything stay
double-mounted longer than the transition window.

**Why CSS transitions, not `framer-motion`/`aos`**: both already exist as
deps (per §1e-9) but only for other, unrelated legacy screens (`App.jsx`,
`screens/matchflow`, `Fundraising/*`, `NewEditor.jsx`) — nothing in
`src/components/new/deck` uses either today, and this effect (opacity + a
10px translate on two `position:absolute` layers) doesn't need a library.
Pulling one in here would add a second animation mechanism to this component
tree and extra weight to `EditorPage.jsx`'s own lazy-loaded chunk (§1e-9) for
no real gain.

**Not a true content-level double-render risk**: `ExitLayer` sets
`pointerEvents: "none"` unconditionally, so the outgoing slide's
free elements can never intercept a click/drag while fading out and can never
be confused for the active slide. `SlideTransition` only ever treats a
`slide.id` *change* as a navigation — an in-place content edit (a new slide
object with the same `id`, which is what every `UPDATE_SLIDE_CONTENT`/
`UPDATE_FREE_ELEMENT` dispatch produces) swaps `current` in place with no
crossfade at all, so typing, dragging, resizing, and rotating never race
against an animation; those gestures also can't start mid-crossfade in
practice because navigating already clears `selectedElementId`/
`editingElementId` in `EditorPageBody` (pre-existing behavior, §1) before any
transition begins.

**`prefers-reduced-motion`**: a small `usePrefersReducedMotion()` hook
(`window.matchMedia("(prefers-reduced-motion: reduce)")`, the JS
equivalent the brief allowed as an alternative to a plain CSS media query —
chosen because the same boolean also has to suppress the two-layer crossfade
*logic* in `SlideTransition`, not just the CSS, so a data-only media query
wouldn't have been enough on its own) subscribes to OS-level changes and, when
true, skips the whole `previous`-layer dance: navigation swaps `current`
directly with `transition: "none"` on the entering layer — instant, no
animation, same as an abrupt swap used to be. The hook defensively no-ops
(returns `false`) when `window.matchMedia` doesn't exist (`jsdom` doesn't
implement it by default — confirmed while writing this).

**Element-level animation** (brief's secondary/optional ask): not built as a
separate mechanism. Free elements render through `FreeElementLayer` inside
`SlideCanvas`, and `SlideCanvas` itself is what gets wrapped by
`EnterLayer`/`ExitLayer` — so every free element on the incoming slide
already fades/slides in together with the rest of the slide as part of the
same crossfade, at no extra cost and with no additional risk to the
interaction engine. A separate per-element stagger/animation was deliberately
not added on top of that: the brief was explicit not to over-invest here once
the slide-level transition is the priority, and per-element timing would mean
either delaying `FreeElementLayer`'s mount (risking interaction-engine
timing) or animating individual `FreeElement` nodes independently of the
slide crossfade (two overlapping animation systems for one visual effect).
Because the crossfade only ever triggers on a real slide-id change - never
during a drag/resize/rotate gesture on the same slide (see above) - nothing
animates while a free element is being manipulated.

**Files touched**: new `src/components/new/deck/SlideTransition.jsx`;
`src/components/new/EditorPage.jsx` (import + the one render-site change
described above — `SlideCanvas`/`FreeElementLayer` themselves are
unmodified).

**Tests**: new `SlideTransition.test.jsx` (6 tests, isolated component-level —
first-mount has no exit layer; navigating keeps both slides mounted then
drops the outgoing one after the transition window; an in-place content
edit on the same id never creates an exit layer; enter/exit layers carry a
real CSS `transition` style and the exit layer is `pointerEvents: none`;
`prefers-reduced-motion` skips the crossfade and exit layer entirely and sets
`transition: none`; a null `slide` renders nothing). New
`EditorPageSlideTransition.integration.test.jsx` (3 tests, through the real
`EditorPage.jsx` nav-dot flow — initial render wraps the active slide with no
exit layer yet; clicking a nav dot produces two real `SlideCanvas` instances
mid-crossfade (`slide-transition-exit` present, two `slide-canvas` nodes)
and settles back down to one after the transition window; no crossfade
fires for an in-place edit). **374/374 tests passing** (up from 365), build
clean.

**Not verified**: no real browser was available in this session, so the
actual visual result — smoothness of the opacity/transform transition, real
`requestAnimationFrame` timing, whether 300ms/10px "feels" right, whether the
mouse-wheel nav's existing `isAnimatingRef`/600ms debounce (`EditorPage.jsx`,
unrelated pre-existing code that throttles repeated wheel events) interacts
visually with this transition's own 300ms window — is unverified, same
caveat as everywhere else in this document. Also unverified: real Froala
editor behavior when two `SlideCanvas` instances (and therefore two sets of
Froala editors, one per rich-text field on each of the two briefly-mounted
slides) exist simultaneously for ~300ms during a crossfade — the jsdom-level
tests exercise this through the real component tree, but Froala itself is
never loaded in this environment (same caveat noted for the Change Case tool,
§1e-8) so its real-world DOM/editor-instance cost during that window has not
been observed.

## 1e-12. Layout-change UI — Implemented

A follow-up gap found during an external audit of this document: `SET_SLIDE_LAYOUT`
(§1e-2) and its semantic normalize/denormalize pipeline were fully implemented and
already used by Remix (§1e-4) and AI storyline generation (§1e-5), but nothing in
`EditorPage.jsx` let the user pick a layout for an *existing* slide themselves —
only Remix (system picks) and "Insert new slide" (picks a layout for a slide that
doesn't exist yet) dispatched it.

**UI**: the existing `LayoutPicker` modal component (previously only used for
"Insert new slide") gained two optional props — `activeLayoutId` (highlights the
slide's current layout with a checkmark/border) and `title` (so it can read
"Change Layout" instead of "Choose a Layout") — so one component now serves both
flows instead of duplicating the modal. A new "Layout" button (`LayoutGrid` icon)
sits in the bottom toolbar next to Remix, same visibility condition (slide index
> 0). Selecting a layout calls `handleChangeSlideLayout`, which no-ops if the
user re-picks the slide's current layout (avoids a pointless dispatch) and
otherwise dispatches the exact same `SET_SLIDE_LAYOUT` action Remix already uses
— no reducer change, no new content-transform logic.

**Tests**: `EditorPage.test.jsx` +1 — opens the picker from slide 2 ("problem"),
asserts the "Change Layout" title, selects "Call To Action", and asserts (scoped
to the active slide's canvas, not the sidebar thumbnail preview which shows the
same text) that the heading carried over from the semantic model ("The Problem")
while the button label fell back to `cta`'s own default ("Get in touch") — proof
the layout genuinely switched rather than the picker being a no-op. **375/375
tests passing** (up from 374), build clean.

**Not verified in a real browser** — same caveat as everywhere else in this
document.

## 1e-13. Real media upload — Implemented

Roadmap gap found by the 2026-09-25 audit (§1e-12's note): `ImageWidget.jsx`/
`VideoWidget.jsx` used `URL.createObjectURL(file)`, a blob URL scoped to the
browser tab that stops resolving after a refresh - so an uploaded image/video
looked fine until the deck was reloaded from its autosaved JSON.

**Backend (`Vertx_flow_Server`, separate repo)**: new `POST /api/files/deck-asset`
in the existing `uploadRoutes.js`, behind `authMiddleware`, reusing the same
GCS bucket (`config/gcs.js`) and temp-file-then-upload pattern the existing
`/upload` (PDF/PPT) route already uses - but deliberately *not* the `Upload`
mongoose model that route writes to, since that model is one record per user
(wrong shape for arbitrary per-slide images/videos). This route is stateless:
validates the file's mimetype is `image/*` or `video/*`, uploads it to
`deck-assets/<timestamp>-<random><ext>` in the bucket, and returns
`{ success: true, url }` - the deck document (already persisted via the `Deck`
model/autosave) is the only place that URL needs to live.

**Frontend**: `uploadAsset(file)` (new, `src/utils/deckApi.js`) posts the file
as `FormData` to `/files/deck-asset`. It deliberately bypasses the shared `api`
axios instance, which forces `Content-Type: application/json` on every
request - that would strip FormData's own multipart boundary and break the
backend's `express-fileupload` parsing; a raw `axios.post` with no manual
Content-Type lets the browser set the correct multipart header itself.
`ImageWidget.jsx`/`VideoWidget.jsx` now call `uploadAsset(file)` instead of
`URL.createObjectURL`, with a small `idle | uploading | error` status shown on
the placeholder (so an upload in flight or a failed upload is visible, not
silent) - `onReplaceSrc` only fires on a real, persistent URL from the backend.

**Tests**: backend `routes/uploadRoutes.deckAsset.test.js` (new, 3 tests via
`supertest` against the real router with `authMiddleware`/the GCS `bucket`
mocked - missing file, disallowed mimetype, success-returns-URL). Backend
suite: **23/23 passing** (up from 20). Frontend: `deckApi.test.js` (new, 2
tests - posts multipart form data with the auth header and no forced
Content-Type, and propagates a failure), `ImageWidget.test.jsx` and
`VideoWidget.test.jsx` (new, 3 and 2 tests respectively - renders once a src
exists, uploads-then-calls-`onReplaceSrc` with the real URL not a blob URL,
and the error/retry-placeholder path). **382/382 tests passing** (up from
375), both builds clean.

**Not verified against a real GCS bucket or in a real browser** - same caveat
as everywhere else in this document; the backend test mocks the `@google-cloud/
storage` bucket rather than hitting a real one, and no manual upload-then-
refresh click-through has been done.

**Out of scope, deliberately deferred**: `BackgroundPicker`'s image/video URL
fields are still plain text inputs with no file picker at all - a smaller,
separate follow-up if wanted.

## 1e-14. Element-to-element snapping — Implemented

`useFreeElementInteraction.js`'s drag snapping previously only snapped to the
slide's own center/edges (0/50/100). Generalized `applyDragSnap`'s anchor list
to also include, per axis, every sibling free element's start/center/end
(left/center-x/right for x, top/center-y/bottom for y) - same 1.5pt threshold,
same center-then-start-then-end priority order the slide-only version already
used, so existing slide-edge-snap behavior is unchanged when there are no
siblings (or none are close enough).

**Wiring**: `FreeElementLayer.jsx` already keeps a stable `elementsRef` (for
the bring-forward/send-backward/duplicate toolbar handlers, so `elements`
changing every dispatch doesn't defeat `FreeElement`'s `React.memo`). A new
`getSiblingsOf(id)` reads that same ref - stable identity via `useCallback`
with no deps - and is passed to every `FreeElement` as a prop; each one calls
`useFreeElementInteraction({ ..., getSiblings: () => getSiblingsOf(element.id) })`.
The hook snapshots `getSiblings()` once at `beginDrag` (siblings aren't
expected to move mid-drag) rather than calling it every pointermove.

**Tests**: `useFreeElementInteraction.test.js` +2 (snaps to a sibling's edge
within threshold; does not snap when outside it).
`FreeElementInteraction.integration.test.jsx` +1 (through the real
`SlideCanvas`/`FreeElementLayer`/reducer stack - two real elements, drag one
near the other's edge, assert the reducer-committed position). **385/385
tests passing** at this point in the session (before §1e-15 below), build
clean.

**Not verified in a real browser** - same caveat as everywhere else in this
document.

## 1e-15. Typography scale tokens — Implemented

`theme.typography.headingScale`/`bodyScale` (§1e's known limitation) are now
wired into every layout's rendered font size instead of only affecting font
family/color.

**`themeToCssVars`** (`themeTokens.js`) now emits `--theme-heading-scale`/
`--theme-body-scale` alongside the existing `--theme-heading-font`/
`--theme-body-font` vars. New `theme/typographyScale.js` exports
`headingFontSize(baseRem)`/`bodyFontSize(baseRem)` → `calc(<base>rem *
var(--theme-heading-scale, 1))` (the `, 1` fallback keeps a layout readable
if rendered outside the themed root wrapper).

**All 7 layouts** now pass an explicit `fontSize` in the same `style` object
that already carries `fontFamily: var(--theme-heading-font|body-font)` -
mechanical, one-for-one with the existing font-family wiring from the theme
sub-project (§1e) - converting each layout's previously-fixed Tailwind
text-size class (`text-7xl`, `text-5xl`, `text-4xl`, `text-xl`, plain
`text-base` default, etc.) into its rem-equivalent base passed to
`headingFontSize`/`bodyFontSize`. The Tailwind size class itself is left in
place (inline style wins for the same CSS property, and removing the class
would be a no-op change with more diff) - only the computed value now differs
per theme.

**Tests**: `themeTokens.test.js` +1 (new CSS vars present), new
`typographyScale.test.js` (2 tests - both helpers produce the right `calc()`
string). One targeted test added to each of the 7 layout test files, asserting
the rendered heading/body element's `style.fontSize` is the expected
`calc()` string (not empty/a fixed value) - `ProblemLayout.test.jsx`'s body
assertion has to walk up from the RichText field's inner `<p>` to the styled
wrapping `<div>` via `.closest("div")`, since `getByText` resolves to the
innermost element containing the matched text. **395/395 tests passing** (up
from 385), build clean.

**Not done**: letter-spacing (also named in the original known-limitation
note) - no layout sets `letter-spacing` today, hardcoded or otherwise, so
there's no existing per-layout value to convert the way font-size classes
were; adding it would mean inventing values with no precedent, deferred as a
separate, smaller follow-up if wanted. **Not verified in a real browser** -
same caveat as everywhere else in this document.

## 1e-16. Template library — Implemented

A Chronicle-style "start from a template" gallery, on top of the 7 existing
structural layouts - not a replacement for them, a curated set of full
multi-slide decks built from them.

**`templateLibrary.js`** (new): `TEMPLATE_LIBRARY`, 3 curated templates
("Startup Pitch," "Product Launch," "Company Overview"), each an ordered list
of `{layout, content}` pairs using the 7 existing layouts. `content` is
authored directly against its own layout's shape - unlike Remix/AI storyline,
there's no semantic mapping step, since this content was never in any other
layout's shape to begin with. `buildDeckFromTemplate(template)` merges each
slide's `content` over that layout's `defaultContent()` (same defensive-merge
guard `SET_SLIDE_LAYOUT`'s reducer branch already applies, so a template can
omit a field) and calls `createSlide`/`createDeck` - mirrors
`storylineToDeck.js`'s tail exactly, minus the AI/semantic-mapping step.

**`TemplateGalleryModal.jsx`** (new): a grid of template cards (category,
name, description, slide count); picking one calls `buildDeckFromTemplate` →
`deckApi.createDeck` → `onDeckCreated(deckId)` - the same shape
`AIStorylineModal`'s tail already has, so `DeckListPage.jsx` wires it in
identically: a third "Start from Template" button next to "Blank Deck"/
"Generate with AI," opening the gallery.

**Tests**: `templateLibrary.test.js` (new, 6 tests - every template has an
id/name/category/slides, only uses registered `LAYOUT_IDS`, unique ids,
`buildDeckFromTemplate` produces the right slide count/order/layout, merges
over `defaultContent()`, uses the template name as the deck title).
`TemplateGalleryModal.test.jsx` (new, 3 tests - renders a card per template,
picking one creates the deck and calls back with its id, Cancel calls
`onClose`). `DeckListPage.test.jsx` (new - this page had no test file before;
covers only the new button/gallery/create flow, not the pre-existing
list/delete behavior). **405/405 tests passing** (up from 395), build clean.

**Not done**: no thumbnail/preview images per template card (text-only
cards); no way to add/curate templates from the UI (editing
`TEMPLATE_LIBRARY` is a code change). **Not verified in a real browser** -
same caveat as everywhere else in this document.

## 1e-17. Expanded widget types + Insert Widget UI — Implemented

Scoping this (EDITOR-V2-STATUS.md's last remaining gap from the 2026-09-25
audit) surfaced a more fundamental gap than "add 4 more widget types": **there
was no UI to insert *any* free element at all.** `createWidget()`/
`ADD_FREE_ELEMENT` existed and the drag/resize/select/delete engine was fully
wired for elements already on a slide, but nothing in `EditorPage.jsx` ever
called `createWidget`/dispatched `ADD_FREE_ELEMENT` - the toolbar's "Insert"
button only inserts a new *slide*. So this sub-project necessarily includes
building that menu, not just the 4 new types.

**Insert Widget menu**: new `InsertWidgetMenu.jsx`, a small dropdown (one
entry per `freeElementFactory.WIDGET_TYPES`) opened by a new "Elements"
button in the bottom toolbar, next to "Insert." Picking an entry calls
`EditorPage.jsx`'s new `handleInsertWidget(type)`, which mirrors the existing
duplicate-widget/remix pattern: `createWidget(type, { existingCount,
existingMaxZIndex })` (staggers position, stacks above everything already on
the slide - the same factory function the interaction engine's duplicate
button already used) → dispatches `ADD_FREE_ELEMENT` → selects the new
element immediately so its handles/toolbar are visible without an extra
click.

**4 new widget types**, hand-rolled (no charting/embed library - see the
brainstorming discussion this session: the data here doesn't need one, and
every other "should we add a library" decision in this codebase - CSS
transitions over framer-motion (§1e-11), deterministic Remix/content-
intelligence over an extra AI call - has gone the same way):
- **Chart** (`ChartWidget.jsx`): inline-SVG-free CSS bar chart, `props.data =
  [{label, value}]` - deliberately the same shape as the metrics data
  content-intelligence (§1e-6) already extracts, so a future "AI-generated
  chart" wouldn't need a new content shape.
- **Timeline** (`TimelineWidget.jsx`): a row of connected markers,
  `props.items = [{label, date, description}]`.
- **Quote** (`QuoteWidget.jsx`): a styled blockquote + attribution,
  `props = {text, author, role}`.
- **Embed** (`EmbedWidget.jsx`): a pasted-URL placeholder (mirrors
  `ImageWidget`/`VideoWidget`'s upload-placeholder shape) that renders an
  `<iframe>` once set. Deliberately stores the URL under `props.src`, not
  `props.url`, so it reuses `FreeElementLayer`'s existing generic
  `onReplaceSrc(elementId, url)` wiring with zero changes to that file.

Each new type is one entry in `freeElementFactory.WIDGET_DEFAULTS` (default
geometry/props), one case in `FreeElementRenderer.jsx`, and one entry in
`InsertWidgetMenu.jsx` - confirms the existing "adding a widget type" doc
comment on both those files was accurate; nothing about the interaction
engine (select/drag/resize/rotate/layer/delete/duplicate) needed to change.

**Not done, matching the existing Shape/Divider/Icon precedent**: Chart/
Timeline/Quote have no in-place content-editing UI - they're visual widgets
configured only via their factory defaults, the same limitation those three
pre-existing widget types already have (none of them have live-edit UI
either). Building a structured-data editor (add/remove chart bars, timeline
items, etc.) would be a separate, larger "widget property panel" feature.
Embed is fully interactive (paste a URL) since that fits the existing
replace-src pattern for free.

**Tests**: `freeElementFactory.test.js` +9 (`WIDGET_TYPES` now lists 10
types; `createWidget` for each new type). `FreeElementRenderer.test.jsx` +4.
New `ChartWidget.test.jsx` (3), `TimelineWidget.test.jsx` (2),
`QuoteWidget.test.jsx` (2), `EmbedWidget.test.jsx` (3) - each covering
rendering, theme-default-vs-explicit-override color where applicable (Chart/
Timeline), and Embed's placeholder→iframe flow. New `InsertWidgetMenu.test.jsx`
(2). `EditorPage.test.jsx` +1 (opens the menu, picks "Chart," asserts a
`[data-type="chart"]` element lands on the current slide - the first test in
this codebase proving a free element can be inserted from the live UI at
all). **426/426 tests passing** (up from 405), build clean.

**Not verified in a real browser** - same caveat as everywhere else in this
document; additionally, `EmbedWidget`'s `<iframe>` has not been tested
against a real embeddable URL (X-Frame-Options/CSP restrictions on the target
site are a real-world concern this environment can't exercise).

## 1e-18. Full text-editing audit — Real bug found and fixed

A follow-up audit (roadmap's original "full text-editor audit" item, never
completed - §1e-7 fixed one specific undo/redo defect but explicitly scoped
out the broader toolbar/paste/keyboard-shortcut/selection review). Same
approach as §1e-7: no pre-existing bug list, so the work was find real bugs
by reasoning through the actual code, fix them, prove it with tests - not
invent speculative fixes.

**Real bug found**: `TextWidget.jsx` (free-element text) only persists its
typed content on blur (`onBlur` → `onCommit`), unlike `RichText.jsx`/Froala
fields which commit continuously via `contentChanged` on every keystroke.
`EditorPage.jsx` had two places that changed `editingElementId` - the state
that flips a `TextWidget` out of edit mode - **without ever blurring the
live DOM first**: the slide-navigation effect (`setEditingElementId(null)`
on `currentSlideIndex` change) and `FreeElementLayer`'s double-click-to-edit
handler (`onStartEditing(element.id)`, wired straight to the raw setter).
Since React flipping a div's `contentEditable` prop to `false` doesn't
reliably fire a native blur event on its own, a user could double-click a
free-text element, type new content, and then navigate to a different slide
(or double-click a different element) - and that typed content would never
reach `onCommit`, silently discarded from the deck (and, worse, never
autosaved).

**Fix**: `setEditingElementIdCommitFirst(nextId)`, a wrapper around
`setEditingElementId` that calls `document.activeElement.blur()`
synchronously before changing the state - forcing `TextWidget`'s own
`onBlur` (which is unconditionally attached, regardless of the widget's
current editing state) to run and commit first, rather than depending on
the browser firing blur on its own timing. Both call sites (`EditorPage.jsx`)
now go through it.

**Confirmed real, not speculative**: the slide-navigation repro (insert a
text widget, edit it without blurring, navigate away and back) failed
against the un-fixed code with a concrete assertion failure ("Double-click
to edit" instead of the typed text) before the fix, and passes after it.

**Scope note on the pre-existing "textColor/backgroundColor bug"** (§1e-8's
own passing mention: "a previously reported bug there - no detail survived
into this document"): investigated but could not be reproduced or even
characterized - Froala's `textColor`/`backgroundColor` are its own built-in
commands with no custom code in this repo to inspect, and this environment
has no way to load the real Froala library or a real browser to observe
color-picker behavior (same limitation as the Change Case tool, §1e-8).
Deliberately **not** "fixed" with a guess; left open, now with this note
attached so future work isn't chasing a bug with zero remaining detail.

**Notable adjacent finding, not part of this task's scope**: **undo/redo has
no UI entry point in the live editor at all** - no button, no Ctrl+Z/Cmd+Z
keyboard shortcut in `EditorPage.jsx`. The engine (`useDeckHistory`, §1 "Undo/
redo") is fully implemented and tested, but only exercised in tests through a
bespoke `Host` harness (`FreeElementInteraction.integration.test.jsx`) - a
real user of the deployed app cannot undo or redo anything today. Flagged
here rather than fixed, since it's outside "text editing" and deserves its
own scoping pass.

**Tests**: `EditorPage.test.jsx` +2 (commits before slide navigation;
commits before double-clicking a different element to edit it - the second
test's assertion is proven via a round-trip through a different slide, since
without a forced remount neither the buggy nor fixed code path changes what
the live DOM shows, only what's actually in the store). **428/428 tests
passing** (up from 426), build clean.

**Not verified in a real browser** - same caveat as everywhere else in this
document. Paste behavior, individual Froala toolbar commands beyond Change
Case, and cursor/selection edge cases remain genuinely unauditable without a
real browser + a loaded Froala instance - not skipped out of laziness, this
environment has no way to exercise them.

## 1e-19. Undo/Redo UI — Implemented

The gap §1e-18 flagged: `useDeckHistory`'s `{undo, redo, canUndo, canRedo}`
(already exposed by `useDeck()`) had no way for a real user to reach them -
no button, no keyboard shortcut, anywhere in `EditorPage.jsx`. Pure UI
wiring; no change to `useDeckHistory`/`deckReducer`.

**Toolbar buttons**: Undo/Redo (`Undo2`/`Redo2` icons) added to the bottom
toolbar, disabled via `!canUndo`/`!canRedo`.

**Keyboard shortcut**: `Ctrl/Cmd+Z` (undo) / `Ctrl/Cmd+Shift+Z` (redo), a
global `keydown` listener. Skipped whenever `document.activeElement`'s
`contenteditable` attribute is `"true"` - a Froala field or a free-text
widget mid-edit - so it never fights the field's own native/Froala undo
while someone is actively typing (the same "don't steal keyboard behavior
from an active field" principle `FreeElementLayer`'s Delete-key handler
already applies for editingElementId). Checks the `contenteditable`
*attribute* directly rather than the `isContentEditable` IDL property -
jsdom doesn't implement the latter (always returns `false`), and the
attribute check is correct in both jsdom and real browsers since React
renders `contentEditable={true}` as `contenteditable="true"`.

**Tests**: `EditorPage.test.jsx` +3 - toolbar buttons undo/redo a free-
element insert and correctly disable at each end of the history; Ctrl+Z
undoes when nothing is being edited; Ctrl+Z is a no-op while a free-text
widget is mid-edit. **431/431 tests passing** (up from 428), build clean.

**Not verified in a real browser** - same caveat as everywhere else in this
document; additionally, the Ctrl+Z-while-editing guard has only been proven
against the free-text `TextWidget` path (this environment can't load real
Froala to prove the same guard doesn't fight Froala's own undo).

## 2. Not started at all
Nothing left unstarted per the original roadmap — see §4 for remaining known defects.

Since this document was last written as "complete," an external audit against
this repo (2026-09-25) found the following gaps that are real and still open
(the audit's other claims — Remix, Change Case, animations, AI storyline, 10+
slide generation, content intelligence — were already implemented; see above):

- ~~Layout-change UI~~ **Fixed above (§1e-12).**
- ~~Real media/asset upload~~ **Fixed above (§1e-13).**
- ~~Element-to-element snapping~~ **Fixed above (§1e-14).**
- ~~Typography scale tokens~~ **Fixed above (§1e-15)** (letter-spacing still not
  wired - see that section's "Not done").
- ~~Template library~~ **Fixed above (§1e-16).**
- ~~Expanded widget types~~ **Fixed above (§1e-17)**, which also fixed a bigger
  latent gap it uncovered: there was no UI to insert *any* free element,
  existing or new, onto a slide before this.

No further gaps remain open from the 2026-09-25 audit as of this entry.

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

**374/374 tests passing** across 46 files (`npm run test`), `npm run build` passing. Growth this session: 111 → 128 (free-element selection state + persistence hooks + SlideSidebar wiring) → 136 (semantic layout transformation) → 141 (background data model/rendering) → 149 (BackgroundPicker) → 163 (§4 defect fixes: reducer payload validation + `EditorPage.test.jsx`) → 164 (`slideBackgroundStyle` url-escaping regression test) → 177 (Remix: `remix.test.js` + `REMIX_SLIDE` reducer tests) → 186 (AI storyline generation: `pickBestLayout` tests + `storylineToDeck.test.js`, §1e-5) → 209 (AI 10+ slide generation & content intelligence: `contentIntelligence.test.js` + `storylineToDeck.test.js` integration case, §1e-6 - `narrativeBeats.test.js` is counted in the backend suite below, not here) → 218 (Inline text editing audit/fixes: `RichText.test.jsx` +3, new `TextWidget.test.jsx` (5) and `UndoRedoTextEditing.integration.test.jsx` (1), §1e-7) → 237 (Change Case tool: new `caseTransforms.test.js` (13) + `RichText.test.jsx` +6, §1e-8) → 365 (performance optimization + full regression testing, §1e-9/§1e-10: 11 new test files — `useFreeElementInteraction.test.js`, `FreeElementLayer.renderOptimization.test.jsx`, `FreeElementRenderer.test.jsx`, `FreeElementSelection.test.jsx`, `FreeElementToolbar.test.jsx`, `domUtils.test.js`, `freeElementFactory.test.js`, `SlideSidebar.test.jsx`, `SlideThumbnailContent.test.jsx`, `AutosaveUndo.integration.test.jsx`, `UndoRedoCrossFeature.integration.test.jsx` (106 tests total), plus targeted additions to `UndoRedoTextEditing.integration.test.jsx` (+4), `widgets/TextWidget.test.jsx` (+1), `contentMappers.test.js` (+4) and `deckReducer.test.js` (+13)) → 374 (slide/element animations, §1e-11: new `SlideTransition.test.jsx` (6) + `EditorPageSlideTransition.integration.test.jsx` (3)).

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
| 14 | Change Case tool | — | **Implemented** (see §1e-8) |
| 15 | Slide/element animations | benefits from #3 (element engine) for element-level animation | **Implemented** (see §1e-11) |
| 16 | Performance optimization | most other items | **Implemented** (see §1e-9) |
| 17 | Full regression testing | everything | **Implemented** (see §1e-10; 365/365 automated; real-browser pass still outstanding, see §4) |

Every item through #17 is now implemented and wired into the live
`EditorPage.jsx`/`DeckListPage.jsx` (or, for #1, #10, #11, and #12, into a real backend
too). No roadmap item remains unstarted; see §4 for remaining known defects/rough edges.
