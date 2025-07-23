import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import ContactsIcon from "../assets/ContactsIcon.svg";
import AddIcon from "../assets/AddIcon.svg";
import SpeedometerIcon from "../assets/SpeedometerIcon.svg";
import TuneIcon from "../assets/TuneIcon.svg";
import BG from "../assets/image.jpg";
import tBG from "../assets/Text1.jpg";
import tBG2 from "../assets/Text3.jpg";


const BottomNavigation = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    <div
      className="fixed bottom-2 left-0 w-full flex items-center justify-center h-[4.375rem] z-50 px-2 sm:px-4 md:px-8 lg:px-16"
    >
      <div
        className="flex items-center justify-between w-full md:max-w-xs max-w-60 h-[3.125rem] rounded-lg bg-white/94 px-2 gap-1 // Adjusted base px and gap
                   sm:px-4 sm:gap-4"
      >
        <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
          <button
            className="flex items-center justify-center hover:opacity-80 transition-opacity w-8 h-8 rounded-md bg-black flex-shrink-0
                       sm:w-[2.375rem] sm:h-[2.375rem]"
          >
            <img
              src={logo}
              alt="logo"
              className="w-[1rem] h-[1rem] sm:w-[1.2rem] sm:h-[1.2rem]"
            />
          </button>

          <div
            className="w-[0.0625rem] h-[3.125rem] bg-gray-400/40 flex-shrink-0"
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-4 flex-grow justify-center min-w-0">
          <button
            onClick={() => navigate("/playground/mockpitching/report")}
            className="flex items-center justify-center hover:opacity-80 transition-opacity w-9 h-8 rounded-md bg-[#AD6FDE] flex-shrink-0
                       sm:w-10 sm:h-9"
          >
            <img
              src={ContactsIcon}
              alt="Contacts"
              className="w-[1rem] h-[1rem] sm:w-[1.2rem] sm:h-[1.2rem]"
            />
          </button>

          <button
            onClick={() => navigate("/playground/mockpitching/create")}
            className="flex items-center justify-center hover:opacity-80 transition-opacity text-gray-600 w-5 h-5 flex-shrink-0
                       sm:w-6 sm:h-6"
          >
            <img
              src={AddIcon}
              alt="Add"
              className="w-5 h-5 invert sm:w-6 sm:h-6"
            />
          </button>

          <button className="flex items-center justify-center hover:opacity-80 transition-opacity text-gray-600 w-5 h-5 flex-shrink-0
                           sm:w-6 sm:h-6">
            <img
              src={SpeedometerIcon}
              alt="Speedometer"
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </button>

          <button className="flex items-center justify-center hover:opacity-80 transition-opacity text-gray-600 w-5 h-5 flex-shrink-0
                           sm:w-6 sm:h-6">
            <img
              src={TuneIcon}
              alt="Tune"
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </button>
        </div>
        <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
          <div
            className="w-[0.0625rem] h-[3.125rem] bg-gray-400/40 flex-shrink-0"
          />

          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center hover:opacity-80 transition-opacity text-xs font-medium w-9 h-6 rounded-[0.1875rem] bg-[#33005C] text-[#AD6FDE] flex-shrink-0
                       sm:w-10 sm:h-7"
          >
            EXIT
          </button>
        </div>
      </div>
    </div>
  );
};

export const PersonaSelectionPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleOwnPersonaClick = () => {
    console.log("Own Persona clicked!");
    // Example: navigate('/playground/mockpitching/own-persona-details');
  };

  const handlePracticeClick = () => {
    console.log("Practice clicked!");
    // Example: navigate('/playground/mockpitching/practice-session');
  };

  const handleNext = () => {
    // Logic for "Next" button click, e.g., proceed based on selected card if any, or just move forward
    console.log("Next button clicked!");
    // Example: navigate('/playground/mockpitching/next-step-after-selection');
  };
  

  return (
    <div
      className='font-[inter] bg-black min-h-screen flex flex-col items-center justify-center text-white p-4'
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="text-center mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Create Persona</h1>
        <p className="text-sm text-gray-300 max-w-md mx-auto">
          A target list is a curated set of investors for your fundraise.
          You can edit and share it anytime, unless it was created by Vertx.
        </p>
      </div>

      <div  className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-screen-md px-4"> {/* Added w-full and max-w-screen-md for better responsiveness */}
        {/* Own Persona Card */}
        <button
          onClick={handleOwnPersonaClick}
          className="relative w-full sm:w-1/2 md:h-88 h-48 rounded-lg overflow-hidden shadow-lg flex items-center justify-center text-white text-lg font-semibold transition-transform duration-300 hover:scale-105"
        >
          <div style={{
            backgroundImage: `url(${tBG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            Own Persona
          </div>
        </button>

        {/* Practice Card */}
        <button
          onClick={handlePracticeClick}
          className="relative w-full sm:w-1/2 md:h-88 h-48 rounded-lg overflow-hidden shadow-lg flex items-center justify-center text-white text-lg font-semibold transition-transform duration-300 hover:scale-105"
        >
          <div
           style={{
            backgroundImage: `url(${tBG2})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
           <h2> Practice</h2>
          </div>
        </button>
      </div>

      <div className="flex justify-center gap-4 mt-2">
        <button
          onClick={handleBack}
          className="px-5 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-5 py-2 bg-white text-black rounded-md font-semibold hover:bg-gray-200 transition-colors"
        >
          Next
        </button>
      </div>

      <BottomNavigation onBack={handleBack} />
    </div>
  );
};

export const CreatePersonaPage = ({ onBack }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    // Navigate to the PersonaSelectionPage
    navigate("/playground/mockpitching/persona-selection");
  };

  return (
    <div
      className='font-[inter] bg-black min-h-screen flex flex-col items-center justify-center text-white p-4'
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="text-center mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Create Persona</h1>
        <p className="text-sm text-gray-300 max-w-md mx-auto">
          A target list is a curated set of investors for your fundraise.
          You can edit and share it anytime, unless it was created by Vertx.
        </p>
      </div>

      <div className="bg-[#0F0E16]/50 rounded-lg p-6 w-full max-w-md md:max-w-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <label htmlFor="round-select" className="text-base sm:text-lg font-semibold">
            Are you raising a bridge or an extension round?
          </label>
          <span className="text-gray-400 text-sm cursor-pointer" title="More info">
            ⓘ
          </span>
        </div>
        <select
          id="round-select"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="w-full p-3 rounded-md bg-[#222] text-white border border-gray-600 focus:outline-none focus:border-[#AD6FDE]"
        >
          <option value="">Select option...</option>
          <option value="bridge">Bridge Round</option>
          <option value="extension">Extension Round</option>
          <option value="other">Other</option>
        </select>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-5 py-2 bg-white text-black rounded-md font-semibold hover:bg-gray-200 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
      <BottomNavigation onBack={onBack} />
    </div>
  );
};

const CreateREportPage = () => {
    const navigate = useNavigate();
    const handleCreateNowClick = () => {
    navigate("/playground/mockpitching/create-persona"); // Navigate to the new page
  };
  return (
    <div
      className='font-[inter] min-h-screen flex flex-col items-center justify-center text-white'
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="text-center p-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Create. Simulate. Pitch.</h1>
        <p className="text-sm sm:text-base text-gray-300 max-w-md mx-auto">
          Create your dream VC persona, add custom traits, and practice to upgrade your pitch.
        </p>
        <button 
        onClick={handleCreateNowClick}
        className="mt-8 px-6 py-3 bg-white text-black rounded-md font-semibold hover:bg-gray-200 transition-colors">
          Create now
        </button>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default CreateREportPage;