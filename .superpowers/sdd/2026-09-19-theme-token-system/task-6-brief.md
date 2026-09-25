### Task 6: Refactor the 7 layouts to consume theme tokens

**Files:**
- Modify: `src/components/new/deck/layouts/TitleLayout.jsx`
- Modify: `src/components/new/deck/layouts/ProblemLayout.jsx`
- Modify: `src/components/new/deck/layouts/MediaDescriptionLayout.jsx`
- Modify: `src/components/new/deck/layouts/Media3PointsLayout.jsx`
- Modify: `src/components/new/deck/layouts/MetricsGridLayout.jsx`
- Modify: `src/components/new/deck/layouts/TeamGridLayout.jsx`
- Modify: `src/components/new/deck/layouts/CtaLayout.jsx`
- Modify: `src/components/new/deck/layouts/CtaLayout.test.jsx`

**Interfaces:**
- Consumes: the `--theme-heading-font`/`--theme-body-font`/`--theme-primary`/`--theme-background`/`--theme-surface-muted` CSS variables (Task 1), which are available on every layout because they're rendered as a descendant of the wrapper `EditorPage.jsx` applies `themeToRootStyle` to (Task 5); and the `style` prop `RichText` now forwards (Task 4).
- No prop signature changes — every layout keeps its existing `({ content, onChangeContent })` interface, so `SlideCanvas.jsx` and `SlideRegistry.js` need no changes.

Text color itself needs no change in any layout: none of the 7 layouts sets its own text-color Tailwind class today (color already cascades from the ancestor wrapper, which Task 5 now paints with `--theme-text` via `themeToRootStyle`). This task only needs to: (a) put heading/body font-family on theme tokens, and (b) replace the two spots that hardcode a Tailwind color/accent instead of inheriting: `CtaLayout`'s button and the `MediaDescriptionLayout`/`Media3PointsLayout` empty-media placeholders.

- [ ] **Step 1: `TitleLayout.jsx`**

```jsx
import React from "react";
import { RichText } from "../RichText";

export function defaultTitleContent() {
  return { title: "Title Only", subtitle: "" };
}

export function TitleLayout({ content, onChangeContent }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 sm:p-16 text-center">
      <RichText
        as="h1"
        className="text-7xl font-bold"
        style={{ fontFamily: "var(--theme-heading-font)" }}
        value={content.title}
        onChange={(html) => onChangeContent({ title: html })}
      />
      {content.subtitle ? (
        <div data-field="subtitle" className="mt-4">
          <RichText
            as="p"
            className="text-2xl opacity-60"
            style={{ fontFamily: "var(--theme-body-font)" }}
            value={content.subtitle}
            onChange={(html) => onChangeContent({ subtitle: html })}
          />
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: `ProblemLayout.jsx`**

```jsx
import React from "react";
import { RichText } from "../RichText";

export function defaultProblemContent() {
  return { heading: "The Problem", body: "<p>Describe the problem your customers face.</p>" };
}

export function ProblemLayout({ content, onChangeContent }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 sm:p-16">
      <RichText
        as="h1"
        className="text-5xl font-bold text-center"
        style={{ fontFamily: "var(--theme-heading-font)" }}
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <RichText
        as="div"
        className="mt-8 text-xl opacity-80 max-w-3xl text-left"
        style={{ fontFamily: "var(--theme-body-font)" }}
        toolbarButtons={["bold", "italic", "underline", "fontSize", "textColor", "backgroundColor", "formatUL", "formatOL"]}
        value={content.body}
        onChange={(html) => onChangeContent({ body: html })}
      />
    </div>
  );
}
```

- [ ] **Step 3: `MediaDescriptionLayout.jsx`**

```jsx
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
      <div
        data-col="media"
        data-testid="media-placeholder"
        className="flex-1 rounded-2xl min-h-[300px]"
        style={{ backgroundColor: "var(--theme-surface-muted)" }}
      />
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
        style={{ fontFamily: "var(--theme-heading-font)" }}
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <RichText
        as="div"
        className="mt-6 text-lg opacity-80"
        style={{ fontFamily: "var(--theme-body-font)" }}
        value={content.body}
        onChange={(html) => onChangeContent({ body: html })}
      />
    </div>
  );
  const mediaColumn = <MediaColumn media={content.media} />;

  return (
    <div className="grid place-items-center h-full w-full p-8 sm:p-16">
      <div className="flex gap-10 w-full max-w-6xl items-center">
        {content.mediaPosition === "left" ? mediaColumn : textColumn}
        {content.mediaPosition === "left" ? textColumn : mediaColumn}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: `Media3PointsLayout.jsx`**

```jsx
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
    <div className="flex flex-col h-full w-full p-8 sm:p-16">
      <RichText
        as="h2"
        className="text-4xl font-bold text-center"
        style={{ fontFamily: "var(--theme-heading-font)" }}
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <div className="mt-10 flex gap-8">
        {content.media.url ? (
          <img src={content.media.url} alt="" className="flex-1 rounded-2xl object-cover" />
        ) : (
          <div className="flex-1 rounded-2xl min-h-[300px]" style={{ backgroundColor: "var(--theme-surface-muted)" }} />
        )}
        <div className="flex-1 flex flex-col gap-6">
          {visiblePoints.map((point, index) => (
            <div key={index}>
              {point.title ? (
                <RichText
                  as="h3"
                  className="text-xl font-semibold"
                  style={{ fontFamily: "var(--theme-heading-font)" }}
                  value={point.title}
                  onChange={(html) => updatePoint(index, { title: html })}
                />
              ) : null}
              <RichText
                as="p"
                className="opacity-80"
                style={{ fontFamily: "var(--theme-body-font)" }}
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

- [ ] **Step 5: `MetricsGridLayout.jsx`**

```jsx
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
    <div className="flex flex-col h-full w-full p-8 sm:p-16">
      <RichText
        as="h2"
        className="text-4xl font-bold text-center"
        style={{ fontFamily: "var(--theme-heading-font)" }}
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {content.metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <RichText
              as="div"
              className="text-5xl font-bold"
              style={{ fontFamily: "var(--theme-heading-font)", color: "var(--theme-primary)" }}
              value={metric.value}
              onChange={(html) => updateMetric(index, { value: html })}
            />
            <RichText
              as="div"
              className="mt-2 opacity-70"
              style={{ fontFamily: "var(--theme-body-font)" }}
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

- [ ] **Step 6: `TeamGridLayout.jsx`**

```jsx
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
    <div className="flex flex-col h-full w-full p-8 sm:p-16">
      <RichText
        as="h2"
        className="text-4xl font-bold text-center"
        style={{ fontFamily: "var(--theme-heading-font)" }}
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {content.members.map((member, index) => (
          <div key={index} className="text-center">
            {member.photoUrl ? (
              <img src={member.photoUrl} alt={member.name} className="w-24 h-24 rounded-full mx-auto object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full mx-auto" style={{ backgroundColor: "var(--theme-surface-muted)" }} />
            )}
            <RichText
              as="div"
              className="mt-4 font-semibold"
              style={{ fontFamily: "var(--theme-heading-font)" }}
              value={member.name}
              onChange={(html) => updateMember(index, { name: html })}
            />
            <RichText
              as="div"
              className="opacity-70"
              style={{ fontFamily: "var(--theme-body-font)" }}
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

- [ ] **Step 7: `CtaLayout.jsx`**

```jsx
import React from "react";
import { RichText } from "../RichText";

export function defaultCtaContent() {
  return { heading: "Join Us", body: "<p>Let's build the future together.</p>", buttonLabel: "Get in touch" };
}

export function CtaLayout({ content, onChangeContent }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 sm:p-16 text-center">
      <RichText
        as="h1"
        className="text-5xl font-bold"
        style={{ fontFamily: "var(--theme-heading-font)" }}
        value={content.heading}
        onChange={(html) => onChangeContent({ heading: html })}
      />
      <RichText
        as="div"
        className="mt-6 text-xl opacity-80 max-w-2xl"
        style={{ fontFamily: "var(--theme-body-font)" }}
        value={content.body}
        onChange={(html) => onChangeContent({ body: html })}
      />
      <RichText
        as="div"
        className="mt-10 inline-block px-8 py-3 rounded-full font-semibold"
        style={{ backgroundColor: "var(--theme-primary)", color: "var(--theme-background)", fontFamily: "var(--theme-body-font)" }}
        value={content.buttonLabel}
        onChange={(html) => onChangeContent({ buttonLabel: html })}
      />
    </div>
  );
}
```

- [ ] **Step 8: Add a regression test that the CTA button no longer hardcodes a color**

Add to `src/components/new/deck/layouts/CtaLayout.test.jsx` (inside the existing `describe("CtaLayout", ...)` block):

```js
  it("styles the button from theme tokens instead of a hardcoded color", () => {
    render(
      <CtaLayout
        content={{ heading: "Join Us", body: "<p>Reach out.</p>", buttonLabel: "Contact us" }}
        onChangeContent={() => {}}
      />
    );
    const button = screen.getByText("Contact us");
    expect(button.className).not.toMatch(/bg-teal-400|text-black/);
    expect(button.style.backgroundColor).toBe("var(--theme-primary)");
    expect(button.style.color).toBe("var(--theme-background)");
  });
```

- [ ] **Step 9: Run the full suite**

Run: `npm test`
Expected: PASS — every pre-existing layout test still passes unchanged (none of them asserted on color, only on text content — verified by reading each `*.test.jsx` in this directory before this task), plus the new CTA test.

- [ ] **Step 10: Commit**

```bash
git add src/components/new/deck/layouts/*.jsx src/components/new/deck/layouts/CtaLayout.test.jsx
git commit -m "refactor: layouts consume theme tokens via CSS variables instead of hardcoded colors"
```

---

