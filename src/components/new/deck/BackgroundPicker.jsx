import React from "react";
import { slideBackgroundStyle } from "./SlideCanvas";

const KIND_LABELS = [
  { kind: "solid", label: "Solid" },
  { kind: "gradient", label: "Gradient" },
  { kind: "image", label: "Image" },
  { kind: "media", label: "Video" },
];

function baseForKind(kind, current) {
  switch (kind) {
    case "solid":
      return { kind: "solid", color: current.color ?? "#0b2d2b" };
    case "gradient":
      return { kind: "gradient", stops: current.stops ?? ["#0b2d2b", "#062421"], angle: current.angle ?? 180 };
    case "image":
      return { kind: "image", url: current.kind === "image" ? current.url ?? "" : "", fit: current.fit ?? "cover" };
    case "media":
      return { kind: "media", type: "video", url: current.kind === "media" ? current.url ?? "" : "" };
    default:
      return { kind: "solid", color: "#0b2d2b" };
  }
}

// Edits a `SlideBackground` object directly - the live preview at the bottom
// and the applied result can never diverge because they render from the
// exact same data, replacing the old BACKGROUND_PRESET_MODELS hand-mapped
// Tailwind-swatch approximation (architecture doc §6).
//
// `value` is the slide's own (possibly null) background override; `null`
// means "inherit the deck theme's default," shown here as its own selectable
// option rather than a hidden default.
export function BackgroundPicker({ value, deckDefault, onChange, onUseDefault }) {
  const isOverride = value != null;
  const effective = value ?? deckDefault ?? { kind: "solid", color: "#0b2d2b" };
  const { kind } = effective;
  const supportsOverlay = kind === "image" || kind === "media" || kind === "gradient";

  function patch(fields) {
    onChange({ ...effective, ...fields });
  }

  function switchKind(newKind) {
    onChange({ ...baseForKind(newKind, effective), overlay: effective.overlay });
  }

  function setOverlayColor(color) {
    patch({ overlay: { color, opacity: effective.overlay?.opacity ?? 0.4 } });
  }

  function setOverlayOpacity(opacity) {
    patch({ overlay: { color: effective.overlay?.color ?? "#000000", opacity } });
  }

  function clearOverlay() {
    const { overlay, ...rest } = effective;
    onChange(rest);
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-md text-white/90">
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={onUseDefault}
          aria-pressed={!isOverride}
          className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
            !isOverride ? "border-teal-400 bg-teal-400/10" : "border-white/10 hover:border-white/30"
          }`}
        >
          Theme default
        </button>
        {KIND_LABELS.map(({ kind: k, label }) => (
          <button
            key={k}
            type="button"
            onClick={() => switchKind(k)}
            aria-pressed={isOverride && kind === k}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              isOverride && kind === k ? "border-teal-400 bg-teal-400/10" : "border-white/10 hover:border-white/30"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {!isOverride && (
        <p className="text-xs text-white/50">
          This slide is using the deck theme's default background. Pick a kind above to override it just for this slide.
        </p>
      )}

      {isOverride && kind === "solid" && (
        <label className="flex items-center gap-3 text-sm">
          Color
          <input
            type="color"
            aria-label="Background color"
            value={effective.color}
            onChange={(event) => patch({ color: event.target.value })}
          />
        </label>
      )}

      {isOverride && kind === "gradient" && (
        <div className="flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-3">
            From
            <input
              type="color"
              aria-label="Gradient start color"
              value={effective.stops[0]}
              onChange={(event) => patch({ stops: [event.target.value, effective.stops[1]] })}
            />
          </label>
          <label className="flex items-center gap-3">
            To
            <input
              type="color"
              aria-label="Gradient end color"
              value={effective.stops[1]}
              onChange={(event) => patch({ stops: [effective.stops[0], event.target.value] })}
            />
          </label>
          <label className="flex items-center gap-3">
            Angle
            <input
              type="number"
              aria-label="Gradient angle"
              value={effective.angle}
              onChange={(event) => patch({ angle: Number(event.target.value) })}
              className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1"
            />
          </label>
        </div>
      )}

      {isOverride && kind === "image" && (
        <div className="flex flex-col gap-2 text-sm">
          <label className="flex flex-col gap-1">
            Image URL
            <input
              type="text"
              value={effective.url}
              onChange={(event) => patch({ url: event.target.value })}
              placeholder="https://..."
              className="bg-white/5 border border-white/10 rounded px-2 py-1"
            />
          </label>
          <label className="flex items-center gap-3">
            Fit
            <select
              value={effective.fit}
              onChange={(event) => patch({ fit: event.target.value })}
              className="bg-white/5 border border-white/10 rounded px-2 py-1"
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
            </select>
          </label>
        </div>
      )}

      {isOverride && kind === "media" && (
        <label className="flex flex-col gap-1 text-sm">
          Video URL
          <input
            type="text"
            value={effective.url}
            onChange={(event) => patch({ url: event.target.value })}
            placeholder="https://..."
            className="bg-white/5 border border-white/10 rounded px-2 py-1"
          />
        </label>
      )}

      {isOverride && supportsOverlay && (
        <div className="flex flex-col gap-2 text-sm border-t border-white/10 pt-3">
          <div className="flex items-center justify-between">
            <span>Overlay</span>
            {effective.overlay ? (
              <button type="button" onClick={clearOverlay} className="text-xs text-white/50 underline">
                Remove
              </button>
            ) : null}
          </div>
          <label className="flex items-center gap-3">
            Color
            <input
              type="color"
              aria-label="Overlay color"
              value={effective.overlay?.color ?? "#000000"}
              onChange={(event) => setOverlayColor(event.target.value)}
            />
          </label>
          <label className="flex items-center gap-3">
            Opacity
            <input
              type="range"
              aria-label="Overlay opacity"
              min="0"
              max="1"
              step="0.05"
              value={effective.overlay?.opacity ?? 0}
              onChange={(event) => setOverlayOpacity(Number(event.target.value))}
            />
          </label>
        </div>
      )}

      <div
        data-testid="background-preview"
        className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10"
        style={slideBackgroundStyle(effective)}
      >
        {effective.kind === "media" && effective.type === "video" && effective.url ? (
          <video src={effective.url} className="absolute inset-0 w-full h-full object-cover" muted loop autoPlay playsInline />
        ) : null}
        {effective.overlay ? (
          <div
            data-testid="background-preview-overlay"
            className="absolute inset-0"
            style={{ backgroundColor: effective.overlay.color, opacity: effective.overlay.opacity }}
          />
        ) : null}
      </div>
    </div>
  );
}
