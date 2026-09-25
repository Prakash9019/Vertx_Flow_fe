import { LAYOUT_IDS } from "./deckTypes";

// Architecture doc §4: Remix is "generate a different visual composition
// that preserves meaning, without the user necessarily picking the exact
// target layout" - a decision-plus-placement flow, not the layout picker
// made automatic. This is the decision half: given a slide's SemanticContent
// (see contentMappers.js), score every layout for how well its shape fits
// that content and return the best match. The placement half (denormalize)
// is reused as-is from the layout-change pipeline.
//
// No AI call here by design - this is a deterministic scoring/matching step
// (the "possibly via AI generation later" option the doc leaves open), which
// keeps Remix usable offline and keeps its output testable.
function scoreLayoutForSemantic(layout, semantic) {
  const hasBody = Boolean(semantic.body);
  const items = semantic.items ?? [];
  const hasItems = items.length > 0;
  const itemsHaveTitles = hasItems && items.every((item) => item.title && item.title.trim().length > 0);
  const hasMedia = Boolean(semantic.media);
  const hasMetrics = Boolean(semantic.metrics && semantic.metrics.length > 0);

  const isBare = !hasBody && !hasItems && !hasMetrics && !hasMedia;

  switch (layout) {
    case "metrics-grid":
      return hasMetrics ? 10 : 0;
    case "team-grid":
      if (!hasItems) return 0;
      return itemsHaveTitles ? 9 : 3;
    case "media-3points":
      return hasItems ? 8 : 0;
    case "media-description":
      if (hasMedia) return 7;
      return hasBody ? 3 : 0;
    case "problem":
      if (!hasBody) return 0;
      return hasItems || hasMetrics ? 1 : 6;
    case "cta":
      // A bare heading fits a call-to-action too, but title (below) is the
      // better default for "just a heading" - cta only wins when title is
      // the slide being remixed away from.
      return isBare ? 3 : 0;
    case "title":
      return isBare ? 5 : 1;
    default:
      return 0;
  }
}

// Picks the best-fit layout for `semantic` other than anything in
// `excludeLayouts` (e.g. layouts already tried in the same remix session, or
// nothing at all for a brand-new slide with no current layout to avoid).
// Deterministic: ties break in `LAYOUT_IDS` order, so this is unit-testable
// without mocking randomness. Returns `null` only when every layout is
// excluded.
export function pickBestLayout(semantic, excludeLayouts = []) {
  const excluded = new Set(excludeLayouts);
  let best = null;
  let bestScore = -Infinity;
  for (const layout of LAYOUT_IDS) {
    if (excluded.has(layout)) continue;
    const score = scoreLayoutForSemantic(layout, semantic);
    if (score > bestScore) {
      bestScore = score;
      best = layout;
    }
  }
  return best;
}

// Picks the best-fit layout for `semantic` other than `currentLayout` (and
// anything in `excludeLayouts`) - the Remix-specific case of `pickBestLayout`
// where the current layout must always be excluded.
export function pickRemixLayout(currentLayout, semantic, excludeLayouts = []) {
  return pickBestLayout(semantic, [currentLayout, ...excludeLayouts]);
}
