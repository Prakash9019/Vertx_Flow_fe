import React, { useState,useEffect } from "react";
import Header from "../components/Header";
import Background from "../assets/Profile_background.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API_KEY from "../../key";
import { useStartupProfile } from "../context/StartupProfileContext";

function Profile_Manual_Page() {
  const { profileData, fetchProfileData } = useStartupProfile();

  const [accountName, setAccountName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [message, setMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
 
  const navigate = useNavigate();

  useEffect(() => {
    if (profileData?.companyName) setCompanyName(profileData.companyName);
    if (profileData?.companyWebsite) setCompanyWebsite(profileData.companyWebsite);
    if (profileData?.accountName) setAccountName(profileData.accountName);
  }, [profileData]);
  
  
  const handleCreateProfile = async () => {
    if (companyName && accountName && companyWebsite) {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(API_KEY + "/api/profile/manual", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            accountName,
            companyName,
            companyWebsite
          })
        });
  
        if (!res.ok) throw new Error("Failed to create profile");
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
    <div
      className="min-h-screen text-white bg-black bg-cover bg-top bg-no-repeat p-4 sm:p-6 md:p-9"
      //   style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black to-violet-950 opacity-65 z-0"></div>
      <div className="relative z-10">
        <Header />

        {/* Success Notification Popup */}
        <div
          className={`fixed top-4 right-4 z-[100] transition-all duration-600 ease-in-out ${
            message ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <div className="max-w-xs sm:max-w-sm md:max-w-md whitespace-nowrap rounded-md border border-[#18152D] bg-black flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 shadow-lg">
            <span className="text-white font-inter text-sm sm:text-base font-medium">Profile created successfully!</span>
          </div>
        </div>

        {/* Error Notification Popup */}
        <div
          className={`fixed top-4 right-4 z-[100] transition-all duration-600 ease-in-out ${
            errorMessage ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <div className="max-w-xs sm:max-w-sm md:max-w-md whitespace-nowrap rounded-md border border-[#18152D] bg-black flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 shadow-lg">
            <span className="text-white font-inter text-sm sm:text-base font-medium">Failed to create profile.</span>
          </div>
        </div>

        {/* Centered Form */}
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="bg-opacity-60 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-lg">
            <div className="w-full sm:w-85 sm:mx-auto">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
                Enter Details to Create Account
              </h2>

              <div className="flex flex-col gap-6">
                <input
                  type="text"
                  value={accountName}
                  required
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Account full name"
                  className=" text-white border border-gray-700 py-3 px-4 rounded-md"
                />
                <input
                  type="text"
                  value={companyName}
                  required
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company name"
                  className="bg-black text-white border border-gray-700 py-4 px-4 rounded-md"
                />
                <input
                  type="text"
                  value={companyWebsite}
                  required
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  placeholder="Company website"
                  className="bg-black text-white border border-gray-700 py-3 px-4 rounded-md"
                />
              </div>

              <button
                onClick={handleCreateProfile}
                className="mt-6 w-full bg-white text-black font-semibold py-2.5 rounded hover:bg-gray-200 transition-all"
              >
                Create Flow Profile
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-400 text-center">
              Not interested in filling your profile manually?{" "}
              <Link to="/profile" className="text-white hover:underline">
                Autofill using LinkedIn
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile_Manual_Page;