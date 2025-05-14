// Vertx_Flow_fe/src/screens/RevenueStatus.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import { useStartupProfile } from "../context/StartupProfileContext";
import logo from "../assets/ProfileImg.svg";
import SignOut from "../assets/logout.svg";
import RightIcon from "../assets/RightTick.svg";
import ProfileProgressBar from "../components/ProfileProgressBar";

const RevenueStatus = () => {
  const navigate = useNavigate();
  const { startupData, updateStartupField, error, setError, loadingData } = useStartupProfile();
  const [currentRevenue, setCurrentRevenue] = useState('');

  useEffect(() => {
    setCurrentRevenue(startupData.revenue || "");
  }, [startupData.revenue]);

  const revenueOptions = [
    "Pre-revenue", "$2K>", "$2K-$5K", "$5K-$10K", "$10K-$100K", "$100K+",
  ];

  const handleRevenueChange = (value) => {
    setCurrentRevenue(value);
    updateStartupField('revenue', value);
    setError(null);
  };

  const handleContinue = () => {
    if (!currentRevenue) {
      setError("Please select your current revenue status.");
      return;
    }
    setError(null);
    navigate("/profile/industry"); // Or "/profile/revenue/selected"
  };

  const handleBack = () => {
    navigate("/profile/raise"); // Or "/profile/raise/selected"
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
          <p className="font-inter font-normal" style={{ fontSize: '14px', lineHeight: '17px' }}>This helps investors understand your traction and growth.</p>
        </div>
        {/* Content Box */}
        <div className="bg-black flex flex-col" style={{ position: 'absolute', width: '720px', height: '362px', left: '280px', top: '285px', borderRadius: '10px', boxSizing: 'border-box', paddingLeft: '35px', paddingRight: '35px' }}>
          <ProfileProgressBar currentStep={3} />
          <label htmlFor="revenue-dropdown" className="block text-sm font-medium mb-2">
            What is your current revenue status (MRR)?
          </label>
          <p className="text-xs text-gray-400 mb-4">
            This helps investors understand your traction and growth.
          </p>
          <Dropdown
            options={revenueOptions}
            selected={currentRevenue}
            onSelect={handleRevenueChange}
          />
          {error && <p className="text-red-500 text-sm mt-2 mb-2">{error}</p>}
          <div className="mt-auto pt-6 flex justify-between items-center w-full">
            <button className="font-inter font-normal text-[14px] leading-[100%] text-white" onClick={handleBack}>
             Back
            </button>
            <button className="w-[100px] h-[36px] font-inter text-[14px] font-medium bg-white text-black rounded-[4px]" onClick={handleContinue}>
             Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueStatus;