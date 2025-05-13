// Vertx_Flow_fe/src/screens/InvestorsPitch.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStartupProfile } from "../context/StartupProfileContext";
import logo from "../assets/ProfileImg.svg"; // For consistent header
import SignOut from "../assets/logout.svg";  // For consistent header
import RightIcon from "../assets/RightTick.svg";
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
    <div className="w-[1580px] h-[832px] bg-gradient-to-b from-[#0F0C29] via-[#08080d] to-[#0b0b3f] text-white flex flex-col items-center justify-center p-6">
      <div className="absolute top-11 left-16 text-2xl font-bold flex items-center space-x-2">
        <img src={logo} alt="Profile logo" className="w-[50px] h-[48px] object-contain" />
        <span className="absolute top-[20px] left-[60px] text-[28px] leading-[100%] tracking-[0%] font-inter font-semibold text-white w-[122px] h-[28px]">VERTX</span>
      </div>
      <div className="absolute top-[59px] left-[1133px] ml-60 flex items-center space-x-2 cursor-pointer" onClick={() => { localStorage.removeItem('authToken'); localStorage.removeItem('isVerified'); navigate('/'); }}>
        <span className="w-[56px] h-[17px] font-inter font-medium text-[14px] leading-[100%] text-white">Sign out</span>
        <img src={SignOut} alt="Sign out" className="h-[24px] w-[24px]" />
      </div>
      
       <div className="absolute w-[572px] h-[54px] top-[170px] left-[340px] mr-80 text-white space-y-3">
        <h2 className="w-[279px] h-[23px] font-inter font-semibold text-[20px] leading-[100%] tracking-[0%]">
          Tell us about your startup
        </h2>
        <p className="w-[572px] h-[18px] font-inter font-normal text-[14px] leading-[100%] tracking-[0%] mt-[5px]">
          Investors do have geographic preferences. This helps us to match with
          the right investor.
        </p>
      </div>

      <div className="relative w-[720px] h-auto min-h-[362px] mt-[60px] gradient-border rounded-[10px] bg-black text-white p-8 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          {['Stage', 'Location', 'Raise', 'Revenue', 'Industry', 'Pitch'].map((stepLabel, index) => {
            const isActive = index <= 5; // All steps active/completed
            const isCompleted = index < 5; // Steps before Pitch completed
            return (
              <div key={stepLabel} className="flex flex-col items-center space-y-1 text-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${isActive ? 'bg-[#6C2BD9] border-[#6C2BD9]' : 'border-gray-600 text-gray-400'}`}>
                  {isCompleted ? <img src={RightIcon} alt="Tick" className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`text-[12px] ${isActive ? 'text-white' : 'text-gray-400'}`}>{stepLabel}</span>
              </div>
            );
          })}
        </div>
        <label htmlFor="pitch-textarea" className="block text-sm font-medium mb-2">
          Your Pitch (max ~100 words / 700 characters)
        </label>
        <textarea
          id="pitch-textarea"
          rows="6" // Adjusted rows for fixed height box
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
  );
};

export default InvestorsPitch;