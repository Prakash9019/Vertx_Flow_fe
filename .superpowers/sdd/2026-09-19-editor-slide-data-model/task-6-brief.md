## Task 6: Shared RichText field component

**Files:**
- Create: `src/components/new/deck/RichText.jsx`
- Test: `src/components/new/deck/RichText.test.jsx`
- Reference (read-only, do not modify): `src/components/new/EditorPage.jsx:51-117` (`ensureFroalaAssets`, `onFroalaReady` — the logic being extracted)

**Interfaces:**
- Consumes: nothing from other deck tasks.
- Produces: `<RichText value={htmlString} onChange={(html) => void} toolbarButtons={string[]} className={string} as={"h1"|"p"|"div"} />`. Every ported layout component (Tasks 8-14) renders editable text through this component instead of a raw `contentEditable` div with its own Froala init `useEffect`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/new/deck/RichText.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RichText } from "./RichText";

describe("RichText", () => {
  it("renders the given value as HTML inside the requested element", () => {
    render(<RichText value="<b>Hello</b>" onChange={() => {}} as="h1" className="heading" />);
    const el = screen.getByText("Hello");
    expect(el.tagName).toBe("B");
    expect(el.closest("h1")).not.toBeNull();
    expect(el.closest("h1").className).toBe("heading");
  });

  it("does not throw when window.FroalaEditor is unavailable (e.g. in tests)", () => {
    expect(() =>
      render(<RichText value="<p>Text</p>" onChange={() => {}} as="div" />)
    ).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- RichText`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the implementation**

Read `src/components/new/EditorPage.jsx:51-117` first to copy `ensureFroalaAssets`/`onFroalaReady` verbatim (do not modify that file in this task — it still uses its own copies until Task 15 rewires `EditorPage.jsx`).

```jsx
// src/components/new/deck/RichText.jsx
import React, { useEffect, useRef } from "react";

let froalaAssetsPromise = null;

function ensureFroalaAssets() {
  if (froalaAssetsPromise) return froalaAssetsPromise;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://cdn.jsdelivr.net/npm/froala-editor@4/css/froala_editor.pkgd.min.css";
  document.head.appendChild(link);

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/froala-editor@4/js/froala_editor.pkgd.min.js";
  document.body.appendChild(script);

  froalaAssetsPromise = { link, script };
  return froalaAssetsPromise;
}

function onFroalaReady(script, callback) {
  if (typeof window !== "undefined" && window.FroalaEditor) {
    callback();
    return;
  }
  script.addEventListener("load", callback, { once: true });
}

export function RichText({ value, onChange, toolbarButtons, className, as: Tag = "div" }) {
  const ref = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.document.createElement) return;

    const { script } = ensureFroalaAssets();

    const initEditor = () => {
      if (!window.FroalaEditor || !ref.current) return;
      editorRef.current = new window.FroalaEditor(ref.current, {
        inline: true,
        toolbarInline: true,
        toolbarVisibleWithoutSelection: true,
        charCounterCount: false,
        wordCounterCount: false,
        toolbarButtons: toolbarButtons ?? ["bold", "italic", "underline", "fontSize", "textColor", "backgroundColor"],
        events: {
          "contentChanged": function () {
            onChange(this.html.get());
          },
        },
      });
    };

    onFroalaReady(script, () => {
      setTimeout(initEditor, 100);
    });

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === "function") {
        editorRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Tag ref={ref} className={className} dangerouslySetInnerHTML={{ __html: value }} />;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- RichText`
Expected: PASS — `window.FroalaEditor` is undefined under jsdom, so `initEditor` no-ops and only the static HTML renders, which is exactly what both tests assert.

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/RichText.jsx src/components/new/deck/RichText.test.jsx
git commit -m "feat(deck): extract shared RichText field component"
```

---

