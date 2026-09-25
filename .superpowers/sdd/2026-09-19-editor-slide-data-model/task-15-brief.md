## Task 15: Finish SlideRegistry, FreeElementLayer, and SlideCanvas

**Files:**
- Modify: `src/components/new/deck/SlideRegistry.js` (created in Task 7; verify its import chain now resolves)
- Create: `src/components/new/deck/FreeElementLayer.jsx`
- Create: `src/components/new/deck/SlideCanvas.jsx`
- Test: `src/components/new/deck/SlideRegistry.test.js` (from Task 7, now run to green)
- Test: `src/components/new/deck/FreeElementLayer.test.jsx`
- Test: `src/components/new/deck/SlideCanvas.test.jsx`

**Interfaces:**
- Consumes: `SlideRegistry`/`getRegistryEntry` (Task 7), all 7 layout components (Tasks 8-14), `useDeck` (Task 5).
- Produces:
  - `FreeElementLayer({ elements, onUpdateElement })` — renders each `FreeElement` absolutely positioned at `left: ${x}%, top: ${y}%, width: ${w}%, height: ${h}%, transform: rotate(${rotation}deg), zIndex`, in ascending `zIndex` order. Renders `text`/`image`/`video` types with their actual content from `props`; `shape`/`divider`/`icon` render a labeled placeholder `div` with `data-type` set (their real rendering is Insert Widget sub-project scope — this task only needs elements to occupy the right position/size/order, per spec's explicit exclusion of Insert Widget UI). `onUpdateElement` is accepted but unused by this task's UI (no drag/resize interactions here); it exists so Task passes it straight to `SlideCanvas`'s caller for the future Insert Widget task to wire up without changing this component's signature.
  - `SlideCanvas({ slide })` — looks up `slide.layout` in `SlideRegistry`; if found, renders that layout's `component` with `content={slide.content}` and `onChangeContent={(patch) => dispatch({ type: "UPDATE_SLIDE_CONTENT", slideId: slide.id, content: patch })}` (via `useDeck`), then renders `<FreeElementLayer elements={slide.freeElements} onUpdateElement={...} />` on top; if `slide.layout` isn't in the registry, renders nothing but a `console.warn` (mirrors reducer's no-op-with-warning contract from Global Constraints) so a corrupt deck never crashes the editor.

- [ ] **Step 1: Run the Task 7 registry test now that layouts exist**

Run: `npm test -- SlideRegistry`
Expected: PASS (all 3 tests from Task 7, now that the import chain resolves).

- [ ] **Step 2: Commit the now-passing SlideRegistry**

```bash
git add src/components/new/deck/SlideRegistry.js src/components/new/deck/SlideRegistry.test.js
git commit -m "feat(deck): wire SlideRegistry to the 7 ported layouts"
```

- [ ] **Step 3: Write the failing test for FreeElementLayer**

```jsx
// src/components/new/deck/FreeElementLayer.test.jsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { FreeElementLayer } from "./FreeElementLayer";

describe("FreeElementLayer", () => {
  it("positions each element by percentage and stacks by zIndex", () => {
    const elements = [
      { id: "b", type: "text", x: 10, y: 20, w: 30, h: 5, rotation: 0, zIndex: 2, locked: false, props: { html: "Back" } },
      { id: "a", type: "text", x: 0, y: 0, w: 10, h: 5, rotation: 0, zIndex: 1, locked: false, props: { html: "Front" } },
    ];
    const { container } = render(<FreeElementLayer elements={elements} onUpdateElement={() => {}} />);
    const nodes = container.querySelectorAll("[data-element-id]");
    expect(nodes).toHaveLength(2);
    expect(nodes[0].dataset.elementId).toBe("a");
    expect(nodes[0].style.left).toBe("0%");
    expect(nodes[0].style.top).toBe("0%");
    expect(nodes[0].style.width).toBe("10%");
    expect(nodes[0].style.zIndex).toBe("1");
    expect(nodes[1].dataset.elementId).toBe("b");
    expect(nodes[1].style.zIndex).toBe("2");
  });

  it("renders an image element's src from props", () => {
    const elements = [
      { id: "img1", type: "image", x: 0, y: 0, w: 20, h: 20, rotation: 0, zIndex: 0, locked: false, props: { src: "https://example.com/x.png" } },
    ];
    const { getByRole } = render(<FreeElementLayer elements={elements} onUpdateElement={() => {}} />);
    expect(getByRole("img")).toHaveAttribute("src", "https://example.com/x.png");
  });

  it("renders a placeholder with data-type for shape/divider/icon elements", () => {
    const elements = [
      { id: "s1", type: "shape", x: 0, y: 0, w: 10, h: 10, rotation: 0, zIndex: 0, locked: false, props: {} },
    ];
    const { container } = render(<FreeElementLayer elements={elements} onUpdateElement={() => {}} />);
    expect(container.querySelector('[data-element-id="s1"]').dataset.type).toBe("shape");
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npm test -- FreeElementLayer`
Expected: FAIL — module does not exist.

- [ ] **Step 5: Write the implementation**

```jsx
// src/components/new/deck/FreeElementLayer.jsx
import React from "react";

function ElementContent({ element }) {
  switch (element.type) {
    case "text":
      return <div dangerouslySetInnerHTML={{ __html: element.props.html ?? "" }} />;
    case "image":
      return <img src={element.props.src ?? ""} alt="" className="w-full h-full object-cover" />;
    case "video":
      return <video src={element.props.src ?? ""} className="w-full h-full object-cover" controls={false} />;
    default:
      return <div className="w-full h-full border-2 border-dashed border-white/40" data-type={element.type} />;
  }
}

export function FreeElementLayer({ elements, onUpdateElement }) {
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  return (
    <div className="absolute inset-0 pointer-events-none">
      {sorted.map((element) => (
        <div
          key={element.id}
          data-element-id={element.id}
          data-type={element.type}
          className="absolute pointer-events-auto"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.w}%`,
            height: `${element.h}%`,
            transform: `rotate(${element.rotation}deg)`,
            zIndex: element.zIndex,
          }}
          onClick={() => onUpdateElement?.(element.id, {})}
        >
          <ElementContent element={element} />
        </div>
      ))}
    </div>
  );
}
```

Note: `data-type` is set both on the wrapper `div` and, for the default case, redundantly on the inner placeholder — remove the inner one to avoid duplicate attributes reading ambiguously in future dev tools:

```jsx
    default:
      return <div className="w-full h-full border-2 border-dashed border-white/40" />;
```

(apply that one-line correction to `ElementContent`'s default case before running tests)

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- FreeElementLayer`
Expected: PASS, all 3 tests green.

- [ ] **Step 7: Commit**

```bash
git add src/components/new/deck/FreeElementLayer.jsx src/components/new/deck/FreeElementLayer.test.jsx
git commit -m "feat(deck): add FreeElementLayer for absolutely-positioned inserts"
```

- [ ] **Step 8: Write the failing test for SlideCanvas**

`SlideCanvas` receives the active slide via a prop rather than looking it up itself, so the test renders `DeckProvider` plus a small host component that reads the deck and passes its first slide down:

```jsx
// src/components/new/deck/SlideCanvas.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SlideCanvas } from "./SlideCanvas";
import { DeckProvider, useDeck } from "./DeckContext";
import { createDeck, createSlide, createFreeElement } from "./deckTypes";

function Host() {
  const { deck } = useDeck();
  return <SlideCanvas slide={deck.slides[0]} />;
}

function renderSlide(slide) {
  const deck = createDeck({ title: "Deck", theme: "dark", slides: [slide] });
  return render(
    <DeckProvider initialDeck={deck}>
      <Host />
    </DeckProvider>
  );
}

describe("SlideCanvas", () => {
  it("renders the registered layout component for the slide's layout", () => {
    const slide = createSlide({ layout: "title", content: { title: "Hello Deck", subtitle: "" }, order: 0 });
    renderSlide(slide);
    expect(screen.getByText("Hello Deck")).toBeInTheDocument();
  });

  it("renders freeElements on top of the layout", () => {
    const element = createFreeElement({ type: "text", x: 0, y: 0, w: 10, h: 10, props: { html: "Overlay" } });
    const slide = createSlide({
      layout: "title",
      content: { title: "Hello Deck", subtitle: "" },
      freeElements: [element],
      order: 0,
    });
    renderSlide(slide);
    expect(screen.getByText("Overlay")).toBeInTheDocument();
  });

  it("warns and renders nothing for an unknown layout instead of throwing", () => {
    const slide = createSlide({ layout: "not-a-layout", content: {}, order: 0 });
    const warn = vi.fn();
    const originalWarn = console.warn;
    console.warn = warn;
    const { container } = renderSlide(slide);
    console.warn = originalWarn;
    expect(warn).toHaveBeenCalled();
    expect(container.querySelector("[data-element-id]")).toBeNull();
  });
});
```

- [ ] **Step 9: Run test to verify it fails**

Run: `npm test -- SlideCanvas`
Expected: FAIL — module does not exist.

- [ ] **Step 10: Write the implementation**

```jsx
// src/components/new/deck/SlideCanvas.jsx
import React from "react";
import { getRegistryEntry } from "./SlideRegistry";
import { FreeElementLayer } from "./FreeElementLayer";
import { useDeck } from "./DeckContext";

export function SlideCanvas({ slide }) {
  const { dispatch } = useDeck();
  const entry = getRegistryEntry(slide.layout);

  if (!entry) {
    console.warn(`SlideCanvas: no registry entry for layout "${slide.layout}"`);
    return null;
  }

  const LayoutComponent = entry.component;

  return (
    <div className="relative w-full aspect-video">
      <LayoutComponent
        content={slide.content}
        onChangeContent={(patch) => dispatch({ type: "UPDATE_SLIDE_CONTENT", slideId: slide.id, content: patch })}
      />
      <FreeElementLayer
        elements={slide.freeElements}
        onUpdateElement={(elementId, patch) => dispatch({ type: "UPDATE_FREE_ELEMENT", slideId: slide.id, elementId, patch })}
      />
    </div>
  );
}
```

- [ ] **Step 11: Run test to verify it passes**

Run: `npm test -- SlideCanvas`
Expected: PASS, all 3 tests green.

- [ ] **Step 12: Run the full test suite**

Run: `npm test`
Expected: every test file across Tasks 1-15 passes.

- [ ] **Step 13: Commit**

```bash
git add src/components/new/deck/SlideCanvas.jsx src/components/new/deck/SlideCanvas.test.jsx
git commit -m "feat(deck): add SlideCanvas rendering layout + free elements"
```

---

