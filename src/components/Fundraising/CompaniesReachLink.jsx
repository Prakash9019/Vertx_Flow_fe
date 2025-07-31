// CompaniesReachLink.jsx
import React from 'react';
import MainBG from '../../assets/IntroBG50.jpg';
import MainBG2 from '../../assets/IntroBGx2.jpg';
import { useNavigate } from 'react-router-dom';


const CompaniesReachLink = () => {
    const navigate = useNavigate();

  const handleClick = () => {
    navigate('/fundraising/preview');
  };
  
  return (
    <div
      className=" min-h-screen flex flex-col bg-black justify-center items-center text-white text-center absolute inset-0 bg-cover bg-bottom"
      style={{
          backgroundImage: `url(${MainBG})`, // MainBG as the primary background
        }}
    >

      <div className="relative z-10 p-5">
        <h1 className="text-4xl md:text-5xl font-semibold mb-8 drop-shadow-md">
          Company's ReachLink
        </h1>

        <div
          className="bg-black rounded-xl  shadow-xl max-w-sm md:max-w-md lg:max-w-lg mx-auto"
        >
          <img
            src={MainBG2} // Currently using MainBG2 here as per your provided code
            alt="Vibrant City Night Scene"
            className="w-full rounded-md block mx-auto"
          />
        </div>
        <p className="text-white max-w-md flex justify-center  mx-auto  text-xs  mt-5">
            By continuing, you agree to share details of your associated email, location, and device information.
            Your details will be kept safe and will not cause any harm to you.
          </p>

          <button 
          onClick={handleClick}
            className="bg-white text-black border border-gray-300 py-3 px-8 rounded-md text-lg font-bold cursor-pointer mt-6 shadow-md transition-colors duration-300 hover:bg-gray-100"
          >
            Continue
          </button>
      </div>

      {/* Footer */}
      <div
        className="absolute bottom-5 text-gray-400 text-xs md:text-sm flex items-center z-10"
      >
        REACHLINK by <span className="ml-1">▼</span> VERTX
      </div>
    </div>
  );
};

export default CompaniesReachLink;