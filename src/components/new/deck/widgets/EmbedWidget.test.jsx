import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmbedWidget } from "./EmbedWidget";

describe("EmbedWidget", () => {
  it("renders a URL input placeholder when src is empty", () => {
    render(<EmbedWidget element={{ props: { src: "" } }} onReplaceSrc={() => {}} />);
    expect(screen.getByPlaceholderText(/embed url/i)).toBeInTheDocument();
  });

  it("calls onReplaceSrc with the typed URL on submit", () => {
    const onReplaceSrc = vi.fn();
    render(<EmbedWidget element={{ props: { src: "" } }} onReplaceSrc={onReplaceSrc} />);

    fireEvent.change(screen.getByPlaceholderText(/embed url/i), { target: { value: "https://example.com/embed" } });
    fireEvent.click(screen.getByText(/embed/i, { selector: "button" }));

    expect(onReplaceSrc).toHaveBeenCalledWith("https://example.com/embed");
  });

  it("renders an iframe once src is set", () => {
    const { container } = render(<EmbedWidget element={{ props: { src: "https://example.com/embed" } }} onReplaceSrc={() => {}} />);
    const iframe = container.querySelector("iframe");
    expect(iframe).toHaveAttribute("src", "https://example.com/embed");
  });
});
