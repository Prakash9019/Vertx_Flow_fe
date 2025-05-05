import React, { useState } from "react";
import Background from "../assets/Profile_background.png";
import Header from "../components/Header";
import { FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

function ProfileSetup_page() {
  const [linkedinProfile, setLinkedinProfile] = useState("");

  const handleInputChange = (e) => {
    setLinkedinProfile("https://www.linkedin.com/in/" + e.target.value);
  };

  return (
    <div
      className="relative min-h-screen text-white bg-black bg-cover bg-top bg-no-repeat px-4 py-6 sm:px-6 md:px-10 lg:px-16"
      //   style={{
      //     backgroundImage: `url(${Background})`,
      //   }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-violet-950 opacity-65 z-0"></div>

      {/* Content */}
      <div className="relative z-10">
        <Header />

        {/* Centered Form */}
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="bg-black bg-opacity-60 p-6 sm:p-8 rounded-lg w-full sm:max-w-[63%]  xl:max-w-[43%] shadow-lg">
            <div className="flex justify-between">
              <h2 className="text-2xl sm:text-3xl font-semibold flex items-center gap-3 mb-4">
                Enter your LinkedIn URL
              </h2>
              <FaLinkedin className="text-white text-3xl mt-1" />
            </div>
            <p className="text-sm text-gray-400 mb-5">
              We use your LinkedIn to autofill your profile, giving you a better
              and faster experience while saving your time.
            </p>

            <div className="flex items-center w-full border border-gray-700 rounded-md text-white overflow-hidden">
              <span className="pl-3 py-2 text-sm whitespace-nowrap select-none">
                https://www.linkedin.com/in/
              </span>
              <input
                type="text"
                onChange={handleInputChange}
                placeholder="profilename"
                className="flex-1 pr-4 py-2 bg-transparent text-white text-sm outline-none"
              />
            </div>

            <button className="mt-5 w-full text-sm sm:text-base bg-white text-black font-semibold py-2.5 rounded hover:bg-gray-200 transition-all">
              Create Flow Profile
            </button>

            <p className="mt-4 text-xs sm:text-sm text-gray-400">
              Not interested in sharing your LinkedIn profile URL?{" "}
              <span className="block lg:inline">
                <Link
                  to="/profile/manual"
                  className="text-white hover:underline"
                >
                  Fill it manually instead
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup_page;
