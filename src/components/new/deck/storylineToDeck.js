import { pickBestLayout } from "./remix";
import { denormalize } from "./contentMappers";
import { getRegistryEntry } from "./SlideRegistry";
import { createDeck, createSlide } from "./deckTypes";
import { getTheme, DEFAULT_THEME_ID } from "./theme/themeTokens";

// Turns the backend's AI-generated storyline (an array of SemanticContent-
// shaped slides, see services/geminiService.js on the server) into a real
// Deck. Reuses the exact same denormalize/createSlide/createDeck pipeline
// Remix and SET_SLIDE_LAYOUT use - no bespoke content-shape logic here, per
// the architecture doc's reuse constraint (docs/superpowers/specs/
// 2026-09-19-editor-v2-architecture-principles.md).
export function buildDeckFromStoryline({ title, slides }) {
  const builtSlides = (slides ?? []).map((semantic, index) => {
    const layout = pickBestLayout(semantic) ?? "title";
    const entry = getRegistryEntry(layout);
    const mappedContent = denormalize(semantic, layout, entry.defaultContent());
    const content = { ...entry.defaultContent(), ...mappedContent };
    return createSlide({ layout, content, order: index });
  });

  return createDeck({
    title: title ?? "Untitled Deck",
    theme: getTheme(DEFAULT_THEME_ID),
    slides: builtSlides,
  });
}
