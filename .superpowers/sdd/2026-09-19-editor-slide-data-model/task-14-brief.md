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

