import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStartupProfile } from "../context/StartupProfileContext";
import { usePermissions } from "../hooks/usePermissions";
import Header from "../components/Header";
import CloseIcon from "../assets/close_icon.svg";
import ProfileProgressBar from "../components/ProfileProgressBar";

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

// Add the styles to the document head if they don't already exist
if (!document.getElementById("raise-funds-styles")) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "raise-funds-styles";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

const RaiseFunds = () => {
  const navigate = useNavigate();
  const { startupData, updateStartupField, error, setError, loadingData } = useStartupProfile();
  const { hasFullAccess, canEdit, userRole } = usePermissions();
  const [currentRaise, setCurrentRaise] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const selectButtonRef = useRef(null);

  const fundraisingOptions = [
    "$25K>",
    "$25K-$100K",
    "$100K-$200K",
    "$200K-$500K",
    "$500K-$1M",
    "$1M+",
  ];
  
  useEffect(() => {
    setCurrentRaise(startupData.raise || "");
  }, [startupData.raise]);

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
  const handleRaiseSelect = (option) => {
    if (!canEdit) {
      alert('You don\'t have access from founder.');
      return;
    }
    setCurrentRaise(option);
    updateStartupField('raise', option);
    setError(null);
    setIsDropdownOpen(false);
  };

  const clearRaise = () => {
    setCurrentRaise("");
    updateStartupField('raise', "");
    setError(null);
  };

  const handleContinue = async () => {
    if (!currentRaise) {
      setError("Please select how much you are looking to raise.");
      return;
    }
    setError(null);
    setIsLoading(true);
    
    // Simulate loading time before navigation
    setTimeout(() => {
      navigate("/profile/revenue");
    }, 800);
  };

  const handleBack = () => {
    navigate("/profile/location");
  };

  if (loadingData && !startupData.stage) {
     return <div className="w-screen h-screen flex justify-center items-center bg-black text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-white bg-[#150718] bg-cover bg-top bg-no-repeat p-4 sm:p-6 md:p-9">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950 opacity-65 z-0"></div>
      <div className="relative z-10">
        <Header />

        <div className="flex justify-center mt-12">
          <div className="relative w-full max-w-[80rem] px-4 lg:px-0">
            {/* Header Text - Now aligned with the container below */}
            <div className="text-white mb-5 w-full max-w-2xl lg:max-w-[45rem] mx-auto">
              <h2 className="font-inter font-semibold text-lg lg:text-xl leading-6 mb-3">
                Tell us about your startup
              </h2>
              <p className="font-inter font-normal text-sm leading-[1.0625rem]">
                We'll use this information to match you with the right investors for your specific needs.
              </p>
            </div>

            {/* Main Card Container */}
            <div className="relative w-full max-w-2xl lg:max-w-[45rem] mt-8 sm:mt-12 mx-auto">
              {/* Gradient Border */}
              <div 
                className="p-0.5 rounded-[0.625rem]"
                style={{
                  background: 'linear-gradient(224.28deg, #592582 18.6%, #6965ED 81.4%)'
                }}
              >
                {/* Inner Content */}
                <div className="bg-black rounded-[0.625rem] p-6 lg:p-8 lg:pt-10 min-h-[20rem] lg:min-h-[22.625rem] flex flex-col">
                  {/* Progress Bar */}
                  <div className="w-full mb-6">
                    <ProfileProgressBar currentStep={2} />
                  </div>

                  {/* Form Content */}
                  <div className="text-white flex-1 flex flex-col">
                    <label className="block font-inter font-semibold text-sm leading-[1.0625rem] mb-2">
                      How much are you looking to raise?
                    </label>
                    <p className="font-inter font-normal text-xs leading-[0.9375rem] mb-8">
                      This helps us match you with investors who can provide the right amount of capital.
                    </p>
                    
                    {/* Selection Area */}
                    <div className="w-full max-w-[20rem] relative mb-auto">
                      {currentRaise ? (
                        <>
                          <div className="font-inter font-normal text-xs leading-[0.9375rem] text-white mb-2">
                            Currently selected:
                          </div>
                          <div 
                            className="inline-flex items-center h-8 min-w-[4.6875rem] px-2.5 rounded-sm"
                            style={{
                              background: 'linear-gradient(260.47deg, rgba(0, 0, 0, 0.25) -22.9%, rgba(252, 65, 65, 0.25) 119.49%), linear-gradient(99.45deg, #000000 -4%, #33005C 104%)'
                            }}
                          >
                            <span className="font-inter font-medium text-xs leading-[0.9375rem] text-white mr-2">
                              {currentRaise}
                            </span>
                            <img 
                              src={CloseIcon} 
                              alt="Clear selection" 
                              onClick={clearRaise} 
                              className="cursor-pointer w-3 h-3"
                            />
                          </div>
                        </>
                      ) : (
                        <>                      
                          <div 
                            ref={selectButtonRef}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                            className="cursor-pointer w-full max-w-[20rem] h-[2.439rem] bg-[#0F0E16] border border-white/13 rounded-sm flex items-center justify-between px-4 box-border"
                          >
                            <span className="font-inter font-normal text-xs leading-[0.9375rem] text-[#656565]">
                              Select
                            </span>
                            <svg 
                              className={`w-[1.125rem] h-[1.125rem] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                              viewBox="0 0 24 24" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M7 10L12 15L17 10H7Z" fill="#656565"/>
                            </svg>
                          </div>

                          {isDropdownOpen && (
                            <div 
                              ref={dropdownRef}
                              className="dropdown-container slide-up absolute top-full left-0 w-full max-w-[20rem] bg-[#0F0E16] border border-white/13 rounded-sm z-[9999] mt-1.5 max-h-[12.5rem] overflow-y-auto"
                            >
                              {fundraisingOptions.map((option) => ( 
                                <div 
                                  key={option} 
                                  onClick={() => handleRaiseSelect(option)} 
                                  className="cursor-pointer hover:bg-[#6C2BD9] px-4 py-2.5 font-inter font-normal text-xs leading-[0.9375rem] text-white"
                                >
                                  {option}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                      {error && (
                        <p className="text-red-500 text-sm mt-2 w-full max-w-[20rem]">
                          {error}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Fixed position buttons container */}
                  <div className="flex justify-between items-center text-white pt-8 mt-auto">
                    <button 
                      className={`font-inter font-normal text-sm leading-[1.0625rem] ${
                        isLoading 
                          ? 'text-gray-500 cursor-not-allowed opacity-60' 
                          : 'text-white cursor-pointer'
                      }`}
                      onClick={handleBack} 
                      disabled={isLoading}
                    >
                      Back
                    </button>
                    <button 
                      className={`font-inter font-medium inline-flex justify-center items-center rounded text-sm font-medium w-[6.4375rem] h-[2.1875rem] px-5 py-2 ${
                        isLoading 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-white cursor-pointer'
                      } text-black`}
                      onClick={handleContinue} 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-black rounded-full loading-spinner" />
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

export default RaiseFunds;