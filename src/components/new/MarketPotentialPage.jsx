import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import B1 from "./24.jpg"


const MarketPotentialPage = () => {
  const editorRef = useRef(null);
  const [cardData, setCardData] = useState([
    {
      icon: 'fas fa-bullseye',
      color: 'text-blue-400',
      title: 'Strategic market capture',
      description: 'We will identify and prioritize key market segments to ensure a strong foothold and scalable growth.'
    },
    {
      icon: 'fas fa-handshake',
      color: 'text-green-400',
      title: 'Partnership approach',
      description: 'By leveraging strategic alliances and collaborations, we will accelerate our market entry and expand our reach.'
    },
    {
      icon: 'fas fa-chart-line',
      color: 'text-yellow-400',
      title: 'Explosive market growth',
      description: 'Our innovative solutions are designed to capitalize on rapid market expansion, ensuring exponential returns.'
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
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');
          .fr-style-polaroid {
            background-color: white;
            color: black;
            padding: 10px 10px 10px 10px;
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
            display: inline-block;
          }
          .fr-style-red {
            background-color: #B22222;
            color: white;
            padding: 10px 10px 10px 10px;
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
            display: inline-block;
          }
          .fr-style-green {
            background-color: #00FA9A;
            color: black;
            padding: 10px 10px 10px 10px;
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
            display: inline-block;
          }
          .fr-style-sky {
            background-color: #1E90FF;
            color: white;
            padding: 10px 10px 10px 10px;
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
            display: inline-block;
          }
          .fr-style-card {
          background-color: #004526;
            color: white;
            padding: 10px 10px 10px 10px;
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
            display: inline-block;
          }
        `}
      </style>
      <div className='max-w-7xl mx-auto flex flex-col md:flex-row gap-8 p-5 rounded-md shadow-2xl bg-gradient-to-b from-black/70 from-35% via-white/30 via-129% to-black to-100%'>
        <div className='flex-1 flex flex-col justify-center text-center items-center'>
          <div className='w-full min-h-150 max-h-170 p-5'>
            <div
              ref={editorRef}
              className="focus:outline-none"
            >
              <h1 className="text-4xl font-semibold my-5">
                Market Potential
              </h1>
              <h2 className='mb-4'>
                The deep tech market is projected to reach $125B by 2025 with 35% CAGR.
              </h2>
              <img src={B1} alt="Two people silhouetted against a colorful background" className='my-8 w-full max-h-100 rounded-md' />
            </div>
          </div>
        </div>

        <div className='flex flex-col my-auto gap-4 w-full md:w-1/3'>
          {cardData.map((card, index) => (
            <div key={index} className='rounded-lg shadow-2xl p-2 h-40 overflow-y-auto bg-gray-800'>
              <div className='flex items-center justify-self-start mb-4'>
                <i className={`${card.icon} text-4xl ${card.color}`}></i>
              </div>
              <h3 
                className='font-semibold text-xl mb-2 focus:outline-none'
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleCardChange(index, 'title', e.target.innerText)}
              >
                {card.title}
              </h3>
              <p 
                className='text-sm text-gray-300 focus:outline-none'
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleCardChange(index, 'description', e.target.innerText)}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<MarketPotentialPage />);

export default MarketPotentialPage;
