import { describe, it, expect } from "vitest";
import { headingFontSize, bodyFontSize } from "./typographyScale";

describe("headingFontSize", () => {
  it("multiplies the base rem size by the theme's heading scale variable", () => {
    expect(headingFontSize(4.5)).toBe("calc(4.5rem * var(--theme-heading-scale, 1))");
  });
});

describe("bodyFontSize", () => {
  it("multiplies the base rem size by the theme's body scale variable", () => {
    expect(bodyFontSize(1.25)).toBe("calc(1.25rem * var(--theme-body-scale, 1))");
  });
});
