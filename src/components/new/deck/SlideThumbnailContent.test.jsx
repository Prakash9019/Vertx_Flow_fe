import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SlideThumbnailContent, ThumbnailFreeElement } from "./SlideThumbnailContent";

describe("SlideThumbnailContent", () => {
  it("renders null for an unknown layout", () => {
    const { container } = render(<SlideThumbnailContent layout="not-a-real-layout" content={{}} />);
    expect(container.firstChild).toBeNull();
  });

  it("title: renders subtitle only when present", () => {
    const withSubtitle = render(<SlideThumbnailContent layout="title" content={{ title: "T", subtitle: "S" }} />);
    expect(withSubtitle.container.textContent).toContain("S");

    const noSubtitle = render(<SlideThumbnailContent layout="title" content={{ title: "T", subtitle: "" }} />);
    expect(noSubtitle.container.textContent).not.toContain("S");
  });

  it("problem: renders heading and body", () => {
    const { container } = render(<SlideThumbnailContent layout="problem" content={{ heading: "H", body: "B" }} />);
    expect(container.textContent).toContain("H");
    expect(container.textContent).toContain("B");
  });

  describe("media-description", () => {
    it("renders an image when media.url is present, and orders text/media by mediaPosition=left", () => {
      const { container } = render(
        <SlideThumbnailContent
          layout="media-description"
          content={{ heading: "H", body: "B", mediaPosition: "left", media: { url: "http://x/y.png" } }}
        />
      );
      const img = container.querySelector("img");
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toBe("http://x/y.png");
      // media box should be the first child when mediaPosition is "left"
      expect(container.firstChild.firstChild).toBe(img.closest("img"));
    });

    it("renders a placeholder box when media.url is absent, ordered text-first when mediaPosition isn't left", () => {
      const { container } = render(
        <SlideThumbnailContent
          layout="media-description"
          content={{ heading: "H", body: "B", mediaPosition: "right", media: {} }}
        />
      );
      expect(container.querySelector("img")).toBeNull();
      expect(container.textContent).toContain("H");
    });
  });

  describe("media-3points", () => {
    it("renders up to 3 point titles and truncates a 4th", () => {
      const { container } = render(
        <SlideThumbnailContent
          layout="media-3points"
          content={{
            heading: "H",
            points: [{ title: "P1" }, { title: "P2" }, { title: "P3" }, { title: "P4" }],
          }}
        />
      );
      expect(container.textContent).toContain("P1");
      expect(container.textContent).toContain("P3");
      expect(container.textContent).not.toContain("P4");
    });

    it("handles missing points array gracefully", () => {
      const { container } = render(<SlideThumbnailContent layout="media-3points" content={{ heading: "H" }} />);
      expect(container.textContent).toContain("H");
    });

    it("renders an image when media.url is present", () => {
      const { container } = render(
        <SlideThumbnailContent layout="media-3points" content={{ heading: "H", media: { url: "http://x/y.png" }, points: [] }} />
      );
      expect(container.querySelector("img")).toBeTruthy();
    });
  });

  describe("metrics-grid", () => {
    it("renders each metric's value and label", () => {
      const { container } = render(
        <SlideThumbnailContent
          layout="metrics-grid"
          content={{ heading: "H", metrics: [{ value: "45%", label: "Growth" }] }}
        />
      );
      expect(container.textContent).toContain("45%");
      expect(container.textContent).toContain("Growth");
    });

    it("handles a missing metrics array gracefully", () => {
      const { container } = render(<SlideThumbnailContent layout="metrics-grid" content={{ heading: "H" }} />);
      expect(container.textContent).toContain("H");
    });
  });

  describe("team-grid", () => {
    it("renders a photo when photoUrl is present, and a placeholder circle otherwise", () => {
      const { container } = render(
        <SlideThumbnailContent
          layout="team-grid"
          content={{
            heading: "H",
            members: [
              { name: "Alice", photoUrl: "http://x/a.png" },
              { name: "Bob", photoUrl: "" },
            ],
          }}
        />
      );
      expect(container.querySelectorAll("img").length).toBe(1);
      expect(container.textContent).toContain("Alice");
      expect(container.textContent).toContain("Bob");
    });

    it("truncates to 3 members", () => {
      const { container } = render(
        <SlideThumbnailContent
          layout="team-grid"
          content={{ heading: "H", members: [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }] }}
        />
      );
      expect(container.textContent).toContain("A");
      expect(container.textContent).toContain("C");
      expect(container.textContent).not.toContain("D");
    });

    it("handles a missing members array gracefully", () => {
      const { container } = render(<SlideThumbnailContent layout="team-grid" content={{ heading: "H" }} />);
      expect(container.textContent).toContain("H");
    });
  });

  describe("cta", () => {
    it("renders the button label only when present", () => {
      const withButton = render(
        <SlideThumbnailContent layout="cta" content={{ heading: "H", body: "B", buttonLabel: "Go" }} />
      );
      expect(withButton.container.textContent).toContain("Go");

      const withoutButton = render(<SlideThumbnailContent layout="cta" content={{ heading: "H", body: "B" }} />);
      expect(withoutButton.container.textContent).not.toContain("Go");
    });
  });
});

describe("ThumbnailFreeElement", () => {
  it("renders text via dangerouslySetInnerHTML", () => {
    const { container } = render(<ThumbnailFreeElement element={{ type: "text", props: { html: "<b>hi</b>" } }} />);
    expect(container.querySelector("b")).toBeTruthy();
  });

  it("renders an empty text element without crashing", () => {
    const { container } = render(<ThumbnailFreeElement element={{ type: "text", props: {} }} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders an image when src is present, a placeholder otherwise", () => {
    const withSrc = render(<ThumbnailFreeElement element={{ type: "image", props: { src: "http://x/y.png" } }} />);
    expect(withSrc.container.querySelector("img")).toBeTruthy();

    const withoutSrc = render(<ThumbnailFreeElement element={{ type: "image", props: { src: "" } }} />);
    expect(withoutSrc.container.querySelector("img")).toBeNull();
  });

  it("renders a video when src is present, a placeholder otherwise", () => {
    const withSrc = render(<ThumbnailFreeElement element={{ type: "video", props: { src: "http://x/y.mp4" } }} />);
    expect(withSrc.container.querySelector("video")).toBeTruthy();

    const withoutSrc = render(<ThumbnailFreeElement element={{ type: "video", props: { src: "" } }} />);
    expect(withoutSrc.container.querySelector("video")).toBeNull();
  });

  it("renders shape/divider/icon via their real widgets", () => {
    const shape = render(<ThumbnailFreeElement element={{ type: "shape", props: { shape: "rectangle" } }} />);
    expect(shape.container.firstChild).toBeTruthy();

    const divider = render(<ThumbnailFreeElement element={{ type: "divider", props: {} }} />);
    expect(divider.container.firstChild).toBeTruthy();

    const icon = render(<ThumbnailFreeElement element={{ type: "icon", props: { icon: "Star" } }} />);
    expect(icon.container.firstChild).toBeTruthy();
  });

  it("renders nothing for an unknown element type", () => {
    const { container } = render(<ThumbnailFreeElement element={{ type: "not-a-real-type", props: {} }} />);
    expect(container.firstChild).toBeNull();
  });
});
