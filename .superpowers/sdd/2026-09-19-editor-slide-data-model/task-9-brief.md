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

