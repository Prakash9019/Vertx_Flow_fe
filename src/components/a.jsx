import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Image, Palette, Plus } from 'lucide-react';
import UserBGselect from './UserBGselect';
import TheChallangePage from './TheChallangePage';
import OurSolutionPage from './OurSloutionPage';
import MarketPotentialPage from './MarketPotentialPage';
import CompetitiveEdgePAge from './CompetitiveEdgePAge';
import GrowthTrajectoryPage from './GrowthTrajectoryPage';
import ProvenModelPage from './ProvenModelPage';
import SeriesAPage from './SeriesAPage';
import JoinUsPage from './JoinUsPage';

const NewFroalaPage = ({ id }) => {
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);

  useEffect(() => {
    // Dynamically load the Froala CSS and JS files from CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';
    
    const initializeEditors = () => {
      if (window.FroalaEditor) {
        if (headingRef.current) {
          new window.FroalaEditor(headingRef.current, {
            inline: true,
            toolbarInline: true,
            toolbarVisibleWithoutSelection: true,
            charCounterCount: false,
            wordCounterCount: false,
            toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor'],
          });
        }
        if (paragraphRef.current) {
          new window.FroalaEditor(paragraphRef.current, {
            inline: true,
            toolbarInline: true,
            toolbarVisibleWithoutSelection: true,
            charCounterCount: false,
            wordCounterCount: false,
            toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'insertImage', 'imageManager', 'imageSize'],
          });
        }
      }
    };

    script.onload = () => {
      setTimeout(initializeEditors, 100);
    };

    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div key={id} className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] bg-[#021e1d] text-white">
      <div className="w-full max-w-7xl p-12 text-center rounded-3xl shadow-2xl bg-gradient-to-b from-black/70 from-35% via-white/30 via-129% to-black to-100% min-h-[600px] max-h-[600px] overflow-y-auto">
      <div ref={headingRef}>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-4 text-white" contentEditable suppressContentEditableWarning>
          New Slide Title
        </h1>
      </div>
      <div ref={paragraphRef}>
      <p className="text-lg md:text-xl text-gray-300" contentEditable suppressContentEditableWarning>
          This is a new slide. You can add your content here.
      </p>
      </div>
      </div>
    </div>
  );
};

export default function EditorPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slides, setSlides] = useState([
    <UserBGselect />,
    <TheChallangePage />,
    <OurSolutionPage />,
    <MarketPotentialPage />,
    <CompetitiveEdgePAge />,
    <GrowthTrajectoryPage />,
    <ProvenModelPage />,
    <SeriesAPage />,
    <JoinUsPage />,
  ]);
  const isAnimatingRef = useRef(false);

  const handleAddSlide = () => {
    const newSlide = <NewFroalaPage key={Date.now()} id={Date.now()} />;
    setSlides(prevSlides => {
      const newSlides = [...prevSlides, newSlide];
      setCurrentSlideIndex(newSlides.length - 1);
      return newSlides;
    });
  };

  useEffect(() => {
    const handleWheel = (event) => {
      if (isAnimatingRef.current) return;
      
      const deltaY = event.deltaY;
      let newIndex = currentSlideIndex;

      if (deltaY > 0 && currentSlideIndex < slides.length - 1) {
        newIndex = currentSlideIndex + 1;
      } else if (deltaY < 0 && currentSlideIndex > 0) {
        newIndex = currentSlideIndex - 1;
      }

      if (newIndex !== currentSlideIndex) {
        isAnimatingRef.current = true;
        setCurrentSlideIndex(newIndex);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentSlideIndex, slides.length]);

  const transition = {
    duration: 1.1,
    ease: [0.8, 0.08, -0.015, 1.0],
  };

  const containerVariants = {
    initial: { y: 0 },
    animate: { y: `-${currentSlideIndex * 100}vh` },
  };

  return (
    <div className="App font-sans antialiased text-gray-900 bg-gray-50 h-screen w-screen relative overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        transition={transition}
        onAnimationComplete={() => { isAnimatingRef.current = false; }}
      >
        {slides.map((slide, index) => (
          <div key={slide.key || index} className="h-screen w-screen">
            {slide}
          </div>
        ))}
      </motion.div>

      {/* Slide Navigation Bars */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 flex flex-col space-y-4 z-50">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`
              h-0.5 rounded-full transition-all duration-300 ease-in-out cursor-pointer
              ${index === currentSlideIndex ? 'w-7 bg-white' : 'w-3 bg-gray-500'}
            `}
            onClick={() => setCurrentSlideIndex(index)}
          ></div>
        ))}
      </div>

      {currentSlideIndex > 0 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex z-50">
          <button
            onClick={handleAddSlide}
            className={`py-2 px-4 text-base font-[inter] font-semibold cursor-pointer rounded-l-xl border-none bg-gray-700 flex items-center bg-opacity-50 text-white hover:bg-opacity-70 transition-colors`}
          >
            <Plus size={20} className='mr-2'/> Add
          </button>

          <div className="relative">
            <button
              className={`px-4 py-3 text-sm cursor-pointer font-[inter] font-semibold border-none bg-gray-700 bg-opacity-50 text-white hover:bg-opacity-70 transition-colors flex items-center`}
            >
              <Palette size={20} className="mr-2" />
              <span>Select Theme</span>
            </button>
          </div>
          <div className="relative">
            <button
              className={`px-4 py-3 text-sm cursor-pointer font-[inter] font-semibold rounded-r-xl border-none bg-gray-700 bg-opacity-50 text-white hover:bg-opacity-70 transition-colors flex items-center`}
            >
              <Image size={20} className="mr-2" />
              <span>Background</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
