
import React from 'react';

export default function Toolbar({ onSave, onSaveAs, onAddSlide, onPreview }) {
  return (
    <div className="panel flex items-center justify-between mb-3">
      <div className="text-sm font-medium">Editor</div>
      <div className="flex gap-2">
        <button className="btn-ghost" onClick={onAddSlide}>
          + Add Slide
        </button>
        <button className="btn-ghost" onClick={onPreview}>
          Preview
        </button>
        <button className="btn-ghost" onClick={onSaveAs}>
          Save As
        </button>
        <button className="btn-primary" onClick={onSave}>
          Save
        </button>
      </div>
    </div>
  );
}

