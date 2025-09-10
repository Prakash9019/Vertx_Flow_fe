import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API_KEY from "../../../key";
import { useStartupProfile } from "../../context/StartupProfileContext";

function Profile_Manual_Page() {
  const { profileData, fetchProfileData } = useStartupProfile();
  const [accountname, setAccountname] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [message, setMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (profileData?.companyName) setCompanyName(profileData.companyName);
    if (profileData?.companyWebsite) setCompanyWebsite(profileData.companyWebsite);
    if (profileData?.accountname) setAccountname(profileData.accountname);
  }, [profileData]);
  
  const handleCreateProfile = async () => {
    if (companyName && accountname && companyWebsite) {
      try {
        const token = localStorage.getItem("authToken");
        // console.log("Submitting to:", API_KEY + "/api/profile/manual");
        
        // Make sure we're using the right token format
        if (!token) {
          console.error("No auth token found!");
          setErrorMessage(true);
          setTimeout(() => setErrorMessage(false), 1000);
          return;
        }
        
        // console.log("Using token (first 20 chars):", token.substring(0, 20) + "...");
        // console.log("Data:", { accountname, companyName, companyWebsite });
        
        const res = await fetch(API_KEY + "/api/profile/manual", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            accountname,
            companyName,
            companyWebsite
          })
        });
  
        if (!res.ok) {
          console.error("Server responded with status:", res.status);
          let errorText = "";
          try {
            const errorData = await res.json();
            errorText = JSON.stringify(errorData);
            console.error("Error response:", errorText);
          } catch (e) {
            errorText = await res.text();
            console.error("Error response (text):", errorText);
          }
          throw new Error(`Failed to create profile: ${res.status}`);
        }
        
        const data = await res.json();
        // console.log("Profile created successfully:", data);
        
        await fetchProfileData();
        setMessage(true);
        setTimeout(() => {
          setMessage(false);
          navigate("/profile/stage");
        }, 1000);
  
      } catch (err) {
        console.error("Error creating profile:", err);
        setErrorMessage(true);
        setTimeout(() => setErrorMessage(false), 1000);
      }
    } else {
      setErrorMessage(true);
      setTimeout(() => setErrorMessage(false), 1000);
    }
  };

  return (
    <div className="min-h-screen text-white bg-black bg-cover bg-top bg-no-repeat p-4 sm:p-6 md:p-9">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-violet-950 opacity-65 z-0"></div>
      <div className="relative z-10">
        <Header />

        {/* Success Notification */}
        <div
          className={`fixed top-4 right-4 z-[100] transition-all duration-600 ease-in-out ${
            message ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <div className="max-w-[200px] sm:max-w-sm md:max-w-md rounded-md border border-[#18152D] bg-black flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 shadow-lg">
            <span className="text-white font-inter text-xs sm:text-sm md:text-base font-medium">Profile created successfully!</span>
          </div>
        </div>

        {/* Error Notification */}
        <div
          className={`fixed top-4 right-4 z-[100] transition-all duration-600 ease-in-out ${
            errorMessage ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <div className="max-w-[200px] sm:max-w-sm md:max-w-md rounded-md border border-[#18152D] bg-black flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 shadow-lg">
            <span className="text-white font-inter text-xs sm:text-sm md:text-base font-medium">Failed to create profile.</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-10rem)]">
          <div className="w-full max-w-[90%] sm:max-w-lg bg-opacity-60 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
            <div className="w-full">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 text-center sm:text-left">
                Enter Details to Create Account
              </h2>

              <div className="flex flex-col gap-4 sm:gap-6">
                <input
                  type="text"
                  value={accountname}
                  required
                  onChange={(e) => setAccountname(e.target.value)}
                  placeholder="Account full name"
                  className="w-full bg-black text-white border border-gray-700 py-2.5 sm:py-3 px-3 sm:px-4 rounded-md text-sm sm:text-base focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  value={companyName}
                  required
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company name"
                  className="w-full bg-black text-white border border-gray-700 py-2.5 sm:py-3 px-3 sm:px-4 rounded-md text-sm sm:text-base focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  value={companyWebsite}
                  required
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  placeholder="Company website"
                  className="w-full bg-black text-white border border-gray-700 py-2.5 sm:py-3 px-3 sm:px-4 rounded-md text-sm sm:text-base focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                onClick={handleCreateProfile}
                className="w-full mt-6 bg-white text-black font-semibold py-2.5 sm:py-3 rounded text-sm sm:text-base hover:bg-gray-200 transition-all"
              >
                Create Flow Profile
              </button>

              <p className="mt-4 text-xs sm:text-sm text-gray-400 text-center px-2 sm:px-0">
                Not interested in filling your profile manually?{" "}
                <Link to="/linkedin" className="text-white hover:underline">
                  Autofill using LinkedIn
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile_Manual_Page;