# Editor Slide/Element Data Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded, DOM-only slide components in `EditorPage.jsx` with a serializable `Deck`/`Slide`/`FreeElement` data model, a reducer to mutate it, and a registry-driven `SlideCanvas` renderer, without changing how any currently-working slide looks.

**Architecture:** A `DeckProvider` React context wraps a pure `deckReducer`. Each slide has a `layout` id and a `content` object matching that layout's shape; a `SlideRegistry` maps layout ids to `{component, defaultContent, contentMappers}`. `SlideCanvas` looks up the active slide's layout in the registry, renders it with `content`, then renders `freeElements` absolutely-positioned on top. Rich text fields go through one shared `RichText` component that owns the Froala mount/teardown, replacing the copy-pasted `ensureFroalaAssets`/`onFroalaReady` blocks duplicated in every slide component today.

**Tech Stack:** React 19, Vite 6. No test runner exists in this repo yet — Task 1 adds Vitest + `@testing-library/react` (Vite-native, zero extra config beyond a `vitest.config.js`).

**Spec:** `docs/superpowers/specs/2026-09-19-editor-slide-data-model-design.md`

## Global Constraints

- Positions/sizes on `FreeElement` are percentages of the slide's 16:9 box (0-100), never pixels — required so later drag/resize work isn't built on a stale pixel grid (spec: Data model notes).
- `LayoutContent` is a discriminated union keyed by `layout`; each `LayoutId` has exactly one content shape (spec: Data model).
- Rich text fields keep storing Froala-produced HTML strings — no rich-text engine change in this pass (spec: Data model notes).
- Reducer actions validate at the boundary and no-op with a `console.warn` on invalid input rather than throwing (spec: Error handling).
- Content mappers are best-effort: a field that can't be produced is left empty, never throws (spec: Error handling).
- New code lives under `src/components/new/deck/`, not edited into the existing 4,082-line `EditorPage.jsx` in place (spec: Migration strategy).
- This pass must not change the visual output of any currently-working slide — ported layouts are a rendering/data-plumbing change only (spec: Migration strategy).

---

## Task 1: Add a test runner (Vitest + Testing Library)

**Files:**
- Create: `vitest.config.js`
- Create: `src/test/setup.js`
- Modify: `package.json` (devDependencies + `test` script)

**Interfaces:**
- Produces: `npm test` runs Vitest once; `npm run test:watch` runs it in watch mode. Every later task's tests assume these scripts exist.

- [ ] **Step 1: Install dependencies**

Run: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`

- [ ] **Step 2: Create the Vitest config**

```js
// vitest.config.js
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
});
```

- [ ] **Step 3: Create the setup file**

```js
// src/test/setup.js
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add scripts to package.json**

Add under `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify the runner works with a throwaway test**

Create `src/test/smoke.test.js`:

```js
import { describe, it, expect } from "vitest";

describe("vitest setup", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run: `npm test`
Expected: 1 passed test.

- [ ] **Step 6: Delete the throwaway test and commit**

```bash
rm src/test/smoke.test.js
git add vitest.config.js src/test/setup.js package.json package-lock.json
git commit -m "test: add Vitest + Testing Library runner"
```

---

## Task 2: Deck data types and factories

**Files:**
- Create: `src/components/new/deck/deckTypes.js`
- Test: `src/components/new/deck/deckTypes.test.js`

**Interfaces:**
- Produces:
  - `LAYOUT_IDS` — array of the 7 supported layout id strings: `"title"`, `"problem"`, `"media-description"`, `"media-3points"`, `"metrics-grid"`, `"team-grid"`, `"cta"`.
  - `createSlide({ layout, content, background, freeElements, order })` → `Slide` object with a generated `id` (string) and any omitted fields defaulted (`background` defaults to `{ kind: "solid", color: "#0b2d2b" }`, `freeElements` defaults to `[]`).
  - `createFreeElement({ type, x, y, w, h, rotation, zIndex, locked, props })` → `FreeElement` object with a generated `id` and defaults (`rotation: 0`, `zIndex: 0`, `locked: false`, `props: {}`).
  - `createDeck({ title, theme, slides })` → `Deck` object with a generated `id` and `slides` defaulted to `[]`.
  - `generateId(prefix)` → `` `${prefix}-${string}` `` unique string (used internally by the three factories above; exported so tests and the reducer can generate ids the same way).

- [ ] **Step 1: Write the failing test**

```js
// src/components/new/deck/deckTypes.test.js
import { describe, it, expect } from "vitest";
import {
  LAYOUT_IDS,
  createSlide,
  createFreeElement,
  createDeck,
  generateId,
} from "./deckTypes";

describe("generateId", () => {
  it("produces unique, prefixed ids", () => {
    const a = generateId("slide");
    const b = generateId("slide");
    expect(a).not.toBe(b);
    expect(a.startsWith("slide-")).toBe(true);
  });
});

describe("LAYOUT_IDS", () => {
  it("lists the 7 supported layouts", () => {
    expect(LAYOUT_IDS).toEqual([
      "title",
      "problem",
      "media-description",
      "media-3points",
      "metrics-grid",
      "team-grid",
      "cta",
    ]);
  });
});

describe("createSlide", () => {
  it("defaults background, freeElements, and generates an id", () => {
    const slide = createSlide({ layout: "title", content: { title: "Hi" }, order: 0 });
    expect(slide.id).toMatch(/^slide-/);
    expect(slide.layout).toBe("title");
    expect(slide.content).toEqual({ title: "Hi" });
    expect(slide.background).toEqual({ kind: "solid", color: "#0b2d2b" });
    expect(slide.freeElements).toEqual([]);
    expect(slide.order).toBe(0);
  });

  it("accepts explicit background and freeElements", () => {
    const bg = { kind: "solid", color: "#ffffff" };
    const els = [createFreeElement({ type: "text", x: 0, y: 0, w: 10, h: 10 })];
    const slide = createSlide({ layout: "title", content: {}, background: bg, freeElements: els, order: 1 });
    expect(slide.background).toBe(bg);
    expect(slide.freeElements).toBe(els);
  });
});

describe("createFreeElement", () => {
  it("defaults rotation, zIndex, locked, props, and generates an id", () => {
    const el = createFreeElement({ type: "image", x: 10, y: 20, w: 30, h: 40 });
    expect(el.id).toMatch(/^element-/);
    expect(el.type).toBe("image");
    expect(el.x).toBe(10);
    expect(el.y).toBe(20);
    expect(el.w).toBe(30);
    expect(el.h).toBe(40);
    expect(el.rotation).toBe(0);
    expect(el.zIndex).toBe(0);
    expect(el.locked).toBe(false);
    expect(el.props).toEqual({});
  });
});

describe("createDeck", () => {
  it("defaults slides to an empty array and generates an id", () => {
    const deck = createDeck({ title: "My Deck", theme: "dark" });
    expect(deck.id).toMatch(/^deck-/);
    expect(deck.title).toBe("My Deck");
    expect(deck.theme).toBe("dark");
    expect(deck.slides).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- deckTypes`
Expected: FAIL — `deckTypes.js` does not exist / exports undefined.

- [ ] **Step 3: Write the implementation**

```js
// src/components/new/deck/deckTypes.js
export const LAYOUT_IDS = [
  "title",
  "problem",
  "media-description",
  "media-3points",
  "metrics-grid",
  "team-grid",
  "cta",
];

let counter = 0;

export function generateId(prefix) {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

export function createSlide({ layout, content, background, freeElements, order }) {
  return {
    id: generateId("slide"),
    layout,
    content,
    background: background ?? { kind: "solid", color: "#0b2d2b" },
    freeElements: freeElements ?? [],
    order,
  };
}

export function createFreeElement({ type, x, y, w, h, rotation, zIndex, locked, props }) {
  return {
    id: generateId("element"),
    type,
    x,
    y,
    w,
    h,
    rotation: rotation ?? 0,
    zIndex: zIndex ?? 0,
    locked: locked ?? false,
    props: props ?? {},
  };
}

export function createDeck({ title, theme, slides }) {
  return {
    id: generateId("deck"),
    title,
    theme,
    slides: slides ?? [],
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- deckTypes`
Expected: PASS, all 6 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/deckTypes.js src/components/new/deck/deckTypes.test.js
git commit -m "feat(deck): add slide/element/deck data factories"
```

---

## Task 3: Content mappers (identity + paragraph-to-bullets)

**Files:**
- Create: `src/components/new/deck/contentMappers.js`
- Test: `src/components/new/deck/contentMappers.test.js`

**Interfaces:**
- Consumes: nothing from other tasks (pure functions on plain objects).
- Produces:
  - `identityMapper(content)` → returns `content` unchanged. Used as the default mapper for any `(fromLayout, toLayout)` pair without a specific mapper.
  - `paragraphToBulletsMapper(content)` → given `{ heading, body, media? }` (a `ProblemContent`-shaped object where `body` is an HTML string, possibly containing `<p>` tags), returns `{ heading, points: [{ title: "", body: sentence }, ...], media }` by stripping HTML tags from `body`, splitting on `. ` (period + space) sentence boundaries, trimming, and dropping empty fragments. `media` is carried through from the input if present, otherwise defaulted to `{ url: "", type: "image" }` — required because the target layout (`Media3PointsLayout`, Task 11) always reads `content.media.url` and must never receive a content object missing that field. If `body` is missing or empty, returns `{ heading, points: [], media: <same default/passthrough rule> }` (best-effort, never throws — Global Constraints).
  - `getContentMapper(fromLayout, toLayout)` → looks up a mapper for the ordered pair from an internal registry; falls back to `identityMapper` if none registered. The only pair registered in this task is `("problem", "media-3points") → paragraphToBulletsMapper`.

- [ ] **Step 1: Write the failing test**

```js
// src/components/new/deck/contentMappers.test.js
import { describe, it, expect } from "vitest";
import { identityMapper, paragraphToBulletsMapper, getContentMapper } from "./contentMappers";

describe("identityMapper", () => {
  it("returns the same content unchanged", () => {
    const content = { title: "Hello" };
    expect(identityMapper(content)).toBe(content);
  });
});

describe("paragraphToBulletsMapper", () => {
  it("splits an HTML paragraph body into bullet points", () => {
    const result = paragraphToBulletsMapper({
      heading: "The Problem",
      body: "<p>Teams lose context switching tools. Onboarding takes weeks. Support tickets pile up.</p>",
    });
    expect(result.heading).toBe("The Problem");
    expect(result.points).toEqual([
      { title: "", body: "Teams lose context switching tools" },
      { title: "", body: "Onboarding takes weeks" },
      { title: "", body: "Support tickets pile up." },
    ]);
  });

  it("returns an empty points array and a default media when body is missing", () => {
    const result = paragraphToBulletsMapper({ heading: "The Problem" });
    expect(result).toEqual({ heading: "The Problem", points: [], media: { url: "", type: "image" } });
  });

  it("returns an empty points array and a default media when body is an empty string", () => {
    const result = paragraphToBulletsMapper({ heading: "The Problem", body: "" });
    expect(result).toEqual({ heading: "The Problem", points: [], media: { url: "", type: "image" } });
  });

  it("carries an existing media field through unchanged", () => {
    const media = { url: "https://example.com/a.png", type: "image" };
    const result = paragraphToBulletsMapper({ heading: "The Problem", body: "<p>Users churn.</p>", media });
    expect(result.media).toEqual(media);
  });
});

describe("getContentMapper", () => {
  it("returns the registered mapper for problem -> media-3points", () => {
    expect(getContentMapper("problem", "media-3points")).toBe(paragraphToBulletsMapper);
  });

  it("falls back to identityMapper for an unregistered pair", () => {
    expect(getContentMapper("title", "cta")).toBe(identityMapper);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- contentMappers`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the implementation**

```js
// src/components/new/deck/contentMappers.js
export function identityMapper(content) {
  return content;
}

export function paragraphToBulletsMapper(content) {
  const { heading, body, media } = content;
  const resolvedMedia = media ?? { url: "", type: "image" };
  if (!body) {
    return { heading, points: [], media: resolvedMedia };
  }
  const text = body.replace(/<[^>]+>/g, "");
  const points = text
    .split(". ")
    .map((fragment) => fragment.trim())
    .filter((fragment) => fragment.length > 0)
    .map((fragment) => ({ title: "", body: fragment }));
  return { heading, points, media: resolvedMedia };
}

const MAPPER_REGISTRY = {
  "problem->media-3points": paragraphToBulletsMapper,
};

export function getContentMapper(fromLayout, toLayout) {
  return MAPPER_REGISTRY[`${fromLayout}->${toLayout}`] ?? identityMapper;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- contentMappers`
Expected: PASS, all 5 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/contentMappers.js src/components/new/deck/contentMappers.test.js
git commit -m "feat(deck): add content mappers for layout switching"
```

---

## Task 4: Deck reducer

**Files:**
- Create: `src/components/new/deck/deckReducer.js`
- Test: `src/components/new/deck/deckReducer.test.js`

**Interfaces:**
- Consumes: `createSlide`, `createFreeElement`, `generateId` from `./deckTypes` (Task 2); `LAYOUT_IDS` from `./deckTypes` (Task 2); `getContentMapper` from `./contentMappers` (Task 3).
- Produces:
  - `deckReducer(deck, action)` → new `Deck`. Handles action types: `ADD_SLIDE { layout, content, afterSlideId? }`, `DELETE_SLIDE { slideId }`, `DUPLICATE_SLIDE { slideId }`, `REORDER_SLIDES { slideId, toIndex }`, `SET_SLIDE_LAYOUT { slideId, layout }`, `UPDATE_SLIDE_CONTENT { slideId, content }` (shallow-merges into existing content), `SET_SLIDE_BACKGROUND { slideId, background }`, `ADD_FREE_ELEMENT { slideId, element }`, `UPDATE_FREE_ELEMENT { slideId, elementId, patch }`, `REMOVE_FREE_ELEMENT { slideId, elementId }`. Unknown action types or actions referencing a missing `slideId`/`elementId`/invalid `layout` are no-ops that `console.warn` and return `deck` unchanged (Global Constraints).
  - Every task after this one that needs to mutate a deck does so exclusively through `deckReducer` — no task introduces a second way to mutate `Deck` state.

- [ ] **Step 1: Write the failing test**

```js
// src/components/new/deck/deckReducer.test.js
import { describe, it, expect, vi } from "vitest";
import { deckReducer } from "./deckReducer";
import { createDeck, createSlide, createFreeElement } from "./deckTypes";

function deckWithOneSlide() {
  const slide = createSlide({ layout: "title", content: { title: "Hi" }, order: 0 });
  const deck = createDeck({ title: "Deck", theme: "dark", slides: [slide] });
  return { deck, slide };
}

describe("deckReducer", () => {
  it("ADD_SLIDE appends a new slide with the given layout and content", () => {
    const { deck } = deckWithOneSlide();
    const next = deckReducer(deck, { type: "ADD_SLIDE", layout: "problem", content: { heading: "Problem" } });
    expect(next.slides).toHaveLength(2);
    expect(next.slides[1].layout).toBe("problem");
    expect(next.slides[1].content).toEqual({ heading: "Problem" });
    expect(next.slides[1].order).toBe(1);
  });

  it("ADD_SLIDE warns and no-ops on an unknown layout", () => {
    const { deck } = deckWithOneSlide();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const next = deckReducer(deck, { type: "ADD_SLIDE", layout: "not-a-layout", content: {} });
    expect(next).toBe(deck);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("DELETE_SLIDE removes the slide by id", () => {
    const { deck, slide } = deckWithOneSlide();
    const next = deckReducer(deck, { type: "DELETE_SLIDE", slideId: slide.id });
    expect(next.slides).toHaveLength(0);
  });

  it("DELETE_SLIDE warns and no-ops on a missing slideId", () => {
    const { deck } = deckWithOneSlide();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const next = deckReducer(deck, { type: "DELETE_SLIDE", slideId: "missing" });
    expect(next).toBe(deck);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("DUPLICATE_SLIDE inserts a copy with a new id right after the original", () => {
    const { deck, slide } = deckWithOneSlide();
    const next = deckReducer(deck, { type: "DUPLICATE_SLIDE", slideId: slide.id });
    expect(next.slides).toHaveLength(2);
    expect(next.slides[1].id).not.toBe(slide.id);
    expect(next.slides[1].content).toEqual(slide.content);
    expect(next.slides[1].layout).toBe(slide.layout);
  });

  it("REORDER_SLIDES moves a slide to the target index and renumbers order", () => {
    const { deck, slide } = deckWithOneSlide();
    const withSecond = deckReducer(deck, { type: "ADD_SLIDE", layout: "problem", content: {} });
    const second = withSecond.slides[1];
    const reordered = deckReducer(withSecond, { type: "REORDER_SLIDES", slideId: second.id, toIndex: 0 });
    expect(reordered.slides.map((s) => s.id)).toEqual([second.id, slide.id]);
    expect(reordered.slides[0].order).toBe(0);
    expect(reordered.slides[1].order).toBe(1);
  });

  it("SET_SLIDE_LAYOUT changes layout and remaps content via the registered mapper", () => {
    const problemSlide = createSlide({
      layout: "problem",
      content: { heading: "The Problem", body: "<p>Onboarding takes weeks. Support tickets pile up.</p>" },
      order: 0,
    });
    const deck = createDeck({ title: "Deck", theme: "dark", slides: [problemSlide] });
    const next = deckReducer(deck, { type: "SET_SLIDE_LAYOUT", slideId: problemSlide.id, layout: "media-3points" });
    expect(next.slides[0].layout).toBe("media-3points");
    expect(next.slides[0].content.heading).toBe("The Problem");
    expect(next.slides[0].content.points).toEqual([
      { title: "", body: "Onboarding takes weeks" },
      { title: "", body: "Support tickets pile up." },
    ]);
  });

  it("UPDATE_SLIDE_CONTENT shallow-merges into existing content", () => {
    const { deck, slide } = deckWithOneSlide();
    const next = deckReducer(deck, { type: "UPDATE_SLIDE_CONTENT", slideId: slide.id, content: { subtitle: "New" } });
    expect(next.slides[0].content).toEqual({ title: "Hi", subtitle: "New" });
  });

  it("SET_SLIDE_BACKGROUND replaces the slide's background", () => {
    const { deck, slide } = deckWithOneSlide();
    const bg = { kind: "gradient", stops: ["#000", "#fff"], angle: 45 };
    const next = deckReducer(deck, { type: "SET_SLIDE_BACKGROUND", slideId: slide.id, background: bg });
    expect(next.slides[0].background).toEqual(bg);
  });

  it("ADD_FREE_ELEMENT appends an element to the slide's freeElements", () => {
    const { deck, slide } = deckWithOneSlide();
    const el = createFreeElement({ type: "text", x: 5, y: 5, w: 20, h: 10 });
    const next = deckReducer(deck, { type: "ADD_FREE_ELEMENT", slideId: slide.id, element: el });
    expect(next.slides[0].freeElements).toEqual([el]);
  });

  it("UPDATE_FREE_ELEMENT patches an existing element by id", () => {
    const { deck, slide } = deckWithOneSlide();
    const el = createFreeElement({ type: "text", x: 5, y: 5, w: 20, h: 10 });
    const withEl = deckReducer(deck, { type: "ADD_FREE_ELEMENT", slideId: slide.id, element: el });
    const next = deckReducer(withEl, { type: "UPDATE_FREE_ELEMENT", slideId: slide.id, elementId: el.id, patch: { x: 50 } });
    expect(next.slides[0].freeElements[0].x).toBe(50);
    expect(next.slides[0].freeElements[0].y).toBe(5);
  });

  it("REMOVE_FREE_ELEMENT removes an element by id", () => {
    const { deck, slide } = deckWithOneSlide();
    const el = createFreeElement({ type: "text", x: 5, y: 5, w: 20, h: 10 });
    const withEl = deckReducer(deck, { type: "ADD_FREE_ELEMENT", slideId: slide.id, element: el });
    const next = deckReducer(withEl, { type: "REMOVE_FREE_ELEMENT", slideId: slide.id, elementId: el.id });
    expect(next.slides[0].freeElements).toEqual([]);
  });

  it("returns the same deck and warns for an unknown action type", () => {
    const { deck } = deckWithOneSlide();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const next = deckReducer(deck, { type: "NOT_A_REAL_ACTION" });
    expect(next).toBe(deck);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- deckReducer`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the implementation**

```js
// src/components/new/deck/deckReducer.js
import { LAYOUT_IDS, createSlide } from "./deckTypes";
import { getContentMapper } from "./contentMappers";

function warnInvalid(action, reason) {
  console.warn(`deckReducer: ignoring ${action.type} - ${reason}`);
}

function findSlideIndex(deck, slideId) {
  return deck.slides.findIndex((s) => s.id === slideId);
}

function renumber(slides) {
  return slides.map((s, index) => ({ ...s, order: index }));
}

export function deckReducer(deck, action) {
  switch (action.type) {
    case "ADD_SLIDE": {
      if (!LAYOUT_IDS.includes(action.layout)) {
        warnInvalid(action, `unknown layout "${action.layout}"`);
        return deck;
      }
      const newSlide = createSlide({
        layout: action.layout,
        content: action.content ?? {},
        order: deck.slides.length,
      });
      let slides;
      if (action.afterSlideId) {
        const index = findSlideIndex(deck, action.afterSlideId);
        if (index === -1) {
          warnInvalid(action, `afterSlideId "${action.afterSlideId}" not found`);
          return deck;
        }
        slides = [...deck.slides.slice(0, index + 1), newSlide, ...deck.slides.slice(index + 1)];
      } else {
        slides = [...deck.slides, newSlide];
      }
      return { ...deck, slides: renumber(slides) };
    }

    case "DELETE_SLIDE": {
      const index = findSlideIndex(deck, action.slideId);
      if (index === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      const slides = deck.slides.filter((_, i) => i !== index);
      return { ...deck, slides: renumber(slides) };
    }

    case "DUPLICATE_SLIDE": {
      const index = findSlideIndex(deck, action.slideId);
      if (index === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      const original = deck.slides[index];
      const copy = createSlide({
        layout: original.layout,
        content: { ...original.content },
        background: original.background,
        freeElements: original.freeElements.map((el) => ({ ...el })),
        order: index + 1,
      });
      const slides = [...deck.slides.slice(0, index + 1), copy, ...deck.slides.slice(index + 1)];
      return { ...deck, slides: renumber(slides) };
    }

    case "REORDER_SLIDES": {
      const fromIndex = findSlideIndex(deck, action.slideId);
      if (fromIndex === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      if (action.toIndex < 0 || action.toIndex >= deck.slides.length) {
        warnInvalid(action, `toIndex ${action.toIndex} out of range`);
        return deck;
      }
      const slides = [...deck.slides];
      const [moved] = slides.splice(fromIndex, 1);
      slides.splice(action.toIndex, 0, moved);
      return { ...deck, slides: renumber(slides) };
    }

    case "SET_SLIDE_LAYOUT": {
      if (!LAYOUT_IDS.includes(action.layout)) {
        warnInvalid(action, `unknown layout "${action.layout}"`);
        return deck;
      }
      const index = findSlideIndex(deck, action.slideId);
      if (index === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      const slide = deck.slides[index];
      const mapper = getContentMapper(slide.layout, action.layout);
      const mappedContent = mapper(slide.content);
      const slides = [...deck.slides];
      slides[index] = { ...slide, layout: action.layout, content: mappedContent };
      return { ...deck, slides };
    }

    case "UPDATE_SLIDE_CONTENT": {
      const index = findSlideIndex(deck, action.slideId);
      if (index === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      const slide = deck.slides[index];
      const slides = [...deck.slides];
      slides[index] = { ...slide, content: { ...slide.content, ...action.content } };
      return { ...deck, slides };
    }

    case "SET_SLIDE_BACKGROUND": {
      const index = findSlideIndex(deck, action.slideId);
      if (index === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      const slides = [...deck.slides];
      slides[index] = { ...slides[index], background: action.background };
      return { ...deck, slides };
    }

    case "ADD_FREE_ELEMENT": {
      const index = findSlideIndex(deck, action.slideId);
      if (index === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      const slide = deck.slides[index];
      const slides = [...deck.slides];
      slides[index] = { ...slide, freeElements: [...slide.freeElements, action.element] };
      return { ...deck, slides };
    }

    case "UPDATE_FREE_ELEMENT": {
      const index = findSlideIndex(deck, action.slideId);
      if (index === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      const slide = deck.slides[index];
      const elIndex = slide.freeElements.findIndex((el) => el.id === action.elementId);
      if (elIndex === -1) {
        warnInvalid(action, `elementId "${action.elementId}" not found`);
        return deck;
      }
      const freeElements = [...slide.freeElements];
      freeElements[elIndex] = { ...freeElements[elIndex], ...action.patch };
      const slides = [...deck.slides];
      slides[index] = { ...slide, freeElements };
      return { ...deck, slides };
    }

    case "REMOVE_FREE_ELEMENT": {
      const index = findSlideIndex(deck, action.slideId);
      if (index === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      const slide = deck.slides[index];
      const slides = [...deck.slides];
      slides[index] = { ...slide, freeElements: slide.freeElements.filter((el) => el.id !== action.elementId) };
      return { ...deck, slides };
    }

    default:
      warnInvalid(action, "unknown action type");
      return deck;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- deckReducer`
Expected: PASS, all 13 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/deckReducer.js src/components/new/deck/deckReducer.test.js
git commit -m "feat(deck): add deck reducer for slide/element mutations"
```

---

## Task 5: DeckProvider context

**Files:**
- Create: `src/components/new/deck/DeckContext.jsx`
- Test: `src/components/new/deck/DeckContext.test.jsx`

**Interfaces:**
- Consumes: `deckReducer` (Task 4), `createDeck` (Task 2).
- Produces:
  - `DeckProvider({ initialDeck, children })` — React component; wraps `children` in context, initializes state from `initialDeck` (a `Deck` object) via `useReducer(deckReducer, initialDeck)`.
  - `useDeck()` — hook returning `{ deck, dispatch }`. `dispatch` accepts the same action objects `deckReducer` handles. Every later task that needs to read or mutate deck state calls `useDeck()` — no task reads deck state through any other channel.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/new/deck/DeckContext.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DeckProvider, useDeck } from "./DeckContext";
import { createDeck, createSlide } from "./deckTypes";

function TestConsumer() {
  const { deck, dispatch } = useDeck();
  return (
    <div>
      <span data-testid="slide-count">{deck.slides.length}</span>
      <span data-testid="first-title">{deck.slides[0]?.content.title}</span>
      <button
        onClick={() =>
          dispatch({ type: "UPDATE_SLIDE_CONTENT", slideId: deck.slides[0].id, content: { title: "Changed" } })
        }
      >
        Change
      </button>
    </div>
  );
}

describe("DeckProvider / useDeck", () => {
  it("provides the initial deck and dispatches actions that update it", () => {
    const slide = createSlide({ layout: "title", content: { title: "Original" }, order: 0 });
    const initialDeck = createDeck({ title: "Deck", theme: "dark", slides: [slide] });

    render(
      <DeckProvider initialDeck={initialDeck}>
        <TestConsumer />
      </DeckProvider>
    );

    expect(screen.getByTestId("slide-count").textContent).toBe("1");
    expect(screen.getByTestId("first-title").textContent).toBe("Original");

    fireEvent.click(screen.getByText("Change"));

    expect(screen.getByTestId("first-title").textContent).toBe("Changed");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- DeckContext`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the implementation**

```jsx
// src/components/new/deck/DeckContext.jsx
import React, { createContext, useContext, useReducer } from "react";
import { deckReducer } from "./deckReducer";

const DeckStateContext = createContext(null);

export function DeckProvider({ initialDeck, children }) {
  const [deck, dispatch] = useReducer(deckReducer, initialDeck);
  return <DeckStateContext.Provider value={{ deck, dispatch }}>{children}</DeckStateContext.Provider>;
}

export function useDeck() {
  const context = useContext(DeckStateContext);
  if (!context) {
    throw new Error("useDeck must be used within a DeckProvider");
  }
  return context;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- DeckContext`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/DeckContext.jsx src/components/new/deck/DeckContext.test.jsx
git commit -m "feat(deck): add DeckProvider context and useDeck hook"
```

---

## Task 6: Shared RichText field component

**Files:**
- Create: `src/components/new/deck/RichText.jsx`
- Test: `src/components/new/deck/RichText.test.jsx`
- Reference (read-only, do not modify): `src/components/new/EditorPage.jsx:51-117` (`ensureFroalaAssets`, `onFroalaReady` — the logic being extracted)

**Interfaces:**
- Consumes: nothing from other deck tasks.
- Produces: `<RichText value={htmlString} onChange={(html) => void} toolbarButtons={string[]} className={string} as={"h1"|"p"|"div"} />`. Every ported layout component (Tasks 8-14) renders editable text through this component instead of a raw `contentEditable` div with its own Froala init `useEffect`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/new/deck/RichText.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RichText } from "./RichText";

describe("RichText", () => {
  it("renders the given value as HTML inside the requested element", () => {
    render(<RichText value="<b>Hello</b>" onChange={() => {}} as="h1" className="heading" />);
    const el = screen.getByText("Hello");
    expect(el.tagName).toBe("B");
    expect(el.closest("h1")).not.toBeNull();
    expect(el.closest("h1").className).toBe("heading");
  });

  it("does not throw when window.FroalaEditor is unavailable (e.g. in tests)", () => {
    expect(() =>
      render(<RichText value="<p>Text</p>" onChange={() => {}} as="div" />)
    ).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- RichText`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the implementation**

Read `src/components/new/EditorPage.jsx:51-117` first to copy `ensureFroalaAssets`/`onFroalaReady` verbatim (do not modify that file in this task — it still uses its own copies until Task 15 rewires `EditorPage.jsx`).

```jsx
// src/components/new/deck/RichText.jsx
import React, { useEffect, useRef } from "react";

let froalaAssetsPromise = null;

function ensureFroalaAssets() {
  if (froalaAssetsPromise) return froalaAssetsPromise;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://cdn.jsdelivr.net/npm/froala-editor@4/css/froala_editor.pkgd.min.css";
  document.head.appendChild(link);

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/froala-editor@4/js/froala_editor.pkgd.min.js";
  document.body.appendChild(script);

  froalaAssetsPromise = { link, script };
  return froalaAssetsPromise;
}

function onFroalaReady(script, callback) {
  if (typeof window !== "undefined" && window.FroalaEditor) {
    callback();
    return;
  }
  script.addEventListener("load", callback, { once: true });
}

export function RichText({ value, onChange, toolbarButtons, className, as: Tag = "div" }) {
  const ref = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.document.createElement) return;

    const { script } = ensureFroalaAssets();

    const initEditor = () => {
      if (!window.FroalaEditor || !ref.current) return;
      editorRef.current = new window.FroalaEditor(ref.current, {
        inline: true,
        toolbarInline: true,
        toolbarVisibleWithoutSelection: true,
        charCounterCount: false,
        wordCounterCount: false,
        toolbarButtons: toolbarButtons ?? ["bold", "italic", "underline", "fontSize", "textColor", "backgroundColor"],
        events: {
          "contentChanged": function () {
            onChange(this.html.get());
          },
        },
      });
    };

    onFroalaReady(script, () => {
      setTimeout(initEditor, 100);
    });

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === "function") {
        editorRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Tag ref={ref} className={className} dangerouslySetInnerHTML={{ __html: value }} />;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- RichText`
Expected: PASS — `window.FroalaEditor` is undefined under jsdom, so `initEditor` no-ops and only the static HTML renders, which is exactly what both tests assert.

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/RichText.jsx src/components/new/deck/RichText.test.jsx
git commit -m "feat(deck): extract shared RichText field component"
```

---

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

## Task 8: TitleLayout

**Files:**
- Create: `src/components/new/deck/layouts/TitleLayout.jsx`
- Test: `src/components/new/deck/layouts/TitleLayout.test.jsx`
- Reference (read-only): `src/components/new/EditorPage.jsx:2443-2485` (`TitleOnlyPage` — current hardcoded version being ported)

**Interfaces:**
- Consumes: `RichText` (Task 6).
- Produces: `TitleLayout({ content, onChangeContent })` where `content: { title: string, subtitle: string }`; `defaultTitleContent()` → `{ title: "Title Only", subtitle: "" }`. `onChangeContent(patch)` is called with a partial content object on every edit (the caller — `SlideCanvas`, Task 15 — is responsible for merging it into the deck via `UPDATE_SLIDE_CONTENT`).

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/new/deck/layouts/TitleLayout.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TitleLayout, defaultTitleContent } from "./TitleLayout";

describe("defaultTitleContent", () => {
  it("returns a title and empty subtitle", () => {
    expect(defaultTitleContent()).toEqual({ title: "Title Only", subtitle: "" });
  });
});

describe("TitleLayout", () => {
  it("renders the title and subtitle from content", () => {
    render(<TitleLayout content={{ title: "Vertx Flow", subtitle: "Pitch better" }} onChangeContent={() => {}} />);
    expect(screen.getByText("Vertx Flow")).toBeInTheDocument();
    expect(screen.getByText("Pitch better")).toBeInTheDocument();
  });

  it("does not render a subtitle element when subtitle is empty", () => {
    const { container } = render(<TitleLayout content={{ title: "Vertx Flow", subtitle: "" }} onChangeContent={() => {}} />);
    expect(container.querySelector('[data-field="subtitle"]')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- TitleLayout`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the implementation**

```jsx
// src/components/new/deck/layouts/TitleLayout.jsx
import React from "react";
import { RichText } from "../RichText";

export function defaultTitleContent() {
  return { title: "Title Only", subtitle: "" };
}

export function TitleLayout({ content, onChangeContent }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 text-center">
      <RichText
        as="h1"
        className="text-7xl font-bold"
        value={content.title}
        onChange={(html) => onChangeContent({ title: html })}
      />
      {content.subtitle ? (
        <div data-field="subtitle" className="mt-4">
          <RichText
            as="p"
            className="text-2xl opacity-60"
            value={content.subtitle}
            onChange={(html) => onChangeContent({ subtitle: html })}
          />
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- TitleLayout`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/layouts/TitleLayout.jsx src/components/new/deck/layouts/TitleLayout.test.jsx
git commit -m "feat(deck): port TitleLayout onto the deck data model"
```

---

## Task 9: ProblemLayout

**Files:**
- Create: `src/components/new/deck/layouts/ProblemLayout.jsx`
- Test: `src/components/new/deck/layouts/ProblemLayout.test.jsx`
- Reference (read-only): `src/components/new/EditorPage.jsx:745-853` (`TheChallangePage`)

**Interfaces:**
- Consumes: `RichText` (Task 6).
- Produces: `ProblemLayout({ content, onChangeContent })` where `content: { heading: string, body: string }` (`body` is Froala HTML, matching `paragraphToBulletsMapper`'s expected input from Task 3); `defaultProblemContent()` → `{ heading: "The Problem", body: "<p>Describe the problem your customers face.</p>" }`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/new/deck/layouts/ProblemLayout.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProblemLayout, defaultProblemContent } from "./ProblemLayout";

describe("defaultProblemContent", () => {
  it("returns a heading and placeholder body", () => {
    const content = defaultProblemContent();
    expect(content.heading).toBe("The Problem");
    expect(content.body).toContain("Describe the problem");
  });
});

describe("ProblemLayout", () => {
  it("renders heading and body from content", () => {
    render(<ProblemLayout content={{ heading: "The Problem", body: "<p>Users churn fast.</p>" }} onChangeContent={() => {}} />);
    expect(screen.getByText("The Problem")).toBeInTheDocument();
    expect(screen.getByText("Users churn fast.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- ProblemLayout`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the implementation**

```jsx
// src/components/new/deck/layouts/ProblemLayout.jsx
import React from "react";
import { RichText } from "../RichText";

export function defaultProblemContent() {
  return { heading: "The Problem", body: "<p>Describe the problem your customers face.</p>" };
}

export function ProblemLayout({ content, onChangeContent }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-16">
      <RichText
        as="h1"
        className="text-5xl font-bold text-center"
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <RichText
        as="div"
        className="mt-8 text-xl opacity-80 max-w-3xl text-left"
        toolbarButtons={["bold", "italic", "underline", "fontSize", "textColor", "backgroundColor", "formatUL", "formatOL"]}
        value={content.body}
        onChange={(html) => onChangeContent({ body: html })}
      />
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- ProblemLayout`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/layouts/ProblemLayout.jsx src/components/new/deck/layouts/ProblemLayout.test.jsx
git commit -m "feat(deck): port ProblemLayout onto the deck data model"
```

---

## Task 10: MediaDescriptionLayout

**Files:**
- Create: `src/components/new/deck/layouts/MediaDescriptionLayout.jsx`
- Test: `src/components/new/deck/layouts/MediaDescriptionLayout.test.jsx`
- Reference (read-only): `src/components/new/EditorPage.jsx:2938-3099` (`ContentWithImagePage`/`ImageWithContentPage` — the closest existing media+text layouts)

**Interfaces:**
- Consumes: `RichText` (Task 6).
- Produces: `MediaDescriptionLayout({ content, onChangeContent })` where `content: { heading: string, body: string, media: { url: string, type: "image"|"video" }, mediaPosition: "left"|"right" }`; `defaultMediaDescriptionContent()` → `{ heading: "Product Overview", body: "<p>Describe what you've built.</p>", media: { url: "", type: "image" }, mediaPosition: "left" }`. When `media.url` is empty, renders a placeholder box with `data-testid="media-placeholder"` instead of an `<img>`/`<video>` (spec item 1: "Media slides must auto-load sample media" is handled by the caller passing a non-empty `media.url` in `defaultContent` overrides at generation time — this task only needs to render whatever `media.url` it's given, empty or not).

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/new/deck/layouts/MediaDescriptionLayout.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MediaDescriptionLayout, defaultMediaDescriptionContent } from "./MediaDescriptionLayout";

describe("defaultMediaDescriptionContent", () => {
  it("returns heading, body, empty media, and left position", () => {
    expect(defaultMediaDescriptionContent()).toEqual({
      heading: "Product Overview",
      body: "<p>Describe what you've built.</p>",
      media: { url: "", type: "image" },
      mediaPosition: "left",
    });
  });
});

describe("MediaDescriptionLayout", () => {
  it("renders a placeholder when media.url is empty", () => {
    render(
      <MediaDescriptionLayout
        content={{ heading: "H", body: "<p>B</p>", media: { url: "", type: "image" }, mediaPosition: "left" }}
        onChangeContent={() => {}}
      />
    );
    expect(screen.getByTestId("media-placeholder")).toBeInTheDocument();
  });

  it("renders an img when media.type is image and url is set", () => {
    render(
      <MediaDescriptionLayout
        content={{ heading: "H", body: "<p>B</p>", media: { url: "https://example.com/a.png", type: "image" }, mediaPosition: "left" }}
        onChangeContent={() => {}}
      />
    );
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/a.png");
  });

  it("puts the media column first when mediaPosition is left and last when right", () => {
    const { container: leftContainer } = render(
      <MediaDescriptionLayout
        content={{ heading: "H", body: "<p>B</p>", media: { url: "", type: "image" }, mediaPosition: "left" }}
        onChangeContent={() => {}}
      />
    );
    expect(leftContainer.querySelector('[data-col="media"]')).toBe(leftContainer.querySelector(".flex > *:first-child"));

    const { container: rightContainer } = render(
      <MediaDescriptionLayout
        content={{ heading: "H", body: "<p>B</p>", media: { url: "", type: "image" }, mediaPosition: "right" }}
        onChangeContent={() => {}}
      />
    );
    expect(rightContainer.querySelector('[data-col="media"]')).toBe(rightContainer.querySelector(".flex > *:last-child"));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- MediaDescriptionLayout`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the implementation**

```jsx
// src/components/new/deck/layouts/MediaDescriptionLayout.jsx
import React from "react";
import { RichText } from "../RichText";

export function defaultMediaDescriptionContent() {
  return {
    heading: "Product Overview",
    body: "<p>Describe what you've built.</p>",
    media: { url: "", type: "image" },
    mediaPosition: "left",
  };
}

function MediaColumn({ media }) {
  if (!media.url) {
    return (
      <div data-col="media" data-testid="media-placeholder" className="flex-1 bg-white/10 rounded-2xl min-h-[300px]" />
    );
  }
  if (media.type === "video") {
    return (
      <div data-col="media" className="flex-1">
        <video src={media.url} controls className="w-full rounded-2xl" />
      </div>
    );
  }
  return (
    <div data-col="media" className="flex-1">
      <img src={media.url} alt="" className="w-full rounded-2xl object-cover" />
    </div>
  );
}

export function MediaDescriptionLayout({ content, onChangeContent }) {
  const textColumn = (
    <div data-col="text" className="flex-1 flex flex-col justify-center">
      <RichText
        as="h2"
        className="text-4xl font-bold"
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <RichText
        as="div"
        className="mt-6 text-lg opacity-80"
        value={content.body}
        onChange={(html) => onChangeContent({ body: html })}
      />
    </div>
  );
  const mediaColumn = <MediaColumn media={content.media} />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-16">
      <div className="flex gap-10 w-full max-w-6xl items-center">
        {content.mediaPosition === "left" ? (
          <>
            {mediaColumn}
            {textColumn}
          </>
        ) : (
          <>
            {textColumn}
            {mediaColumn}
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- MediaDescriptionLayout`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/layouts/MediaDescriptionLayout.jsx src/components/new/deck/layouts/MediaDescriptionLayout.test.jsx
git commit -m "feat(deck): port MediaDescriptionLayout onto the deck data model"
```

---

## Task 11: Media3PointsLayout

**Files:**
- Create: `src/components/new/deck/layouts/Media3PointsLayout.jsx`
- Test: `src/components/new/deck/layouts/Media3PointsLayout.test.jsx`

**Interfaces:**
- Consumes: `RichText` (Task 6). Content shape (`{ heading, media, points: [{ title, body }] }`) must match what `paragraphToBulletsMapper` (Task 3) produces so `SET_SLIDE_LAYOUT problem -> media-3points` renders correctly end to end.
- Produces: `Media3PointsLayout({ content, onChangeContent })` where `content: { heading: string, media: { url: string, type: "image"|"video" }, points: { title: string, body: string }[] }` (rendered up to 3 points; a 4th+ point is not rendered — enforced here, not upstream, since content can arrive from a mapper that doesn't know the 3-point limit); `defaultMedia3PointsContent()` → `{ heading: "Key Features", media: { url: "", type: "image" }, points: [{ title: "Feature 1", body: "" }, { title: "Feature 2", body: "" }, { title: "Feature 3", body: "" }] }`. `onChangeContent({ points })` is called with the full updated points array when any point's text changes (points are edited as a whole array, not per-field patches, since array index isn't a stable merge key).

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/new/deck/layouts/Media3PointsLayout.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Media3PointsLayout, defaultMedia3PointsContent } from "./Media3PointsLayout";

describe("defaultMedia3PointsContent", () => {
  it("returns heading, empty media, and 3 placeholder points", () => {
    const content = defaultMedia3PointsContent();
    expect(content.heading).toBe("Key Features");
    expect(content.points).toHaveLength(3);
  });
});

describe("Media3PointsLayout", () => {
  it("renders up to 3 points even when given more", () => {
    const content = {
      heading: "Key Features",
      media: { url: "", type: "image" },
      points: [
        { title: "One", body: "First" },
        { title: "Two", body: "Second" },
        { title: "Three", body: "Third" },
        { title: "Four", body: "Fourth" },
      ],
    };
    render(<Media3PointsLayout content={content} onChangeContent={() => {}} />);
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
    expect(screen.getByText("Three")).toBeInTheDocument();
    expect(screen.queryByText("Four")).toBeNull();
  });

  it("renders point bodies produced by paragraphToBulletsMapper (empty title)", () => {
    const content = {
      heading: "Key Features",
      media: { url: "", type: "image" },
      points: [{ title: "", body: "Onboarding takes weeks" }],
    };
    render(<Media3PointsLayout content={content} onChangeContent={() => {}} />);
    expect(screen.getByText("Onboarding takes weeks")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Media3PointsLayout`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the implementation**

```jsx
// src/components/new/deck/layouts/Media3PointsLayout.jsx
import React from "react";
import { RichText } from "../RichText";

export function defaultMedia3PointsContent() {
  return {
    heading: "Key Features",
    media: { url: "", type: "image" },
    points: [
      { title: "Feature 1", body: "" },
      { title: "Feature 2", body: "" },
      { title: "Feature 3", body: "" },
    ],
  };
}

export function Media3PointsLayout({ content, onChangeContent }) {
  const visiblePoints = content.points.slice(0, 3);

  function updatePoint(index, patch) {
    const points = content.points.map((p, i) => (i === index ? { ...p, ...patch } : p));
    onChangeContent({ points });
  }

  return (
    <div className="flex flex-col min-h-screen p-8 sm:p-16">
      <RichText
        as="h2"
        className="text-4xl font-bold text-center"
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <div className="mt-10 flex gap-8">
        {content.media.url ? (
          <img src={content.media.url} alt="" className="flex-1 rounded-2xl object-cover" />
        ) : (
          <div className="flex-1 bg-white/10 rounded-2xl min-h-[300px]" />
        )}
        <div className="flex-1 flex flex-col gap-6">
          {visiblePoints.map((point, index) => (
            <div key={index}>
              {point.title ? (
                <RichText
                  as="h3"
                  className="text-xl font-semibold"
                  value={point.title}
                  onChange={(html) => updatePoint(index, { title: html })}
                />
              ) : null}
              <RichText
                as="p"
                className="opacity-80"
                value={point.body}
                onChange={(html) => updatePoint(index, { body: html })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Media3PointsLayout`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/layouts/Media3PointsLayout.jsx src/components/new/deck/layouts/Media3PointsLayout.test.jsx
git commit -m "feat(deck): port Media3PointsLayout onto the deck data model"
```

---

## Task 12: MetricsGridLayout

**Files:**
- Create: `src/components/new/deck/layouts/MetricsGridLayout.jsx`
- Test: `src/components/new/deck/layouts/MetricsGridLayout.test.jsx`
- Reference (read-only): `src/components/new/EditorPage.jsx:981-1212` (`MarketPotentialPage`, uses a `cardData` array of `{ value/label }`-shaped cards)

**Interfaces:**
- Consumes: `RichText` (Task 6).
- Produces: `MetricsGridLayout({ content, onChangeContent })` where `content: { heading: string, metrics: { value: string, label: string }[] }`; `defaultMetricsGridContent()` → `{ heading: "Metrics & Traction", metrics: [{ value: "0", label: "Metric 1" }, { value: "0", label: "Metric 2" }, { value: "0", label: "Metric 3" }] }`. `onChangeContent({ metrics })` called with the full array, same rationale as Task 11's points.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/new/deck/layouts/MetricsGridLayout.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricsGridLayout, defaultMetricsGridContent } from "./MetricsGridLayout";

describe("defaultMetricsGridContent", () => {
  it("returns a heading and 3 zeroed metrics", () => {
    const content = defaultMetricsGridContent();
    expect(content.heading).toBe("Metrics & Traction");
    expect(content.metrics).toHaveLength(3);
  });
});

describe("MetricsGridLayout", () => {
  it("renders every metric's value and label", () => {
    const content = {
      heading: "Metrics & Traction",
      metrics: [
        { value: "120%", label: "YoY growth" },
        { value: "40k", label: "Active users" },
      ],
    };
    render(<MetricsGridLayout content={content} onChangeContent={() => {}} />);
    expect(screen.getByText("120%")).toBeInTheDocument();
    expect(screen.getByText("YoY growth")).toBeInTheDocument();
    expect(screen.getByText("40k")).toBeInTheDocument();
    expect(screen.getByText("Active users")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- MetricsGridLayout`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the implementation**

```jsx
// src/components/new/deck/layouts/MetricsGridLayout.jsx
import React from "react";
import { RichText } from "../RichText";

export function defaultMetricsGridContent() {
  return {
    heading: "Metrics & Traction",
    metrics: [
      { value: "0", label: "Metric 1" },
      { value: "0", label: "Metric 2" },
      { value: "0", label: "Metric 3" },
    ],
  };
}

export function MetricsGridLayout({ content, onChangeContent }) {
  function updateMetric(index, patch) {
    const metrics = content.metrics.map((m, i) => (i === index ? { ...m, ...patch } : m));
    onChangeContent({ metrics });
  }

  return (
    <div className="flex flex-col min-h-screen p-8 sm:p-16">
      <RichText
        as="h2"
        className="text-4xl font-bold text-center"
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {content.metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <RichText
              as="div"
              className="text-5xl font-bold"
              value={metric.value}
              onChange={(html) => updateMetric(index, { value: html })}
            />
            <RichText
              as="div"
              className="mt-2 opacity-70"
              value={metric.label}
              onChange={(html) => updateMetric(index, { label: html })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- MetricsGridLayout`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/layouts/MetricsGridLayout.jsx src/components/new/deck/layouts/MetricsGridLayout.test.jsx
git commit -m "feat(deck): port MetricsGridLayout onto the deck data model"
```

---

## Task 13: TeamGridLayout

**Files:**
- Create: `src/components/new/deck/layouts/TeamGridLayout.jsx`
- Test: `src/components/new/deck/layouts/TeamGridLayout.test.jsx`

**Interfaces:**
- Consumes: `RichText` (Task 6).
- Produces: `TeamGridLayout({ content, onChangeContent })` where `content: { heading: string, members: { photoUrl: string, name: string, role: string }[] }`; `defaultTeamGridContent()` → `{ heading: "Team", members: [{ photoUrl: "", name: "Name", role: "Role" }] }`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/new/deck/layouts/TeamGridLayout.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeamGridLayout, defaultTeamGridContent } from "./TeamGridLayout";

describe("defaultTeamGridContent", () => {
  it("returns a heading and one placeholder member", () => {
    const content = defaultTeamGridContent();
    expect(content.heading).toBe("Team");
    expect(content.members).toHaveLength(1);
  });
});

describe("TeamGridLayout", () => {
  it("renders each member's name and role", () => {
    const content = {
      heading: "Team",
      members: [
        { photoUrl: "", name: "Ada Lovelace", role: "CEO" },
        { photoUrl: "https://example.com/b.png", name: "Alan Turing", role: "CTO" },
      ],
    };
    render(<TeamGridLayout content={content} onChangeContent={() => {}} />);
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("CEO")).toBeInTheDocument();
    expect(screen.getByText("Alan Turing")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/b.png");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- TeamGridLayout`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the implementation**

```jsx
// src/components/new/deck/layouts/TeamGridLayout.jsx
import React from "react";
import { RichText } from "../RichText";

export function defaultTeamGridContent() {
  return { heading: "Team", members: [{ photoUrl: "", name: "Name", role: "Role" }] };
}

export function TeamGridLayout({ content, onChangeContent }) {
  function updateMember(index, patch) {
    const members = content.members.map((m, i) => (i === index ? { ...m, ...patch } : m));
    onChangeContent({ members });
  }

  return (
    <div className="flex flex-col min-h-screen p-8 sm:p-16">
      <RichText
        as="h2"
        className="text-4xl font-bold text-center"
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {content.members.map((member, index) => (
          <div key={index} className="text-center">
            {member.photoUrl ? (
              <img src={member.photoUrl} alt="" className="w-24 h-24 rounded-full mx-auto object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full mx-auto bg-white/10" />
            )}
            <RichText
              as="div"
              className="mt-4 font-semibold"
              value={member.name}
              onChange={(html) => updateMember(index, { name: html })}
            />
            <RichText
              as="div"
              className="opacity-70"
              value={member.role}
              onChange={(html) => updateMember(index, { role: html })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- TeamGridLayout`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/layouts/TeamGridLayout.jsx src/components/new/deck/layouts/TeamGridLayout.test.jsx
git commit -m "feat(deck): port TeamGridLayout onto the deck data model"
```

---

## Task 14: CtaLayout

**Files:**
- Create: `src/components/new/deck/layouts/CtaLayout.jsx`
- Test: `src/components/new/deck/layouts/CtaLayout.test.jsx`
- Reference (read-only): `src/components/new/EditorPage.jsx:2261-2443` (`JoinUsPage`)

**Interfaces:**
- Consumes: `RichText` (Task 6).
- Produces: `CtaLayout({ content, onChangeContent })` where `content: { heading: string, body: string, buttonLabel: string }`; `defaultCtaContent()` → `{ heading: "Join Us", body: "<p>Let's build the future together.</p>", buttonLabel: "Get in touch" }`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/new/deck/layouts/CtaLayout.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CtaLayout, defaultCtaContent } from "./CtaLayout";

describe("defaultCtaContent", () => {
  it("returns heading, body, and a button label", () => {
    const content = defaultCtaContent();
    expect(content.heading).toBe("Join Us");
    expect(content.buttonLabel).toBe("Get in touch");
  });
});

describe("CtaLayout", () => {
  it("renders heading, body, and the button label", () => {
    render(
      <CtaLayout
        content={{ heading: "Join Us", body: "<p>Reach out.</p>", buttonLabel: "Contact us" }}
        onChangeContent={() => {}}
      />
    );
    expect(screen.getByText("Join Us")).toBeInTheDocument();
    expect(screen.getByText("Reach out.")).toBeInTheDocument();
    expect(screen.getByText("Contact us")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- CtaLayout`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the implementation**

```jsx
// src/components/new/deck/layouts/CtaLayout.jsx
import React from "react";
import { RichText } from "../RichText";

export function defaultCtaContent() {
  return { heading: "Join Us", body: "<p>Let's build the future together.</p>", buttonLabel: "Get in touch" };
}

export function CtaLayout({ content, onChangeContent }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 text-center">
      <RichText
        as="h1"
        className="text-5xl font-bold"
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <RichText
        as="div"
        className="mt-6 text-xl opacity-80 max-w-2xl"
        value={content.body}
        onChange={(html) => onChangeContent({ body: html })}
      />
      <RichText
        as="div"
        className="mt-10 inline-block px-8 py-3 rounded-full bg-teal-400 text-black font-semibold"
        value={content.buttonLabel}
        onChange={(html) => onChangeContent({ buttonLabel: html })}
      />
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- CtaLayout`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/layouts/CtaLayout.jsx src/components/new/deck/layouts/CtaLayout.test.jsx
git commit -m "feat(deck): port CtaLayout onto the deck data model"
```

---

## Task 15: Finish SlideRegistry, FreeElementLayer, and SlideCanvas

**Files:**
- Modify: `src/components/new/deck/SlideRegistry.js` (created in Task 7; verify its import chain now resolves)
- Create: `src/components/new/deck/FreeElementLayer.jsx`
- Create: `src/components/new/deck/SlideCanvas.jsx`
- Test: `src/components/new/deck/SlideRegistry.test.js` (from Task 7, now run to green)
- Test: `src/components/new/deck/FreeElementLayer.test.jsx`
- Test: `src/components/new/deck/SlideCanvas.test.jsx`

**Interfaces:**
- Consumes: `SlideRegistry`/`getRegistryEntry` (Task 7), all 7 layout components (Tasks 8-14), `useDeck` (Task 5).
- Produces:
  - `FreeElementLayer({ elements, onUpdateElement })` — renders each `FreeElement` absolutely positioned at `left: ${x}%, top: ${y}%, width: ${w}%, height: ${h}%, transform: rotate(${rotation}deg), zIndex`, in ascending `zIndex` order. Renders `text`/`image`/`video` types with their actual content from `props`; `shape`/`divider`/`icon` render a labeled placeholder `div` with `data-type` set (their real rendering is Insert Widget sub-project scope — this task only needs elements to occupy the right position/size/order, per spec's explicit exclusion of Insert Widget UI). `onUpdateElement` is accepted but unused by this task's UI (no drag/resize interactions here); it exists so Task passes it straight to `SlideCanvas`'s caller for the future Insert Widget task to wire up without changing this component's signature.
  - `SlideCanvas({ slide })` — looks up `slide.layout` in `SlideRegistry`; if found, renders that layout's `component` with `content={slide.content}` and `onChangeContent={(patch) => dispatch({ type: "UPDATE_SLIDE_CONTENT", slideId: slide.id, content: patch })}` (via `useDeck`), then renders `<FreeElementLayer elements={slide.freeElements} onUpdateElement={...} />` on top; if `slide.layout` isn't in the registry, renders nothing but a `console.warn` (mirrors reducer's no-op-with-warning contract from Global Constraints) so a corrupt deck never crashes the editor.

- [ ] **Step 1: Run the Task 7 registry test now that layouts exist**

Run: `npm test -- SlideRegistry`
Expected: PASS (all 3 tests from Task 7, now that the import chain resolves).

- [ ] **Step 2: Commit the now-passing SlideRegistry**

```bash
git add src/components/new/deck/SlideRegistry.js src/components/new/deck/SlideRegistry.test.js
git commit -m "feat(deck): wire SlideRegistry to the 7 ported layouts"
```

- [ ] **Step 3: Write the failing test for FreeElementLayer**

```jsx
// src/components/new/deck/FreeElementLayer.test.jsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { FreeElementLayer } from "./FreeElementLayer";

describe("FreeElementLayer", () => {
  it("positions each element by percentage and stacks by zIndex", () => {
    const elements = [
      { id: "b", type: "text", x: 10, y: 20, w: 30, h: 5, rotation: 0, zIndex: 2, locked: false, props: { html: "Back" } },
      { id: "a", type: "text", x: 0, y: 0, w: 10, h: 5, rotation: 0, zIndex: 1, locked: false, props: { html: "Front" } },
    ];
    const { container } = render(<FreeElementLayer elements={elements} onUpdateElement={() => {}} />);
    const nodes = container.querySelectorAll("[data-element-id]");
    expect(nodes).toHaveLength(2);
    expect(nodes[0].dataset.elementId).toBe("a");
    expect(nodes[0].style.left).toBe("0%");
    expect(nodes[0].style.top).toBe("0%");
    expect(nodes[0].style.width).toBe("10%");
    expect(nodes[0].style.zIndex).toBe("1");
    expect(nodes[1].dataset.elementId).toBe("b");
    expect(nodes[1].style.zIndex).toBe("2");
  });

  it("renders an image element's src from props", () => {
    const elements = [
      { id: "img1", type: "image", x: 0, y: 0, w: 20, h: 20, rotation: 0, zIndex: 0, locked: false, props: { src: "https://example.com/x.png" } },
    ];
    const { getByRole } = render(<FreeElementLayer elements={elements} onUpdateElement={() => {}} />);
    expect(getByRole("img")).toHaveAttribute("src", "https://example.com/x.png");
  });

  it("renders a placeholder with data-type for shape/divider/icon elements", () => {
    const elements = [
      { id: "s1", type: "shape", x: 0, y: 0, w: 10, h: 10, rotation: 0, zIndex: 0, locked: false, props: {} },
    ];
    const { container } = render(<FreeElementLayer elements={elements} onUpdateElement={() => {}} />);
    expect(container.querySelector('[data-element-id="s1"]').dataset.type).toBe("shape");
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npm test -- FreeElementLayer`
Expected: FAIL — module does not exist.

- [ ] **Step 5: Write the implementation**

```jsx
// src/components/new/deck/FreeElementLayer.jsx
import React from "react";

function ElementContent({ element }) {
  switch (element.type) {
    case "text":
      return <div dangerouslySetInnerHTML={{ __html: element.props.html ?? "" }} />;
    case "image":
      return <img src={element.props.src ?? ""} alt="" className="w-full h-full object-cover" />;
    case "video":
      return <video src={element.props.src ?? ""} className="w-full h-full object-cover" controls={false} />;
    default:
      return <div className="w-full h-full border-2 border-dashed border-white/40" data-type={element.type} />;
  }
}

export function FreeElementLayer({ elements, onUpdateElement }) {
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  return (
    <div className="absolute inset-0 pointer-events-none">
      {sorted.map((element) => (
        <div
          key={element.id}
          data-element-id={element.id}
          data-type={element.type}
          className="absolute pointer-events-auto"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.w}%`,
            height: `${element.h}%`,
            transform: `rotate(${element.rotation}deg)`,
            zIndex: element.zIndex,
          }}
          onClick={() => onUpdateElement?.(element.id, {})}
        >
          <ElementContent element={element} />
        </div>
      ))}
    </div>
  );
}
```

Note: `data-type` is set both on the wrapper `div` and, for the default case, redundantly on the inner placeholder — remove the inner one to avoid duplicate attributes reading ambiguously in future dev tools:

```jsx
    default:
      return <div className="w-full h-full border-2 border-dashed border-white/40" />;
```

(apply that one-line correction to `ElementContent`'s default case before running tests)

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- FreeElementLayer`
Expected: PASS, all 3 tests green.

- [ ] **Step 7: Commit**

```bash
git add src/components/new/deck/FreeElementLayer.jsx src/components/new/deck/FreeElementLayer.test.jsx
git commit -m "feat(deck): add FreeElementLayer for absolutely-positioned inserts"
```

- [ ] **Step 8: Write the failing test for SlideCanvas**

`SlideCanvas` receives the active slide via a prop rather than looking it up itself, so the test renders `DeckProvider` plus a small host component that reads the deck and passes its first slide down:

```jsx
// src/components/new/deck/SlideCanvas.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SlideCanvas } from "./SlideCanvas";
import { DeckProvider, useDeck } from "./DeckContext";
import { createDeck, createSlide, createFreeElement } from "./deckTypes";

function Host() {
  const { deck } = useDeck();
  return <SlideCanvas slide={deck.slides[0]} />;
}

function renderSlide(slide) {
  const deck = createDeck({ title: "Deck", theme: "dark", slides: [slide] });
  return render(
    <DeckProvider initialDeck={deck}>
      <Host />
    </DeckProvider>
  );
}

describe("SlideCanvas", () => {
  it("renders the registered layout component for the slide's layout", () => {
    const slide = createSlide({ layout: "title", content: { title: "Hello Deck", subtitle: "" }, order: 0 });
    renderSlide(slide);
    expect(screen.getByText("Hello Deck")).toBeInTheDocument();
  });

  it("renders freeElements on top of the layout", () => {
    const element = createFreeElement({ type: "text", x: 0, y: 0, w: 10, h: 10, props: { html: "Overlay" } });
    const slide = createSlide({
      layout: "title",
      content: { title: "Hello Deck", subtitle: "" },
      freeElements: [element],
      order: 0,
    });
    renderSlide(slide);
    expect(screen.getByText("Overlay")).toBeInTheDocument();
  });

  it("warns and renders nothing for an unknown layout instead of throwing", () => {
    const slide = createSlide({ layout: "not-a-layout", content: {}, order: 0 });
    const warn = vi.fn();
    const originalWarn = console.warn;
    console.warn = warn;
    const { container } = renderSlide(slide);
    console.warn = originalWarn;
    expect(warn).toHaveBeenCalled();
    expect(container.querySelector("[data-element-id]")).toBeNull();
  });
});
```

- [ ] **Step 9: Run test to verify it fails**

Run: `npm test -- SlideCanvas`
Expected: FAIL — module does not exist.

- [ ] **Step 10: Write the implementation**

```jsx
// src/components/new/deck/SlideCanvas.jsx
import React from "react";
import { getRegistryEntry } from "./SlideRegistry";
import { FreeElementLayer } from "./FreeElementLayer";
import { useDeck } from "./DeckContext";

export function SlideCanvas({ slide }) {
  const { dispatch } = useDeck();
  const entry = getRegistryEntry(slide.layout);

  if (!entry) {
    console.warn(`SlideCanvas: no registry entry for layout "${slide.layout}"`);
    return null;
  }

  const LayoutComponent = entry.component;

  return (
    <div className="relative w-full aspect-video">
      <LayoutComponent
        content={slide.content}
        onChangeContent={(patch) => dispatch({ type: "UPDATE_SLIDE_CONTENT", slideId: slide.id, content: patch })}
      />
      <FreeElementLayer
        elements={slide.freeElements}
        onUpdateElement={(elementId, patch) => dispatch({ type: "UPDATE_FREE_ELEMENT", slideId: slide.id, elementId, patch })}
      />
    </div>
  );
}
```

- [ ] **Step 11: Run test to verify it passes**

Run: `npm test -- SlideCanvas`
Expected: PASS, all 3 tests green.

- [ ] **Step 12: Run the full test suite**

Run: `npm test`
Expected: every test file across Tasks 1-15 passes.

- [ ] **Step 13: Commit**

```bash
git add src/components/new/deck/SlideCanvas.jsx src/components/new/deck/SlideCanvas.test.jsx
git commit -m "feat(deck): add SlideCanvas rendering layout + free elements"
```

---

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
