import { useCallback, useReducer, useRef } from "react";

const HISTORY_LIMIT = 100;

const UNDO = "@@history/UNDO";
const REDO = "@@history/REDO";

// Wraps an arbitrary (state, action) => state reducer in a past/present/future
// history shape, without changing anything about how the wrapped reducer
// itself works. `dispatch(action, { coalesce, coalesceId })` lets a caller
// mark a burst of dispatches (e.g. every mousemove frame of a drag) as one
// logical undo step: consecutive dispatches sharing the same `coalesceId`
// with `coalesce: true` update `present` without pushing a new `past` entry.
// No feature dispatches with coalescing yet - this sub-project only wires up
// the mechanism so drag/resize/rotate can opt into it later.
function historyReducer(rawReducer) {
  return function (state, action) {
    switch (action.type) {
      case UNDO: {
        if (state.past.length === 0) return state;
        const previous = state.past[state.past.length - 1];
        return {
          past: state.past.slice(0, -1),
          present: previous,
          future: [state.present, ...state.future],
          lastCoalesceId: null,
        };
      }

      case REDO: {
        if (state.future.length === 0) return state;
        const next = state.future[0];
        return {
          past: [...state.past, state.present],
          present: next,
          future: state.future.slice(1),
          lastCoalesceId: null,
        };
      }

      default: {
        const nextPresent = rawReducer(state.present, action.payload);
        // The wrapped reducer ignores unknown/invalid actions by returning
        // the same state reference - don't record a no-op as a history step.
        if (nextPresent === state.present) return state;

        const canCoalesce =
          action.coalesce &&
          action.coalesceId != null &&
          action.coalesceId === state.lastCoalesceId;

        const past = canCoalesce
          ? state.past
          : [...state.past, state.present].slice(-HISTORY_LIMIT);

        return {
          past,
          present: nextPresent,
          future: [],
          lastCoalesceId: action.coalesce ? action.coalesceId ?? null : null,
        };
      }
    }
  };
}

// Public API: same `dispatch(action)` shape as plain useReducer, plus
// `undo`/`redo`/`canUndo`/`canRedo`. `present` is the live state, equivalent
// to what useReducer would have returned as `state`.
export function useDeckHistory(reducer, initialPresent) {
  const wrappedReducer = useRef(historyReducer(reducer)).current;
  const [state, rawDispatch] = useReducer(wrappedReducer, {
    past: [],
    present: initialPresent,
    future: [],
    lastCoalesceId: null,
  });

  const dispatch = useCallback((action, options) => {
    rawDispatch({
      payload: action,
      coalesce: !!options?.coalesce,
      coalesceId: options?.coalesceId ?? null,
    });
  }, []);

  const undo = useCallback(() => rawDispatch({ type: UNDO }), []);
  const redo = useCallback(() => rawDispatch({ type: REDO }), []);

  return {
    present: state.present,
    dispatch,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
