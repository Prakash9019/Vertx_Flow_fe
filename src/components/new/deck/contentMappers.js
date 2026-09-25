// Semantic content normalization/transformation layer (architecture doc §3).
// Layout switching is `denormalize(normalize(sourceLayout, content), targetLayout)`
// instead of one hand-written mapper function per (fromLayout, toLayout) pair.
//
// SemanticContent - layout-agnostic "what this slide is about":
//   { heading: string,
//     body: string|null,                                  // rich-text HTML
//     items: [{ title, body, media }]|null,                // points/members/cards
//     media: { url, type }|null,                           // primary media
//     metrics: [{ value, label }]|null }
//
// Every layout gets a normalize (layout content -> semantic) and a
// denormalize (semantic -> layout content) function below. `denormalize`
// always prefers a field carried over from the semantic model and only
// falls back to `targetDefaultContent` for fields the semantic model
// genuinely has nothing for - never a silent full reset to placeholder
// content (the constraint the architecture doc calls out explicitly).

function htmlToPlainText(html) {
  return (html ?? "").replace(/<[^>]+>/g, "");
}

// Same split heuristic the original (now-removed) `paragraphToBulletsMapper`
// used: break a paragraph into one item per ". "-delimited sentence.
function splitBodyToItems(body) {
  if (!body) return null;
  const items = htmlToPlainText(body)
    .split(". ")
    .map((fragment) => fragment.trim())
    .filter((fragment) => fragment.length > 0)
    .map((fragment) => ({ title: "", body: fragment, media: null }));
  return items.length ? items : null;
}

function joinItemsToBody(items) {
  if (!items || !items.length) return null;
  const sentence = items
    .map((item) => htmlToPlainText(item.body || item.title || ""))
    .filter(Boolean)
    .join(". ");
  return sentence ? `<p>${sentence}</p>` : null;
}

function mediaOrNull(media) {
  return media && media.url ? media : null;
}

// --- normalize: LayoutContent -> SemanticContent ---------------------------

function normalizeTitle(content) {
  return { heading: content.title ?? "", body: content.subtitle || null, items: null, media: null, metrics: null };
}

function normalizeProblem(content) {
  return { heading: content.heading ?? "", body: content.body || null, items: null, media: null, metrics: null };
}

function normalizeMediaDescription(content) {
  return {
    heading: content.heading ?? "",
    body: content.body || null,
    items: null,
    media: mediaOrNull(content.media),
    metrics: null,
  };
}

function normalizeMedia3Points(content) {
  const items = (content.points ?? [])
    .filter((point) => point.title || point.body)
    .map((point) => ({ title: point.title ?? "", body: point.body ?? "", media: null }));
  return {
    heading: content.heading ?? "",
    body: null,
    items: items.length ? items : null,
    media: mediaOrNull(content.media),
    metrics: null,
  };
}

function normalizeMetricsGrid(content) {
  const metrics = content.metrics ?? [];
  return { heading: content.heading ?? "", body: null, items: null, media: null, metrics: metrics.length ? metrics : null };
}

function normalizeTeamGrid(content) {
  const items = (content.members ?? [])
    .filter((member) => member.name || member.role || member.photoUrl)
    .map((member) => ({
      title: member.name ?? "",
      body: member.role ?? "",
      media: member.photoUrl ? { url: member.photoUrl, type: "image" } : null,
    }));
  return { heading: content.heading ?? "", body: null, items: items.length ? items : null, media: null, metrics: null };
}

function normalizeCta(content) {
  return { heading: content.heading ?? "", body: content.body || null, items: null, media: null, metrics: null };
}

const NORMALIZERS = {
  title: normalizeTitle,
  problem: normalizeProblem,
  "media-description": normalizeMediaDescription,
  "media-3points": normalizeMedia3Points,
  "metrics-grid": normalizeMetricsGrid,
  "team-grid": normalizeTeamGrid,
  cta: normalizeCta,
};

export function normalize(layout, content) {
  const normalizer = NORMALIZERS[layout];
  if (!normalizer) {
    // Unknown layout: best-effort generic reading so this never throws.
    return { heading: content.heading ?? content.title ?? "", body: content.body || null, items: null, media: null, metrics: null };
  }
  return normalizer(content);
}

// --- denormalize: SemanticContent -> LayoutContent --------------------------

function denormalizeTitle(semantic, defaultContent) {
  return {
    title: semantic.heading ?? defaultContent.title,
    subtitle: semantic.body ?? defaultContent.subtitle,
  };
}

function denormalizeProblem(semantic, defaultContent) {
  return {
    heading: semantic.heading ?? defaultContent.heading,
    body: semantic.body ?? joinItemsToBody(semantic.items) ?? defaultContent.body,
  };
}

function denormalizeMediaDescription(semantic, defaultContent) {
  return {
    heading: semantic.heading ?? defaultContent.heading,
    body: semantic.body ?? joinItemsToBody(semantic.items) ?? defaultContent.body,
    media: semantic.media ?? defaultContent.media,
    mediaPosition: defaultContent.mediaPosition,
  };
}

function denormalizeMedia3Points(semantic, defaultContent) {
  const items = semantic.items ?? splitBodyToItems(semantic.body);
  return {
    heading: semantic.heading ?? defaultContent.heading,
    media: semantic.media ?? defaultContent.media,
    points: items ? items.map((item) => ({ title: item.title ?? "", body: item.body ?? "" })) : defaultContent.points,
  };
}

function denormalizeMetricsGrid(semantic, defaultContent) {
  return {
    heading: semantic.heading ?? defaultContent.heading,
    metrics: semantic.metrics ?? defaultContent.metrics,
  };
}

// Members need a genuine name/role pairing, which only another items-based
// layout (media-3points' points, another team-grid) actually has - splitting
// a plain paragraph into fake "members" would invent people that were never
// in the content, so a body-only source falls back to defaultContent here
// rather than reusing splitBodyToItems like media-3points does.
function denormalizeTeamGrid(semantic, defaultContent) {
  const items = semantic.items;
  return {
    heading: semantic.heading ?? defaultContent.heading,
    members: items
      ? items.map((item) => ({ name: item.title ?? "", role: item.body ?? "", photoUrl: item.media?.url ?? "" }))
      : defaultContent.members,
  };
}

function denormalizeCta(semantic, defaultContent) {
  return {
    heading: semantic.heading ?? defaultContent.heading,
    body: semantic.body ?? joinItemsToBody(semantic.items) ?? defaultContent.body,
    buttonLabel: defaultContent.buttonLabel,
  };
}

const DENORMALIZERS = {
  title: denormalizeTitle,
  problem: denormalizeProblem,
  "media-description": denormalizeMediaDescription,
  "media-3points": denormalizeMedia3Points,
  "metrics-grid": denormalizeMetricsGrid,
  "team-grid": denormalizeTeamGrid,
  cta: denormalizeCta,
};

export function denormalize(semantic, targetLayout, targetDefaultContent) {
  const denormalizer = DENORMALIZERS[targetLayout];
  if (!denormalizer) return targetDefaultContent;
  return denormalizer(semantic, targetDefaultContent);
}

// What deckReducer's SET_SLIDE_LAYOUT actually calls: normalize the source
// content, then denormalize into the target layout's shape, defaulting only
// the fields the semantic model has nothing for.
export function getMappedContent(fromLayout, toLayout, content, targetDefaultContent) {
  if (fromLayout === toLayout) return content;
  const semantic = normalize(fromLayout, content);
  return denormalize(semantic, toLayout, targetDefaultContent);
}
