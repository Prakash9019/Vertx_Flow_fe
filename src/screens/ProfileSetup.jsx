// Vertx_Flow_fe/src/screens/ProfileSetup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStartupProfile } from "../context/StartupProfileContext";
import Header from "../components/Header";
import CloseIcon from "../assets/close_icon.svg";
import ProfileProgressBar from "../components/ProfileProgressBar";

const styles = `
  @keyframes slideUp {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
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

  const stages = ["Pre-seed", "Seed", "Series A", "Series B", "Series B+", "Pre-IPO", "Not Specified"];
  const stepData = [
    { id: 1, title: 'Stage' }, { id: 2, title: 'Location' }, { id: 3, title: 'Raise' },
    { id: 4, title: 'Revenue' }, { id: 5, title: 'Industry' }, { id: 6, title: 'Pitch' },
  ];

  useEffect(() => { setCurrentStage(startupData.stage || ""); }, [startupData.stage]);
  const handleStageSelect = (stage) => { setCurrentStage(stage); updateStartupField('stage', stage); setError(null); setIsDropdownOpen(false); };
  const clearStage = () => { setCurrentStage(""); updateStartupField('stage', ""); setError(null); };
  const handleContinue = () => { if (!currentStage) { setError("Please select your startup stage."); return; } setError(null); navigate('/profile/location'); };
  const handleBack = () => navigate("/profile");

  if (loadingData && !startupData.pitch && (!startupData || Object.keys(startupData).length === 0)) {
    return <div className="w-screen h-screen flex justify-center items-center bg-black text-white">Loading...</div>;
  }

  // --- Constants for main content positioning (within a centered 1280px block) ---
  const MAIN_CONTENT_WIDTH = '1280px';
  const MAIN_CONTENT_HEIGHT = '832px';

  const TITLE_BLOCK_LEFT_REL = '280px';
  const TITLE_BLOCK_TOP_REL = '186px';

  const CONTENT_BOX_LEFT_REL = '280px';
  const CONTENT_BOX_TOP_REL = '285px';
  const CONTENT_BOX_WIDTH = '720px';
  const CONTENT_BOX_HEIGHT = '362px';
  const CONTENT_BOX_PADDING_X = '35px';

  // ... other coordinate constants for elements inside the content box (circlesAreaTopInBox etc.) ...
  // These should be calculated relative to CONTENT_BOX_TOP_REL if the content box itself is positioned absolutely
    const CONTENT_BOX_TOP_ABS_FOR_CALC = 0; // Since these are now relative to content box, its top is 0 for these calculations
    const CIRCLES_AREA_TOP_PAGE = 324;
    const LABELS_UNDER_CIRCLES_TOP_PAGE = 362;
    const QUESTION_LABEL_TOP_PAGE = 408;
    const HELP_TEXT_TOP_PAGE = 433;
    const INPUT_ZONE_TOP_PAGE = 471;

    // Recalculate these based on the idea that they are *inside* the absolutely positioned Content Box
    const circlesAreaTopInBox = CIRCLES_AREA_TOP_PAGE -310; // 39px from top of an imaginary 285px offset content box
    const circleHeight = 30;
    const labelUnderCircleHeight = 15;
    const marginCircleToLabel = LABELS_UNDER_CIRCLES_TOP_PAGE - (CIRCLES_AREA_TOP_PAGE + circleHeight); // 8px
    const progressBarSectionHeight = circleHeight + marginCircleToLabel + labelUnderCircleHeight; // 53px
    const progressBarBottomInBox = circlesAreaTopInBox + progressBarSectionHeight; // 39 + 53 = 92px

    const questionLabelTopInBox = QUESTION_LABEL_TOP_PAGE - 285; // 123px
    const questionLabelMarginTop = questionLabelTopInBox - progressBarBottomInBox; // 123 - 92 = 31px

    const helpTextTopInBox = HELP_TEXT_TOP_PAGE - 285; // 148px
    const questionLabelHeightApprox = 17;
    const helpTextMarginTop = helpTextTopInBox - (questionLabelTopInBox + questionLabelHeightApprox); // 8px

    const inputZoneTopInBox = INPUT_ZONE_TOP_PAGE - 285; // 186px
    const helpTextHeightApprox = 15;
    const inputZoneMarginTop = inputZoneTopInBox - (helpTextTopInBox + helpTextHeightApprox); // 23px

    const chipHeight = '32px';
    const chipBorderRadius = '4px';
    const chipBackground = 'linear-gradient(260.47deg, rgba(0, 0, 0, 0.25) -22.9%, rgba(252, 65, 65, 0.25) 119.49%), linear-gradient(99.45deg, #000000 -4%, #33005C 104%)';
    const chipMinWidth = '75px';
    const chipPaddingX = '10px';
    const chipIconWidth = 12;
    const chipSpaceBetweenTextAndIcon = '8px';
    const chipMarginTopFromCurrentlySelectedLabel = (494 - 471) - 15; // 8px


  return (    <div className="min-h-screen text-white bg-[#150718] bg-cover bg-top bg-no-repeat p-4 sm:p-6 md:p-9">      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#150718] via-[#1C001E] via-[#14006E] to-[#14006E] opacity-100 z-0"></div>
      <div className="relative z-10">
        <Header />

        {/* Centered Main Content Area */}        <div className="flex justify-center mt-12">
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
            {/* <div
              className="bg-black flex flex-col"
              style={{
                width: CONTENT_BOX_WIDTH, height: CONTENT_BOX_HEIGHT,
                borderRadius: '10px', boxSizing: 'border-box', 
                paddingLeft: CONTENT_BOX_PADDING_X, paddingRight: CONTENT_BOX_PADDING_X,
                marginLeft: 'auto', marginRight: 'auto'
              }}
            > */}
              {/* Progress Steps */}
              <div style={{ paddingTop: `${circlesAreaTopInBox}px`, boxSizing: 'border-box', width: '100%' }}>
                <ProfileProgressBar currentStep={0} />
              </div>

              {/* Form Elements Area */}
              <div style={{ color: '#FFFFFF', marginTop: `${questionLabelMarginTop-26}px` }}>
                <label className="block font-inter font-semibold" style={{ fontSize: '14px', lineHeight: '17px', marginBottom: `${helpTextMarginTop }px`}}>
                  What stage is your startup at?
                </label>
                <p className="font-inter font-normal text-xs" style={{ fontSize: '12px', lineHeight: '15px', marginBottom: `${inputZoneMarginTop}px` }}>
                  This helps us to match you with the investors who focus on your stage.
                </p>
                <div style={{ width: '320px', position: 'relative' }}>
                  {currentStage ? (
                    <>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'normal', fontWeight: 400, fontSize: '12px', lineHeight: '15px', color: '#FFFFFF', height: '15px', marginBottom: `${chipMarginTopFromCurrentlySelectedLabel}px`}}>
                        Currently selected:
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', height: chipHeight, minWidth: chipMinWidth, paddingLeft: chipPaddingX, paddingRight: chipPaddingX, background: chipBackground, borderRadius: chipBorderRadius, boxSizing: 'border-box'}}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'normal', fontWeight: 500, fontSize: '12px', lineHeight: '15px', color: '#FFFFFF', marginRight: chipSpaceBetweenTextAndIcon }}>{currentStage}</span>
                        <img src={CloseIcon} alt="Clear selection" onClick={clearStage} className="cursor-pointer" style={{ width: `${chipIconWidth}px`, height: `${chipIconWidth}px`}}/>
                      </div>
                    </>
                  ) : (
                    <>
                      <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="cursor-pointer" style={{ width: '320px', height: '39.02px', background: '#0F0E16', border: '1px solid rgba(184, 184, 184, 0.13)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 15px', boxSizing: 'border-box' }}>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'normal', fontWeight: 400, fontSize: '12px', lineHeight: '15px', color: '#656565' }}>Select</span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path d="M7 10L12 15L17 10H7Z" fill="#656565"/></svg>
                      </div>
                      {isDropdownOpen && (
                        <div style={{ 
                          position: 'absolute', 
                          // bottom: 'calc(100% + 4px)', 
                          width: '320px', 
                          background: '#0F0E16', 
                          border: '1px solid rgba(184, 184, 184, 0.13)', 
                          borderRadius: '3px', 
                          zIndex: 9999,
                          marginTop: '-30px', //or use -280 for top view like just opposite of this 
                          // maxHeight: `200px`, 
                          // overflowY: 'hidden',
                          transform: 'translateY(0)',
                          transition: 'transform 0.2s ease-in-out',
                          animation: 'slideUp 0.2s ease-in-out'
                        }}>
                          {stages.map((stageOption) => ( 
                            <div 
                              key={stageOption} 
                              onClick={() => handleStageSelect(stageOption)} 
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
                              {stageOption === "" ? "Not Specified" : stageOption}
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

export default ProfileSetup;