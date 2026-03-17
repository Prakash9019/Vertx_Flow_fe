import React, { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// ✅ SCROLL REVEAL COMPONENT
const ScrollReveal = ({ children, animation = 'fade-up', duration = 1000, delay = 0 }) => {
  return (
    <div data-aos={animation} data-aos-duration={duration} data-aos-delay={delay}>
      {children}
    </div>
  );
};

// Sample themes - Replace with your actual themes
const themes = {
  dark: {
    bg: 'bg-black',
    text: 'text-white',
    card: 'bg-gradient-to-b from-black/70 to-black',
  },
  light: {
    bg: 'bg-gray-100',
    text: 'text-gray-900',
    card: 'bg-white',
  },
  // Add more themes as needed
};

// Sample backgrounds - Replace with your actual backgrounds
const backgrounds = {
  original: {
    text: 'text-white',
    card: 'bg-gradient-to-b from-black/70 from-35% via-white/30 via-129% to-black to-100%',
  },
  light: {
    text: 'text-gray-900',
    card: 'bg-white',
  },
  // Add more backgrounds as needed
};

const TheChallenagePage = ({ theme = 'dark', background = 'original' }) => {
  const editorRef = useRef(null);
  const currentTheme = themes[theme] || themes.dark;
  const currentBG = backgrounds[background] || backgrounds.original;

  // ✅ Initialize AOS First
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: 'ease-in-out',
    });

    return () => {
      AOS.refresh();
    };
  }, []);

  // ✅ Initialize Froala Editor
  useEffect(() => {
    // Dynamically load the Froala CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
    document.head.appendChild(link);

    // Dynamically load the Froala JS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';
    script.async = true;

    const initializeEditor = () => {
      if (editorRef.current && window.FroalaEditor) {
        try {
          new window.FroalaEditor(editorRef.current, {
            inline: true,
            toolbarInline: true,
            toolbarButtons: {
              'moreText': {
                buttons: [
                  'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
                  'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'insertImage',
                  'align', 'quote', 'formatOL', 'formatUL', 'outdent', 'indent',
                  'insertLink', 'paragraphStyle', 'insertVideo', 'insertFile', 'insertTable',
                  'undo', 'redo', 'clearFormatting', 'selectAll', 'html'
                ],
                buttonsVisible: 12,
                align: 'center'
              }
            },
            imageEditButtons: ['imageDisplay', 'imageAlign', 'imageSize', 'imageRemove'],
            imageResizer: {
              handle: 'all',
              minWidth: 16,
              minHeight: 16
            },
            charCounterCount: false,
            wordCounterCount: false,
            toolbarVisibleWithoutSelection: true
          });
        } catch (error) {
          console.error('Froala Editor initialization error:', error);
        }
      }
    };

    script.onload = () => {
      setTimeout(initializeEditor, 100);
    };

    script.onerror = () => {
      console.error('Failed to load Froala Editor script');
    };

    document.body.appendChild(script);

    // ✅ Cleanup function
    return () => {
      try {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        if (editorRef.current && editorRef.current.editor) {
          editorRef.current.editor.destroy();
        }
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    };
  }, []);

  return (
    <div className={`p-10 font-[inter] min-h-screen max-h-screen overflow-hidden ${currentTheme.bg} ${currentBG.text}`}>
      {/* ✅ SCROLL REVEAL WRAPPER FOR ENTIRE CARD */}
      <ScrollReveal animation="fade-up" duration={800}>
        <div className={`max-w-5xl shadow-2xl rounded-md ${currentBG.card} p-5 mx-auto flex flex-col justify-center text-center items-center`}>
          {/* ✅ INNER BORDER WITH SCROLL REVEAL */}
          <ScrollReveal animation="zoom-in" duration={1000} delay={100}>
            <div className='border-[2.5px] w-full min-h-[150px] p-5 border-gray-500'>
              {/* ✅ EDITOR CONTENT WITH SCROLL REVEAL */}
              <ScrollReveal animation="fade-up" duration={1000} delay={200}>
                <div
                  ref={editorRef}
                  className="prose max-w-xl mx-auto focus:outline-none"
                >
                  <h1 className="text-4xl font-semibold my-15">
                    The Challenge
                  </h1>
                  <h2 className="text-lg font-medium">
                    Welcome to the Editable Page. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat beatae magni perspiciatis ex earum consequatur, commodi a laudantium incidunt ad.
                  </h2>
                  <p className="text-base">
                    Feel free to experiment with the different editing options.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default TheChallenagePage;