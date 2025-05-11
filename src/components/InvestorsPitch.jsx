// LocationSetup.jsx
import React,{useState} from "react";
import logo from "../assets/ProfileImg.svg";
import SignOut from "../assets/logout.svg";
import RightIcon from "../assets/RightTick.svg"; 
import { useNavigate, useLocation } from "react-router-dom";
import countries from "../data/countries.json";
import Dropdown from "./Dropdown";
import Ellipse from "../assets/EllipseAI.svg";
import StarOne from "../assets/Star.svg";
import axios from "axios";

const InvestorsPitch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedStage = location.state?.selectedStage || 'Not selected';
  const selectedCountry = location.state?.selectedCountry || 'Not selected';
  const selectedAmount = location.state?.selectedAmount || 'Not selected';
  const selectedRevenue = location.state?.selectedRevenue || 'Not selected';
  // const selectedIndustry = location.state?.selectedIndustry || 'Not selected';
  const [pitch, setPitch] = useState("");
  const [error, setError] = useState("");

  const [selectedIndustry, setSelectedIndustry] = useState(null);

  // const handleContinue = () => {
  //   navigate('/homepage', { state: { selectedStage, selectedIndustry } });
  // };

  const handleContinue = async () => {
    if (!selectedAmount) {
      setError("Please select the amount you're looking to raise before continuing.");
      return;
    }
    try {
      await axios.post('http://localhost:5009/api/startup', { userId: 'your-unique-user-id',stage: selectedStage, location: selectedCountry, raise: selectedAmount, revenue: selectedRevenue, industry: selectedIndustry, pitch });
      navigate('/homepage', { state: { selectedStage, selectedCountry, selectedAmount, selectedRevenue, selectedIndustry, pitch } });
    } catch (error) {
      console.error("Error saving data:", error);
      setError("Failed to save data. Please try again.");
    }
  };

  return (
    <div className="w-[1580px] h-[832px] bg-gradient-to-b from-[#0F0C29] via-[#08080d] to-[#0b0b3f] text-white flex flex-col items-center justify-center p-6">
      <div className="absolute top-11 left-16 text-2xl font-bold flex items-center space-x-2">
        <img
          src={logo}
          alt="Profile logo"
          className="w-[50px] h-[48px] object-contain"
        />
        <span className="absolute top-[20px] left-[60px] text-[28px] leading-[100%] tracking-[0%] font-inter font-semibold text-white w-[122px] h-[28px]">
          VERTX
        </span>
      </div>

      <div className="absolute top-[59px] left-[1133px] ml-60 flex items-center space-x-2 cursor-pointer">
        <span className="w-[56px] h-[17px] font-inter font-medium text-[14px] leading-[100%] text-white">
          Sign out
        </span>
        <img src={SignOut} alt="Sign out" className="h-[24px] w-[24px]" />
      </div>

      <div className="absolute w-[572px] h-[54px] top-[170px] left-[340px] mr-80 text-white space-y-3">
        <h2 className="w-[279px] h-[23px] font-inter font-semibold text-[20px] leading-[100%] tracking-[0%]">
          Tell us about your startup
        </h2>
        <p className="w-[572px] h-[18px] font-inter font-normal text-[14px] leading-[100%] tracking-[0%] mt-[5px]">
          Investors do have geographic preferences. This helps us to match with the right investor.
        </p>
      </div>

      <div className="relative w-[720px] h-[362px] mt-[15px] mr-[180px] gradient-border rounded-[10px] bg-black text-white p-8">
      <div className="flex justify-between items-center mb-6 gap-7">
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
          {step === 1 || step === 2 || step === 3 || step === 4 || step === 5 ? (
            <img src={RightIcon} alt="Tick" className="w-4 h-4 object-contain" />
          ) : (
            step
          )}
        </div>
        <span className="text-[12px] text-gray-300">{label}</span>
      </div>

      {/* Show purple line between all steps except the last one */}
      {index < 5 && (
        <div className="relative w-[40px] h-[1px] bg-[#6C2BD9] mt-[-20px]">
          <div className="absolute left-[-20px] right-[-20px] h-full bg-[#6C2BD9]"></div>
        </div>
      )}
    </React.Fragment>
  ))}
</div>

        {/* <div className="flex justify-between items-center mb-6">
          {[
            {
              step: (
                <img
                  src={RightIcon}
                  alt="Step 1"
                  className="w-8 h-8 object-contain"
                />
              ),
              label: "Stage",
            },
            { step: 2, label: "Location" },
            { step: 3, label: "Raise" },
            { step: 4, label: "Revenue" },
            { step: 5, label: "Industry" },
            { step: 6, label: "Pitch" },
          ].map(({ step, label }) => (
            <div key={label} className="flex flex-col items-center space-y-1">
              <div className="w-8 h-8 rounded-full bg-[#6C2BD9] text-white flex items-center justify-center text-sm font-bold">
                {step}
              </div>
              <span className="text-[12px] text-gray-300">{label}</span>
            </div>
          ))}
        </div> */}

        {/* Form Card */}
        <label className="block text-sm font-medium mb-2">
           Your startup’s elevator pitch
        </label>
        <p className="text-xs text-gray-400 mb-4">
           Give investors a concise overview of your value proposition. You can enhance it.
        </p>

        {/* Custom Dropdown for Countries */}
        <div className="relative w-[650px] h-[92px] mt-[20px]">
  <input
    type="text"
    placeholder="Write here..."
    className="w-full h-full border border-[#B8B8B821] rounded-[5px] px-4 bg-[#1a1a1a] text-white placeholder-gray-400 outline-none"
  />

  {/* Container for multiple icons on the right */}
  {/* <div className="top-[65px] right-4 -translate-y-1/2 flex items-center space-x-2"> */}
    <img
      src={Ellipse}
      alt="Ellipse"
      className="w-7 h-[25px] bg-gradient-to-t from-[#592582] to-[#6965ED] rounded-full ml-[610px] mt-[-30px]"
    />
    <img
      src={StarOne}
      alt="Star"
      className="w-4 h-4 ml-[616px] mt-[-20px]"
    />
  {/* </div> */}
</div>


        {/* <input
            type="text"
            placeholder="Write here..."
            className="absolute w-[650px] h-[92px] top-[180px] left-[3    0px] border border-[#B8B8B821] rounded-[5px] px-4 bg-[#1a1a1a] text-white placeholder-gray-400 outline-none"
        /> */}

        {/* <label htmlFor="startup-select" className="block text-sm font-medium mb-1">
          Select
        </label> */}
        {/* <select
          id="startup-select"
          className="block w-[320px] h-[36px] px-3 py-1 text-sm overflow-y-auto font-medium text-black rounded-md focus:outline-none border border-[#B8B8B821]"
          defaultValue="Select" // Default value
          onChange={(e) => {
            console.log("Selected country:", e.target.value);
          }}
        >
          <option value="Select" disabled>Select</option>
          {countries.map((country, index) => (
            <option key={index} value={country.name}>
              {country.name}
            </option>
          ))}
        </select> */}

        {/* Select Section with absolute positioning converted to Tailwind */}


        <div className="absolute flex justify-between items-center w-[630px] mt-[26.5px]"> 
            {/* Back Button */}
                <button className="relative w-[33px] h-[17px] font-inter font-normal text-[14px] leading-[100%] text-white" onClick={() => navigate("/industry-select")}>
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

export default InvestorsPitch;
