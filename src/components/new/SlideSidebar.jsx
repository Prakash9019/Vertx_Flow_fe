
import React from 'react';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SlideItem({ slide, index, current, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : undefined };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-2 rounded-md min-h-screen flex flex-col justify-center items-center border-2 cursor-pointer ${current === index ? 'border-brand bg-slate-800' : 'border-slate-800 bg-slate-900/40'} mb-2`}
      onClick={() => onSelect(index)}
      {...attributes}
      {...listeners}
    >
      <div className="text-2xl text-slate-400 mb-2 mt-4">Slide {index + 1}</div>
      <div className="thumb h-20">{slide.layout}</div>
    </div>
  );
}

export default function SlideSidebar({ slides, setSlides, currentIndex, setCurrentIndex }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id);
      const newIndex = slides.findIndex((s) => s.id === over.id);
      const newSlides = arrayMove(slides, oldIndex, newIndex);
      setSlides(newSlides);
      setCurrentIndex(newIndex);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={slides.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        {slides.map((s, i) => (
          <SlideItem key={s.id} slide={s} index={i} current={currentIndex} onSelect={setCurrentIndex} />
        ))}
      </SortableContext>
    </DndContext>
  );
}

