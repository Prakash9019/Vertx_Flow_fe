import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDeckHistory } from "./useDeckHistory";

function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "NOOP":
      return state;
    default:
      return state;
  }
}

describe("useDeckHistory", () => {
  it("undoes and redoes a dispatched action", () => {
    const { result } = renderHook(() => useDeckHistory(counterReducer, { count: 0 }));

    act(() => result.current.dispatch({ type: "INCREMENT" }));
    expect(result.current.present.count).toBe(1);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);

    act(() => result.current.undo());
    expect(result.current.present.count).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);

    act(() => result.current.redo());
    expect(result.current.present.count).toBe(1);
    expect(result.current.canRedo).toBe(false);
  });

  it("clears future once a new action is dispatched after an undo", () => {
    const { result } = renderHook(() => useDeckHistory(counterReducer, { count: 0 }));

    act(() => result.current.dispatch({ type: "INCREMENT" }));
    act(() => result.current.dispatch({ type: "INCREMENT" }));
    act(() => result.current.undo());
    expect(result.current.canRedo).toBe(true);

    act(() => result.current.dispatch({ type: "INCREMENT" }));
    expect(result.current.canRedo).toBe(false);
    expect(result.current.present.count).toBe(2);
  });

  it("does not create a history entry for a no-op action", () => {
    const { result } = renderHook(() => useDeckHistory(counterReducer, { count: 0 }));

    act(() => result.current.dispatch({ type: "NOOP" }));
    expect(result.current.canUndo).toBe(false);
  });

  it("coalesces consecutive dispatches sharing a coalesceId into one undo step", () => {
    const { result } = renderHook(() => useDeckHistory(counterReducer, { count: 0 }));

    act(() => result.current.dispatch({ type: "INCREMENT" }, { coalesce: true, coalesceId: "drag-1" }));
    act(() => result.current.dispatch({ type: "INCREMENT" }, { coalesce: true, coalesceId: "drag-1" }));
    act(() => result.current.dispatch({ type: "INCREMENT" }, { coalesce: true, coalesceId: "drag-1" }));
    expect(result.current.present.count).toBe(3);

    act(() => result.current.undo());
    expect(result.current.present.count).toBe(0);
  });

  it("undo/redo are no-ops at the boundaries", () => {
    const { result } = renderHook(() => useDeckHistory(counterReducer, { count: 0 }));

    act(() => result.current.undo());
    expect(result.current.present.count).toBe(0);

    act(() => result.current.redo());
    expect(result.current.present.count).toBe(0);
  });
});
