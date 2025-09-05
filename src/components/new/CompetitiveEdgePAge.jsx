import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import B1 from "./25.jpg"


const CompetitiveEdgePAge = () => {
  const editorRef = useRef(null);
  const imageEditorRef = useRef(null);

  const [cardData, setCardData] = useState([
    {
      icon: 'fas fa-star',
      title: '40% higher customer satisfaction scores'
    },
    {
      icon: 'fas fa-code',
      title: 'Proprietary technology'
    },
    {
      icon: 'fas fa-handshake-alt',
      title: 'Strategic partnerships'
    },
    {
      icon: 'fas fa-rocket',
      title: '3x faster implementation than competitors'
    }
  ]);

  const handleCardChange = (index, field, value) => {
    setCardData(prevData => {
      const newData = [...prevData];
      newData[index][field] = value;
      return newData;
    });
  };

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
        if (editorRef.current) {
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
            imageResizer: {
              handle: 'all',
              minWidth: 16,
              minHeight: 16 
            },
            imageStyles: {
              'fr-style-card': 'Card',
              'fr-style-polaroid': 'Polaroid',
              'fr-style-red': 'Red',
              'fr-style-green': 'Green',
              'fr-style-sky': 'Sky'
            },
            imageEditButtons: ['imageDisplay', 'imageAlign', 'imageSize', 'imageCaption', 'imageStyle', 'imageRemove', 'imageReplace']
          });
        }
        
        if (imageEditorRef.current) {
            new window.FroalaEditor(imageEditorRef.current, {
                inline: true,
                toolbarInline: true,
                toolbarVisibleWithoutSelection: true,
                charCounterCount: false,
                wordCounterCount: false,
                toolbarButtons: ['insertImage'],
                imageResizer: true,
                imageEditButtons: ['imageDisplay', 'imageAlign', 'imageSize', 'imageCaption', 'imageStyle', 'imageRemove', 'imageReplace']
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
      if (editorRef.current && editorRef.current.editor) {
        editorRef.current.editor.destroy();
      }
      if (imageEditorRef.current && imageEditorRef.current.editor) {
        imageEditorRef.current.editor.destroy();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-10 font-[inter] bg-[#021e1d] text-white">
      <style>
        {`
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');
          .fr-style-polaroid {
            background-color: white;
            padding: 10px 10px 20px 10px; /* Top, right, left = 10px; Bottom = 20px */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            display: inline-block;
          }
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
          }
          .modal-image {
            display: block;
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
          .modal-close {
            position: absolute;
            top: 10px;
            right: 20px;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            z-index: 1001;
          }
          .fr-style-red {
            border: 2px solid red;
          }
          .fr-style-green {
            border: 2px solid green;
          }
          .fr-style-sky {
            border: 2px solid skyblue;
          }
        `}
      </style>
      <div className='max-w-7xl min-h-150 max-h-170 mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-5 rounded-md shadow-2xl bg-gradient-to-b from-black/70 from-35% via-white/30 via-129% to-black to-100%'>
        {/* Left column: Image */}
        <div ref={imageEditorRef} contentEditable={true} suppressContentEditableWarning={true} className='flex items-center w-auto col-span-1 justify-center p-5'>
          <img 
            src={B1} 
            alt="Strong shadows and light on a city street" 
            className='w-full max-h-145 object-cover rounded-md cursor-pointer'
          />
        </div>

        {/* Right column: Text and Cards */}
        <div className='flex flex-col col-span-1 justify-between gap-8 w-full mt-10 md:my-4'>
          {/* Froala editor for title and description */}
          <div ref={editorRef} className="focus:outline-none">
            <span className='inline-block mb-4 px-2 py-1 bg-lime-600 text-white rounded-md text-xs font-semibold uppercase'>
              Advantage
            </span>
            <h1 className="text-5xl mb-2">
              Competitive Edge
            </h1>
            <h2 className='mt-12'>
              Vertx stands apart through proprietary technology, strategic partnerships, and our founder-investor model.
            </h2>
          </div>
          
          {/* Grid for cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {cardData.map((card, index) => (
              <div key={index} className='rounded-lg shadow-2xl p-2 h-auto overflow-y-auto bg-gray-800 flex items-center gap-3'>
                <i className={`${card.icon} text-3xl text-gray-400`}></i>
                <h3 
                  className='font-semibold text-sm mb-1 focus:outline-none flex-1'
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleCardChange(index, 'title', e.target.innerText)}
                >
                  {card.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<CompetitiveEdgePAge />);

export default CompetitiveEdgePAge;
