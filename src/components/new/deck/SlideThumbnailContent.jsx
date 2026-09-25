import React from "react";
import { ShapeWidget } from "./widgets/ShapeWidget";
import { DividerWidget } from "./widgets/DividerWidget";
import { IconWidget } from "./widgets/IconWidget";

// A read-only stand-in for `RichText`: same `value`/`className` shape, no
// Froala instance. Thumbnails render many slides at once, so mounting a real
// Froala editor per text field per thumbnail is not viable.
function Html({ value, className }) {
  if (!value) return null;
  return <div className={className} dangerouslySetInnerHTML={{ __html: value }} />;
}

// Mirrors each real layout's structure/fields (see `./layouts/*.jsx`) at
// thumbnail scale, so a thumbnail is always derived from the same
// `slide.content` the full `SlideCanvas` renders - never separate hardcoded
// preview content.
export function SlideThumbnailContent({ layout, content }) {
  switch (layout) {
    case "title":
      return (
        <div className="flex flex-col items-center justify-center h-full w-full px-[6%] text-center gap-0.5 overflow-hidden">
          <Html value={content.title} className="text-[7px] font-bold leading-tight line-clamp-2" />
          {content.subtitle ? (
            <Html value={content.subtitle} className="text-[5px] opacity-60 leading-tight line-clamp-1" />
          ) : null}
        </div>
      );

    case "problem":
      return (
        <div className="flex flex-col items-center justify-center h-full w-full px-[6%] gap-1 overflow-hidden">
          <Html value={content.heading} className="text-[7px] font-bold text-center leading-tight line-clamp-1" />
          <Html value={content.body} className="text-[5px] opacity-80 leading-tight line-clamp-3" />
        </div>
      );

    case "media-description": {
      const mediaBox = content.media?.url ? (
        <img src={content.media.url} alt="" className="flex-1 h-full rounded object-cover" />
      ) : (
        <div className="flex-1 h-[70%] bg-white/10 rounded" />
      );
      const textBox = (
        <div className="flex-1 flex flex-col justify-center gap-0.5 overflow-hidden">
          <Html value={content.heading} className="text-[6px] font-bold leading-tight line-clamp-2" />
          <Html value={content.body} className="text-[5px] opacity-80 leading-tight line-clamp-3" />
        </div>
      );
      return (
        <div className="flex items-center h-full w-full px-[6%] gap-1.5 overflow-hidden">
          {content.mediaPosition === "left" ? mediaBox : textBox}
          {content.mediaPosition === "left" ? textBox : mediaBox}
        </div>
      );
    }

    case "media-3points":
      return (
        <div className="flex flex-col h-full w-full px-[6%] py-[5%] gap-1 overflow-hidden">
          <Html value={content.heading} className="text-[6px] font-bold text-center leading-tight line-clamp-1" />
          <div className="flex-1 flex gap-1.5 mt-0.5 min-h-0">
            {content.media?.url ? (
              <img src={content.media.url} alt="" className="flex-1 rounded object-cover" />
            ) : (
              <div className="flex-1 bg-white/10 rounded" />
            )}
            <div className="flex-1 flex flex-col gap-1 justify-center overflow-hidden">
              {(content.points ?? []).slice(0, 3).map((point, index) => (
                <Html
                  key={index}
                  value={point.title}
                  className="text-[5px] font-semibold leading-tight line-clamp-1"
                />
              ))}
            </div>
          </div>
        </div>
      );

    case "metrics-grid":
      return (
        <div className="flex flex-col h-full w-full px-[6%] py-[5%] gap-1 overflow-hidden">
          <Html value={content.heading} className="text-[6px] font-bold text-center leading-tight line-clamp-1" />
          <div className="flex-1 grid grid-cols-3 gap-1 items-center">
            {(content.metrics ?? []).map((metric, index) => (
              <div key={index} className="text-center overflow-hidden">
                <Html value={metric.value} className="text-[7px] font-bold leading-tight line-clamp-1" />
                <Html value={metric.label} className="text-[4px] opacity-70 leading-tight line-clamp-1" />
              </div>
            ))}
          </div>
        </div>
      );

    case "team-grid":
      return (
        <div className="flex flex-col h-full w-full px-[6%] py-[5%] gap-1 overflow-hidden">
          <Html value={content.heading} className="text-[6px] font-bold text-center leading-tight line-clamp-1" />
          <div className="flex-1 grid grid-cols-3 gap-1 items-start">
            {(content.members ?? []).slice(0, 3).map((member, index) => (
              <div key={index} className="text-center flex flex-col items-center gap-0.5 overflow-hidden">
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt="" className="w-[40%] aspect-square rounded-full object-cover" />
                ) : (
                  <div className="w-[40%] aspect-square rounded-full bg-white/10" />
                )}
                <Html value={member.name} className="text-[4px] font-semibold leading-tight line-clamp-1" />
              </div>
            ))}
          </div>
        </div>
      );

    case "cta":
      return (
        <div className="flex flex-col items-center justify-center h-full w-full px-[6%] text-center gap-0.5 overflow-hidden">
          <Html value={content.heading} className="text-[7px] font-bold leading-tight line-clamp-1" />
          <Html value={content.body} className="text-[5px] opacity-80 leading-tight line-clamp-2" />
          {content.buttonLabel ? (
            <Html
              value={content.buttonLabel}
              className="text-[4px] mt-0.5 px-1.5 py-0.5 rounded-full bg-teal-400 text-black font-semibold inline-block"
            />
          ) : null}
        </div>
      );

    default:
      return null;
  }
}

// Presence in a slide's `freeElements` (not the full interactive
// select/drag/resize engine `FreeElementRenderer` drives) - "where practical"
// per the brief: real media/shape/divider/icon widgets are already pure
// percentage-sized presentational components, so they're reused as-is; text
// gets a small static font size instead of the widget's fixed `text-base`.
export function ThumbnailFreeElement({ element }) {
  switch (element.type) {
    case "text":
      return (
        <div
          className="w-full h-full overflow-hidden text-white leading-tight"
          style={{ fontSize: "6px" }}
          dangerouslySetInnerHTML={{ __html: element.props.html ?? "" }}
        />
      );
    case "image":
      return element.props.src ? (
        <img src={element.props.src} alt="" draggable={false} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-white/10" />
      );
    case "video":
      return element.props.src ? (
        <video src={element.props.src} className="w-full h-full object-cover" muted />
      ) : (
        <div className="w-full h-full bg-white/10" />
      );
    case "shape":
      return <ShapeWidget element={element} />;
    case "divider":
      return <DividerWidget element={element} />;
    case "icon":
      return <IconWidget element={element} />;
    default:
      return null;
  }
}
