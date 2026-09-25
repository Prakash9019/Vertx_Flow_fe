// Global design-token foundation for the editor. Every layout and
// free-element widget reads these values through CSS custom properties
// (see themeToCssVars/themeToRootStyle) rather than hardcoding Tailwind
// color/font classes, per the theme sub-project brief.

export const DEFAULT_THEME_ID = "default";

function theme({
  id,
  name,
  colors,
  typography,
  spacing = { xs: "0.5rem", sm: "1rem", md: "1.5rem", lg: "2.5rem", xl: "4rem" },
  radius = { sm: "0.375rem", md: "0.75rem", lg: "1.5rem" },
  shadows = {
    sm: "0 1px 2px rgba(0,0,0,0.08)",
    md: "0 4px 12px rgba(0,0,0,0.16)",
    lg: "0 12px 32px rgba(0,0,0,0.24)",
  },
  borders = { width: "1px", style: "solid" },
}) {
  return {
    id,
    name,
    colors,
    typography,
    spacing,
    radius,
    shadows,
    borders,
    // Prepares the future Background system's two-tier hierarchy (deck
    // default vs. slide override) without implementing it yet - nothing
    // reads this field this sub-project.
    defaultBackground: { kind: "solid", color: colors.background },
  };
}

export const THEME_REGISTRY = [
  theme({
    id: "default",
    name: "Default",
    colors: {
      background: "#0b2d2b",
      surface: "#123c39",
      surfaceMuted: "rgba(255,255,255,0.08)",
      primary: "#2dd4bf",
      secondary: "#14b8a6",
      accent: "#5eead4",
      text: "#ffffff",
      textMuted: "rgba(255,255,255,0.7)",
      border: "rgba(255,255,255,0.14)",
    },
    typography: {
      headingFont: "Inter, system-ui, sans-serif",
      bodyFont: "Inter, system-ui, sans-serif",
      headingWeight: 700,
      bodyWeight: 400,
      headingScale: 1,
      bodyScale: 1,
      lineHeight: 1.5,
    },
  }),
  theme({
    id: "dark",
    name: "Dark",
    colors: {
      background: "#0f1115",
      surface: "#1a1d24",
      surfaceMuted: "rgba(255,255,255,0.06)",
      primary: "#6366f1",
      secondary: "#818cf8",
      accent: "#a5b4fc",
      text: "#f5f5f7",
      textMuted: "rgba(245,245,247,0.65)",
      border: "rgba(255,255,255,0.12)",
    },
    typography: {
      headingFont: "Inter, system-ui, sans-serif",
      bodyFont: "Inter, system-ui, sans-serif",
      headingWeight: 700,
      bodyWeight: 400,
      headingScale: 1,
      bodyScale: 1,
      lineHeight: 1.5,
    },
  }),
  theme({
    id: "light",
    name: "Light",
    colors: {
      background: "#ffffff",
      surface: "#f4f4f5",
      surfaceMuted: "rgba(0,0,0,0.04)",
      primary: "#2563eb",
      secondary: "#1d4ed8",
      accent: "#60a5fa",
      text: "#111827",
      textMuted: "rgba(17,24,39,0.6)",
      border: "rgba(0,0,0,0.1)",
    },
    typography: {
      headingFont: "Inter, system-ui, sans-serif",
      bodyFont: "Inter, system-ui, sans-serif",
      headingWeight: 700,
      bodyWeight: 400,
      headingScale: 1,
      bodyScale: 1,
      lineHeight: 1.5,
    },
  }),
  theme({
    id: "minimal",
    name: "Minimal",
    colors: {
      background: "#fafaf9",
      surface: "#f0efec",
      surfaceMuted: "rgba(0,0,0,0.03)",
      primary: "#18181b",
      secondary: "#3f3f46",
      accent: "#71717a",
      text: "#18181b",
      textMuted: "rgba(24,24,27,0.55)",
      border: "rgba(0,0,0,0.08)",
    },
    typography: {
      headingFont: "'Helvetica Neue', Arial, sans-serif",
      bodyFont: "'Helvetica Neue', Arial, sans-serif",
      headingWeight: 600,
      bodyWeight: 400,
      headingScale: 0.95,
      bodyScale: 1,
      lineHeight: 1.6,
    },
    radius: { sm: "0.125rem", md: "0.25rem", lg: "0.5rem" },
  }),
  theme({
    id: "modern",
    name: "Modern",
    colors: {
      background: "#0b1120",
      surface: "#111827",
      surfaceMuted: "rgba(255,255,255,0.05)",
      primary: "#f97316",
      secondary: "#fb923c",
      accent: "#fbbf24",
      text: "#f8fafc",
      textMuted: "rgba(248,250,252,0.65)",
      border: "rgba(255,255,255,0.1)",
    },
    typography: {
      headingFont: "Poppins, system-ui, sans-serif",
      bodyFont: "Inter, system-ui, sans-serif",
      headingWeight: 700,
      bodyWeight: 400,
      headingScale: 1.05,
      bodyScale: 1,
      lineHeight: 1.5,
    },
    radius: { sm: "0.5rem", md: "1rem", lg: "2rem" },
  }),
  theme({
    id: "bold",
    name: "Bold",
    colors: {
      background: "#18181b",
      surface: "#27272a",
      surfaceMuted: "rgba(255,255,255,0.07)",
      primary: "#ef4444",
      secondary: "#dc2626",
      accent: "#f87171",
      text: "#ffffff",
      textMuted: "rgba(255,255,255,0.7)",
      border: "rgba(255,255,255,0.15)",
    },
    typography: {
      headingFont: "'Archivo Black', Inter, system-ui, sans-serif",
      bodyFont: "Inter, system-ui, sans-serif",
      headingWeight: 800,
      bodyWeight: 500,
      headingScale: 1.1,
      bodyScale: 1,
      lineHeight: 1.4,
    },
    radius: { sm: "0rem", md: "0.25rem", lg: "0.5rem" },
    borders: { width: "2px", style: "solid" },
  }),
  theme({
    id: "professional",
    name: "Professional",
    colors: {
      background: "#0a1a2f",
      surface: "#10233d",
      surfaceMuted: "rgba(255,255,255,0.05)",
      primary: "#c9a24b",
      secondary: "#b8933d",
      accent: "#e2c275",
      text: "#f1f5f9",
      textMuted: "rgba(241,245,249,0.65)",
      border: "rgba(255,255,255,0.12)",
    },
    typography: {
      headingFont: "Georgia, 'Times New Roman', serif",
      bodyFont: "Inter, system-ui, sans-serif",
      headingWeight: 700,
      bodyWeight: 400,
      headingScale: 1,
      bodyScale: 1,
      lineHeight: 1.6,
    },
    radius: { sm: "0.25rem", md: "0.5rem", lg: "1rem" },
  }),
];

const THEME_BY_ID = new Map(THEME_REGISTRY.map((t) => [t.id, t]));

// Legacy bare-string theme values (the only shape `deck.theme` could hold
// before this sub-project) mapped onto the closest new registry theme.
const LEGACY_STRING_THEME_MAP = {
  dark: "dark",
  light: "light",
  warm: "modern",
  DeepPurple: "bold",
  DarkBlue: "professional",
  EarthStone: "minimal",
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getTheme(id) {
  const found = THEME_BY_ID.get(id);
  return deepClone(found ?? THEME_BY_ID.get(DEFAULT_THEME_ID));
}

function mergeGroup(base, override) {
  if (!override || typeof override !== "object") return { ...base };
  return { ...base, ...override };
}

// Accepts whatever `deck.theme` might currently hold - a legacy bare
// string, a partial/future-shaped object, or an already-current full
// theme object - and always returns a complete, current-shape theme.
// Must be idempotent: running it twice in a row is a no-op the second time.
export function normalizeTheme(value) {
  if (typeof value === "string") {
    return getTheme(LEGACY_STRING_THEME_MAP[value] ?? DEFAULT_THEME_ID);
  }
  if (!value || typeof value !== "object") {
    return getTheme(DEFAULT_THEME_ID);
  }

  const base = getTheme(THEME_BY_ID.has(value.id) ? value.id : DEFAULT_THEME_ID);

  return {
    id: value.id ?? base.id,
    name: value.name ?? base.name,
    colors: mergeGroup(base.colors, value.colors),
    typography: mergeGroup(base.typography, value.typography),
    spacing: mergeGroup(base.spacing, value.spacing),
    radius: mergeGroup(base.radius, value.radius),
    shadows: mergeGroup(base.shadows, value.shadows),
    borders: mergeGroup(base.borders, value.borders),
    defaultBackground: value.defaultBackground ?? base.defaultBackground,
  };
}

// Vars every layout/widget can reference via var(--theme-*) regardless of
// where in the tree they're rendered, as long as they're a descendant of
// whatever element themeToRootStyle/themeToCssVars was applied to.
export function themeToCssVars(theme) {
  return {
    "--theme-background": theme.colors.background,
    "--theme-surface": theme.colors.surface,
    "--theme-surface-muted": theme.colors.surfaceMuted,
    "--theme-primary": theme.colors.primary,
    "--theme-secondary": theme.colors.secondary,
    "--theme-accent": theme.colors.accent,
    "--theme-text": theme.colors.text,
    "--theme-text-muted": theme.colors.textMuted,
    "--theme-border": theme.colors.border,
    "--theme-heading-font": theme.typography.headingFont,
    "--theme-body-font": theme.typography.bodyFont,
    "--theme-heading-weight": theme.typography.headingWeight,
    "--theme-body-weight": theme.typography.bodyWeight,
    "--theme-heading-scale": theme.typography.headingScale,
    "--theme-body-scale": theme.typography.bodyScale,
    "--theme-line-height": theme.typography.lineHeight,
    "--theme-radius-sm": theme.radius.sm,
    "--theme-radius-md": theme.radius.md,
    "--theme-radius-lg": theme.radius.lg,
  };
}

// For the single root element that should visibly repaint on theme change
// (the editor's outermost wrapper) - the CSS vars plus a directly-applied
// background/text/font so the change is visible even before any descendant
// references a var(--theme-*).
export function themeToRootStyle(theme) {
  return {
    ...themeToCssVars(theme),
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontFamily: theme.typography.bodyFont,
  };
}
