// Converts a layout's fixed base font size (in rem, matching what its old
// hardcoded Tailwind text-size class used to be) into a value driven by the
// theme's headingScale/bodyScale tokens (see themeTokens.js), so changing a
// theme's scale actually resizes rendered text instead of only affecting
// font family/color. The `, 1` fallback keeps a layout readable even if
// rendered outside the themed root wrapper that defines the CSS var.
export function headingFontSize(baseRem) {
  return `calc(${baseRem}rem * var(--theme-heading-scale, 1))`;
}

export function bodyFontSize(baseRem) {
  return `calc(${baseRem}rem * var(--theme-body-scale, 1))`;
}
