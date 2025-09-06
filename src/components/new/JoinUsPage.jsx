import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import B1 from "./1.png"

const JoinUsPage = () => {
  const textEditorRef = useRef(null);
  const imageEditorRef = useRef(null);

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
        // Initialize the text editor
        if (textEditorRef.current) {
          new window.FroalaEditor(textEditorRef.current, {
            inline: true,
            toolbarInline: true,
            toolbarVisibleWithoutSelection: true,
            charCounterCount: false,
            wordCounterCount: false,
            toolbarButtons: {
              'moreText': {
                  buttons: [
                      'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
                      'fontFamily', 'fontSize', 'textColor', 'backgroundColor',
                      'align', 'quote', 'formatOL', 'formatUL', 'outdent', 'indent',
                      'insertLink', 'paragraphStyle',
                      'undo', 'redo', 'clearFormatting', 'selectAll', 'html'
                  ],
                  buttonsVisible: 12,
                  align: 'center'
              }
            }
          });
        }
        // Initialize the image editor with image-specific options
        if (imageEditorRef.current) {
          new window.FroalaEditor(imageEditorRef.current, {
            inline: true,
            toolbarInline: true,
            toolbarVisibleWithoutSelection: true,
            charCounterCount: false,
            wordCounterCount: false,
            toolbarButtons: [ 'insertImage', 'imageAlign', 'imageSize', 'imageCaption', 'imageStyle', 'imageFilter', 'imageRemove', 'imageReplace' ],
            imageResizer: {
              handle: 'all',
              minWidth: 16,
              minHeight: 16 
            },
            imageStyles: {
              'fr-style-card': 'Card',
              'fr-style-polaroid': 'Polaroid'
            },
            imageFilters: [
              { title: 'Normal', filter: 'none' },
              { title: 'Grayscale', filter: 'grayscale(100%)' },
              { title: 'Sepia', filter: 'sepia(100%)' },
              { title: 'Blur', filter: 'blur(2px)' }
            ],
            imageEditButtons: ['imageDisplay', 'imageAlign', 'imageSize', 'imageCaption', 'imageStyle', 'imageFilter', 'imageRemove', 'imageReplace']
          });
        }
      }
    };

    script.onload = () => {
      setTimeout(initializeEditors, 100);
    };

    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      if (textEditorRef.current && textEditorRef.current.editor) {
        textEditorRef.current.editor.destroy();
      }
      if (imageEditorRef.current && imageEditorRef.current.editor) {
        imageEditorRef.current.editor.destroy();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] bg-[#021e1d] text-white">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');
        .fr-style-polaroid {
          background-color: white;
          color: black;
          padding: 10px 10px 20px 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          display: inline-block;
        }
      `}} />
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl min-h-150 max-h-150 rounded-3xl shadow-2xl p-6 sm:p-12 bg-gradient-to-b from-black/70 from-35% via-white/30 via-129% to-black to-100%">
        
        {/* Left Section: Text Content */}
        <div 
          ref={textEditorRef}
          className="flex-1 focus:outline-none"
        >
          <span className="text-sm font-semibold tracking-wider bg-lime-600 uppercase text-white mb-4">
            Investment Opportunity
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl max-w-110 font-medium leading-tight mb-4 text-white">
            Join us in revolutionizing deep tech
          </h1>
        </div>

        {/* Right Section: Blurry Image/Placeholder */}
        <div ref={imageEditorRef} className="flex-1 w-full h-80 md:h-96 relative overflow-hidden">
          <img src={B1} alt="Two people silhouetted against a colorful background" className=' w-full' />
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<JoinUsPage />);
}

export default JoinUsPage;