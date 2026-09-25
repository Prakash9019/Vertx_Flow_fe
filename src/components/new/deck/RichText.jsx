import React, { useEffect, useRef } from "react";
import { CASE_TRANSFORMS } from "./caseTransforms";

let froalaAssetsPromise = null;
const editorsWithChangeCaseRegistered = new WeakSet();

// Roadmap #14: Change Case tool, as a custom Froala dropdown command - kept
// deliberately separate from the pre-existing textColor/backgroundColor
// toolbar buttons (a previously reported, still-open bug there is untouched
// by this work). Froala commands are registered on the class, not per
// instance, and `window.FroalaEditor` is the same class object for the
// entire page lifetime once loaded - so keying the once-only guard off the
// class itself (rather than a plain module-level boolean) registers exactly
// once in production while still allowing tests to install a fresh fake
// class per test. A no-op when the class lacks these APIs (e.g. a minimal
// test stub), matching this file's existing defensive pattern.
function registerChangeCaseCommand(FroalaEditor) {
  if (editorsWithChangeCaseRegistered.has(FroalaEditor)) return;
  if (typeof FroalaEditor.DefineIcon !== "function" || typeof FroalaEditor.RegisterCommand !== "function") return;
  editorsWithChangeCaseRegistered.add(FroalaEditor);

  FroalaEditor.DefineIcon("changeCase", { NAME: "font", SVG_KEY: "fontSize" });
  FroalaEditor.RegisterCommand("changeCase", {
    title: "Change Case",
    type: "dropdown",
    focus: false,
    undo: true,
    refreshAfterCallback: true,
    options: {
      uppercase: "UPPERCASE",
      lowercase: "lowercase",
      titlecase: "Title Case",
      sentencecase: "Sentence case",
    },
    callback(_cmd, value) {
      applyChangeCase(this, value);
    },
  });
}

// Applies the chosen case transform to the current selection when there is
// one, or to the whole field when there isn't - a plain word-processor
// convention (select some text to transform just that; otherwise transform
// everything). `html.getSelected`/`html.insert` are Froala's documented API
// for reading/replacing exactly the selected HTML without disturbing
// anything else in the field.
function applyChangeCase(editor, caseId) {
  const transform = CASE_TRANSFORMS[caseId];
  if (!transform) return;

  const selectedHtml = typeof editor.html?.getSelected === "function" ? editor.html.getSelected() : "";
  if (selectedHtml) {
    editor.html.insert(transform(selectedHtml));
  } else if (typeof editor.html?.set === "function") {
    editor.html.set(transform(editor.html.get()));
  } else {
    return;
  }

  // `html.insert`/`html.set` are silent (they don't fire Froala's own change
  // events), so this component's `contentChanged` handler - which is what
  // actually persists the edit via `onChange` - has to be triggered manually.
  if (typeof editor.events?.trigger === "function") {
    editor.events.trigger("contentChanged");
  }
}

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
      registerChangeCaseCommand(window.FroalaEditor);
      const baseButtons = toolbarButtonsRef.current ?? ["bold", "italic", "underline", "fontSize", "textColor", "backgroundColor"];
      editorRef.current = new window.FroalaEditor(ref.current, {
        inline: true,
        toolbarInline: true,
        toolbarVisibleWithoutSelection: true,
        charCounterCount: false,
        wordCounterCount: false,
        toolbarButtons: [...baseButtons, "changeCase"],
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
