import React from "react";
import {
  Type,
  Image as ImageIcon,
  Video as VideoIcon,
  Square,
  Minus,
  Star,
  BarChart3,
  GitCommitHorizontal,
  Quote,
  Code2,
} from "lucide-react";

// One entry per WIDGET_TYPES (freeElementFactory.js) - adding a new widget
// type means adding an entry here too, alongside WIDGET_DEFAULTS and a
// FreeElementRenderer case.
const MENU_ITEMS = [
  { type: "text", label: "Text", icon: Type },
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "video", label: "Video", icon: VideoIcon },
  { type: "shape", label: "Shape", icon: Square },
  { type: "divider", label: "Divider", icon: Minus },
  { type: "icon", label: "Icon", icon: Star },
  { type: "chart", label: "Chart", icon: BarChart3 },
  { type: "timeline", label: "Timeline", icon: GitCommitHorizontal },
  { type: "quote", label: "Quote", icon: Quote },
  { type: "embed", label: "Embed", icon: Code2 },
];

export function InsertWidgetMenu({ onInsert }) {
  return (
    <div
      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#0b2d2b] border border-white/10 rounded-xl p-2 shadow-2xl grid grid-cols-5 gap-1 z-50"
      data-testid="insert-widget-menu"
    >
      {MENU_ITEMS.map(({ type, label, icon: Icon }) => (
        <button
          key={type}
          type="button"
          onClick={() => onInsert(type)}
          title={label}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white text-[11px]"
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
    </div>
  );
}
