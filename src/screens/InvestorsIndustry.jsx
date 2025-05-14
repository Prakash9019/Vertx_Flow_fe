// Vertx_Flow_fe/src/screens/InvestorsIndustry.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MultiSelect from "../components/MultiSelectDropdown";
import { useStartupProfile } from "../context/StartupProfileContext";
import Header from "../components/Header";
import ProfileProgressBar from "../components/ProfileProgressBar";

const InvestorsIndustry = () => {
  const navigate = useNavigate();
  const { startupData, updateStartupField, error, setError, loadingData } = useStartupProfile();
  const [currentIndustry, setCurrentIndustry] = useState([]);

  useEffect(() => {
    setCurrentIndustry(Array.isArray(startupData.industry) ? startupData.industry : []);
  }, [startupData.industry]);

  const industryOptions = ["AI/ML", "SaaS", "FinTech", "HealthTech", "EdTech", "E-commerce", "Gaming", "DeepTech", "Web3"];

  const handleIndustryChange = (selectedOptions) => {
    setCurrentIndustry(selectedOptions);
    updateStartupField('industry', selectedOptions);
    setError(null);
  };

  const handleContinue = () => {
    if (currentIndustry.length === 0) {
      setError("Please select at least one industry.");
      return;
    }
    setError(null);
    navigate("/profile/pitch");
  };

  const handleBack = () => {
    navigate("/profile/revenue");
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
                Most investors specialize in specific industries. You can choose multiple.
              </p>
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
                marginRight: 'auto'              }}
            >
              {/* Progress Steps */}
              <div style={{ paddingTop: `${circlesAreaTopInBox}px`, boxSizing: 'border-box', width: '100%' }}>
                <ProfileProgressBar currentStep={4} />
              </div>
              
              {/* Form Elements Area */}
              <div style={{ color: '#FFFFFF', marginTop: `${questionLabelMarginTop}px` }}>
                <label htmlFor="industry-multiselect" className="block font-inter font-semibold text-sm mb-2">
                  Which industry do you operate in?
                </label>
                <p className="font-inter font-normal text-xs text-gray-400 mb-4">
                  Most investors specialize in specific industries. You can choose multiple.
                </p>
                <MultiSelect
                  options={industryOptions}
                  selected={currentIndustry}
                  onSelect={handleIndustryChange}
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
  );
};

export default InvestorsIndustry;