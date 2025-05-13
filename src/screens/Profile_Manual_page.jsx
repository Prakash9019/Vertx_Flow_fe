import React, { useState } from "react";
import Header from "../components/Header";
import Background from "../assets/Profile_background.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Profile_Manual_Page() {
  const [accountName, setAccountName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [message, setMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const navigate = useNavigate();

  const handleCreateProfile = () => {
    if (companyName && accountName && companyWebsite) {
      setMessage(true);

      setTimeout(() => {
        setMessage(false);
      }, 1000);

      setTimeout(() => {
        navigate("/profile/setup");
      }, 1000);
    } else {
      setErrorMessage(true);
      setTimeout(() => {
        setErrorMessage(false);
      }, 1000);
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

        {/* Centered Form */}
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="bg-opacity-60 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-lg">
            <div className="w-full sm:w-85 sm:mx-auto">
              {message && (
                <p className="bg-green-700 text-center font-semibold py-1 rounded-md mb-1">
                  Profile created successfully!
                </p>
              )}
              {errorMessage && (
                <p className="bg-red-700 text-center font-semibold py-1 rounded-md mb-1">
                  {" "}
                  Failed to created profile.
                </p>
              )}
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
                Enter Details to Create Account
              </h2>

              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={accountName}
                  required
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Account full name"
                  className=" text-white border border-gray-700 py-1 px-3 rounded-md"
                />
                <input
                  type="text"
                  value={companyName}
                  required
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company name"
                  className="bg-black text-white border border-gray-700 py-1 px-3 rounded-md"
                />
                <input
                  type="text"
                  value={companyWebsite}
                  required
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  placeholder="Company website"
                  className="bg-black text-white border border-gray-700 py-1 px-3 rounded-md"
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
