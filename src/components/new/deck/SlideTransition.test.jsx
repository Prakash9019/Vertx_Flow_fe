import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { SlideTransition } from "./SlideTransition";

function renderSlideLabel(slide) {
  return <div data-testid={`slide-${slide.id}`}>{slide.label}</div>;
}

describe("SlideTransition", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders only the current slide on first mount, with no exit layer", () => {
    render(
      <SlideTransition slide={{ id: "s1", label: "Slide One" }} render={renderSlideLabel} />
    );
    expect(screen.getByTestId("slide-s1")).toBeInTheDocument();
    expect(screen.queryByTestId("slide-transition-exit")).not.toBeInTheDocument();
    expect(screen.getByTestId("slide-transition-enter")).toBeInTheDocument();
  });

  it("crossfades on navigation: keeps the outgoing slide mounted briefly, then drops it", () => {
    const { rerender } = render(
      <SlideTransition slide={{ id: "s1", label: "Slide One" }} render={renderSlideLabel} />
    );

    rerender(<SlideTransition slide={{ id: "s2", label: "Slide Two" }} render={renderSlideLabel} />);

    // Both slides are present immediately after navigation - the outgoing
    // one fading out, the incoming one fading in.
    expect(screen.getByTestId("slide-s1")).toBeInTheDocument();
    expect(screen.getByTestId("slide-s2")).toBeInTheDocument();
    expect(screen.getByTestId("slide-transition-exit")).toBeInTheDocument();

    // After the transition window elapses, the outgoing slide unmounts and
    // only the new one remains.
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.queryByTestId("slide-s1")).not.toBeInTheDocument();
    expect(screen.getByTestId("slide-s2")).toBeInTheDocument();
    expect(screen.queryByTestId("slide-transition-exit")).not.toBeInTheDocument();
  });

  it("does not crossfade when the same slide's content changes (same id, new object)", () => {
    const { rerender } = render(
      <SlideTransition slide={{ id: "s1", label: "Hello" }} render={renderSlideLabel} />
    );

    rerender(<SlideTransition slide={{ id: "s1", label: "Hello, edited" }} render={renderSlideLabel} />);

    // No exit layer should ever appear for an in-place content edit - this
    // is the case that fires on every keystroke, and it must not fight
    // RichText's DOM/selection state with a crossfade.
    expect(screen.queryByTestId("slide-transition-exit")).not.toBeInTheDocument();
    expect(screen.getByText("Hello, edited")).toBeInTheDocument();
  });

  it("applies opacity/transform transition styles to the enter and exit layers during a real navigation", () => {
    const { rerender } = render(
      <SlideTransition slide={{ id: "s1", label: "Slide One" }} render={renderSlideLabel} />
    );

    rerender(<SlideTransition slide={{ id: "s2", label: "Slide Two" }} render={renderSlideLabel} />);

    const exitLayer = screen.getByTestId("slide-transition-exit");
    const enterLayer = screen.getByTestId("slide-transition-enter");

    expect(exitLayer.style.transition).toContain("opacity");
    expect(enterLayer.style.transition).toContain("opacity");
    // The outgoing layer must never intercept pointer events while fading.
    expect(exitLayer.style.pointerEvents).toBe("none");
  });

  it("skips the crossfade animation entirely when prefers-reduced-motion is set", () => {
    const matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = matchMediaMock;

    try {
      const { rerender } = render(
        <SlideTransition slide={{ id: "s1", label: "Slide One" }} render={renderSlideLabel} />
      );

      rerender(<SlideTransition slide={{ id: "s2", label: "Slide Two" }} render={renderSlideLabel} />);

      // No exit layer at all - the swap is instant, not animated, when the
      // user has asked the OS for reduced motion.
      expect(screen.queryByTestId("slide-transition-exit")).not.toBeInTheDocument();
      expect(screen.queryByTestId("slide-s1")).not.toBeInTheDocument();
      expect(screen.getByTestId("slide-s2")).toBeInTheDocument();

      const enterLayer = screen.getByTestId("slide-transition-enter");
      expect(enterLayer.style.transition).toBe("none");
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it("renders nothing when slide is null", () => {
    const { container } = render(<SlideTransition slide={null} render={renderSlideLabel} />);
    expect(container.firstChild).toBeNull();
  });
});
