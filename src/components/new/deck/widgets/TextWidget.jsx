import React, { useEffect, useRef } from "react";

// Deliberately not RichText/Froala: a free text widget is a simple
// contentEditable box so it can never fight with the semantic slide fields'
// Froala instances. It supports click-to-select/double-click-to-edit/type/delete
// like any other free element, per the brief.
export function TextWidget({ element, editing, onCommit }) {
  const ref = useRef(null);
  const seededRef = useRef(false);

  useEffect(() => {
    if (ref.current && !seededRef.current) {
      seededRef.current = true;
      ref.current.innerHTML = element.props.html ?? "";
    }
  }, [element.props.html]);

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
      onBlur={() => onCommit?.(ref.current?.innerHTML ?? "")}
      onPointerDown={(event) => {
        if (editing) event.stopPropagation();
      }}
    />
  );
}
