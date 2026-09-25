import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeamGridLayout, defaultTeamGridContent } from "./TeamGridLayout";

describe("defaultTeamGridContent", () => {
  it("returns a heading and one placeholder member", () => {
    const content = defaultTeamGridContent();
    expect(content.heading).toBe("Team");
    expect(content.members).toHaveLength(1);
  });
});

describe("TeamGridLayout", () => {
  it("renders each member's name and role", () => {
    const content = {
      heading: "Team",
      members: [
        { photoUrl: "", name: "Ada Lovelace", role: "CEO" },
        { photoUrl: "https://example.com/b.png", name: "Alan Turing", role: "CTO" },
      ],
    };
    render(<TeamGridLayout content={content} onChangeContent={() => {}} />);
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("CEO")).toBeInTheDocument();
    expect(screen.getByText("Alan Turing")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/b.png");
  });
});
