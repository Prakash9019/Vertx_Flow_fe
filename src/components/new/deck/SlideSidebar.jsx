import React, { useEffect, useRef, useState } from "react";
import { Plus, MoreVertical, Copy, Trash2, ChevronUp, ChevronDown, CornerDownRight } from "lucide-react";
import { SlideThumbnail } from "./SlideThumbnail";

function SlideMenu({ onDuplicate, onDelete, onInsertAfter, onMoveUp, onMoveDown, canDelete, canMoveUp, canMoveDown, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onClose();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [onClose]);

  return (
    <div
      ref={ref}
      data-slide-menu
      className="absolute right-1 top-7 z-20 w-40 rounded-lg bg-[#0b2d2b] border border-white/10 shadow-2xl py-1 text-xs"
    >
      <button
        onClick={() => { onDuplicate(); onClose(); }}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-white/90 hover:bg-white/10"
      >
        <Copy size={13} /> Duplicate
      </button>
      <button
        onClick={() => { onInsertAfter(); onClose(); }}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-white/90 hover:bg-white/10"
      >
        <CornerDownRight size={13} /> Insert after
      </button>
      {canMoveUp && (
        <button
          onClick={() => { onMoveUp(); onClose(); }}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-white/90 hover:bg-white/10"
        >
          <ChevronUp size={13} /> Move up
        </button>
      )}
      {canMoveDown && (
        <button
          onClick={() => { onMoveDown(); onClose(); }}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-white/90 hover:bg-white/10"
        >
          <ChevronDown size={13} /> Move down
        </button>
      )}
      <div className="my-1 h-px bg-white/10" />
      <button
        onClick={() => { if (canDelete) { onDelete(); onClose(); } }}
        disabled={!canDelete}
        title={canDelete ? undefined : "A deck needs at least one slide"}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-red-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Trash2 size={13} /> Delete
      </button>
    </div>
  );
}

function SlideSidebarItem({
  slide,
  index,
  isActive,
  isOnlySlide,
  onSelect,
  onDuplicate,
  onDelete,
  onInsertAfter,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  isDropTarget,
  dragHandlers,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const itemRef = useRef(null);

  // Keeps the active thumbnail visible without the caller having to know
  // about sidebar scroll internals - important once decks routinely have
  // 10+ AI-generated slides.
  useEffect(() => {
    if (isActive) itemRef.current?.scrollIntoView({ block: "nearest" });
  }, [isActive]);

  return (
    <div
      ref={itemRef}
      data-slide-id={slide.id}
      draggable
      onDragStart={(event) => dragHandlers.onDragStart(event, slide.id)}
      onDragOver={(event) => dragHandlers.onDragOver(event, index)}
      onDrop={(event) => dragHandlers.onDrop(event, index)}
      onDragEnd={dragHandlers.onDragEnd}
      onClick={() => onSelect(slide.id)}
      className={`relative group rounded-lg p-1 cursor-pointer border transition-colors ${
        isActive ? "border-teal-400 bg-white/10" : "border-transparent hover:border-white/20"
      } ${isDropTarget ? "ring-2 ring-teal-300" : ""}`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[10px] text-white/50 w-4 text-right">{index + 1}</span>
        <div className="flex-1" />
        <button
          onClick={(event) => { event.stopPropagation(); setMenuOpen((open) => !open); }}
          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition-opacity"
          title="Slide options"
        >
          <MoreVertical size={12} />
        </button>
      </div>
      <SlideThumbnail slide={slide} />
      {menuOpen && (
        <SlideMenu
          onDuplicate={() => onDuplicate(slide.id)}
          onDelete={() => onDelete(slide.id)}
          onInsertAfter={() => onInsertAfter(slide.id)}
          onMoveUp={() => onMoveUp(slide.id)}
          onMoveDown={() => onMoveDown(slide.id)}
          canDelete={!isOnlySlide}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}

// The persistent deck-navigation panel: thumbnails derived from the live
// deck (never hardcoded), add/insert/duplicate/delete/reorder all routed
// through the caller's existing `deckReducer` actions.
export function SlideSidebar({
  slides,
  currentSlideId,
  onSelectSlide,
  onAddSlide,
  onInsertAfter,
  onDuplicateSlide,
  onDeleteSlide,
  onReorderSlide,
  onMoveSlide,
}) {
  const draggedIdRef = useRef(null);
  const [dropIndex, setDropIndex] = useState(null);

  const handleDragStart = (event, slideId) => {
    draggedIdRef.current = slideId;
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event, index) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDropIndex(index);
  };

  const handleDrop = (event, index) => {
    event.preventDefault();
    const slideId = draggedIdRef.current;
    draggedIdRef.current = null;
    setDropIndex(null);
    if (!slideId) return;
    onReorderSlide(slideId, index);
  };

  const handleDragEnd = () => {
    draggedIdRef.current = null;
    setDropIndex(null);
  };

  return (
    <div className="w-56 shrink-0 h-screen bg-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col">
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {slides.map((slide, index) => (
          <SlideSidebarItem
            key={slide.id}
            slide={slide}
            index={index}
            isActive={slide.id === currentSlideId}
            isOnlySlide={slides.length <= 1}
            onSelect={onSelectSlide}
            onDuplicate={onDuplicateSlide}
            onDelete={onDeleteSlide}
            onInsertAfter={onInsertAfter}
            onMoveUp={(id) => onMoveSlide(id, "up")}
            onMoveDown={(id) => onMoveSlide(id, "down")}
            canMoveUp={index > 0}
            canMoveDown={index < slides.length - 1}
            isDropTarget={dropIndex === index}
            dragHandlers={{
              onDragStart: handleDragStart,
              onDragOver: handleDragOver,
              onDrop: handleDrop,
              onDragEnd: handleDragEnd,
            }}
          />
        ))}
      </div>
      <div className="p-3 border-t border-white/10">
        <button
          onClick={onAddSlide}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-white/90 bg-white/5 hover:bg-white/10 transition-colors"
        >
          <Plus size={16} /> Add Slide
        </button>
      </div>
    </div>
  );
}
