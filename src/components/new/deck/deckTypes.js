export const LAYOUT_IDS = [
  "title",
  "problem",
  "media-description",
  "media-3points",
  "metrics-grid",
  "team-grid",
  "cta",
];

let counter = 0;

export function generateId(prefix) {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

export function createSlide({ layout, content, background, freeElements, order }) {
  return {
    id: generateId("slide"),
    layout,
    content,
    // `null` means "no per-slide override, inherit the deck theme's default
    // background" (architecture doc §6's two-tier model) - SlideCanvas
    // resolves this via `slide.background ?? deckTheme.defaultBackground`.
    // A slide only gets a background object here when the caller passes one
    // explicitly (e.g. DUPLICATE_SLIDE cloning an existing override).
    background: background ?? null,
    freeElements: freeElements ?? [],
    order,
  };
}

export function createFreeElement({ type, x, y, w, h, rotation, zIndex, locked, props }) {
  return {
    id: generateId("element"),
    type,
    x,
    y,
    w,
    h,
    rotation: rotation ?? 0,
    zIndex: zIndex ?? 0,
    locked: locked ?? false,
    props: props ?? {},
  };
}

export function createDeck({ title, theme, slides }) {
  return {
    id: generateId("deck"),
    title,
    theme,
    slides: slides ?? [],
  };
}

export function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Structural validation for a FreeElement-shaped payload arriving from
// outside the reducer's own factories (a dispatch call, or a deserialized/
// loaded deck) - guards deckReducer's ADD_FREE_ELEMENT against malformed
// data reaching the deck now that real persistence exists.
export function isValidFreeElement(element) {
  if (!isPlainObject(element)) return false;
  return (
    typeof element.id === "string" &&
    element.id.length > 0 &&
    typeof element.type === "string" &&
    element.type.length > 0 &&
    Number.isFinite(element.x) &&
    Number.isFinite(element.y) &&
    Number.isFinite(element.w) &&
    Number.isFinite(element.h) &&
    Number.isFinite(element.rotation) &&
    Number.isFinite(element.zIndex) &&
    typeof element.locked === "boolean" &&
    isPlainObject(element.props)
  );
}
