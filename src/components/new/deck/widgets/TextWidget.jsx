import React, { useEffect, useRef } from "react";

// Deliberately not RichText/Froala: a free text widget is a simple
// contentEditable box so it can never fight with the semantic slide fields'
// Froala instances. It supports click-to-select/double-click-to-edit/type/delete
// like any other free element, per the brief.
export function TextWidget({ element, editing, onCommit }) {
  const ref = useRef(null);
  const seededRef = useRef(false);
  // The html currently reflected in the live contentEditable node - either
  // the seeded initial value or whatever this widget itself last committed
  // on blur. Comparing an incoming `element.props.html` against this (roadmap
  // #13, same class of bug as RichText.jsx) is what lets the resync effect
  // below tell "we just committed our own edit" apart from "something else
  // changed this element's text while it stayed mounted" - undo/redo, most
  // notably, since FreeElementLayer keys on `element.id`, which UNDO/REDO
  // doesn't change.
  const lastKnownHtmlRef = useRef(element.props.html);

  useEffect(() => {
    if (ref.current && !seededRef.current) {
      seededRef.current = true;
      ref.current.innerHTML = lastKnownHtmlRef.current ?? "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const html = element.props.html ?? "";
    if (html === lastKnownHtmlRef.current) return;
    lastKnownHtmlRef.current = html;
    // Never stomp on an in-progress edit even if props change mid-session -
    // only resync while the widget isn't the one currently being typed into.
    if (ref.current && !editing) {
      ref.current.innerHTML = html;
    }
  }, [element.props.html, editing]);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [editing]);

  return (
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
      onBlur={() => {
        const html = ref.current?.innerHTML ?? "";
        lastKnownHtmlRef.current = html;
        onCommit?.(html);
      }}
      onPointerDown={(event) => {
        if (editing) event.stopPropagation();
      }}
    />
  );
}
