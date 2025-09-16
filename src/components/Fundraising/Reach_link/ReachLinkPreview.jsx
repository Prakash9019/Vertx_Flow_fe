
import React, {useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import BG from '../../../assets/IntroBG85.jpg';
import upperBG from '../../../assets/IntroBGx22.jpg';
import logo from '../../../assets/logo.svg';
import API_KEY from "../../../../key";
import useScreenTime from '../../../hooks/useScreenTime'; // Your existing hook
import analytics from '../../../utils/analytics'; // Your existing analytics class

// Tab order
const tabOrder = ['DECK', 'BRIEF', 'NOTES', 'SCORE'];

// AuthModal Component
const AuthModal = ({ onChooseIncognito, onChooseGoogleClick }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col justify-center items-center z-50 text-white font-inter px-4">
      <div className="bg-black border border-gray-800 p-8 rounded-lg shadow-2xl flex flex-col items-center w-full max-w-sm">
        <h1 className="text-3xl font-medium mb-2 text-center">
          Welcome to Vertx
        </h1>
        <p className="my-4 text-sm text-gray-400 leading-relaxed text-center">
          Sign in or continue incognito to view the content.
        </p>

        <div className="w-full flex flex-col gap-4 mt-4">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={onChooseGoogleClick}
              onError={() => alert('Google sign-in failed. Please try again.')}
              width={288}
              shape="pill"
              text="continue_with"
              theme="filled_blue"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-px w-full bg-gray-700"></div>
            <p className="text-center text-md text-gray-400">or</p>
            <div className="h-px w-full bg-gray-700"></div>
          </div>

          <button
            onClick={onChooseIncognito}
            className="bg-gray-800 text-sm w-full text-white px-4 py-3 rounded-md shadow hover:bg-gray-700 active:bg-gray-700 transition"
          >
            Continue in Incognito Mode
          </button>
        </div>
      </div>
    </div>
  );
};

const ReachLinkPreview = () => {
  // URL and data states
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Authentication states
  const [authChosen, setAuthChosen] = useState(false);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('user-email') || null);

  // Navigation states
  const [activeTab, setActiveTab] = useState(tabOrder[0]);
  const [deckSlideIndex, setDeckSlideIndex] = useState(0);
  const [notesSlideIndex, setNotesSlideIndex] = useState(0);

  // PDF Viewer states
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [pageRendering, setPageRendering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const canvasRef = useRef(null);

  // Scoring states
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Analytics tracking - Get UUIDs from localStorage
  const userUUID = localStorage.getItem('reachlink-user-uuid');
  const sessionId = localStorage.getItem('reachlink-session-id');

  // Track screen time using your existing hook
  useScreenTime({
    slideIndex: activeTab === 'DECK' ? currentPage - 1 : 
                activeTab === 'NOTES' ? notesSlideIndex : 
                activeTab === 'BRIEF' ? 0 : 
                activeTab === 'SCORE' ? 0 : 0,
    tabName: activeTab,
    userUUID,
    sessionId,
    isActive: authChosen, // Only track when user has chosen auth method
  });

  // Check if user has already chosen authentication method
useEffect(() => {
  const hasUUID = localStorage.getItem('reachlink-user-uuid');
  const hasSession = localStorage.getItem('reachlink-session-id');
  const hasEmail = localStorage.getItem('user-email');
  
  if (hasUUID && hasSession && hasEmail) {
    // Only auto-auth if Google login was used
    setAuthChosen(true);
    setUserEmail(hasEmail);
  }
}, []);


  // Fetch reach link data
  useEffect(() => {
    if (!slug) {
      setError('Missing reach link slug in URL');
      setLoading(false);
      return;
    }

    fetch(`${API_KEY}/api/upgrade-deck/reach/${slug}`)
      .then((res) => res.json())
      .then((res) => {
        console.log('API Response:', res);
        if (res.success) {
          console.log('Data received:', res.data);
          setData(res.data);
        } else {
          setError(res.message || 'Invalid reach link');
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Failed to fetch reach profile');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  // Authentication handlers
  const handleIncognito = () => {
    console.log('Continuing in incognito mode');
    console.log('Current UUIDs:', { userUUID, sessionId });
    // Generate UUIDs if they don't exist
    if (!userUUID) {
      const newUUID = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('reachlink-user-uuid', newUUID);
      analytics.userUUID = newUUID;
    }
    if (!sessionId) {
      const newSession = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('reachlink-session-id', newSession);
      analytics.sessionId = newSession;
    }

    // Initialize session with no profile data (incognito)
    analytics.initSession();
    setAuthChosen(true);
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      console.log('Google credential response:', credentialResponse);
      console.log('Current UUIDs before Google auth:', { userUUID, sessionId });
      const decoded = jwtDecode(credentialResponse.credential);
      setUserEmail(decoded.email);
      localStorage.setItem('user-email', decoded.email);

      // Create profile object with Google data
      const googleProfileData = {
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub, // 'sub' is the unique Google ID
        profilePictureUrl: decoded.picture
      };

      // Initialize session with Google profile data
      analytics.initSession(googleProfileData);
      setAuthChosen(true);
    } catch (err) {
      console.error('Google token decode error:', err);
      alert('Google login failed.');
    }
  };

  // Score submission handler
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      await analytics.submitFeedback(score, feedback);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      // Still show success to user, but log the error
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // PDF loading function (keep your existing implementation)
  const loadPDF = async (pdfUrl) => {
    if (!window.pdfjsLib) {
      console.error('PDF.js library not loaded');
      setPdfError('PDF viewer library not loaded');
      return;
    }

    if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    try {
      setPdfLoading(true);
      setPdfError('');
      
      const fallbackPdfUrl = 'https://storage.googleapis.com/rech_link/1754055313199-Vertx%20Deck%20(2).pdf';
      const primaryProxyUrl = `${API_KEY}/api/pdf/proxy-pdf?url=${encodeURIComponent(pdfUrl)}`;
      const urls = [primaryProxyUrl];

      let pdf = null;
      let lastError = null;

      for (const url of urls) {
        try {
          console.log('Attempting to load PDF from:', url);
          const loadingTask = window.pdfjsLib.getDocument({
            url: url,
            httpHeaders: { 'Accept': 'application/pdf' }
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

      setTimeout(() => {
        renderPage(pdf, 1, true);
      }, 100);
    } catch (error) {
      console.error('Error loading PDF:', error);
      setPdfError('Failed to load PDF document. The PDF may be restricted or unavailable.');
    } finally {
      setPdfLoading(false);
    }
  };

  // PDF rendering function (keep your existing implementation)
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

      if (!isFirstLoad) {
        canvas.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      context.clearRect(0, 0, canvas.width, canvas.height);

      const viewport = page.getViewport({ scale: 1.0 });
      const container = canvas.parentElement;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width * 0.9;
      const containerHeight = containerRect.height * 0.9;

      const minWidth = 300;
      const minHeight = 400;
      const effectiveWidth = Math.max(containerWidth, minWidth);
      const effectiveHeight = Math.max(containerHeight, minHeight);

      const scaleWidth = effectiveWidth / viewport.width;
      const scaleHeight = effectiveHeight / viewport.height;
      const scale = Math.min(scaleWidth, scaleHeight, 2.0);

      const scaledViewport = page.getViewport({ scale });
      const pixelRatio = window.devicePixelRatio || 1;

      canvas.width = scaledViewport.width * pixelRatio;
      canvas.height = scaledViewport.height * pixelRatio;
      canvas.style.width = scaledViewport.width + 'px';
      canvas.style.height = scaledViewport.height + 'px';

      context.scale(pixelRatio, pixelRatio);

      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport
      };

      await page.render(renderContext).promise;
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

  // PDF navigation functions
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

  // Load PDF when DECK tab is activated
  useEffect(() => {
    if (activeTab === 'DECK' && data?.deckUrl) {
      if (!pdfDoc) {
        loadPDF(data.deckUrl);
      } else {
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

  // Handle window resize for PDF
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

  // Dynamic content for NOTES slider
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

  // Score calculation for visual slider
  const fillPercentage = ((score - 0) / (10 - 0)) * 100;

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'DECK':
        return (
          <div className="relative w-full h-[71vh]">
            <div className="w-full h-full flex items-center justify-center bg-black">
              {pdfLoading && (
                <div className="text-white text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                  Loading PDF...
                </div>
              )}
              
              {pdfError && (
                <div className="text-red-400 text-center p-4">
                  <p>{pdfError}</p>
                  <button 
                    onClick={() => data?.deckUrl && loadPDF(data.deckUrl)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Retry Loading PDF
                  </button>
                </div>
              )}

              {!pdfLoading && !pdfError && (
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full object-contain transition-opacity duration-200"
                  style={{ opacity: isTransitioning ? 0 : 1 }}
                />
              )}
            </div>

            {pdfDoc && (
              <div className="absolute bottom-4 w-full md:w-auto md:right-36 flex justify-center md:justify-end gap-3">
                <div className="bg-black/50 p-1 rounded-md flex gap-3">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors duration-200 text-white disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <span className="text-white text-xs px-2 flex items-center">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors duration-200 text-white disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
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
            <div className="absolute bottom-4 w-full md:w-auto md:right-36 flex justify-center md:justify-end gap-3">
              <div className="bg-black/50 p-1 rounded-md flex gap-3">
                <button
                  onClick={() => setNotesSlideIndex(i => (i > 0 ? i - 1 : 0))}
                  disabled={notesSlideIndex === 0}
                  className="px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors duration-200 text-white disabled:text-gray-500"
                >
                  Prev
                </button>
                <span className="text-white text-xs px-2 flex items-center">
                  {notesSlideIndex + 1} / {notesSlides.length}
                </span>
                <button
                  onClick={() => setNotesSlideIndex(i => (i < notesSlides.length - 1 ? i + 1 : i))}
                  disabled={notesSlideIndex === notesSlides.length - 1}
                  className="px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors duration-200 text-white disabled:text-gray-500"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );

      case 'SCORE':
        if (submitted) {
          return (
            <div style={{ fontFamily: "'Crimson Text', serif" }} className="p-8 w-full bg-black/55 mx-auto h-[71vh] text-center text-gray-300 flex flex-col items-center justify-center">
              <h2 className="text-3xl md:text-4xl italic mb-4">You've scored {score.toFixed(1)}</h2>
              <p className="text-xl md:text-2xl max-w-2xl">{feedback || 'No Feedback Given.'}</p>
            </div>
          );
        }

        return (
          <div style={{ fontFamily: "'Crimson Text', serif" }} className="p-4 md:p-8 w-full bg-black/55 mx-auto h-[66vh] text-center text-gray-300">
            <h2 className="text-3xl md:text-4xl font-normal mb-8 md:mb-16">Score This Startup</h2>
            <div className="flex flex-col items-center mb-8">
              <input
                type="range"
                min={0}
                max={10}
                step="0.1"
                value={score}
                onChange={e => setScore(parseFloat(e.target.value))}
                className="w-full max-w-md md:max-w-xl lg:max-w-4xl h-2 appearance-none cursor-pointer range-lg"
                style={{ background: `linear-gradient(to right, #D1D5DB ${fillPercentage}%, #4B5563 ${fillPercentage}%)` }}
              />
              <p className="text-5xl md:text-6xl font-bold mt-4">{score.toFixed(1)}</p>
            </div>
            <div>
              <textarea
                className="w-full max-w-md md:max-w-xl lg:max-w-4xl mx-auto h-32 p-4 mb-8 bg-white/5 border border-gray-700 rounded-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Write your thoughts or message here..."
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
              />
            </div>
            <div className='justify-end flex max-w-md md:max-w-xl lg:max-w-4xl mx-auto'>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-white font-bold text-lg md:text-xl rounded-lg transition duration-200 hover:bg-white/10 disabled:opacity-50"
              >
                {isSubmitting ? 'SUBMITTING…' : 'SUBMIT'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading reach profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center" style={{ fontFamily: "'Crimson Text', serif" }}>
      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${BG})` }}></div>
      <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: `url(${upperBG})` }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950 to-transparent opacity-80"></div>
      
      <div className="relative z-10 w-full flex flex-col items-center pt-8 md:pt-12 pb-8 px-4">
        <nav className="flex space-x-4 md:space-x-8 mb-4">
          {tabOrder.map((tab) => (
            <button
              key={tab}
              style={{ fontFamily: "'Crimson Text', serif" }}
              className={`text-lg md:text-xl font-bold uppercase tracking-wider px-2 md:px-4 py-2 transition-all duration-300 ease-in-out ${
                activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
        
        <div className="rounded-lg shadow-2xl w-full max-w-7xl mx-auto">
           {!authChosen && (
      <AuthModal
        onChooseIncognito={handleIncognito}
        onChooseGoogleClick={handleGoogleSuccess}
      />
    )}

    {authChosen && (
      <div>
        {/* Your normal UI (tabs, deck, brief, notes, etc.) */}
        {renderContent()}
      </div>
    )}
        </div>
      </div>
      
      <footer style={{ fontFamily: "'Crimson Text', serif" }} className="relative z-10 text-gray-500 text-sm flex items-center py-4 mt-auto">
        REACHLINK by <img className='w-4 h-4 mx-2' src={logo} alt="Vertx Logo" /> VERTX
      </footer>

      {/* {!authChosen && (
        <AuthModal
          onChooseIncognito={handleIncognito}
          onChooseGoogleClick={handleGoogleSuccess}
        />
      )} */}
    </div>
  );
};

// Wrap with GoogleOAuthProvider
export default function WrappedReachLinkPreview() {
  return (
    <GoogleOAuthProvider clientId="817384216349-6knt6pfqq2ajhigvvojd1i2um8sedeg1.apps.googleusercontent.com">
      <ReachLinkPreview />
    </GoogleOAuthProvider>
  );
}