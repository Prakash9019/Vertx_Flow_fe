import React, { useState } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import { RichText } from "./RichText";
import { Media3PointsLayout } from "./layouts/Media3PointsLayout";

/**
 * Minimal stand-in for Froala's real constructor API:
 *   new FroalaEditor(el, { events: { contentChanged } })
 * The instance exposes `html.get()` and we keep the registered event handlers
 * so a test can invoke `contentChanged` the way a real user edit would.
 */
function installFroalaStub() {
  const instances = [];
  function FakeFroalaEditor(el, options) {
    this.el = el;
    this.options = options;
    this.html = { get: () => el.innerHTML };
    this.destroy = () => {};
    instances.push(this);
  }
  window.FroalaEditor = FakeFroalaEditor;
  return instances;
}

function typeInto(instance, html) {
  instance.el.innerHTML = html;
  act(() => {
    instance.options.events.contentChanged.call(instance);
  });
}

describe("RichText", () => {
  it("renders the given value as HTML inside the requested element", () => {
    render(<RichText value="<b>Hello</b>" onChange={() => {}} as="h1" className="heading" />);
    const el = screen.getByText("Hello");
    expect(el.tagName).toBe("B");
    expect(el.closest("h1")).not.toBeNull();
    expect(el.closest("h1").className).toBe("heading");
  });

  it("does not throw when window.FroalaEditor is unavailable (e.g. in tests)", () => {
    expect(() =>
      render(<RichText value="<p>Text</p>" onChange={() => {}} as="div" />)
    ).not.toThrow();
  });

  it("forwards a style prop to the underlying element", () => {
    render(<RichText as="h1" className="text-5xl" style={{ fontFamily: "Georgia, serif" }} value="Hi" onChange={() => {}} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.style.fontFamily).toBe("Georgia, serif");
  });
});

describe("RichText with Froala present", () => {
  let instances;

  beforeEach(() => {
    instances = installFroalaStub();
  });

  afterEach(() => {
    delete window.FroalaEditor;
  });

  it("calls the NEWEST onChange prop, not the one captured at mount", async () => {
    const firstOnChange = vi.fn();
    const secondOnChange = vi.fn();

    const { rerender } = render(<RichText value="<p>A</p>" onChange={firstOnChange} />);
    await waitFor(() => expect(instances).toHaveLength(1));

    // Parent re-renders with a brand new callback identity (what happens every
    // time React state elsewhere changes).
    rerender(<RichText value="<p>A</p>" onChange={secondOnChange} />);

    typeInto(instances[0], "<p>B</p>");

    expect(secondOnChange).toHaveBeenCalledWith("<p>B</p>");
    expect(firstOnChange).not.toHaveBeenCalled();
  });

  it("does not re-write the live editor DOM when the value prop changes", async () => {
    const { rerender } = render(<RichText value="<p>A</p>" onChange={() => {}} />);
    await waitFor(() => expect(instances).toHaveLength(1));

    const node = instances[0].el;
    node.innerHTML = "<p>user typing</p>";
    rerender(<RichText value="<p>A</p>" onChange={() => {}} />);

    expect(node.innerHTML).toBe("<p>user typing</p>");
  });
});

describe("Media3PointsLayout editing through RichText (stale-closure regression)", () => {
  let instances;

  beforeEach(() => {
    instances = installFroalaStub();
  });

  afterEach(() => {
    delete window.FroalaEditor;
  });

  function Harness({ onPatch }) {
    const [content, setContent] = useState({
      heading: "Key Features",
      media: { url: "", type: "image" },
      points: [
        { title: "", body: "First" },
        { title: "", body: "Second" },
      ],
    });
    return (
      <Media3PointsLayout
        content={content}
        onChangeContent={(patch) => {
          onPatch(patch);
          setContent((prev) => ({ ...prev, ...patch }));
        }}
      />
    );
  }

  it("keeps edits to point 0 when point 1 is edited afterwards", async () => {
    const onPatch = vi.fn();
    render(<Harness onPatch={onPatch} />);

    // heading, point0 body, point1 body (titles are empty so no title editors)
    await waitFor(() => expect(instances).toHaveLength(3));

    typeInto(instances[1], "First EDITED");
    typeInto(instances[2], "Second EDITED");

    expect(onPatch).toHaveBeenCalledTimes(2);
    const lastPatch = onPatch.mock.calls[1][0];
    expect(lastPatch.points).toEqual([
      { title: "", body: "First EDITED" },
      { title: "", body: "Second EDITED" },
    ]);
  });
});
