import { describe, it, expect } from "vitest";
import { normalize, denormalize, getMappedContent } from "./contentMappers";
import { defaultTitleContent } from "./layouts/TitleLayout";
import { defaultProblemContent } from "./layouts/ProblemLayout";
import { defaultMediaDescriptionContent } from "./layouts/MediaDescriptionLayout";
import { defaultMedia3PointsContent } from "./layouts/Media3PointsLayout";
import { defaultMetricsGridContent } from "./layouts/MetricsGridLayout";
import { defaultTeamGridContent } from "./layouts/TeamGridLayout";
import { defaultCtaContent } from "./layouts/CtaLayout";

describe("normalize", () => {
  it("reads title's title/subtitle as heading/body", () => {
    expect(normalize("title", { title: "Hi", subtitle: "there" })).toEqual({
      heading: "Hi",
      body: "there",
      items: null,
      media: null,
      metrics: null,
    });
  });

  it("reads media-description's media only when it has a url", () => {
    expect(normalize("media-description", { heading: "H", body: "<p>b</p>", media: { url: "", type: "image" } }).media).toBeNull();
    const withMedia = normalize("media-description", {
      heading: "H",
      body: "<p>b</p>",
      media: { url: "https://x/y.png", type: "image" },
    });
    expect(withMedia.media).toEqual({ url: "https://x/y.png", type: "image" });
  });

  it("reads media-3points' points as items, dropping empty ones", () => {
    const result = normalize("media-3points", {
      heading: "Features",
      media: { url: "", type: "image" },
      points: [{ title: "A", body: "a" }, { title: "", body: "" }, { title: "", body: "b" }],
    });
    expect(result.items).toEqual([
      { title: "A", body: "a", media: null },
      { title: "", body: "b", media: null },
    ]);
  });

  it("reads team-grid's members as items with media from photoUrl", () => {
    const result = normalize("team-grid", {
      heading: "Team",
      members: [{ name: "Ada", role: "Eng", photoUrl: "https://x/a.png" }],
    });
    expect(result.items).toEqual([{ title: "Ada", body: "Eng", media: { url: "https://x/a.png", type: "image" } }]);
  });

  it("reads metrics-grid's metrics through unchanged", () => {
    const metrics = [{ value: "10", label: "Users" }];
    expect(normalize("metrics-grid", { heading: "M", metrics }).metrics).toEqual(metrics);
  });
});

describe("denormalize", () => {
  it("falls back to defaultContent field-by-field, never resetting fields the semantic model has", () => {
    const semantic = { heading: "Kept heading", body: null, items: null, media: null, metrics: null };
    const result = denormalize(semantic, "problem", defaultProblemContent());
    expect(result.heading).toBe("Kept heading");
    expect(result.body).toBe(defaultProblemContent().body);
  });

  it("never invents team-grid members out of a plain paragraph body", () => {
    const semantic = { heading: "H", body: "<p>Just a sentence.</p>", items: null, media: null, metrics: null };
    const result = denormalize(semantic, "team-grid", defaultTeamGridContent());
    expect(result.members).toEqual(defaultTeamGridContent().members);
  });
});

describe("getMappedContent: layout switches preserve semantic content", () => {
  it("problem -> media-3points splits the paragraph into bullet points (paragraph -> bullets)", () => {
    const content = {
      heading: "The Problem",
      body: "<p>Teams lose context switching tools. Onboarding takes weeks. Support tickets pile up.</p>",
    };
    const result = getMappedContent("problem", "media-3points", content, defaultMedia3PointsContent());
    expect(result.heading).toBe("The Problem");
    expect(result.points).toEqual([
      { title: "", body: "Teams lose context switching tools" },
      { title: "", body: "Onboarding takes weeks" },
      { title: "", body: "Support tickets pile up." },
    ]);
  });

  it("media-3points -> problem joins bullet points back into a paragraph (bullets -> paragraph)", () => {
    const content = {
      heading: "Features",
      media: { url: "", type: "image" },
      points: [{ title: "", body: "Fast" }, { title: "", body: "Reliable" }],
    };
    const result = getMappedContent("media-3points", "problem", content, defaultProblemContent());
    expect(result.heading).toBe("Features");
    expect(result.body).toBe("<p>Fast. Reliable</p>");
  });

  it("media-3points -> team-grid carries points over as cards/members (bullets -> cards)", () => {
    const content = {
      heading: "Features",
      media: { url: "", type: "image" },
      points: [{ title: "Fast", body: "Really fast" }],
    };
    const result = getMappedContent("media-3points", "team-grid", content, defaultTeamGridContent());
    expect(result.heading).toBe("Features");
    expect(result.members).toEqual([{ name: "Fast", role: "Really fast", photoUrl: "" }]);
  });

  it("title -> cta carries heading/body, defaults the button label (field the semantic model has nothing for)", () => {
    const content = { title: "Welcome", subtitle: "Let's begin" };
    const result = getMappedContent("title", "cta", content, defaultCtaContent());
    expect(result.heading).toBe("Welcome");
    expect(result.body).toBe("Let's begin");
    expect(result.buttonLabel).toBe(defaultCtaContent().buttonLabel);
  });

  it("media-description -> media-3points carries the heading/media/body-as-points through (media-left <-> media-top structural change, content preserved)", () => {
    const content = {
      heading: "Product",
      body: "<p>What it does.</p>",
      media: { url: "https://x/y.png", type: "image" },
      mediaPosition: "left",
    };
    const result = getMappedContent("media-description", "media-3points", content, defaultMedia3PointsContent());
    expect(result.heading).toBe("Product");
    expect(result.media).toEqual({ url: "https://x/y.png", type: "image" });
    expect(result.points).toEqual([{ title: "", body: "What it does." }]);
  });

  it("metrics-grid -> metrics-grid (identity) and metrics-grid -> problem falls back since problem has no metrics concept", () => {
    const content = { heading: "Traction", metrics: [{ value: "1k", label: "Users" }] };
    expect(getMappedContent("metrics-grid", "metrics-grid", content, defaultMetricsGridContent())).toBe(content);

    const asProblem = getMappedContent("metrics-grid", "problem", content, defaultProblemContent());
    expect(asProblem.heading).toBe("Traction");
    expect(asProblem.body).toBe(defaultProblemContent().body);
  });

  it("never silently resets a heading/body that both source and target support", () => {
    const content = { heading: "Real heading", body: "<p>Real body.</p>" };
    for (const target of ["problem", "cta"]) {
      const result = getMappedContent("problem", target, content, target === "problem" ? defaultProblemContent() : defaultCtaContent());
      expect(result.heading).toBe("Real heading");
      expect(result.body).toBe("<p>Real body.</p>");
    }
  });

  it("returns content unchanged for a same-layout no-op switch", () => {
    const content = defaultTitleContent();
    expect(getMappedContent("title", "title", content, content)).toBe(content);
  });
});
