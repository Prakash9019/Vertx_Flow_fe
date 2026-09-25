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

export function RichText({ value, onChange, toolbarButtons, className, style, as: Tag = "div" }) {
  const ref = useRef(null);
  const editorRef = useRef(null);
  const seededRef = useRef(false);

  // The value currently reflected in the live DOM/editor - either the seeded
  // initial value or whatever this component itself last emitted via
  // `contentChanged`. Comparing an incoming `value` prop against THIS (not
  // against the live DOM's innerHTML) is what lets the resync effect below
  // tell "the user typed and the parent echoed it back" (no-op, preserves
  // the caret) apart from "something else changed this slide's content while
  // I stayed mounted" (undo/redo, most notably - SlideCanvas keys only on
  // `slide.id`, so UNDO/REDO revert `content` without remounting this field,
  // and this ref is what makes that revert actually show up on screen).
  const lastKnownValueRef = useRef(value);

  // Latest props, kept in refs so the imperatively-registered Froala event
  // handlers below never read a stale first-render closure. No deps array:
  // this effect runs after EVERY render.
  const onChangeRef = useRef(onChange);
  const toolbarButtonsRef = useRef(toolbarButtons);
  const valueRef = useRef(value);
  useEffect(() => {
    onChangeRef.current = onChange;
    toolbarButtonsRef.current = toolbarButtons;
    valueRef.current = value;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.document.createElement) return;

    // Seed the DOM exactly once. Froala owns this node imperatively from here
    // on; a *naive* re-sync on every `value` change would blow away Froala's
    // internal DOM state and reset the caret while the user is typing, which
    // is why the resync effect below only fires for a genuinely external
    // change (see `lastKnownValueRef`), never for the echo of our own edits.
    if (ref.current && !seededRef.current) {
      seededRef.current = true;
      ref.current.innerHTML = valueRef.current ?? "";
    }

    const { script } = ensureFroalaAssets();

    const initEditor = () => {
      if (!window.FroalaEditor || !ref.current || editorRef.current) return;
      editorRef.current = new window.FroalaEditor(ref.current, {
        inline: true,
        toolbarInline: true,
        toolbarVisibleWithoutSelection: true,
        charCounterCount: false,
        wordCounterCount: false,
        toolbarButtons: toolbarButtonsRef.current ?? ["bold", "italic", "underline", "fontSize", "textColor", "backgroundColor"],
        events: {
          "contentChanged": function () {
            const html = this.html.get();
            lastKnownValueRef.current = html;
            onChangeRef.current(html);
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
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // External-change resync (roadmap #13): fires only when `value` has moved
  // away from what THIS component last put there - i.e. undo/redo, Remix, or
  // any other programmatic content change on a slide that stays mounted.
  // Prefer Froala's own `html.set` API (keeps its internal state consistent)
  // over a raw `innerHTML` write, falling back to the raw write only before
  // Froala has initialized.
  useEffect(() => {
    if (!seededRef.current) return;
    if (value === lastKnownValueRef.current) return;
    lastKnownValueRef.current = value;
    if (editorRef.current && editorRef.current.html && typeof editorRef.current.html.set === "function") {
      editorRef.current.html.set(value ?? "");
    } else if (ref.current) {
      ref.current.innerHTML = value ?? "";
    }
  }, [value]);

  return <Tag ref={ref} className={className} style={style} />;
}
