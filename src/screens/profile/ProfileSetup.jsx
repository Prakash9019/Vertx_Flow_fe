import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStartupProfile } from "../../context/StartupProfileContext";
import Header from "../../components/Header";
import CloseIcon from "../../assets/close_icon.svg";
import ProfileProgressBar from "../../components/ProfileProgressBar";

const styles = `
  @keyframes slideUp {
    from {
      transform: translateY(0.625rem);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .dropdown-container {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }

  .dropdown-container::-webkit-scrollbar {
    display: none; /* WebKit */
  }

  .slide-up {
    animation: slideUp 0.2s ease-in-out;
  }

  .loading-spinner {
    animation: spin 1s linear infinite;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { startupData, updateStartupField, error, setError, loadingData } = useStartupProfile();
  const [currentStage, setCurrentStage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const selectButtonRef = useRef(null);

  const stages = ["Pre-seed", "Seed", "Series A", "Series B", "Series B+", "Pre-IPO", "Not Specified"];
  
  useEffect(() => { setCurrentStage(startupData.stage || ""); }, [startupData.stage]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        selectButtonRef.current &&
        !selectButtonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStageSelect = (stage) => { 
    setCurrentStage(stage); 
    updateStartupField('stage', stage); 
    setError(null); 
    setIsDropdownOpen(false); 
  };
  
  const clearStage = () => { 
    setCurrentStage(""); 
    updateStartupField('stage', ""); 
    setError(null); 
  };
  
  const handleContinue = async () => { 
    if (!currentStage) { 
      setError("Please select your startup stage."); 
      return; 
    } 
    setError(null); 
    setIsLoading(true);
    
    // Simulate loading time before navigation
    setTimeout(() => {
      navigate('/profile/location');
    }, 800);
  };
  
  const handleBack = () => navigate("/profile");

  if (loadingData && !startupData.pitch && (!startupData || Object.keys(startupData).length === 0)) {
    return <div className="w-screen h-screen flex justify-center items-center bg-black text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-white bg-[#150718] bg-cover bg-top bg-no-repeat p-1 xs:p-2 sm:p-6 md:p-9">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950 opacity-65 z-0"></div>
      <div className="relative z-10">
        <Header />

        <div className="flex justify-center mt-3 xs:mt-6 sm:mt-12">
          <div className="relative w-full max-w-[80rem] px-1 xs:px-2 sm:px-4 lg:px-0">
            {/* Header text container */}
            <div className="text-white mb-2 xs:mb-3 sm:mb-5 w-full max-w-2xl lg:max-w-[45rem] mx-auto">
              <h2 className="font-inter font-semibold text-sm xs:text-base sm:text-lg lg:text-xl leading-4 xs:leading-5 sm:leading-6 mb-1.5 xs:mb-2 sm:mb-3">
                Tell us about your startup
              </h2>
              <p className="font-inter font-normal text-[10px] xs:text-xs sm:text-sm leading-[0.875rem] xs:leading-[1rem] sm:leading-[1.0625rem]">
                We'll use this information to match you with the right investors for your specific needs.
              </p>
            </div>

            {/* Main card container */}
            <div className="relative w-full max-w-2xl lg:max-w-[45rem] mt-3 xs:mt-4 sm:mt-8 mx-auto">
              {/* Keep gradient border */}
              <div className="p-0.5 rounded-[0.625rem] bg-[linear-gradient(224.28deg,#592582_18.6%,#6965ED_81.4%)]">
                <div className="bg-black rounded-[0.625rem] p-3 xs:p-4 sm:p-6 lg:p-8 lg:pt-10 min-h-[16rem] xs:min-h-[18rem] sm:min-h-[20rem] lg:min-h-[22.625rem] flex flex-col">                  
                  <div className="w-full mb-3 xs:mb-4 sm:mb-6">
                    <ProfileProgressBar currentStep={0} />
                  </div>
                  <div className="text-white flex-1 flex flex-col">
                    <label className="block font-inter font-semibold text-[10px] xs:text-xs sm:text-sm leading-[0.875rem] xs:leading-[0.9375rem] mb-1.5 xs:mb-2">
                      What stage is your startup at?
                    </label>
                    <p className="font-inter font-normal text-[10px] xs:text-xs leading-[0.875rem] xs:leading-[0.9375rem] mb-4 xs:mb-6 sm:mb-8">
                      This helps us to match you with the investors who focus on your stage.
                    </p>
                    <div className="w-full sm:max-w-[20rem] relative mb-auto">
                      {currentStage ? (
                        <>
                          <div className="font-inter font-normal text-xs leading-[0.9375rem] text-white mb-2">
                            Currently selected:
                          </div>
                          {/* Changed background from inline to tailwind */}
                          <div className="inline-flex items-center h-8 min-w-[4.6875rem] px-2.5 rounded-sm bg-[linear-gradient(260.47deg,rgba(0,0,0,0.25)_-22.9%,rgba(252,65,65,0.25)_119.49%),linear-gradient(99.45deg,#000000_-4%,#33005C_104%)]">
                            <span className="font-inter font-medium text-xs leading-[0.9375rem] text-white mr-2">
                              {currentStage}
                            </span>
                            <img src={CloseIcon} alt="Clear selection" onClick={clearStage} 
                              className="cursor-pointer w-3 h-3" />
                          </div>
                        </>
                      ) : (
                        // Update select button for mobile
                        <div ref={selectButtonRef}
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="cursor-pointer w-full sm:max-w-[20rem] h-[2.439rem] bg-[#0F0E16] border border-white/13 rounded-sm flex items-center justify-between px-3 sm:px-4">
                          <span className="font-inter font-normal text-xs leading-[0.9375rem] text-[#656565]">
                            Select
                          </span>
                          <svg className={`w-4 sm:w-[1.125rem] h-4 sm:h-[1.125rem] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 10L12 15L17 10H7Z" fill="#656565"/>
                          </svg>
                        </div>
                      )}

                      {/* Update dropdown menu for mobile */}
                      {isDropdownOpen && (
                        <div ref={dropdownRef}
                          className="dropdown-container slide-up absolute top-full left-0 w-full sm:max-w-[20rem] bg-[#0F0E16] border border-white/13 rounded-sm z-[9999] mt-1.5 max-h-[12.5rem] overflow-y-auto">
                          {stages.map((stageOption) => (
                            <div key={stageOption}
                              onClick={() => handleStageSelect(stageOption)}
                              className="cursor-pointer hover:bg-[#6C2BD9] px-3 sm:px-4 py-2.5 font-inter font-normal text-xs leading-[0.9375rem] text-white">
                              {stageOption === "" ? "Not Specified" : stageOption}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Error message */}
                    {error && (
                      <p className="text-red-500 text-xs sm:text-sm mt-2 w-full sm:max-w-[20rem]">
                        {error}
                      </p>
                    )}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between items-center text-white pt-4 xs:pt-6 sm:pt-8 mt-auto">
                    <button className={`font-inter font-normal text-[10px] xs:text-xs sm:text-sm leading-[0.875rem] xs:leading-[1rem] sm:leading-[1.0625rem] ${
                      isLoading ? 'text-gray-500 cursor-not-allowed opacity-60' : 'text-white cursor-pointer'
                    }`}
                      onClick={handleBack}
                      disabled={isLoading}>
                      Back
                    </button>
                    <button className={`font-inter font-medium inline-flex justify-center items-center rounded text-[10px] xs:text-xs sm:text-sm w-16 xs:w-20 sm:w-[6.4375rem] h-7 xs:h-8 sm:h-[2.1875rem] px-3 xs:px-4 sm:px-5 py-1 xs:py-1.5 sm:py-2 ${
                        isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-white cursor-pointer'
                      } text-black`}
                      onClick={handleContinue}
                      disabled={isLoading}>
                      {isLoading ? (
                        <div className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 border-2 border-gray-600 border-t-black rounded-full loading-spinner" />
                      ) : (
                        'Continue'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;