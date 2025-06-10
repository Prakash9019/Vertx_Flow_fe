import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStartupProfile } from "../context/StartupProfileContext";
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

  .selected-items-container {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }

  .selected-items-container::-webkit-scrollbar {
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

const InvestorsIndustry = () => {
  const navigate = useNavigate();
  const { startupData, updateStartupField, error, setError, loadingData } = useStartupProfile();
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const selectButtonRef = useRef(null);

  const industryOptions = ["AI/ML", "SaaS", "FinTech", "HealthTech", "EdTech", "E-commerce", "Gaming", "DeepTech", "Web3"];
  
  useEffect(() => {
    setSelectedIndustries(Array.isArray(startupData.industry) ? startupData.industry : []);
  }, [startupData.industry]);

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

  const handleIndustrySelect = (industry) => {
    let updatedIndustries;
    
    if (selectedIndustries.includes(industry)) {
      // Remove the industry if already selected
      updatedIndustries = selectedIndustries.filter(item => item !== industry);
    } else {
      // Add the industry if not already selected
      updatedIndustries = [...selectedIndustries, industry];
    }
    
    setSelectedIndustries(updatedIndustries);
    updateStartupField('industry', updatedIndustries);
    setError(null);
  };
  
  const removeIndustry = (industry) => {
    const updatedIndustries = selectedIndustries.filter(item => item !== industry);
    setSelectedIndustries(updatedIndustries);
    updateStartupField('industry', updatedIndustries);
  };
  
  const handleContinue = async () => {
    if (selectedIndustries.length === 0) {
      setError("Please select at least one industry.");
      return;
    }
    setError(null);
    setIsLoading(true);
    
    // Simulate loading time before navigation
    setTimeout(() => {
      navigate("/profile/pitch");
    }, 800);
  };

  const handleBack = () => {
    navigate("/profile/revenue");
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
                <div className={`bg-black rounded-[0.625rem] p-6 lg:p-8 lg:pt-10 flex flex-col ${
                  selectedIndustries.length > 0 ? 'min-h-fit' : 'min-h-[20rem] lg:min-h-[22.625rem]'
                }`}>
                  {/* Progress Bar */}
                  <div className="w-full mb-6">
                    <ProfileProgressBar currentStep={4} />
                  </div>

                  {/* Form Content */}
                  <div className="text-white flex-1 flex flex-col">
                    <label className="block font-inter font-semibold text-sm leading-[1.0625rem] mb-2">
                      Which industry do you operate in?
                    </label>
                    <p className="font-inter font-normal text-xs leading-[0.9375rem] mb-8">
                      Most investors specialize in specific industries. You can choose multiple.
                    </p>
                    
                    {/* Selection Area */}
                    <div className={`w-full max-w-[20rem] relative ${selectedIndustries.length > 0 ? 'mb-6' : 'mb-auto'}`}>
                      <div 
                        ref={selectButtonRef}
                        onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)} 
                        className={`cursor-pointer w-full max-w-[20rem] h-[2.439rem] ${
                          isLoading ? 'bg-[#1a1a1a] cursor-not-allowed' : 'bg-[#0F0E16] cursor-pointer'
                        } border border-white/13 rounded-sm flex items-center justify-between px-4 box-border z-[5]`}
                      >
                        <span className={`font-inter font-normal text-xs leading-[0.9375rem] ${
                          selectedIndustries.length > 0 
                            ? (isLoading ? 'text-gray-500' : 'text-white') 
                            : 'text-[#656565]'
                        } w-auto h-[0.9375rem]`}>
                          {selectedIndustries.length > 0 ? `${selectedIndustries.length} selected` : 'Select'}
                        </span>
                        <svg 
                          className={`w-[1.125rem] h-[1.125rem] transition-transform duration-200 ${
                            isDropdownOpen ? 'rotate-180' : ''
                          }`}
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7 10L12 15L17 10H7Z" fill="#656565"/>
                        </svg>
                      </div>

                      {isDropdownOpen && !isLoading && (
                        <div 
                          ref={dropdownRef}
                          className="dropdown-container slide-up absolute top-full left-0 w-full max-w-[20rem] bg-[#0F0E16] border border-white/13 rounded-sm z-[20] mt-1.5 max-h-[12.5rem] overflow-y-auto"
                        >
                          {industryOptions.map((industry) => ( 
                            <div 
                              key={industry} 
                              onClick={() => handleIndustrySelect(industry)} 
                              className="cursor-pointer hover:bg-[#6C2BD9] px-4 py-2.5 font-inter font-normal text-xs leading-[0.9375rem] text-white flex items-center"
                            >
                              {industry}
                              {selectedIndustries.includes(industry) && (
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  width="0.875rem" 
                                  height="0.875rem" 
                                  viewBox="0 0 14 14" 
                                  fill="none"
                                  className="ml-2"
                                >
                                  <path d="M5.57109 10.5L2.24609 7.175L3.07734 6.34375L5.57109 8.8375L10.9232 3.48541L11.7544 4.31666L5.57109 10.5Z" fill="#AD6FDE"/>
                                </svg>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Selected items container with hidden scrollbar - positioned below dropdown */}
                      {selectedIndustries.length > 0 && (
                        <div className="absolute top-14 left-0 right-0">
                          <div className="font-inter font-normal text-xs leading-[0.9375rem] text-white mb-2">
                            Selected industries:
                          </div>
                          <div 
                            className="selected-items-container flex flex-nowrap gap-2 overflow-x-auto whitespace-nowrap pb-1 z-[10]"
                            style={{
                              width: 'calc(100vw - 8rem)', // Account for page padding
                              maxWidth: 'calc(45rem - 4rem)' // Account for card padding
                            }}
                          >
                            {selectedIndustries.map((industry) => (
                              <div 
                                key={industry}
                                className="inline-flex items-center h-8 min-w-[4.6875rem] px-2.5 rounded-sm flex-shrink-0 overflow-hidden"
                                style={{
                                  background: 'linear-gradient(260.47deg, rgba(0, 0, 0, 0.25) -22.9%, rgba(252, 65, 65, 0.25) 119.49%), linear-gradient(99.45deg, #000000 -4%, #33005C 104%)'
                                }}
                              >
                                <span className="font-inter font-medium text-xs leading-[0.9375rem] text-white mr-2 text-ellipsis overflow-hidden whitespace-nowrap max-w-[calc(100%-1.25rem)]">
                                  {industry}
                                </span>
                                <img 
                                  src={CloseIcon} 
                                  alt="Remove selection" 
                                  onClick={() => !isLoading && removeIndustry(industry)} 
                                  className={`w-3 h-3 flex-shrink-0 ${
                                    isLoading 
                                      ? 'cursor-not-allowed opacity-60' 
                                      : 'cursor-pointer'
                                  }`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {error && (
                        <p className="text-red-500 text-sm mt-2 w-full max-w-[20rem]">
                          {error}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Fixed position buttons container */}
                  <div className={`flex justify-between items-center text-white ${
                    selectedIndustries.length > 0 ? 'pt-8 mt-6' : 'pt-8 mt-auto'
                  }`}>
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

export default InvestorsIndustry;