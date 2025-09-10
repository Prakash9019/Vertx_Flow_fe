"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar"
import MockPitching from "./MockPitching"
import NatureRectangleImage from "../../assets/NatureRectangleImage.jpg";
import MockPitchingImage from "../../assets/MockPitching.jpg"; 
import DeckGeneration from "../../assets/DeckGeneration.jpg";
import MockOutreach from "../../assets/MockOutreach.jpg";

function PlayGround() {
  const navigate = useNavigate();
  const [loadingMockPitching, setLoadingMockPitching] = useState(true);

  const handlePitchNowClick = () => {
    navigate("/playground/mockpitching");
  };


  return (
    <div className="min-h-screen bg-black text-white flex relative ">
      {/* Sidebar */}
      <div className="bg-black text-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-scroll ">
        <div 
          className="pl-7 md:pl-[2.8rem] pr-7 md:pr-[2.8rem] pt-12 md:pt-20 pb-15 md:pb-24 h-full flex flex-col gap-2 md:gap-4">
          {/* Hero Section */}
          <div 
            style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url("${NatureRectangleImage}")`
          }}
            className="bg-cover bg-center bg-no-repeat rounded-lg min-h-[200px] relative flex flex-col items-center justify-center text-center flex-1">
            <div className="max-w-4xl px-8">
              <h1 
                className="text-white mt-1 mb-4 md:mb-8 leading-tight  text-center font-sans text-lg font-light"
                style={{fontFamily: "Inter, sans-serif"}}>
                Playground helps you practice your pitch<br />
                and build confidence by talking to an AI<br />
                investor before the real call.
              </h1>
              
              <button 
                className="bg-white text-black transition-colors hover:bg-gray-100 text-center text-xs font-semibold w-[7.5rem] h-9 rounded border-none cursor-pointer"
                style={{ fontFamily: "Inter, sans-serif" }}>
                Watch Intro
              </button>
            </div>
          </div>

          {/* Cards Section */}
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-[0.8rem] flex-none">
            {/* Mock Pitching Card */}
            <div 
              className="relative max-h-[200px] min-w-full md:max-h-full rounded-lg  bg-cover bg-center aspect-[4/3]"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url("${MockPitchingImage}")`
              }}>
              <div className="absolute inset-0 flex flex-col justify-between p-2 md:p-6 items-center text-center">
                <div>
                  <h3 
                    className="text-white mt-0 md:mt-8 text-xl font-semibold"
                    style={{ fontFamily: "Inter, sans-serif" }}>
                    Mock Pitching
                  </h3>
                  <p
                  className="text-white mt-1 leading-relaxed w-48 text-center text-xs font-light"
                  style={{ fontFamily: "Inter, sans-serif" }}>
                    Take AI investor calls and receive instant reports to help you articulate and enhance your pitch, making you investor ready.
                  </p>
                </div>
                
                <button
                  onClick={handlePitchNowClick}
                  className="bg-white mt-2 text-black mb-auto md:mb-6 transition-colors hover:bg-gray-100 text-center text-[0.625rem] font-semibold w-[7.5rem] h-9  md:py-0 md:w-[5.0625rem] md:h-[1.6875rem] rounded-[0.1875rem] border-none cursor-pointer"
                  style={{
                    fontFamily: "Inter, sans-serif",
                  }}>
                  Pitch now
                </button>
              </div>
            </div>

            {/* Deck Generation Card */}
            <div
              className="relative rounded-lg max-h-[200px] min-w-full md:max-h-full  bg-cover bg-center aspect-[4/3]"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url("${DeckGeneration}")`
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-between p-2 md:p-6 items-center text-center">
                <div>
                  <h3
                    className="text-white mt-0 md:mt-8 text-xl font-semibold"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Deck Generation
                  </h3>
                  <p
                    className="text-white mt-1 leading-relaxed w-48 text-center text-xs font-light"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Quickly generate a pitch deck based on proven templates used by startups that scaled beyond $1B.
                  </p>
                </div>
                <button
                  className="bg-white mt-2 text-black mb-auto md:mb-6 transition-colors hover:bg-gray-100 text-center text-[0.625rem] font-semibold w-[7.5rem] h-9  md:py-0 md:w-[5.0625rem] md:h-[1.6875rem] rounded-[0.1875rem] border-none cursor-pointer"
                  style={{
                    fontFamily: "Inter, sans-serif",
                  }}>
                  Generate now
                </button>
              </div>
            </div>

            {/* Mock Outreach Card */}
            <div
              className="relative max-h-[240px] min-w-full md:max-h-full rounded-lg  bg-cover bg-center aspect-[4/3]"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url("${MockOutreach}")`
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-between p-2 md:p-6 items-center text-center">
                <div>
                  <h3
                    className="text-white mt-0 md:mt-8 text-xl font-semibold"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Mock Outreach
                  </h3>
                  <p
                    className="text-white mt-1 leading-relaxed w-48 text-center text-xs font-light"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Practice cold mailing with our AI agents and receive instant reports to help you articulate and enhance your mail.
                  </p>
                </div>
                
                <button
                  className="bg-white mt-2 text-black mb-auto md:mb-6 transition-colors hover:bg-gray-100 text-center text-[0.625rem] font-semibold w-[7.5rem] h-9  md:py-0 md:w-[5.0625rem] md:h-[1.6875rem] rounded-[0.1875rem] border-none cursor-pointer"
                  style={{
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Try now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayGround