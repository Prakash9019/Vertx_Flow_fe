import React, { useEffect, useRef, useState } from "react";
import { useFreeElementInteraction } from "./useFreeElementInteraction";
import { FreeElementSelection, SnapGuides } from "./FreeElementSelection";
import { FreeElementToolbar } from "./FreeElementToolbar";
import { FreeElementRenderer } from "./FreeElementRenderer";
import { reorderZIndex, duplicateWidget, maxZIndex } from "./freeElementFactory";

function FreeElement({
  element,
  isSelected,
  isEditing,
  containerRef,
  onSelect,
  onStartEditing,
  onChange,
  onDelete,
  onDuplicate,
  onBringForward,
  onSendBackward,
}) {
  const [guides, setGuides] = useState(null);

  const { beginDrag, beginResize, beginRotate, handlePointerMove, handlePointerUp, handlePointerCancel } =
    useFreeElementInteraction({
      element,
      containerRef,
      onSelect,
      onChange: (patch, coalesceId, nextGuides) => {
        onChange(element.id, patch, coalesceId);
        if (nextGuides !== undefined) setGuides(nextGuides);
      },
      onGestureEnd: () => setGuides(null),
    });

  return (
    <div
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
      onPointerDown={element.locked ? undefined : beginDrag}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onDoubleClick={() => onStartEditing(element.id)}
    >
      <FreeElementRenderer
        element={element}
        editing={isEditing}
        onCommitText={(html) => {
          onChange(element.id, { props: { ...element.props, html } });
          onStartEditing(null);
        }}
        onReplaceSrc={(src) => onChange(element.id, { props: { ...element.props, src } })}
      />
      {isSelected && (
        <>
          <FreeElementSelection
            resizable={!element.locked}
            rotatable={!element.locked}
            onResizeStart={beginResize}
            onRotateStart={beginRotate}
          />
          <SnapGuides guides={guides} />
          <FreeElementToolbar
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onBringForward={onBringForward}
            onSendBackward={onSendBackward}
          />
        </>
      )}
    </div>
  );
}

export function FreeElementLayer({
  elements,
  selectedElementId = null,
  editingElementId = null,
  onSelectElement = () => {},
  onStartEditing = () => {},
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onReorderElements,
}) {
  const containerRef = useRef(null);
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  const selected = elements.find((el) => el.id === selectedElementId) ?? null;

  useEffect(() => {
    function handleKeyDown(event) {
      if (!selected || editingElementId) return;
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        onDeleteElement(selected.id);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, editingElementId, onDeleteElement]);

  function handleBringForward() {
    if (!selected) return;
    const updates = reorderZIndex(elements, selected.id, "forward");
    if (updates) onReorderElements(updates);
  }

  function handleSendBackward() {
    if (!selected) return;
    const updates = reorderZIndex(elements, selected.id, "backward");
    if (updates) onReorderElements(updates);
  }

  function handleDuplicate() {
    if (!selected) return;
    const duplicate = duplicateWidget(selected, { existingMaxZIndex: maxZIndex(elements) });
    onDuplicateElement(duplicate);
    onSelectElement(duplicate.id);
  }

  function handleDelete() {
    if (!selected) return;
    onDeleteElement(selected.id);
  }

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {sorted.map((element) => (
        <FreeElement
          key={element.id}
          element={element}
          isSelected={element.id === selectedElementId}
          isEditing={element.id === editingElementId}
          containerRef={containerRef}
          onSelect={onSelectElement}
          onStartEditing={onStartEditing}
          onChange={onUpdateElement}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
        />
      ))}
    </div>
  );
}
