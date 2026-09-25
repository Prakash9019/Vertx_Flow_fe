import React from "react";
import { Image as ImageIcon } from "lucide-react";

// `props.src` empty = not-yet-uploaded placeholder. Wiring an actual upload
// flow is future work (Media/Insert Widget engine already covers the
// interaction shell - drag/resize/replace-src is all this needs today).
export function ImageWidget({ element, onReplaceSrc }) {
  const src = element.props.src;

  if (!src) {
    return (
      <label className="w-full h-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/40 bg-white/5 text-white/60 cursor-pointer">
        <ImageIcon size={24} />
        <span className="text-xs">Click to add image</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onPointerDown={(event) => event.stopPropagation()}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            onReplaceSrc?.(url);
          }}
        />
      </label>
    );
  }

  return <img src={src} alt={element.props.alt ?? ""} role="img" draggable={false} className="w-full h-full object-cover" />;
}
