import React from "react";
import { Copy, Trash2, ChevronUp, ChevronDown } from "lucide-react";

export function FreeElementToolbar({ onDuplicate, onDelete, onBringForward, onSendBackward }) {
  return (
    <div
      data-free-element-toolbar="true"
      onPointerDown={(event) => event.stopPropagation()}
      className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center gap-0.5 p-1 rounded-lg bg-[#0b2d2b] border border-white/10 shadow-xl pointer-events-auto whitespace-nowrap"
      style={{ transform: "translateX(-50%)" }}
    >
      <button title="Bring forward" onClick={onBringForward} className="p-1.5 rounded text-white/80 hover:bg-white/10 hover:text-white">
        <ChevronUp size={14} />
      </button>
      <button title="Send backward" onClick={onSendBackward} className="p-1.5 rounded text-white/80 hover:bg-white/10 hover:text-white">
        <ChevronDown size={14} />
      </button>
      <div className="w-px h-4 bg-white/10 mx-0.5" />
      <button title="Duplicate" onClick={onDuplicate} className="p-1.5 rounded text-white/80 hover:bg-white/10 hover:text-white">
        <Copy size={14} />
      </button>
      <button title="Delete" onClick={onDelete} className="p-1.5 rounded text-red-300 hover:bg-red-500/20 hover:text-red-200">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
