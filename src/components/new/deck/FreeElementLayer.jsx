import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFreeElementInteraction } from "./useFreeElementInteraction";
import { FreeElementSelection, SnapGuides } from "./FreeElementSelection";
import { FreeElementToolbar } from "./FreeElementToolbar";
import { FreeElementRenderer } from "./FreeElementRenderer";
import { reorderZIndex, duplicateWidget, maxZIndex } from "./freeElementFactory";

// Memoized: with `elements` immutably updated so only the touched element's
// object reference changes (see deckReducer's UPDATE_FREE_ELEMENT), and with
// the callback props below now stabilized via useCallback in FreeElementLayer
// and SlideCanvas, an unrelated FreeElement's props are referentially equal
// across a render - so a drag/resize/rotate pointermove (which dispatches on
// every frame) only re-renders the one element actually being manipulated,
// not every element on the slide.
const FreeElement = React.memo(function FreeElement({
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
  getSiblingsOf,
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
      getSiblings: () => getSiblingsOf(element.id),
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
});

export const FreeElementLayer = React.memo(function FreeElementLayer({
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
  // Kept current via a ref rather than a useCallback dependency so the
  // toolbar handlers below (bring-forward/send-backward/duplicate/delete)
  // keep a stable identity across renders even though `elements` gets a new
  // array reference on every dispatch (including every drag pointermove) -
  // otherwise every FreeElement would receive a "new" onDelete/onDuplicate/
  // etc. prop each frame and React.memo on FreeElement would never skip a
  // re-render, no matter how stable `element` itself is.
  const elementsRef = useRef(elements);
  elementsRef.current = elements;
  const selectedElementIdRef = useRef(selectedElementId);
  selectedElementIdRef.current = selectedElementId;

  const sorted = useMemo(() => [...elements].sort((a, b) => a.zIndex - b.zIndex), [elements]);
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

  const handleBringForward = useCallback(() => {
    const id = selectedElementIdRef.current;
    if (!id) return;
    const updates = reorderZIndex(elementsRef.current, id, "forward");
    if (updates) onReorderElements(updates);
  }, [onReorderElements]);

  const handleSendBackward = useCallback(() => {
    const id = selectedElementIdRef.current;
    if (!id) return;
    const updates = reorderZIndex(elementsRef.current, id, "backward");
    if (updates) onReorderElements(updates);
  }, [onReorderElements]);

  const handleDuplicate = useCallback(() => {
    const id = selectedElementIdRef.current;
    const current = elementsRef.current;
    const sel = current.find((el) => el.id === id) ?? null;
    if (!sel) return;
    const duplicate = duplicateWidget(sel, { existingMaxZIndex: maxZIndex(current) });
    onDuplicateElement(duplicate);
    onSelectElement(duplicate.id);
  }, [onDuplicateElement, onSelectElement]);

  const handleDelete = useCallback(() => {
    const id = selectedElementIdRef.current;
    if (!id) return;
    onDeleteElement(id);
  }, [onDeleteElement]);

  // Stable identity (reads `elementsRef`, not `elements`, directly) so
  // passing it to every `FreeElement` doesn't defeat the memoization this
  // component relies on (see the comment on `elementsRef` above) - a fresh
  // arrow function here every render would make every element's props
  // "change" every render, even the ones not being dragged.
  const getSiblingsOf = useCallback(
    (id) => elementsRef.current.filter((el) => el.id !== id).map(({ x, y, w, h }) => ({ x, y, w, h })),
    []
  );

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
          getSiblingsOf={getSiblingsOf}
        />
      ))}
    </div>
  );
});
