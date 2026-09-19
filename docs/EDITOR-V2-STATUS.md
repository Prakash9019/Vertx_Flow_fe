# Editor V2: Status & Roadmap to Production

**Branch:** `editor-deck-model` (worktree at `.worktrees/editor-deck-model`, not yet merged to `main`)
**Scope of this pass:** foundation only — replacing the hardcoded, non-serializable slide components in `EditorPage.jsx` with a real data model. This was explicitly scoped as sub-project 1 of a much larger rebuild (see original 15-point brief below); every other sub-project is still ahead.

---

## 1. What's implemented

### Data model & state management
- **`src/components/new/deck/deckTypes.js`** — `Deck`/`Slide`/`FreeElement` factories (`createDeck`, `createSlide`, `createFreeElement`), `LAYOUT_IDS` (the 7 supported layouts), `generateId`.
- **`src/components/new/deck/deckReducer.js`** — single reducer, 10 action types, all immutable, all validated at the boundary (unknown ids/action types `console.warn` + no-op instead of throwing):
  `ADD_SLIDE`, `DELETE_SLIDE`, `DUPLICATE_SLIDE`, `REORDER_SLIDES`, `SET_SLIDE_LAYOUT`, `UPDATE_SLIDE_CONTENT`, `SET_SLIDE_BACKGROUND`, `ADD_FREE_ELEMENT`, `UPDATE_FREE_ELEMENT`, `REMOVE_FREE_ELEMENT`.
- **`src/components/new/deck/DeckContext.jsx`** — `DeckProvider`/`useDeck()`. This is the single source of truth; nothing in `EditorPage.jsx` holds duplicate slide-shaped state anymore.
- **`src/components/new/deck/contentMappers.js`** — `identityMapper` (default fallback) and `paragraphToBulletsMapper` (the one real content-shape mapper, registered only for `problem → media-3points`). `SET_SLIDE_LAYOUT` merges the mapper's output over the target layout's `defaultContent()`, so switching to *any* layout — even one with no bespoke mapper — always yields a complete, renderable content shape instead of crashing.

### Rendering
- **`src/components/new/deck/RichText.jsx`** — the shared Froala field every layout uses. Fixed during final review: it no longer holds a stale `onChange` closure, and it's "uncontrolled after mount" so React doesn't fight Froala's live DOM. **Remounts correctly per slide** via `key={slide.id}` in `SlideCanvas`.
- **7 layout components** (`src/components/new/deck/layouts/`): `TitleLayout`, `ProblemLayout`, `MediaDescriptionLayout`, `Media3PointsLayout`, `MetricsGridLayout`, `TeamGridLayout`, `CtaLayout`. Each has a `default*Content()` factory and fills its 16:9 container (`h-full w-full`, not `min-h-screen`).
- **`SlideRegistry.js`** — maps each `LayoutId` to `{component, defaultContent}`.
- **`FreeElementLayer.jsx`** — renders any `freeElements` on a slide, absolutely positioned by **percentage** (not pixels), sorted by `zIndex`. Renders `text`/`image`/`video` content; `shape`/`divider`/`icon` render a placeholder box. **Render-only** — no drag/resize/selection interaction yet (see §2).
- **`SlideCanvas.jsx`** — renders the active layout + free-element layer for one slide, applies `slide.background`, wired to dispatch `UPDATE_SLIDE_CONTENT`/`UPDATE_FREE_ELEMENT`.

### EditorPage.jsx wiring
- `EditorPage` now wraps `EditorPageBody` in `DeckProvider` with a seeded 7-slide deck (one of each layout).
- `handleAddSlide` dispatches `ADD_SLIDE` via `SlideRegistry` instead of pushing raw JSX.
- The layout picker only offers the 7 supported layouts (legacy options with no registered layout were removed rather than left wired to something that would silently no-op).
- The background toolbar now actually persists to `slide.background` via `SET_SLIDE_BACKGROUND` and is rendered by `SlideCanvas` (previously this was fully dead — background changes went nowhere).

### Tests
64 tests / 15 files (Vitest + React Testing Library), covering the reducer (every action + every invalid-input branch), both content mappers, every layout, the registry, the context, `RichText` (including a stubbed-Froala regression test for the stale-closure bug), and `SlideCanvas` (including a regression test for the same-layout-slide-navigation bug found in final review).

### Left in place, untouched
- ~3,700 lines of the old hardcoded slide components (`TheChallangePage`, `OurSolutionPage`, `TitleOnlyPage`, and ~18 others) still exist in `EditorPage.jsx` as dead code. Deleting them was explicitly out of scope for this pass — do it once nothing references the old `themes`/`backgrounds` maps.

---

## 2. Known limitations in what's shipped (not blockers, but real)

- **`FreeElementLayer` has no interactive UI.** Elements render at their stored position, but there's no drag, resize, selection, or z-index control from the UI yet — see the Insert Widget item below.
- **Only one content mapper exists** (`problem → media-3points`). Every other layout switch falls back to that pair's *default content*, not an intelligent reflow of the slide's actual current content (e.g. switching `media-description → media-3points` won't turn its paragraph into bullets — it'll just reset to placeholder bullets).
- **Background system is data-model-complete but picker-UI-approximate.** `SlideBackground` supports solid/gradient/image/media; the legacy background-picker UI's Tailwind swatches were hand-mapped to hex/gradient values (`BACKGROUND_PRESET_MODELS` in `EditorPage.jsx`), so a swatch's preview can cosmetically differ slightly from what gets applied. `{kind:"media", type:"video"}` backgrounds have no renderer yet (CSS can't show video as a background-image; nothing produces this shape today anyway).
- **No theme system.** `uiTheme` in `EditorPage.jsx` is local, cosmetic-only state seeded once from `deck.theme` — there is no `SET_DECK_THEME` reducer action, so a theme change doesn't persist or propagate.
- **The old vertical scroll-stack slide-transition animation is gone.** It required every slide mounted simultaneously as JSX, which is incompatible with `SlideCanvas` rendering only the current slide. Navigation (nav dots, mouse-wheel) still works — there's just no drag-transition animation between slides anymore.
- **Minor/deferred, not urgent:** `DUPLICATE_SLIDE` copies `background` by reference (harmless — every write path replaces it wholesale); `UPDATE_SLIDE_CONTENT`/`ADD_FREE_ELEMENT` don't validate payload shape (fine until untrusted/persisted data enters the picture); `MetricsGridLayout`/`TeamGridLayout` use array-index React keys (fine for today's fixed-size lists, would need real ids if those lists become reorderable); `slideBackgroundStyle`'s `url(${...})` isn't quote-escaped (latent, no producer of unsafe URLs yet).

---

## 3. What's still needed for the full feature (from the original brief)

The original ask was a full Chronicle-style editor replica. Each numbered item below is a **separate sub-project** — its own brainstorm → spec → plan → implementation cycle, same as this one was. None of them can be built well without what's now in place, but none of them are started either except where noted.

| # | Feature | Status | Notes |
|---|---|---|---|
| 1 | AI storyline + intelligent slide generation (prompt → 10+ slides, auto-formatted, auto-media) | **Not started** | Needs an LLM-calling generation pipeline that outputs `Deck`/`Slide` objects matching this data model — the model is ready to receive it. |
| 2 | Layout engine — intelligent content reflow on layout switch | **Foundation only** | Mapper *mechanism* exists (`contentMappers.js`); only 1 of ~40 possible layout-pair transitions has real reflow logic. Needs mappers for the other meaningful pairs (media-position swap, paragraph↔bullets↔columns, etc.). |
| 3 | Insert Widget — drag/resize/snap/z-index/selection UI | **Not started (backend ready)** | `FreeElementLayer` + reducer actions (`ADD_FREE_ELEMENT`/`UPDATE_FREE_ELEMENT`/`REMOVE_FREE_ELEMENT`) are the substrate. Needs: pointer-driven drag, resize handles, snap-to-grid, selection outline/bounding box, multi-select, layer reordering UI (add a `REORDER_FREE_ELEMENTS`-style action or reuse z-index patching). |
| 4 | Background system — full picker UI | **Partially done** | Data model + persistence done this pass. Needs: a real solid/gradient/image/media picker UI (not the hand-mapped legacy swatches), video-background rendering, and probably a `SET_DECK_BACKGROUND_DEFAULT`-style action if backgrounds should have a deck-level default. |
| 5 | Global theme system (fonts, palette, background style, applies to all slides live) | **Not started** | Needs a `theme` concept in the reducer (e.g. `SET_DECK_THEME` action + a `ThemeRegistry` analogous to `SlideRegistry`), and every layout needs to consume theme tokens instead of hardcoded Tailwind classes. |
| 6 | Remix system — smart layout transformer preserving semantics | **Foundation only** | Same mechanism as #2; "remix" as a distinct smart-transform concept (vs. plain layout-switch mapping) isn't designed yet. |
| 7 | Text editing UX (instant cursor, no double-click, no focus bugs) | **Improved, not re-verified end-to-end** | The Critical data-loss bug (stale closure + DOM fight) is fixed. The base Froala inline-edit behavior was inherited as-is from the legacy code and wasn't independently re-audited against every item in the original complaint (double-click requirement, focus bugs) — worth a dedicated pass. |
| 8 | Change Case tool (separate from color tool) | **Not started** | Original bug ("Change Case changes color") not touched by this plan at all. |
| 9 | Scroll & slide animations (premium, smooth) | **Regressed, not rebuilt** | Old animation removed as an unavoidable consequence of the architecture change (see §2). Needs a new animation approach built against `SlideCanvas` rendering one slide at a time (e.g. animate the `SlideCanvas` mount/unmount or crossfade between slides). |
| 10 | Layer & element control (bring forward/back, bounding boxes, delete/duplicate element) | **Not started (backend partial)** | Reducer has element add/update/remove; no duplicate-element action yet; no UI for any of it. Depends on #3 (Insert Widget) being built first. |
| 11 | UX consistency / visual polish pass | **Not started** | Legacy toolbar chrome (~3,700 lines of dead code alongside it) untouched. |
| 12 | Performance stability (no flicker, no re-render glitches, stable drag/resize) | **Partially validated** | The biggest correctness bug (silent content loss) is fixed and regression-tested. Drag/resize performance can't be assessed until #3 exists. |
| 13 | Slide sidebar (thumbnails, active highlight, drag-reorder, add-between, delete/duplicate) | **Not started (backend ready)** | Reducer already has `DELETE_SLIDE`, `DUPLICATE_SLIDE`, `REORDER_SLIDES`, and `ADD_SLIDE` with an `afterSlideId` option for "insert between." Needs: an actual thumbnail sidebar UI wired to these actions. |
| 14 | Content intelligence (detect numbers→metrics, lists→bullets, headings, image prompts→media slide) | **Not started** | Overlaps heavily with #1 (generation) and #2 (layout mapping) — likely should be designed together with those. |
| 15 | No feature regression | **Mixed** | Background is now *better* than before (previously fully dead, now persists per-slide). Theme, Remix, and Insert remain not-yet-built (they were broken/missing before this work too, so not a new regression, but still missing). The scroll-stack animation is a genuine regression, disclosed and explained in §2. |

---

## 4. Suggested next sub-project

Per the original decomposition approach: pick ONE of the rows above, run it through brainstorming → spec → plan → subagent-driven implementation, same as this one. The natural next candidates, in rough dependency order:

1. **Insert Widget (drag/resize/z-index/selection)** — unlocks #10 (layer control) and is the most-referenced missing piece across the brief.
2. **Slide sidebar UI** — cheapest win, since the reducer actions it needs already exist.
3. **AI storyline generation** — highest user-visible value, but benefits from #2 (better layout mappers) and #14 (content intelligence) being at least partially designed alongside it.

Each should get its own spec under `docs/superpowers/specs/` and plan under `docs/superpowers/plans/`, same pattern as `2026-09-19-editor-slide-data-model-design.md` / `2026-09-19-editor-slide-data-model.md`.
