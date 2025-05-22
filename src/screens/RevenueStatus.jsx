// revenue Selected modified
// Vertx_Flow_fe/src/screens/RevenueStatus.jsx
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
  
  .dropdown-content::-webkit-scrollbar {
    display: none;
  }
  
  .dropdown-content {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// Add the styles to the document head if they don't already exist
if (!document.getElementById("revenue-status-styles")) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "revenue-status-styles";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

const RevenueStatus = () => {
  const navigate = useNavigate();
  const { startupData, updateStartupField, error, setError, loadingData } = useStartupProfile();
  const [currentRevenue, setCurrentRevenue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectButtonRef = useRef(null);

  useEffect(() => {
    setCurrentRevenue(startupData.revenue || "");
  }, [startupData.revenue]);

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

  const revenueOptions = [
    "Pre-revenue", "$2K>", "$2K-$5K", "$5K-$10K", "$10K-$100K", "$100K+",
  ];

  const handleRevenueChange = (option) => {
    setCurrentRevenue(option);
    updateStartupField('revenue', option);
    setError(null);
    setIsDropdownOpen(false);
  };

  const clearRevenue = () => {
    setCurrentRevenue("");
    updateStartupField('revenue', "");
    setError(null);
  };

  const handleContinue = () => {
    if (!currentRevenue) {
      setError("Please select your current revenue status.");
      return;
    }
    setError(null);
    navigate("/profile/industry");
  };

  const handleBack = () => {
    navigate("/profile/raise");
  };

  if (loadingData && !startupData.stage) {
    return <div className="w-screen h-screen flex justify-center items-center bg-black text-white">Loading...</div>;
  }

  // Layout constants
  const MAIN_CONTENT_WIDTH = '1280px';  const CONTENT_BOX_WIDTH = '720px';
  const CONTENT_BOX_HEIGHT = '362px';
  const CONTENT_BOX_PADDING_X = '35px';
  const circlesAreaTopInBox = 39;
  const questionLabelMarginTop = 31;

  return (<div className="min-h-screen text-white bg-[#150718] bg-cover bg-top bg-no-repeat p-4 sm:p-6 md:p-9">      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#150718] via-[#1C001E] via-[#14006E] to-[#14006E] opacity-100 z-0"></div>
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

            {/* Content Box */}
             <div
  className="relative w-full max-w-2xl min-h-[362px] mt-8 sm:mt-12 mx-auto"
  style={{
    position: 'relative',
    background: 'linear-gradient(224.28deg, #592582 18.6%, #6965ED 81.4%)',
    borderRadius: '12px',
    padding: '2px', // Space for the border
  }}
>
    <div 
    className="w-full h-full flex flex-col" 
    style={{
      background: 'black',
      borderRadius: '10px', // Slightly smaller to show the gradient border
      height: 'calc(100% - 4px)',
      padding: '2rem',
    }}
  >
              {/* Progress Steps */}
              <div style={{ paddingTop: `${circlesAreaTopInBox -27 }px`, boxSizing: 'border-box', width: '100%' }}>
                <ProfileProgressBar currentStep={3} />
              </div>
              
              {/* Form Elements Area */}
              <div style={{ color: '#FFFFFF', marginTop: `${questionLabelMarginTop}px` }}>
                <label htmlFor="revenue-dropdown" className="block font-inter font-semibold text-sm mb-2">
                  What is your current revenue status (MRR)?
                </label>
                <p className="font-inter font-normal text-xs text-gray-400 mb-4">
                  This helps investors understand your traction and growth.
                </p>
                
                {/* New Select Container */}
                <div style={{ width: '20rem', position: 'relative' }}>
                  {currentRevenue ? (
                    <>
                      <div style={{ 
                        fontFamily: 'Inter, sans-serif', 
                        fontStyle: 'normal', 
                        fontWeight: 400, 
                        fontSize: '0.75rem', 
                        lineHeight: '0.9375rem', 
                        color: '#FFFFFF', 
                        height: '0.9375rem', 
                        marginBottom: '0.5rem' 
                      }}>
                        Currently selected:
                      </div>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        height: '2rem', 
                        minWidth: '4.6875rem', 
                        paddingLeft: '0.625rem', 
                        paddingRight: '0.625rem', 
                        background: 'linear-gradient(260.47deg, rgba(0, 0, 0, 0.25) -22.9%, rgba(252, 65, 65, 0.25) 119.49%), linear-gradient(99.45deg, #000000 -4%, #33005C 104%)', 
                        borderRadius: '0.25rem', 
                        boxSizing: 'border-box'
                      }}>
                        <span style={{ 
                          fontFamily: 'Inter, sans-serif', 
                          fontStyle: 'normal', 
                          fontWeight: 500, 
                          fontSize: '0.75rem', 
                          lineHeight: '0.9375rem', 
                          color: '#FFFFFF', 
                          marginRight: '0.5rem' 
                        }}>
                          {currentRevenue}
                        </span>
                        <img 
                          src={CloseIcon} 
                          alt="Clear selection" 
                          onClick={clearRevenue} 
                          className="cursor-pointer" 
                          style={{ width: '0.75rem', height: '0.75rem' }}
                        />
                      </div>
                    </>
                  ) : (
                    <>                      
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
                          boxSizing: 'border-box' 
                        }}
                      >
                        <span style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'normal', fontWeight: 400, fontSize: '0.75rem', lineHeight: '0.9375rem', color: '#656565', width: '2.375rem', height: '0.9375rem' }}>
                          Select
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

                      {isDropdownOpen && (
                        <div 
                          ref={dropdownRef}
                          className="dropdown-content"
                          style={{ 
                            position: 'absolute', 
                            top: '100%',
                            left: '0',
                            width: '20rem', 
                            background: '#0F0E16', 
                            border: '1px solid rgba(184, 184, 184, 0.13)', 
                            borderRadius: '0.1875rem', 
                            zIndex: 9999,
                            marginTop: '0.3125rem',
                            maxHeight: '12.5rem', 
                            overflowY: 'auto',
                            animation: 'slideUp 0.2s ease-in-out'
                          }}
                        >
                          {revenueOptions.map((option) => ( 
                            <div 
                              key={option} 
                              onClick={() => handleRevenueChange(option)} 
                              className="cursor-pointer hover:bg-[#6C2BD9]" 
                              style={{ 
                                padding: '0.625rem 0.9375rem', 
                                fontFamily: 'Inter, sans-serif', 
                                fontStyle: 'normal', 
                                fontWeight: 400, 
                                fontSize: '0.75rem', 
                                lineHeight: '0.9375rem', 
                                color: '#FFFFFF' 
                              }}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {error && <p className="text-red-500 text-sm mt-2 mb-2">{error}</p>}
                </div>
              </div>

              {/* Buttons Container */}
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

export default RevenueStatus;