// Vertx_Flow_fe/src/screens/RaiseSelected.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStartupProfile } from "../context/StartupProfileContext";
import logo from "../assets/ProfileImg.svg";
import SignOut from "../assets/logout.svg";
import RightIcon from "../assets/RightTick.svg";

const RaiseSelected = () => {
  const navigate = useNavigate();
  const { startupData, loadingData, error, setError } = useStartupProfile();
  const selectedAmount = startupData.raise || 'Not specified';

  const handleContinue = () => {
    navigate('/profile/revenue');
  };
  const handleBack = () => {
    navigate('/profile/raise');
  };
  useEffect(() => { setError(null); }, [setError]);

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

          <div className="absolute w-[572px] h-[54px] top-[170px] left-[calc(50%-572px/2-180px/2)] text-white space-y-3">
            <h2 className="font-inter font-semibold text-[20px] leading-[100%] tracking-[0%]">
                Confirm Fundraising Amount
            </h2>
            <p className="font-inter font-normal text-[14px] leading-[100%] tracking-[0%] mt-[5px]">
                You have selected the following fundraising amount.
            </p>
          </div>
          
          <div className="relative w-[720px] h-auto min-h-[362px] mt-[60px] gradient-border rounded-[10px] bg-black text-white p-8 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              {['Stage', 'Location', 'Raise', 'Revenue', 'Industry', 'Pitch'].map((stepLabel, index) => {
                const isActive = index <= 2;
                const isCompleted = index < 2;
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
            <label className="block text-sm font-medium mb-2">
                Selected Fundraising Amount:
            </label>
            <div className="mt-2 text-left ">
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium gradient-bg text-white mt-2 gradient-badge"> {/* Original class was gradient-badge, ensure this is defined or adjust */}
                    {selectedAmount}
                </span>
            </div>
            {error && <p className="text-red-500 text-sm mt-2 mb-2">{error}</p>}
            <div className="mt-auto pt-6 flex justify-between items-center w-full">
                <button className="font-inter font-normal text-[14px] leading-[100%] text-white" onClick={handleBack}>
                   Edit
                </button>
                <button className="w-[100px] h-[36px] font-inter text-[14px] font-medium bg-white text-black rounded-[4px]" onClick={handleContinue}>
                   Confirm & Continue
                </button>
            </div>
         </div>
     </div>
  );
};

export default RaiseSelected;