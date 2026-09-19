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
});
