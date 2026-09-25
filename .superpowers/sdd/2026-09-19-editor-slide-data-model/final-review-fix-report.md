# Final review fix report — 2026-09-19 editor slide data model

Worktree: `/Users/suryprakash/Combine/Vertx_Flow_fe/.worktrees/editor-deck-model`
All findings from the whole-branch review were fixed in this one wave. Suite green, build green.

---

## 1. CRITICAL — RichText stale closure + controlled/uncontrolled DOM conflict

**File:** `src/components/new/deck/RichText.jsx`

### What changed

- `RichText.jsx:36-43` — added `onChangeRef`, `toolbarButtonsRef`, `valueRef`, refreshed by a
  **no-deps** `useEffect` that runs after *every* render.
- `RichText.jsx:70` — the Froala `contentChanged` handler now calls
  `onChangeRef.current(this.html.get())` instead of the closed-over `onChange`, so it always
  invokes the newest `onChangeContent`/`updatePoint` closure, which itself closes over the
  current `content.points` array.
- `RichText.jsx:52-55` — the editor node's HTML is seeded **exactly once** during setup, guarded
  by `seededRef`. Seeding happens unconditionally on mount (not gated on Froala loading), so the
  jsdom/no-Froala path still renders the value.
- `RichText.jsx:89` — `dangerouslySetInnerHTML` removed from the JSX; the element is now
  `<Tag ref={ref} className={className} />`. `value` is never re-synced into the live editor DOM.
- `RichText.jsx:60,84` — `initEditor` bails if an editor already exists, and cleanup nulls
  `editorRef` (guards against double-init under StrictMode/remount).
- `toolbarButtons` is also read from a ref at init time, so the init effect's `[]` deps no longer
  silently capture a stale toolbar config either.

No changes were needed in `Media3PointsLayout.jsx`, `MetricsGridLayout.jsx` or
`TeamGridLayout.jsx` — as the review predicted, the ref indirection is sufficient.

### Test evidence

New tests in `src/components/new/deck/RichText.test.jsx`, using a `FakeFroalaEditor` stub whose
instance exposes `html.get()` and retains the `events.contentChanged` function so the test can
invoke it the way a real user edit would:

1. `calls the NEWEST onChange prop, not the one captured at mount` — re-renders with a second
   `onChange` identity, fires `contentChanged`, asserts the new callback fired and the first
   never did.
2. `does not re-write the live editor DOM when the value prop changes` — mutates the node the way
   Froala would, re-renders, asserts the node's `innerHTML` was not clobbered.
3. `Media3PointsLayout editing through RichText (stale-closure regression) > keeps edits to point 0
   when point 1 is edited afterwards` — integration test with a stateful harness, 2 points, edit
   point 0 then point 1, asserts the final `onChangeContent` patch contains **both** edits.

**Regression-test verification (fails on old code, passes on new):** I stashed the fixed
`RichText.jsx`, ran `git checkout -- src/components/new/deck/RichText.jsx`, and re-ran
`npx vitest run RichText`:

```
Test Files  1 failed (1)
     Tests  3 failed | 2 passed (5)
```

The integration test failed with exactly the bug the review described:

```
AssertionError: expected [ { title: '', body: 'First' }, …(1) ] to deeply equal …
- Expected            + Received
-     "body": "First EDITED",
+     "body": "First",
```

The fix was then re-applied and:

```
$ npx vitest run RichText Media3PointsLayout
Test Files  2 passed (2)
     Tests  8 passed (8)
```

---

## 2. IMPORTANT — Per-slide background regressed to deck-global state; SET_SLIDE_BACKGROUND dead

**Files:** `src/components/new/EditorPage.jsx`, `src/components/new/deck/SlideCanvas.jsx`

### What changed

- `EditorPage.jsx:336-378` — new `BACKGROUND_PRESET_MODELS`, mapping each of the 42 existing
  `backgrounds` picker keys to a spec-shaped `SlideBackground`
  (`{kind:"solid",color}` / `{kind:"gradient",stops,angle}`), with the Tailwind direction
  (`to-b`/`to-t`/`to-r`/`to-l`/`to-br`/…) translated to a CSS angle.
- `EditorPage.jsx:380-382` — exported `backgroundPresetToSlideBackground(key)`, falling back to
  the deck default `{ kind: "solid", color: "#0b2d2b" }`.
- `EditorPage.jsx:3825-3833` — `handleBGChange` now dispatches
  `{ type: "SET_SLIDE_BACKGROUND", slideId: currentSlide.id, background: … }`.
- Removed the dead `const [background, setBackground] = useState('original')` and the
  `currentBGKey`/`currentBG` locals; removed `${currentBG.bg}` from the root `div` className
  (it was always `undefined` — the `backgrounds` entries have `text`/`card`, never `bg`).
- `EditorPage.jsx:3801-3805` — the inaccurate comment was rewritten: it now says the swatches
  *do* write through to the deck model, and separately notes that `uiTheme` remains local because
  no reducer action for deck theme exists yet (left as-is per the deferred list).
- `SlideCanvas.jsx:11-40` — new exported `slideBackgroundStyle(background)` covering
  `solid` / `gradient` / `image` / `media` (video media falls through to no background style,
  since a `background-image` can't render a video), returning `{}` for absent/unknown kinds.
- `SlideCanvas.jsx:50-54` — the `aspect-video` slide box now carries
  `style={slideBackgroundStyle(slide.background)}`, `overflow-hidden`, and
  `data-testid="slide-canvas"`.

No picker UI was built — the existing modal is simply wired through, as instructed.

### Test evidence

`src/components/new/deck/SlideCanvas.test.jsx`:
- `applies the slide's own background to the slide box` — renders a slide with
  `{kind:"solid",color:"#ff0000"}` and asserts the canvas box has that `backgroundColor`.
- `slideBackgroundStyle > maps each SlideBackground kind to a style, and unknown/absent to nothing`.

```
$ npx vitest run SlideCanvas
Test Files  1 passed (1)
     Tests  5 passed (5)
```

---

## 3. IMPORTANT — SET_SLIDE_LAYOUT + identityMapper could crash the renderer

**Files:** `src/components/new/deck/deckReducer.js`

### What changed

- `deckReducer.js:3` — added `import { getRegistryEntry } from "./SlideRegistry";`
- `deckReducer.js:100-109` — after computing `mappedContent` via `getContentMapper`, the reducer
  merges it over the target layout's defaults:
  `{ ...entry.defaultContent(), ...mappedContent }`. Mapper output wins; defaults fill any field
  the mapper didn't produce. Falls back to `mappedContent` if the registry has no entry
  (`LAYOUT_IDS` already guards this, so it's belt-and-braces).

`SlideRegistry.js` needed no change — `getRegistryEntry` was already exported.

### Test evidence

Two new tests in `deckReducer.test.js`:
- `SET_SLIDE_LAYOUT fills unmapped fields from the target layout's defaults` — `title` →
  `metrics-grid` (no custom mapper); asserts `content.metrics` is a non-empty array and that the
  result equals `{...defaultMetricsGridContent(), ...originalContent}`.
- `SET_SLIDE_LAYOUT never leaves any layout missing its required fields` — loops over every
  `LAYOUT_IDS` value and asserts every key of that layout's `defaultContent()` is defined.

```
$ npx vitest run deckReducer
Test Files  1 passed (1)
     Tests  15 passed (15)
```

---

## 4. IMPORTANT — Uncommitted scratch test file

- Deleted `src/test/scratch/debug.test.jsx` and the now-empty `src/test/scratch/` directory
  (it was untracked, so it does not appear in the diffstat).
- `vitest.config.js:8-9` — added
  `exclude: ["**/node_modules/**", "**/dist/**", "**/scratch/**"]` for defence in depth
  (vitest's default exclude had to be restated since `exclude` replaces rather than extends).

Confirmed: the suite is now **15 files** (not 16). Test count is 63 rather than 56 because this
wave added 7 tests (3 RichText, 2 SlideCanvas, 2 deckReducer) — i.e. 56 → 63 with the scratch
file's 2 tests / 1 file gone.

---

## 5. IMPORTANT — Slide box aspect ratio mismatch

All 7 layout roots changed from `min-h-screen` to `h-full w-full`, keeping every other class:

- `layouts/TitleLayout.jsx:10`
- `layouts/ProblemLayout.jsx:10`
- `layouts/MediaDescriptionLayout.jsx:53`
- `layouts/Media3PointsLayout.jsx:25`
- `layouts/MetricsGridLayout.jsx:22`
- `layouts/TeamGridLayout.jsx:15`
- `layouts/CtaLayout.jsx:10`

Verified no `min-h-screen` remains under `src/components/new/deck/layouts/`. All layout test files
re-run green (they assert text content / `data-*` hooks, not classNames).

---

## 6. MINOR

1. **Unused `vi` import.** Removed from `layouts/TitleLayout.test.jsx:1`. **Kept** in
   `RichText.test.jsx` — it is now genuinely used for `vi.fn()` in the new FroalaEditor stub tests.
   (Note: `SlideCanvas.test.jsx:42` uses a bare `vi` without importing it — it works because
   `globals: true` is set in vitest config; eslint flags it as `no-undef`. That is pre-existing and
   was not in scope, so I left it.)
2. **Image alt-text convention.** `layouts/MediaDescriptionLayout.jsx:28` — `alt="media"` →
   `alt=""`. This **did** break the existing test: `getByRole("img")` no longer matches, because an
   `alt=""` image is presentational and has no `img` role. The test was adjusted minimally to query
   `container.querySelector("img")` and assert both `src` and `alt=""`
   (`MediaDescriptionLayout.test.jsx:31-41`). This was "truly necessary" in the sense the brief
   allowed for.

---

## Full test suite

```
$ npm test
> vertex_flow_fe@0.0.0 test
> vitest run

 RUN  v5.0.1 /Users/suryprakash/Combine/Vertx_Flow_fe/.worktrees/editor-deck-model

 Test Files  15 passed (15)
      Tests  63 passed (63)
   Duration  2.19s
```

Before this wave: 58 tests / 16 files reported (56 / 15 excluding the scratch file).
After: **63 tests / 15 files, 0 failures.**

## Build

```
$ npm run build
...
dist/assets/index-BtTeDQl5.css    197.31 kB │ gzip:  29.52 kB
dist/assets/pdf-CaJW-a52.js       382.47 kB │ gzip: 113.64 kB
dist/assets/index-DlGJyBkA.js   1,121.11 kB │ gzip: 318.06 kB
(!) Some chunks are larger than 500 kB after minification.  [pre-existing warning]
✓ built in 3.29s
```

## Commits

| SHA | Subject |
| --- | --- |
| `09de38a` | fix(deck): stop RichText losing edits via stale closure and DOM overwrite |
| `180803d` | fix(deck): merge SET_SLIDE_LAYOUT mapped content over target defaults |
| `b35e1a2` | fix(deck): persist per-slide background through SET_SLIDE_BACKGROUND |
| `d65f9a9` | chore(deck): layouts fill the 16:9 slide box; drop scratch test file |

Each commit leaves the suite passing (the paired `.jsx` and `.test.jsx` changes are always in the
same commit). Working tree is clean.

## Files changed

```
src/components/new/EditorPage.jsx
src/components/new/deck/RichText.jsx
src/components/new/deck/RichText.test.jsx
src/components/new/deck/SlideCanvas.jsx
src/components/new/deck/SlideCanvas.test.jsx
src/components/new/deck/deckReducer.js
src/components/new/deck/deckReducer.test.js
src/components/new/deck/layouts/CtaLayout.jsx
src/components/new/deck/layouts/Media3PointsLayout.jsx
src/components/new/deck/layouts/MediaDescriptionLayout.jsx
src/components/new/deck/layouts/MediaDescriptionLayout.test.jsx
src/components/new/deck/layouts/MetricsGridLayout.jsx
src/components/new/deck/layouts/ProblemLayout.jsx
src/components/new/deck/layouts/TeamGridLayout.jsx
src/components/new/deck/layouts/TitleLayout.jsx
src/components/new/deck/layouts/TitleLayout.test.jsx
vitest.config.js
src/test/scratch/debug.test.jsx   (deleted; was untracked)
src/test/scratch/                 (removed)
```

## Issues, concerns, and disagreements

I implemented every finding as written. Notes, none of which are disagreements with the fixes:

1. **RichText is now genuinely uncontrolled after mount, as instructed — and that is a real
   behavioural limitation, not just a theoretical one.** If `value` ever changes for a reason other
   than the user's own typing (undo/redo, a remix/AI regeneration, loading a different deck, or
   `SET_SLIDE_LAYOUT` remapping content while the same `RichText` instance stays mounted), the
   editor DOM will not update. Today nothing does that while a `RichText` is mounted: switching
   slides swaps `currentSlide` and `SlideCanvas` renders a different layout subtree. But undo/redo
   is on the roadmap, and when it lands `RichText` will need a `key` on the slide/field identity,
   or an explicit "external value changed" reconciliation (compare incoming `value` against
   `editor.html.get()` and only then call `editor.html.set()`). The brief explicitly scoped this
   out; flagging it so it isn't forgotten.

2. **`BACKGROUND_PRESET_MODELS` is a hand-written approximation of the Tailwind classes** in the
   existing `backgrounds` map (which stores class strings, not colours, so it can't be derived).
   I used Tailwind's default palette hexes and translated the gradient directions to CSS angles.
   The multi-stop `original` preset in particular used opacity modifiers (`from-black/70`,
   `via-white/30` with odd stop percentages) that I flattened to plain stops, so it looks close but
   not pixel-identical to the legacy swatch. The swatch previews in the modal still render from the
   original Tailwind `card` classes, so a swatch and its applied background can differ slightly.
   Getting these exact is picker-UI work, which is out of scope.

3. **`slideBackgroundStyle` renders nothing for `{kind:"media", type:"video"}`** — a CSS
   `background-image` cannot play a video. A real video background needs a `<video>` element behind
   the layout. Nothing produces that shape today; I chose a silent no-op over a broken
   `url(...)` background.

4. **`h-full` on the layouts depends on the parent chain having a definite height.** It does inside
   `SlideCanvas` (`aspect-video` establishes the box), which is the only place these layouts are
   rendered. If a layout is ever rendered standalone it will collapse — acceptable, and it is what
   the finding asked for.

5. **Pre-existing lint noise was left alone:** ~39 eslint errors in `EditorPage.jsx` (unused `link`
   vars, unused `currentTheme` at line 3728, unused `index` params) all come from the ~3,700 lines
   of dead legacy components that are explicitly out of scope, and `no-undef` on the globals-mode
   `vi` in `SlideCanvas.test.jsx`. None are introduced or worsened by this wave.

6. **All items on the "Do NOT fix" list were left untouched**, including `DUPLICATE_SLIDE`'s
   by-reference `background` copy, reducer shape validation, array-index keys, `uiTheme` local
   state, `FreeElementLayer`'s reserved `onUpdateElement`, `TeamGridLayout`'s
   `alt={member.name}`, the `LayoutPicker` prop issue (verified: `LayoutPicker` is never passed a
   `background` prop, so removing the local `background` state did not break it), and the
   `currentSlideIndex > 0` toolbar gate.
