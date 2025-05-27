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

  .dropdown-container {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }

  .dropdown-container::-webkit-scrollbar {
    display: none; /* WebKit */
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
  
  // Keep constant container height
  const containerHeight = 22.625;
  
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
      <div className="absolute inset-0  bg-gradient-to-b from-black to-purple-950 opacity-65 z-0"></div>
      <div className="relative z-10">
        <Header />

        <div className="flex justify-center mt-12">
          <div className="relative" style={{ width: '80rem', height: 'auto' }}>
            <div style={{ width: '35.75rem', color: '#FFFFFF', marginBottom: '1.25rem', marginLeft: '19rem', marginRight: 'auto' }}>
              <h2 className="font-inter font-semibold" style={{ fontSize: '1.25rem', lineHeight: '1.5rem', marginBottom: '0.75rem', width: '17.4375rem', height: '1.4375rem' }}>
                Tell us about your startup
              </h2>
              <p className="font-inter font-normal" style={{ fontSize: '0.875rem', lineHeight: '1.0625rem', width: '35.75rem', height: '1.125rem' }}>
                We'll use this information to match you with the right investors for your specific needs.
              </p>
            </div>

            <div
              className="relative w-full max-w-2xl mt-8 sm:mt-12 mx-auto"
              style={{
                position: 'relative',
                background: 'linear-gradient(224.28deg, #592582 18.6%, #6965ED 81.4%)',
                borderRadius: '0.625rem',
                padding: '0.125rem',
                width: '45rem',
                height: `${containerHeight}rem`
              }}
            >
              <div 
                className="w-full h-full flex flex-col" 
                style={{
                  background: 'black',
                  borderRadius: '0.625rem',
                  height: '100%',
                  padding: '2rem',
                  paddingTop: '2.5rem',
                  position: 'relative'
                }}
              >
                <div style={{ boxSizing: 'border-box', width: '100%' }}>
                  <ProfileProgressBar currentStep={4} />
                </div>
                
                <div className="flex flex-col" style={{ color: '#FFFFFF', flex: '1' }}>
                  <label className="block font-inter font-semibold" style={{ fontSize: '0.875rem', lineHeight: '1.0625rem', marginBottom: '0.5rem' }}>
                    Which industry do you operate in?
                  </label>
                  <p className="font-inter font-normal" style={{ fontSize: '0.75rem', lineHeight: '0.9375rem', marginBottom: '2.0rem' }}>
                    Most investors specialize in specific industries. You can choose multiple.
                  </p>
                  <div style={{ width: '20rem', position: 'relative' }}>
                    <div 
                      ref={selectButtonRef}
                      onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)} 
                      className="cursor-pointer" 
                      style={{ 
                        width: '20rem', 
                        height: '2.439rem', 
                        background: isLoading ? '#1a1a1a' : '#0F0E16', 
                        border: '1px solid rgba(184, 184, 184, 0.13)', 
                        borderRadius: '0.1875rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '0 0.9375rem', 
                        boxSizing: 'border-box',
                        zIndex: 5,
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <span style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'normal', fontWeight: 400, fontSize: '0.75rem', lineHeight: '0.9375rem', color: selectedIndustries.length > 0 ? (isLoading ? '#888' : '#FFFFFF') : '#656565', width: 'auto', height: '0.9375rem' }}>
                        {selectedIndustries.length > 0 ? `${selectedIndustries.length} selected` : 'Select'}
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

                    {isDropdownOpen && !isLoading && (
                      <div 
                        ref={dropdownRef}
                        className="dropdown-container"
                        style={{ 
                          position: 'absolute', 
                          top: '100%',
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
                            {selectedIndustries.includes(industry) && (
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
                    
                    {/* Selected items container with adjusted position */}
                    <div style={{
                      position: 'absolute',
                      top: '3.5rem', /* Position it closer to the dropdown */
                      left: '0',
                      width: '38rem',
                      display: 'flex',
                      flexWrap: 'nowrap',
                      gap: '0.5rem',
                      overflowX: 'auto',
                      whiteSpace: 'nowrap',
                      paddingBottom: '0.25rem',
                      zIndex: 10, /* Between dropdown and button */
                      maxHeight: '5rem' /* Limit height to prevent pushing buttons down */
                    }}>
                      {selectedIndustries.map((industry) => (
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
                            boxSizing: 'border-box'
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
                          <img 
                            src={CloseIcon} 
                            alt="Remove selection" 
                            onClick={() => !isLoading && removeIndustry(industry)} 
                            className="cursor-pointer" 
                            style={{ 
                              width: '0.75rem', 
                              height: '0.75rem',
                              cursor: isLoading ? 'not-allowed' : 'pointer',
                              opacity: isLoading ? 0.6 : 1
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    
                    {error && <p className="text-red-500 text-sm" style={{ marginTop: '0.5rem', width: '20rem' }}>{error}</p>}
                  </div>
                </div>

                {/* Fixed position buttons container */}
                <div 
                  className="flex justify-between items-center" 
                  style={{ 
                    color: '#FFFFFF', 
                    position: 'absolute',
                    bottom: '2rem',
                    left: '2rem',
                    width: 'calc(100% - 4rem)',
                    paddingTop: '2rem'
                  }}
                >
                  <button 
                    className="font-inter font-normal" 
                    onClick={handleBack} 
                    disabled={isLoading}
                    style={{ 
                      fontSize: '0.875rem', 
                      lineHeight: '1.0625rem', 
                      color: isLoading ? '#888' : '#FFF',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.6 : 1
                    }}
                  >
                    Back
                  </button>
                  <button 
                    className="font-inter font-medium" 
                    onClick={handleContinue} 
                    disabled={isLoading}
                    style={{ 
                      display: 'inline-flex',
                      padding: '0.53125rem 1.21875rem 0.65625rem 1.21875rem',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '0.25rem',
                      background: isLoading ? '#ccc' : '#FFFFFF', 
                      color: '#000', 
                      fontSize: '0.875rem', 
                      fontWeight: 500,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      width: '6.4375rem',
                      height: '2.1875rem'
                    }}
                  >
                    {isLoading ? (
                      <div 
                        style={{
                          width: '1rem',
                          height: '1rem',
                          border: '2px solid #666',
                          borderTop: '2px solid #000',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}
                      />
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
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default InvestorsIndustry;