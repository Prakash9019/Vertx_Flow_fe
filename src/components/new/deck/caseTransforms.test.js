import { describe, it, expect } from "vitest";
import { toUpperCase, toLowerCase, toTitleCase, toSentenceCase, CASE_TRANSFORMS } from "./caseTransforms";

describe("toUpperCase", () => {
  it("uppercases plain text", () => {
    expect(toUpperCase("hello world")).toBe("HELLO WORLD");
  });

  it("preserves HTML tags/attributes, only transforming text content", () => {
    expect(toUpperCase('<p>hello <b class="x">world</b></p>')).toBe('<p>HELLO <b class="x">WORLD</b></p>');
  });

  it("returns falsy input unchanged", () => {
    expect(toUpperCase("")).toBe("");
    expect(toUpperCase(null)).toBeNull();
  });
});

describe("toLowerCase", () => {
  it("lowercases plain text", () => {
    expect(toLowerCase("HELLO WORLD")).toBe("hello world");
  });

  it("preserves HTML structure", () => {
    expect(toLowerCase("<p>HELLO <b>WORLD</b></p>")).toBe("<p>hello <b>world</b></p>");
  });
});

describe("toTitleCase", () => {
  it("capitalizes the first letter of every word", () => {
    expect(toTitleCase("the quick brown fox")).toBe("The Quick Brown Fox");
  });

  it("normalizes existing mixed case within words", () => {
    expect(toTitleCase("hELLO wORLD")).toBe("Hello World");
  });

  it("preserves HTML structure across word boundaries split by tags", () => {
    expect(toTitleCase("<p>hello <b>world</b> again</p>")).toBe("<p>Hello <b>World</b> Again</p>");
  });
});

describe("toSentenceCase", () => {
  it("capitalizes the first letter of each sentence and lowercases the rest", () => {
    expect(toSentenceCase("HELLO world. THIS is a TEST. another one?")).toBe(
      "Hello world. This is a test. Another one?"
    );
  });

  it("capitalizes across a tag boundary mid-sentence", () => {
    expect(toSentenceCase("<p>hello <b>world</b>. next sentence.</p>")).toBe(
      "<p>Hello <b>world</b>. Next sentence.</p>"
    );
  });

  it("handles a single sentence with no terminal punctuation", () => {
    expect(toSentenceCase("HELLO WORLD")).toBe("Hello world");
  });

  it("returns falsy input unchanged", () => {
    expect(toSentenceCase("")).toBe("");
    expect(toSentenceCase(null)).toBeNull();
  });
});

describe("CASE_TRANSFORMS", () => {
  it("maps every dropdown option id to its transform function", () => {
    expect(CASE_TRANSFORMS.uppercase).toBe(toUpperCase);
    expect(CASE_TRANSFORMS.lowercase).toBe(toLowerCase);
    expect(CASE_TRANSFORMS.titlecase).toBe(toTitleCase);
    expect(CASE_TRANSFORMS.sentencecase).toBe(toSentenceCase);
  });
});
