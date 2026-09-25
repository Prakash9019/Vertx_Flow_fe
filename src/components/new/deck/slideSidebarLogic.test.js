import { describe, it, expect } from "vitest";
import { reorderedIndexOf, indexAfterDelete, indexAfterInsert } from "./slideSidebarLogic";

const slides = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];

describe("reorderedIndexOf", () => {
  it("tracks a slide moved earlier in the list", () => {
    expect(reorderedIndexOf(slides, 3, 0, "d")).toBe(0);
  });

  it("tracks a slide unaffected by someone else's reorder", () => {
    // Move "a" (0) to index 2; "c" was at 2, shifts to 1.
    expect(reorderedIndexOf(slides, 0, 2, "c")).toBe(1);
  });

  it("tracks the moved slide itself landing at its target index", () => {
    expect(reorderedIndexOf(slides, 1, 3, "b")).toBe(3);
  });
});

describe("indexAfterDelete", () => {
  it("keeps the same numeric index when deleting the current slide, unless it was last", () => {
    expect(indexAfterDelete(1, 1, 4)).toBe(1); // deleting b (current), c shifts into slot 1
  });

  it("clamps to the new last index when deleting the current, last slide", () => {
    expect(indexAfterDelete(3, 3, 4)).toBe(2); // deleting d (current, last of 4) -> new last is 2
  });

  it("shifts the current index down by one when a slide before it is deleted", () => {
    expect(indexAfterDelete(0, 2, 4)).toBe(1);
  });

  it("leaves the current index unchanged when a slide after it is deleted", () => {
    expect(indexAfterDelete(3, 1, 4)).toBe(1);
  });
});

describe("indexAfterInsert", () => {
  it("returns the index right after the target slide", () => {
    expect(indexAfterInsert(slides, "b")).toBe(2);
  });

  it("falls back to the end of the list when the target isn't found", () => {
    expect(indexAfterInsert(slides, "missing")).toBe(4);
  });
});
