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
    background: background ?? { kind: "solid", color: "#0b2d2b" },
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
