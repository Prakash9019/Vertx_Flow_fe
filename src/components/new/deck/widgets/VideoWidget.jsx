import React, { useState } from "react";
import { Video as VideoIcon } from "lucide-react";
import { uploadAsset } from "../../../../utils/deckApi";

// See ImageWidget.jsx for why this uploads to the backend asset store
// instead of using `URL.createObjectURL`.
export function VideoWidget({ element, onReplaceSrc }) {
  const src = element.props.src;
  const [status, setStatus] = useState("idle"); // idle | uploading | error

  if (!src) {
    return (
      <label className="w-full h-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/40 bg-white/5 text-white/60 cursor-pointer">
        <VideoIcon size={24} />
        <span className="text-xs">
          {status === "uploading" ? "Uploading…" : status === "error" ? "Upload failed - click to retry" : "Click to add video"}
        </span>
        <input
          type="file"
          accept="video/*"
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

  return (
    <video
      src={src}
      className="w-full h-full object-cover pointer-events-none"
      controls={false}
      muted
      loop
      autoPlay
    />
  );
}
