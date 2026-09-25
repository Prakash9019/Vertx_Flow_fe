import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QuoteWidget } from "./QuoteWidget";

describe("QuoteWidget", () => {
  it("renders the quote text and attribution", () => {
    render(<QuoteWidget element={{ props: { text: "Ship it.", author: "Ada", role: "Engineer" } }} />);
    expect(screen.getByText(/Ship it\./)).toBeInTheDocument();
    expect(screen.getByText(/Ada/)).toBeInTheDocument();
    expect(screen.getByText(/Engineer/)).toBeInTheDocument();
  });

  it("omits the attribution line when there is no author or role", () => {
    const { container } = render(<QuoteWidget element={{ props: { text: "Ship it.", author: "", role: "" } }} />);
    expect(container.querySelector("[data-quote-attribution]")).toBeNull();
  });
});
