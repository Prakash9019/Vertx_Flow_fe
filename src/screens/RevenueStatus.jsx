// Vertx_Flow_fe/src/screens/RevenueStatus.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import { useStartupProfile } from "../context/StartupProfileContext";
import Header from "../components/Header";
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
    navigate("/profile/industry");
  };

  const handleBack = () => {
    navigate("/profile/raise");
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
        <div className="flex justify-center mt-12">
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
                This helps investors understand your traction and growth.
              </p>
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
                width: CONTENT_BOX_WIDTH,
                height: CONTENT_BOX_HEIGHT,
                borderRadius: '10px',
                boxSizing: 'border-box',
                paddingLeft: CONTENT_BOX_PADDING_X,
                paddingRight: CONTENT_BOX_PADDING_X,
                marginLeft: 'auto',
                marginRight: 'auto'              }}
            > */}
              {/* Progress Steps */}
              <div style={{ paddingTop: `${circlesAreaTopInBox}px`, boxSizing: 'border-box', width: '100%' }}>
                <ProfileProgressBar currentStep={3} />
              </div>
              
              {/* Form Elements Area */}
              <div style={{ color: '#FFFFFF', marginTop: `${questionLabelMarginTop}px` }}>
                <label htmlFor="revenue-dropdown" className="block font-inter font-semibold text-sm mb-2">
                  What is your current revenue status (MRR)?
                </label>
                <p className="font-inter font-normal text-xs text-gray-400 mb-4">
                  This helps investors understand your traction and growth.
                </p>
                <Dropdown
                  options={revenueOptions}
                  selected={currentRevenue}
                  onSelect={handleRevenueChange}
                />
                {error && <p className="text-red-500 text-sm mt-2 mb-2">{error}</p>}
              </div>

              {/* Buttons Container */}
              <div className="mt-auto pt-6 flex justify-between items-center w-full pb-6">
                <button 
                  className="font-inter font-normal text-[14px] text-white" 
                  onClick={handleBack}
                >
                  Back
                </button>
                <button 
                  className="w-[100px] h-[36px] font-inter text-[14px] font-medium bg-white text-black rounded-[4px]" 
                  onClick={handleContinue}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default RevenueStatus;