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

