import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStartupProfile } from "../context/StartupProfileContext";
import Header from "../components/Header";
import ProfileProgressBar from "../components/ProfileProgressBar";

// Add style for slideUp animation
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

  /* Hide scrollbar for Chrome, Safari and Opera */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const InvestorsIndustry = () => {
  const navigate = useNavigate();
  const { startupData, updateStartupField, error, setError, loadingData } = useStartupProfile();
  const [currentIndustry, setCurrentIndustry] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectButtonRef = useRef(null);
  const selectedOptionsRef = useRef(null);

  useEffect(() => {
    setCurrentIndustry(Array.isArray(startupData.industry) ? startupData.industry : []);
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

  const industryOptions = ["AI/ML", "SaaS", "FinTech", "HealthTech", "EdTech", "E-commerce", "Gaming", "DeepTech", "Web3"];

  const handleIndustrySelect = (industry) => {
    let updatedIndustries;
    
    if (currentIndustry.includes(industry)) {
      // Remove the industry if already selected
      updatedIndustries = currentIndustry.filter(item => item !== industry);
    } else {
      // Add the industry if not already selected
      updatedIndustries = [...currentIndustry, industry];
    }
    
    setCurrentIndustry(updatedIndustries);
    updateStartupField('industry', updatedIndustries);
    setError(null);
  };
  
  const removeIndustry = (industry) => {
    const updatedIndustries = currentIndustry.filter(item => item !== industry);
    setCurrentIndustry(updatedIndustries);
    updateStartupField('industry', updatedIndustries);
  };

  const handleContinue = () => {
    if (currentIndustry.length === 0) {
      setError("Please select at least one industry.");
      return;
    }
    setError(null);
    navigate("/profile/pitch");
  };

  const handleBack = () => {
    navigate("/profile/revenue");
  };

  if (loadingData && !startupData.stage) {
    return <div className="w-screen h-screen flex justify-center items-center bg-black text-white">Loading...</div>;
  }

  // Layout constants
  const MAIN_CONTENT_WIDTH = '1280px';
  const CONTENT_BOX_WIDTH = '720px';
  const circlesAreaTopInBox = 39;
  const questionLabelMarginTop = 31;

  // Calculate minimum height for the content box based on selections
  const minContentHeight = currentIndustry.length > 0 ? '422px' : '362px';

  return (
    <div className="min-h-screen text-white bg-[#150718] bg-cover bg-top bg-no-repeat p-4 sm:p-6 md:p-9">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#150718] via-[#1C001E] via-[#14006E] to-[#14006E] opacity-100 z-0"></div>
      <div className="relative z-10">
        <Header />

        {/* Centered Main Content Area */}
        <div className="flex justify-center mt-12">
          <div className="relative" style={{ width: MAIN_CONTENT_WIDTH, height: 'auto' }}>
            {/* Title Block */}
            <div style={{ 
              width: '572px', 
              color: '#FFFFFF', 
              marginBottom: '20px', 
              marginLeft: 'auto', 
              marginRight: 'auto' 
            }}>
              <h2 className="font-inter font-semibold" style={{ 
                fontSize: '20px', 
                lineHeight: '24px', 
                marginBottom: '12px' 
              }}>
                Tell us about your startup
              </h2>
              <p className="font-inter font-normal" style={{ 
                fontSize: '14px', 
                lineHeight: '17px' 
              }}>
                We'll use this information to match you with the right investors for your specific needs.
              </p>
            </div>
            <div
              className="relative w-full max-w-2xl mx-auto"
              style={{
                position: 'relative',
                background: 'linear-gradient(224.28deg, #592582 18.6%, #6965ED 81.4%)',
                borderRadius: '12px',
                padding: '2px', // Space for the border
                minHeight: minContentHeight, // Dynamic height based on selections
              }}
            >
              <div 
                className="w-full h-full flex flex-col" 
                style={{
                  background: 'black',
                  borderRadius: '10px', // Slightly smaller to show the gradient border
                  height: 'calc(100% - 4px)',
                  padding: '2rem',
                  minHeight: `calc(${minContentHeight} - 4px)`, // Adjust for border
                }}
              >
                {/* Progress Steps */}
                <div style={{ paddingTop: `${circlesAreaTopInBox -27}px`, boxSizing: 'border-box', width: '100%' }}>
                  <ProfileProgressBar currentStep={4} />
                </div>
                
                {/* Form Elements Area */}
                <div style={{ color: '#FFFFFF', marginTop: `${questionLabelMarginTop}px` }}>
                  <label htmlFor="industry-multiselect" className="block font-inter font-semibold text-sm mb-2">
                    Which industry do you operate in?
                  </label>
                  <p className="font-inter font-normal text-xs text-gray-400 mb-4">
                    Most investors specialize in specific industries. You can choose multiple.
                  </p>
                  
                  {/* Dropdown Select Container */}
                  <div style={{ width: '20rem', position: 'relative' }}>
                    <div 
                      ref={selectButtonRef}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                      className="cursor-pointer" 
                      style={{ 
                        width: '20rem', 
                        height: '2.439rem', 
                        background: '#0F0E16', 
                        border: '1px solid rgba(184, 184, 184, 0.13)', 
                        borderRadius: '0.1875rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '0 0.9375rem', 
                        boxSizing: 'border-box',
                        zIndex: 5
                      }}
                    >
                      <span style={{ 
                        fontFamily: 'Inter, sans-serif', 
                        fontStyle: 'normal', 
                        fontWeight: 400, 
                        fontSize: '0.75rem', 
                        lineHeight: '0.9375rem', 
                        color: currentIndustry.length > 0 ? '#FFFFFF' : '#656565', 
                        width: 'auto', 
                        height: '0.9375rem' 
                      }}>
                        {currentIndustry.length > 0 ? `${currentIndustry.length} selected` : 'Select'}
                      </span>
                      <svg 
                        width="1.125rem" 
                        height="1.125rem" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg" 
                        style={{ 
                          transform: isDropdownOpen ? 'rotate(180deg)' : 'none', 
                          transition: 'transform 0.2s' 
                        }}
                      >
                        <path d="M7 10L12 15L17 10H7Z" fill="#656565"/>
                      </svg>
                    </div>

                    {/* Selected items display */}
                    {currentIndustry.length > 0 && (
                      <div 
                        ref={selectedOptionsRef}
                        className="hide-scrollbar"
                        style={{
                          width: '20rem', // Match the width of the dropdown
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                          paddingTop: '0.75rem',
                          position: 'relative',
                          zIndex: 1, // Lower z-index so dropdown can overlay
                        }}
                      >
                        {currentIndustry.map((industry) => (
                          <div 
                            key={industry}
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              height: '2rem', 
                              minWidth: '4.6875rem', 
                              paddingLeft: '0.625rem', 
                              paddingRight: '0.625rem', 
                              background: 'linear-gradient(260.47deg, rgba(0, 0, 0, 0.25) -22.9%, rgba(252, 65, 65, 0.25) 119.49%), linear-gradient(99.45deg, #000000 -4%, #33005C 104%)', 
                              borderRadius: '0.25rem', 
                              boxSizing: 'border-box',
                              marginBottom: '0.25rem'
                            }}
                          >
                            <span style={{ 
                              fontFamily: 'Inter, sans-serif', 
                              fontStyle: 'normal', 
                              fontWeight: 500, 
                              fontSize: '0.75rem', 
                              lineHeight: '0.9375rem', 
                              color: '#FFFFFF', 
                              marginRight: '0.5rem' 
                            }}>
                              {industry}
                            </span>
                            <svg 
                              width="0.75rem" 
                              height="0.75rem" 
                              viewBox="0 0 12 12" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeIndustry(industry);
                              }}
                              className="cursor-pointer"
                            >
                              <path d="M9 3L3 9M3 3L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Dropdown menu - Positioned absolutely and will overlay the selected items */}
                    {isDropdownOpen && (
                      <div 
                        ref={dropdownRef}
                        className="hide-scrollbar"
                        style={{ 
                          position: 'absolute', 
                          top: '2.5rem', // Position right below the select button
                          left: '0',
                          width: '20rem', 
                          background: '#0F0E16', 
                          border: '1px solid rgba(184, 184, 184, 0.13)', 
                          borderRadius: '0.1875rem', 
                          zIndex: 20, // Higher z-index to overlay selected options
                          marginTop: '0.3125rem',
                          maxHeight: '12.5rem', 
                          overflowY: 'auto',
                          animation: 'slideUp 0.2s ease-in-out'
                        }}
                      >
                        {industryOptions.map((industry) => ( 
                          <div 
                            key={industry} 
                            onClick={() => handleIndustrySelect(industry)} 
                            className="cursor-pointer hover:bg-[#6C2BD9]" 
                            style={{ 
                              padding: '0.625rem 0.9375rem', 
                              fontFamily: 'Inter, sans-serif', 
                              fontStyle: 'normal', 
                              fontWeight: 400, 
                              fontSize: '0.75rem', 
                              lineHeight: '0.9375rem', 
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            {industry}
                            {currentIndustry.includes(industry) && (
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="0.875rem" 
                                height="0.875rem" 
                                viewBox="0 0 14 14" 
                                fill="none"
                                style={{ marginLeft: '0.5rem' }}
                              >
                                <path d="M5.57109 10.5L2.24609 7.175L3.07734 6.34375L5.57109 8.8375L10.9232 3.48541L11.7544 4.31666L5.57109 10.5Z" fill="#AD6FDE"/>
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {error && <p className="text-red-500 text-sm mt-2 mb-2">{error}</p>}
                  </div>
                </div>

                {/* Buttons Container - Moved to bottom with margin-top auto */}
                <div className="mt-auto pt-6 flex justify-between items-center w-full pb-6">
                  <button 
                    className="font-inter font-normal text-[14px] text-white" 
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button 
                    className="w-[100px] h-[36px] font-inter text-[14px] font-medium bg-white text-black rounded-[4px]" 
                    onClick={handleContinue}
                  >
                    Continue
                  </button>
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