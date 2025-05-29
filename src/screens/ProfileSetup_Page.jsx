// Vertx_Flow_fe/src/screens/ProfileSetup_Page.jsx
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import { FaLinkedin } from "react-icons/fa";
import { useStartupProfile } from "../context/StartupProfileContext";
import Image from "./image.png"; // Adjust the path as necessary
import bgImage from "./bg.png"; // Adjust the path as necessary
function ProfileSetup_Page() {
  const navigate = useNavigate();
  // Context handles initial data fetch. We mainly use loadingData and error for UI feedback here.
  const { loadingData, error: contextError, fetchStartupData, startupData } = useStartupProfile();
  const [linkedinHandle, setLinkedinHandle] = React.useState("");

  // If directly navigating to this page and context hasn't tried fetching, trigger a fetch.
  // The context's useEffect will also attempt to fetch if a token is present.
  useEffect(() => {
    if (loadingData === undefined && !localStorage.getItem('authToken')) { // First load, no token
        setLoadingData(false); // Explicitly set loading to false if no auth, context might not
    } else if (loadingData === undefined && localStorage.getItem('authToken')) {
        fetchStartupData(); // Or rely on context's own useEffect
    }
    // If startupData.stage is empty (or another key field), it implies new profile or data not loaded.
    // The context's loadingData handles the primary loading state.
  }, [fetchStartupData, loadingData, startupData]);


  const handleInputChange = (e) => {
    setLinkedinHandle(e.target.value);
  };

  const handleContinueToSetup = () => {
    // Navigate to the first actual data collection step.
    // Assumes context has loaded/initialized startupData.
    navigate("/profile/stage"); // This should be the "Stage" selection page
  };

  if (loadingData) {
    return <div className="min-h-screen flex justify-center items-center bg-black text-white">Loading your profile...</div>;
  }

  return (
<div 

  className="relative min-h-screen w-full text-white px-4 py-6 sm:px-6 md:px-10 lg:px-16"
// className="relative min-h-screen text-white px-4 py-6 sm:px-6 md:px-10 lg:px-16" 
style={{
    backgroundColor: 'black',
    backgroundImage: `url(${bgImage})`,
    backgroundPosition: 'top',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  }}
  // style={{ 
  //   position: 'relative',
  //   backgroundImage: `url(${bgImage})`,
  //   backgroundPosition: 'top',
  //   backgroundSize: 'cover',
  //   backgroundRepeat: 'no-repeat',
  // }}
> 
{/* <div
  className="relative min-h-screen w-full text-white px-4 py-6 sm:px-6 md:px-10 lg:px-16"
  style={{
    backgroundColor: 'black',
    backgroundImage: `url(${bgImage})`,
    backgroundPosition: 'top',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  }}
>
  
</div> */}
  {/* <div 
    className="absolute inset-0" 
    style={{ 
      backgroundColor: 'white', 
      opacity: 0.1,
      mixBlendMode: 'multiply'
    }}
  />
  <div 
    className="absolute inset-0" 
    style={{ 
      backgroundColor: '#1C001E', 
      opacity: 0.6 
    }}
  /> */}

     <div className="relative z-10">
        <Header />
 
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
          <div className="bg-black bg-opacity-60 p-6 sm:p-8 rounded-lg w-full sm:max-w-[63%] xl:max-w-[43%] shadow-xl text-center flex flex-col items-center">
          <div className="flex justify-between items-center w-full">
          <h2 className="font-inter font-semibold text-[32px] leading-[100%] tracking-[0%]">
  Enter your LinkedIn URL
</h2>

  <FaLinkedin className="text-4xl sm:text-4xl text-white" />
</div>




                 <p className="text-left text-xs sm:text-sm text-gray-400 my-5">
                 We use your LinkedIn to autofill your profile, giving you a better and faster 
                 experience while saving your time.
                 </p>
                 <div
  className="flex items-center w-full rounded-md text-white overflow-hidden mb-3"
  style={{ border: '1px solid #B8B8B821' }}
>
  <span className="pl-3 py-2 text-sm whitespace-nowrap ">
    https://www.linkedin.com/in/
  </span>
  <input
    type="text"
    value={linkedinHandle}
    onChange={handleInputChange}
    placeholder="profilename"
    className="flex-1 px-1 py-2 bg-black text-white text-sm outline-none focus:ring-1 focus:ring-purple-500"
  />
</div>


            {contextError && <p className="text-red-500 text-sm mb-3">{contextError}</p>}

            <button
              onClick={handleContinueToSetup}
              className="mt-5 w-full font-inter text-sm sm:text-base bg-white text-black py-2.5 rounded hover:bg-gray-200 active:bg-gray-200 transition-all"
            >
              Create flow profile
            </button>
            <p className="text-left mt-4 text-xs sm:text-sm text-gray-400">
              Not interested in sharing your LinkedIn profile URL?{" "}
              <span className="block lg:inline">
                <Link
                  to="/profile/manual"
                  className="text-white hover:underline active:underline"
                >
                  Fill it manually instead
                </Link>
              </span>
            </p>
          </div>
        {/* </div> */}
      </div>
      </div>
    </div>
  );
}

export default ProfileSetup_Page;
