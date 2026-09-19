import { describe, it, expect } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MediaDescriptionLayout, defaultMediaDescriptionContent } from "./MediaDescriptionLayout";

describe("defaultMediaDescriptionContent", () => {
  it("returns heading, body, empty media, and left position", () => {
    expect(defaultMediaDescriptionContent()).toEqual({
      heading: "Product Overview",
      body: "<p>Describe what you've built.</p>",
      media: { url: "", type: "image" },
      mediaPosition: "left",
    });
  });
});

describe("MediaDescriptionLayout", () => {
  it("renders a placeholder when media.url is empty", () => {
    render(
      <MediaDescriptionLayout
        content={{ heading: "H", body: "<p>B</p>", media: { url: "", type: "image" }, mediaPosition: "left" }}
        onChangeContent={() => {}}
      />
    );
    expect(screen.getByTestId("media-placeholder")).toBeInTheDocument();
  });

  it("renders an img when media.type is image and url is set", () => {
    // The image is decorative (alt=""), so it has no "img" role - query the element.
    const { container } = render(
      <MediaDescriptionLayout
        content={{ heading: "H", body: "<p>B</p>", media: { url: "https://example.com/a.png", type: "image" }, mediaPosition: "left" }}
        onChangeContent={() => {}}
      />
    );
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", "https://example.com/a.png");
    expect(img).toHaveAttribute("alt", "");
  });

  it("puts the media column first when mediaPosition is left and last when right", () => {
    const { container: leftContainer } = render(
      <MediaDescriptionLayout
        content={{ heading: "H", body: "<p>B</p>", media: { url: "", type: "image" }, mediaPosition: "left" }}
        onChangeContent={() => {}}
      />
    );
    expect(leftContainer.querySelector('[data-col="media"]')).toBe(leftContainer.querySelector(".flex > *:first-child"));

    cleanup();

    const { container: rightContainer } = render(
      <MediaDescriptionLayout
        content={{ heading: "H", body: "<p>B</p>", media: { url: "", type: "image" }, mediaPosition: "right" }}
        onChangeContent={() => {}}
      />
    );
    expect(rightContainer.querySelector('[data-col="media"]')).toBe(rightContainer.querySelector(".flex > *:last-child"));
  });
});
