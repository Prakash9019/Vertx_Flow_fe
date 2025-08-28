
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Toolbar from './Toolbar';
import SlideSidebar from './SlideSidebar';
import SlideCanvas from './SlideCanvas';
import Preview from './Preview';
import AddSlide from './AddSlide';

function newId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

const LAYOUTS = {
  title: () => ({
    id: newId('s'),
    layout: 'title',
    blocks: [
      { id: newId('b'), type: 'text', style: 'heading', content: 'Slide title' },
      { id: newId('b'), type: 'text', style: 'paragraph', content: 'Subtitle or description' },
    ],
  }),
  titleContent: () => ({
    id: newId('s'),
    layout: 'titleContent',
    blocks: [
      { id: newId('b'), type: 'text', style: 'heading', content: 'Section title' },
      { id: newId('b'), type: 'text', style: 'paragraph', content: 'Body content here...' },
    ],
  }),
  splitImageText: () => ({
    id: newId('s'),
    layout: 'splitImageText',
    blocks: [
      { id: newId('b'), type: 'image', src: '', alt: 'Placeholder' },
      { id: newId('b'), type: 'text', style: 'paragraph', content: 'Describe the visual' },
    ],
  }),
  video: () => ({
    id: newId('s'),
    layout: 'video',
    blocks: [
      { id: newId('b'), type: 'video', src: '', alt: 'Demo' },
      { id: newId('b'), type: 'text', style: 'heading', content: 'Demo' },
    ],
  }),
};

export default function EditorPage() {
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`http://localhost:5000/api/decks/${id}`);
        setDeck(res.data);
        setSlides(res.data.slides || []);
        setCurrent(0);
      } catch (err) {
        alert('Failed to load deck. Returning to list.');
        // navigate('/');
      }
    }
    load();
  }, [id, navigate]);

  function updateCurrentSlide(newSlide) {
    const newSlides = slides.map((s, i) => (i === current ? newSlide : s));
    setSlides(newSlides);
  }

  async function handleSave() {
    const payload = {
      ...(deck || {}),
      slides,
    };
    try {
      await axios.put(`http://localhost:5000/api/decks/${id}`, payload);
      alert('Deck saved successfully!');
    } catch (err) {
      alert('Failed to save deck.');
    }
  }

  async function handleSaveAs() {
    const newId = `deck-${Date.now()}`;
    const payload = {
      ...deck,
      id: newId,
      title: (deck?.title || 'Untitled') + ' (Copy)',
      createdAt: new Date().toISOString(),
      slides,
    };
    try {
      await axios.post(`http://localhost:5000/api/decks`, payload);
      navigate(`/editor/${newId}`);
    } catch (err) {
      alert('Failed to save a new copy.');
    }
  }

  function handleAddSlide(layoutKey) {
    const newSlide = LAYOUTS[layoutKey]();
    setSlides([...slides, newSlide]);
    setCurrent(slides.length);
  }

  function handleDeleteSlide() {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== current);
    setSlides(newSlides);
    setCurrent(Math.max(0, current - 1));
  }
 
  const currentSlide = useMemo(() => slides[current] || null, [slides, current]);

  function handlePrevSlide() {
    setCurrent((c) => Math.max(0, c - 1));
  }

  function handleNextSlide() {
    setCurrent((c) => Math.min(slides.length - 1, c + 1));
  }

  return (
    <section className='bg-black text-white min-h-full'>
    <div className="p-6 max-w-7xl mx-auto">
      <Toolbar
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        onAddSlide={() => setShowAdd(true)}
        onPreview={() => setShowPreview(true)}
      />
      <div className="grid grid-cols-4 mt-4 h-full gap-4">
        <div className="col-span-1 h-screen max-h-[100vh] overflow-y-scroll">
          <SlideSidebar
            slides={slides}
            setSlides={setSlides}
            currentIndex={current}
            setCurrentIndex={setCurrent}
          />
        </div>
        <div className="col-span-3">
          <SlideCanvas slide={currentSlide} onUpdate={updateCurrentSlide} />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="btn-ghost" onClick={handleDeleteSlide}>Delete Slide</button>
      </div>
      <Preview
        open={showPreview}
        slide={currentSlide}
        onClose={() => setShowPreview(false)}
        onPrev={handlePrevSlide}
        onNext={handleNextSlide}
      />
      <AddSlide
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAddSlide={handleAddSlide}
      />
    </div>
    </section>
  );
}

