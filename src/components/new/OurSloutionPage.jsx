import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import B1 from "./1.png"


const OurSolutionPage = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    // Dynamically load the Froala CSS and JS files from CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';
    
    const initializeEditor = () => {
      if (editorRef.current && window.FroalaEditor) {
        new window.FroalaEditor(editorRef.current, {
          inline: true,
          toolbarInline: true,
          toolbarVisibleWithoutSelection: true,
          charCounterCount: false,
          wordCounterCount: false,
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
          imageEditButtons: ['imageDisplay', 'imageAlign', 'imageSize', 'imageCaption', 'imageStyle', 'imageFilter', 'imageRemove', 'imageReplace'],
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
          ]
        });
      }
    };

    script.onload = () => {
      setTimeout(initializeEditor, 100);
    };

    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      if (editorRef.current && editorRef.current.editor) {
        editorRef.current.editor.destroy();
      }
    };
  }, []);

  return (
    <div className="p-10 font-[inter] min-h-screen max-h-screen overflow-hidden bg-[#021e1d] text-white">
      <style>
        {`
          .fr-style-polaroid {
            background-color: white;
            color: black;
            padding: 10px 10px 20px 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            display: inline-block;
          }
        `}
      </style>
      <div className='max-w-5xl shadow-2xl rounded-md bg-gradient-to-b from-black/70 from-35% via-white/30 via-129% to-black to-100% p-5 mx-auto flex flex-col justify-center text-center items-center'>
        <div className='border-[2.5px] w-full min-h-150 max-h-170 p-5'>
          <div
            ref={editorRef}
            className="prose max-w-xl mx-auto focus:outline-none"
          >
            <h1 className="text-4xl font-semibold my-8">
              Our solution
            </h1>
            <h2 className='mb-4'>
              Vertx delivers breakthrough technology that bridges innovation gaps, reducing implementation time by 80%.
            </h2>
            {/* The Canvas environment cannot access local files. Please use a public URL for your image. */}
            <img src={B1} alt="Two people silhouetted against a colorful background" className='my-8 w-full rounded-md' />
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<OurSolutionPage />);

export default OurSolutionPage;
