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
    // on, so `value` is deliberately NOT re-synced into the DOM on later
    // renders - doing so would blow away Froala's internal DOM state and reset
    // the caret while the user is typing.
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
            onChangeRef.current(this.html.get());
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

  return <Tag ref={ref} className={className} style={style} />;
}
