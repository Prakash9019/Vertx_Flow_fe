// LocationSetup.jsx
import React,{useState} from "react";
import logo from "../assets/ProfileImg.svg";
import SignOut from "../assets/logout.svg";
import RightIcon from "../assets/RightTick.svg"; 
import { useNavigate, useLocation } from "react-router-dom";
import countries from "../data/countries.json";
import Dropdown from "./Dropdown";
import MultiSelect from "./MultiSelectDropdown";
import axios from "axios";

const InvestorsIndustry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedStage = location.state?.selectedStage || 'Not selected';
  const selectedCountry = location.state?.selectedCountry || 'Not selected';
  const selectedAmount = location.state?.selectedAmount || 'Not selected';
  const selectedRevenue = location.state?.selectedRevenue || 'Not selected';
  // const selectedIndustry = location.state?.selectedIndustry || 'Not selected';
  const [selectedIndustry, setSelectedIndustry] = useState([]);
  const [error, setError] = useState("");

  // const handleContinue = () => {
  //   navigate('/industry-select', { state: { selectedStage, selectedIndustry } });
  // };

  const handleContinue = async () => {
    if (!selectedIndustry) {
      setError("Please select the amount you're looking to raise before continuing.");
      return;
    }
    try {
      await axios.post('http://localhost:5009/api/startup', { userId: 'your-unique-user-id',stage: selectedStage, location: selectedCountry, raise: selectedAmount, revenue: selectedRevenue, industry: selectedIndustry });
      navigate('/industry-select', { state: { selectedStage, selectedCountry, selectedAmount, selectedRevenue, selectedIndustry } });
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
        <div className="flex justify-center items-center mb-6 gap-7">
        {[
            { step: <img src={RightIcon} alt="Step 1" className="w-8 h-8 object-contain" />, label: "Stage" },
            { step: <img src={RightIcon} alt="Step 2" className="w-8 h-8 object-contain" />, label: "Location" },
            { step: <img src={RightIcon} alt="Step 3" className="w-8 h-8 object-contain" />, label: "Raise" },
            { step: <img src={RightIcon} alt="Step 4" className="w-8 h-8 object-contain" />, label: "Revenue" },
            { step: 5, label: "Industry" },
            { step: 6, label: "Pitch" },
        ].map(({ step, label }, index, arr) => (
            <React.Fragment key={label}>
            <div className="flex flex-col items-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-[#6C2BD9] text-white flex items-center justify-center text-sm font-bold">
                {step}
                </div>
                <span className="text-[12px] text-gray-300">{label}</span>
            </div>

            {/* Purple line only between steps 1 to 5 */}
            {index < arr.length - 1 && index < 4 && (
                <div className="relative w-[40px] h-[1px] bg-[#6C2BD9] mt-[-20px]">
                    <div className="absolute left-[-20px] right-[-20px] h-full bg-[#6C2BD9]"></div>
                </div>
            )}

            {/* Add invisible line for spacing after step 5 to match layout */}
            {index === 4 && (
                <div className="w-[40px] h-[1px] mt-[-20px] invisible"></div>
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
            <span className="">dd</span>
            { step: (
                <img
                  src={RightIcon}
                  alt="Step 2"
                  className="w-8 h-8 object-contain"
                />
              ), label: "Location" },
            { step: (
                <img
                  src={RightIcon}
                  alt="Step 3"
                  className="w-8 h-8 object-contain"
                />
              ), label: "Raise" },
            { step: (
                <img
                  src={RightIcon}
                  alt="Step 4"
                  className="w-8 h-8 object-contain"
                />
              ), label: "Revenue" },
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
           Which industry do you operate in?
        </label>
        <p className="text-xs text-gray-400 mb-4">
          Most investors specialize in specific industries. You can choose multiple.
        </p>

        {/* Custom Dropdown for Countries */}

        {/* const [selectedIndustries, setSelectedIndustries] = useState([]); */}

<MultiSelect
  options={["AI/ML", "SaaS", "FinTech", "HealtTech", "EdTech"]}
  selected={selectedIndustry}
  onSelect={setSelectedIndustry}
/>

        {/* <select
        value={selectedIndustry} 
        onChange={(e) => setSelectedIndustry(e.target.value)}
        className="w-[320px] p-2 bg-[#1e1e1e] border border-gray-600 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-600">
           <option value="" disabled>Select</option>
           <option value="AI/ML">AI/ML;</option>
           <option value="SaaS">SaaS</option>
           <option value="FinTech">FinTech</option>
           <option value="HealtTech">HealtTech</option>
           <option value="EdTech">EdTech</option>
           </select> */}
       


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


        <div className="absolute flex justify-between items-center w-[630px] mt-[86.5px]"> {/* Use w-full to take full width */}
            {/* Back Button */}
                <button className="relative w-[33px] h-[17px] font-inter font-normal text-[14px] leading-[100%] text-white" onClick={() => navigate("/revenue-select")}>
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

export default InvestorsIndustry;
