AddSlide.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';

const layouts = [
  { key: 'title', title: 'Title Slide' },
  { key: 'titleContent', title: 'Title + Content' },
  { key: 'splitImageText', title: 'Image + Text' },
  { key: 'video', title: 'Video + Text' },
];

export default function AddSlide({ open, onClose, onAddSlide }) {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: '-100vh', opacity: 0 },
    visible: { y: '0', opacity: 1, transition: { delay: 0.2 } },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="panel w-full max-w-xl"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Slide</h3>
              <button onClick={onClose} className="btn-ghost">
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {layouts.map((layout) => (
                <div
                  key={layout.key}
                  onClick={() => {
                    onAddSlide(layout.key);
                    onClose();
                  }}
                  className={classNames(
                    'p-4 rounded-lg border border-slate-800 hover:border-brand transition-colors cursor-pointer',
                    'bg-slate-900/50'
                  )}
                >
                  <div className="w-full h-24 bg-slate-800 rounded mb-2"></div>
                  <div className="text-sm font-medium text-center">{layout.title}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

