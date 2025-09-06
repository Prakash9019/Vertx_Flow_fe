import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import C1 from "./26.jpg"
import B1 from "./2.png"
import A1 from "./1.jpg"
import A3 from "./2.jpg"


const GrowthTrajectoryPage = () => {
  const editorRef = useRef(null);
  const imageRef1 = useRef(null);
  const imageRef2 = useRef(null);
  const imageRef3 = useRef(null);
  const imageRef4 = useRef(null);

  const [cardData, setCardData] = useState([
    {
      title: 'Revenue',
      description: 'Achieved 200% year-over-year revenue growth, consistently exceeding industry benchmarks.'
    },
    {
      title: 'Retention',
      description: 'Maintained 95% customer retention rate, demonstrating strong product-market fit and customer satisfaction.'
    },
    {
      title: 'Enterprise',
      description: 'Successfully implemented pilot programs with Fortune 500 companies, validating our enterprise-ready solution.'
    }
  ]);

  const handleCardChange = (index, field, value) => {
    setCardData(prevData => {
      const newData = [...prevData];
      if (newData[index]) {
        newData[index][field] = value;
      }
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

        const imageRefs = [imageRef1, imageRef2, imageRef3, imageRef4];
        imageRefs.forEach(ref => {
          if (ref.current) {
            new window.FroalaEditor(ref.current, {
              inline: true,
              toolbarInline: true,
              toolbarVisibleWithoutSelection: true,
              charCounterCount: false,
              wordCounterCount: false,
              imageResizer: {
                handle: 'all',
                minWidth: 16,
                minHeight: 16
              },
              imageEditButtons: ['imageDisplay', 'imageAlign', 'imageSize', 'imageCaption', 'imageStyle', 'imageRemove', 'imageReplace'],
              toolbarButtons: {
                'moreText': {
                  buttons: ['insertImage']
                }
              }
            });
          }
        });
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
      if (imageRef1.current && imageRef1.current.editor) { imageRef1.current.editor.destroy(); }
      if (imageRef2.current && imageRef2.current.editor) { imageRef2.current.editor.destroy(); }
      if (imageRef3.current && imageRef3.current.editor) { imageRef3.current.editor.destroy(); }
      if (imageRef4.current && imageRef4.current.editor) { imageRef4.current.editor.destroy(); }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 font-[inter] bg-[#021e1d] text-white">
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


      <div className='max-w-7xl mx-auto min-h-150 max-h-160 grid grid-cols-1 md:grid-cols-5 gap-8 p-5 rounded-md shadow-2xl bg-gradient-to-b from-black/70 from-35% via-white/30 via-129% to-black to-100%'>
        {/* Left column: Text */}
        <div className='col-span-1 md:col-span-2 flex flex-col items-start justify-center p-5'>
          <div ref={editorRef} className="focus:outline-none">
            <span className='inline-block mb-4 px-2 py-1 bg-green-500 text-white rounded-md text-xs font-semibold uppercase'>
              Traction
            </span>
            <h1 className="text-4xl font-semibold mb-2">
              Growth Trajectory
            </h1>
            <h2 className='mb-4'>
              Our traction demonstrates market validation with 200% YoY revenue growth.
            </h2>
          </div>
        </div>
        
        {/* Right columns: Grid of cards and photos */}
        <div className='col-span-1 md:col-span-3 grid grid-cols-3 gap-4'>
          {/* Column 1 */}
          <div className='flex flex-col gap-4'>
            <div ref={imageRef1} contentEditable={true} suppressContentEditableWarning={true} className='rounded-lg row-span-1 shadow-2xl p-2 h-full bg-gray-800 flex items-center justify-center'>
              <img 
                src={A1}
                alt="Silhouetted person looking at the sun" 
                className='h-full w-full object-cover rounded-md'
              />
            </div>
            <div className='rounded-lg max-h-48 shadow-2xl p-2 bg-gray-800 flex flex-col'>
              <h3 className='text-gray-400 font-semibold text-xl mb-2'>
                {cardData[0].title}
              </h3>
              <div 
                className='flex-1 overflow-y-auto overflow-x-hidden focus:outline-none break-words min-w-0'
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleCardChange(0, 'description', e.target.innerText)}
              >
                {cardData[0].description}
              </div>
            </div>
            <div ref={imageRef2} contentEditable={true} suppressContentEditableWarning={true} className='rounded-lg row-span-1 shadow-2xl p-2 h-full bg-gray-800 flex items-center justify-center'>
              <img 
                src={A3}
                alt="Silhouetted person looking at the sun" 
                className='h-full w-full object-cover rounded-md'
              />
            </div>
          </div>
          
          {/* Column 2 */}
          <div className='flex flex-col gap-4'>
            <div ref={imageRef3} contentEditable={true} suppressContentEditableWarning={true} className='rounded-lg shadow-2xl row-span-2 p-2 h-full bg-gray-800 flex items-center justify-center'>
              <img 
                src={B1} 
                alt="Silhouetted person looking at the sun" 
                className='h-full w-full object-cover rounded-md'
              />
            </div>
            <div className='rounded-lg max-h-48 shadow-2xl p-2 bg-gray-800 flex flex-col'>
              <h3 className='text-gray-400 font-semibold text-xl mb-2'>
                {cardData[1].title}
              </h3>
              <div 
                className='flex-1 overflow-y-auto overflow-x-hidden focus:outline-none break-words min-w-0'
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleCardChange(1, 'description', e.target.innerText)}
              >
                {cardData[1].description}
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className='flex flex-col gap-4'>
            <div className='rounded-lg max-h-48 shadow-2xl p-2 bg-gray-800 flex flex-col'>
              <h3 className='text-gray-400 font-semibold text-xl mb-2'>
                {cardData[2].title}
              </h3>
              <div 
                className='flex-1 overflow-y-auto overflow-x-hidden focus:outline-none break-words min-w-0'
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleCardChange(2, 'description', e.target.innerText)}
              >
                {cardData[2].description}
              </div>
            </div>
            <div ref={imageRef4} contentEditable={true} suppressContentEditableWarning={true} className='rounded-lg shadow-2xl row-span-2 p-2 h-full bg-gray-800 flex items-center justify-center'>
              <img 
                src={C1} 
                alt="Silhouetted person looking at the sun" 
                className='h-full w-full object-cover rounded-md'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<GrowthTrajectoryPage />);

export default GrowthTrajectoryPage;
