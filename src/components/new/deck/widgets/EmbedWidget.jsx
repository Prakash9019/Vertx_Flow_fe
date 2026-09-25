import React, { useState } from "react";
import { Link as LinkIcon } from "lucide-react";

// Mirrors ImageWidget/VideoWidget's placeholder-then-render shape, but takes
// a pasted URL instead of an uploaded file. Stores it under `props.src` (not
// `props.url`) so it reuses FreeElementLayer's existing generic
// onReplaceSrc(elementId, url) wiring with no change to that file.
export function EmbedWidget({ element, onReplaceSrc }) {
  const src = element.props.src;
  const [draft, setDraft] = useState("");

  if (!src) {
    return (
      <form
        className="w-full h-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/40 bg-white/5 text-white/60 p-3"
        onPointerDown={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          if (draft.trim()) onReplaceSrc?.(draft.trim());
        }}
      >
        <LinkIcon size={20} />
        <input
          type="url"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Paste an embed URL"
          className="w-full text-xs bg-transparent border border-white/20 rounded px-2 py-1 text-white placeholder-white/40"
        />
        <button type="submit" className="text-xs underline">
          Embed
        </button>
      </form>
    );
  }

  return <iframe src={src} title="Embedded content" className="w-full h-full border-0" />;
}
