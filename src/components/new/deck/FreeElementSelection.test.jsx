import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { FreeElementSelection, SnapGuides } from "./FreeElementSelection";

describe("FreeElementSelection", () => {
  it("renders no resize handles when resizable is false", () => {
    const { container } = render(
      <FreeElementSelection resizable={false} rotatable={false} onResizeStart={() => {}} onRotateStart={() => {}} />
    );
    expect(container.querySelectorAll("[data-resize-handle]").length).toBe(0);
  });

  it("renders all 8 resize handles when resizable is true", () => {
    const { container } = render(
      <FreeElementSelection resizable={true} rotatable={false} onResizeStart={() => {}} onRotateStart={() => {}} />
    );
    expect(container.querySelectorAll("[data-resize-handle]").length).toBe(8);
  });

  it("does not render a rotate handle when rotatable is false", () => {
    const { container } = render(
      <FreeElementSelection resizable={true} rotatable={false} onResizeStart={() => {}} onRotateStart={() => {}} />
    );
    expect(container.querySelector("[data-rotate-handle]")).toBeNull();
  });

  it("renders a rotate handle when rotatable is true", () => {
    const { container } = render(
      <FreeElementSelection resizable={true} rotatable={true} onResizeStart={() => {}} onRotateStart={() => {}} />
    );
    expect(container.querySelector("[data-rotate-handle]")).toBeTruthy();
  });

  it("calls onResizeStart with the handle name on pointerdown", () => {
    const onResizeStart = vi.fn();
    const { container } = render(
      <FreeElementSelection resizable={true} rotatable={false} onResizeStart={onResizeStart} onRotateStart={() => {}} />
    );
    const handle = container.querySelector('[data-resize-handle="bottom-right"]');
    fireEvent.pointerDown(handle);
    expect(onResizeStart).toHaveBeenCalledTimes(1);
    expect(onResizeStart.mock.calls[0][1]).toBe("bottom-right");
  });

  it("calls onRotateStart on pointerdown of the rotate handle", () => {
    const onRotateStart = vi.fn();
    const { container } = render(
      <FreeElementSelection resizable={false} rotatable={true} onResizeStart={() => {}} onRotateStart={onRotateStart} />
    );
    fireEvent.pointerDown(container.querySelector("[data-rotate-handle]"));
    expect(onRotateStart).toHaveBeenCalledTimes(1);
  });
});

describe("SnapGuides", () => {
  it("renders nothing when guides is null", () => {
    const { container } = render(<SnapGuides guides={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when both x and y are null", () => {
    const { container } = render(<SnapGuides guides={{ x: null, y: null }} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders only a vertical guide when x is set and y is null", () => {
    const { container } = render(<SnapGuides guides={{ x: 50, y: null }} />);
    const children = container.querySelectorAll("div");
    expect(children.length).toBe(1);
  });

  it("renders only a horizontal guide when y is set and x is null", () => {
    const { container } = render(<SnapGuides guides={{ x: null, y: 50 }} />);
    const children = container.querySelectorAll("div");
    expect(children.length).toBe(1);
  });

  it("renders both guides when x and y are set", () => {
    const { container } = render(<SnapGuides guides={{ x: 0, y: 100 }} />);
    const children = container.querySelectorAll("div");
    expect(children.length).toBe(2);
  });

  it("treats x/y of 0 as a set value (falsy but not null)", () => {
    const { container } = render(<SnapGuides guides={{ x: 0, y: null }} />);
    expect(container.querySelectorAll("div").length).toBe(1);
  });
});
