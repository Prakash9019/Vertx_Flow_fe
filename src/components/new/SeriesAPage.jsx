import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

const SeriesAPage = () => {
  const headingRef = useRef(null);
  const cardRefs = useRef([]);
  const cardTitleRefs = useRef([]);

  const [pageData, setPageData] = useState({
    heading: 'Series A funding will accelerate our growth',
    cards: [
      {
        title: 'Series B readiness',
        description: 'Positioning for next funding round within 24 months.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rocket"><path d="M4.5 16.5c-1.5 1.26-2.25 2.92-2.25 4.75a2.25 2.25 0 0 0 2.25 2.25c1.83 0 3.5-1.26 4.75-2.25l7.5-7.5-7.5-7.5-4.75 4.75z"/><path d="M14.5 14.5l7.5-7.5"/><path d="M12 2v2h2v-2l-2-2z"/><path d="M12 20v2h2v-2l-2-2z"/></svg>
        )
      },
      {
        title: 'Revenue growth',
        description: 'Targeting a 3x increase within 18 months.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        )
      },
      {
        title: 'Market penetration',
        description: 'Strategic expansion into key market segments.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
        )
      },
      {
        title: 'Expanded R&D',
        description: 'Investing in product development and innovation.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flask-conical"><path d="M10 16a2 2 0 0 1-2-2v-3"/><path d="M16 16a2 2 0 0 0-2-2V8"/><path d="M8 2h8"/><path d="M8 22h8"/><path d="M16 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg>
        )
      },
      {
        title: 'Team expansion',
        description: 'Growing our talent pool for scaling operations.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        )
      },
    ]
  });

  const handlePageChange = (field, value) => {
    setPageData(prevData => ({ ...prevData, [field]: value }));
  };

  const handleCardChange = (index, field, value) => {
    setPageData(prevData => {
      const newCards = [...prevData.cards];
      if (newCards[index]) {
        newCards[index] = { ...newCards[index], [field]: value };
      }
      return { ...prevData, cards: newCards };
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
        // Main heading editor
        if (headingRef.current) {
          const editor = new window.FroalaEditor(headingRef.current, {
            inline: true,
            toolbarInline: true,
            toolbarVisibleWithoutSelection: true,
            charCounterCount: false,
            wordCounterCount: false,
            toolbarButtons: ['bold', 'italic', 'underline', '|', 'fontSize', 'textColor', 'backgroundColor', '|', 'undo', 'redo'],
          });
          // editor.events.on('contentChanged', function() {
          //   handlePageChange('heading', this.html.get());
          // });
        }
        
        // Card editors for descriptions
        cardRefs.current.forEach((cardRef, index) => {
          if (cardRef) {
            const editor = new window.FroalaEditor(cardRef, {
              inline: true,
              toolbarInline: true,
              toolbarVisibleWithoutSelection: true,
              charCounterCount: false,
              wordCounterCount: false,
              toolbarButtons: ['bold', 'italic', 'underline', '|', 'fontSize', 'textColor', 'backgroundColor', '|', 'undo', 'redo'],
            });
            // editor.events.on('contentChanged', function() {
            //   handleCardChange(index, 'description', this.html.get());
            // });
          }
        });

        // Card editors for titles
        cardTitleRefs.current.forEach((titleRef, index) => {
          if (titleRef) {
            const editor = new window.FroalaEditor(titleRef, {
              inline: true,
              toolbarInline: true,
              toolbarVisibleWithoutSelection: true,
              charCounterCount: false,
              wordCounterCount: false,
              toolbarButtons: ['bold', 'italic', 'underline', '|', 'fontSize', 'textColor', 'backgroundColor', '|', 'undo', 'redo'],
            });
            // editor.events.on('contentChanged', function() {
            //   handleCardChange(index, 'title', this.html.get());
            // });
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
      if (headingRef.current && headingRef.current.editor) {
        headingRef.current.editor.destroy();
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
          .froala-content {
            word-break: break-all;
          }
        `}
      </style>
      <div className='max-w-7xl min-w-7xl mx-auto flex flex-col items-center p-5 rounded-md shadow-2xl bg-gradient-to-b from-black/70 from-35% via-white/30 via-129% to-black to-100% min-h-150 max-h-170'>
        {/* Top section: Title */}
        <div ref={headingRef}  className='text-left max-w-4xl p-5'>
          <h1 
            className="text-[51px] font-[inter] font-medium mb-2 my-5 leading-14 text-gray-200"
            contentEditable={true}
            suppressContentEditableWarning={true}
          >
            {pageData.heading}
          </h1>
        </div>
        
        {/* Bottom section: Grid of cards with 6 columns */}
        <div  className='w-full max-w-4xl grid grid-cols-1 md:grid-cols-6 gap-8 p-5'>
          {pageData.cards.map((card, index) => (
            <div  
              key={index} 
              ref={el => cardTitleRefs.current[index] = el}
              className={`rounded-lg shadow-2xl overflow-scroll p-4 bg-gray-800 flex flex-col min-h-[175px] max-h-[175px] ${index < 2 ? 'md:col-span-3' : 'md:col-span-2'}`}
            >
              <div  className="flex items-center space-x-4 mb-4 text-gray-400">
                {card.icon}
                <h3 
                  className='font-semibold text-xl' 
                  contentEditable={true} 
                  suppressContentEditableWarning={true}
                >
                  {card.title}
                </h3>
              </div>
              <div 
                className='froala-content flex-1 text-sm overflow-y-auto overflow-x-hidden min-h-0 focus:outline-none break-words min-w-0 text-gray-400'
                contentEditable={true}
                suppressContentEditableWarning={true}
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
root.render(<SeriesAPage />);

export default SeriesAPage;
