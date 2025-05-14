// Vertx_Flow_fe/src/screens/InvestorsPitch.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStartupProfile } from "../context/StartupProfileContext";
import logo from "../assets/ProfileImg.svg"; // For consistent header
import SignOut from "../assets/logout.svg";  // For consistent header
import RightIcon from "../assets/RightTick.svg";
import ProfileProgressBar from "../components/ProfileProgressBar";
// Removed Ellipse and StarOne imports unless they are part of this specific fixed layout

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
    navigate("/profile/industry"); // Or "/profile/industry/selected"
  };

  if (loadingData && !startupData.stage) {
    return <div className="w-full h-screen flex justify-center items-center bg-black text-white">Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center" style={{ background: 'linear-gradient(0deg, rgba(28, 0, 30, 0.4) 0%, rgba(28, 0, 30, 0.4) 100%), #000000', position: 'relative' }}>
      {/* Header: Logo Group */}
      <div style={{ position: 'absolute', width: '190px', height: '48px', left: '49px', top: '41px' }}>
        <img src={logo} alt="VERTX Logo Icon" style={{ position: 'absolute', width: '50px', height: '48px', left: '0px', top: '0px' }} />
        <span style={{ position: 'absolute', width: '122px', height: '28px', left: '68px', top: '10px', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '28px', lineHeight: '34px', color: '#FFFFFF', fontStyle:'normal' }}>VERTX</span>
      </div>
      {/* Header: Sign Out Group */}
      <div style={{ position: 'absolute', width: '85px', height: '24px', right: '49px', top: '55px', display: 'flex', alignItems: 'center', gap: '5px' }} className="cursor-pointer" onClick={() => { localStorage.removeItem('authToken'); localStorage.removeItem('isVerified'); navigate('/'); }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', lineHeight: '17px', color: '#FFFFFF', order: 1 }}>Sign out</span>
        <img src={SignOut} alt="Sign out Icon" style={{ width: '24px', height: '24px', order: 2 }} />
      </div>
      {/* Centered Main Content Area */}
      <div className="relative" style={{ width: '1280px', height: 'auto', marginTop: '0' }}>
        {/* Title Block */}
        <div style={{ position: 'absolute', width: '572px', left: '280px', top: '186px', color: '#FFFFFF' }}>
          <h2 className="font-inter font-semibold" style={{ fontSize: '20px', lineHeight: '24px', marginBottom: '12px' }}>Tell us about your startup</h2>
          <p className="font-inter font-normal" style={{ fontSize: '14px', lineHeight: '17px' }}>Investors do have geographic preferences. This helps us to match with the right investor.</p>
        </div>
        {/* Content Box */}
        <div className="bg-black flex flex-col" style={{ position: 'absolute', width: '720px', height: '362px', left: '280px', top: '285px', borderRadius: '10px', boxSizing: 'border-box', paddingLeft: '35px', paddingRight: '35px' }}>
          <ProfileProgressBar currentStep={5} />
          <label htmlFor="pitch-textarea" className="block text-sm font-medium mb-2">
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
          />
          <p className="text-xs text-gray-400 mt-1 text-right mb-2">{currentPitch.length}/700 characters</p>
          {error && <p className="text-red-500 text-sm my-2 text-center">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm my-2 text-center">{successMessage}</p>}
          <div className="mt-auto pt-4 flex justify-between items-center w-full">
            <button
              onClick={handleBack}
              className="font-inter font-normal text-[14px] leading-[100%] text-white"
              disabled={isSubmitting}
            >
              Back
            </button>
            <button
              onClick={handleFinish}
              disabled={isSubmitting || !!successMessage}
              className="w-auto px-6 h-[36px] font-inter text-[14px] font-medium bg-white text-black rounded-[4px] disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : successMessage ? "Saved!" : "Finish & Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorsPitch;