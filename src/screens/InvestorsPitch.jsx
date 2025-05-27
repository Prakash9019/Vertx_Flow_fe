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

  return (
    <div className="min-h-screen text-white bg-[#150718] bg-cover bg-top bg-no-repeat p-4 sm:p-6 md:p-9">
      <div className="absolute inset-0  bg-gradient-to-b from-black to-purple-950 opacity-65 z-0"></div>
      <div className="relative z-10">
        <Header />

        <div className="flex justify-center mt-12">
          <div className="relative" style={{ width: '80rem', height: 'auto' }}>
            <div style={{ width: '35.75rem', color: '#FFFFFF', marginBottom: '1.25rem', marginLeft: '19rem', marginRight: 'auto' }}>
              <h2 className="font-inter font-semibold" style={{ fontSize: '1.25rem', lineHeight: '1.5rem', marginBottom: '0.75rem', width: '17.4375rem', height: '1.4375rem' }}>Tell us about your startup</h2>
              <p className="font-inter font-normal" style={{ fontSize: '0.875rem', lineHeight: '1.0625rem', width: '35.75rem', height: '1.125rem' }}>We'll use this information to match you with the right investors for your specific needs.</p>
            </div>

            <div
              className="relative w-full max-w-2xl min-h-[22.625rem] mt-8 sm:mt-12 mx-auto"
              style={{
                position: 'relative',
                background: 'linear-gradient(224.28deg, #592582 18.6%, #6965ED 81.4%)',
                borderRadius: '0.625rem',
                padding: '0.125rem',
                width: '45rem',
                height: '22.625rem'
              }}
            >
              <div 
                className="w-full h-full flex flex-col" 
                style={{
                  background: 'black',
                  borderRadius: '0.625rem',
                  height: 'calc(100%)',
                  padding: '2rem',
                  paddingTop: '2.5rem'
                }}
              >
                <div style={{ boxSizing: 'border-box', width: '100%' }}>
                  <ProfileProgressBar currentStep={5} />
                </div>

                <div style={{ color: '#FFFFFF' }}>
                  <label className="block font-inter font-semibold" style={{ fontSize: '0.875rem', lineHeight: '1.0625rem', marginBottom: '0.5rem' }}>
                    Your startup's elevator pitch
                  </label>
                  <p className="font-inter font-normal text-xs" style={{ fontSize: '0.75rem', lineHeight: '0.9375rem', marginBottom: '1.25rem' }}>
                    Give investors a concise overview of your value proposition. You can enhance it.
                  </p>
                  <div style={{ width: '100%', position: 'relative' }}>
                    <textarea
                      id="pitch-textarea"
                      rows="6"
                      value={currentPitch}
                      onChange={handlePitchChange}
                      placeholder="Write here..."
                      className="w-full p-3"
                      maxLength={200}
                      style={{ 
                        width: '100%', 
                        height: '5.75rem', 
                        borderRadius: '0.3125rem', 
                        border: '1px solid rgba(184, 184, 184, 0.13)', 
                        background: '#0F0E16',
                        color: '#FFFFFF',
                        fontSize: '0.75rem',
                        fontWeight: 400,
                        fontFamily: 'Inter',
                        padding: '0.625rem 0.9375rem',
                        resize: 'none',
                        '::placeholder': { color: '#656565' }
                      }}
                    />
                    <div 
                      style={{ 
                        position: 'absolute', 
                        bottom: '0.625rem', 
                        right: '0.625rem',
                        width: '1.25rem',
                        height: '1.25rem',
                        borderRadius: '50%',
                        backgroundColor: '#000',
                        border: '0.5px solid #AD6FDE',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '0.3rem'
                      }}
                    >
                      <img 
                        src="../src/assets/AiLogo.svg" 
                        alt="icon" 
                        style={{ width: '1rem', height: '1rem', borderRadius: '50%', marginLeft: '0.1rem' }} 
                      />
                    </div>
                    <div style={{ 
                      position: 'absolute', 
                      width: '100%', 
                      textAlign: 'center', 
                      top: 'calc(100% + 0.5rem)'
                    }}>
                      {error && <p className="text-red-500" style={{ fontSize: '0.7rem' }}>{error}</p>}
                      {successMessage && <p className="text-green-500" style={{ fontSize: '0.7rem' }}>{successMessage}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center w-full" style={{ color: '#FFFFFF', marginTop: 'auto', paddingTop: '1rem', paddingBottom: '1.25rem' }}>
                  <button 
                    className="font-inter font-normal" 
                    onClick={handleBack}
                    disabled={isSubmitting} 
                    style={{ 
                      fontSize: '0.875rem', 
                      lineHeight: '1.0625rem', 
                      color: isSubmitting ? '#888' : '#FFF',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.6 : 1
                    }}
                  >
                    Back
                  </button>
                  <button 
                    className="font-inter font-medium"
                    onClick={handleFinish}
                    disabled={isSubmitting || !!successMessage}
                    style={{ 
                      display: 'inline-flex',
                      padding: '0.53125rem 1.21875rem 0.65625rem 1.21875rem',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '0.25rem',
                      background: isSubmitting ? '#ccc' : '#FFFFFF', 
                      color: '#000', 
                      fontSize: '0.875rem', 
                      fontWeight: 500,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      width: '6.4375rem',
                      height: '2.1875rem'
                    }}
                  >
                    {isSubmitting ? (
                      <div 
                        style={{
                          width: '1rem',
                          height: '1rem',
                          border: '2px solid #666',
                          borderTop: '2px solid #000',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}
                      />
                    ) : successMessage ? "Saved!" : "Continue"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default InvestorsPitch;