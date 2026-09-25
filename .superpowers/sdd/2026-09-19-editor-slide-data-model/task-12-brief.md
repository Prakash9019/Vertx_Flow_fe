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

