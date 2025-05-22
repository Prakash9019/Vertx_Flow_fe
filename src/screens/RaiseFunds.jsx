// Updated RaiseFunds.jsx with enhanced dropdown from duplicate version
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStartupProfile } from "../context/StartupProfileContext";
import Header from "../components/Header";
import ProfileProgressBar from "../components/ProfileProgressBar";
import CloseIcon from "../assets/close_icon.svg";

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
  
  .dropdown-container::-webkit-scrollbar {
    display: none;
  }
  
  .dropdown-container {
    -ms-overflow-style: none;
    scrollbar-width: none;
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
  const [currentRaise, setCurrentRaise] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectButtonRef = useRef(null);

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

  const fundraisingOptions = [
    "$25K>",
    "$25K-$100K",
    "$100K-$200K",
    "$200K-$500K",
    "$500K-$1M",
    "$1M+",
  ];

  const handleRaiseSelect = (option) => {
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

  const handleContinue = () => {
    if (!currentRaise) {
      setError("Please select how much you are looking to raise.");
      return;
    }
    setError(null);
    navigate("/profile/revenue");
  };

  const handleBack = () => {
    navigate("/profile/location");
  };

  if (loadingData && !startupData.stage) {
     return <div className="w-screen h-screen flex justify-center items-center bg-black text-white">Loading...</div>;
  }

  // --- Layout constants ---
  const MAIN_CONTENT_WIDTH = '1280px';
  const CONTENT_BOX_WIDTH = '720px';
  const CONTENT_BOX_HEIGHT = '362px';
  const CONTENT_BOX_PADDING_X = '35px';
  const circlesAreaTopInBox = 39;
  const marginCircleToLabel = 8;
  const questionLabelMarginTop = 31;
  const helpTextMarginTop = 8;
  const inputZoneMarginTop = 23;

  return (    <div className="min-h-screen text-white bg-[#150718] bg-cover bg-top bg-no-repeat p-4 sm:p-6 md:p-9">      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#150718] via-[#1C001E] via-[#14006E] to-[#14006E] opacity-100 z-0"></div>
      <div className="relative z-10">
        <Header />

        {/* Centered Main Content Area */}
        <div className="flex justify-center mt-12">
          <div className="relative" style={{ width: MAIN_CONTENT_WIDTH, height: 'auto' }}>
            {/* Title Block */}
            <div style={{ width: '572px', color: '#FFFFFF', marginBottom: '20px', marginLeft: 'auto', marginRight: 'auto' }}>
              <h2 className="font-inter font-semibold" style={{ fontSize: '20px', lineHeight: '24px', marginBottom: '12px' }}>Tell us about your startup</h2>
              <p className="font-inter font-normal" style={{ fontSize: '14px', lineHeight: '17px' }}>We'll use this information to match you with the right investors for your specific needs.</p>
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
                <ProfileProgressBar currentStep={2} />
              </div>

              {/* Form Elements Area */}
              <div style={{ color: '#FFFFFF', marginTop: `${questionLabelMarginTop}px` }}>
                <label htmlFor="raise-dropdown" className="block font-inter font-semibold" style={{ fontSize: '14px', lineHeight: '17px', marginBottom: `${helpTextMarginTop}px` }}>
                  How much are you looking to raise?
                </label>
                <p className="font-inter font-normal text-xs" style={{ fontSize: '12px', lineHeight: '15px', marginBottom: `${inputZoneMarginTop}px` }}>
                  This helps us match you with investors who can provide the right amount of capital.
                </p>
                
                {/* Enhanced dropdown from duplicate version */}
                <div style={{ width: '320px', position: 'relative' }}>
                  {currentRaise ? (
                    <>
                      <div style={{ 
                        fontFamily: 'Inter, sans-serif', 
                        fontStyle: 'normal', 
                        fontWeight: 400, 
                        fontSize: '12px', 
                        lineHeight: '15px', 
                        color: '#FFFFFF', 
                        height: '15px', 
                        marginBottom: '8px' 
                      }}>
                        Currently selected:
                      </div>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        height: '32px', 
                        minWidth: '75px', 
                        paddingLeft: '10px', 
                        paddingRight: '10px', 
                        background: 'linear-gradient(260.47deg, rgba(0, 0, 0, 0.25) -22.9%, rgba(252, 65, 65, 0.25) 119.49%), linear-gradient(99.45deg, #000000 -4%, #33005C 104%)', 
                        borderRadius: '4px', 
                        boxSizing: 'border-box'
                      }}>
                        <span style={{ 
                          fontFamily: 'Inter, sans-serif', 
                          fontStyle: 'normal', 
                          fontWeight: 500, 
                          fontSize: '12px', 
                          lineHeight: '15px', 
                          color: '#FFFFFF', 
                          marginRight: '8px' 
                        }}>
                          {currentRaise}
                        </span>
                        <img 
                          src={CloseIcon} 
                          alt="Clear selection" 
                          onClick={clearRaise} 
                          className="cursor-pointer" 
                          style={{ width: '12px', height: '12px' }}
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
                          width: '320px', 
                          height: '39px', 
                          background: '#0F0E16', 
                          border: '1px solid rgba(184, 184, 184, 0.13)', 
                          borderRadius: '3px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          padding: '0 15px', 
                          boxSizing: 'border-box' 
                        }}
                      >
                        <span style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'normal', fontWeight: 400, fontSize: '12px', lineHeight: '15px', color: '#656565', width: '38px', height: '15px' }}>
                          Select
                        </span>
                        <svg 
                          width="18px" 
                          height="18px" 
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
                          className="dropdown-container"
                          style={{ 
                            position: 'absolute', 
                            top: '100%',
                            left: '0',
                            width: '320px', 
                            background: '#0F0E16', 
                            border: '1px solid rgba(184, 184, 184, 0.13)', 
                            borderRadius: '3px', 
                            zIndex: 9999,
                            marginTop: '5px',
                            maxHeight: '200px', 
                            overflowY: 'auto',
                            animation: 'slideUp 0.2s ease-in-out'
                          }}
                        >
                          {fundraisingOptions.map((option) => ( 
                            <div 
                              key={option} 
                              onClick={() => handleRaiseSelect(option)} 
                              className="cursor-pointer hover:bg-[#6C2BD9]" 
                              style={{ 
                                padding: '10px 15px', 
                                fontFamily: 'Inter, sans-serif', 
                                fontStyle: 'normal', 
                                fontWeight: 400, 
                                fontSize: '12px', 
                                lineHeight: '15px', 
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
                  {error && <p className="text-red-500 text-sm" style={{ marginTop: '8px', width: '320px' }}>{error}</p>}
                </div>
              </div>

              {/* Buttons Container */}
              <div className="flex justify-between items-center w-full" style={{ color: '#FFFFFF', marginTop: 'auto', paddingTop: '20px', paddingBottom: '20px' }}>
                <button className="font-inter font-normal" onClick={handleBack} style={{ fontSize: '14px', lineHeight: '17px' }}>Back</button>
                <button className="font-inter font-medium" onClick={handleContinue} style={{ width: '100px', height: '36px', background: '#FFFFFF', color: '#000000', borderRadius: '4px', fontSize: '14px', lineHeight: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Continue</button>
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