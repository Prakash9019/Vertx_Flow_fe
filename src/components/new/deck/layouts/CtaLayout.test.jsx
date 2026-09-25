import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CtaLayout, defaultCtaContent } from "./CtaLayout";

describe("defaultCtaContent", () => {
  it("returns heading, body, and a button label", () => {
    const content = defaultCtaContent();
    expect(content.heading).toBe("Join Us");
    expect(content.buttonLabel).toBe("Get in touch");
  });
});

describe("CtaLayout", () => {
  it("renders heading, body, and the button label", () => {
    render(
      <CtaLayout
        content={{ heading: "Join Us", body: "<p>Reach out.</p>", buttonLabel: "Contact us" }}
        onChangeContent={() => {}}
      />
    );
    expect(screen.getByText("Join Us")).toBeInTheDocument();
    expect(screen.getByText("Reach out.")).toBeInTheDocument();
    expect(screen.getByText("Contact us")).toBeInTheDocument();
  });

  it("styles the button from theme tokens instead of a hardcoded color", () => {
    render(
      <CtaLayout
        content={{ heading: "Join Us", body: "<p>Reach out.</p>", buttonLabel: "Contact us" }}
        onChangeContent={() => {}}
      />
    );
    const button = screen.getByText("Contact us");
    expect(button.className).not.toMatch(/bg-teal-400|text-black/);
    expect(button.style.backgroundColor).toBe("var(--theme-primary)");
    expect(button.style.color).toBe("var(--theme-background)");
  });

  it("sizes the heading/body fonts off the theme's scale tokens, not a fixed class", () => {
    render(
      <CtaLayout content={{ heading: "Join Us", body: "<p>Reach out.</p>", buttonLabel: "Contact us" }} onChangeContent={() => {}} />
    );
    expect(screen.getByText("Join Us").style.fontSize).toBe("calc(3rem * var(--theme-heading-scale, 1))");
  });
});
