// Vertx_Flow_fe/src/screens/RaiseFunds.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import { useStartupProfile } from "../context/StartupProfileContext";
import logo from "../assets/ProfileImg.svg";
import SignOut from "../assets/logout.svg";
import ProfileProgressBar from "../components/ProfileProgressBar";

const RaiseFunds = () => {
  const navigate = useNavigate();
  const { startupData, updateStartupField, error, setError, loadingData } = useStartupProfile();
  const [currentRaise, setCurrentRaise] = useState("");

  useEffect(() => {
    setCurrentRaise(startupData.raise || "");
  }, [startupData.raise]);

  const fundraisingOptions = [
    "$25K>",
    "$25K-$100K",
    "$100K-$200K",
    "$200K-$500K",
    "$500K-$1M",
    "$1M+",
  ];

  const handleRaiseChange = (value) => {
    setCurrentRaise(value);
    updateStartupField('raise', value);
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

  // --- Layout constants (mirroring ProfileSetup.jsx) ---
  const viewportEdgePadding = '49px';
  const headerTopPadding = '41px';
  const logoGroupStyle = {
    position: 'absolute', width: '190px', height: '48px', left: viewportEdgePadding, top: headerTopPadding,
  };
  const vertxIconStyle = { position: 'absolute', width: '50px', height: '48px', left: '0px', top: '0px' };
  const vertxTextStyle = {
    position: 'absolute', width: '122px', height: '28px', left: '68px', top: '10px',
    fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '28px', lineHeight: '34px', color: '#FFFFFF', fontStyle:'normal',
  };
  const signOutGroupStyle = {
    position: 'absolute', width: '85px', height: '24px', right: viewportEdgePadding, top: '55px', display: 'flex', alignItems: 'center', gap: '5px',
  };
  const signOutTextStyle = {
    fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', lineHeight: '17px', color: '#FFFFFF', order: 1,
  };
  const signOutIconStyle = { width: '24px', height: '24px', order: 2 };

  const MAIN_CONTENT_WIDTH = '1280px';
  const TITLE_BLOCK_LEFT_REL = '280px';
  const TITLE_BLOCK_TOP_REL = '186px';
  const CONTENT_BOX_LEFT_REL = '280px';
  const CONTENT_BOX_TOP_REL = '285px';
  const CONTENT_BOX_WIDTH = '720px';
  const CONTENT_BOX_HEIGHT = '362px';
  const CONTENT_BOX_PADDING_X = '35px';
  const circlesAreaTopInBox = 39;
  const marginCircleToLabel = 8;
  const progressBarSectionHeight = 53;
  const progressBarBottomInBox = circlesAreaTopInBox + progressBarSectionHeight;
  const questionLabelTopInBox = 123;
  const questionLabelMarginTop = questionLabelTopInBox - progressBarBottomInBox;
  const helpTextTopInBox = 148;
  const questionLabelHeightApprox = 17;
  const helpTextMarginTop = helpTextTopInBox - (questionLabelTopInBox + questionLabelHeightApprox);
  const inputZoneTopInBox = 186;
  const helpTextHeightApprox = 15;
  const inputZoneMarginTop = inputZoneTopInBox - (helpTextTopInBox + helpTextHeightApprox);

  return (
    <div className="w-full min-h-screen flex flex-col items-center" style={{ background: 'linear-gradient(0deg, rgba(28, 0, 30, 0.4) 0%, rgba(28, 0, 30, 0.4) 100%), #000000', position: 'relative' }}>
      {/* Header: Logo Group */}
      <div style={logoGroupStyle}>
        <img src={logo} alt="VERTX Logo Icon" style={vertxIconStyle} />
        <span style={vertxTextStyle}>VERTX</span>
      </div>
      {/* Header: Sign Out Group */}
      <div style={signOutGroupStyle} className="cursor-pointer" onClick={() => { localStorage.removeItem('authToken'); localStorage.removeItem('isVerified'); navigate('/'); }}>
        <span style={signOutTextStyle}>Sign out</span>
        <img src={SignOut} alt="Sign out Icon" style={signOutIconStyle} />
      </div>
      {/* Centered Main Content Area */}
      <div className="relative" style={{ width: MAIN_CONTENT_WIDTH, height: 'auto', marginTop: '0' }}>
        {/* Title Block */}
        <div style={{ position: 'absolute', width: '572px', left: TITLE_BLOCK_LEFT_REL, top: TITLE_BLOCK_TOP_REL, color: '#FFFFFF' }}>
          <h2 className="font-inter font-semibold" style={{ fontSize: '20px', lineHeight: '24px', marginBottom: '12px' }}>Tell us about your startup</h2>
          <p className="font-inter font-normal" style={{ fontSize: '14px', lineHeight: '17px' }}>This helps us match you with investors who can provide the right amount of capital.</p>
        </div>
        {/* Content Box */}
        <div className="bg-black flex flex-col" style={{ position: 'absolute', width: CONTENT_BOX_WIDTH, height: CONTENT_BOX_HEIGHT, left: CONTENT_BOX_LEFT_REL, top: CONTENT_BOX_TOP_REL, borderRadius: '10px', boxSizing: 'border-box', paddingLeft: CONTENT_BOX_PADDING_X, paddingRight: CONTENT_BOX_PADDING_X }}>
          {/* Progress Steps */}
          <div style={{ paddingTop: `${circlesAreaTopInBox}px`, boxSizing: 'border-box', width: '100%' }}>
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
            <Dropdown
              options={fundraisingOptions}
              selected={currentRaise}
              onSelect={handleRaiseChange}
            />
            {error && <p className="text-red-500 text-sm" style={{ marginTop: '8px', width: '320px' }}>{error}</p>}
          </div>
          {/* Buttons Container */}
          <div className="flex justify-between items-center w-full" style={{ color: '#FFFFFF', marginTop: 'auto', paddingTop: '20px' }}>
            <button className="font-inter font-normal" onClick={handleBack} style={{ fontSize: '14px', lineHeight: '17px' }}>Back</button>
            <button className="font-inter font-medium" onClick={handleContinue} style={{ width: '100px', height: '36px', background: '#FFFFFF', color: '#000000', borderRadius: '4px', fontSize: '14px', lineHeight: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaiseFunds;