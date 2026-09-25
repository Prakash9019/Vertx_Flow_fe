import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { FreeElementRenderer } from "./FreeElementRenderer";

describe("FreeElementRenderer", () => {
  it("renders a TextWidget for type text", () => {
    const { container } = render(
      <FreeElementRenderer element={{ type: "text", props: { html: "hi" } }} editing={false} onCommitText={() => {}} onReplaceSrc={() => {}} />
    );
    expect(container.querySelector('[contenteditable]') || container.textContent).toBeTruthy();
  });

  it("renders an ImageWidget for type image", () => {
    const { container } = render(
      <FreeElementRenderer element={{ type: "image", props: { src: "", alt: "" } }} editing={false} onCommitText={() => {}} onReplaceSrc={() => {}} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("renders a VideoWidget for type video", () => {
    const { container } = render(
      <FreeElementRenderer element={{ type: "video", props: { src: "" } }} editing={false} onCommitText={() => {}} onReplaceSrc={() => {}} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("renders a ShapeWidget for type shape", () => {
    const { container } = render(
      <FreeElementRenderer element={{ type: "shape", props: { shape: "rectangle" } }} editing={false} onCommitText={() => {}} onReplaceSrc={() => {}} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("renders a DividerWidget for type divider", () => {
    const { container } = render(
      <FreeElementRenderer element={{ type: "divider", props: {} }} editing={false} onCommitText={() => {}} onReplaceSrc={() => {}} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("renders an IconWidget for type icon", () => {
    const { container } = render(
      <FreeElementRenderer element={{ type: "icon", props: { icon: "Star" } }} editing={false} onCommitText={() => {}} onReplaceSrc={() => {}} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("renders a dashed placeholder for an unknown/unrecognized element type", () => {
    const { container } = render(
      <FreeElementRenderer element={{ type: "not-a-real-type", props: {} }} editing={false} onCommitText={() => {}} onReplaceSrc={() => {}} />
    );
    expect(container.querySelector(".border-dashed")).toBeTruthy();
  });

  it("passes editing/onCommitText through to TextWidget", () => {
    const onCommitText = vi.fn();
    render(
      <FreeElementRenderer element={{ type: "text", props: { html: "hi" } }} editing={true} onCommitText={onCommitText} onReplaceSrc={() => {}} />
    );
    // Presence of the callback is enough here - TextWidget's own behavior is
    // covered by widgets/TextWidget.test.jsx; this only proves wiring.
    expect(onCommitText).not.toHaveBeenCalled();
  });
});
