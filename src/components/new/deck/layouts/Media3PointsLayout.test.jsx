import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Media3PointsLayout, defaultMedia3PointsContent } from "./Media3PointsLayout";

describe("defaultMedia3PointsContent", () => {
  it("returns heading, empty media, and 3 placeholder points", () => {
    const content = defaultMedia3PointsContent();
    expect(content.heading).toBe("Key Features");
    expect(content.points).toHaveLength(3);
  });
});

describe("Media3PointsLayout", () => {
  it("renders up to 3 points even when given more", () => {
    const content = {
      heading: "Key Features",
      media: { url: "", type: "image" },
      points: [
        { title: "One", body: "First" },
        { title: "Two", body: "Second" },
        { title: "Three", body: "Third" },
        { title: "Four", body: "Fourth" },
      ],
    };
    render(<Media3PointsLayout content={content} onChangeContent={() => {}} />);
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
    expect(screen.getByText("Three")).toBeInTheDocument();
    expect(screen.queryByText("Four")).toBeNull();
  });

  it("renders point bodies produced by paragraphToBulletsMapper (empty title)", () => {
    const content = {
      heading: "Key Features",
      media: { url: "", type: "image" },
      points: [{ title: "", body: "Onboarding takes weeks" }],
    };
    render(<Media3PointsLayout content={content} onChangeContent={() => {}} />);
    expect(screen.getByText("Onboarding takes weeks")).toBeInTheDocument();
  });
});
