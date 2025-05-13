// Vertx_Flow_fe/src/screens/RevenueSelected.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useStartupProfile } from "../context/StartupProfileContext";

const RevenueSelected = () => {
  const navigate = useNavigate();
  const { startupData, loadingData, error, setError } = useStartupProfile();

  const selectedRevenue = startupData.revenue || 'Not specified';

  const handleContinue = () => {
    navigate('/profile/industry'); // Navigate to InvestorsIndustry (main input for industry)
  };

  const handleBack = () => {
    navigate('/profile/revenue'); // Navigate back to RevenueStatus (main input for revenue)
  };

  useEffect(() => {
    setError(null);
  }, [setError]);

  if (loadingData && !startupData.stage) {
     return <div className="min-h-screen flex justify-center items-center bg-black text-white">Loading...</div>;
  }

  return (
       <div className="min-h-screen text-white bg-black p-6 md:p-9">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950 opacity-65 z-0"></div>
          <div className="relative z-10">
            <Header />
            <div className="max-w-2xl mx-auto mt-10">
                <h2 className="text-3xl font-semibold mb-2 text-center">
                    Confirm Revenue Status
                </h2>
                <p className="text-center text-gray-400 mb-8">
                    You have selected the following revenue status.
                </p>
                <div className="bg-[#0E0E11] p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700">
                    <div className="flex justify-around items-center mb-8 text-xs">
                        {['Stage', 'Location', 'Raise', 'Revenue', 'Industry', 'Pitch'].map((stepLabel, index) => (
                            <div key={stepLabel} className={`flex flex-col items-center ${index <= 3 ? 'text-purple-400' : 'text-gray-500'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${index <= 3 ? 'bg-purple-500 border-purple-500' : 'border-gray-500'}`}>
                                {index + 1}
                            </div>
                            <span>{stepLabel}</span>
                            </div>
                        ))}
                    </div>
                    <label className="block text-lg font-medium text-gray-200 mb-2">
                        Selected Revenue (MRR):
                    </label>
                    <div className="mt-2 text-left ">
                        <span className="inline-flex items-center px-4 py-2 text-lg font-semibold bg-purple-600 text-white rounded-md">
                        {selectedRevenue}
                        </span>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                    <div className="mt-8 flex justify-between items-center">
                        <button 
                            onClick={handleBack}
                            className="px-6 py-2.5 text-sm font-semibold rounded-md border-2 border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white transition-colors"
                        >
                           Edit Revenue
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

export default RevenueSelected;