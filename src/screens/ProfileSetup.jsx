// Vertx_Flow_fe/src/screens/ProfileSetup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStartupProfile } from "../context/StartupProfileContext";
import logo from "../assets/ProfileImg.svg";
import SignOut from "../assets/logout.svg";
import CloseIcon from "../assets/close_icon.svg";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { startupData, updateStartupField, error, setError, loadingData } = useStartupProfile();
  const [currentStage, setCurrentStage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const stages = ["Pre-seed", "Seed", "Series A", "Series B", "Series B+", "Pre-IPO", "Not Specified"];
  const stepData = [
    { id: 1, title: 'Stage' },
    { id: 2, title: 'Location' },
    { id: 3, title: 'Raise' },
    { id: 4, title: 'Revenue' },
    { id: 5, title: 'Industry' },
    { id: 6, title: 'Pitch' },
  ];

  useEffect(() => { setCurrentStage(startupData.stage || ""); }, [startupData.stage]);
  const handleStageSelect = (stage) => { setCurrentStage(stage); updateStartupField('stage', stage); setError(null); setIsDropdownOpen(false); };
  const clearStage = () => { setCurrentStage(""); updateStartupField('stage', ""); setError(null); };
  const handleContinue = () => { if (!currentStage) { setError("Please select your startup stage."); return; } setError(null); navigate('/profile/location'); };
  const handleBack = () => navigate("/profile");

  if (loadingData && !startupData.pitch && (!startupData || Object.keys(startupData).length === 0)) {
    return <div className="w-screen h-screen flex justify-center items-center bg-black text-white">Loading...</div>;
  }

  // Coordinate Constants
  const CONTENT_BOX_TOP_ABS = 285;
  const CIRCLES_AREA_TOP_PAGE = 324;
  const LABELS_UNDER_CIRCLES_TOP_PAGE = 362;
  const QUESTION_LABEL_TOP_PAGE = 408;
  const HELP_TEXT_TOP_PAGE = 433;
  const INPUT_ZONE_TOP_PAGE = 471;

  const circlesAreaTopInBox = CIRCLES_AREA_TOP_PAGE - CONTENT_BOX_TOP_ABS; // 39px
  const circleHeight = 30;
  const labelUnderCircleHeight = 15;
  const marginCircleToLabel = LABELS_UNDER_CIRCLES_TOP_PAGE - (CIRCLES_AREA_TOP_PAGE + circleHeight); // 8px
  const progressBarSectionHeight = circleHeight + marginCircleToLabel + labelUnderCircleHeight; // 53px
  const progressBarBottomInBox = circlesAreaTopInBox + progressBarSectionHeight; // 39 + 53 = 92px

  const questionLabelTopInBox = QUESTION_LABEL_TOP_PAGE - CONTENT_BOX_TOP_ABS; // 123px
  // This is the margin from the BOTTOM of the progress bar (circles + labels) to the TOP of the "What stage..." question
  const questionLabelMarginTop = questionLabelTopInBox - progressBarBottomInBox; // 123 - 92 = 31px

  const helpTextTopInBox = HELP_TEXT_TOP_PAGE - CONTENT_BOX_TOP_ABS;
  const questionLabelHeightApprox = 17;
  const helpTextMarginTop = helpTextTopInBox - (questionLabelTopInBox + questionLabelHeightApprox); // 8px (margin below "What stage..." label)

  const inputZoneTopInBox = INPUT_ZONE_TOP_PAGE - CONTENT_BOX_TOP_ABS;
  const helpTextHeightApprox = 15;
  // This is the margin from the BOTTOM of the help text to the TOP of the input zone (select/chip)
  const inputZoneMarginTop = inputZoneTopInBox - (helpTextTopInBox + helpTextHeightApprox); // 23px

  const chipHeight = '32px';
  const chipBorderRadius = '4px';
  const chipBackground = 'linear-gradient(260.47deg, rgba(0, 0, 0, 0.25) -22.9%, rgba(252, 65, 65, 0.25) 119.49%), linear-gradient(99.45deg, #000000 -4%, #33005C 104%)';
  const chipMinWidth = '75px';
  const chipPaddingX = '10px';
  const chipIconWidth = 12;
  const chipSpaceBetweenTextAndIcon = '8px';
  const chipMarginTopFromCurrentlySelectedLabel = (494 - 471) - 15; // 8px

  return (
    <div className="w-full min-h-screen flex justify-center items-center" style={{ background: 'linear-gradient(0deg, rgba(28, 0, 30, 0.4) 0%, rgba(28, 0, 30, 0.4) 100%), #000000' }}>
      <div className="text-white relative" style={{ width: '1280px', height: '832px' }}>
        {/* Header */}
        <div style={{ position: 'absolute', width: '190px', height: '48px', left: '49px', top: '41px' }}>
          <img src={logo} alt="VERTX Logo" style={{ position: 'absolute', width: '50px', height: '48px', left: '0px', top: '0px' }} />
          <span className="font-inter font-semibold" style={{ position: 'absolute', width: '122px', height: '28px', left: '68px', top: '10px', fontSize: '28px', lineHeight: '34px', color: '#FFFFFF' }}>V E R T X</span>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer" style={{ position: 'absolute', width: 'auto', height: '24px', right: '49px', top: '55px' }} onClick={() => { localStorage.removeItem('authToken'); localStorage.removeItem('isVerified'); navigate('/'); }}>
          <span className="font-inter font-medium" style={{ fontSize: '14px', lineHeight: '17px', color: '#FFFFFF' }}>Sign out</span>
          <img src={SignOut} alt="Sign out" style={{ width: '24px', height: '24px' }} />
        </div>
        {/* Title Block */}
        <div style={{ position: 'absolute', width: '572px', left: '280px', top: '186px', color: '#FFFFFF' }}>
          <h2 className="font-inter font-semibold" style={{ fontSize: '20px', lineHeight: '24px', marginBottom: '12px' }}>Tell us about your startup</h2>
          <p className="font-inter font-normal" style={{ fontSize: '14px', lineHeight: '17px' }}>We’ll use this information to match you with the right investors for your specific needs.</p>
        </div>

        {/* Content Box */}
        <div
          className="bg-black flex flex-col"
          style={{
            position: 'absolute', width: '720px', height: '362px', left: '280px', top: '285px',
            borderRadius: '10px', boxSizing: 'border-box', padding: `0 35px`, // Horizontal padding
          }}
        >
          {/* Progress Steps (Tracking Bar) - RESTORED */}
          <div className="flex justify-between items-start" style={{ paddingTop: `${circlesAreaTopInBox}px`, boxSizing: 'border-box', width: '100%' }}>
            {stepData.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center text-center flex-1" style={{ minWidth: 0 }}>
                <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center border`} style={{ background: index === 0 ? '#6C2BD9' : '#33005C', borderColor: index === 0 ? '#6C2BD9' : (index === 1 ? '#000000' : '#33005C')}}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'normal', fontWeight: index === 0 ? 600 : 500, fontSize: '12px', lineHeight: '15px', color: '#FFFFFF' }}>{index + 1}</span>
                </div>
                <span style={{ marginTop: `${marginCircleToLabel}px`, fontFamily: 'Inter, sans-serif', fontStyle: 'normal', fontWeight: 400, fontSize: '12px', lineHeight: '15px', color: '#FFFFFF', width: 'auto', height: '15px', display: 'block' }}>{step.title}</span>
              </div>
            ))}
          </div>

          {/* Form Elements Area - marginTop positions it after the progress bar */}
          <div style={{ color: '#FFFFFF', marginTop: `${questionLabelMarginTop}px` }}>
            <label className="block font-inter font-semibold" style={{ fontSize: '14px', lineHeight: '17px', marginBottom: `${helpTextMarginTop}px`}}>
              What stage is your startup at?
            </label>
            <p className="font-inter font-normal text-xs" style={{ fontSize: '12px', lineHeight: '15px', marginBottom: `${inputZoneMarginTop}px` }}>
              This helps us to match you with the investors who focus on your stage.
            </p>

            {/* Input Zone: Either "Currently Selected" chip OR the "Select" dropdown */}
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
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', width: '320px', background: '#0F0E16', border: '1px solid rgba(184, 184, 184, 0.13)', borderRadius: '3px', zIndex: 10, maxHeight: `${(stages.length * 35) + 10}px`, overflowY: 'auto' }}>
                      {stages.map((stageOption) => ( <div key={stageOption} onClick={() => handleStageSelect(stageOption)} className="cursor-pointer hover:bg-[#6C2BD9]" style={{ padding: '10px 15px', fontFamily: 'Inter, sans-serif', fontStyle: 'normal', fontWeight: 400, fontSize: '12px', lineHeight: '15px', color: '#FFFFFF' }}>{stageOption === "" ? "Not Specified" : stageOption}</div> ))}
                    </div>
                  )}
                </>
              )}
              {error && <p className="text-red-500 text-sm" style={{ marginTop: '8px', width: '320px' }}>{error}</p>}
            </div>
          </div>

          {/* Buttons Container */}
          <div className="flex justify-between items-center w-full" style={{ color: '#FFFFFF', marginTop: 'auto', paddingTop: '20px', paddingBottom: 'calc(362px - (580px - 285px) - 36px)'}}>
            <button className="font-inter font-normal" onClick={handleBack} style={{ fontSize: '14px', lineHeight: '17px' }}>Back</button>
            <button className="font-inter font-medium" onClick={handleContinue} style={{ width: '100px', height: '36px', background: '#FFFFFF', color: '#000000', borderRadius: '4px', fontSize: '14px', lineHeight: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;