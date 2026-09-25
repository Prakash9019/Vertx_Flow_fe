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

