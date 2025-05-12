import React, {useState} from "react";
import logo from "../assets/ProfileImg.svg";
import SignOut from "../assets/logout.svg";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");


  // const handleContinue = () => {
  //   if (!stage) {
  //     setError("Please select your startup stage before continuing.");
  //     return;
  //   }
  //   navigate('/Startup', { state: { selectedStage: stage } });
  // };
    // setError("");
    // navigate("/Startup");

   // For backend part 
    const handleContinue = async () => {
      if (!stage) {
        setError("Please select your startup stage before continuing.");
        return;
      }
      try {
        // Update the URL to point to the new port
        const userId = 'your-unique-user-id';
        await axios.post('http://localhost:5009/api/startup', { userId,stage });
        navigate('/Startup', { state: { selectedStage: stage } });
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
         <div className="flex justify-between items-center mb-6">
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
        </div>

        {/* <div className="flex justify-between items-center mb-6">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className="w-8 h-8 rounded-full bg-[#6C2BD9] text-white flex items-center justify-center text-sm font-bold"
            >
              {step}
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

          <select 
          value={stage} 
          onChange={(e) => setStage(e.target.value)}
          className="w-[320px] p-2 bg-[#1e1e1e] border border-gray-600 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option value="" disabled>Select your stage</option>
            <option value="Pre-Seed">Pre-Seed</option>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
            <option value="Series B">Series B</option>
            <option value="Series B+">Series B+</option>
            <option value="Pre-IPO">Pre-IPO</option>
          </select>

           {/* Error Message */}
           {/* <div className="h-6"> */}
           {error && <p className="absolute text-red-500 text-sm mt-2">{error}</p>}
           {/* </div> */}
           
          {/* Navigation Buttons */}

          <div className="absolute flex justify-between items-center w-[630px] mt-[85px]"> {/* Use w-full to take full width */}
            {/* Back Button */}
            <button className="relative w-[33px] h-[17px] font-inter font-normal text-[14px] leading-[100%] text-white" onClick={() => navigate("/")}>
             Back
            </button>

            {/* Continue Button */}
            <button className="w-[100px] h-[36px] font-inter text-[14px] font-medium bg-white text-black rounded-[4px] ml-auto" onClick={handleContinue}>
             Continue
            </button>
         </div>
        </div>
      </div>
    // </div>
  );
};

export default ProfileSetup;





// <div className="absolute flex justify-between items-center  space-y-16">

// <button className="relative w-[33px] h-[17px] mt-16 font-inter font-normal text-[14px] leading-[100%] text-white">
//     Back
// </button>


// <button className="w-[100px] h-[36px] ml-[500px] font-inter text-[14px] font-medium bg-white text-black rounded-[4px]" onClick={handleContinue}>
//     Continue
// </button>
// </div>onClick={() => navigate("/")}