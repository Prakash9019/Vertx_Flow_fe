import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import BG from '../../assets/IntroBG85.jpg';
import upperBG from '../../assets/IntroBGx22.jpg';
import logo from '../../assets/logo.svg';
import API_KEY from '../../../key';

const ReachLinkPreview = () => {
  // Define the order of global tabs
  const tabOrder = ['DECK', 'BRIEF', 'NOTES', 'SCORE'];
  // State to manage the currently active global tab
  const [activeTab, setActiveTab] = useState(tabOrder[0]); // Initialize with the first tab

  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // PDF Viewer states
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [pageRendering, setPageRendering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!slug) {
      setError('Missing reach link slug in URL');
      return;
    }

    fetch(`${API_KEY}/api/upgrade-deck/reach/${slug}`)
      .then((res) => res.json())
      .then((res) => {
        console.log('API Response:', res); // Debug log
        if (res.success) {
          console.log('Data received:', res.data); // Debug log
          setData(res.data);
        } else {
          setError(res.message || 'Invalid reach link');
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err); // Debug log
        setError('Failed to fetch reach profile');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  // PDF Viewer functions
  const loadPDF = async (pdfUrl) => {
    if (!window.pdfjsLib) {
      console.error('PDF.js library not loaded');
      setPdfError('PDF viewer library not loaded');
      return;
    }

    // Configure PDF.js worker
    if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    try {
      setPdfLoading(true);
      setPdfError('');
      
      // Use uploaded PDF as primary, fallback PDF as backup
      const fallbackPdfUrl = 'https://storage.googleapis.com/rech_link/1754055313199-Vertx%20Deck%20(2).pdf';
      const primaryProxyUrl = `${API_KEY}/api/pdf/proxy-pdf?url=${encodeURIComponent(pdfUrl)}`;
      const fallbackProxyUrl = `${API_KEY}/api/pdf/proxy-pdf?url=${encodeURIComponent(fallbackPdfUrl)}`;

      const urls = [
        primaryProxyUrl,  // Uploaded/data PDF first
        fallbackProxyUrl  // Fallback PDF as backup
      ];

      let pdf = null;
      let lastError = null;

      for (const url of urls) {
        try {
          console.log('Attempting to load PDF from:', url);
          const loadingTask = window.pdfjsLib.getDocument({
            url: url,
            httpHeaders: {
              'Accept': 'application/pdf'
            }
          });
          pdf = await loadingTask.promise;
          console.log('Successfully loaded PDF');
          break;
        } catch (error) {
          lastError = error;
          console.warn(`Failed to load PDF from ${url}:`, error);
        }
      }

      if (!pdf) {
        throw lastError || new Error('Failed to load PDF from all URLs');
      }
      
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      
      // Small delay to ensure container is properly sized before rendering
      setTimeout(() => {
        renderPage(pdf, 1, true); // Pass true for first load
      }, 100);
      
    } catch (error) {
      console.error('Error loading PDF:', error);
      setPdfError('Failed to load PDF document. The PDF may be restricted or unavailable.');
    } finally {
      setPdfLoading(false);
    }
  };

  const renderPage = async (pdf, pageNumber, isFirstLoad = false) => {
    if (!pdf || !canvasRef.current) return;

    try {
      if (!isFirstLoad) {
        setPageRendering(true);
        setIsTransitioning(true);
      }
      
      const page = await pdf.getPage(pageNumber);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Only apply fade out for page transitions, not first load
      if (!isFirstLoad) {
        canvas.style.opacity = '0';
        // Shorter delay for better responsiveness
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Clear the canvas before rendering
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate scale to fit the container
      const viewport = page.getViewport({ scale: 1.0 });
      
      // Get the container dimensions more reliably
      const container = canvas.parentElement;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width * 0.9;
      const containerHeight = containerRect.height * 0.9;
      
      // Ensure minimum dimensions
      const minWidth = 300;
      const minHeight = 400;
      const effectiveWidth = Math.max(containerWidth, minWidth);
      const effectiveHeight = Math.max(containerHeight, minHeight);
      
      const scaleWidth = effectiveWidth / viewport.width;
      const scaleHeight = effectiveHeight / viewport.height;
      const scale = Math.min(scaleWidth, scaleHeight, 2.0); // Cap at 2x for readability
      
      const scaledViewport = page.getViewport({ scale });
      
      // Set canvas dimensions
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = scaledViewport.width * pixelRatio;
      canvas.height = scaledViewport.height * pixelRatio;
      canvas.style.width = scaledViewport.width + 'px';
      canvas.style.height = scaledViewport.height + 'px';
      
      // Scale the context for high DPI displays
      context.scale(pixelRatio, pixelRatio);
      
      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport
      };
      
      await page.render(renderContext).promise;
      
      // Quick fade in effect after rendering
      canvas.style.opacity = '1';
      
    } catch (error) {
      console.error('Error rendering page:', error);
      setPdfError('Failed to render PDF page');
    } finally {
      if (!isFirstLoad) {
        setPageRendering(false);
        setTimeout(() => setIsTransitioning(false), 150);
      }
    }
  };

  const goToNextPage = () => {
    if (pdfDoc && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      renderPage(pdfDoc, nextPage);
    }
  };

  const goToPreviousPage = () => {
    if (pdfDoc && currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      renderPage(pdfDoc, prevPage);
    }
  };

  // Load PDF when DECK tab is activated and data is available
  useEffect(() => {
    if (activeTab === 'DECK' && data?.deckUrl) {
      if (!pdfDoc) {
        loadPDF(data.deckUrl);
      } else {
        // Re-render the current page when returning to DECK tab
        setTimeout(() => {
          renderPage(pdfDoc, currentPage, true);
        }, 100);
      }
    }
  }, [activeTab, data?.deckUrl]);

  // Keyboard navigation for PDF
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeTab === 'DECK' && pdfDoc) {
        if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          goToPreviousPage();
        } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
          e.preventDefault();
          goToNextPage();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTab, pdfDoc, currentPage, totalPages]);

  // Handle window resize for PDF rendering
  useEffect(() => {
    const handleResize = () => {
      if (pdfDoc && activeTab === 'DECK') {
        renderPage(pdfDoc, currentPage);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [pdfDoc, currentPage, activeTab]);


  // --- New states for NOTES sliders ---
  const [notesSlideIndex, setNotesSlideIndex] = useState(0);

  // Dynamic content for NOTES slider based on actual data
  const notesSlides = [
    {
      title: 'Market Opportunity',
      text: data?.marketOpportunity || "Market opportunity information will be displayed here once provided in the basic form."
    },
    {
      title: 'Business Model',
      text: data?.businessModel || "Business model information will be displayed here once provided in the basic form."
    },
    {
      title: 'Potential Metrics',
      text: data?.tractionMetrics || "Traction metrics information will be displayed here once provided in the basic form."
    },
    {
      title: 'Company Description',
      text: data?.companyDescription || "Company description will be displayed here once provided in the basic form."
    },
  ];

  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleScoreChange = (event) => {
    setScore(parseFloat(event.target.value));
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const minScore = 0;
  const maxScore = 10;
  const fillPercentage = ((score - minScore) / (maxScore - minScore)) * 100;

  // --- Handlers for NOTES slider ---
  const handleNextSlide = (tabName) => {
    if (tabName === 'NOTES') {
      setNotesSlideIndex(prevIndex => (prevIndex < notesSlides.length - 1 ? prevIndex + 1 : prevIndex));
    }
  };

  const handlePrevSlide = (tabName) => {
    if (tabName === 'NOTES') {
      setNotesSlideIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    }
  };

  // Function to render content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'DECK':
        return (
          <div>
            <div style={{ fontFamily: "'Crimson Text', serif" }} className="flex flex-col rounded-lg lg:w-[7xl] max-w-7xl w-11/12 lg:h-[71vh] h-120 aspect-video lg:aspect-auto overflow-hidden mx-auto items-center justify-center p-0 relative bg-gray-900">
              {pdfLoading && (
                <div className="w-full h-full flex flex-col items-center justify-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                  <p className="text-lg">Loading PDF...</p>
                </div>
              )}
              
              {pdfError && (
                <div className="w-full h-full flex flex-col items-center justify-center text-white">
                  <div className="text-center">
                    <h3 className="text-2xl mb-4 text-red-400">Error Loading PDF</h3>
                    <p className="text-lg mb-6">{pdfError}</p>
                    <a 
                      href={`${API_KEY}/api/pdf/proxy-pdf?url=${encodeURIComponent(data?.deckUrl || 'https://storage.googleapis.com/rech_link/1754055313199-Vertx%20Deck%20(2).pdf')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                      View Deck (PDF)
                    </a>
                  </div>
                </div>
              )}
              
              {pdfDoc && !pdfLoading && !pdfError && (
                <>
                  <canvas 
                    ref={canvasRef}
                    className="max-w-full max-h-full object-contain shadow-lg"
                    style={{ 
                      display: 'block', 
                      transition: 'opacity 0.2s ease-in-out',
                      opacity: 1
                    }}
                  />
                  
                  {/* PDF Navigation Controls */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                    <span className="text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                </>
              )}
              
              {!pdfDoc && !pdfLoading && !pdfError && (
                <div className="w-full h-full flex flex-col items-center justify-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                  <p className="text-lg">Loading PDF...</p>
                </div>
              )}
            </div>

            <div className="md:absolute pt-4 md:bottom-0 md:right-36 flex items-center justify-center gap-3">
              <button
                  onClick={goToPreviousPage}
                  disabled={!pdfDoc || currentPage <= 1}
                  className={`
                    px-2 py-1 rounded-md text-xs md:text-sm font-semibold uppercase tracking-wider
                    transition-colors duration-200
                    ${!pdfDoc || currentPage <= 1 ? 'text-gray-500 cursor-not-allowed' : 'cursor-pointer text-white'}
                  `}
              >
                Prev
              </button>
              <button
                  onClick={goToNextPage}
                  disabled={!pdfDoc || currentPage >= totalPages}
                  className={`
                    px-2 py-1 rounded-md text-xs md:text-sm font-semibold uppercase tracking-wider
                    transition-colors duration-200
                    ${!pdfDoc || currentPage >= totalPages ? 'text-gray-500 cursor-not-allowed' : 'cursor-pointer text-white'}
                  `}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 'BRIEF':
        return (
          <div style={{ fontFamily: "'Crimson Text', serif" }} 
            className="bg-black w-11/12 h-auto p-4 md:p-6 lg:p-12 max-w-7xl rounded-lg shadow-xl text-gray-200 mx-auto overflow-hidden">
            
            {/* Company Name and Links */}
            <div className="text-center mb-4 relative">
              <h1 className="text-lg md:text-xl lg:text-2xl font-semibold mb-1">{data?.companyName?.toUpperCase() || 'COMPANY NAME'}</h1>
              <p className="text-lg md:text-xl lg:text-2xl text-white mb-2">
                <span className='italic'>Founded on</span> <span className='font-semibold'>{data?.founded ? new Date(data.founded).getFullYear() : 'YEAR'}</span>
              </p>
              
              <div className="flex flex-col items-center justify-center space-x-0 md:flex-row md:space-x-2 text-[10px] uppercase mt-2 md:absolute md:top-0 md:right-30 xl:right-[18rem] md:opacity-80">
                <a href={data?.companyWebsite || '#'} className="text-gray-300">Website</a>
                <span className="text-gray-500">|</span>
                <a href={data?.linkedinUrl || '#'} className="text-gray-300">LinkedIn</a>
              </div>
            </div>
            
            <div className='border-[0.5px] justify-center mx-auto w-24 md:w-[100px] mb-6 border-white'/>
            
            {/* Product Section */}
            <div className="mb-6 text-center">
              <h2 className="text-xs font-semibold uppercase underline tracking-wider text-white/50 mb-1">Product</h2>
              <p className="text-sm md:text-[16px] font-semibold">{data?.companyName || 'PRODUCT NAME'}</p>
            </div>
            
            {/* Description Section */}
            <div className="mb-8 text-center">
              <h2 className="text-xs font-semibold uppercase underline tracking-wider text-white/50 mb-1">Description</h2>
              <p className="text-sm md:text-[16px] font-semibold">{data?.companyDescription || 'Company Description'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-y-6 md:flex md:justify-around mb-10 mx-auto max-w-2xl text-center">
              <div>
                <h3 className="text-xs font-semibold uppercase underline tracking-wider text-white/50 mb-1">Sectors</h3>
                <p className="text-sm md:text-[16px] font-semibold">{data?.businessSectors?.join(', ') || 'Sectors'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase underline tracking-wider text-white/50 mb-1">Stage</h3>
                <p className="text-sm md:text-[16px] font-semibold">{data?.companyStage || 'Stage'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase underline tracking-wider text-white/50 mb-1">Category</h3>
                <p className="text-sm md:text-[16px] font-semibold">{data?.businessCategory || 'Category'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase underline tracking-wider text-white/50 mb-1">Model</h3>
                <p className="text-sm md:text-[16px] font-semibold">{data?.raisedFrom?.join(', ') || 'Model'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase underline tracking-wider text-white/50 mb-1">HQ</h3>
                <p className="text-sm md:text-[16px] font-semibold">{data?.hqLocation || 'Location'}</p>
              </div>
            </div>
            
            {/* Team Section */}
            <div className="text-center mb-2">
              <h2 className="text-sm md:text-[16px] flex justify-center mx-auto font-semibold uppercase underline tracking-wider text-white/50 mb-2">Team</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-2 text-white mx-auto max-w-sm">
                {data?.founderName && (
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-semibold">{data.founderName}</p>
                    <p className="text-xs font-semibold mb-1">CEO</p>
                    <a href={data?.founderLinkedinUrl || '#'} className="text-[10px] uppercase">LinkedIn</a>
                  </div>
                )}
                {data?.founder1FullName && (
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-semibold">{data.founder1FullName}</p>
                    <p className="text-xs font-semibold mb-1">{data.founder1TitleRole || 'Role'}</p>
                    <a href={data?.founder1LinkedinProfileURL || '#'} className="text-[10px] uppercase">LinkedIn</a>
                  </div>
                )}
                {data?.teamMembers?.slice(0, 2).map((member, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <p className="text-xs font-semibold">{member.fullName}</p>
                    <p className="text-xs font-semibold mb-1">{member.titleRole || 'Role'}</p>
                    <a href={member.linkedinUrl || '#'} className="text-[10px] uppercase">LinkedIn</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'NOTES':
        const currentNote = notesSlides[notesSlideIndex];
        return (
          <div>
          <div style={{ fontFamily: "'Crimson Text', serif" }} className="p-4 max-w-7xl h-[71vh] overflow-hidden w-11/12 text-center text-gray-300 flex flex-col justify-center items-center bg-black md:p-8 rounded-lg shadow-xl mx-auto relative">
            <h2 className="text-3xl md:text-4xl text-white/60 font-serif italic mb-8">{currentNote.title}</h2>
            <p className="text-xl md:text-2xl text-white max-w-xl">
              {currentNote.text}
            </p>
            </div>
            <div className="md:absolute pt-4 md:bottom-0 md:right-36 flex items-center justify-center gap-3">

              <button
                onClick={() => handlePrevSlide('NOTES')}
                disabled={notesSlideIndex === 0}
                className={`
                  px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider
                  transition-colors duration-200
                  ${notesSlideIndex === 0 ? 'text-gray-500 cursor-not-allowed' : 'cursor-pointer text-white'}
                `}
              >
                Prev
              </button>
              <button
                onClick={() => handleNextSlide('NOTES')}
                disabled={notesSlideIndex === notesSlides.length - 1}
                className={`
                  px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider
                  transition-colors duration-200
                  ${notesSlideIndex === notesSlides.length - 1 ? 'text-gray-500 cursor-not-allowed' : 'cursor-pointer text-white'}
                `}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 'SCORE':
        return (
          <div style={{ fontFamily: "'Crimson Text', serif" }} className="p-4 md:p-8 lg:p-8 w-11/12 max-w-7xl lg:min-w-5xl  lg:w-[7xl] bg-black/55 mx-auto h-[71vh] text-center text-gray-300">
            {!submitted ? (
              <>
                <h2 style={{ fontFamily: "'Crimson Text', serif" }} className="text-3xl md:text-4xl mt-20 md:mt-0 font-normal mb-15">Score This Startup</h2>
                <div style={{ fontFamily: "'Crimson Text', serif" }} className="flex flex-col items-center mb-8">
                  <input
                    type="range"
                    min={minScore}
                    max={maxScore}
                    step="0.1"
                    value={score}
                    onChange={handleScoreChange}
                    className="w-full max-w-6xl h-2 appearance-none cursor-pointer range-lg"
                    style={{
                      background: `linear-gradient(to right, #D1D5DB ${fillPercentage}%, #4B5563 ${fillPercentage}%)`,
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                    }}
                  />
                  <p className="text-5xl md:text-6xl font-bold mt-4">{score.toFixed(1)}</p>
                </div>
                <div>
                  <textarea
                    className="w-full max-w-6xl mx-auto h-32 p-4 mb-8 bg-white/4 border border-[#B8B8B821] rounded-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Write your thoughts or message here..."
                    value={feedback}
                    onChange={handleFeedbackChange}
                  >
                  </textarea>
                </div>
                <div className='justify-end flex max-w-6xl md:relative absolute bottom-7 right-8 sm:right-12 md:bottom-0 md:right-0'>
                  <button
                    onClick={handleSubmit}
                    className="px-3 py-1 text-white font-bold text-xl rounded-lg transition duration-200"
                  >
                    SUBMIT
                  </button>
                </div>
              </>
            ) : (
              <div style={{ fontFamily: "'Crimson Text', serif" }} className="flex flex-col items-center justify-center h-[71vh]">
                <h2 className="text-3xl md:text-4xl font-serif italic mb-4">You've scored {score.toFixed(1)} for this pitch</h2>
                <p className="text-xl md:text-2xl leading-relaxed max-w-2xl">
                  {feedback ? feedback : 'No Feedback Given.'}
                </p>
                <div className=" justify-end flex max-w-6xl absolute md:bottom-16 bottom-12 right-12 md:right-36">
                  <button
                    onClick={() => { setSubmitted(false) }}
                    className="px-3 py-1 text-white font-bold text-xl rounded-lg transition duration-200"
                  >
                    PREV
                  </button>
               </div>
              </div>
              
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="h-full inset-0 bg-cover bg-center text-white font-inter flex flex-col items-center justify-center relative"
        style={{ backgroundImage: `url(${BG})`, fontFamily: "'Crimson Text', serif" }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full inset-0 bg-cover bg-center text-white  flex flex-col items-center justify-between relative overflow-scroll"
        style={{ backgroundImage: `url(${BG})`, fontFamily: "'Crimson Text', serif" }}>
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full inset-0 bg-cover bg-center text-white font-inter flex flex-col items-center justify-between relative overflow-scroll"
      style={{ backgroundImage: `url(${BG})`, fontFamily: "'Crimson Text', serif" }}>
      {/* Background layer 1: Using BG for the subtle mountain effect, very dark and muted */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${BG})` }}
      ></div>

      <div
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{ backgroundImage: `url(${upperBG})` }}
      ></div>

      {/* A dark gradient overlay to ensure the background remains subtle and the content pops */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950 to-transparent opacity-80"></div>

      {/* Main content container */}
      <div className="relative z-10 w-full mx-auto flex flex-col items-start pt-4 pb-4  md:pt-12 md:pb-8">
        {/* Tabs navigation - styled to be subtle like in the screenshot */}
        <nav className="flex flex-wrap mb-4 mx-auto justify-center items-center md:mx-0 md:space-x-8 md:ml-34">
          {tabOrder.map((tab) => (
            <button
              key={tab}
              style={{ fontFamily: "'Crimson Text', serif" }}
              className={`
                sm:text-xl text-sm font-bold uppercase tracking-wider px-4 py-2
                transition-all duration-300 ease-in-out
                ${activeTab === tab
                  ? 'text-white' // Active tab has a bottom border
                  : 'text-gray-500 hover:text-gray-300' // Inactive tabs are muted
                }
              `}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Content display area - styled to look like the main image container */}
        <div className="rounded-lg shadow-2xl w-full overflow-hidden transition-all duration-300 ease-in-out">
          {renderContent()}
        </div>

      </div>

      {/* Footer - positioned at the very bottom */}
      <footer
        style={{ fontFamily: "'Crimson Text', serif" }}
        className="relative z-10 text-gray-500 text-sm flex -mt-5 ">
        REACHLINK by <img className='w-4 h-4 mx-2' src={logo} alt="" /> VERTX
      </footer>
    </div>
  );
};

export default ReachLinkPreview;