import React from "react";
import { TextWidget } from "./widgets/TextWidget";
import { ImageWidget } from "./widgets/ImageWidget";
import { VideoWidget } from "./widgets/VideoWidget";
import { ShapeWidget } from "./widgets/ShapeWidget";
import { DividerWidget } from "./widgets/DividerWidget";
import { IconWidget } from "./widgets/IconWidget";
import { ChartWidget } from "./widgets/ChartWidget";
import { TimelineWidget } from "./widgets/TimelineWidget";
import { QuoteWidget } from "./widgets/QuoteWidget";
import { EmbedWidget } from "./widgets/EmbedWidget";

// Adding a new widget type only requires a case here plus an entry in
// `freeElementFactory.WIDGET_DEFAULTS` - the interaction engine
// (select/drag/resize/rotate/layer/delete/duplicate) is generic over `type`.
export function FreeElementRenderer({ element, editing, onCommitText, onReplaceSrc }) {
  switch (element.type) {
    case "text":
      return <TextWidget element={element} editing={editing} onCommit={onCommitText} />;
    case "image":
      return <ImageWidget element={element} onReplaceSrc={onReplaceSrc} />;
    case "video":
      return <VideoWidget element={element} onReplaceSrc={onReplaceSrc} />;
    case "shape":
      return <ShapeWidget element={element} />;
    case "divider":
      return <DividerWidget element={element} />;
    case "icon":
      return <IconWidget element={element} />;
    case "chart":
      return <ChartWidget element={element} />;
    case "timeline":
      return <TimelineWidget element={element} />;
    case "quote":
      return <QuoteWidget element={element} />;
    case "embed":
      return <EmbedWidget element={element} onReplaceSrc={onReplaceSrc} />;
    default:
      return <div className="w-full h-full border-2 border-dashed border-white/40" />;
  }
}
