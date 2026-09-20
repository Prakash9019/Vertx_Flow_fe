# Editor V2: Try-it-yourself Runbook

Branch: `editor-deck-model`. For the full feature-by-feature status, see
`docs/EDITOR-V2-STATUS.md` — this doc is just "how do I click through what's
built so far."

## 1. Start everything

```bash
# Terminal 1 - backend (Vertx_flow_Server, main branch)
cd Vertx_flow_Server
npm start          # expects MongoDB reachable + .env configured; listens on :5000

# Terminal 2 - frontend (Vertx_Flow_fe, editor-deck-model branch/worktree)
cd Vertx_Flow_fe/.worktrees/editor-deck-model
npm run dev        # Vite, prints the local URL (usually http://localhost:5173)
```

## 2. Two ways to open the editor

### A. `/editorPage` — no login, no backend, throwaway demo deck
Open `http://localhost:5173/editorPage` directly. This is a hardcoded
7-slide seed deck that only exists in memory for that browser tab —
nothing saves, refreshing resets it. Use this to try every editing
feature with zero setup.

### B. `/editor/:deckId` — the real, persisted flow
This one actually saves to MongoDB via the backend, so it needs you to be
logged in first (the backend's `/api/decks` routes require a valid auth
token — there's no route guard on `/decks` or `/editor/:deckId` in the
frontend router, but the API calls will 401 without one):

1. Log in normally (`/login`) so a token lands in `localStorage`.
2. Go to `http://localhost:5173/decks` → **Create New Deck** → it POSTs a
   new deck and navigates you to `/editor/<the new deck's id>`.
3. Everything you do here autosaves (debounced ~1s after you stop editing)
   via `PATCH /api/decks/:deckId`. Refresh the page — your changes should
   still be there, loaded fresh from the backend.
4. Back on `/decks`, your deck shows up in the list with its real title
   and last-updated time; **Delete** removes it for real.

## 3. What you can actually click through right now

On either route:

- **Slide sidebar** (left panel) — thumbnails of every slide, click to
  jump to one. Per-slide menu (⋮): duplicate, insert-after (opens the
  layout picker), delete, move up/down. Drag a thumbnail to reorder.
- **Free elements** (text/image/video/shape/divider/icon boxes you insert
  onto a slide) — click to select (shows a bounding box + resize/rotate
  handles + a floating toolbar), drag to move, drag a handle to
  resize/rotate, double-click a text element to edit it inline, the
  toolbar's buttons duplicate/delete/bring-forward/send-backward it,
  Delete/Backspace removes the selected one.
- **Undo/redo** — every edit above (including a whole drag/resize
  gesture, not each pixel of it) is one undo step.
- **Theme picker** (bottom toolbar → Theme) — 7 themes, changes color/font
  everywhere live, never touches your content or free-element positions.
- **Background picker** (bottom toolbar → Background) — per-slide: pick
  Solid/Gradient/Image/Video or "Theme default"; for Image/Video/Gradient
  you can also add a color+opacity overlay. The preview in the modal is
  pixel-for-pixel what you'll see on the slide.

## 4. What's NOT wired up yet / known rough edges

- No real image/video **upload** — the free-element image/video widgets
  and the background picker only take a URL or a browser-local blob URL
  (blob URLs don't survive a refresh).
- **No way to change an existing slide's layout from the UI at all** —
  `SET_SLIDE_LAYOUT` and the content-preserving normalize/denormalize
  transform pipeline behind it are fully implemented and unit-tested
  (every layout pair carries its heading/body/bullets/media over instead
  of resetting to placeholder text), but nothing in `EditorPage.jsx`
  dispatches `SET_SLIDE_LAYOUT` yet — the toolbar's "Insert" only ever
  *adds a new slide* with a chosen layout, it never re-layouts the current
  one. You can see this pipeline work today only via its test suite
  (`contentMappers.test.js`), not by clicking anything.
- **Remix, AI storyline generation, Change Case, slide animations,
  performance pass** — none of this exists yet.
- Nobody has clicked through any of this in a real browser during
  development — it's all verified by the automated test suite (149/149
  passing) plus `npm run build`. If something looks off, that's the gap
  this note is calling out in advance, not a regression.
