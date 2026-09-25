## Task 7: SlideRegistry and default content per layout

**Files:**
- Create: `src/components/new/deck/SlideRegistry.js`
- Test: `src/components/new/deck/SlideRegistry.test.js`

**Interfaces:**
- Consumes: `LAYOUT_IDS` (Task 2). Layout components from Tasks 8-14 (`TitleLayout`, `ProblemLayout`, `MediaDescriptionLayout`, `Media3PointsLayout`, `MetricsGridLayout`, `TeamGridLayout`, `CtaLayout`) — this task can be written and tested with placeholder stand-in components first, then Task 15 confirms the real ones plug in without changing the registry shape. To avoid throwaway placeholder code, this task is sequenced to run its tests against the real layout components, so implement Task 7's test file but do not commit it until Tasks 8-14 exist; run the registry's own unit tests (which only check shape, not rendering) immediately, and defer the render-through-registry assertion to Task 15's integration test.
- Produces: `SlideRegistry` — a plain object keyed by `LayoutId`, each entry `{ component, defaultContent }` where `component` is a React component with signature `({ content, onChangeContent, freeElements }) => JSX` and `defaultContent` is a factory `() => Content` used by `ADD_SLIDE` callers to seed new slides. `getRegistryEntry(layoutId)` — returns the entry or `undefined` for an unknown id (callers are responsible for validating against `LAYOUT_IDS` first, matching the reducer's existing validation).

- [ ] **Step 1: Write the failing test**

```js
// src/components/new/deck/SlideRegistry.test.js
import { describe, it, expect } from "vitest";
import { LAYOUT_IDS } from "./deckTypes";
import { SlideRegistry, getRegistryEntry } from "./SlideRegistry";

describe("SlideRegistry", () => {
  it("has one entry per LAYOUT_ID with a component and a defaultContent factory", () => {
    for (const layoutId of LAYOUT_IDS) {
      const entry = SlideRegistry[layoutId];
      expect(entry, `missing registry entry for "${layoutId}"`).toBeDefined();
      expect(typeof entry.component).toBe("function");
      expect(typeof entry.defaultContent).toBe("function");
      expect(typeof entry.defaultContent()).toBe("object");
    }
  });

  it("getRegistryEntry returns undefined for an unknown layout id", () => {
    expect(getRegistryEntry("not-a-layout")).toBeUndefined();
  });

  it("getRegistryEntry returns the entry for a known layout id", () => {
    expect(getRegistryEntry("title")).toBe(SlideRegistry.title);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- SlideRegistry`
Expected: FAIL — module does not exist (this also transitively fails until Tasks 8-14's layout files exist, since Step 3 imports them; that's expected — this task's implementation step is written now but its test only goes green once Tasks 8-14 land. Proceed to Task 8 and return to run this test after Task 14).

- [ ] **Step 3: Write the implementation**

```js
// src/components/new/deck/SlideRegistry.js
import { TitleLayout, defaultTitleContent } from "./layouts/TitleLayout";
import { ProblemLayout, defaultProblemContent } from "./layouts/ProblemLayout";
import { MediaDescriptionLayout, defaultMediaDescriptionContent } from "./layouts/MediaDescriptionLayout";
import { Media3PointsLayout, defaultMedia3PointsContent } from "./layouts/Media3PointsLayout";
import { MetricsGridLayout, defaultMetricsGridContent } from "./layouts/MetricsGridLayout";
import { TeamGridLayout, defaultTeamGridContent } from "./layouts/TeamGridLayout";
import { CtaLayout, defaultCtaContent } from "./layouts/CtaLayout";

export const SlideRegistry = {
  title: { component: TitleLayout, defaultContent: defaultTitleContent },
  problem: { component: ProblemLayout, defaultContent: defaultProblemContent },
  "media-description": { component: MediaDescriptionLayout, defaultContent: defaultMediaDescriptionContent },
  "media-3points": { component: Media3PointsLayout, defaultContent: defaultMedia3PointsContent },
  "metrics-grid": { component: MetricsGridLayout, defaultContent: defaultMetricsGridContent },
  "team-grid": { component: TeamGridLayout, defaultContent: defaultTeamGridContent },
  cta: { component: CtaLayout, defaultContent: defaultCtaContent },
};

export function getRegistryEntry(layoutId) {
  return SlideRegistry[layoutId];
}
```

- [ ] **Step 4: Leave this task's test failing for now and move to Task 8**

No command to run — the import chain in Step 3 requires files created in Tasks 8-14. Do not commit `SlideRegistry.js` yet; it will fail to import. Proceed.

---

