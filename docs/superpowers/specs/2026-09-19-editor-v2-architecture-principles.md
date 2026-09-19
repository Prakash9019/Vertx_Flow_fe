# Editor V2: Architecture Principles (Binding Constraints for Future Sub-Projects)

## Context

This document is not a spec for a single sub-project. It's a set of
architectural decisions and constraints, made after reviewing the completed
foundation (`docs/superpowers/specs/2026-09-19-editor-slide-data-model-design.md`,
implemented on the `editor-deck-model` branch), that every future sub-project
spec must honor. Each sub-project still gets its own
brainstorm → spec → plan → implementation cycle; this document is the frame
those cycles design inside, not a replacement for them.

## Decision: keep the hybrid architecture

The current split — semantic layout templates own structured content and
reflow via CSS/flexbox; `freeElements[]` own arbitrary inserted objects with
free positioning — is confirmed correct and stays. **Do not** replace it with
a full freeform-only canvas. Every principle below builds on this split
rather than around it.

## 1. FreeElement interaction model

`FreeElementLayer` currently only renders `FreeElement[]` at stored
positions — no interaction. It must grow into a full interaction model:
selection, drag, resize, rotation, delete, duplicate, copy/paste, z-order
(bring forward/backward/front/back), keyboard nudge, snap-to-grid, alignment
guides, bounding boxes, multi-selection where practical, lock/unlock.

**Constraint on the data model:** `FreeElement` already has every field this
needs (`x, y, w, h, rotation, zIndex, locked`). No schema change is required
to add these interactions — only new reducer actions (e.g.
`REORDER_FREE_ELEMENT_Z`, `SET_ELEMENT_LOCKED`, or reusing
`UPDATE_FREE_ELEMENT` with the right patch shape) and new UI. Sub-project
specs for this area should default to reusing `UPDATE_FREE_ELEMENT` for
anything expressible as a field patch, and only add a new action type when a
patch can't express the operation (e.g. a true reorder that renumbers many
elements' `zIndex` atomically).

**Selection state does not belong in the `Deck`.** Which element(s) are
selected is UI/session state, not persisted document state — it should live
in local component state or its own (non-reducer, non-persisted) context,
not as a field on `FreeElement` or `Slide`. Keep the document model
(what gets saved) separate from the editing-session model (what's currently
selected/dragging).

## 2. Undo/redo as a core capability

Undo/redo is not a later feature — it's a property of the reducer
architecture, and it's far cheaper to build in now than to retrofit once
many action types exist.

**Constraint:** implement history as a wrapper around `deckReducer`, not
scattered state snapshots. The standard shape:

```js
type HistoryState = {
  past: Deck[];
  present: Deck;
  future: Deck[];
};
```

An outer reducer (or a `useReducer` wrapping `deckReducer`) intercepts
`UNDO`/`REDO` actions itself and delegates every other action type to the
existing `deckReducer`, pushing `present` onto `past` before each delegated
action. This means **`deckReducer` itself does not change** — it stays a
pure `(deck, action) => deck` function, which is exactly what makes it
wrappable this way. `DeckContext`/`useDeck()` is the layer that gets the
`undo`/`redo` functions and the `Ctrl/Cmd+Z` / `Ctrl/Cmd+Shift+Z` keyboard
bindings added to it.

**Not every action needs to be a history checkpoint.** High-frequency
actions during a continuous gesture (e.g. every pixel of a drag, every
keystroke in `RichText`) should coalesce into one history entry per gesture
(on drag-end, on blur/debounced-typing-pause), not one per intermediate
update — otherwise undo becomes useless (one keystroke per undo step). The
sub-project spec for this must define which actions/gestures checkpoint
immediately vs. debounce.

## 3. Semantic content normalization/transformation layer

Do not keep hand-writing one bespoke mapper function per
`(fromLayout, toLayout)` pair (today: exactly one exists,
`problem → media-3points`). Replace the direct
`LayoutContent → LayoutContent` mapping in `contentMappers.js` with a
three-stage pipeline:

```
LayoutContent (source layout's shape)
  → normalize(sourceLayout, content) → SemanticContent
  → denormalize(SemanticContent, targetLayout) → LayoutContent (target layout's shape)
```

`SemanticContent` is a layout-agnostic representation of "what this slide is
about" — roughly: a heading, an optional body (rich text), an optional list
of items (each with an optional title/body/media), an optional primary
media reference, optional metrics. Every layout gets a `normalize` function
(layout content → semantic) and a `denormalize` function (semantic → layout
content). Switching layouts becomes `denormalize(normalize(content), target)`
— no `N×N` matrix of hand-written pairs.

This is what enables the specific transforms requested (paragraph↔bullets,
bullets→cards, cards→columns, media-left↔right, media-top↔bottom,
one-column↔two-column, metrics→metric-cards, quote→quote+attribution):
each becomes a rule inside `normalize`/`denormalize` for the relevant
layouts, not a new N² pairing.

**Constraint: layout switching must never silently reset to placeholder
content when semantic content already exists.** `denormalize` should always
prefer fields carried over from `normalize(sourceContent)` and only fall
back to a layout's `defaultContent()` for fields the semantic model
genuinely has nothing for (e.g. no media exists to carry into a
media-required layout). This generalizes the fix already made in
`deckReducer.js`'s `SET_SLIDE_LAYOUT` (merge mapped content over
`defaultContent()`) — that merge strategy stays, only the thing being merged
in (`mappedContent`) gets smarter.

## 4. Layout Change vs. Remix are different operations

- **Layout Change** = "render this slide's existing semantic content using a
  different layout template." Deterministic, content-preserving,
  user-selects-target-layout-explicitly. This is what `SET_SLIDE_LAYOUT` +
  the normalize/denormalize pipeline (§3) does.
- **Remix** = "generate a different visual composition that preserves
  meaning, without the user necessarily picking the exact target layout."
  This is a higher-level operation that may itself choose a layout (possibly
  via a scoring/matching step, possibly via AI generation later) and then
  invoke the same normalize/denormalize pipeline to place content into it.

**Constraint:** Remix must be built as a separate action/flow that
*consumes* the same `SemanticContent` model from §3 rather than
special-casing its own content transformation logic. Do not couple Remix's
implementation to the layout picker UI — Remix is not "layout picker but
automatic," it's its own decision-plus-placement flow that happens to reuse
placement (denormalize).

## 5. Theme token system

Replace ad hoc conditional Tailwind classes (the pattern in the legacy
`themes`/`themes2`/`backgrounds` maps in `EditorPage.jsx`) with a real theme
token object:

```js
type ThemeTokens = {
  colors: { background, surface, text, textMuted, primary, accent, ... };
  typography: { headingFont, bodyFont };
  fontWeights: { heading, body, bold };
  spacing: { scale: [...] };          // or a spacing function/scale
  borderRadius: { sm, md, lg, full };
  backgroundStyle: SlideBackground;    // a theme's default background, see §6
  accent: { color, contrastText };
};
```

**Constraint:** every layout component must consume tokens (via a
`ThemeContext`/`useTheme()` hook, or tokens passed down from `SlideCanvas`)
instead of hardcoding Tailwind color/font classes. This is a real
refactor of all 7 existing layouts, not just new code — budget for it in
that sub-project's plan.

**Constraint:** add a `SET_DECK_THEME` reducer action (`deck.theme` already
exists as a field per the original data model but nothing ever sets it
meaningfully — `EditorPage.jsx`'s `uiTheme` is local-only and never
dispatched). Theme changes must be live (immediate re-render, no reload)
and persistent (part of `Deck`, saved/restored with it).

## 6. Background architecture

`SlideBackground` already models `solid | gradient | image | media`
(`deckTypes.js` — this doesn't need to change). What's missing:

- **Overlay + opacity.** Add fields to `SlideBackground` (e.g. `overlay:
  {color, opacity}` alongside the existing kind-specific fields) so a
  background image/video can have a color overlay for text legibility,
  independent of the background's own kind.
- **Deck-level default vs. slide-level override.** Add a `Deck.background`
  (or fold it into `Deck.theme.backgroundStyle` per §5) as the default,
  and keep `Slide.background` as an optional override — `SlideCanvas` should
  render `slide.background ?? deck.theme.backgroundStyle` (exact precedence
  is this sub-project's call, but the two-tier model is the constraint).
- **Real picker UI**, replacing the legacy `BACKGROUND_PRESET_MODELS`
  hand-mapped Tailwind-swatch approximation with something that edits
  `SlideBackground` objects directly (so the swatch preview and the applied
  result can never diverge, because they're the same data).
- **Video background rendering.** Nothing produces `{kind:"media",
  type:"video"}` today and `SlideCanvas` renders nothing for it. This
  sub-project should add the actual `<video>` background layer.

**Constraint:** background changes must render immediately and persist via
the reducer (`SET_SLIDE_BACKGROUND` already does this correctly for the
slide-level case — extend the pattern for deck-level default, don't replace
it).

## 7. Schema versioning

The serialized `Deck` must carry a `schemaVersion`:

```js
{
  schemaVersion: 2,   // bumped whenever the shape changes in a breaking way
  id: "...",
  theme: { ... },     // becomes an object per §5, was a bare string
  slides: [ ... ],
}
```

**Constraint:** add a migration function
`migrateDeck(rawDeck) => Deck` that upgrades any older serialized shape to
the current one (version 1, the shape shipped in this foundation pass, had
no `schemaVersion` field and `theme` as a bare string — migrating from that
is the first migration this function needs to handle). Load-time validation
should run the migration before handing a deck to `DeckProvider`, and should
fail loudly (not silently drop data) if a deck can't be migrated. This
should land before persistence/save-load exists in any real form, since
retrofitting versioning after decks are already being saved unversioned is
the expensive order to do it in — hence its position first in the
dependency order below.

## 8. What must NOT be thrown away

Every one of these stays and gets built on, not replaced:
`Deck`/`Slide`/`FreeElement` data model, `DeckContext`, `deckReducer`,
`SlideRegistry`, `contentMappers.js` (evolves into the normalize/denormalize
pipeline per §3, doesn't get deleted and restarted), `SlideCanvas`,
`RichText`, the 7 existing layout components, and the existing test suite
(64 tests as of this writing — every future sub-project should leave this
number growing, never shrinking without an explicit reason logged in that
sub-project's plan).

## Recommended sub-project dependency order

1. Editor persistence/schema versioning (§7) — do this before anything else
   persists decks in a format that would need migrating later.
2. Undo/redo (§2) — cheaper before more action types and UI exist to retrofit.
3. Insert/free-element interaction engine (§1)
4. Layer/element controls (depends on #3)
5. Slide sidebar (reducer actions already exist: `DELETE_SLIDE`,
   `DUPLICATE_SLIDE`, `REORDER_SLIDES`, `ADD_SLIDE` with `afterSlideId`)
6. Theme token system (§5)
7. Background system (§6, benefits from #6 theme tokens existing first for
   the deck-level default)
8. Semantic layout transformation/reflow (§3)
9. Remix (§4, depends on #8)
10. AI storyline generation
11. AI 10+ slide generation
12. Content intelligence
13. Inline text editing audit/fixes
14. Change Case tool
15. Slide/element animations
16. Performance optimization
17. Full regression testing

This order is a default, not a law — if implementing a specific sub-project
reveals a concrete dependency the codebase forces (e.g. undo/redo turns out
to need the free-element interaction engine's gesture-coalescing hooks
first), the next brainstorming session should say so and reorder, logging
why in that sub-project's spec.
