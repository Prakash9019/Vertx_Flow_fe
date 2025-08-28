// // client/src/components/Slideshow.jsx
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function Slideshow({ slides, onClose }) {
//   const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

//   const totalSlides = slides.length;

//   useEffect(() => {
//     function handleKeyDown(e) {
//       if (e.key === 'ArrowRight') {
//         setCurrentSlideIndex((prevIndex) => Math.min(prevIndex + 1, totalSlides - 1));
//       } else if (e.key === 'ArrowLeft') {
//         setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
//       } else if (e.key === 'Escape') {
//         onClose();
//       }
//     }

//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   }, [totalSlides, onClose]);

//   const slideVariants = {
//     enter: (direction) => ({
//       x: direction > 0 ? 1000 : -1000,
//       opacity: 0,
//     }),
//     center: {
//       zIndex: 1,
//       x: 0,
//       opacity: 1,
//     },
//     exit: (direction) => ({
//       zIndex: 0,
//       x: direction < 0 ? 1000 : -1000,
//       opacity: 0,
//     }),
//   };

//   const currentSlide = slides[currentSlideIndex];

//   return (
//     <div className="fixed inset-0 bg-black text-white z-50">
//       <div className="relative w-full h-screen overflow-hidden">
//         <AnimatePresence initial={false} custom={1}>
//           <motion.div
//             key={currentSlideIndex}
//             custom={1}
//             variants={slideVariants}
//             initial="enter"
//             animate="center"
//             exit="exit"
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className="absolute inset-0 flex items-center justify-center p-8"
//           >
//             {/* You will replace this with your actual slide content rendering */}
//             <div className="w-full max-w-4xl p-8 border border-slate-700 rounded-lg min-h-screen flex items-center justify-center text-center">
//               <h2 className="text-4xl font-bold">{currentSlide?.layout}</h2>
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </div>

//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-4 z-50">
//         <button onClick={() => setCurrentSlideIndex(currentSlideIndex - 1)} disabled={currentSlideIndex === 0} className="btn-ghost">
//           Prev
//         </button>
//         <span className="text-sm">
//           {currentSlideIndex + 1} / {totalSlides}
//         </span>
//         <button onClick={() => setCurrentSlideIndex(currentSlideIndex + 1)} disabled={currentSlideIndex === totalSlides - 1} className="btn-ghost">
//           Next
//         </button>
//       </div>

//       <button onClick={onClose} className="absolute top-4 right-4 btn-ghost z-50">
//         Close
//       </button>
//     </div>
//   );
// }
// client/src/components/Slideshow.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SlideCanvas from './SlideCanvas'; // Make sure to import this

export default function Slideshow({ slides, onClose }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const totalSlides = slides.length;

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowRight') {
        setCurrentSlideIndex((prevIndex) => Math.min(prevIndex + 1, totalSlides - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    }

    // Add event listener to the document only when the slideshow is open
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [totalSlides, onClose]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const currentSlide = useMemo(() => slides[currentSlideIndex], [slides, currentSlideIndex]);

  return (
    <div className="fixed inset-0 bg-black text-white z-50 overflow-hidden">
      <AnimatePresence initial={false} custom={1}>
        <motion.div
          key={currentSlideIndex}
          custom={1}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute inset-0 flex items-center justify-center p-8"
        >
          <div className="w-full max-w-4xl min-h-screen flex items-center justify-center">
            {currentSlide ? (
              <SlideCanvas slide={currentSlide} onUpdate={() => {}} />
            ) : (
              <div className="text-center text-gray-400">No slide content</div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4 z-50">
        <button
          onClick={() => setCurrentSlideIndex(currentSlideIndex - 1)}
          disabled={currentSlideIndex === 0}
          className="btn-ghost"
        >
          Prev
        </button>
        <span className="text-sm">
          {currentSlideIndex + 1} / {totalSlides}
        </span>
        <button
          onClick={() => setCurrentSlideIndex(currentSlideIndex + 1)}
          disabled={currentSlideIndex === totalSlides - 1}
          className="btn-ghost"
        >
          Next
        </button>
      </div>

      <button onClick={onClose} className="absolute top-4 right-4 btn-ghost z-50">
        Close
      </button>
    </div>
  );
}