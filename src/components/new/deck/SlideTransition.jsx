import React, { useEffect, useRef, useState } from "react";

// Roadmap #15 (slide/element animations). Approach: a lightweight CSS-transition
// crossfade, not a new animation library. `framer-motion`/`aos` already exist
// in this repo's deps (per docs/EDITOR-V2-STATUS.md §1e-9) but only for other,
// unrelated legacy screens (`App.jsx`, `screens/matchflow`, `Fundraising/*`,
// `NewEditor.jsx`) - nothing in `src/components/new/deck` uses either today.
// Pulling either in here would mean a second animation mechanism for this
// component tree and extra weight in `EditorPage.jsx`'s already
// route-code-split chunk (§1e-9), for an effect (opacity + a small translate)
// that plain CSS `transition` on two `position:absolute` layers does natively.
//
// Architecture constraint (task brief): `SlideCanvas` renders one slide at a
// time and other features (free-element selection clearing, RichText
// re-seeding) depend on it remounting `LayoutComponent` on `slide.id`
// (`SlideCanvas.jsx` `key={slide.id}` on `LayoutComponent`). This component
// does not touch that - it renders whatever `render(slide)` gives it (a full
// `<SlideCanvas slide={slide} .../>`) inside its own absolutely-positioned
// wrapper layers, so `SlideCanvas`'s internal remount keying is completely
// untouched. What's new here is *orchestration*: briefly rendering the
// outgoing slide's `SlideCanvas` alongside the incoming one so both can be
// faded via CSS, then dropping the outgoing one once the transition ends.

const TRANSITION_MS = 300;

function usePrefersReducedMotion() {
  const getInitial = () => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  };

  const [reduced, setReduced] = useState(getInitial);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;
    let mql;
    try {
      mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    } catch {
      return undefined;
    }
    const handleChange = (event) => setReduced(event.matches);
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handleChange);
      return () => mql.removeEventListener("change", handleChange);
    }
    if (typeof mql.addListener === "function") {
      // Safari < 14 / older jsdom polyfills.
      mql.addListener(handleChange);
      return () => mql.removeListener(handleChange);
    }
    return undefined;
  }, []);

  return reduced;
}

// `animate` false means "render fully visible, no transition" - used both for
// prefers-reduced-motion and for the very first mount (no outgoing slide to
// cross-fade against, so there's nothing to animate against).
function EnterLayer({ animate, children }) {
  const [visible, setVisible] = useState(!animate);

  useEffect(() => {
    if (!animate) return undefined;
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  return (
    <div
      data-testid="slide-transition-enter"
      className="absolute inset-0"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: animate ? `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease` : "none",
      }}
    >
      {children}
    </div>
  );
}

function ExitLayer({ animate, children }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!animate) return undefined;
    const id = requestAnimationFrame(() => setVisible(false));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  return (
    <div
      data-testid="slide-transition-exit"
      className="absolute inset-0"
      style={{
        opacity: animate && !visible ? 0 : 1,
        transform: animate && !visible ? "translateY(-10px)" : "translateY(0)",
        transition: animate ? `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease` : "none",
        // The outgoing slide is being navigated away from - it must never
        // intercept pointer events (drag/resize/rotate/click) while fading
        // out, both for correctness and so it can't be mistaken for the
        // active slide.
        pointerEvents: "none",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Crossfades between the previously-active slide and the newly-active one on
 * navigation. `slide` is the current slide object; `render(slide)` returns
 * the node to display for a given slide (the caller supplies this so it can
 * pass slide-specific props like selection state only to the active slide).
 *
 * Only a change in `slide.id` triggers a transition - an in-place content
 * edit on the same slide (a new slide object with the same `id`, which
 * happens on every keystroke/dispatch) just swaps `current` without
 * animating, so typing/dragging/resizing never gets caught mid-crossfade.
 */
export function SlideTransition({ slide, render, className = "" }) {
  const reducedMotion = usePrefersReducedMotion();
  const [current, setCurrent] = useState(slide ?? null);
  const [previous, setPrevious] = useState(null);
  const isFirstRender = useRef(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }
    if (!slide) {
      setCurrent(null);
      setPrevious(null);
      return undefined;
    }
    setCurrent((prevCurrent) => {
      if (prevCurrent && slide.id === prevCurrent.id) {
        // Same slide, content-only change (e.g. typing) - swap in place,
        // no crossfade, no `previous` layer.
        return slide;
      }
      if (reducedMotion) {
        setPrevious(null);
      } else if (prevCurrent) {
        setPrevious(prevCurrent);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setPrevious(null), TRANSITION_MS + 50);
      }
      return slide;
    });
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  if (!current) return null;

  const animate = Boolean(previous) && !reducedMotion;

  return (
    <div className={`relative w-full h-full ${className}`} data-testid="slide-transition">
      {previous && (
        <ExitLayer key={`exit-${previous.id}`} animate={animate}>
          {render(previous)}
        </ExitLayer>
      )}
      <EnterLayer key={`enter-${current.id}`} animate={animate}>
        {render(current)}
      </EnterLayer>
    </div>
  );
}
