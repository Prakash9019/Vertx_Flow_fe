'use client';

import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useAnimation, useInView } from 'framer-motion';

/* ==============================
   SCROLL REVEAL WRAPPER
   ============================== */
export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.15 });

  useEffect(() => {
    if (isInView) controls.start('visible');
  }, [isInView, controls]);

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      scale: direction === 'zoom' ? 0.95 : 1,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={variants}>
      {children}
    </motion.div>
  );
};

/* ==============================
   GRADUAL SPACING ANIMATION
   ============================== */
export const GradualSpacing = ({ text = 'Gradual Spacing' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="flex flex-wrap justify-center">
      <AnimatePresence>
        {text.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, x: -18 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="text-xl sm:text-4xl md:text-6xl font-bold tracking-tighter text-center"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ScrollReveal;
