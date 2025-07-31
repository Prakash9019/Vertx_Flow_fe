import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react'; // You’re using useEffect but haven’t imported it


// Using your provided image imports directly
import BG from '../../assets/IntroBG85.jpg';
import upperBG from '../../assets/IntroBGx22.jpg';



const ReachLinkPreview = () => {
  // Define the order of global tabs
  const tabOrder = ['DECK', 'BRIEF', 'NOTES', 'SCORE'];
  // State to manage the currently active global tab
  const [activeTab, setActiveTab] = useState(tabOrder[0]); // Initialize with the first tab

  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) {
      setError('Missing reach link slug in URL');
      return;
    }

    fetch(`http://localhost:5000/api/upgrade-deck/reach/${slug}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
        } else {
          setError(res.message || 'Invalid reach link');
        }
      })
      .catch(() => setError('Failed to fetch reach profile'));
  }, [slug]);


  // Function to navigate to the next global tab
  const handleNextTab = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  };

  // Function to navigate to the previous global tab
  const handlePrevTab = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  // Function to render content based on the active tab
  const renderContent = () => {
    // Determine if the current global tab is the first or last for disabling buttons
    const currentIndex = tabOrder.indexOf(activeTab);
    const isFirstTab = currentIndex === 0;
    const isLastTab = currentIndex === tabOrder.length - 1;

    const [score, setScore] = useState(0); // Initial score as seen in the image
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false); // To toggle between input and display view

    // Handler for score slider change
    const handleScoreChange = (event) => {
      setScore(parseFloat(event.target.value));
    };

    // Handler for feedback textarea change
    const handleFeedbackChange = (event) => {
      setFeedback(event.target.value);
    };

    // Handler for submit button
    const handleSubmit = () => {
      setSubmitted(true);
    };




    switch (activeTab) {
      case 'DECK':
        return (
          <div className="flex flex-col w-7xl  h-[71vh] overflow-hidden mx-auto font-[inter] items-center justify-center p-0">
            <img
              src={upperBG}
              alt="Deck Content"
              className="w-full h-auto object-cover" // Ensure it covers the area
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x675/202c3d/e2e8f0?text=Image+Load+Error'; }}
            />
          </div>
        );
      case 'BRIEF':
        return (
          <div className="bg-black w-7xl  h-[71vh]  p-6 md:p-12 rounded-lg shadow-xl   text-gray-200 font-[inter] mx-auto">
            {/* Company Name and Links */}
            <div className="text-center mb-4">
              <h1 className="text-xl md:text-2xl font-bold mb-1">{data?.companyName || 'Loading...'}</h1>
              <p className="text-sm md:text-base text-gray-400 mb-2">Founded on {data?.founded || 'N/A'}</p>
              <div className="flex justify-center space-x-2 text-sm md:text-base">
                <a href={data?.companyWebsite} className="text-blue-400 hover:underline" target="_blank" rel="noreferrer">
                  Website
                </a>
                <a href={data?.linkedinUrl} className="text-blue-400 hover:underline" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>

              </div>
            </div>

            {/* Product Section */}
            <div className="mb-4 text-center">
              <h2 className="text-md md:text-lg font-semibold uppercase tracking-wider text-gray-400 mb-2">Product</h2>
              <p className="text-lg md:text-xl font-bold">{data?.companyName}</p>
            </div>

            {/* Description Section */}
            <div className="mb-4 text-center">
              <h2 className="text-lg md:text-xl font-semibold uppercase tracking-wider text-gray-400 mb-2">Description</h2>
              <p className="text-lg md:text-xl font-medium">{data?.companyDescription}</p>
            </div>

            {/* Details Table Section (Sectors, Stage, Category, Model, HQ) */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-y-3 gap-x-2  text-center">
              <div>
                <h3 className="text-sm md:text-base font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Stage
                </h3>
                <p className="text-base md:text-lg font-medium">
                  {data?.companyStage || 'N/A'}
                </p>
              </div>

              <div>
                <h3 className="text-sm md:text-base font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Sectors
                </h3>
                <p className="text-base md:text-lg font-medium">
                  {data?.businessSectors?.join(', ') || 'N/A'}
                </p>
              </div>

              {/* Category */}
              <div>
                <h3 className="text-sm md:text-base font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Category
                </h3>
                <p className="text-base md:text-lg font-medium">
                  {data?.businessCategory || 'N/A'}
                </p>
              </div>

              {/* Model */}
              <div>
                <h3 className="text-sm md:text-base font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Model
                </h3>
                <p className="text-base md:text-lg font-medium">
                  {data?.businessModel || 'N/A'}
                </p>
              </div>

              {/* HQ */}
              <div>
                <h3 className="text-sm md:text-base font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  HQ
                </h3>
                <p className="text-base md:text-lg font-medium">
                  {data?.hqLocation || 'N/A'}
                </p>
              </div>
            </div>

            {/* Team Section */}
            <div className="text-center mb-2">
              <h2 className="text-lg md:text-xl font-semibold uppercase tracking-wider text-gray-400 mb-2">Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Team Member 1 */}
                <div>
                  <p className="text-lg md:text-xl font-bold">{data?.founder1FullName}</p>
                  <p className="text-base md:text-lg text-gray-300 mb-2">{data?.founder1TitleRole}</p>
                  <a href={data?.founder1LinkedinProfileURL} className="text-blue-400 hover:underline text-sm md:text-base">LinkedIn</a>

                </div>
                {/* Team Member 2 */}
                <div>
                  <p className="text-lg md:text-xl font-bold">{data?.founder2FullName}</p>
                  <p className="text-base md:text-lg text-gray-300 mb-2">{data?.founder2TitleRole}</p>
                  <a href={data?.founder2LinkedinProfileURL} className="text-blue-400 hover:underline text-sm md:text-base">LinkedIn</a>

                </div>
                {/* Team Member 3 */}
                <div>
                  <p className="text-lg md:text-xl font-bold">{data?.founder3FullName}</p>
                  <p className="text-base md:text-lg text-gray-300 mb-2">{data?.founder3TitleRole}</p>
                  <a href={data?.founder3LinkedinProfileURL} className="text-blue-400 hover:underline text-sm md:text-base">LinkedIn</a>

                </div>
              </div>
            </div>
          </div>
        );
      case 'NOTES':
        return (
          <div className="p-4 max-w-7xl h-[71vh] font-[inter] text-center text-gray-300 flex flex-col justify-center items-center bg-black  md:p-8 rounded-lg shadow-xl  mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif italic mb-8">Market Opportunity</h2>
            <p className="text-xl md:text-2xl leading-relaxed max-w-2xl">
              There's a growing market opportunity in hyperlocal pet wellness combining doorstep
              vet care, organic pet food delivery, and real-time health tracking. Gen Z pet parents are
              driving the demand.
            </p>
          </div>
        );
      case 'SCORE':
        return (
          <div className="p-8 w-7xl bg-black mx-auto h-[71vh] font-[inter] text-center text-gray-300">
            {!submitted ? (
              <>
                <h2 className="text-3xl md:text-4xl font-bold mb-8">Score This Startup</h2>
                <div className="flex flex-col items-center mb-8">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={score}
                    onChange={handleScoreChange}
                    className="w-full max-w-6xl mx-auto h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
                    style={{
                      // Custom track and thumb styles to match the image
                      '--range-track-color': '#4B5563', // gray-600
                      '--range-thumb-color': '#F3F4F6', // gray-100
                      '--range-track-height': '4px',
                      '--range-thumb-size': '16px',
                      '--range-thumb-border-radius': '9999px', // full rounded
                      '--range-progress-color': '#D1D5DB' // gray-300 for the filled part
                    }}
                  />
                  <p className="text-5xl md:text-6xl font-bold mt-4">{score.toFixed(1)}</p>
                </div>
                <div>
                  <textarea
                    className="w-full max-w-6xl mx-auto h-32 p-4 mb-8 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Write your thoughts or message here..."
                    value={feedback}
                    onChange={handleFeedbackChange}
                  >

                  </textarea>
                </div>
                <div className='justify-end flex max-w-6xl'>
                  <button
                    onClick={handleSubmit}
                    className="px-3 py-1 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition duration-200"
                  >
                    SUBMIT
                  </button>
                </div>

              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[71vh]">
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

  // These are for the global navigation buttons at the bottom
  const currentIndex = tabOrder.indexOf(activeTab);
  const isFirstTab = currentIndex === 0;
  const isLastTab = currentIndex === tabOrder.length - 1;

  return (
    <div className="h-full font-[inter] inset-0 bg-cover bg-center text-white font-inter flex flex-col items-center justify-between relative overflow-scroll"
      style={{ backgroundImage: `url(${BG})` }}>
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
      <div className="relative z-10 w-full  mx-auto flex flex-col items-center pt-12 pb-8">
        {/* Tabs navigation - styled to be subtle like in the screenshot */}
        <nav className="flex space-x-8 mb-8">
          {tabOrder.map((tab) => (
            <button
              key={tab}
              className={`
                text-xl font-medium uppercase tracking-wider px-4 py-2
                transition-all duration-300 ease-in-out
                ${activeTab === tab
                  ? 'text-white border-b-2 border-white' // Active tab has a bottom border
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
        <div className="  rounded-lg shadow-2xl w-full  overflow-scroll">
          {renderContent()}
        </div>

        {/* Global Tab Navigation Buttons (at the bottom) */}
        <div className="flex gap-3 w-6xl justify-end mt-2">
          <button
            onClick={handlePrevTab}
            disabled={isFirstTab}
            className={`
              px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider
              transition-colors duration-200
              ${isFirstTab
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
              }
            `}
          >
            Prev
          </button>
          <button
            onClick={handleNextTab}
            disabled={isLastTab}
            className={`
              px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider
              transition-colors duration-200
              ${isLastTab
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
              }
            `}
          >
            Next
          </button>
        </div>
      </div>

      {/* Footer - positioned at the very bottom */}
      <footer className="relative z-10 text-gray-500 text-sm -mt-5 ">
        REACHLINK by <span className="text-red-500">▼</span> VERTX
      </footer>
    </div>
  );
};

export default ReachLinkPreview;