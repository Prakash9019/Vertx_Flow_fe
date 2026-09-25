import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { uploadAsset } from "../../../../utils/deckApi";

// `props.src` empty = not-yet-uploaded placeholder. The picked file is
// uploaded to the backend's GCS-backed asset store (not
// `URL.createObjectURL`, which produces a blob URL that stops resolving
// after a refresh - see EDITOR-V2-STATUS.md's real-media-upload gap) so the
// resulting `src` is a real, persistent URL that survives autosave/reload.
export function ImageWidget({ element, onReplaceSrc }) {
  const src = element.props.src;
  const [status, setStatus] = useState("idle"); // idle | uploading | error

  if (!src) {
    return (
      <label className="w-full h-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/40 bg-white/5 text-white/60 cursor-pointer">
        <ImageIcon size={24} />
        <span className="text-xs">
          {status === "uploading" ? "Uploading…" : status === "error" ? "Upload failed - click to retry" : "Click to add image"}
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onPointerDown={(event) => event.stopPropagation()}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setStatus("uploading");
            uploadAsset(file)
              .then((url) => onReplaceSrc?.(url))
              .catch(() => setStatus("error"));
          }}
        />
      </label>
    );
  }

  return <img src={src} alt={element.props.alt ?? ""} role="img" draggable={false} className="w-full h-full object-cover" />;
}
