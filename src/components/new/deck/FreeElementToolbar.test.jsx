import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { FreeElementToolbar } from "./FreeElementToolbar";

describe("FreeElementToolbar", () => {
  it("calls onBringForward/onSendBackward/onDuplicate/onDelete on their respective clicks", () => {
    const onDuplicate = vi.fn();
    const onDelete = vi.fn();
    const onBringForward = vi.fn();
    const onSendBackward = vi.fn();
    const { getByTitle } = render(
      <FreeElementToolbar
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onBringForward={onBringForward}
        onSendBackward={onSendBackward}
      />
    );

    fireEvent.click(getByTitle("Bring forward"));
    fireEvent.click(getByTitle("Send backward"));
    fireEvent.click(getByTitle("Duplicate"));
    fireEvent.click(getByTitle("Delete"));

    expect(onBringForward).toHaveBeenCalledTimes(1);
    expect(onSendBackward).toHaveBeenCalledTimes(1);
    expect(onDuplicate).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("stops propagation of pointerdown so a drag on the parent element doesn't start", () => {
    const parentHandler = vi.fn();
    const { container } = render(
      <div onPointerDown={parentHandler}>
        <FreeElementToolbar onDuplicate={() => {}} onDelete={() => {}} onBringForward={() => {}} onSendBackward={() => {}} />
      </div>
    );
    const toolbar = container.querySelector('[data-free-element-toolbar="true"]');
    fireEvent.pointerDown(toolbar);
    // The toolbar's own onPointerDown calls event.stopPropagation() so a
    // pointerdown here (e.g. to duplicate) doesn't also bubble up and start
    // the parent FreeElement's drag gesture.
    expect(parentHandler).not.toHaveBeenCalled();
  });
});
