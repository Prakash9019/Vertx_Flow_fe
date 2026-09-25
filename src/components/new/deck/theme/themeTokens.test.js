import { describe, it, expect } from "vitest";
import { THEME_REGISTRY, DEFAULT_THEME_ID, getTheme, normalizeTheme, themeToCssVars, themeToRootStyle } from "./themeTokens";

const REQUIRED_COLOR_KEYS = ["background", "surface", "surfaceMuted", "primary", "secondary", "accent", "text", "textMuted", "border"];
const REQUIRED_TYPOGRAPHY_KEYS = ["headingFont", "bodyFont", "headingWeight", "bodyWeight", "headingScale", "bodyScale", "lineHeight"];

describe("THEME_REGISTRY", () => {
  it("has exactly the 7 expected themes, each with a complete token shape", () => {
    const ids = THEME_REGISTRY.map((t) => t.id);
    expect(ids).toEqual(["default", "dark", "light", "minimal", "modern", "bold", "professional"]);

    for (const theme of THEME_REGISTRY) {
      expect(typeof theme.name).toBe("string");
      REQUIRED_COLOR_KEYS.forEach((key) => expect(theme.colors[key]).toBeTruthy());
      REQUIRED_TYPOGRAPHY_KEYS.forEach((key) => expect(theme.typography[key]).toBeDefined());
      expect(theme.spacing).toMatchObject({ xs: expect.any(String), sm: expect.any(String), md: expect.any(String), lg: expect.any(String), xl: expect.any(String) });
      expect(theme.radius).toMatchObject({ sm: expect.any(String), md: expect.any(String), lg: expect.any(String) });
      expect(theme.shadows).toMatchObject({ sm: expect.any(String), md: expect.any(String), lg: expect.any(String) });
      expect(theme.borders).toMatchObject({ width: expect.any(String), style: expect.any(String) });
      expect(theme.defaultBackground).toMatchObject({ kind: "solid", color: theme.colors.background });
    }
  });

  it("has a default theme matching DEFAULT_THEME_ID", () => {
    expect(THEME_REGISTRY.some((t) => t.id === DEFAULT_THEME_ID)).toBe(true);
  });
});

describe("getTheme", () => {
  it("returns the matching registry theme by id", () => {
    expect(getTheme("dark").id).toBe("dark");
  });

  it("falls back to the default theme for an unknown id", () => {
    expect(getTheme("not-a-real-theme").id).toBe(DEFAULT_THEME_ID);
  });

  it("returns an independent copy each call (mutating one does not affect the registry)", () => {
    const a = getTheme("dark");
    a.colors.primary = "#000000";
    const b = getTheme("dark");
    expect(b.colors.primary).not.toBe("#000000");
  });
});

describe("normalizeTheme", () => {
  it("maps a legacy bare-string theme to a full structured theme", () => {
    const result = normalizeTheme("dark");
    expect(result.id).toBeTruthy();
    REQUIRED_COLOR_KEYS.forEach((key) => expect(result.colors[key]).toBeTruthy());
  });

  it("falls back to the default theme for an unrecognized legacy string", () => {
    expect(normalizeTheme("some-unknown-legacy-value").id).toBe(DEFAULT_THEME_ID);
  });

  it("returns the default theme for null/undefined", () => {
    expect(normalizeTheme(null).id).toBe(DEFAULT_THEME_ID);
    expect(normalizeTheme(undefined).id).toBe(DEFAULT_THEME_ID);
  });

  it("fills in missing groups on a partial structured theme without discarding provided values", () => {
    const partial = { id: "dark", colors: { primary: "#custom-primary" } };
    const result = normalizeTheme(partial);
    expect(result.colors.primary).toBe("#custom-primary");
    // Every other color key still gets filled in from the "dark" base theme.
    expect(result.colors.background).toBe(getTheme("dark").colors.background);
    expect(result.typography.headingFont).toBeTruthy();
  });

  it("is idempotent on an already-current full theme object", () => {
    const full = getTheme("modern");
    const result = normalizeTheme(full);
    expect(result).toEqual(full);
  });
});

describe("themeToCssVars", () => {
  it("produces --theme-* custom properties for colors and typography", () => {
    const vars = themeToCssVars(getTheme("light"));
    expect(vars["--theme-background"]).toBe(getTheme("light").colors.background);
    expect(vars["--theme-text"]).toBe(getTheme("light").colors.text);
    expect(vars["--theme-primary"]).toBe(getTheme("light").colors.primary);
    expect(vars["--theme-heading-font"]).toBe(getTheme("light").typography.headingFont);
    expect(vars["--theme-body-font"]).toBe(getTheme("light").typography.bodyFont);
    expect(vars["--theme-radius-md"]).toBe(getTheme("light").radius.md);
  });

  it("includes heading/body scale so layouts can size fonts off the theme instead of a fixed class", () => {
    const vars = themeToCssVars(getTheme("light"));
    expect(vars["--theme-heading-scale"]).toBe(getTheme("light").typography.headingScale);
    expect(vars["--theme-body-scale"]).toBe(getTheme("light").typography.bodyScale);
  });
});

describe("themeToRootStyle", () => {
  it("includes the CSS vars plus a directly-applied background/text color", () => {
    const theme = getTheme("bold");
    const style = themeToRootStyle(theme);
    expect(style["--theme-primary"]).toBe(theme.colors.primary);
    expect(style.backgroundColor).toBe(theme.colors.background);
    expect(style.color).toBe(theme.colors.text);
    expect(style.fontFamily).toBe(theme.typography.bodyFont);
  });
});
