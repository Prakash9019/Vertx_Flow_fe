### Task 7: Free-element widgets default to theme tokens, explicit overrides win

**Files:**
- Modify: `src/components/new/deck/widgets/TextWidget.jsx`
- Modify: `src/components/new/deck/widgets/ShapeWidget.jsx`
- Modify: `src/components/new/deck/widgets/DividerWidget.jsx`
- Modify: `src/components/new/deck/widgets/IconWidget.jsx`
- Modify: `src/components/new/deck/freeElementFactory.js`
- Test: `src/components/new/deck/widgets/ThemeDefaults.test.jsx` (new)

**Interfaces:**
- Consumes: `--theme-text`/`--theme-body-font`/`--theme-accent`/`--theme-border` CSS variables (Task 1).
- Produces: no prop/signature changes to any widget or to `createWidget`/`duplicateWidget` — only the *values* baked into `WIDGET_DEFAULTS` and the fallback used when a prop is absent change. `duplicateWidget` is unaffected (it copies `element.props` verbatim, whatever they are).

**Design point this task must preserve:** an element with an explicit `props.fill`/`props.color` (however it got set — future color picker, or a value already saved in an existing deck) always keeps rendering that exact value. Only a *missing* prop key falls back to the theme's CSS variable. Newly-created shape/divider/icon elements no longer bake in a hardcoded hex default, so they pick up the live theme by default — that's the actual "free elements inherit theme" behavior the brief asks for.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/new/deck/widgets/ThemeDefaults.test.jsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TextWidget } from "./TextWidget";
import { ShapeWidget } from "./ShapeWidget";
import { DividerWidget } from "./DividerWidget";
import { IconWidget } from "./IconWidget";
import { createWidget } from "../freeElementFactory";

describe("widgets default to theme CSS variables when no explicit style is set", () => {
  it("TextWidget defaults color/font to theme vars", () => {
    const element = { props: { html: "hi" } };
    const { container } = render(<TextWidget element={element} editing={false} onCommit={() => {}} />);
    const div = container.firstChild;
    expect(div.style.color).toBe("var(--theme-text)");
    expect(div.style.fontFamily).toBe("var(--theme-body-font)");
  });

  it("TextWidget keeps an explicit color/font override", () => {
    const element = { props: { html: "hi", color: "#ff0000", fontFamily: "Comic Sans MS" } };
    const { container } = render(<TextWidget element={element} editing={false} onCommit={() => {}} />);
    const div = container.firstChild;
    expect(div.style.color).toBe("#ff0000");
    expect(div.style.fontFamily).toBe("Comic Sans MS");
  });

  it("ShapeWidget defaults fill to the theme accent var", () => {
    const element = { props: { shape: "rectangle" } };
    const { container } = render(<ShapeWidget element={element} />);
    expect(container.firstChild.style.backgroundColor).toBe("var(--theme-accent)");
  });

  it("ShapeWidget keeps an explicit fill override", () => {
    const element = { props: { shape: "rectangle", fill: "#123456" } };
    const { container } = render(<ShapeWidget element={element} />);
    expect(container.firstChild.style.backgroundColor).toBe("#123456");
  });

  it("DividerWidget defaults color to the theme border var", () => {
    const element = { props: {} };
    const { container } = render(<DividerWidget element={element} />);
    expect(container.firstChild.firstChild.style.backgroundColor).toBe("var(--theme-border)");
  });

  it("IconWidget defaults color to the theme accent var", () => {
    const element = { props: { icon: "Star" } };
    const { container } = render(<IconWidget element={element} />);
    expect(container.firstChild.style.color).toBe("var(--theme-accent)");
  });

  it("createWidget no longer bakes a hardcoded color/fill into new shape/divider/icon elements", () => {
    expect(createWidget("shape").props.fill).toBeUndefined();
    expect(createWidget("divider").props.color).toBeUndefined();
    expect(createWidget("icon").props.color).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/new/deck/widgets/ThemeDefaults.test.jsx`
Expected: FAIL — every default-color assertion fails (widgets currently hardcode `text-white`/`#14b8a6`/`rgba(255,255,255,0.6)`/`#ffffff`, and `createWidget` bakes those same values into `props`).

- [ ] **Step 3: Update the widgets**

`src/components/new/deck/widgets/TextWidget.jsx` — change the `className`/`style`:

```jsx
    <div
      ref={ref}
      contentEditable={editing}
      suppressContentEditableWarning
      className="w-full h-full outline-none text-base leading-snug"
      style={{
        cursor: editing ? "text" : "inherit",
        color: element.props.color || "var(--theme-text)",
        fontFamily: element.props.fontFamily || "var(--theme-body-font)",
      }}
      onBlur={() => onCommit?.(ref.current?.innerHTML ?? "")}
      onPointerDown={(event) => {
        if (editing) event.stopPropagation();
      }}
    />
```

(Removed the hardcoded `text-white` class.)

`src/components/new/deck/widgets/ShapeWidget.jsx`:

```jsx
export function ShapeWidget({ element }) {
  const fill = element.props.fill ?? "var(--theme-accent)";
  const shape = element.props.shape ?? "rectangle";

  return (
    <div
      className="w-full h-full"
      style={{
        backgroundColor: fill,
        borderRadius: shape === "circle" ? "50%" : shape === "rounded" ? "12%" : 0,
      }}
    />
  );
}
```

`src/components/new/deck/widgets/DividerWidget.jsx`:

```jsx
export function DividerWidget({ element }) {
  const color = element.props.color ?? "var(--theme-border)";
  return (
    <div className="w-full h-full flex items-center">
      <div className="w-full" style={{ height: 2, backgroundColor: color }} />
    </div>
  );
}
```

`src/components/new/deck/widgets/IconWidget.jsx`:

```jsx
export function IconWidget({ element }) {
  const Icon = ICONS[element.props.icon] ?? Star;
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ color: element.props.color ?? "var(--theme-accent)" }}>
      <Icon className="w-full h-full" />
    </div>
  );
}
```

- [ ] **Step 4: Stop baking a hardcoded default into new elements**

In `src/components/new/deck/freeElementFactory.js`, change `WIDGET_DEFAULTS`:

```js
const WIDGET_DEFAULTS = {
  text: { w: 28, h: 10, props: { html: "Double-click to edit" } },
  image: { w: 30, h: 30, props: { src: "", alt: "" } },
  video: { w: 40, h: 24, props: { src: "" } },
  shape: { w: 18, h: 18, props: { shape: "rectangle" } },
  divider: { w: 40, h: 1.5, props: {} },
  icon: { w: 8, h: 8, props: { icon: "Star" } },
};
```

(Only the `fill`/`color` keys are removed from `shape`/`divider`/`icon` — `shape`/`icon`'s own type-selector keys stay, since those aren't color/theme concerns.)

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/new/deck/widgets/ThemeDefaults.test.jsx`
Expected: PASS.

- [ ] **Step 6: Run the full suite**

Run: `npm test`
Expected: PASS — in particular, `FreeElementInteraction.integration.test.jsx` should still pass unchanged (it exercises drag/resize/duplicate/layering on shape/divider/etc. elements but doesn't assert on their default color).

- [ ] **Step 7: Commit**

```bash
git add src/components/new/deck/widgets/*.jsx src/components/new/deck/freeElementFactory.js src/components/new/deck/widgets/ThemeDefaults.test.jsx
git commit -m "feat: free-element widgets default to theme tokens, explicit overrides still win"
```

---

