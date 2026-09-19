import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import deckApi from "../../utils/deckApi";
import { getTheme, DEFAULT_THEME_ID } from "./deck/theme/themeTokens";

export default function DeckListPage() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    deckApi
      .getDecks()
      .then((res) => {
        if (cancelled) return;
        setDecks(res.data?.data ?? []);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await deckApi.createDeck({ title: "Untitled Deck", theme: getTheme(DEFAULT_THEME_ID), slides: [] });
      const deckId = res.data?.data?._id;
      navigate(`/editor/${deckId}`);
    } catch (error) {
      console.error("Failed to create deck:", error);
      setCreating(false);
    }
  };

  const handleDelete = async (deckId) => {
    try {
      await deckApi.deleteDeck(deckId);
      setDecks((prev) => prev.filter((d) => d._id !== deckId));
    } catch (error) {
      console.error("Failed to delete deck:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#021e1d] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">My Decks</h1>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 disabled:opacity-50 font-medium"
          >
            {creating ? "Creating..." : "Create New Deck"}
          </button>
        </div>

        {status === "loading" && <p className="text-white/60">Loading decks...</p>}
        {status === "error" && <p className="text-red-400">Failed to load decks.</p>}

        {status === "ready" && decks.length === 0 && (
          <p className="text-white/60">No decks yet. Create your first one.</p>
        )}

        <div className="space-y-3">
          {decks.map((deck) => (
            <div
              key={deck._id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div>
                <div className="font-medium">{deck.title || "Untitled Deck"}</div>
                {deck.updatedAt && (
                  <div className="text-xs text-white/40">
                    Updated {new Date(deck.updatedAt).toLocaleString()}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/editor/${deck._id}`)}
                  className="px-3 py-1.5 text-sm rounded-lg bg-white/10 hover:bg-white/20"
                >
                  Open
                </button>
                <button
                  onClick={() => handleDelete(deck._id)}
                  className="px-3 py-1.5 text-sm rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
