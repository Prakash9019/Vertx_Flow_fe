// Vertx_Flow_fe/src/screens/ProfileSetup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStartupProfile } from "../context/StartupProfileContext";
import logo from "../assets/ProfileImg.svg";
import SignOut from "../assets/logout.svg";
import CustomSelect from "../components/CustomSelect";
import ProfileProgressBar from "../components/ProfileProgressBar";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { startupData, updateStartupField, error, setError, loadingData } = useStartupProfile();
  const [currentStage, setCurrentStage] = useState('');

  useEffect(() => {
    setCurrentStage(startupData.stage || "");
  }, [startupData.stage]);

  const handleStageChange = (e) => {
    const newStage = e.target.value;
    setCurrentStage(newStage);
    updateStartupField('stage', newStage);
    setError(null);
  };

  const handleContinue = () => {
    if (!currentStage) {
      setError("Please select your startup stage.");
      return;
    }
    setError(null);
    navigate('/profile/location'); // Or to "/profile/stage/selected" if you keep confirmation pages
  };

  const handleBack = () => {
    navigate("/profile");
  };

  if (loadingData && !startupData.pitch) {
    return <div className="w-full h-screen flex justify-center items-center bg-black text-white">Loading...</div>;
  }

  return (
    <div className="w-[1580px] h-[832px] bg-gradient-to-b from-[#0F0C29] via-[#08080d] to-[#0b0b3f] text-white flex flex-col items-center justify-center p-6">
      {/* Original Header Structure - adapt if you use a separate Header component */}
      <div className="absolute top-11 left-16 text-2xl font-bold flex items-center space-x-2">
        <img src={logo} alt="Profile logo" className="w-[50px] h-[48px] object-contain" />
        <span className="absolute top-[20px] left-[60px] text-[28px] leading-[100%] tracking-[0%] font-inter font-semibold text-white w-[122px] h-[28px]">VERTX</span>
      </div>
      <div className="absolute top-[59px] left-[1133px] ml-60 flex items-center space-x-2 cursor-pointer" onClick={() => { localStorage.removeItem('authToken'); localStorage.removeItem('isVerified'); navigate('/'); }}>
        <span className="w-[56px] h-[17px] font-inter font-medium text-[14px] leading-[100%] text-white">Sign out</span>
        <img src={SignOut} alt="Sign out" className="h-[24px] w-[24px]" />
      </div>

      {/* Original Title Block */}
      <div className="absolute w-[572px] h-[54px] top-[170px] left-[calc(50%-572px/2-180px/2)] text-white space-y-3"> {/* Centered title approx. */}
        <h2 className="font-inter font-semibold text-[20px] leading-[100%] tracking-[0%]">
            Tell us about your startup
        </h2>
        <p className="font-inter font-normal text-[14px] leading-[100%] tracking-[0%] mt-[5px]">
            We'll use this information to match you with the right investors for your specific needs.
        </p>
      </div>

      {/* Original Content Box */}
      <div className="relative w-[720px] h-auto min-h-[362px] mt-[60px] gradient-border rounded-[10px] bg-black text-white p-8 flex flex-col">
        <ProfileProgressBar currentStep={0} />

        <label className="block text-sm font-medium mb-2">
          What stage is your startup at?
        </label>
        <p className="text-xs text-gray-400 mb-4">
          This helps us to match you with the investors who focus on your stage.
        </p>        <CustomSelect
          value={currentStage}
          onChange={handleStageChange}
          placeholder="Select your stage"
          options={[
            { value: "Pre-seed", label: "Pre-seed" },
            { value: "Seed", label: "Seed" },
            { value: "Series A", label: "Series A" },
            { value: "Series B", label: "Series B" },
            { value: "Series B+", label: "Series B+" },
            { value: "Pre-IPO", label: "Pre-IPO" },
            { value: "", label: "Not Specified" }
          ]}
        />

        {error && <p className="text-red-500 text-sm mt-2 mb-2">{error}</p>}
        
        <div className="mt-auto pt-6 flex justify-between items-center w-full"> {/* Pushed to bottom */}
          <button className="font-inter font-normal text-[14px] leading-[100%] text-white" onClick={handleBack}>
           Back
          </button>
          <button className="w-[100px] h-[36px] font-inter text-[14px] font-medium bg-white text-black rounded-[4px]" onClick={handleContinue}>
           Continue
          </button>
       </div>
      </div>
    </div>
  );
};

export default ProfileSetup;