import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import Background from "../assets/Profile_background.png";

function Usage_Page() {
  const [selected, setSelected] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const options = [
    "Investor database",
    "Investor matching",
    "Automated Outreach",
    "Investor pipelines",
    "Pitch deck generation",
    "Pitch deck analysis",
    "Pitch practice",
    "Mock Fundraise",
    "Explore everything",
  ];

  const navigate = useNavigate();

  const toggleOption = (option) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const toggleRole = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    console.log("Selected options:", selected);
    console.log("Selected Role:", selectedRole);
    if (selected.length === 0 && !selectedRole) {
      navigate("/");
      alert("Select a role and options");
    } else {
      navigate("/Usage_Page");
    }
  };

  return (
    <div className="min-h-screen text-white bg-black bg-cover bg-top bg-no-repeat p-4 sm:p-6 md:p-9">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950 opacity-65 z-0"></div>
      <div className="relative z-10">
        <Header />
        {/* body  */}
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="px-4 sm:px-0 sm:w-3/4 xl:w-1/2 text-white">
            <h5 className="text-2xl font-semibold mb-2">
              Help us tailor your Vertx trial
            </h5>
            <p>This will help us give you better experience</p>
            <div>
              <p className="mb-5 mt-9">
                I am a
                <button
                  onClick={() => toggleRole("Founder")}
                  className={`ml-2 mr-1 px-4 py-1 rounded-md border border-purple-950 text-white bg-cover bg-center ${
                    selectedRole === "Founder" ? "" : "bg-black"
                  }`}
                  style={{
                    backgroundImage:
                      selectedRole === "Founder"
                        ? `url(${Background})`
                        : "none",
                  }}
                >
                  Founder
                </button>
                <button
                  onClick={() => toggleRole("Investor")}
                  className={`mr-2 ml-1 px-4 py-1 rounded-md border border-purple-950 text-white bg-cover bg-center ${
                    selectedRole === "Investor" ? "" : "bg-black"
                  }`}
                  style={{
                    backgroundImage:
                      selectedRole === "Investor"
                        ? `url(${Background})`
                        : "none",
                  }}
                >
                  Investor
                </button>
                <span className="block sm:inline">
                  and I wanted to get started with
                </span>
              </p>

              <div className="flex flex-wrap gap-2 w-full  xl:w-3xl">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleOption(option)}
                    className={`px-4 py-1 rounded border border-purple-950 bg-cover bg-center ${
                      selected.includes(option)
                        ? "text-white"
                        : "bg-black text-white "
                    }`}
                    style={{
                      backgroundImage: selected.includes(option)
                        ? `url(${Background})`
                        : "none",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleContinue}
              className="mt-9 px-5 py-2 font-semibold rounded-md bg-white text-black"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usage_Page;
