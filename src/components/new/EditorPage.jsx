

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import UserBGselect from './UserBGselect';
import TheChallangePage from './TheChallangePage';
import OurSolutionPage from './OurSloutionPage';
import MarketPotentialPage from './MarketPotentialPage';
import CompetitiveEdgePAge from './CompetitiveEdgePAge';
import GrowthTrajectoryPage from './GrowthTrajectoryPage';
import ProvenModelPage from './ProvenModelPage';
import SeriesAPage from './SeriesAPage';
import JoinUsPage from './JoinUsPage';


export default function EditorPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const isAnimatingRef = useRef(false);

  // Array of components to render for each slide
  const slides = [
    <UserBGselect />,
    <TheChallangePage />,
    <OurSolutionPage />,
    <MarketPotentialPage />,
    <CompetitiveEdgePAge />,
    <GrowthTrajectoryPage />,
    <ProvenModelPage />,
    <SeriesAPage />,
    <JoinUsPage />,
  ];
  const totalSlides = slides.length;

  useEffect(() => {
    const handleWheel = (event) => {
      if (isAnimatingRef.current) return;
      
      const deltaY = event.deltaY;
      let newIndex = currentSlideIndex;

      if (deltaY > 0 && currentSlideIndex < totalSlides - 1) {
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
  }, [currentSlideIndex, totalSlides]);

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
          <div key={index}>
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
    </div>
  );
}


