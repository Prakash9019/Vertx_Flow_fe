export function identityMapper(content) {
  return content;
}

export function paragraphToBulletsMapper(content) {
  const { heading, body, media } = content;
  const resolvedMedia = media ?? { url: "", type: "image" };
  if (!body) {
    return { heading, points: [], media: resolvedMedia };
  }
  const text = body.replace(/<[^>]+>/g, "");
  const points = text
    .split(". ")
    .map((fragment) => fragment.trim())
    .filter((fragment) => fragment.length > 0)
    .map((fragment) => ({ title: "", body: fragment }));
  return { heading, points, media: resolvedMedia };
}

const MAPPER_REGISTRY = {
  "problem->media-3points": paragraphToBulletsMapper,
};

export function getContentMapper(fromLayout, toLayout) {
  return MAPPER_REGISTRY[`${fromLayout}->${toLayout}`] ?? identityMapper;
}
