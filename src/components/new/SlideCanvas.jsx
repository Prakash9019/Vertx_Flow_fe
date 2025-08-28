
import React from 'react';

function TextBlock({ block, onChange }) {
  return (
    <textarea
      className="w-full bg-transparent border border-slate-700 rounded-md p-2 resize-none focus:outline-none focus:border-brand"
      value={block.content || ''}
      onChange={(e) => onChange({ ...block, content: e.target.value })}
      rows={block.style === 'heading' ? 2 : 4}
      placeholder={block.style === 'heading' ? 'Heading...' : 'Type here...'}
    />
  );
}

function ImageBlock({ block, onChange }) {
  return (
    <div className="border border-dashed border-slate-700 rounded-md p-4 text-sm text-slate-400 text-center">
      <div className="mb-2">Image Placeholder</div>
      <input
        className="w-full text-xs bg-transparent"
        placeholder="Paste image URL for now"
        value={block.src || ''}
        onChange={(e) => onChange({ ...block, src: e.target.value })}
      />
    </div>
  );
}

function VideoBlock({ block, onChange }) {
  return (
    <div className="border border-dashed border-slate-700 rounded-md p-4 text-sm text-slate-400 text-center">
      <div className="mb-2">Video Placeholder</div>
      <input
        className="w-full text-xs bg-transparent"
        placeholder="Paste video URL for now"
        value={block.src || ''}
        onChange={(e) => onChange({ ...block, src: e.target.value })}
      />
    </div>
  );
}

export default function SlideCanvas({ slide, onUpdate }) {
  if (!slide) return <div className="panel">No slide selected</div>;

  function updateBlock(updated) {
    const blocks = (slide.blocks || []).map((b) => (b.id === updated.id ? updated : b));
    onUpdate({ ...slide, blocks });
  }

  return (
    <div className="panel h-full overflow-y-auto">
      {/* Very simple layout renderer */}
      {slide.layout === 'title' && (
        <div className="space-y-3">
          {slide.blocks.map((b) => (
            b.type === 'text' ? <TextBlock key={b.id} block={b} onChange={updateBlock} /> : null
          ))}
        </div>
      )}

      {slide.layout === 'titleContent' && (
        <div className="space-y-3">
          {slide.blocks.map((b) => (
            b.type === 'text' ? <TextBlock key={b.id} block={b} onChange={updateBlock} /> : null
          ))}
        </div>
      )}

      {slide.layout === 'splitImageText' && (
        <div className="grid grid-cols-2 gap-3">
          {slide.blocks.map((b) =>
            b.type === 'image' ? (
              <ImageBlock key={b.id} block={b} onChange={updateBlock} />
            ) : b.type === 'text' ? (
              <TextBlock key={b.id} block={b} onChange={updateBlock} />
            ) : null
          )}
        </div>
      )}

      {slide.layout === 'video' && (
        <div className="space-y-3">
          {slide.blocks.map((b) =>
            b.type === 'video' ? (
              <VideoBlock key={b.id} block={b} onChange={updateBlock} />
            ) : b.type === 'text' ? (
              <TextBlock key={b.id} block={b} onChange={updateBlock} />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

