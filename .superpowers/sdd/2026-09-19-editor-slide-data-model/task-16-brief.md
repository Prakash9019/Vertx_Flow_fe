## Task 16: Wire EditorPage.jsx to the new deck model

**Files:**
- Modify: `src/components/new/EditorPage.jsx` (the `export default function EditorPage()` block, currently lines 3716 onward, and its `initialSlidesData`/`slides`/`slideBackgrounds`/`slideThemes` state at lines 3727-3787)
- Test: manual, in-browser (this task changes top-level page wiring; the unit-testable pieces were already covered in Tasks 1-15)

**Interfaces:**
- Consumes: `DeckProvider`, `useDeck` (Task 5), `SlideCanvas` (Task 15), `SlideRegistry`/`LAYOUT_IDS` (Tasks 2, 7), `createDeck`/`createSlide` (Task 2).
- Produces: `/editorPage` renders through the new deck model. This is the last task in this plan — it does not need to preserve the old `TheChallangePage`/`OurSolutionPage`/etc. components' call sites (those become dead code after this task and can be left in place; deleting the now-unused ~3,700 lines of hardcoded slide components in `EditorPage.jsx` is a follow-up cleanup, not required for this plan to be complete, since the spec's migration strategy only requires the new render path to work, not a same-day deletion of the old one).

- [ ] **Step 1: Replace the `initialSlidesData`/`slides` state block with a `Deck`**

In `EditorPage.jsx`, replace lines 3727-3787 (from `const initialSlidesData = [` through the `useEffect` closing at line 3787) with:

```jsx
  const initialDeck = React.useMemo(
    () =>
      createDeck({
        title: "Untitled Deck",
        theme: "dark",
        slides: [
          createSlide({ layout: "title", content: defaultTitleContent(), order: 0 }),
          createSlide({ layout: "problem", content: defaultProblemContent(), order: 1 }),
          createSlide({ layout: "media-description", content: defaultMediaDescriptionContent(), order: 2 }),
          createSlide({ layout: "media-3points", content: defaultMedia3PointsContent(), order: 3 }),
          createSlide({ layout: "metrics-grid", content: defaultMetricsGridContent(), order: 4 }),
          createSlide({ layout: "team-grid", content: defaultTeamGridContent(), order: 5 }),
          createSlide({ layout: "cta", content: defaultCtaContent(), order: 6 }),
        ],
      }),
    []
  );
```

Add the corresponding imports near the top of `EditorPage.jsx` (alongside the existing imports):

```jsx
import { DeckProvider, useDeck } from "./deck/DeckContext";
import { SlideCanvas } from "./deck/SlideCanvas";
import { createDeck, createSlide } from "./deck/deckTypes";
import { defaultTitleContent } from "./deck/layouts/TitleLayout";
import { defaultProblemContent } from "./deck/layouts/ProblemLayout";
import { defaultMediaDescriptionContent } from "./deck/layouts/MediaDescriptionLayout";
import { defaultMedia3PointsContent } from "./deck/layouts/Media3PointsLayout";
import { defaultMetricsGridContent } from "./deck/layouts/MetricsGridLayout";
import { defaultTeamGridContent } from "./deck/layouts/TeamGridLayout";
import { defaultCtaContent } from "./deck/layouts/CtaLayout";
```

- [ ] **Step 2: Split `EditorPage` into an outer provider and an inner body**

Rename the existing `export default function EditorPage()` to `function EditorPageBody()` (keep its full existing content otherwise — toolbar, modals, etc. — except for the parts replaced/added in Steps 1 and 3), move the `initialDeck` `useMemo` from Step 1 out of `EditorPageBody` and into a new outer component, and add that as the default export:

```jsx
export default function EditorPage() {
  const initialDeck = React.useMemo(
    () =>
      createDeck({
        title: "Untitled Deck",
        theme: "dark",
        slides: [
          createSlide({ layout: "title", content: defaultTitleContent(), order: 0 }),
          createSlide({ layout: "problem", content: defaultProblemContent(), order: 1 }),
          createSlide({ layout: "media-description", content: defaultMediaDescriptionContent(), order: 2 }),
          createSlide({ layout: "media-3points", content: defaultMedia3PointsContent(), order: 3 }),
          createSlide({ layout: "metrics-grid", content: defaultMetricsGridContent(), order: 4 }),
          createSlide({ layout: "team-grid", content: defaultTeamGridContent(), order: 5 }),
          createSlide({ layout: "cta", content: defaultCtaContent(), order: 6 }),
        ],
      }),
    []
  );
  return (
    <DeckProvider initialDeck={initialDeck}>
      <EditorPageBody />
    </DeckProvider>
  );
}
```

`EditorPageBody` gets the deck via `useDeck()` (Step 3), not via props, matching Task 5's contract that all deck reads go through the hook.

- [ ] **Step 3: Replace slide rendering in the body with `SlideCanvas`**

Inside `EditorPageBody`, replace the old `slides[currentSlideIndex]` JSX-array indexing (wherever the current slide is rendered in the existing return statement) with:

```jsx
const { deck } = useDeck();
const currentSlide = deck.slides[currentSlideIndex];
```

and in the JSX where the old code rendered `slides[currentSlideIndex]`, render:

```jsx
{currentSlide ? <SlideCanvas slide={currentSlide} /> : null}
```

Remove the old `slideBackgrounds`/`slideThemes` state and the `useEffect` that cloned elements with new theme/background props (already deleted in Step 1) — background is now `currentSlide.background`, read directly, and theme is `deck.theme`.

- [ ] **Step 4: Update `handleAddSlide` to dispatch instead of pushing JSX**

Replace the `handleAddSlide` function (previously around line 3799) with:

```jsx
const { dispatch } = useDeck();

const handleAddSlide = (layoutId) => {
  const entry = getRegistryEntry(layoutId);
  if (!entry) return;
  dispatch({ type: "ADD_SLIDE", layout: layoutId, content: entry.defaultContent() });
  setShowLayoutPicker(false);
};
```

Add the import: `import { getRegistryEntry } from "./deck/SlideRegistry";`

Update `LayoutPicker`'s `onSelect` callers (wherever `LayoutPicker` is rendered, passing `onSelect={handleAddSlide}`) to pass a `LayoutId` string (e.g. `"title"`) instead of a component reference — check each `<LayoutPicker ... onSelect={() => handleAddSlide(SomeComponent)} />` call site and change it to `onSelect={() => handleAddSlide("title")}` (or the matching id) for each of the 7 supported layouts; for any layout option in the existing `LayoutPicker` UI that has no equivalent in `LAYOUT_IDS` yet (e.g. `QuotePage`, `ComparisonPage` — layouts not ported in this plan), leave that picker option disabled or hidden rather than wiring it to a nonexistent layout id, since dispatching an unregistered layout is a no-op per Task 4's validation.

- [ ] **Step 5: Manual verification in the browser**

Run: `npm run dev`, navigate to `/editorPage`.

Verify:
- The deck loads with the 7 seeded slides (title, problem, media-description, media-3points, metrics-grid, team-grid, cta) and each renders its placeholder content.
- Clicking into a heading/body field and typing updates the text (Froala mount still works through `RichText`).
- Adding a new slide via the layout picker for one of the 7 ported layouts appends a slide with that layout's default content.
- No console errors on load or on typing.

This step has no automated assertion — record the result in the task's commit message.

- [ ] **Step 6: Run the full automated test suite once more**

Run: `npm test`
Expected: all tests from Tasks 1-15 still pass (this task didn't touch any tested module's public behavior, only `EditorPage.jsx`'s wiring).

- [ ] **Step 7: Commit**

```bash
git add src/components/new/EditorPage.jsx
git commit -m "feat(deck): wire EditorPage to DeckProvider/SlideCanvas, replacing hardcoded slide state"
```

---

## Explicitly out of scope (confirmed against the spec)

AI storyline/slide generation, Insert widget drag/resize/snap interactions, background/theme picker UI, remix transform logic beyond the two mappers in Task 3, animations, layer-order UI, slide-sidebar drag-reorder UI, and deleting the now-dead hardcoded slide components from `EditorPage.jsx`. Each is its own future brainstorming → spec → plan cycle per the spec's "Explicitly out of scope" section.
