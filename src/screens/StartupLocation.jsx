// Vertx_Flow_fe/src/screens/StartupLocation.jsx
import React, { useEffect } from "react"; // Added useEffect
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // Assuming Header is used or remove if not
import { useStartupProfile } from "../context/StartupProfileContext";
// import logo from "../assets/ProfileImg.svg"; // Remove if Header handles logo
// import SignOut from "../assets/logout.svg"; // Remove if Header handles signout

const StartupLocation = () => { // Renamed to PascalCase for consistency
  const navigate = useNavigate();
  const { startupData, loadingData, error, setError } = useStartupProfile();

  const selectedStage = startupData.stage || 'Not specified';

  const handleContinue = () => {
    navigate('/profile/location'); // Navigate to LocationSetup (main input for location)
  };

  const handleBack = () => {
    navigate('/profile/setup'); // Navigate back to ProfileSetup (main input for stage)
  };

  useEffect(() => {
    setError(null); // Clear any errors when viewing this confirmation page
  }, [setError]);

  if (loadingData && !startupData.pitch) { // Generic loading check
     return <div className="min-h-screen flex justify-center items-center bg-black text-white">Loading...</div>;
  }

  // Keeping a similar structure to your original for display
  return (
       <div className="min-h-screen text-white bg-black p-6 md:p-9">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950 opacity-65 z-0"></div>
          <div className="relative z-10">
            <Header /> {/* Using consistent Header */}
            <div className="max-w-2xl mx-auto mt-10">
                <h2 className="text-3xl font-semibold mb-2 text-center">
                    Confirm Startup Stage
                </h2>
                <p className="text-center text-gray-400 mb-8">
                    You have selected the following stage for your startup.
                </p>
                <div className="bg-[#0E0E11] p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700">
                    {/* Visual Step Indicators */}
                    <div className="flex justify-around items-center mb-8 text-xs">
                        {['Stage', 'Location', 'Raise', 'Revenue', 'Industry', 'Pitch'].map((stepLabel, index) => (
                            <div key={stepLabel} className={`flex flex-col items-center ${index <= 0 ? 'text-purple-400' : 'text-gray-500'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${index <= 0 ? 'bg-purple-500 border-purple-500' : 'border-gray-500'}`}>
                                {index + 1}
                            </div>
                            <span>{stepLabel}</span>
                            </div>
                        ))}
                    </div>
                    <label className="block text-lg font-medium text-gray-200 mb-2">
                        Selected Stage:
                    </label>
                    <div className="mt-2 text-left ">
                        <span className="inline-flex items-center px-4 py-2 text-lg font-semibold bg-purple-600 text-white rounded-md">
                        {selectedStage}
                        {/* Remove the "x" button unless you add functionality to clear and go back via context */}
                        </span>
                    </div>
                     {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

                    <div className="mt-8 flex justify-between items-center">
                        <button 
                            onClick={handleBack}
                            className="px-6 py-2.5 text-sm font-semibold rounded-md border-2 border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white transition-colors"
                        >
                           Edit Stage
                        </button>
                        <button 
                            onClick={handleContinue}
                            className="px-8 py-2.5 text-sm font-semibold rounded-md bg-white text-black hover:bg-gray-300 active:bg-gray-400 transition-colors"
                        >
                           Confirm & Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default StartupLocation;