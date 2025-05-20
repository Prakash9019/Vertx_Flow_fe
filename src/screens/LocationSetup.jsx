//Locationsetup duplicate

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStartupProfile } from "../context/StartupProfileContext";
import Header from "../components/Header";
import ProfileProgressBar from "../components/ProfileProgressBar";

const LocationSetup = () => {
  const navigate = useNavigate();
  const { startupData, updateStartupField, error, setError, loadingData } = useStartupProfile();
  const [currentLocation, setCurrentLocation] = useState("");

  useEffect(() => {
    setCurrentLocation(startupData.location || "");
  }, [startupData.location]);

  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    setCurrentLocation(newLocation);
    updateStartupField('location', newLocation);
    setError(null);
  };

  const handleContinue = () => {
    if (!currentLocation.trim()) {
      setError("Please enter your startup's location.");
      return;
    }
    setError(null);
    navigate("/profile/raise");
  };

  const handleBack = () => {
    navigate("/profile/setup");
  };

  if (loadingData && !startupData.stage) {
     return <div className="w-screen h-screen flex justify-center items-center bg-black text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-white bg-[#150718] bg-cover bg-top bg-no-repeat p-4 sm:p-6 md:p-9">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#150718] via-[#1C001E] via-[#14006E] to-[#14006E] opacity-100 z-0"></div>
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
                  height: 'calc(100% )',
                  padding: '2rem',
                  paddingTop: '2.5rem'
                }}
              >
                <div style={{ boxSizing: 'border-box', width: '100%' }}>
                  <ProfileProgressBar currentStep={1} />
                </div>

                <div style={{ color: '#FFFFFF', marginTop: '1.5rem' }}>
                  <label htmlFor="location-input" className="block font-inter font-semibold" style={{ fontSize: '0.875rem', lineHeight: '1.0625rem', marginBottom: '0.5rem' }}>
                    Where is your startup based?
                  </label>
                  <p className="font-inter font-normal text-xs" style={{ fontSize: '0.75rem', lineHeight: '0.9375rem', marginBottom: '2.0rem' }}>
                    Investors do have geographic preferences. This helps us to match with the right investor
                  </p>
                  <input
                    type="text"
                    id="location-input"
                    value={currentLocation}
                    onChange={handleLocationChange}
                    placeholder="City, Country"
                    className="focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ 
                      width: '20rem', 
                      height: '2.439rem', 
                      background: '#0F0E16', 
                      border: '1px solid rgba(184, 184, 184, 0.13)', 
                      borderRadius: '0.1875rem',
                      padding: '0 0.9375rem',
                      fontSize: '0.75rem',
                      color: '#FFFFFF'
                    }}
                  />
                  {error && <p className="text-red-500 text-sm" style={{ marginTop: '0.5rem', width: '20rem' }}>{error}</p>}
                </div>

                <div className="flex justify-between items-center w-full" style={{ color: '#FFFFFF', marginTop: 'auto', paddingTop: '2rem', paddingBottom: '1.25rem' }}>
                  <button 
                    className="font-inter font-normal" 
                    onClick={handleBack} 
                    style={{ fontSize: '0.875rem', lineHeight: '1.0625rem', color: '#FFF' }}
                  >
                    Back
                  </button>
                  <button 
                    className="font-inter font-medium" 
                    onClick={handleContinue} 
                    style={{ 
                      display: 'inline-flex',
                      padding: '0.53125rem 1.21875rem 0.65625rem 1.21875rem',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '0.25rem',
                      background: '#FFFFFF', 
                      color: '#000', 
                      fontSize: '0.875rem', 
                      fontWeight: 500, 
                    }}
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

export default LocationSetup;
