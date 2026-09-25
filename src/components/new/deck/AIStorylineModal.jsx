import React, { useState } from "react";
import aiApi from "../../../utils/aiApi";
import deckApi from "../../../utils/deckApi";
import { buildDeckFromStoryline } from "./storylineToDeck";

const MIN_SLIDES = 3;
const MAX_SLIDES = 15;

export default function AIStorylineModal({ onClose, onDeckCreated }) {
  const [prompt, setPrompt] = useState("");
  const [slideCount, setSlideCount] = useState(8);
  const [status, setStatus] = useState("idle"); // idle | generating | error
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Describe your pitch or topic first.");
      return;
    }
    setStatus("generating");
    setError(null);
    try {
      const res = await aiApi.generateStoryline(prompt.trim(), slideCount);
      const storyline = res.data?.data;
      const deck = buildDeckFromStoryline(storyline);
      const createRes = await deckApi.createDeck(deck);
      const deckId = createRes.data?.data?._id;
      onDeckCreated(deckId);
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.message || "Failed to generate storyline. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a2e2c] border border-white/10 rounded-xl w-full max-w-lg p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Generate deck with AI</h2>

        <label className="block text-sm text-white/70 mb-1">
          Describe your pitch or topic
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={status === "generating"}
          rows={4}
          placeholder="e.g. A B2B SaaS tool that helps restaurants manage inventory in real time"
          className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-sm mb-4 disabled:opacity-50"
        />

        <label className="block text-sm text-white/70 mb-1">Number of slides</label>
        <input
          type="number"
          min={MIN_SLIDES}
          max={MAX_SLIDES}
          value={slideCount}
          disabled={status === "generating"}
          onChange={(e) => setSlideCount(Number(e.target.value))}
          className="w-24 rounded-lg bg-white/5 border border-white/10 p-2 text-sm mb-4 disabled:opacity-50"
        />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={status === "generating"}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={status === "generating"}
            className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 disabled:opacity-50 font-medium"
          >
            {status === "generating" ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}
