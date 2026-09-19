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
- **`deckReducer.js`** — 10 action types, fully immutable, validated at the boundary, tested for every action + every invalid-input branch.
- **`DeckContext` (`DeckProvider`/`useDeck`)** — single source of truth; no duplicated slide-shaped state anywhere else in `EditorPage.jsx`.
- **`SlideRegistry.js`** — all 7 layouts correctly registered.
- **`SlideCanvas.jsx`** — renders the active layout + free elements, correctly remounts per slide (`key={slide.id}`, fixed after a real bug was caught in final review).
- **`RichText.jsx`** — shared Froala field; the stale-closure/DOM-fight bug that caused silent edit loss is fixed and regression-tested.
- **7 layout components** — Title, Problem, MediaDescription, Media3Points, MetricsGrid, TeamGrid, Cta — each editable end-to-end via `RichText`, each fills its 16:9 container correctly.
- **Adding a slide** — `handleAddSlide` → `ADD_SLIDE` → renders correctly. End-to-end working.
- **Per-slide background** — toolbar → `SET_SLIDE_BACKGROUND` → `SlideCanvas` renders it. End-to-end working for `solid`/`gradient`/`image` kinds (not `video`, see below).
- **64 tests / 15 files**, all passing; suite has grown, not shrunk, across every task and fix round.

## 2. Data model ready, but the user-facing feature does not exist

These have the reducer action and/or data shape in place, but **no UI** —
do not read this section as "half done," read it as "the cheap half is
done, the actual feature is not started":

- **Deleting/duplicating/reordering slides** — `DELETE_SLIDE`, `DUPLICATE_SLIDE`, `REORDER_SLIDES` all exist and are tested at the reducer level. No sidebar, no button, no drag handle calls them from the UI.
- **Free-element placement** — `ADD_FREE_ELEMENT`/`UPDATE_FREE_ELEMENT`/`REMOVE_FREE_ELEMENT` exist; `FreeElementLayer` renders whatever's in `freeElements[]` at the right position/z-order. Nothing lets a user create, select, drag, resize, rotate, or delete one. This is the Insert Widget gap.
- **Layout switching** — `SET_SLIDE_LAYOUT` exists and (as of the final-review fix) never crashes, because it merges onto the target's `defaultContent()`. But only one content pair (`problem→media-3points`) actually preserves meaningful content — every other switch effectively **resets to placeholder content**, which is exactly the failure mode the new architecture principles doc says must not happen. This needs the semantic normalize/denormalize layer (architecture doc §3) before it's a real feature.

## 3. Not started at all

- **Undo/redo.** No history wrapper exists around `deckReducer`. No keyboard bindings.
- **Schema versioning.** `Deck` objects have no `schemaVersion` field and there is no migration function. This matters before any real persistence/save-load exists.
- **Theme system.** `deck.theme` is a bare string set once at deck creation; nothing ever dispatches a change to it. `EditorPage.jsx`'s `uiTheme` is local-only cosmetic state, never persisted, never actually re-themes the layouts (which still hardcode their own Tailwind classes rather than consuming tokens).
- **Layer/element controls** (bring forward/back, bounding boxes, duplicate/delete a specific free element) — depends on the Insert Widget engine existing first.
- **Slide sidebar UI** (thumbnails, active highlight, drag-reorder, insert-between) — the reducer actions it needs already exist (`ADD_SLIDE` even supports an `afterSlideId` for "insert between").
- **Remix system** — no design or implementation yet, and per the architecture doc it's explicitly a different operation from Layout Change (§4 of the architecture doc), not a variant of it.
- **AI storyline / 10+ slide generation, content intelligence** (detect numbers→metrics, lists→bullets, image prompts→media).
- **Change Case tool** (separate from the color tool — the original reported bug is untouched).
- **Slide/element animations.** The old scroll-stack animation was removed as an unavoidable side effect of the data-model rewrite (`SlideCanvas` renders one slide at a time; the old animation needed all slides mounted as siblings). Navigation still works (nav dots, mouse-wheel); the drag-transition itself does not exist.
- **Background overlay/opacity, deck-level default background, video-background rendering** — the `SlideBackground` union doesn't yet have overlay fields, there's no deck-level background tier, and `{kind:"media", type:"video"}` renders nothing.

## 4. Known defects / rough edges (not urgent, but real)

- `DUPLICATE_SLIDE` copies `background` by reference, not cloned (harmless while every write path replaces it wholesale).
- `UPDATE_SLIDE_CONTENT`/`ADD_FREE_ELEMENT` don't validate payload shape before merging (fine until untrusted/deserialized data enters the picture — relevant once persistence/schema versioning lands).
- `MetricsGridLayout`/`TeamGridLayout` use array-index React keys (fine for today's fixed-size lists; would need real ids once those lists become reorderable via the Insert Widget engine).
- `slideBackgroundStyle`'s `url(${...})` isn't quote-escaped (latent — nothing produces an unsafe URL today).
- `BACKGROUND_PRESET_MODELS` in `EditorPage.jsx` is a hand-mapped approximation of legacy Tailwind swatches to hex/gradient values — a swatch preview can cosmetically differ from the applied result. Gets fixed as a side effect of building a real background picker (§6 of the architecture doc).
- ~3,700 lines of the old hardcoded slide components (`TheChallangePage`, `OurSolutionPage`, `TitleOnlyPage`, and ~18 others) still exist in `EditorPage.jsx`, unreferenced. Deletion is still explicitly deferred, not scheduled in the dependency order below — revisit once the theme-token refactor touches every layout anyway (natural point to also delete the dead legacy layouts that duplicate them).

---

## 5. Recommended implementation order

Per the architecture review, this supersedes the ordering in the previous
version of this document. Full rationale for each item and its
dependencies is in `docs/superpowers/specs/2026-09-19-editor-v2-architecture-principles.md`.

| Order | Sub-project | Depends on | Why here |
|---|---|---|---|
| 1 | Editor persistence + schema versioning | — | Cheapest before any real save/load exists; expensive to retrofit onto already-saved decks |
| 2 | Undo/redo | — (wraps `deckReducer` without changing it) | Cheaper before more action types/UI exist to retrofit history into |
| 3 | Insert/free-element interaction engine | — | Unblocks #4; most-referenced missing piece in the original brief |
| 4 | Layer/element controls | #3 | Needs selectable, draggable elements to have layers to control |
| 5 | Slide sidebar | — (reducer actions already exist) | Cheap win, no new reducer work needed |
| 6 | Theme token system | — | Needed before background's deck-level default (§7) can hang off it cleanly |
| 7 | Background system (overlay, deck-level default, video, real picker UI) | #6 | Deck-level default background is naturally part of theme |
| 8 | Semantic layout transformation/reflow | — | Needed before Remix; also fixes the "layout switch resets content" gap in §2 above |
| 9 | Remix | #8 | Explicitly built on the same semantic content model, not the layout picker |
| 10 | AI storyline generation | benefits from #8/#12 but not blocked by them | High user-visible value |
| 11 | AI 10+ slide generation | #10 | |
| 12 | Content intelligence | overlaps #10/#11, may co-design | |
| 13 | Inline text editing audit/fixes | — | Base Froala behavior inherited as-is; needs a dedicated audit against the original complaint (double-click, focus bugs) |
| 14 | Change Case tool | — | Isolated, no dependencies |
| 15 | Slide/element animations | benefits from #3 (element engine) for element-level animation | Needs a new approach since the old one is architecturally incompatible with per-slide rendering |
| 16 | Performance optimization | most other items | Can't meaningfully assess drag/resize perf before #3 exists |
| 17 | Full regression testing | everything | |

Do not implement the full list in one pass. The next step is to
brainstorm sub-project #1 (editor persistence + schema versioning) through
the normal brainstorm → spec → plan → implementation cycle.
