import React, { useState } from "react";
import deckApi from "../../../utils/deckApi";
import { TEMPLATE_LIBRARY, buildDeckFromTemplate } from "./templateLibrary";

// Mirrors AIStorylineModal's tail (build a Deck, POST it, hand the new id
// back to the caller) but with a curated static template instead of an AI
// call - no generation step, so picking a card creates the deck immediately.
export default function TemplateGalleryModal({ onClose, onDeckCreated }) {
  const [creatingId, setCreatingId] = useState(null);
  const [error, setError] = useState(null);

  const handlePick = async (template) => {
    setCreatingId(template.id);
    setError(null);
    try {
      const deck = buildDeckFromTemplate(template);
      const createRes = await deckApi.createDeck(deck);
      const deckId = createRes.data?.data?._id;
      onDeckCreated(deckId);
    } catch (err) {
      setCreatingId(null);
      setError(err.response?.data?.message || "Failed to create deck from template. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a2e2c] border border-white/10 rounded-xl w-full max-w-2xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Start from a template</h2>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
          {TEMPLATE_LIBRARY.map((template) => (
            <button
              key={template.id}
              onClick={() => handlePick(template)}
              disabled={creatingId !== null}
              className="text-left p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50"
            >
              <div className="text-xs text-teal-300 uppercase tracking-wide mb-1">{template.category}</div>
              <div className="font-medium">{template.name}</div>
              <div className="text-xs text-white/60 mt-1">{template.description}</div>
              <div className="text-xs text-white/40 mt-2">
                {creatingId === template.id ? "Creating..." : `${template.slides.length} slides`}
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            disabled={creatingId !== null}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
