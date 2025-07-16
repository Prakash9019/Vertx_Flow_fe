import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStartupProfile } from "../context/StartupProfileContext";
import Header from "../components/Header";
import ProfileProgressBar from "../components/ProfileProgressBar";
import API_KEY from "../../key";

const InvestorsPitch = () => {
  const navigate = useNavigate();
  const {
    startupData, updateStartupField, submitStartupProfile,
    isSubmitting, setIsSubmitting, error, setError, loadingData, user_id
  } = useStartupProfile();
  const [currentPitch, setCurrentPitch] = useState('');
  const [processingStatus, setProcessingStatus] = useState('');

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
    setIsSubmitting(true);
    setProcessingStatus('Saving your profile...');
    
    try {
      // Save profile first
      const success = await submitStartupProfile();
      if (!success) {
        setIsSubmitting(false);
        setProcessingStatus('');
        return;
      }

      // Wait for AI analysis to complete before redirecting
      setProcessingStatus('Analyzing your profile with AI...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check AI analysis status and wait for completion
      let analysisComplete = false;
      let attempts = 0;
      const maxAttempts = 30;
      while (!analysisComplete && attempts < maxAttempts) {
        try {
          setProcessingStatus(`Finding your best investor matches... (${attempts + 1}/${maxAttempts})`);
          const token = localStorage.getItem('authToken');
          const response = await fetch(`${API_KEY}/api/investors/ai-status/${user_id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.isComplete && data.matchCount > 0) {
              analysisComplete = true;
              setProcessingStatus(`Found ${data.matchCount} investor matches! Redirecting...`);
            } else {
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          } else {
            break;
          }
        } catch {
          break;
        }
        attempts++;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Onboarding flow logic:
      // Only check onboarding flag and route accordingly
      // Always force /usage for every new user after pitch
      localStorage.removeItem('vertx_onboarding_role_complete');
      navigate("/usage");
      return;
    } catch {
      setError("An error occurred while saving your profile. Please try again.");
    } finally {
      setIsSubmitting(false);
      setProcessingStatus('');
    }
  };

  if (loadingData && !startupData.stage) {
    return <div className="w-screen h-screen flex justify-center items-center bg-black text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-white bg-[#150718] bg-cover bg-top bg-no-repeat p-1 xs:p-2 sm:p-6 md:p-9">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950 opacity-65 z-0"></div>
      <div className="relative z-10">
        <Header />

        <div className="flex justify-center mt-3 xs:mt-6 sm:mt-12">
          <div className="relative w-full max-w-[80rem] px-1 xs:px-2 sm:px-4 lg:px-0">
            {/* Header text container */}
                        <div className="text-white mb-2 xs:mb-3 sm:mb-5 w-full max-w-2xl lg:max-w-[45rem] mx-auto">
              <h2 className="font-inter font-semibold text-sm xs:text-base sm:text-lg lg:text-xl leading-4 xs:leading-5 sm:leading-6 mb-1.5 xs:mb-2 sm:mb-3">
                 Tell us about your startup
              </h2>
              <p className="font-inter font-normal text-[10px] xs:text-xs sm:text-sm leading-[0.875rem] xs:leading-[1rem] sm:leading-[1.0625rem]">
                We'll use this information to match you with the right investors for your specific needs.
              </p>
            </div>

            {/* Main card container */}
            <div className="relative w-full max-w-2xl lg:max-w-[45rem] mt-3 xs:mt-4 sm:mt-8 mx-auto">
              {/* Gradient border */}
              <div className="p-0.5 rounded-[0.625rem] bg-[linear-gradient(224.28deg,#592582_18.6%,#6965ED_81.4%)]">
                
                <div className="bg-black rounded-[0.625rem] p-3 xs:p-4 sm:p-6 lg:p-8 lg:pt-10 min-h-[16rem] xs:min-h-[18rem] sm:min-h-[20rem] lg:min-h-[22.625rem] flex flex-col">
                  
                  <div className="w-full mb-3 xs:mb-4 sm:mb-6">
                    <ProfileProgressBar currentStep={5} />
                  </div>

                  <div className="text-white flex-1 flex flex-col">
                    <label className="block font-inter font-semibold text-[10px] xs:text-xs sm:text-sm leading-[0.875rem] xs:leading-[0.9375rem] mb-1.5 xs:mb-2">
                      Your startup's elevator pitch
                    </label>
                    <p className="font-inter font-normal text-[10px] xs:text-xs leading-[0.875rem] xs:leading-[0.9375rem] mb-4 xs:mb-6 sm:mb-8">
                      Give investors a concise overview of your value proposition. You can enhance it.
                    </p>

                    {/* Keep the existing textarea container unchanged */}
                    <div className="w-full relative mb-auto">
                      <textarea
                        id="pitch-textarea"
                        rows="6"
                        value={currentPitch}
                        onChange={handlePitchChange}
                        placeholder="Write here..."
                        className="w-full h-[5.75rem] rounded-[0.3125rem] border border-white/13 bg-[#0F0E16] text-white text-xs font-normal font-inter px-[0.9375rem] py-[0.625rem] resize-none placeholder:text-[#656565]"
                        maxLength={200}
                      />
                      {/* AI Icon */}
                      <div className="absolute bottom-[0.625rem] right-[0.625rem] w-5 h-5 rounded-full bg-black border-[0.5px] border-[#AD6FDE] flex justify-center items-center mb-[0.3rem]">
                        <svg
                          width="16"
                          height="15"
                          viewBox="0 0 16 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 rounded-full ml-[0.1rem]"
                        >
                          <g id="Group 381">
                            <path
                              id="Star 1"
                              d="M9.09108 3.38946C8.97554 2.7269 8.02446 2.72689 7.90892 3.38946L7.45877 5.97077C7.4153 6.22007 7.22007 6.4153 6.97077 6.45877L4.38946 6.90892C3.7269 7.02446 3.72689 7.97554 4.38946 8.09108L6.97077 8.54123C7.22007 8.5847 7.4153 8.77993 7.45877 9.02923L7.90892 11.6105C8.02446 12.2731 8.97554 12.2731 9.09108 11.6105L9.54123 9.02923C9.5847 8.77993 9.77993 8.5847 10.0292 8.54123L12.6105 8.09108C13.2731 7.97554 13.2731 7.02446 12.6105 6.90892L10.0292 6.45877C9.77993 6.4153 9.5847 6.22007 9.54123 5.97077L9.09108 3.38946Z"
                              fill="url(#paint0_linear_350_1297)"
                            />
                            <path
                              id="Star 2"
                              d="M4.39405 9.25964C4.31702 8.81793 3.68298 8.81793 3.60595 9.25964L3.45434 10.129C3.42536 10.2952 3.29521 10.4254 3.129 10.4543L2.25964 10.6059C1.81793 10.683 1.81793 11.317 2.25964 11.3941L3.129 11.5457C3.29521 11.5746 3.42536 11.7048 3.45434 11.871L3.60595 12.7404C3.68298 13.1821 4.31702 13.1821 4.39405 12.7404L4.54566 11.871C4.57464 11.7048 4.70479 11.5746 4.871 11.5457L5.74036 11.3941C6.18207 11.317 6.18207 10.683 5.74036 10.6059L4.871 10.4543C4.70479 10.4254 4.57464 10.2952 4.54566 10.129L4.39405 9.25964Z"
                              fill="url(#paint1_linear_350_1297)"
                            />
                            <path
                              id="Star 3"
                              d="M5.74628 3.41227C5.69814 3.13621 5.30186 3.13621 5.25372 3.41227L5.15896 3.95563C5.14085 4.0595 5.0595 4.14085 4.95563 4.15896L4.41227 4.25372C4.13621 4.30186 4.13621 4.69814 4.41227 4.74628L4.95563 4.84104C5.0595 4.85915 5.14085 4.9405 5.15896 5.04437L5.25372 5.58773C5.30186 5.86379 5.69814 5.86379 5.74628 5.58773L5.84104 5.04437C5.85915 4.9405 5.9405 4.85915 6.04437 4.84104L6.58773 4.74628C6.86379 4.69814 6.86379 4.30186 6.58773 4.25372L6.04437 4.15896C5.9405 4.14085 5.85915 4.0595 5.84104 3.95563L5.74628 3.41227Z"
                              fill="url(#paint2_linear_350_1297)"
                            />
                          </g>
                          <defs>
                            <linearGradient
                              id="paint0_linear_350_1297"
                              x1="8.5"
                              y1="13.5"
                              x2="8.5"
                              y2="2.5"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#592582" />
                              <stop offset="1" stopColor="#6965ED" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_350_1297"
                              x1="4"
                              y1="14.2"
                              x2="4"
                              y2="8.33333"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#592582" />
                              <stop offset="1" stopColor="#6965ED" />
                            </linearGradient>
                            <linearGradient
                              id="paint2_linear_350_1297"
                              x1="5.5"
                              y1="6.5"
                              x2="5.5"
                              y2="2.83333"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#592582" />
                              <stop offset="1" stopColor="#6965ED" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>

                    {error && (
                      <p className="text-red-500 text-[10px] xs:text-xs sm:text-sm mt-2">
                        {error}
                      </p>
                    )}
                    {processingStatus && (
                      <p className="text-blue-500 text-[10px] xs:text-xs sm:text-sm mt-2">
                        {processingStatus}
                      </p>
                    )}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between items-center text-white pt-4 xs:pt-6 sm:pt-8 mt-auto">
                    <button 
                      className={`font-inter font-normal text-[10px] xs:text-xs sm:text-sm leading-[0.875rem] xs:leading-[1rem] sm:leading-[1.0625rem] ${
                        isSubmitting ? 'text-gray-500 cursor-not-allowed opacity-60' : 'text-white cursor-pointer'
                      }`}
                      onClick={() => navigate('/profile/industry')}
                      disabled={isSubmitting}
                    >
                      Back
                    </button>
                    
                    <button 
                      className={`font-inter font-medium inline-flex justify-center items-center rounded text-[10px] xs:text-xs sm:text-sm w-16 xs:w-20 sm:w-[6.4375rem] h-7 xs:h-8 sm:h-[2.1875rem] px-3 xs:px-4 sm:px-5 py-1 xs:py-1.5 sm:py-2 ${
                        isSubmitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-white cursor-pointer'
                      } text-black`}
                      onClick={handleFinish}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 border-2 border-gray-600 border-t-black rounded-full loading-spinner" />
                      ) : (
                        'Continue'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorsPitch;