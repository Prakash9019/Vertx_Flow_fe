import React, { useState,useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BG from '../../assets/IntroBG85.jpg';
import upperBG from '../../assets/IntroBGx22.jpg';
import logo from '../../assets/logo.svg';


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

  useEffect(() => {
    if (!slug) {
      setError('Missing reach link slug in URL');
      return;
    }

    fetch(`http://localhost:5000/api/upgrade-deck/reach/${slug}`)
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


  // --- New states for DECK and NOTES sliders ---
  const [deckSlideIndex, setDeckSlideIndex] = useState(0);
  const [notesSlideIndex, setNotesSlideIndex] = useState(0);

  // Dummy content for DECK slider (you can replace with actual image/component paths)
  const deckSlides = [
    upperBG, // Your original DECK content
    'https://placehold.co/1200x675/2f3a4b/e2e8f0?text=Deck+Slide+2',
    'https://placehold.co/1200x675/3a4b2f/e2e8f0?text=Deck+Slide+3',
  ];

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

  // --- Handlers for individual sliders ---
  const handleNextSlide = (tabName) => {
    if (tabName === 'DECK') {
      setDeckSlideIndex(prevIndex => (prevIndex < deckSlides.length - 1 ? prevIndex + 1 : prevIndex));
    } else if (tabName === 'NOTES') {
      setNotesSlideIndex(prevIndex => (prevIndex < notesSlides.length - 1 ? prevIndex + 1 : prevIndex));
    }
  };

  const handlePrevSlide = (tabName) => {
    if (tabName === 'DECK') {
      setDeckSlideIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    } else if (tabName === 'NOTES') {
      setNotesSlideIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    }
  };

  // Function to render content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'DECK':
        return (
          <div>
          <div style={{ fontFamily: "'Crimson Text', serif" }} className="flex flex-col w-7xl h-[71vh] overflow-hidden mx-auto items-center justify-center p-0 relative">
            <img
              src={deckSlides[deckSlideIndex]}
              alt={`Deck Slide ${deckSlideIndex + 1}`}
              className="w-full h-auto object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x675/202c3d/e2e8f0?text=Image+Load+Error'; }}
            />
          </div>
          {/* Slider Navigation for DECK - POSITIONED AT BOTTOM RIGHT */}
            <div className="absolute bottom-0  right-36 flex gap-3">
              <button
                onClick={() => handlePrevSlide('DECK')}
                disabled={deckSlideIndex === 0}
                className={`
                  px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider
                  transition-colors duration-200
                  ${deckSlideIndex === 0 ? 'text-gray-500 cursor-not-allowed' : 'cursor-pointer text-white'}
                `}
              >
                Prev
              </button>
              <button
                onClick={() => handleNextSlide('DECK')}
                disabled={deckSlideIndex === deckSlides.length - 1}
                className={`
                  px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider
                  transition-colors duration-200
                  ${deckSlideIndex === deckSlides.length - 1 ? 'text-gray-500 cursor-not-allowed' : 'cursor-pointer text-white'}
                `}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 'BRIEF':
        return (
          <div style={{ fontFamily: "'Crimson Text', serif" }} className="bg-black w-7xl h-[71vh] p-6 md:p-12 rounded-lg shadow-xl text-gray-200 mx-auto overflow-hidden">
            {/* Company Name and Links */}
            <div className="text-center mb-4">
              <h1 className="text-xl md:text-2xl font-semibold mb-1">{data?.companyName?.toUpperCase() || 'COMPANY NAME'}</h1>
              <p className="text-xl md:text-2xl text-white mb-2"> <span className=' italic'>Founded on</span> <span className='font-semibold'>{data?.founded ? new Date(data.founded).getFullYear() : 'YEAR'}</span></p>
              <div className="flex absolute top-41.5 right-120 opacity-80 justify-center space-x-2 text-[10px] uppercase">
                <a href={data?.companyWebsite || '#'} className="text-gray-300">Website</a>
                <span className="text-gray-500">|</span>
                <a href={data?.linkedinUrl || '#'} className="text-gray-300">LinkedIn</a>
              </div>
            </div>
            <div className='border-[0.5px] justify-center mx-auto w-[100px] mb-6 border-white'/>
            {/* Product Section */}
            <div className="mb-6 text-center">
              <h2 className="text-xs font-semibold uppercase underline tracking-wider text-white/50 mb-1">Product</h2>
              <p className="text-[16px] font-semibold">{data?.companyName || 'PRODUCT NAME'}</p>
            </div>

            {/* Description Section */}
            <div className="mb-8 text-center">
              <h2 className="text-xs font-semibold uppercase underline tracking-wider text-white/50 mb-1">Description</h2>
              <p className="text-[16px] font-semibold">{data?.companyDescription || 'Company Description'}</p>
            </div>

            {/* Details Table Section (Sectors, Stage, Category, Model, HQ) */}
            <div className="flex justify-around gap-y-3 gap-x-2 mb-10 mx-auto items-center max-w-2xl text-center">
              <div>
                <h3 className="text-xs font-semibold uppercase underline tracking-wider text-white/50 mb-1">Sectors</h3>
                <p className="text-[16px] font-semibold">{data?.businessSectors?.join(', ') || 'Sectors'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase underline tracking-wider text-white/50 mb-1">Stage</h3>
                <p className="text-[16px] font-semibold">{data?.companyStage || 'Stage'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase underline tracking-wider text-white/50 mb-1">Category</h3>
                <p className="text-[16px] font-semibold">{data?.businessCategory || 'Category'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase underline tracking-wider text-white/50 mb-1">Model</h3>
                <p className="text-[16px] font-semibold">{data?.raisedFrom?.join(', ') || 'Model'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase underline tracking-wider text-white/50 mb-1">HQ</h3>
                <p className="text-[16px] font-semibold">{data?.hqLocation || 'Location'}</p>
              </div>
            </div>

            {/* Team Section */}
            <div className="text-center mb-2">
              <h2 className="text-[16px] flex justify-center mx-auto font-semibold uppercase underline tracking-wider text-white/50 mb-2">Team</h2>
              <div className="grid grid-cols-3 gap-2 text-white mx-auto max-w-sm">
                {/* CEO/Founder from Profile */}
                {data?.founderName && (
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-semibold">{data.founderName}</p>
                    <p className="text-xs font-semibold mb-1">CEO</p>
                    <a href={data?.founderLinkedinUrl || '#'} className="text-[10px] uppercase">LinkedIn</a>
                  </div>
                )}
                {/* First Team Member */}
                {data?.founder1FullName && (
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-semibold">{data.founder1FullName}</p>
                    <p className="text-xs font-semibold mb-1">{data.founder1TitleRole || 'Role'}</p>
                    <a href={data?.founder1LinkedinProfileURL || '#'} className="text-[10px] uppercase">LinkedIn</a>
                  </div>
                )}
                {/* Additional Team Members */}
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
          <div style={{ fontFamily: "'Crimson Text', serif" }} className="p-4 max-w-7xl h-[71vh] overflow-hidden text-center text-gray-300 flex flex-col justify-center items-center bg-black md:p-8 rounded-lg shadow-xl mx-auto relative">
            <h2 className="text-3xl md:text-4xl text-white/60 font-serif italic mb-8">{currentNote.title}</h2>
            <p className="text-xl md:text-2xl text-white max-w-xl">
              {currentNote.text}
            </p>
            </div>
            <div className="absolute bottom-0 right-36 flex gap-3">
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
          <div style={{ fontFamily: "'Crimson Text', serif" }} className="p-8 w-7xl bg-black/55 mx-auto h-[71vh] text-center text-gray-300">
            {!submitted ? (
              <>
                <h2 style={{ fontFamily: "'Crimson Text', serif" }} className="text-3xl md:text-4xl font-normal mb-15">Score This Startup</h2>
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
                <div className='justify-end flex max-w-6xl'>
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
      <div className="h-full inset-0 bg-cover bg-center text-white font-inter flex flex-col items-center justify-center relative"
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

      {/* Background layer 2: Using upperBG for a subtle overlay or texture, if intended */}
      {/* This layer is semi-transparent to create a subtle overlay effect, similar to your image's depth. */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{ backgroundImage: `url(${upperBG})` }}
      ></div>

      {/* A dark gradient overlay to ensure the background remains subtle and the content pops */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950 to-transparent opacity-80"></div>

      {/* Main content container */}
      <div className="relative z-10 w-full mx-auto flex flex-col items-start pt-12 pb-8">
        {/* Tabs navigation - styled to be subtle like in the screenshot */}
        <nav className="flex space-x-8 mb-4 ml-34">
          {tabOrder.map((tab) => (
            <button
              key={tab}
              style={{ fontFamily: "'Crimson Text', serif" }}
              className={`
                text-xl font-bold uppercase tracking-wider px-4 py-2
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
        <div className="rounded-lg shadow-2xl w-full overflow-scroll">
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