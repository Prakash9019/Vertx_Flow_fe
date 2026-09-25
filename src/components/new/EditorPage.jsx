import React, { useState, useEffect, useRef } from 'react';
import { Palette, Plus, Check, Shuffle } from 'lucide-react';
import { PiSelectionBackground } from "react-icons/pi";

import { useParams } from "react-router-dom";
import { DeckProvider, useDeck } from "./deck/DeckContext";
import { SlideCanvas } from "./deck/SlideCanvas";
import { SlideSidebar } from "./deck/SlideSidebar";
import { BackgroundPicker } from "./deck/BackgroundPicker";
import { useDeckLoader } from "./deck/useDeckLoader";
import { useAutosave } from "./deck/useAutosave";
import { reorderedIndexOf, indexAfterDelete, indexAfterInsert } from "./deck/slideSidebarLogic";
import { createDeck, createSlide } from "./deck/deckTypes";
import { getRegistryEntry } from "./deck/SlideRegistry";
import { defaultTitleContent } from "./deck/layouts/TitleLayout";
import { defaultProblemContent } from "./deck/layouts/ProblemLayout";
import { defaultMediaDescriptionContent } from "./deck/layouts/MediaDescriptionLayout";
import { defaultMedia3PointsContent } from "./deck/layouts/Media3PointsLayout";
import { defaultMetricsGridContent } from "./deck/layouts/MetricsGridLayout";
import { defaultTeamGridContent } from "./deck/layouts/TeamGridLayout";
import { defaultCtaContent } from "./deck/layouts/CtaLayout";
import { THEME_REGISTRY, getTheme, DEFAULT_THEME_ID, themeToRootStyle, normalizeTheme } from "./deck/theme/themeTokens";

const LayoutPicker = ({ onSelect, onClose }) => {
    // Only layouts registered in the new deck model's LAYOUT_IDS (Task 2/7) are offered here.
    // Legacy layout-picker options with no equivalent in LAYOUT_IDS (Title Only, Comparison,
    // Quote, etc.) have been removed rather than wired to a nonexistent layout id.
    const layouts = [
        { name: 'Title', id: 'title' },
        { name: 'Problem', id: 'problem' },
        { name: 'Media & Description', id: 'media-description' },
        { name: 'Media & 3 Points', id: 'media-3points' },
        { name: 'Metrics Grid', id: 'metrics-grid' },
        { name: 'Team Grid', id: 'team-grid' },
        { name: 'Call To Action', id: 'cta' },
    ];

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xl bg-opacity-70 flex items-center justify-center z-[100]">
            <div className="bg-[#0b2d2b] border border-white/10 rounded-lg p-8 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-6">Choose a Layout</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto">
                    {layouts.map(layout => (
                        <button
                            key={layout.id}
                            onClick={() => onSelect(layout.id)}
                            className="p-4 border rounded-lg text-white hover:text-black hover:bg-gray-200 hover:transition-all"
                        >
                            {layout.name}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className={`mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300`}
                >
                    Close
                </button>
            </div>
        </div>
    );
}


function seedDeck() {
  return createDeck({
    title: "Untitled Deck",
    theme: getTheme(DEFAULT_THEME_ID),
    slides: [
      createSlide({ layout: "title", content: defaultTitleContent(), order: 0 }),
      createSlide({ layout: "problem", content: defaultProblemContent(), order: 1 }),
      createSlide({ layout: "media-description", content: defaultMediaDescriptionContent(), order: 2 }),
      createSlide({ layout: "media-3points", content: defaultMedia3PointsContent(), order: 3 }),
      createSlide({ layout: "metrics-grid", content: defaultMetricsGridContent(), order: 4 }),
      createSlide({ layout: "team-grid", content: defaultTeamGridContent(), order: 5 }),
      createSlide({ layout: "cta", content: defaultCtaContent(), order: 6 }),
    ],
  });
}

// `/editorPage` (no id) keeps the hardcoded seed deck as an unsaved demo -
// nothing to load, nothing to autosave to. `/editor/:deckId` loads and
// migrates a real persisted deck (see useDeckLoader/useDeckSchema) and
// EditorPageBody's `useAutosave` PATCHes it back on every edit.
export default function EditorPage() {
  const { deckId } = useParams();
  const { status, deck: loadedDeck, error } = useDeckLoader(deckId);
  const fallbackDeck = React.useMemo(() => seedDeck(), []);

  if (deckId) {
    if (status === "loading") {
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-[#021e1d] text-white/70">
          Loading deck...
        </div>
      );
    }
    if (status === "error") {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center gap-2 bg-[#021e1d] text-white">
          <p className="text-red-400">Couldn't load this deck.</p>
          <p className="text-white/50 text-sm">{error?.message ?? "Unknown error"}</p>
        </div>
      );
    }
    return (
      <DeckProvider key={deckId} initialDeck={loadedDeck}>
        <EditorPageBody deckId={deckId} />
      </DeckProvider>
    );
  }

  return (
    <DeckProvider initialDeck={fallbackDeck}>
      <EditorPageBody deckId={null} />
    </DeckProvider>
  );
}

function EditorPageBody({ deckId = null }) {
  const { deck, dispatch } = useDeck();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showBackgroundModal, setshowBackgroundModal] = useState(false);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  const [insertAfterSlideId, setInsertAfterSlideId] = useState(null);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [editingElementId, setEditingElementId] = useState(null);
  // NOTE: building a richer background/theme *picker UI* is out of scope (see the
  // plan's "Explicitly out of scope"). The existing background swatches, however,
  // write through to the deck model: per-slide background lives on
  // `currentSlide.background` and is applied by `SlideCanvas`.
  const isAnimatingRef = useRef(false);

  const currentSlide = deck.slides[currentSlideIndex];
  const saveStatus = useAutosave(deckId, deck);

  // A free element's selection/editing state is scoped to whichever slide is
  // on screen (architecture doc §1: "selection state does not belong in the
  // Deck") - clear it whenever the visible slide changes, whatever caused
  // the change (wheel nav, nav dot, sidebar).
  useEffect(() => {
    setSelectedElementId(null);
    setEditingElementId(null);
  }, [currentSlideIndex]);

  const handleAddSlide = (layoutId) => {
    const entry = getRegistryEntry(layoutId);
    if (!entry) return;
    if (insertAfterSlideId) {
      const newIndex = indexAfterInsert(deck.slides, insertAfterSlideId);
      dispatch({
        type: "ADD_SLIDE",
        layout: layoutId,
        content: entry.defaultContent(),
        afterSlideId: insertAfterSlideId,
      });
      setCurrentSlideIndex(newIndex);
      setInsertAfterSlideId(null);
    } else {
      const newIndex = deck.slides.length;
      dispatch({ type: "ADD_SLIDE", layout: layoutId, content: entry.defaultContent() });
      setCurrentSlideIndex(newIndex);
    }
    setShowLayoutPicker(false);
  };

  const handleThemeChange = (themeId) => {
    dispatch({ type: "SET_DECK_THEME", theme: getTheme(themeId) });
    setShowThemeModal(false);
  };

  // BackgroundPicker edits `SlideBackground` objects directly (architecture
  // doc §6) - `background` here is always a complete, valid SlideBackground,
  // never a swatch key needing translation.
  const handleBackgroundChange = (background) => {
    if (currentSlide) {
      dispatch({ type: "SET_SLIDE_BACKGROUND", slideId: currentSlide.id, background });
    }
  };

  // Clears the slide-level override so it falls back to the deck theme's
  // default background (architecture doc §6's two-tier model).
  const handleUseDefaultBackground = () => {
    if (currentSlide) {
      dispatch({ type: "SET_SLIDE_BACKGROUND", slideId: currentSlide.id, background: null });
    }
  };

  // Remix (architecture doc §4) picks a new layout automatically instead of
  // the user choosing one - REMIX_SLIDE already excludes the slide's current
  // layout, but repeated clicks on the same slide would otherwise ping-pong
  // between the same two best-fit layouts. This tracks, per slide, every
  // layout that slide has already passed through this session and excludes
  // all of them, so successive remixes cycle through fresh options.
  const remixHistoryRef = useRef({});
  const handleRemixSlide = () => {
    if (!currentSlide) return;
    const history = remixHistoryRef.current[currentSlide.id] ?? [];
    dispatch({ type: "REMIX_SLIDE", slideId: currentSlide.id, excludeLayouts: history });
    remixHistoryRef.current[currentSlide.id] = [...history, currentSlide.layout];
  };

  // --- SlideSidebar wiring -------------------------------------------------
  // Slide selection lives on `currentSlideIndex` (a position, not an id) for
  // the pre-existing wheel-nav/nav-dot code below. Every sidebar action that
  // mutates `deck.slides` computes, from the *pre-dispatch* slide list still
  // in scope, the index the slide-of-interest will land at, and sets
  // `currentSlideIndex` to it in the same tick as the dispatch - so the next
  // render shows the right slide instead of a stale index.
  const handleSidebarSelect = (slideId) => {
    const index = deck.slides.findIndex((s) => s.id === slideId);
    if (index !== -1) setCurrentSlideIndex(index);
  };

  const handleSidebarInsertAfter = (slideId) => {
    setInsertAfterSlideId(slideId);
    setShowLayoutPicker(true);
  };

  const handleSidebarDuplicate = (slideId) => {
    const index = deck.slides.findIndex((s) => s.id === slideId);
    if (index === -1) return;
    dispatch({ type: "DUPLICATE_SLIDE", slideId });
    setCurrentSlideIndex(index + 1);
  };

  const handleSidebarDelete = (slideId) => {
    const index = deck.slides.findIndex((s) => s.id === slideId);
    if (index === -1 || deck.slides.length <= 1) return;
    const nextIndex = indexAfterDelete(index, currentSlideIndex, deck.slides.length);
    dispatch({ type: "DELETE_SLIDE", slideId });
    setCurrentSlideIndex(nextIndex);
  };

  const handleSidebarReorder = (slideId, toIndex) => {
    const fromIndex = deck.slides.findIndex((s) => s.id === slideId);
    if (fromIndex === -1) return;
    const clampedTo = Math.max(0, Math.min(toIndex, deck.slides.length - 1));
    if (clampedTo === fromIndex) return;
    const currentId = currentSlide?.id;
    dispatch({ type: "REORDER_SLIDES", slideId, toIndex: clampedTo });
    if (currentId) {
      setCurrentSlideIndex(reorderedIndexOf(deck.slides, fromIndex, clampedTo, currentId));
    }
  };

  const handleSidebarMove = (slideId, direction) => {
    const fromIndex = deck.slides.findIndex((s) => s.id === slideId);
    if (fromIndex === -1) return;
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= deck.slides.length) return;
    handleSidebarReorder(slideId, toIndex);
  };

  // `deck.theme` is a full structured theme today only because the seed
  // deck is hardcoded that way - nothing else constructs a deck yet.
  // `normalizeTheme` is a defensive no-op on an already-current theme
  // (idempotent) so this is zero behavior change now, and keeps
  // `themeToRootStyle` safe once a future deck's `theme` field isn't yet
  // a full structured object (e.g. an old/partial deck loaded before
  // migration runs).
  const deckTheme = normalizeTheme(deck.theme);

  useEffect(() => {
    const handleWheel = (event) => {
      if (isAnimatingRef.current) return;

      const deltaY = event.deltaY;
      let newIndex = currentSlideIndex;

      if (deltaY > 0 && currentSlideIndex < deck.slides.length - 1) {
        newIndex = currentSlideIndex + 1;
      } else if (deltaY < 0 && currentSlideIndex > 0) {
        newIndex = currentSlideIndex - 1;
      }

      if (newIndex !== currentSlideIndex) {
        isAnimatingRef.current = true;
        setCurrentSlideIndex(newIndex);
        setTimeout(() => { isAnimatingRef.current = false; }, 600);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentSlideIndex, deck.slides.length]);

  return (
    <div className="App font-sans antialiased h-screen w-screen flex overflow-hidden" style={themeToRootStyle(deckTheme)}>
      <SlideSidebar
        slides={deck.slides}
        currentSlideId={currentSlide?.id}
        onSelectSlide={handleSidebarSelect}
        onAddSlide={() => setShowLayoutPicker(true)}
        onInsertAfter={handleSidebarInsertAfter}
        onDuplicateSlide={handleSidebarDuplicate}
        onDeleteSlide={handleSidebarDelete}
        onReorderSlide={handleSidebarReorder}
        onMoveSlide={handleSidebarMove}
      />
      <div className="relative flex-1 h-screen overflow-hidden">
      {deckId && (
        <div className="absolute top-3 right-4 z-50 text-xs text-white/50">
          {saveStatus === "saving" && "Saving..."}
          {saveStatus === "saved" && "Saved"}
          {saveStatus === "error" && <span className="text-red-400">Save failed</span>}
        </div>
      )}
      <div className="h-screen w-screen overflow-y-auto">
        {currentSlide ? (
          <SlideCanvas
            slide={currentSlide}
            selectedElementId={selectedElementId}
            editingElementId={editingElementId}
            onSelectElement={setSelectedElementId}
            onStartEditing={setEditingElementId}
          />
        ) : null}
      </div>

      {/* Slide Navigation Bars */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col space-y-3 z-50">
        {deck.slides.map((_, index) => (
          <div
            key={index}
            title={`Slide ${index + 1}`}
            className={`
              h-1 rounded-full transition-all duration-300 ease-in-out cursor-pointer hover:bg-white/70
              ${index === currentSlideIndex ? 'w-8 bg-teal-400' : 'w-3 bg-white/30'}
            `}
            onClick={() => setCurrentSlideIndex(index)}
          ></div>
        ))}
      </div>

      {currentSlideIndex > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl z-50">
          <button
            onClick={() => setShowLayoutPicker(true)}
            className="py-2.5 px-4 text-sm cursor-pointer font-[inter] font-medium rounded-xl border-none bg-transparent flex items-center text-white/90 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Plus size={18} className='mr-2'/> Insert
          </button>

          <div className="w-px h-6 bg-white/10" />

          <button
            onClick={() => setShowThemeModal(true)}
            className="px-4 py-2.5 text-sm cursor-pointer font-[inter] font-medium border-none bg-transparent text-white/90 hover:bg-white/10 hover:text-white transition-colors flex items-center rounded-xl"
          >
            <Palette size={18} className="mr-2" />
            <span>Theme</span>
          </button>

          <div className="w-px h-6 bg-white/10" />

          <button
            onClick={() => setshowBackgroundModal(true)}
            className="px-4 py-2.5 text-sm cursor-pointer font-[inter] font-medium border-none bg-transparent text-white/90 hover:bg-white/10 hover:text-white transition-colors flex items-center rounded-xl"
          >
            <PiSelectionBackground size={18} className='mr-2'/>
            <span>Background</span>
          </button>

          <div className="w-px h-6 bg-white/10" />

          <button
            onClick={handleRemixSlide}
            title="Pick a different layout for this slide, keeping its meaning"
            className="px-4 py-2.5 text-sm cursor-pointer font-[inter] font-medium border-none bg-transparent text-white/90 hover:bg-white/10 hover:text-white transition-colors flex items-center rounded-xl"
          >
            <Shuffle size={18} className="mr-2" />
            <span>Remix</span>
          </button>
        </div>
      )}

      {showLayoutPicker && (
        <LayoutPicker
          onSelect={handleAddSlide}
          onClose={() => {
            setShowLayoutPicker(false);
            setInsertAfterSlideId(null);
          }}
        />
      )}

      {/* Theme Selection Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[100]">
          <div className="bg-[#0b2d2b] border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-6 text-white/90">Choose a Theme</h2>
            <div className="flex gap-4 flex-wrap justify-center max-w-2xl">
              {THEME_REGISTRY.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => handleThemeChange(themeOption.id)}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl w-28 h-28 border-2 transition-colors ${
                    deckTheme.id === themeOption.id ? "border-teal-400" : "border-transparent hover:border-teal-400/50"
                  }`}
                  style={{ backgroundColor: themeOption.colors.background }}
                >
                  {deckTheme.id === themeOption.id && (
                    <Check size={16} className="absolute top-2 right-2" style={{ color: themeOption.colors.primary }} />
                  )}
                  <div className="w-10 h-10 rounded-full mb-2" style={{ backgroundColor: themeOption.colors.primary }} />
                  <span className="text-sm font-medium" style={{ color: themeOption.colors.text }}>
                    {themeOption.name}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowThemeModal(false)}
              className="mt-6 px-5 py-2 bg-white/10 text-white/90 rounded-xl hover:bg-white/20 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showBackgroundModal && currentSlide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[100]">
          <div className="bg-[#0b2d2b] border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-160 w-full mx-4">
            <h2 className="text-xl font-semibold mb-6 text-white/90">Choose a Background</h2>

            <BackgroundPicker
              value={currentSlide.background}
              deckDefault={deckTheme.defaultBackground}
              onChange={handleBackgroundChange}
              onUseDefault={handleUseDefaultBackground}
            />

            <button
              onClick={() => setshowBackgroundModal(false)}
              className="mt-6 px-5 py-2 bg-white/10 text-white/90 rounded-xl hover:bg-white/20 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}