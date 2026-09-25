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

  it("sizes the heading/member-name fonts off the theme's scale tokens, not a fixed class", () => {
    const content = { heading: "Team", members: [{ photoUrl: "", name: "Ada Lovelace", role: "CEO" }] };
    render(<TeamGridLayout content={content} onChangeContent={() => {}} />);
    expect(screen.getByText("Team").style.fontSize).toBe("calc(2.25rem * var(--theme-heading-scale, 1))");
    expect(screen.getByText("Ada Lovelace").style.fontSize).toBe("calc(1rem * var(--theme-heading-scale, 1))");
  });
});
