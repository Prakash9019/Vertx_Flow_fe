import React from "react";
import { getRegistryEntry } from "./SlideRegistry";
import { FreeElementLayer } from "./FreeElementLayer";
import { useDeck } from "./DeckContext";

export function SlideCanvas({ slide }) {
  const { dispatch } = useDeck();
  const entry = getRegistryEntry(slide.layout);

  if (!entry) {
    console.warn(`SlideCanvas: no registry entry for layout "${slide.layout}"`);
    return null;
  }

  const LayoutComponent = entry.component;

  return (
    <div className="relative w-full aspect-video">
      <LayoutComponent
        content={slide.content}
        onChangeContent={(patch) => dispatch({ type: "UPDATE_SLIDE_CONTENT", slideId: slide.id, content: patch })}
      />
      <FreeElementLayer
        elements={slide.freeElements}
        onUpdateElement={(elementId, patch) => dispatch({ type: "UPDATE_FREE_ELEMENT", slideId: slide.id, elementId, patch })}
      />
    </div>
  );
}
