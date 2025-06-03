import { useState } from "react"

function AddInvestorsPopup({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("")

  if (!isOpen) return null

  const citySvg = `
    <svg width="700" height="400" viewBox="0 0 700 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#4A5568;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2D3748;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="700" height="400" fill="url(#skyGradient)"/>
      <rect x="0" y="250" width="80" height="150" fill="#1A202C"/>
      <rect x="565" y="220" width="8" height="8" fill="#4A5568"/>
    </svg>
  `
  const cityBackground = `url("data:image/svg+xml;base64,${btoa(citySvg)}")`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black" 
        style={{ opacity: 0.7 }} 
        onClick={onClose}
      ></div>

      <div
        className="relative flex items-center justify-center"
        style={{
          width: "calc(100% - 10rem)",
          height: "33.125rem",
          background: "#0F0E16",
          borderRadius: "0.5rem",
          margin: "0 5rem"
        }}
      >
        {/* Back button positioned absolutely */}
        <button
          onClick={onClose}
          className="absolute top-6 left-8 flex items-center gap-3 hover:opacity-80 transition-opacity"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#FFF",
          }}
        >
          <svg
            style={{ 
              width: "1.5rem", 
              height: "1.5rem" 
            }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span
            style={{
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            Back
          </span>
        </button>

        {/* Centered content */}
        <div className="flex flex-row items-center justify-between" style={{ padding: "2rem 3rem", width: "100%" }}>
          {/* Left side - Content */}
          <div className="flex flex-col" style={{ flex: 1 }}>
            <div className="mb-8 ml-3">
              <h2
                style={{
                  color: "#FFF",
                  fontFamily: "Inter",
                  fontSize: "1.25rem",
                  fontWeight: 500,
                  marginBottom: "0.5rem",
             
                }}
              >
                Add Investors from Vertx database
              </h2>
              <p
                style={{
                  color: "#B8B8B8",
                  fontFamily: "Inter",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  margin: 0,
                }}
              >
                Search investors by name, email, or firm
              </p>
            </div>

            <div className="relative ml-3">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  style={{ 
                    width: "1.5rem", 
                    height: "1.5rem",
                    color: "#B8B8B8"
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "31.25rem",
                  height: "3.125rem",
                  paddingLeft: "3.5rem",
                  paddingRight: "1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #0f0e16",
                  background: "#000",
                  fontFamily: "Inter",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  color: "#FFF",
                  outline: "none"
                }}
                className="focus:outline-none"
              />
            </div>
          </div>

          {/* Right side - Image */}
          <div
            className="relative flex items-center justify-center flex-shrink-0"
            style={{
              width: "27.5rem",
              height: "27.5rem",
              borderRadius: "0.375rem",
              backgroundImage: cityBackground,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              marginLeft: "2rem",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                borderRadius: "0.375rem",
              }}
            ></div>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                style={{
                  width: "2.875rem",
                  height: "0.625rem"
                }}
                viewBox="0 0 46 10" 
                fill="none"
              >
                <circle cx="5" cy="5" r="5" fill="white"/>
                <circle cx="23" cy="5" r="5" fill="white" fillOpacity="0.13"/>
                <circle cx="41" cy="5" r="5" fill="white" fillOpacity="0.13"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddInvestorsPopup