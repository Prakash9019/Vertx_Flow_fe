import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaArrowUp } from "react-icons/fa";

function HomePage() {
  return (
    <div className="w-full flex flex-col md:flex-row min-h-screen bg-black text-white relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950 opacity-65 z-0"></div>

      {/* Sidebar */}
      <div className="md:col-span-3 bg-black text-white">
        <div className="relative z-10">
          <Sidebar />
        </div>
      </div>{/* Body with input */}      
      <div className="md:col-span-9 w-full flex flex-col md:flex-row min-h-screen bg-black text-white pb-10">
        <div className="flex-grow  flex justify-center items-end relative z-10  pb-10 ">
          <div className="bg-black h-[15rem] relative rounded-lg p-4 flex items-center w-full  sm:w-4xl">
            <input
              type="text"
              placeholder="Ask flash to create..."
              className="absolute top-8 left-8 w-full flex-grow bg-transparent text-white outline-none placeholder-gray-400"
            />
            <button className="ml-2 absolute bottom-8 right-5 bg-white text-black rounded-full p-2 hover:bg-gray-300 transition">
              <FaArrowUp size={20} />
            </button>          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
