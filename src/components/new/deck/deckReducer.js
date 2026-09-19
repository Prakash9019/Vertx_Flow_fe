import { LAYOUT_IDS, createSlide } from "./deckTypes";
import { getContentMapper } from "./contentMappers";
import { getRegistryEntry } from "./SlideRegistry";

function warnInvalid(action, reason) {
  console.warn(`deckReducer: ignoring ${action.type} - ${reason}`);
}

function findSlideIndex(deck, slideId) {
  return deck.slides.findIndex((s) => s.id === slideId);
}

function renumber(slides) {
  return slides.map((s, index) => ({ ...s, order: index }));
}

// `background` is a discriminated union that (for `gradient`) holds a nested
// `stops` array - a shallow `{ ...background }` would still share that array
// by reference between the original slide and the duplicate.
function cloneBackground(background) {
  if (!background || typeof background !== "object") return background;
  if (background.kind === "gradient" && Array.isArray(background.stops)) {
    return { ...background, stops: [...background.stops] };
  }
  return { ...background };
}

export function deckReducer(deck, action) {
  switch (action.type) {
    case "ADD_SLIDE": {
      if (!LAYOUT_IDS.includes(action.layout)) {
        warnInvalid(action, `unknown layout "${action.layout}"`);
        return deck;
      }
      const newSlide = createSlide({
        layout: action.layout,
        content: action.content ?? {},
        order: deck.slides.length,
      });
      let slides;
      if (action.afterSlideId) {
        const index = findSlideIndex(deck, action.afterSlideId);
        if (index === -1) {
          warnInvalid(action, `afterSlideId "${action.afterSlideId}" not found`);
          return deck;
        }
        slides = [...deck.slides.slice(0, index + 1), newSlide, ...deck.slides.slice(index + 1)];
      } else {
        slides = [...deck.slides, newSlide];
      }
      return { ...deck, slides: renumber(slides) };
    }

    case "DELETE_SLIDE": {
      const index = findSlideIndex(deck, action.slideId);
      if (index === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      const slides = deck.slides.filter((_, i) => i !== index);
      return { ...deck, slides: renumber(slides) };
    }

    case "DUPLICATE_SLIDE": {
      const index = findSlideIndex(deck, action.slideId);
      if (index === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      const original = deck.slides[index];
      const copy = createSlide({
        layout: original.layout,
        content: { ...original.content },
        background: cloneBackground(original.background),
        freeElements: original.freeElements.map((el) => ({ ...el })),
        order: index + 1,
      });
      const slides = [...deck.slides.slice(0, index + 1), copy, ...deck.slides.slice(index + 1)];
      return { ...deck, slides: renumber(slides) };
    }

    case "REORDER_SLIDES": {
      const fromIndex = findSlideIndex(deck, action.slideId);
      if (fromIndex === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      if (action.toIndex < 0 || action.toIndex >= deck.slides.length) {
        warnInvalid(action, `toIndex ${action.toIndex} out of range`);
        return deck;
      }
      const slides = [...deck.slides];
      const [moved] = slides.splice(fromIndex, 1);
      slides.splice(action.toIndex, 0, moved);
      return { ...deck, slides: renumber(slides) };
    }

    case "SET_SLIDE_LAYOUT": {
      if (!LAYOUT_IDS.includes(action.layout)) {
        warnInvalid(action, `unknown layout "${action.layout}"`);
        return deck;
      }
      const index = findSlideIndex(deck, action.slideId);
      if (index === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      const slide = deck.slides[index];
      const mapper = getContentMapper(slide.layout, action.layout);
      const mappedContent = mapper(slide.content);
      // Most layout pairs have no bespoke mapper and fall back to
      // identityMapper, which hands the target layout a foreign content shape.
      // Merging over the target layout's defaults guarantees every field the
      // target layout reads exists, while anything the mapper did produce wins.
      const entry = getRegistryEntry(action.layout);
      const mergedContent = entry
        ? { ...entry.defaultContent(), ...mappedContent }
        : mappedContent;
      const slides = [...deck.slides];
      slides[index] = { ...slide, layout: action.layout, content: mergedContent };
      return { ...deck, slides };
    }

    case "UPDATE_SLIDE_CONTENT": {
      const index = findSlideIndex(deck, action.slideId);
      if (index === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      const slide = deck.slides[index];
      const slides = [...deck.slides];
      slides[index] = { ...slide, content: { ...slide.content, ...action.content } };
      return { ...deck, slides };
    }

    case "SET_SLIDE_BACKGROUND": {
      const index = findSlideIndex(deck, action.slideId);
      if (index === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      const slides = [...deck.slides];
      slides[index] = { ...slides[index], background: action.background };
      return { ...deck, slides };
    }

    case "ADD_FREE_ELEMENT": {
      const index = findSlideIndex(deck, action.slideId);
      if (index === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      const slide = deck.slides[index];
      const slides = [...deck.slides];
      slides[index] = { ...slide, freeElements: [...slide.freeElements, action.element] };
      return { ...deck, slides };
    }

    case "UPDATE_FREE_ELEMENT": {
      const index = findSlideIndex(deck, action.slideId);
      if (index === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      const slide = deck.slides[index];
      const elIndex = slide.freeElements.findIndex((el) => el.id === action.elementId);
      if (elIndex === -1) {
        warnInvalid(action, `elementId "${action.elementId}" not found`);
        return deck;
      }
      const freeElements = [...slide.freeElements];
      freeElements[elIndex] = { ...freeElements[elIndex], ...action.patch };
      const slides = [...deck.slides];
      slides[index] = { ...slide, freeElements };
      return { ...deck, slides };
    }

    case "REMOVE_FREE_ELEMENT": {
      const index = findSlideIndex(deck, action.slideId);
      if (index === -1) {
        warnInvalid(action, `slideId "${action.slideId}" not found`);
        return deck;
      }
      const slide = deck.slides[index];
      const slides = [...deck.slides];
      slides[index] = { ...slide, freeElements: slide.freeElements.filter((el) => el.id !== action.elementId) };
      return { ...deck, slides };
    }

    case "SET_DECK_THEME": {
      if (!action.theme || typeof action.theme !== "object" || !action.theme.colors) {
        warnInvalid(action, "theme is missing or has no colors");
        return deck;
      }
      return { ...deck, theme: action.theme };
    }

    default:
      warnInvalid(action, "unknown action type");
      return deck;
  }
}
