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
    this.html = {
      get: () => el.innerHTML,
      set: (html) => {
        el.innerHTML = html;
      },
    };
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

  it("does not re-sync the DOM when value changes only because the parent echoed our own edit back", async () => {
    function Harness() {
      const [value, setValue] = React.useState("<p>A</p>");
      return <RichText value={value} onChange={setValue} />;
    }
    render(<Harness />);
    await waitFor(() => expect(instances).toHaveLength(1));

    const node = instances[0].el;
    typeInto(instances[0], "<p>B</p>");
    // The parent's state now equals "<p>B</p>" too, so React re-renders this
    // component with value="<p>B</p>" - the same string this component itself
    // just emitted. That must NOT trigger a resync (it would fight the live
    // caret on every keystroke, the exact bug the seed-once design avoided).
    await waitFor(() => expect(node.innerHTML).toBe("<p>B</p>"));
  });

  it("resyncs the DOM when value reverts externally while mounted (undo/redo regression, roadmap #13)", async () => {
    const { rerender } = render(<RichText value="<p>A</p>" onChange={() => {}} />);
    await waitFor(() => expect(instances).toHaveLength(1));

    // User types "B" - the live DOM (and Froala's internal state) now says B,
    // and the parent's state (dispatch -> deckReducer) catches up to match,
    // which is what actually feeds a new `value` prop back in here.
    typeInto(instances[0], "<p>B</p>");
    rerender(<RichText value="<p>B</p>" onChange={() => {}} />);
    expect(instances[0].el.innerHTML).toBe("<p>B</p>");

    // Undo reverts the deck's `present` state without remounting this field
    // (SlideCanvas keys on `slide.id`, which doesn't change on undo) - the
    // parent re-renders with the OLD value, which must now win visibly.
    rerender(<RichText value="<p>A</p>" onChange={() => {}} />);

    await waitFor(() => expect(instances[0].el.innerHTML).toBe("<p>A</p>"));
  });

  it("falls back to a raw innerHTML write on resync when html.set is unavailable", async () => {
    const { rerender } = render(<RichText value="<p>A</p>" onChange={() => {}} />);
    await waitFor(() => expect(instances).toHaveLength(1));
    typeInto(instances[0], "<p>B</p>");
    rerender(<RichText value="<p>B</p>" onChange={() => {}} />);
    // Simulate an editor instance whose html.set API isn't available.
    delete instances[0].html.set;

    rerender(<RichText value="<p>A</p>" onChange={() => {}} />);

    await waitFor(() => expect(instances[0].el.innerHTML).toBe("<p>A</p>"));
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
