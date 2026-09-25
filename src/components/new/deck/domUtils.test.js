import { describe, it, expect } from "vitest";
import { isEditableTarget } from "./domUtils";

describe("isEditableTarget", () => {
  it("returns false for null/undefined target", () => {
    expect(isEditableTarget(null)).toBe(false);
    expect(isEditableTarget(undefined)).toBe(false);
  });

  it("returns false for a target without a closest function (e.g. window/document)", () => {
    expect(isEditableTarget({})).toBe(false);
    expect(isEditableTarget(document)).toBe(false);
  });

  it("returns true for a contenteditable element", () => {
    const div = document.createElement("div");
    div.setAttribute("contenteditable", "true");
    document.body.appendChild(div);
    expect(isEditableTarget(div)).toBe(true);
    div.remove();
  });

  it("returns true for a descendant of a contenteditable element", () => {
    const div = document.createElement("div");
    div.setAttribute("contenteditable", "true");
    const span = document.createElement("span");
    div.appendChild(span);
    document.body.appendChild(div);
    expect(isEditableTarget(span)).toBe(true);
    div.remove();
  });

  it("returns true for an input element", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    expect(isEditableTarget(input)).toBe(true);
    input.remove();
  });

  it("returns true for a textarea element", () => {
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    expect(isEditableTarget(textarea)).toBe(true);
    textarea.remove();
  });

  it("returns true for a Froala .fr-element", () => {
    const div = document.createElement("div");
    div.className = "fr-element";
    document.body.appendChild(div);
    expect(isEditableTarget(div)).toBe(true);
    div.remove();
  });

  it("returns false for an ordinary non-editable element", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    expect(isEditableTarget(div)).toBe(false);
    div.remove();
  });

  it("returns false for a contenteditable=\"false\" element", () => {
    const div = document.createElement("div");
    div.setAttribute("contenteditable", "false");
    document.body.appendChild(div);
    expect(isEditableTarget(div)).toBe(false);
    div.remove();
  });
});
