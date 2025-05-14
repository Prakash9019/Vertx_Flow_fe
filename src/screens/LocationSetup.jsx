// Vertx_Flow_fe/src/screens/LocationSetup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStartupProfile } from "../context/StartupProfileContext";
import logo from "../assets/ProfileImg.svg";
import SignOut from "../assets/logout.svg";
import ProfileProgressBar from "../components/ProfileProgressBar";

const LocationSetup = () => {
  const navigate = useNavigate();
  const { startupData, updateStartupField, error, setError, loadingData } = useStartupProfile();
  const [currentLocation, setCurrentLocation] = useState("");

  useEffect(() => {
    setCurrentLocation(startupData.location || "");
  }, [startupData.location]);

  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    setCurrentLocation(newLocation);
    updateStartupField('location', newLocation);
    setError(null);
  };

  const handleContinue = () => {
    if (!currentLocation.trim()) {
      setError("Please enter your startup's location.");
      return;
    }
    setError(null);
    navigate("/profile/raise");
  };

  const handleBack = () => {
    navigate("/profile/setup");
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
          <p className="font-inter font-normal" style={{ fontSize: '14px', lineHeight: '17px' }}>Investors do have geographic preferences. This helps us to match with the right investor.</p>
        </div>
        {/* Content Box */}
        <div className="bg-black flex flex-col" style={{ position: 'absolute', width: CONTENT_BOX_WIDTH, height: CONTENT_BOX_HEIGHT, left: CONTENT_BOX_LEFT_REL, top: CONTENT_BOX_TOP_REL, borderRadius: '10px', boxSizing: 'border-box', paddingLeft: CONTENT_BOX_PADDING_X, paddingRight: CONTENT_BOX_PADDING_X }}>
          {/* Progress Steps */}
          <div style={{ paddingTop: `${circlesAreaTopInBox}px`, boxSizing: 'border-box', width: '100%' }}>
            <ProfileProgressBar currentStep={1} />
          </div>
          {/* Form Elements Area */}
          <div style={{ color: '#FFFFFF', marginTop: `${questionLabelMarginTop}px` }}>
            <label htmlFor="location-input" className="block font-inter font-semibold" style={{ fontSize: '14px', lineHeight: '17px', marginBottom: `${helpTextMarginTop}px` }}>
              Where is your startup headquartered?
            </label>
            <p className="font-inter font-normal text-xs" style={{ fontSize: '12px', lineHeight: '15px', marginBottom: `${inputZoneMarginTop}px` }}>
              e.g., San Francisco, USA
            </p>
            <input
              type="text"
              id="location-input"
              value={currentLocation}
              onChange={handleLocationChange}
              placeholder="City, Country"
              className="w-full p-3 bg-[#1e1e1e] border border-gray-600 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
              style={{ width: '320px' }}
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

export default LocationSetup;