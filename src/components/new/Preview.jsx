
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preview({ open, slide, onClose, onPrev, onNext }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-[900px] max-w-full min-h-[500px]"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-slate-400">Preview</div>
              <button className="btn-ghost" onClick={onClose}>
                Close
              </button>
            </div>
            <div className="text-center text-slate-300">
              {/* Simple slide render */}
              {slide ? (
                <div>
                  <div className="text-lg font-semibold mb-2">{slide.layout}</div>
                  <div className="text-sm opacity-70">Use ← / → to navigate</div>
                </div>
              ) : (
                'No slide'
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

