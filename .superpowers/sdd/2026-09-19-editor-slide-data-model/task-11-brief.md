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

