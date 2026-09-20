import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BackgroundPicker } from "./BackgroundPicker";

const deckDefault = { kind: "solid", color: "#111111" };

describe("BackgroundPicker", () => {
  it("shows the deck default as active and the preview matches it when there is no override", () => {
    render(<BackgroundPicker value={null} deckDefault={deckDefault} onChange={() => {}} onUseDefault={() => {}} />);
    expect(screen.getByRole("button", { name: "Theme default" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("background-preview")).toHaveStyle({ backgroundColor: "#111111" });
  });

  it("calls onUseDefault when the Theme default button is clicked", () => {
    const onUseDefault = vi.fn();
    render(
      <BackgroundPicker
        value={{ kind: "solid", color: "#ff0000" }}
        deckDefault={deckDefault}
        onChange={() => {}}
        onUseDefault={onUseDefault}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Theme default" }));
    expect(onUseDefault).toHaveBeenCalledTimes(1);
  });

  it("switching kind produces a full SlideBackground object of that kind via onChange", () => {
    const onChange = vi.fn();
    render(<BackgroundPicker value={null} deckDefault={deckDefault} onChange={onChange} onUseDefault={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Gradient" }));
    expect(onChange).toHaveBeenCalledWith({ kind: "gradient", stops: ["#0b2d2b", "#062421"], angle: 180, overlay: undefined });
  });

  it("editing the solid color patches only the color field", () => {
    const onChange = vi.fn();
    render(
      <BackgroundPicker
        value={{ kind: "solid", color: "#ff0000" }}
        deckDefault={deckDefault}
        onChange={onChange}
        onUseDefault={() => {}}
      />
    );
    fireEvent.change(screen.getByLabelText("Background color"), { target: { value: "#00ff00" } });
    expect(onChange).toHaveBeenCalledWith({ kind: "solid", color: "#00ff00" });
  });

  it("setting an overlay color/opacity produces a real overlay object, applied over any kind", () => {
    const onChange = vi.fn();
    render(
      <BackgroundPicker
        value={{ kind: "image", url: "https://x/y.png", fit: "cover" }}
        deckDefault={deckDefault}
        onChange={onChange}
        onUseDefault={() => {}}
      />
    );
    fireEvent.change(screen.getByLabelText("Overlay opacity"), { target: { value: "0.6" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "image", overlay: { color: "#000000", opacity: 0.6 } })
    );
  });

  it("does not show overlay controls for a solid background", () => {
    render(
      <BackgroundPicker
        value={{ kind: "solid", color: "#fff" }}
        deckDefault={deckDefault}
        onChange={() => {}}
        onUseDefault={() => {}}
      />
    );
    expect(screen.queryByText("Overlay")).toBeNull();
  });

  it("renders a video element in the preview for a media/video background", () => {
    render(
      <BackgroundPicker
        value={{ kind: "media", type: "video", url: "https://x/bg.mp4" }}
        deckDefault={deckDefault}
        onChange={() => {}}
        onUseDefault={() => {}}
      />
    );
    expect(screen.getByTestId("background-preview").querySelector("video")).toHaveAttribute("src", "https://x/bg.mp4");
  });

  it("removing an overlay clears it via onChange without touching the rest of the background", () => {
    const onChange = vi.fn();
    render(
      <BackgroundPicker
        value={{ kind: "image", url: "https://x/y.png", fit: "cover", overlay: { color: "#000", opacity: 0.5 } }}
        deckDefault={deckDefault}
        onChange={onChange}
        onUseDefault={() => {}}
      />
    );
    fireEvent.click(screen.getByText("Remove"));
    expect(onChange).toHaveBeenCalledWith({ kind: "image", url: "https://x/y.png", fit: "cover" });
  });
});
