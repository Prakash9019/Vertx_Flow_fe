// Vertx_Flow_fe/src/screens/RaiseFunds.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import { useStartupProfile } from "../context/StartupProfileContext";
import Header from "../components/Header";
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
        <div className="flex justify-center mt-28">
          <div className="relative" style={{ width: MAIN_CONTENT_WIDTH, height: 'auto' }}>
            {/* Title Block */}
            <div style={{ width: '572px', color: '#FFFFFF', marginBottom: '20px', marginLeft: 'auto', marginRight: 'auto' }}>
              <h2 className="font-inter font-semibold" style={{ fontSize: '20px', lineHeight: '24px', marginBottom: '12px' }}>Tell us about your startup</h2>
              <p className="font-inter font-normal" style={{ fontSize: '14px', lineHeight: '17px' }}>This helps us match you with investors who can provide the right amount of capital.</p>
            </div>

            {/* Content Box */}
            <div
              className="bg-black flex flex-col"
              style={{
                width: CONTENT_BOX_WIDTH,
                height: CONTENT_BOX_HEIGHT,
                borderRadius: '10px',
                boxSizing: 'border-box',
                paddingLeft: CONTENT_BOX_PADDING_X,
                paddingRight: CONTENT_BOX_PADDING_X,
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
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
              <div className="flex justify-between items-center w-full" style={{ color: '#FFFFFF', marginTop: 'auto', paddingTop: '20px', paddingBottom: '20px' }}>
                <button className="font-inter font-normal" onClick={handleBack} style={{ fontSize: '14px', lineHeight: '17px' }}>Back</button>
                <button className="font-inter font-medium" onClick={handleContinue} style={{ width: '100px', height: '36px', background: '#FFFFFF', color: '#000000', borderRadius: '4px', fontSize: '14px', lineHeight: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Continue</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaiseFunds;