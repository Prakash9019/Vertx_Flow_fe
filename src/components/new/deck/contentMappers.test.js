import { describe, it, expect } from "vitest";
import { identityMapper, paragraphToBulletsMapper, getContentMapper } from "./contentMappers";

describe("identityMapper", () => {
  it("returns the same content unchanged", () => {
    const content = { title: "Hello" };
    expect(identityMapper(content)).toBe(content);
  });
});

describe("paragraphToBulletsMapper", () => {
  it("splits an HTML paragraph body into bullet points", () => {
    const result = paragraphToBulletsMapper({
      heading: "The Problem",
      body: "<p>Teams lose context switching tools. Onboarding takes weeks. Support tickets pile up.</p>",
    });
    expect(result.heading).toBe("The Problem");
    expect(result.points).toEqual([
      { title: "", body: "Teams lose context switching tools" },
      { title: "", body: "Onboarding takes weeks" },
      { title: "", body: "Support tickets pile up." },
    ]);
    expect(result.media).toEqual({ url: "", type: "image" });
  });

  it("returns an empty points array and a default media when body is missing", () => {
    const result = paragraphToBulletsMapper({ heading: "The Problem" });
    expect(result).toEqual({ heading: "The Problem", points: [], media: { url: "", type: "image" } });
  });

  it("returns an empty points array and a default media when body is an empty string", () => {
    const result = paragraphToBulletsMapper({ heading: "The Problem", body: "" });
    expect(result).toEqual({ heading: "The Problem", points: [], media: { url: "", type: "image" } });
  });

  it("carries an existing media field through unchanged", () => {
    const media = { url: "https://example.com/a.png", type: "image" };
    const result = paragraphToBulletsMapper({ heading: "The Problem", body: "<p>Users churn.</p>", media });
    expect(result.media).toEqual(media);
  });
});

describe("getContentMapper", () => {
  it("returns the registered mapper for problem -> media-3points", () => {
    expect(getContentMapper("problem", "media-3points")).toBe(paragraphToBulletsMapper);
  });

  it("falls back to identityMapper for an unregistered pair", () => {
    expect(getContentMapper("title", "cta")).toBe(identityMapper);
  });
});
