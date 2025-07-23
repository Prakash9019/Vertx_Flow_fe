import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import ContactsIcon from "../assets/ContactsIcon.svg";
import AddIcon from "../assets/AddIcon.svg";
import SpeedometerIcon from "../assets/SpeedometerIcon.svg";
import TuneIcon from "../assets/TuneIcon.svg";
import BG from "../assets/image.jpg";

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
            onClick={() => navigate("/playground")}
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

const CreateREportPage = () => {
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
        <button className="mt-8 px-6 py-3 bg-white text-black rounded-md font-semibold hover:bg-gray-200 transition-colors">
          Create now
        </button>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default CreateREportPage;