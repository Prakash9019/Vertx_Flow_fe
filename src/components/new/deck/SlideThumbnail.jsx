import React from "react";
import { getRegistryEntry } from "./SlideRegistry";
import { slideBackgroundStyle } from "./SlideCanvas";
import { SlideThumbnailContent, ThumbnailFreeElement } from "./SlideThumbnailContent";

// The one reusable thumbnail renderer every slide-preview surface (sidebar,
// future remix/AI-generation pickers) should use. It reads exactly the same
// `slide.layout`/`slide.content`/`slide.background`/`slide.freeElements`
// `SlideCanvas` renders - it just renders them non-interactively and small.
export function SlideThumbnail({ slide, className = "" }) {
  if (!slide) {
    return <div className={`w-full aspect-video rounded-md bg-black/30 ${className}`} />;
  }

  const entry = getRegistryEntry(slide.layout);
  const sortedElements = [...(slide.freeElements ?? [])].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      className={`relative w-full aspect-video overflow-hidden rounded-md bg-[#0b2d2b] ${className}`}
      style={slideBackgroundStyle(slide.background)}
    >
      {entry ? <SlideThumbnailContent layout={slide.layout} content={slide.content} /> : null}
      <div className="absolute inset-0">
        {sortedElements.map((element) => (
          <div
            key={element.id}
            className="absolute"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.w}%`,
              height: `${element.h}%`,
              transform: `rotate(${element.rotation}deg)`,
              zIndex: element.zIndex,
            }}
          >
            <ThumbnailFreeElement element={element} />
          </div>
        ))}
      </div>
    </div>
  );
}
