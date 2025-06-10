"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import MockPitching from "./MockPitching"
import NatureRectangleImage from "../assets/NatureRectangleImage.jpg";
import MockPitchingImage from "../assets/MockPitching.jpg"; 
import DeckGeneration from "../assets/DeckGeneration.jpg";
import MockOutreach from "../assets/MockOutreach.jpg";

function PlayGround() {
  const [currentView, setCurrentView] = useState('playground')

  const handlePitchNowClick = () => {
    setCurrentView('mockpitching')
  }

  const handleBackToPlayground = () => {
    setCurrentView('playground')
  }

  // If viewing MockPitching, render it full screen without sidebar
  if (currentView === 'mockpitching') {
    return <MockPitching onBack={handleBackToPlayground} />
  }

  return (
    <div className="min-h-screen bg-black text-white flex relative">
      {/* Sidebar */}
      <div className="bg-black text-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-hidden">
        <div 
          style={{
            paddingLeft: "2.8rem",
            paddingRight: "2.8rem",
            paddingTop: "5rem",
            paddingBottom: "6rem",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}
        >
          {/* Hero Section */}
          <div 
            className="relative flex flex-col items-center justify-center text-center flex-1"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${NatureRectangleImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              borderRadius: "0.5rem",
              minHeight: "200px"
            }}
          >
            <div className="max-w-4xl px-8">
              <h1 
                className="text-white mb-8 leading-tight"
                style={{
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "1.25rem",
                  fontWeight: 300
                }}
              >
                Playground helps you practice your pitch<br />
                and build confidence by talking to an AI<br />
                investor before the real call.
              </h1>
              
              <button 
                className="bg-white text-black transition-colors hover:bg-gray-100"
                style={{
                  color: "#000",
                  textAlign: "center",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  width: "7.5rem",
                  height: "2.25rem",
                  borderRadius: "0.25rem",
                  background: "#FFF",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Watch Intro
              </button>
            </div>
          </div>

          {/* Cards Section */}
          <div 
            className="grid grid-cols-1 md:grid-cols-3"
            style={{
              gap: "0.8rem",
              flex: "0 0 auto"
            }}
          >
            {/* Mock Pitching Card */}
            <div 
              className="relative rounded-lg overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${MockPitchingImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                aspectRatio: "4/3"
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-between p-6 items-center text-center">
                <div>
                  <h3 
                    className="text-white mt-8"
                    style={{
                      color: "#FFF",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "1.25rem",
                      fontWeight: 600
                    }}
                  >
                    Mock Pitching
                  </h3>
                  <p 
                    className="text-white mt-1 leading-relaxed"
                    style={{
                      width: "12rem",
                      color: "#FFF",
                      textAlign: "center",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.75rem",
                      fontWeight: 300
                    }}
                  >
                    Take AI investor calls and receive instant reports to help you articulate and enhance your pitch, making you investor ready.
                  </p>
                </div>
                
                <button 
                  onClick={handlePitchNowClick}
                  className="bg-white text-black mb-6 transition-colors hover:bg-gray-100"
                  style={{
                    color: "#000",
                    textAlign: "center",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.625rem",
                    fontWeight: 600,
                    width: "5.0625rem",
                    height: "1.6875rem",
                    borderRadius: "0.1875rem",
                    background: "#FFF",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Pitch now
                </button>
              </div>
            </div>

            {/* Deck Generation Card */}
            <div 
              className="relative rounded-lg overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${DeckGeneration})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                aspectRatio: "4/3"
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-between p-6 items-center text-center">
                <div>
                  <h3 
                    className="text-white mt-8"
                    style={{
                      color: "#FFF",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "1.25rem",
                      fontWeight: 600
                    }}
                  >
                    Deck Generation
                  </h3>
                  <p 
                    className="text-white mt-1 leading-relaxed"
                    style={{
                      width:'12rem',
                      color: "#FFF",
                      textAlign: "center",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.75rem",
                      fontWeight: 300
                    }}
                  >
                    Quickly generate a pitch deck based on proven templates used by startups that scaled beyond $1B.
                  </p>
                </div>
                
                <button 
                  className="bg-white text-black mb-6 transition-colors hover:bg-gray-100"
                  style={{
                    color: "#000",
                    textAlign: "center",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.625rem",
                    fontWeight: 600,
                    width: "5.0625rem",
                    height: "1.6875rem",
                    borderRadius: "0.1875rem",
                    background: "#FFF",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Generate now
                </button>
              </div>
            </div>

            {/* Mock Outreach Card */}
            <div 
              className="relative rounded-lg overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${MockOutreach})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                aspectRatio: "4/3"
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-between p-6 items-center text-center">
                <div>
                  <h3 
                    className="text-white mt-8"
                    style={{
                      color: "#FFF",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "1.25rem",
                      fontWeight: 600
                    }}
                  >
                    Mock Outreach
                  </h3>
                  <p 
                    className="text-white mt-1 leading-relaxed"
                    style={{
                      width:'12rem',
                      color: "#FFF",
                      textAlign: "center",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.75rem",
                      fontWeight: 300
                    }}
                  >
                    Practice cold mailing with our AI agents and receive instant reports to help you articulate and enhance your mail.
                  </p>
                </div>
                
                <button 
                  className="bg-white text-black mb-6 transition-colors hover:bg-gray-100"
                  style={{
                    color: "#000",
                    textAlign: "center",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.625rem",
                    fontWeight: 600,
                    width: "5.0625rem",
                    height: "1.6875rem",
                    borderRadius: "0.1875rem",
                    background: "#FFF",
                    border: "none",
                    cursor: "pointer"
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