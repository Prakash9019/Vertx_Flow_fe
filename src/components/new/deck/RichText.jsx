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
