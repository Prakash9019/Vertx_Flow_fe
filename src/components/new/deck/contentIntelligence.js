// Roadmap #12: content intelligence. Deterministic (no AI call, same
// "scoring/matching step" philosophy as remix.js) text analysis that upgrades
// a slide's SemanticContent when the raw text has a number/list/image cue
// buried in plain prose instead of already being in the matching structured
// field - a safety net for AI-generated body text (or, later, pasted
// content) so pickBestLayout has real items/metrics/media to score against
// instead of everything looking like a bare paragraph.

const METRIC_PATTERN = /(\$[\d,.]+\s?(?:[kKmMbB]|million|billion|thousand)?|\d[\d,.]*\s?(?:%|x\b)|\d[\d,.]*\s?(?:million|billion|thousand))/i;

const LIST_LINE_PATTERN = /^\s*(?:[-*•]|\d+[.)])\s+(.*)$/;

const IMAGE_PROMPT_PATTERN = /\[(?:image|img|photo|picture)s?\s*:\s*([^\]]+)\]/i;

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Finds numeric/percentage/currency/multiplier stats in `text` and turns
// each sentence that contains one into a {label, value} metric. Returns
// null when nothing looks like a stat, so callers can tell "no metrics
// found" apart from "found zero-length array".
export function extractMetrics(text) {
  if (!text) return null;
  const metrics = [];
  for (const sentence of splitSentences(text)) {
    const match = sentence.match(METRIC_PATTERN);
    if (!match) continue;
    const value = match[0].trim();
    const label = sentence
      .replace(match[0], " ")
      .replace(/\s+/g, " ")
      .replace(/^[\s,:-]+|[\s,:-]+$/g, "")
      .trim();
    metrics.push({ label: label || "Metric", value });
    if (metrics.length >= 6) break;
  }
  return metrics.length ? metrics : null;
}

// Finds marker-led lines (-, *, •, "1.", "1)") in `text` and turns them
// into items. Requires at least 2 such lines so a single stray "-" in prose
// doesn't get misread as a list. Returns null when there's no real list.
export function extractListItems(text) {
  if (!text) return null;
  const lines = text.split(/\n+/);
  const items = [];
  for (const line of lines) {
    const match = line.match(LIST_LINE_PATTERN);
    if (match && match[1].trim()) {
      items.push({ title: "", body: match[1].trim(), media: null });
    }
  }
  return items.length >= 2 ? items : null;
}

// Finds a "[image: a photo of ...]"-style cue and returns its description,
// or null. Case-insensitive, accepts image/img/photo/picture.
export function extractImagePrompt(text) {
  if (!text) return null;
  const match = text.match(IMAGE_PROMPT_PATTERN);
  return match ? match[1].trim() : null;
}

function stripListLines(text) {
  return text
    .split(/\n+/)
    .filter((line) => !LIST_LINE_PATTERN.test(line))
    .join("\n")
    .trim();
}

function stripImagePrompt(text) {
  return text.replace(IMAGE_PROMPT_PATTERN, "").trim();
}

// Main entry point: given a SemanticContent object, fills in items/metrics/
// media from `body` text when those fields are empty and the text has a
// detectable pattern for them - never overwrites a field the caller already
// populated. Returns a new object; never mutates the input.
export function enrichSemanticContent(semantic) {
  const enriched = { ...semantic };
  const rawBody = semantic.body ?? "";
  let workingBody = rawBody;

  if (!enriched.media) {
    const prompt = extractImagePrompt(`${semantic.heading ?? ""}\n${rawBody}`);
    if (prompt) {
      enriched.media = { url: "", type: "image", prompt };
      workingBody = stripImagePrompt(workingBody);
    }
  }

  if (!enriched.items || !enriched.items.length) {
    const items = extractListItems(workingBody);
    if (items) {
      enriched.items = items;
      workingBody = stripListLines(workingBody);
    }
  }

  if (!enriched.metrics || !enriched.metrics.length) {
    const metrics = extractMetrics(rawBody);
    if (metrics) {
      enriched.metrics = metrics;
    }
  }

  enriched.body = workingBody || null;
  return enriched;
}
