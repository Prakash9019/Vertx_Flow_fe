import { useCallback, useRef } from "react";

export const MIN_SIZE_PCT = 4;
const MIN_VISIBLE_PCT = 8;
const SNAP_THRESHOLD_PCT = 1.5;
const ASPECT_LOCKED_TYPES = new Set(["image", "video", "icon"]);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function snap(value, target, threshold) {
  return Math.abs(value - target) <= threshold ? target : null;
}

// Finds the first anchor (in priority order: own center, then own start
// edge, then own end edge - matching the pre-existing slide-only behavior's
// priority) that the dragged element's own center/start/end lands within
// `threshold` of, and returns the snapped start position plus which anchor
// fired (for the alignment-guide line).
function findAxisSnap(start, size, anchors, threshold) {
  const center = start + size / 2;
  const end = start + size;
  for (const anchor of anchors) {
    const snapped = snap(center, anchor, threshold);
    if (snapped !== null) return { start: snapped - size / 2, guide: anchor };
  }
  for (const anchor of anchors) {
    const snapped = snap(start, anchor, threshold);
    if (snapped !== null) return { start: snapped, guide: anchor };
  }
  for (const anchor of anchors) {
    const snapped = snap(end, anchor, threshold);
    if (snapped !== null) return { start: snapped - size, guide: anchor };
  }
  return null;
}

// Applies center/edge snapping to a drag position and reports which guides
// (if any) fired, so the caller can render lightweight alignment lines.
// Snaps to the slide's own center/edges (0/50/100) and, when `siblings` is
// given, to every other free element's left/center/right (x) and
// top/center/bottom (y) edges too - element-to-element snapping.
function applyDragSnap(x, y, w, h, siblings = []) {
  const xAnchors = [0, 50, 100, ...siblings.flatMap((s) => [s.x, s.x + s.w / 2, s.x + s.w])];
  const yAnchors = [0, 50, 100, ...siblings.flatMap((s) => [s.y, s.y + s.h / 2, s.y + s.h])];

  const snappedX = findAxisSnap(x, w, xAnchors, SNAP_THRESHOLD_PCT);
  const snappedY = findAxisSnap(y, h, yAnchors, SNAP_THRESHOLD_PCT);

  return {
    x: snappedX ? snappedX.start : x,
    y: snappedY ? snappedY.start : y,
    guides: { x: snappedX ? snappedX.guide : null, y: snappedY ? snappedY.guide : null },
  };
}

function computeResize(gesture, dxPct, dyPct, lockAspect) {
  const { handle, startX, startY, startW, startH, aspect } = gesture;
  let x = startX;
  let y = startY;
  let w = startW;
  let h = startH;

  if (handle.includes("left")) {
    const newW = clamp(startW - dxPct, MIN_SIZE_PCT, startX + startW);
    x = startX + (startW - newW);
    w = newW;
  }
  if (handle.includes("right")) {
    w = clamp(startW + dxPct, MIN_SIZE_PCT, 100 - startX);
  }
  if (handle.includes("top")) {
    const newH = clamp(startH - dyPct, MIN_SIZE_PCT, startY + startH);
    y = startY + (startH - newH);
    h = newH;
  }
  if (handle.includes("bottom")) {
    h = clamp(startH + dyPct, MIN_SIZE_PCT, 100 - startY);
  }

  const isCorner =
    handle === "top-left" || handle === "top-right" || handle === "bottom-left" || handle === "bottom-right";

  if (lockAspect && isCorner && aspect > 0) {
    const newH = clamp(w / aspect, MIN_SIZE_PCT, 100);
    if (handle.includes("top")) y = startY + (startH - newH);
    h = newH;
  }

  // Final safety clamp - geometry above can't overflow past [0,100] on the
  // anchored edge, but the free edge can; keep at least a sliver reachable.
  w = clamp(w, MIN_SIZE_PCT, 100);
  h = clamp(h, MIN_SIZE_PCT, 100);
  x = clamp(x, -(w - MIN_VISIBLE_PCT), 100 - MIN_VISIBLE_PCT);
  y = clamp(y, -(h - MIN_VISIBLE_PCT), 100 - MIN_VISIBLE_PCT);

  return { x, y, w, h };
}

// Pointer-driven drag/resize/rotate for a single FreeElement. Every gesture
// dispatches through `onChange(patch, coalesceId)` - the caller (FreeElementLayer)
// is responsible for turning that into `dispatch(UPDATE_FREE_ELEMENT, { coalesce: true, coalesceId })`,
// which is what collapses an entire drag/resize/rotate into one undo step.
export function useFreeElementInteraction({ element, containerRef, onSelect, onChange, onGestureEnd, getSiblings }) {
  const gestureRef = useRef(null);

  const getRect = useCallback(() => containerRef.current?.getBoundingClientRect(), [containerRef]);

  const beginDrag = useCallback(
    (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      // A gesture is already in progress from a different pointer (e.g. a
      // second touch landing on this element mid-drag) - ignore it rather
      // than stealing/overwriting the active gesture, which would corrupt
      // both pointers' math (the first pointer's subsequent moves would be
      // interpreted against the second pointer's start position).
      if (gestureRef.current && gestureRef.current.pointerId !== event.pointerId) return;
      event.stopPropagation();
      onSelect(element.id);
      const rect = getRect();
      if (!rect || !rect.width || !rect.height) return;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      gestureRef.current = {
        type: "drag",
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startX: element.x,
        startY: element.y,
        w: element.w,
        h: element.h,
        rectWidth: rect.width,
        rectHeight: rect.height,
        // Snapshotted once at drag start, not re-read every pointermove:
        // siblings aren't expected to move while this element is being
        // dragged, so this avoids calling `getSiblings` on every frame.
        siblings: typeof getSiblings === "function" ? getSiblings() : [],
        coalesceId: `drag-${element.id}-${Date.now()}`,
      };
    },
    [element, getRect, onSelect, getSiblings]
  );

  const beginResize = useCallback(
    (event, handle) => {
      if (gestureRef.current && gestureRef.current.pointerId !== event.pointerId) return;
      event.stopPropagation();
      onSelect(element.id);
      const rect = getRect();
      if (!rect || !rect.width || !rect.height) return;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      gestureRef.current = {
        type: "resize",
        handle,
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startX: element.x,
        startY: element.y,
        startW: element.w,
        startH: element.h,
        aspect: element.h > 0 ? element.w / element.h : 1,
        rectWidth: rect.width,
        rectHeight: rect.height,
        coalesceId: `resize-${element.id}-${Date.now()}`,
      };
    },
    [element, getRect, onSelect]
  );

  const beginRotate = useCallback(
    (event) => {
      if (gestureRef.current && gestureRef.current.pointerId !== event.pointerId) return;
      event.stopPropagation();
      onSelect(element.id);
      const rect = getRect();
      if (!rect || !rect.width || !rect.height) return;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      const centerX = rect.left + ((element.x + element.w / 2) / 100) * rect.width;
      const centerY = rect.top + ((element.y + element.h / 2) / 100) * rect.height;
      const startAngle = (Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180) / Math.PI;
      gestureRef.current = {
        type: "rotate",
        pointerId: event.pointerId,
        centerX,
        centerY,
        startAngle,
        startRotation: element.rotation,
        coalesceId: `rotate-${element.id}-${Date.now()}`,
      };
    },
    [element, getRect, onSelect]
  );

  const handlePointerMove = useCallback(
    (event) => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return;

      if (gesture.type === "drag") {
        const dxPct = ((event.clientX - gesture.startClientX) / gesture.rectWidth) * 100;
        const dyPct = ((event.clientY - gesture.startClientY) / gesture.rectHeight) * 100;
        const minVisible = Math.min(MIN_VISIBLE_PCT, gesture.w, gesture.h);
        const rawX = clamp(gesture.startX + dxPct, -(gesture.w - minVisible), 100 - minVisible);
        const rawY = clamp(gesture.startY + dyPct, -(gesture.h - minVisible), 100 - minVisible);
        const { x, y, guides } = applyDragSnap(rawX, rawY, gesture.w, gesture.h, gesture.siblings);
        onChange({ x, y }, gesture.coalesceId, guides);
      } else if (gesture.type === "resize") {
        const dxPct = ((event.clientX - gesture.startClientX) / gesture.rectWidth) * 100;
        const dyPct = ((event.clientY - gesture.startClientY) / gesture.rectHeight) * 100;
        const lockAspect = event.shiftKey || ASPECT_LOCKED_TYPES.has(element.type);
        const patch = computeResize(gesture, dxPct, dyPct, lockAspect);
        onChange(patch, gesture.coalesceId, null);
      } else if (gesture.type === "rotate") {
        const angle = (Math.atan2(event.clientY - gesture.centerY, event.clientX - gesture.centerX) * 180) / Math.PI;
        let rotation = gesture.startRotation + (angle - gesture.startAngle);
        rotation = Math.round(((rotation % 360) + 360) % 360);
        onChange({ rotation }, gesture.coalesceId, null);
      }
    },
    [onChange, element.type]
  );

  const endGesture = useCallback(
    (event) => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return;
      event.currentTarget?.releasePointerCapture?.(gesture.pointerId);
      gestureRef.current = null;
      onGestureEnd?.();
    },
    [onGestureEnd]
  );

  return {
    beginDrag,
    beginResize,
    beginRotate,
    handlePointerMove,
    handlePointerUp: endGesture,
    handlePointerCancel: endGesture,
    isGestureActive: () => !!gestureRef.current,
  };
}
