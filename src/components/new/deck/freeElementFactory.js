import { createFreeElement } from "./deckTypes";

// Default geometry/props for each insertable widget type. New widget types
// only need an entry here plus a renderer in `widgets/` - nothing about the
// interaction engine (select/drag/resize/rotate/layer/delete/duplicate)
// needs to change.
const WIDGET_DEFAULTS = {
  text: { w: 28, h: 10, props: { html: "Double-click to edit" } },
  image: { w: 30, h: 30, props: { src: "", alt: "" } },
  video: { w: 40, h: 24, props: { src: "" } },
  shape: { w: 18, h: 18, props: { shape: "rectangle" } },
  divider: { w: 40, h: 1.5, props: {} },
  icon: { w: 8, h: 8, props: { icon: "Star" } },
  chart: {
    w: 32,
    h: 24,
    props: {
      data: [
        { label: "A", value: 40 },
        { label: "B", value: 70 },
        { label: "C", value: 55 },
      ],
    },
  },
  timeline: {
    w: 50,
    h: 14,
    props: {
      items: [
        { label: "Step 1", date: "", description: "" },
        { label: "Step 2", date: "", description: "" },
        { label: "Step 3", date: "", description: "" },
      ],
    },
  },
  quote: { w: 34, h: 18, props: { text: "A short, memorable quote.", author: "Author Name", role: "" } },
  // `src`, not `url` - lets this reuse the same generic
  // onReplaceSrc(elementId, url) wiring FreeElementLayer already has for
  // image/video, with no change to that file.
  embed: { w: 40, h: 24, props: { src: "" } },
};

export const WIDGET_TYPES = Object.keys(WIDGET_DEFAULTS);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// `existingCount`/`existingMaxZIndex` let the caller stagger inserted
// elements slightly (so they don't land in a perfect stack) and keep new
// elements above everything already on the slide.
export function createWidget(type, { existingCount = 0, existingMaxZIndex = 0 } = {}) {
  const base = WIDGET_DEFAULTS[type];
  if (!base) throw new Error(`freeElementFactory: unknown widget type "${type}"`);

  const stagger = (existingCount % 5) * 3;
  const x = clamp(50 - base.w / 2 + stagger, 0, Math.max(0, 100 - base.w));
  const y = clamp(50 - base.h / 2 + stagger, 0, Math.max(0, 100 - base.h));

  return createFreeElement({
    type,
    x,
    y,
    w: base.w,
    h: base.h,
    rotation: 0,
    zIndex: existingMaxZIndex + 1,
    props: { ...base.props },
  });
}

export function duplicateWidget(element, { existingMaxZIndex = 0 } = {}) {
  const offset = 4;
  return createFreeElement({
    type: element.type,
    x: clamp(element.x + offset, 0, Math.max(0, 100 - element.w)),
    y: clamp(element.y + offset, 0, Math.max(0, 100 - element.h)),
    w: element.w,
    h: element.h,
    rotation: element.rotation,
    zIndex: existingMaxZIndex + 1,
    props: { ...element.props },
  });
}

// Returns `[{ id, zIndex }]` for every element whose zIndex must change to
// realize the requested layer move, renumbered as a contiguous 0..n-1 stack
// order. Returns `null` when the move is a no-op (already at that end/edge).
export function reorderZIndex(elements, elementId, direction) {
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  const index = sorted.findIndex((el) => el.id === elementId);
  if (index === -1) return null;

  let targetIndex;
  switch (direction) {
    case "forward":
      targetIndex = Math.min(index + 1, sorted.length - 1);
      break;
    case "backward":
      targetIndex = Math.max(index - 1, 0);
      break;
    case "front":
      targetIndex = sorted.length - 1;
      break;
    case "back":
      targetIndex = 0;
      break;
    default:
      return null;
  }
  if (targetIndex === index) return null;

  const [moved] = sorted.splice(index, 1);
  sorted.splice(targetIndex, 0, moved);
  return sorted.map((el, i) => ({ id: el.id, zIndex: i }));
}

export function maxZIndex(elements) {
  return elements.reduce((max, el) => Math.max(max, el.zIndex), -1);
}
