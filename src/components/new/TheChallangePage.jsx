import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const TheChallangePage = () => {
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
    <div className="p-10 font-[inter] min-h-screen max-h-screen overflow-hidden bg-[#021e1d] op text-white">
      <div className='max-w-5xl shadow-2xl rounded-md bg-gradient-to-b from-black/70 from-35% via-white/30 via-129% to-black to-100% p-5 mx-auto flex flex-col justify-center text-center items-center '>
        <div className='border-[2.5px] w-full min-h-150 p-5'>
          <div
            ref={editorRef}
            className="prose max-w-xl mx-auto focus:outline-none"
          >
            <h1 className="text-4xl font-semibold my-15">
              The Challenge
            </h1>
            <h2>Welcome to the Editable Page. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat beatae magni perspiciatis ex earum consequatur, commodi a laudantium incidunt ad.</h2>
            <p>Feel free to experiment with the different editing options.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<TheChallangePage />);

export default TheChallangePage;