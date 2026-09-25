import React from "react";
import { getRegistryEntry } from "./SlideRegistry";
import { FreeElementLayer } from "./FreeElementLayer";
import { useDeck } from "./DeckContext";
import { normalizeTheme } from "./theme/themeTokens";

// architecture doc §6's two-tier model: a slide with no background override
// (`slide.background == null`) inherits the deck theme's default; an
// explicit override always wins. Selection state stays out of this (it's UI
// state, not persisted document state) - this is purely "what background
// does this slide actually show right now".
export function effectiveBackground(slide, deckTheme) {
  return slide.background ?? deckTheme.defaultBackground;
}

/**
 * Turns a `SlideBackground` (see the spec's discriminated union) into an inline
 * style object for the slide box. Unknown/absent backgrounds render nothing so
 * the surrounding page background shows through.
 */
export function slideBackgroundStyle(background) {
  if (!background || typeof background !== "object") return {};
  switch (background.kind) {
    case "solid":
      return { backgroundColor: background.color };
    case "gradient": {
      const stops = Array.isArray(background.stops) ? background.stops : [];
      if (stops.length === 0) return {};
      const angle = typeof background.angle === "number" ? background.angle : 180;
      return { backgroundImage: `linear-gradient(${angle}deg, ${stops.join(", ")})` };
    }
    case "image":
    case "media": {
      if (!background.url) return {};
      if (background.kind === "media" && background.type === "video") return {};
      return {
        backgroundImage: `url("${background.url.replace(/"/g, '\\"')}")`,
        backgroundSize: background.fit === "contain" ? "contain" : "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }
    default:
      return {};
  }
}

export function SlideCanvas({
  slide,
  selectedElementId = null,
  editingElementId = null,
  onSelectElement = () => {},
  onStartEditing = () => {},
}) {
  const { deck, dispatch } = useDeck();
  const entry = getRegistryEntry(slide.layout);

  if (!entry) {
    console.warn(`SlideCanvas: no registry entry for layout "${slide.layout}"`);
    return null;
  }

  const LayoutComponent = entry.component;
  const background = effectiveBackground(slide, normalizeTheme(deck.theme));
  const isVideoBackground = background?.kind === "media" && background?.type === "video" && background.url;

  return (
    <div
      className="relative w-full aspect-video overflow-hidden"
      data-testid="slide-canvas"
      style={slideBackgroundStyle(background)}
    >
      {isVideoBackground && (
        <video
          data-testid="slide-background-video"
          src={background.url}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          autoPlay
          playsInline
        />
      )}
      {background?.overlay && (
        <div
          data-testid="slide-background-overlay"
          className="absolute inset-0"
          style={{ backgroundColor: background.overlay.color, opacity: background.overlay.opacity }}
        />
      )}
      <LayoutComponent
        key={slide.id}
        content={slide.content}
        onChangeContent={(patch) => dispatch({ type: "UPDATE_SLIDE_CONTENT", slideId: slide.id, content: patch })}
      />
      <FreeElementLayer
        elements={slide.freeElements}
        selectedElementId={selectedElementId}
        editingElementId={editingElementId}
        onSelectElement={onSelectElement}
        onStartEditing={onStartEditing}
        onUpdateElement={(elementId, patch, coalesceId) =>
          dispatch(
            { type: "UPDATE_FREE_ELEMENT", slideId: slide.id, elementId, patch },
            coalesceId ? { coalesce: true, coalesceId } : undefined
          )
        }
        onDeleteElement={(elementId) => dispatch({ type: "REMOVE_FREE_ELEMENT", slideId: slide.id, elementId })}
        onDuplicateElement={(element) => dispatch({ type: "ADD_FREE_ELEMENT", slideId: slide.id, element })}
        onReorderElements={(updates) => {
          const coalesceId = `reorder-${slide.id}-${Date.now()}`;
          updates.forEach(({ id, zIndex }) =>
            dispatch(
              { type: "UPDATE_FREE_ELEMENT", slideId: slide.id, elementId: id, patch: { zIndex } },
              { coalesce: true, coalesceId }
            )
          );
        }}
      />
    </div>
  );
}
