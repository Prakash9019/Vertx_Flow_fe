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

