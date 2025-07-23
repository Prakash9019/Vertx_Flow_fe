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
    // console.log("Selected options:", selected);
    // console.log("Selected Role:", selectedRole);
    if (selected.length === 0 && !selectedRole) {
      navigate("/");
      alert("Select a role and options");
    } else {
      // Set onboarding flag so user is not sent back to /usage again
      localStorage.setItem('vertx_onboarding_role_complete', 'true');
      navigate("/addfounder");
    }
  };

  return (
    <div className="min-h-screen text-white bg-black bg-cover bg-top bg-no-repeat p-4 sm:p-6 md:p-9">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950 opacity-65 z-0"></div>
      <div className="relative z-10">
        <Header />
        {/* body  */}
        <div className="md:ml-[17rem] md:mt-[9.87rem] mt-8 ml-4">
          <div className="px-4 sm:px-0 sm:w-3/4 text-white">
            <h5 className="text-xl md:text-2xl font-semibold mb-2">
              Help us tailor your Vertx trial
            </h5>
            <p>This will help us give you better experience</p>
            <div>
              <p className="mb-5 mt-6 md:mt-9 flex flex-wrap md:block">
                <span className="mr-1">I am a</span>
                <button
                  onClick={() => toggleRole("Founder")}
                  className={`ml-0 md:ml-2 mr-1 px-3 md:px-4 py-1 border border-purple-950 text-white ${
                    selectedRole === "Founder" ? "" : "rounded-md bg-black"
                  }`}
                  style={
                    selectedRole === "Founder"
                      ? {
                          borderRadius: "0.25rem",
                          background:
                            "linear-gradient(260deg, rgba(0, 0, 0, 0.25) -22.9%, rgba(252, 65, 65, 0.25) 119.49%), linear-gradient(99deg, #000 -4%, #33005C 104%)",
                        }
                      : {}
                  }
                >
                  Founder
                </button>
                <button
                  onClick={() => toggleRole("Investor")}
                  className={`mr-2 ml-1 px-3 md:px-4 py-1 rounded-md border border-purple-950 text-white ${
                    selectedRole === "Investor" 
                      ? "" 
                      : "bg-black"
                  }`}
                  style={
                    selectedRole === "Investor"
                      ? {
                          borderRadius: "0.25rem",
                          background:
                            "linear-gradient(260deg, rgba(0, 0, 0, 0.25) -22.9%, rgba(252, 65, 65, 0.25) 119.49%), linear-gradient(99deg, #000 -4%, #33005C 104%)",
                        }
                      : {}
                  }
                >
                  Investor
                </button>
                <span className="block md:inline mt-2 md:mt-0">
                  and I wanted to get started with
                </span>
              </p>

              <div className="flex flex-wrap gap-2 w-full">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleOption(option)}
                    className={`px-3 md:px-4 py-1 rounded border border-purple-950 text-white ${
                      selected.includes(option)
                        ? ""
                        : "bg-black"
                    }`}
                    style={
                      selected.includes(option)
                        ? {
                            background:
                              "linear-gradient(260deg, rgba(0, 0, 0, 0.25) -22.9%, rgba(252, 65, 65, 0.25) 119.49%), linear-gradient(99deg, #000 -4%, #33005C 104%)",
                          }
                        : {}
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleContinue}
              className="mt-6 md:mt-9 px-4 md:px-5 py-1.5 md:py-2 font-semibold rounded-md bg-white text-black"
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
