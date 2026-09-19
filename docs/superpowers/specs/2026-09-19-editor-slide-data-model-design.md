# Editor V2: Slide/Element Data Model & Layout Engine

## Context

`src/components/new/EditorPage.jsx` (the component mounted at `/editorPage`)
is a ~4,000-line monolith. Slides are hardcoded React components
(`TheChallangePage`, `OurSolutionPage`, `MarketPotentialPage`,
`CompetitiveEdgePAge`, `GrowthTrajectoryPage`, ...), each with its own
local state, its own Froala initialization, and its own copy-pasted
theme/background wiring (`themes`, `themes2`, `backgrounds` maps defined
at module scope). There is no shared notion of "a slide" or "an element
on a slide" — content, layout, and rendering are fused together per
component.

The long-term goal (tracked informally against the Chronicle reference
product) is a Canva/Chronicle-class deck editor: AI-generated
storylines, intelligent per-content-type layouts, a working insert/drag/
resize/layers toolbox, per-slide backgrounds, a global theme system, and
a "remix" layout transformer. None of that can be built correctly on
top of hardcoded slide components, because there is no addressable
element to move, resize, restyle, or reflow.

This spec covers **only the foundation**: a real slide/element data
model and a layout-template rendering engine. It deliberately excludes
AI generation, remix, theming, and the insert-widget UI — those are
separate sub-projects that will consume this model. This sub-project's
job is to make those follow-on projects buildable without another
architectural rewrite.

## Approach

Hybrid model, as agreed:

- **Structured layout templates** own semantic content (title, body
  text, bullet lists, media, metrics) and render it via flexbox-based
  React components. Reflow (paragraph → bullets, alignment changes,
  media-left → media-right) is achieved by re-mapping the same content
  fields into a different template, not by manually repositioning
  boxes.
- **A free-element layer** (`freeElements[]`) holds anything inserted
  ad hoc via the Insert tool — extra text boxes, images, shapes, icons,
  dividers — each with absolute position/size/rotation/z-index. This
  layer is independent of the active layout template and survives
  layout switches untouched.

This keeps "layout intelligence" cheap (CSS does the reflow work) while
still giving true freeform drag/resize/layering for inserted content,
which is what the Insert Widget and Layer Control sub-projects need.

## Data model

```ts
type Deck = {
  id: string;
  title: string;
  theme: ThemeId;            // global theme, see Theme System (future spec)
  slides: Slide[];
};

type Slide = {
  id: string;
  layout: LayoutId;          // e.g. "title", "problem", "media-left-description",
                              // "media-3points", "metrics-grid", "team-grid", "cta"
  content: LayoutContent;    // shape depends on `layout`, see below
  background: SlideBackground;
  freeElements: FreeElement[];
  order: number;
};

type SlideBackground =
  | { kind: "solid"; color: string }
  | { kind: "gradient"; stops: string[]; angle: number }
  | { kind: "image"; url: string; fit: "cover" | "contain" }
  | { kind: "media"; url: string; type: "image" | "video"; fit: "cover" | "contain" };

// LayoutContent is a discriminated union keyed by `layout`, e.g.:
type MediaDescriptionContent = {
  heading: string;
  body: string;              // rich text (Froala-produced HTML)
  media: { url: string; type: "image" | "video" };
  mediaPosition: "left" | "right";
};

type Media3PointsContent = {
  heading: string;
  media: { url: string; type: "image" | "video" };
  points: { icon?: string; title: string; body: string }[]; // max 3, enforced in UI
};

// FreeElement: anything placed via Insert, independent of layout content.
type FreeElement = {
  id: string;
  type: "text" | "image" | "video" | "shape" | "divider" | "icon";
  x: number; y: number;      // percentage of slide, 0-100 (resolution independent)
  w: number; h: number;      // percentage of slide
  rotation: number;          // degrees
  zIndex: number;
  locked: boolean;
  props: Record<string, unknown>; // type-specific: text HTML, image src, shape kind, etc.
};
```

Notes:

- Positions/sizes for `FreeElement` are stored as **percentages of the
  slide's 16:9 box**, not pixels, so the deck renders correctly at any
  zoom level or export resolution — this is required later for
  the drag/resize work to not fight a stale pixel grid.
- `LayoutContent` is a discriminated union; each `LayoutId` has exactly
  one content shape. Switching layouts means running a **content
  mapper** (`mapContent(fromLayout, toLayout, content)`) that converts
  between shapes (e.g. `body: string` paragraph → `points: [...]` by
  splitting on sentence/line boundaries) — this is the hook the future
  "Remix" and "layout switching" sub-projects plug into. This spec only
  defines the interface and a couple of trivial mappers (identity,
  paragraph→bullets) — full intelligent mapping is out of scope here.
- Rich text fields (`body`, bullet text, etc.) keep storing Froala HTML
  strings, matching current behavior — no rich-text engine change in
  this pass.

## Components

- `DeckProvider` (React context + `useReducer`): owns `Deck` state,
  exposes actions (`updateSlideContent`, `setSlideLayout`,
  `setSlideBackground`, `addFreeElement`, `updateFreeElement`,
  `removeFreeElement`, `reorderSlides`, `addSlide`, `duplicateSlide`,
  `deleteSlide`). This replaces the current scattered
  `useState`/prop-drilling per hardcoded page.
- `layouts/` directory: one small component per `LayoutId`
  (`TitleLayout`, `ProblemLayout`, `MediaDescriptionLayout`,
  `Media3PointsLayout`, `MetricsGridLayout`, `TeamGridLayout`,
  `CtaLayout`, ...), each a pure function of `content -> JSX`, no local
  state, no Froala init logic duplicated — Froala mounting is factored
  into one shared `RichText` field component used by any layout that
  needs editable text.
- `SlideCanvas`: renders the active layout template for a slide's
  content, then renders `freeElements` absolutely-positioned on top in
  z-index order. This is the single render path used for both the
  editor and (later) any read-only preview/export.
- `SlideRegistry`: a map from `LayoutId` to `{component, defaultContent,
  contentMappers}` — the extension point for adding new layouts later
  without touching the renderer.

## Data flow

1. `DeckProvider` holds the single source of truth (`Deck`).
2. `EditorPage` (post-refactor) renders a slide sidebar (from
   `deck.slides`) and `SlideCanvas` for the active slide.
3. Edits (typing in a `RichText` field, dragging a `FreeElement`,
   switching a layout) dispatch actions to the reducer; nothing holds
   parallel local state that can drift from `Deck`.
4. Persistence (save to backend) is a plain serialize-`Deck`-to-JSON
   step — out of scope here beyond confirming the shape is
   JSON-serializable (it is; no functions/class instances in the
   model).

## Migration strategy

- New code lives under `src/components/new/deck/` (context, layouts,
  SlideCanvas, SlideRegistry) rather than editing the 4,000-line file
  in place.
- Port the existing hardcoded slide sections into the new layout
  components one at a time (`ProblemLayout` from `TheChallangePage`,
  etc.), preserving their current visual output as a regression
  baseline — this pass does not need to change how any single slide
  looks, only how it's represented and rendered.
- `EditorPage.jsx` is reduced to: mount `DeckProvider`, render sidebar +
  `SlideCanvas`, keep existing top-level chrome (toolbar shell) as-is.
  Toolbar buttons that depend on future sub-projects (Insert, Remix,
  Theme picker) get wired to the new actions but their UI/behavior is
  not rebuilt in this pass — just enough plumbing that they don't
  regress.
- Froala initialization logic (`ensureFroalaAssets`, `onFroalaReady`) is
  extracted once into the shared `RichText` component instead of being
  duplicated per slide type.

## Error handling

- Reducer actions validate against the `LayoutId`/`LayoutContent` union
  at the boundary (e.g. `setSlideLayout` rejects an unknown
  `LayoutId`); invalid actions are no-ops with a console warning in
  dev, not thrown exceptions, since this sits under interactive UI.
- Content mapping between layouts is best-effort: if a mapper can't
  produce a field (e.g. no media to carry into a media layout), it
  leaves that field empty rather than throwing, so layout switching
  never crashes the editor.

## Testing

- Unit tests (Vitest/RTL, matching existing FE test setup if present —
  otherwise plain component render tests) for: reducer actions
  (add/remove/reorder slides, update content, add/move/resize/delete
  free elements), the identity and paragraph→bullets content mappers,
  and `SlideRegistry` lookup.
- One integration test per ported layout: render with sample content,
  assert the same key text/media appears as today's hardcoded
  component (regression guard for the migration).
- Manual pass in-browser: load `/editorPage`, confirm all currently
  working slide types still render and are editable, before moving to
  the next sub-project.

## Explicitly out of scope for this spec

AI storyline/slide generation, the Insert widget UI (drag/resize/snap
interactions), background picker UI, global theme system, remix
transform logic beyond the two trivial mappers above, animations,
layer-order UI, and slide-sidebar drag-reorder UI. Each becomes its own
brainstorming → spec → plan cycle once this foundation is in place,
since each is independently substantial.
