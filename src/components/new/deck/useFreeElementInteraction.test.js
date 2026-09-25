import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFreeElementInteraction, MIN_SIZE_PCT } from "./useFreeElementInteraction";

// A stand-in for the container div's getBoundingClientRect - fixed 1000x600
// box, same convention FreeElementInteraction.integration.test.jsx uses.
function makeContainerRef() {
  return { current: { getBoundingClientRect: () => ({ width: 1000, height: 600, left: 0, top: 0 }) } };
}

function makeElement(overrides = {}) {
  return {
    id: "el-1",
    type: "text",
    x: 40,
    y: 40,
    w: 20,
    h: 10,
    rotation: 0,
    zIndex: 0,
    locked: false,
    props: {},
    ...overrides,
  };
}

function fakePointerEvent({ clientX = 0, clientY = 0, pointerId = 1, button = 0, shiftKey = false } = {}) {
  return {
    clientX,
    clientY,
    pointerId,
    button,
    shiftKey,
    stopPropagation: () => {},
    currentTarget: { setPointerCapture: vi.fn(), releasePointerCapture: vi.fn() },
  };
}

function setup(elementOverrides = {}) {
  const element = makeElement(elementOverrides);
  const containerRef = makeContainerRef();
  const onSelect = vi.fn();
  const onChange = vi.fn();
  const onGestureEnd = vi.fn();
  const { result, rerender } = renderHook(
    ({ el }) => useFreeElementInteraction({ element: el, containerRef, onSelect, onChange, onGestureEnd }),
    { initialProps: { el: element } }
  );
  return { result, rerender, element, onSelect, onChange, onGestureEnd };
}

describe("useFreeElementInteraction", () => {
  describe("drag outside canvas bounds", () => {
    it("clamps position so the element cannot be dragged entirely off the top/left edge", () => {
      const { result, onChange } = setup({ x: 5, y: 5, w: 10, h: 10 });

      act(() => result.current.beginDrag(fakePointerEvent({ clientX: 0, clientY: 0, pointerId: 1 })));
      // Drag far past the top-left corner.
      act(() => result.current.handlePointerMove(fakePointerEvent({ clientX: -5000, clientY: -5000, pointerId: 1 })));

      const [patch] = onChange.mock.calls.at(-1);
      // MIN_VISIBLE_PCT keeps at least a sliver reachable; x/y should be
      // clamped, not run away to a huge negative number.
      expect(patch.x).toBeGreaterThan(-100);
      expect(patch.x).toBeLessThanOrEqual(5);
      expect(patch.y).toBeGreaterThan(-100);
    });

    it("clamps position so the element cannot be dragged entirely off the bottom/right edge", () => {
      const { result, onChange } = setup({ x: 80, y: 80, w: 10, h: 10 });

      act(() => result.current.beginDrag(fakePointerEvent({ clientX: 0, clientY: 0, pointerId: 1 })));
      act(() => result.current.handlePointerMove(fakePointerEvent({ clientX: 5000, clientY: 5000, pointerId: 1 })));

      const [patch] = onChange.mock.calls.at(-1);
      expect(patch.x).toBeLessThan(100);
      expect(patch.y).toBeLessThan(100);
    });
  });

  describe("rapid direction reversal", () => {
    it("tracks position correctly through a burst of alternating-direction moves", () => {
      const { result, onChange } = setup({ x: 40, y: 40, w: 20, h: 10 });

      act(() => result.current.beginDrag(fakePointerEvent({ clientX: 0, clientY: 0, pointerId: 1 })));
      // +5%, -5%, +5%, -5%, +3% (rectWidth=1000 -> 10px == 1%)
      act(() => result.current.handlePointerMove(fakePointerEvent({ clientX: 50, clientY: 0, pointerId: 1 })));
      act(() => result.current.handlePointerMove(fakePointerEvent({ clientX: -50, clientY: 0, pointerId: 1 })));
      act(() => result.current.handlePointerMove(fakePointerEvent({ clientX: 50, clientY: 0, pointerId: 1 })));
      act(() => result.current.handlePointerMove(fakePointerEvent({ clientX: -50, clientY: 0, pointerId: 1 })));
      act(() => result.current.handlePointerMove(fakePointerEvent({ clientX: 30, clientY: 0, pointerId: 1 })));

      // Every move is computed from the gesture's fixed start position, not
      // accumulated from the previous move, so rapid reversal must land
      // exactly at startX + last delta, never drift.
      const [patch] = onChange.mock.calls.at(-1);
      expect(patch.x).toBeCloseTo(43, 5);
    });
  });

  describe("multi-touch", () => {
    it("ignores a second pointer starting a drag on the same element while a gesture is active", () => {
      const { result, onChange } = setup({ x: 10, y: 10, w: 20, h: 10 });

      act(() => result.current.beginDrag(fakePointerEvent({ clientX: 0, clientY: 0, pointerId: 1 })));
      // A second finger touches down on the same element before the first
      // releases - must not steal/overwrite the active gesture.
      act(() => result.current.beginDrag(fakePointerEvent({ clientX: 500, clientY: 500, pointerId: 2 })));

      // Pointer 2's move must be ignored (wrong pointerId for the active gesture).
      onChange.mockClear();
      act(() => result.current.handlePointerMove(fakePointerEvent({ clientX: 600, clientY: 500, pointerId: 2 })));
      expect(onChange).not.toHaveBeenCalled();

      // Pointer 1 (the original gesture owner) still drives the element correctly.
      act(() => result.current.handlePointerMove(fakePointerEvent({ clientX: 100, clientY: 0, pointerId: 1 })));
      expect(onChange).toHaveBeenCalledTimes(1);
      const [patch] = onChange.mock.calls.at(-1);
      expect(patch.x).toBeCloseTo(20, 5); // 10 + 10% from +100px over 1000px width
    });

    it("lets a new pointer begin a gesture once the previous one has ended", () => {
      const { result, onChange, element } = setup({ x: 10, y: 10, w: 20, h: 10 });

      act(() => result.current.beginDrag(fakePointerEvent({ clientX: 0, clientY: 0, pointerId: 1 })));
      act(() => result.current.handlePointerUp(fakePointerEvent({ clientX: 0, clientY: 0, pointerId: 1 })));
      expect(result.current.isGestureActive()).toBe(false);

      onChange.mockClear();
      act(() => result.current.beginDrag(fakePointerEvent({ clientX: 0, clientY: 0, pointerId: 2 })));
      act(() => result.current.handlePointerMove(fakePointerEvent({ clientX: 100, clientY: 0, pointerId: 2 })));
      expect(onChange).toHaveBeenCalledTimes(1);
      void element;
    });

    it("ignores a pointerUp for a pointer that isn't the active gesture's owner", () => {
      const { result, onGestureEnd } = setup({ x: 10, y: 10, w: 20, h: 10 });

      act(() => result.current.beginDrag(fakePointerEvent({ clientX: 0, clientY: 0, pointerId: 1 })));
      act(() => result.current.handlePointerUp(fakePointerEvent({ clientX: 0, clientY: 0, pointerId: 99 })));

      expect(onGestureEnd).not.toHaveBeenCalled();
      expect(result.current.isGestureActive()).toBe(true);
    });
  });

  describe("resize", () => {
    it("respects MIN_SIZE_PCT when shrinking past the minimum", () => {
      const { result, onChange } = setup({ x: 10, y: 10, w: 10, h: 10 });

      act(() => result.current.beginResize(fakePointerEvent({ clientX: 0, clientY: 0, pointerId: 1 }), "bottom-right"));
      act(() => result.current.handlePointerMove(fakePointerEvent({ clientX: -9000, clientY: -9000, pointerId: 1 })));

      const [patch] = onChange.mock.calls.at(-1);
      expect(patch.w).toBeGreaterThanOrEqual(MIN_SIZE_PCT);
      expect(patch.h).toBeGreaterThanOrEqual(MIN_SIZE_PCT);
    });

    it("locks aspect ratio for an aspect-locked type (image) dragging a corner handle", () => {
      const { result, onChange } = setup({ type: "image", x: 10, y: 10, w: 20, h: 10 });

      act(() => result.current.beginResize(fakePointerEvent({ clientX: 0, clientY: 0, pointerId: 1 }), "bottom-right"));
      act(() => result.current.handlePointerMove(fakePointerEvent({ clientX: 100, clientY: 0, pointerId: 1 })));

      const [patch] = onChange.mock.calls.at(-1);
      // aspect = 20/10 = 2, so h should track w/2.
      expect(patch.h).toBeCloseTo(patch.w / 2, 3);
    });
  });

  describe("rotate", () => {
    it("normalizes rotation into [0, 360)", () => {
      const { result, onChange } = setup({ x: 40, y: 40, w: 20, h: 20, rotation: 350 });

      // Center is at (50%, 50%) of the 1000x600 rect -> (500, 300).
      act(() => result.current.beginRotate(fakePointerEvent({ clientX: 600, clientY: 300, pointerId: 1 })));
      // Rotate further past 360.
      act(() => result.current.handlePointerMove(fakePointerEvent({ clientX: 500, clientY: 200, pointerId: 1 })));

      const [patch] = onChange.mock.calls.at(-1);
      expect(patch.rotation).toBeGreaterThanOrEqual(0);
      expect(patch.rotation).toBeLessThan(360);
    });
  });

  describe("gesture guard", () => {
    it("ignores a right/middle-click drag start", () => {
      const { result, onChange } = setup();
      act(() => result.current.beginDrag(fakePointerEvent({ clientX: 0, clientY: 0, pointerId: 1, button: 2 })));
      expect(result.current.isGestureActive()).toBe(false);

      act(() => result.current.handlePointerMove(fakePointerEvent({ clientX: 50, clientY: 0, pointerId: 1 })));
      expect(onChange).not.toHaveBeenCalled();
    });

    it("handlePointerMove with no active gesture is a no-op", () => {
      const { result, onChange } = setup();
      act(() => result.current.handlePointerMove(fakePointerEvent({ clientX: 50, clientY: 0, pointerId: 1 })));
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
