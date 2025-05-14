// Vertx_Flow_fe/src/screens/InvestorsPitch.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStartupProfile } from "../context/StartupProfileContext";
import Header from "../components/Header";
import ProfileProgressBar from "../components/ProfileProgressBar";

const InvestorsPitch = () => {
  const navigate = useNavigate();
  const {
    startupData, updateStartupField, submitStartupProfile,
    isSubmitting, error, setError, successMessage, loadingData,
  } = useStartupProfile();
  const [currentPitch, setCurrentPitch] = useState('');

  useEffect(() => {
    setCurrentPitch(startupData.pitch || "");
  }, [startupData.pitch]);

  const handlePitchChange = (e) => {
    const newPitch = e.target.value;
    setCurrentPitch(newPitch);
    updateStartupField('pitch', newPitch);
    setError(null);
  };

  const handleFinish = async () => {
    if (!currentPitch.trim()) {
      setError("Please provide a pitch for your startup.");
      return;
    }
    setError(null);
    const success = await submitStartupProfile();
    if (success) {
      setTimeout(() => navigate("/usage"), 1500);
    }
  };

  const handleBack = () => {
    navigate("/profile/industry");
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
        <div className="flex justify-center mt-28">
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
                Investors do have geographic preferences. This helps us to match with the right investor.
              </p>
            </div>

            {/* Content Box */}
            <div              className="bg-black flex flex-col"
              style={{
                width: CONTENT_BOX_WIDTH,
                height: CONTENT_BOX_HEIGHT,
                borderRadius: '10px',
                boxSizing: 'border-box',
                paddingLeft: CONTENT_BOX_PADDING_X,
                paddingRight: CONTENT_BOX_PADDING_X,
                marginLeft: 'auto',
                marginRight: 'auto',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* Progress Steps */}
              <div style={{ paddingTop: `${circlesAreaTopInBox}px`, boxSizing: 'border-box', width: '100%' }}>
                <ProfileProgressBar currentStep={5} />
              </div>
                {/* Form Elements Area */}
              <div style={{ color: '#FFFFFF', marginTop: `${questionLabelMarginTop}px`, flex: '1', minHeight: '0' }}>
                <label htmlFor="pitch-textarea" className="block font-inter font-semibold text-sm mb-2">
                  Your Pitch (max ~100 words / 700 characters)
                </label>
                <textarea
                  id="pitch-textarea"
                  rows="6"
                  value={currentPitch}
                  onChange={handlePitchChange}
                  placeholder="Describe your startup's vision, the problem it solves, your solution, and your target market. Make it concise and compelling!"
                  className="w-full p-3 bg-[#1e1e1e] border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-1"
                  maxLength={700}
                  style={{ minHeight: '120px', maxHeight: '120px' }}
                />
                <p className="font-inter font-normal text-xs text-gray-400 mt-1 text-right mb-2">
                  {currentPitch.length}/700 characters
                </p>
                {error && <p className="text-red-500 text-sm my-2 text-center">{error}</p>}                {successMessage && <p className="text-green-500 text-sm my-2 text-center">{successMessage}</p>}
              </div>

              {/* Buttons Container */}
              <div className="flex justify-between items-center w-full" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px', paddingBottom: '20px', marginTop: '10px' }}>
                <button
                  onClick={handleBack}
                  className="font-inter font-normal"
                  style={{ fontSize: '14px', lineHeight: '17px' }}
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={isSubmitting || !!successMessage}
                  className="font-inter font-medium"
                  style={{ width: 'auto', minWidth: '100px', height: '36px', background: '#FFFFFF', color: '#000000', borderRadius: '4px', fontSize: '14px', lineHeight: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}
                >
                  {isSubmitting ? "Saving..." : successMessage ? "Saved!" : "Finish & Save Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorsPitch;