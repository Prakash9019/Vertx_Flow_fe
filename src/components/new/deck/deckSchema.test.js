import { describe, it, expect } from "vitest";
import { migrateDeck, serializeDeck, CURRENT_SCHEMA_VERSION } from "./deckSchema";
import { getTheme, DEFAULT_THEME_ID } from "./theme/themeTokens";

describe("migrateDeck", () => {
  it("normalizes a v1 deck with a bare-string theme into a structured theme", () => {
    const raw = { _id: "d1", title: "My Deck", theme: "dark", slides: [] };
    const migrated = migrateDeck(raw);
    expect(migrated.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(migrated.theme.id).toBe("dark");
    expect(migrated.theme.colors.background).toBe(getTheme("dark").colors.background);
  });

  it("defaults a deck with no theme at all to the default theme", () => {
    const raw = { _id: "d2", title: "No Theme", slides: [] };
    const migrated = migrateDeck(raw);
    expect(migrated.theme.id).toBe(DEFAULT_THEME_ID);
  });

  it("passes an already-current structured theme through unchanged", () => {
    const currentTheme = getTheme("modern");
    const raw = { id: "d3", schemaVersion: CURRENT_SCHEMA_VERSION, title: "Current", theme: currentTheme, slides: [] };
    const migrated = migrateDeck(raw);
    expect(migrated.theme).toEqual(currentTheme);
  });

  it("fills in missing token groups on a partially-structured theme", () => {
    const raw = { id: "d4", title: "Partial", theme: { id: "bold", colors: { primary: "#custom" } }, slides: [] };
    const migrated = migrateDeck(raw);
    expect(migrated.theme.colors.primary).toBe("#custom");
    expect(migrated.theme.colors.background).toBe(getTheme("bold").colors.background);
    expect(migrated.theme.typography.headingFont).toBeTruthy();
  });

  it("returns null/undefined unchanged", () => {
    expect(migrateDeck(null)).toBe(null);
    expect(migrateDeck(undefined)).toBe(undefined);
  });
});

describe("serializeDeck", () => {
  it("round-trips the structured theme unchanged", () => {
    const theme = getTheme("light");
    const deck = { schemaVersion: CURRENT_SCHEMA_VERSION, title: "T", theme, slides: [] };
    expect(serializeDeck(deck).theme).toBe(theme);
  });
});
