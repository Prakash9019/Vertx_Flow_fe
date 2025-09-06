import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

const ProvenModelPage = () => {
  const editorRef = useRef(null);
  const cardRefs = useRef([]);
  const cardTitleRefs = useRef([]);

  const [cardData, setCardData] = useState([
    {
      title: 'Tangible outcomes',
      description: 'Our proven methodology delivers consistent results through strategic alignment, data-driven decision-making, and client-focused solutions.'
    },
    {
      title: 'Stakeholder synergy',
      description: 'Our founder-investor model creates perfect alignment between stakeholders, ensuring all parties are working toward common goals.'
    },
    {
      title: 'Driving responsibility',
      description: 'The model establishes clear accountability frameworks, which directly contributes to achieving measurable results across the organization.'
    },
    {
      title: 'Market fit confirmed',
      description: 'Mock pitching sessions with potential clients have yielded an impressive 80% conversion rate, validating our approach to the market.'
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
                      'fontFamily', 'fontSize', 'textColor', 'backgroundColor',
                      'align', 'quote', 'formatOL', 'formatUL', 'outdent', 'indent',
                      'insertLink', 'paragraphStyle', 'undo', 'redo', 'clearFormatting', 'selectAll'
                  ],
                  buttonsVisible: 12,
                  align: 'center'
              }
            }
          });
        }

        cardRefs.current.forEach(cardRef => {
          if (cardRef) {
            new window.FroalaEditor(cardRef, {
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
                      'insertLink', 'paragraphStyle', 'undo', 'redo', 'clearFormatting', 'selectAll'
                  ],
                  buttonsVisible: 12,
                  align: 'center'
                }
              }
            });
          }
        });

        cardTitleRefs.current.forEach(titleRef => {
          if (titleRef) {
            new window.FroalaEditor(titleRef, {
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
                      'insertLink', 'paragraphStyle', 'undo', 'redo', 'clearFormatting', 'selectAll'
                  ],
                  buttonsVisible: 12,
                  align: 'center'
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
      cardRefs.current.forEach(cardRef => {
        if (cardRef && cardRef.editor) {
          cardRef.editor.destroy();
        }
      });
      cardTitleRefs.current.forEach(titleRef => {
        if (titleRef && titleRef.editor) {
          titleRef.editor.destroy();
        }
      });
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 font-[inter] bg-[#021e1d] text-white">
      <style>
        {`
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');
          .fr-style-polaroid {
            background-color: white;
            padding: 10px 10px 20px 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            display: inline-block;
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
          .froala-content {
            word-break: break-all;
          }
        `}
      </style>
      <div className='max-w-7xl mx-auto flex flex-col items-center p-5 rounded-md shadow-2xl bg-gradient-to-b from-black/70 from-35% via-white/30 via-129% to-black to-100% min-h-150 max-h-170'>
        {/* Top section: Title and description */}
        <div className='text-center p-5'>
          <div ref={editorRef} className="focus:outline-none max-w-5xl">
            <h1 className="text-6xl font-[inter] font-medium mb-2 my-5">
              <span className='text-gray-600'>Proven model</span> creates alignment and drives results
            </h1>
          </div>
        </div>
        
        {/* Bottom section: Grid of cards */}
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-5'>
          {cardData.map((card, index) => (
            <div ref={el => cardTitleRefs.current[index] = el} key={index} className='rounded-lg shadow-2xl p-6 bg-gray-800 flex flex-col min-h-[350px] max-h-[350px] overflow-scroll'>
              <h3 
                className='text-gray-400 font-semibold text-xl mb-2' 
                contentEditable={true} 
                suppressContentEditableWarning={true} 
                onBlur={(e) => handleCardChange(index, 'title', e.target.innerText)}
                
              >
                {card.title}
              </h3>
              <div 
                className='froala-content flex-1 text-sm overflow-y-auto overflow-x-hidden min-h-0 focus:outline-none break-words min-w-0'
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleCardChange(index, 'description', e.target.innerText)}
              >
                {card.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<ProvenModelPage />);

export default ProvenModelPage;
