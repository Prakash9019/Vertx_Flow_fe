// CompaniesReachLink.jsx
import React, { useEffect, useState } from 'react';
import MainBG from '../../assets/IntroBG50.jpg';
import MainBG2 from '../../assets/IntroBGx2.jpg';
import AllBG from '../../assets/IntroBG50.jpg';
import BG2 from '../../assets/IntroBGx2.jpg';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';

export const DeckContent = ({ imageSrc }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {/* Image from screenshot 2025-07-30 144719.jpg */}
      <img
        src={imageSrc} // Prop for the image source
        alt="Deck Image"
        className="w-full max-w-lg rounded-md shadow-lg"
      />
    </div>
  );
};
export const BriefContent = () => {
  return (
    <div className="text-white bg-black h-screen w-full text-center">
      {/* Content from screenshot 2025-07-30 144752.jpg */}
      <h2 className="text-2xl font-bold mb-4 font-['Inter']">OCTARTECH PRIVATE LIMITED</h2>
      <div className="text-sm mb-6">
        <span className="text-gray-400">Website</span> <span className="ml-4 text-gray-400">LinkedIn</span>
      </div>
      <p className="mb-8 italic">Founded on JULY 2025</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-left text-sm">
        <div>
          <h3 className="uppercase text-gray-400 font-bold mb-1">PRODUCT</h3>
          <p>VERTEX AI</p>
        </div>
        <div className="md:col-span-2 lg:col-span-2">
          <h3 className="uppercase text-gray-400 font-bold mb-1">DESCRIPTION</h3>
          <p>End to end AI Fundraising Suite</p>
        </div>

        <div className="mt-6 col-span-full grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
          <div>
            <h3 className="uppercase text-gray-400 font-bold mb-1">SECTORS</h3>
            <p>AI, Generative Tech/AI, FinTech</p>
          </div>
          <div>
            <h3 className="uppercase text-gray-400 font-bold mb-1">STAGE</h3>
            <p>Pre-Revenue</p>
          </div>
          <div>
            <h3 className="uppercase text-gray-400 font-bold mb-1">CATEGORY</h3>
            <p>B2B, B2C, B2B2C</p>
          </div>
          <div>
            <h3 className="uppercase text-gray-400 font-bold mb-1">MODEL</h3>
            <p>SaaS</p>
          </div>
          <div>
            <h3 className="uppercase text-gray-400 font-bold mb-1">HQ</h3>
            <p>India</p>
          </div>
        </div>

        <div className="mt-8 col-span-full text-center">
          <h3 className="uppercase text-gray-400 font-bold mb-4">TEAM</h3>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm">
            <div>
              <p>Praneeth Kumar</p>
              <p className="text-gray-400">CEO</p>
              <p className="text-blue-400 hover:underline cursor-pointer">LINKEDIN</p>
            </div>
            <div>
              <p>Surya Prakash</p>
              <p className="text-gray-400">CTO</p>
              <p className="text-blue-400 hover:underline cursor-pointer">LINKEDIN</p>
            </div>
            <div>
              <p>Tharan PS</p>
              <p className="text-gray-400">CMO</p>
              <p className="text-blue-400 hover:underline cursor-pointer">LINKEDIN</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotesContent = () => {
  return (
    <div className="text-white w-full text-center">
      {/* Content from screenshot 2025-07-30 144802.jpg */}
      <h2 className="text-3xl italic font-serif mb-8">Market Opportunity</h2>
      <p className="text-lg leading-relaxed max-w-2xl mx-auto">
        There's a growing market opportunity in hyperlocal pet wellness combining doorstep
        vet care, organic pet food delivery, and real-time health tracking. Gen Z pet parents are
        driving the demand.
      </p>
    </div>
  );
};

export const ScoreContent = ({ onSubmit }) => {
  const [score, setScore] = useState(0); // Default score is 0
  const [feedback, setFeedback] = useState('');

  const handleSliderChange = (event) => {
    setScore(parseFloat(event.target.value).toFixed(1)); // Keep one decimal place
  };

  const handleSubmit = () => {
    if (parseFloat(score) === 0) { // Check if score is still 0 (not selected)
      alert("Please select a score before submitting."); // Or use a toast notification
      return;
    }
    onSubmit({ score: parseFloat(score), feedback });
  };

  return (
    <div className="text-white w-full text-center max-w-lg mx-auto p-4">
      {/* Content from screenshot 2025-07-30 144834.jpg */}
      <h2 className="text-2xl font-bold mb-8">Score This Startup</h2>

      <div className="mb-10">
        <input
          type="range"
          min="0" // Allow 0, but validate on submit
          max="10"
          step="0.1"
          value={score}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg
                     [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                     [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white"
        />
        <p className="text-4xl font-bold mt-4">{parseFloat(score).toFixed(1)}</p>
      </div>

      <textarea
        placeholder="Write your thoughts or message here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full p-4 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-500 min-h-[120px] outline-none focus:border-white focus:ring-1 focus:ring-white resize-y"
      ></textarea>

      <button
        onClick={handleSubmit}
        className="mt-8 bg-white text-black px-6 py-2 rounded-[0.125rem] font-['Inter'] text-sm font-medium hover:bg-gray-200 transition-colors"
      >
        SUBMIT
      </button>
    </div>
  );
};

export const ScoreSubmitted = ({ score, feedback }) => {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center text-white text-center"
      style={{
        backgroundImage: `url(${AllBG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 p-5 w-full max-w-4xl mx-auto flex flex-col justify-center items-center flex-grow">
        <div className="bg-black bg-opacity-70 rounded-xl shadow-xl w-full p-6 sm:p-8 md:p-10 min-h-[400px] flex flex-col justify-center items-center">
          <h2 className="text-3xl italic font-serif mb-6">
            You've scored {parseFloat(score).toFixed(1)} for this pitch
          </h2>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto">
            {feedback.trim() !== '' ? feedback : "No Feedback Given."}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-5 text-gray-400 text-xs md:text-sm flex items-center z-10">
        REACHLINK by <span className="ml-1">▼</span> VERTX
      </div>
    </div>
  );
};
const tabOrder = ['deck', 'brief', 'notes', 'score'];
export const ReachlinkPreview = () => {
  const { tabName } = useParams(); // Get the current tab from the URL
  const navigate = useNavigate();
  const [scoreData, setScoreData] = useState({ score: 0, feedback: '' });
  const [showScoreSubmitted, setShowScoreSubmitted] = useState(false);

  // Set initial active tab based on URL or default to 'deck'
  const currentTabIndex = tabOrder.indexOf(tabName || 'deck');
  const activeTab = tabName || 'deck';

  useEffect(() => {
    // If the URL doesn't match a valid tab, redirect to 'deck'
    if (!tabOrder.includes(tabName)) {
      navigate('/fundraising/preview', { replace: true });
    }
  }, [tabName, navigate]);

  const handleTabClick = (newTab) => {
    navigate(`/fundraising/preview/${newTab}`);
  };

  const handleNext = () => {
    const nextIndex = currentTabIndex + 1;
    if (nextIndex < tabOrder.length) {
      navigate(`/fundraising/preview/${tabOrder[nextIndex]}`);
    }
  };

  const handlePrev = () => {
    const prevIndex = currentTabIndex - 1;
    if (prevIndex >= 0) {
      navigate(`/fundraising/preview/${tabOrder[prevIndex]}`);
    }
  };

  // Callback function for when ScoreContent is submitted
  const handleScoreSubmit = (data) => {
    if (data.score === 0) {
      toast.error("Please select a score before submitting.");
      return;
    }
    setScoreData(data);
    setShowScoreSubmitted(true); // Show the ScoreSubmitted page
    navigate('/fundraising/score-submitted'); // Navigate to the score submitted page
  };


  // If the score has been submitted, render ScoreSubmitted page
  if (showScoreSubmitted) {
    return <ScoreSubmitted score={scoreData.score} feedback={scoreData.feedback} />;
  }

  return (
    <div
      className="relative min-h-screen flex flex-col justify-between items-center text-white text-center pb-20" // Add pb-20 for footer
      style={{
        backgroundImage: `url(${AllBG})`, // Use AllBG as the background for these pages
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Tab Navigation */}
      <div className="w-full max-w-4xl mx-auto flex justify-center items-center pt-8 z-20">
        <ul className="flex bg-black bg-opacity-50 rounded-lg p-2 gap-4">
          {tabOrder.map((tab) => (
            <li key={tab}>
              <button
                onClick={() => handleTabClick(tab)}
                className={`py-2 px-4 uppercase text-sm font-semibold transition-colors duration-200 ${
                  activeTab === tab ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Content Area */}
      <div className="relative z-10 p-5 w-full max-w-4xl mx-auto flex flex-col justify-center items-center flex-grow">
        <div className="bg-black bg-opacity-70 rounded-xl shadow-xl w-full p-6 sm:p-8 md:p-10 min-h-[400px] flex flex-col justify-center items-center">
          {activeTab === 'deck' && <DeckContent imageSrc={BG2} />} {/* Use BG2 for Deck image */}
          {activeTab === 'brief' && <BriefContent />}
          {activeTab === 'notes' && <NotesContent />}
          {activeTab === 'score' && <ScoreContent onSubmit={handleScoreSubmit} />}
        </div>
      </div>

      {/* Prev/Next Buttons */}
      <div className="absolute bottom-20 right-1/2 translate-x-1/2 sm:right-10 flex gap-4 z-20">
        {currentTabIndex > 0 && (
          <button
            onClick={handlePrev}
            className="bg-white text-black px-4 py-2 rounded-[0.125rem] font-['Inter'] text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            PREV
          </button>
        )}
        {currentTabIndex < tabOrder.length - 1 && activeTab !== 'score' && (
          <button
            onClick={handleNext}
            className="bg-white text-black px-4 py-2 rounded-[0.125rem] font-['Inter'] text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            NEXT
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-5 text-gray-400 text-xs md:text-sm flex items-center z-10">
        REACHLINK by <span className="ml-1">▼</span> VERTX
      </div>
    </div>
  );
};

const CompaniesReachLink = () => {
    const navigate = useNavigate();
    const handleContinue = () => {
    navigate("/preview");
  };
  return (
    <div
      className=" min-h-screen flex flex-col bg-black justify-center items-center text-white text-center absolute inset-0 bg-cover bg-bottom -z-10"
      style={{
          backgroundImage: `url(${MainBG})`, // MainBG as the primary background
        }}
    >

      <div className="relative z-10 p-5">
        <h1 className="text-4xl md:text-5xl font-semibold mb-8 drop-shadow-md">
          Company's ReachLink
        </h1>

        <div
          className="bg-black rounded-xl  shadow-xl max-w-sm md:max-w-md lg:max-w-lg mx-auto"
        >
          <img
            src={MainBG2} // Currently using MainBG2 here as per your provided code
            alt="Vibrant City Night Scene"
            className="w-full rounded-md block mx-auto"
          />
        </div>
        <p className="text-white max-w-md flex justify-center  mx-auto  text-xs  mt-5">
            By continuing, you agree to share details of your associated email, location, and device information. Your details will be kept safe and will not cause any harm to you.
          </p>
<NavLink to="/fundraising/preview">
<button className="bg-white text-black border border-gray-300 py-3 px-8 rounded-md text-lg font-bold mt-6 shadow-md transition-colors duration-300 hover:bg-gray-100">
            Continue
</button>
</NavLink>
          
      </div>
<button
  onClick={() => navigate("/fundraising/preview")}
  className="bg-white text-black border border-gray-300 py-3 px-8 rounded-md text-lg font-bold mt-6 shadow-md transition-colors duration-300 hover:bg-gray-100"
>
  Continue (Test Button)
</button>
      <div
        className="absolute bottom-5 text-gray-400 text-xs md:text-sm flex items-center z-10"
      >
        REACHLINK by <span className="ml-1">▼</span> VERTX
      </div>
    </div>
  );
};

export default CompaniesReachLink;