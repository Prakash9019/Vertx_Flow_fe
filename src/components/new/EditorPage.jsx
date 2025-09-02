

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import UserBGselect from './UserBGselect';
import TheChallangePage from './TheChallangePage';

// Component One with its own data
const ComponentOne = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-gray-200">
    <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl p-8 max-w-xl text-center shadow-2xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 font-sans tracking-tight leading-tight">
        A New Way to Present Content
      </h1>
      <p className="text-lg text-gray-700 font-medium leading-relaxed">
        This is a unique component with its own content and styling. It does not receive any props from the main app component.
      </p>
    </div>
  </div>
);

// Component Two with its own data
const ComponentTwo = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-gray-300">
    <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl p-8 max-w-xl text-center shadow-2xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 font-sans tracking-tight leading-tight">
        Fully Self-Contained
      </h1>
      <p className="text-lg text-gray-700 font-medium leading-relaxed">
        This component is completely independent and can be used on any slide without needing external data.
      </p>
    </div>
  </div>
);

// UserBGselect component with its own data
const UserBGselected = () => {
  const data = {
    title: 'Welcome to Our Website',
    text: 'This is the first slide. Each component now manages its own data and content.',
    color: '#A0B4D1', // Soft Blue
  };

  return (
    <div
      className={`relative h-screen w-screen flex items-center justify-center p-8 transition-colors duration-500`}
      style={{ backgroundColor: data.color }}
    >
      <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl p-8 max-w-xl text-center shadow-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 font-sans tracking-tight leading-tight">
          {data.title}
        </h1>
        <p className="text-lg text-gray-700 font-medium leading-relaxed">
          {data.text}
        </p>
      </div>
    </div>
  );
};

export default function EditorPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const isAnimatingRef = useRef(false);

  // Array of components to render for each slide
  const slides = [
    <UserBGselect />,
    <TheChallangePage />,
    <UserBGselected />,
    <ComponentTwo />,
    <UserBGselected />,
    <ComponentOne />,
    <UserBGselected />,
    <ComponentTwo />,
    <UserBGselected />,
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


