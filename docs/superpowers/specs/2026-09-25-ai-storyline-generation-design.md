# AI Storyline Generation (Roadmap #10) — Design

**Status:** Approved, implementing.
**Depends on:** semantic layout transformation (#8, `contentMappers.js`), Remix scoring (#9, `remix.js`) — both already implemented and reused here, not re-derived.

## Goal

From the "Create New Deck" flow, let a user type a one-line pitch/topic and
get back a full multi-slide deck (heading/body/items/metrics per slide,
layout auto-picked), instead of always starting from a blank deck.

## Why server-side

The Gemini API key must never reach the browser bundle. (Note: an existing
`VITE_GEMINI_API_KEY` is already committed to this repo's git history/`.env`
and is out of scope to rotate as part of this change — flagged separately,
user has deferred it.) The call lives in `Vertx_flow_Server`, behind the
existing `authMiddleware`, exactly like every other deck operation.

## Backend (`Vertx_flow_Server`)

- `GEMINI_API_KEY` in server `.env` (gitignored there already).
- `services/geminiService.js`: `generateStoryline(prompt, slideCount)` calls
  `@google/generative-ai` (installed, previously unused), instructs the model
  to return **strict JSON only**: `{ title, slides: [{ heading, body, items:
  [{title, body}], metrics: [{label, value}] }] }` — i.e. the app's
  `SemanticContent` shape minus `media` (Gemini text-only, no real image
  URLs to offer). Strips ```` ```json ```` fences defensively, parses, and
  structurally validates (array length, each slide has at least a heading)
  before returning; throws a typed error the controller turns into a 502 on
  bad/unparseable model output, with one retry on parse failure.
- `controllers/aiStorylineController.js` + `routes/aiStorylineRoutes.js`:
  `POST /api/ai/storyline`, body `{ prompt, slideCount }`, auth-gated,
  returns `{ success, data: { title, slides } }`.

## Frontend (`Vertx_Flow_fe`)

- `src/utils/aiApi.js`: `generateStoryline(prompt, slideCount)`, same shape
  as `deckApi.js`.
- `src/components/new/deck/remix.js`: extract the existing scoring loop out
  of `pickRemixLayout` into an exported `pickBestLayout(semantic,
  excludeLayouts = [])` (no required "current layout" to exclude — a brand
  new slide has none). `pickRemixLayout` becomes a thin wrapper that excludes
  `currentLayout` and delegates. Pure refactor, behavior-preserving.
- `src/components/new/deck/storylineToDeck.js` (new, pure, no I/O):
  `buildDeckFromStoryline({ title, slides })` — for each slide:
  `pickBestLayout(semantic)` → `denormalize(semantic, layout,
  defaultContentForLayout(layout))` → `createSlide({ layout, content, order:
  index })`. Wraps in `createDeck({ title, theme: getTheme(DEFAULT_THEME_ID),
  slides })`. Reuses `denormalize`/`createSlide`/`createDeck`/`defaultContent`
  as-is — no new content-shape logic.
- `src/components/new/DeckListPage.jsx`: "Create New Deck" becomes two
  buttons — "Blank Deck" (today's `handleCreate`, unchanged) and "Generate
  with AI" which opens `AIStorylineModal`.
- `src/components/new/deck/AIStorylineModal.jsx` (new): prompt textarea +
  slide-count number input (default 8, min 3, max 15) + loading/error state.
  On submit: `aiApi.generateStoryline` → `buildDeckFromStoryline` →
  `deckApi.createDeck(builtDeck)` → `navigate('/editor/:deckId')` — same
  tail as the existing blank-create path.

## Error handling

- Backend: malformed Gemini JSON → one retry → 502 with a plain message.
  Missing `GEMINI_API_KEY` → 500 at startup-adjacent call time, not a crash.
- Frontend: modal shows the error message inline and lets the user retry or
  cancel; never navigates on failure.

## Testing (author now; user will do the manual/browser pass separately)

- `remix.test.js`: existing tests must keep passing unchanged (pure
  refactor); add tests for `pickBestLayout` with no exclusions.
- `storylineToDeck.test.js` (new): given a fixed storyline JSON, asserts
  correct layout picks and that `createSlide`/`createDeck` invariants hold
  (ids present, `order` sequential, `background: null`).
- Backend: `geminiService.test.js` mocks `@google/generative-ai`, covers
  clean JSON, fenced JSON, malformed JSON (retry then throw), and
  under-length slide arrays. No test calls the real Gemini API.

## Explicitly out of scope here

Roadmap #11 (10+ slide generation edge cases) and #12 (content intelligence
— inferring metrics/media from arbitrary pasted text) are separate items.
No image/media generation. No in-editor "regenerate current deck" entry
point (deferred per the earlier "new-deck only" scope decision).
