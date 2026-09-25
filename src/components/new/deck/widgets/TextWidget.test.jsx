import React from "react";
import { describe, it, expect } from "vitest";
import { render, act, fireEvent } from "@testing-library/react";
import { TextWidget } from "./TextWidget";

describe("TextWidget", () => {
  it("seeds the DOM from element.props.html", () => {
    const { container } = render(
      <TextWidget element={{ props: { html: "<p>Hello</p>" } }} editing={false} onCommit={() => {}} />
    );
    expect(container.firstChild.innerHTML).toBe("<p>Hello</p>");
  });

  it("commits the edited html on blur and updates its own last-known value", () => {
    let committed = null;
    const { container } = render(
      <TextWidget element={{ props: { html: "<p>A</p>" } }} editing onCommit={(html) => (committed = html)} />
    );
    const div = container.firstChild;
    act(() => {
      div.innerHTML = "<p>B</p>";
    });
    fireEvent.blur(div);
    expect(committed).toBe("<p>B</p>");
  });

  it("does not disturb the DOM when props.html changes to echo its own just-committed edit", () => {
    const { container, rerender } = render(
      <TextWidget element={{ props: { html: "<p>A</p>" } }} editing={false} onCommit={() => {}} />
    );
    const div = container.firstChild;
    act(() => {
      div.innerHTML = "<p>B</p>";
    });
    // Parent state catches up to the just-typed value (what a real commit ->
    // reducer -> re-render cycle produces).
    rerender(<TextWidget element={{ props: { html: "<p>B</p>" } }} editing={false} onCommit={() => {}} />);
    expect(div.innerHTML).toBe("<p>B</p>");
  });

  it("resyncs the DOM when props.html reverts externally while mounted (undo/redo regression, roadmap #13)", () => {
    const { container, rerender } = render(
      <TextWidget element={{ props: { html: "<p>A</p>" } }} editing={false} onCommit={() => {}} />
    );
    const div = container.firstChild;

    // User edits and the parent's state catches up to "B".
    act(() => {
      div.innerHTML = "<p>B</p>";
    });
    rerender(<TextWidget element={{ props: { html: "<p>B</p>" } }} editing={false} onCommit={() => {}} />);
    expect(div.innerHTML).toBe("<p>B</p>");

    // Undo reverts the store's element.props.html without remounting this
    // widget (FreeElementLayer keys on element.id, unaffected by undo).
    rerender(<TextWidget element={{ props: { html: "<p>A</p>" } }} editing={false} onCommit={() => {}} />);
    expect(div.innerHTML).toBe("<p>A</p>");
  });

  it("does not resync mid-edit even if props.html changes while editing is true", () => {
    const { container, rerender } = render(
      <TextWidget element={{ props: { html: "<p>A</p>" } }} editing onCommit={() => {}} />
    );
    const div = container.firstChild;
    act(() => {
      div.innerHTML = "<p>user is mid-keystroke</p>";
    });
    // Something external changes props.html while the user is still editing.
    rerender(<TextWidget element={{ props: { html: "<p>A</p>" } }} editing onCommit={() => {}} />);
    expect(div.innerHTML).toBe("<p>user is mid-keystroke</p>");
  });

  it("sets contentEditable based on the editing prop", () => {
    const editing = render(<TextWidget element={{ props: { html: "<p>A</p>" } }} editing onCommit={() => {}} />);
    expect(editing.container.firstChild.getAttribute("contenteditable")).toBe("true");

    const notEditing = render(
      <TextWidget element={{ props: { html: "<p>A</p>" } }} editing={false} onCommit={() => {}} />
    );
    expect(notEditing.container.firstChild.getAttribute("contenteditable")).toBe("false");
  });
});
