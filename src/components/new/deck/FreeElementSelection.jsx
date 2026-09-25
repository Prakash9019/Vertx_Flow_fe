import React from "react";

const CORNER_HANDLES = ["top-left", "top-right", "bottom-left", "bottom-right"];
const EDGE_HANDLES = ["top", "bottom", "left", "right"];

const HANDLE_POSITION = {
  "top-left": { top: 0, left: 0, cursor: "nwse-resize" },
  "top-right": { top: 0, right: 0, cursor: "nesw-resize" },
  "bottom-left": { bottom: 0, left: 0, cursor: "nesw-resize" },
  "bottom-right": { bottom: 0, right: 0, cursor: "nwse-resize" },
  top: { top: 0, left: "50%", cursor: "ns-resize" },
  bottom: { bottom: 0, left: "50%", cursor: "ns-resize" },
  left: { left: 0, top: "50%", cursor: "ew-resize" },
  right: { right: 0, top: "50%", cursor: "ew-resize" },
};

function Handle({ name, onPointerDown }) {
  const pos = HANDLE_POSITION[name];
  const isCorner = CORNER_HANDLES.includes(name);
  return (
    <div
      data-resize-handle={name}
      onPointerDown={(event) => onPointerDown(event, name)}
      className="absolute bg-white border border-teal-500 rounded-sm"
      style={{
        ...pos,
        width: isCorner ? 10 : 8,
        height: isCorner ? 10 : 8,
        transform: "translate(-50%, -50%)",
        cursor: pos.cursor,
        pointerEvents: "auto",
      }}
    />
  );
}

// Bounding box + resize handles + rotate handle, rendered inside the same
// rotated wrapper as the element so the whole selection UI rotates with it.
export function FreeElementSelection({ resizable, rotatable, onResizeStart, onRotateStart }) {
  return (
    <div className="absolute inset-0 pointer-events-none" data-free-element-selection="true">
      <div className="absolute inset-0 border-2 border-teal-400" />
      {resizable &&
        [...CORNER_HANDLES, ...EDGE_HANDLES].map((name) => (
          <Handle key={name} name={name} onPointerDown={onResizeStart} />
        ))}
      {rotatable && (
        <>
          <div
            className="absolute bg-teal-400"
            style={{ left: "50%", top: -24, width: 2, height: 24, transform: "translateX(-50%)" }}
          />
          <div
            data-rotate-handle="true"
            onPointerDown={onRotateStart}
            className="absolute bg-white border border-teal-500 rounded-full"
            style={{
              left: "50%",
              top: -24,
              width: 12,
              height: 12,
              transform: "translate(-50%, -50%)",
              cursor: "grab",
              pointerEvents: "auto",
            }}
          />
        </>
      )}
    </div>
  );
}

export function SnapGuides({ guides }) {
  if (!guides || (guides.x === null && guides.y === null)) return null;
  return (
    <>
      {guides.x !== null && (
        <div className="absolute top-0 bottom-0 bg-pink-400/80 pointer-events-none" style={{ left: `${guides.x}%`, width: 1 }} />
      )}
      {guides.y !== null && (
        <div className="absolute left-0 right-0 bg-pink-400/80 pointer-events-none" style={{ top: `${guides.y}%`, height: 1 }} />
      )}
    </>
  );
}
