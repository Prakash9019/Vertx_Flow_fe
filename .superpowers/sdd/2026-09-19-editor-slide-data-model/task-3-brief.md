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

