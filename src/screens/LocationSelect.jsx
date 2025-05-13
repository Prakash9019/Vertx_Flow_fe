
import React, { useState } from "react";
import logo from "../assets/ProfileImg.svg";
import SignOut from "../assets/logout.svg";
import { useNavigate, useLocation } from "react-router-dom";
import RightIcon from "../assets/RightTick.svg";
import axios from "axios";

const SelectLocation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCountry = location.state?.selectedCountry || 'Not selected';
  const selectedStage = location.state?.selectedStage || 'Not selected';
  const [error, setError] =useState("");

  // const handleContinue = () => {
  //   navigate('/raise', { state: { selectedCountry } });
  // };

  const handleContinue = async () => {
    if (!selectedCountry) {
      setError("Please select your startup location before continuing.");
      return;
    }
    try {
      await axios.post('http://localhost:5009/api/startup', { userId: 'your-unique-user-id',stage: selectedStage, location: selectedCountry });
      navigate('/raise', { state: { selectedStage, selectedCountry } });
    } catch (error) {
      console.error("Error saving data:", error);
      setError("Failed to save data. Please try again.");
    }
  };
  

  return (

       <div className="w-[1580px] h-[832px] bg-gradient-to-b from-[#0F0C29] via-[#08080d] to-[#0b0b3f] text-white flex flex-col items-center justify-center p-6">
          <div className="absolute top-11 left-16 text-2xl font-bold flex items-center space-x-2">
          <img src={logo} alt="Profile logo" className="w-[50px] h-[48px] top-[41px] left-[49px] object-contain" /> {/* Replace with logo if needed */}
          <span className="absolute top-[20px] left-[60px] text-[28px] leading-[100%] tracking-[0%] font-inter font-semibold text-white w-[122px] h-[28px]">VERTX</span>
          </div>
    
          <div className="absolute top-[59px] left-[1133px] ml-60 flex items-center space-x-2 cursor-pointer">
             <span className="w-[56px] h-[17px] font-inter font-medium text-[14px] leading-[100%] text-white">
                Sign out
             </span>
              <img src={SignOut} alt="Sign out" className="h-[24px] w-[24px]" />
          </div>
    
    
          {/* <div className="bg-black bg-opacity-70 border border-gray-700 p-8 rounded-xl shadow-xl w-full max-w-xl mt-24"> */}
          <div className="absolute w-[572px] h-[54px] top-[170px] left-[340px] mr-80 text-white space-y-3">
            <h2
                className="w-[279px] h-[23px] font-inter font-semibold text-[20px] leading-[100%] tracking-[0%]"
            >
                Tell us about your startup
            </h2>
            <p
                className="w-[572px] h-[18px] font-inter font-normal text-[14px] leading-[100%] tracking-[0%] mt-[5px]"
            >
                We’ll use this information to match you with the right investors for your specific needs.
            </p>
            </div>
    
            {/* <h2 className="text-xl md:text-2xl font-semibold mb-2">
              Tell us about your startup
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              We’ll use this information to match you with the right investors for your specific needs.
            </p> */}
    
            {/* Step Indicators */}
            {/* <div className="bg-black bg-opacity-70 border border-gray-700 p-8 rounded-xl shadow-xl w-full max-w-xl mt-24"> */}
    
            <div className="relative w-[720px] h-[362px] mt-[15px] mr-[180px] gradient-border rounded-[10px] bg-black text-white p-8">
            <div className="flex justify-center items-center mb-6 gap-7">
  {[
    { step: 1, label: "Stage" },
    { step: 2, label: "Location" },
    { step: 3, label: "Raise" },
    { step: 4, label: "Revenue" },
    { step: 5, label: "Industry" },
    { step: 6, label: "Pitch" },
  ].map(({ step, label }, index) => (
    <React.Fragment key={label}>
      <div className="flex flex-col items-center space-y-1">
        <div className="w-8 h-8 rounded-full bg-[#6C2BD9] text-white flex items-center justify-center text-sm font-bold">
          {step === 1 ? (
            <img src={RightIcon} alt="Tick" className="w-4 h-4 object-contain" />
          ) : (
            step
          )}
        </div>
        <span className="text-[12px] text-gray-300">{label}</span>
      </div>

      {/* Show purple line ONLY after Step 1 */}
      {index === 0 && (
        <div className="relative w-[40px] h-[1px] bg-[#6C2BD9] mt-[-20px]">
          <div className="absolute left-[-20px] right-[-20px] h-full bg-[#6C2BD9]"></div>
        </div>
      )}

      {/* Invisible spacing after other steps to maintain layout */}
      {index > 0 && index < 5 && (
        <div className="w-[40px] h-[1px] mt-[-20px] invisible"></div>
      )}
    </React.Fragment>
  ))}
</div>

             {/* <div className="flex justify-between items-center mb-6">
                {[
                    { step: 1, label: "Stage" },
                    { step: 2, label: "Location" },
                    { step: 3, label: "Raise" },
                    { step: 4, label: "Revenue" },
                    { step: 5, label: "Industry" },
                    { step: 6, label: "Pitch" }
                   ].map(({ step, label }) => (
                    <div key={step} className="flex flex-col items-center space-y-1">
                    <div className="w-8 h-8 rounded-full bg-[#6C2BD9] text-white flex items-center justify-center text-sm font-bold">
                        {step}
                    </div>
                    <span className="text-[12px] text-gray-300">{label}</span>
                    </div>
                 ))}
            </div> */}
    
            {/* Form Card */}
            {/* <div className="bg-[#0e0e0e] border border-gray-700 p-6 rounded-lg"> */}
              <label className="block text-sm font-medium mb-2">
                What stage is your startup at?
              </label>
              <p className="text-xs text-gray-400 mb-4">
                This helps us to match you with the investors who focus on your stage.
              </p>



            {/* Selected Stage */}
            <div className="mt-4 text-left ">
            <h3 className="text-[16px] font-semibold">Currently Selected:</h3>
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium gradient-bg text-white mt-2 gradient-badge">
              {selectedCountry}
              <button className="text-white hover:text-red-400 text-lg leading-none focus:outline-none ml-6">×</button>
            </span>
            {/* <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-[#6C2BD9] text-white mt-2">
                {selectedCountry}
            </span> */}
            </div>


            <div className="absolute flex justify-between items-center w-[630px] mt-[62.5px]"> {/* Use w-full to take full width */}
            {/* Back Button */}
                <button className="relative w-[33px] h-[17px] font-inter font-normal text-[14px] leading-[100%] text-white" onClick={() => navigate("/location")}>
                   Back
                </button>

            {/* Continue Button */}
                <button className="w-[100px] h-[36px] font-inter text-[14px] font-medium bg-white text-black rounded-[4px] ml-auto" onClick={handleContinue}>
                   Continue
                </button>
            </div>
         </div>
     </div>
  );
};

export default SelectLocation;