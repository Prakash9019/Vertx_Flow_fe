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

