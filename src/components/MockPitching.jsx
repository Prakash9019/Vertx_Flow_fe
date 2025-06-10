"use client"

import { useState } from "react"

import SearchIcon from "../assets/SearchIcon.svg";
import FilterIcon from "../assets/FilterIcon.svg";
import CallIcon from "../assets/CallIcon.svg";
import CallIcon2 from "../assets/CallIcon2.svg";
import StarIcon from "../assets/StarIcon.svg";
import logo from "../assets/logo.svg";
import ContactsIcon from "../assets/ContactsIcon.svg";
import AddIcon from "../assets/AddIcon.svg";
import SpeedometerIcon from "../assets/SpeedometerIcon.svg";
import TuneIcon from "../assets/TuneIcon.svg";
import PlayIcon from "../assets/PlayIcon.svg";

import { Search, Filter, Phone, Eye, Bookmark, MessageSquare, Settings, X, Star } from "lucide-react"

function MockPitching({ onBack }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInvestor, setSelectedInvestor] = useState(null)

  const investors = [
    {
      id: 1,
      name: "Persona One",
      role: "Venture Capitalist at",
      company: "Example Capital",
      image: "/api/placeholder/150/150",
      tags: [
        { text: "Expressive and Polite", type: "purple" },
        { text: "Hard", type: "brown" },
      ],
      rating: "4/5",
      description:
        "You are pitching your startup idea to Persona One, a strategic, principle-driven investor at Example Capital, known for investing in early-to-growth-stage startups with global, scalable business models.",
      instruction:
        "Persona One values visionary entrepreneurs who demonstrate clear product-market fit, disciplined execution, and a compelling global vision. Clearly present the core problem you're solving, your unique and differentiated solution, evidence of strong product-market fit, and your strategy for achieving global scalability.",
    }, {
      id: 1,
      name: "Persona One",
      role: "Venture Capitalist at",
      company: "Example Capital",
      image: "/api/placeholder/150/150",
      tags: [
        { text: "Expressive and Polite", type: "purple" },
        { text: "Hard", type: "brown" },
      ],
      rating: "4/5",
      description:
        "You are pitching your startup idea to Persona One, a strategic, principle-driven investor at Example Capital, known for investing in early-to-growth-stage startups with global, scalable business models.",
      instruction:
        "Persona One values visionary entrepreneurs who demonstrate clear product-market fit, disciplined execution, and a compelling global vision. Clearly present the core problem you're solving, your unique and differentiated solution, evidence of strong product-market fit, and your strategy for achieving global scalability.",
    }, {
      id: 1,
      name: "Persona One",
      role: "Venture Capitalist at",
      company: "Example Capital",
      image: "/api/placeholder/150/150",
      tags: [
        { text: "Expressive and Polite", type: "purple" },
        { text: "Hard", type: "brown" },
      ],
      rating: "4/5",
      description:
        "You are pitching your startup idea to Persona One, a strategic, principle-driven investor at Example Capital, known for investing in early-to-growth-stage startups with global, scalable business models.",
      instruction:
        "Persona One values visionary entrepreneurs who demonstrate clear product-market fit, disciplined execution, and a compelling global vision. Clearly present the core problem you're solving, your unique and differentiated solution, evidence of strong product-market fit, and your strategy for achieving global scalability.",
    }, {
      id: 1,
      name: "Persona One",
      role: "Venture Capitalist at",
      company: "Example Capital",
      image: "/api/placeholder/150/150",
      tags: [
        { text: "Expressive and Polite", type: "purple" },
        { text: "Hard", type: "brown" },
      ],
      rating: "4/5",
      description:
        "You are pitching your startup idea to Persona One, a strategic, principle-driven investor at Example Capital, known for investing in early-to-growth-stage startups with global, scalable business models.",
      instruction:
        "Persona One values visionary entrepreneurs who demonstrate clear product-market fit, disciplined execution, and a compelling global vision. Clearly present the core problem you're solving, your unique and differentiated solution, evidence of strong product-market fit, and your strategy for achieving global scalability.",
    }, {
      id: 1,
      name: "Persona One",
      role: "Venture Capitalist at",
      company: "Example Capital",
      image: "/api/placeholder/150/150",
      tags: [
        { text: "Expressive and Polite", type: "purple" },
        { text: "Hard", type: "brown" },
      ],
      rating: "4/5",
      description:
        "You are pitching your startup idea to Persona One, a strategic, principle-driven investor at Example Capital, known for investing in early-to-growth-stage startups with global, scalable business models.",
      instruction:
        "Persona One values visionary entrepreneurs who demonstrate clear product-market fit, disciplined execution, and a compelling global vision. Clearly present the core problem you're solving, your unique and differentiated solution, evidence of strong product-market fit, and your strategy for achieving global scalability.",
    }, {
      id: 1,
      name: "Persona One",
      role: "Venture Capitalist at",
      company: "Example Capital",
      image: "/api/placeholder/150/150",
      tags: [
        { text: "Expressive and Polite", type: "purple" },
        { text: "Hard", type: "brown" },
      ],
      rating: "4/5",
      description:
        "You are pitching your startup idea to Persona One, a strategic, principle-driven investor at Example Capital, known for investing in early-to-growth-stage startups with global, scalable business models.",
      instruction:
        "Persona One values visionary entrepreneurs who demonstrate clear product-market fit, disciplined execution, and a compelling global vision. Clearly present the core problem you're solving, your unique and differentiated solution, evidence of strong product-market fit, and your strategy for achieving global scalability.",
    }, {
      id: 1,
      name: "Persona One",
      role: "Venture Capitalist at",
      company: "Example Capital",
      image: "/api/placeholder/150/150",
      tags: [
        { text: "Expressive and Polite", type: "purple" },
        { text: "Hard", type: "brown" },
      ],
      rating: "4/5",
      description:
        "You are pitching your startup idea to Persona One, a strategic, principle-driven investor at Example Capital, known for investing in early-to-growth-stage startups with global, scalable business models.",
      instruction:
        "Persona One values visionary entrepreneurs who demonstrate clear product-market fit, disciplined execution, and a compelling global vision. Clearly present the core problem you're solving, your unique and differentiated solution, evidence of strong product-market fit, and your strategy for achieving global scalability.",
    }, {
      id: 1,
      name: "Persona One",
      role: "Venture Capitalist at",
      company: "Example Capital",
      image: "/api/placeholder/150/150",
      tags: [
        { text: "Expressive and Polite", type: "purple" },
        { text: "Hard", type: "brown" },
      ],
      rating: "4/5",
      description:
        "You are pitching your startup idea to Persona One, a strategic, principle-driven investor at Example Capital, known for investing in early-to-growth-stage startups with global, scalable business models.",
      instruction:
        "Persona One values visionary entrepreneurs who demonstrate clear product-market fit, disciplined execution, and a compelling global vision. Clearly present the core problem you're solving, your unique and differentiated solution, evidence of strong product-market fit, and your strategy for achieving global scalability.",
    }, {
      id: 1,
      name: "Persona One",
      role: "Venture Capitalist at",
      company: "Example Capital",
      image: "/api/placeholder/150/150",
      tags: [
        { text: "Expressive and Polite", type: "purple" },
        { text: "Hard", type: "brown" },
      ],
      rating: "4/5",
      description:
        "You are pitching your startup idea to Persona One, a strategic, principle-driven investor at Example Capital, known for investing in early-to-growth-stage startups with global, scalable business models.",
      instruction:
        "Persona One values visionary entrepreneurs who demonstrate clear product-market fit, disciplined execution, and a compelling global vision. Clearly present the core problem you're solving, your unique and differentiated solution, evidence of strong product-market fit, and your strategy for achieving global scalability.",
    }, {
      id: 1,
      name: "Persona One",
      role: "Venture Capitalist at",
      company: "Example Capital",
      image: "/api/placeholder/150/150",
      tags: [
        { text: "Expressive and Polite", type: "purple" },
        { text: "Hard", type: "brown" },
      ],
      rating: "4/5",
      description:
        "You are pitching your startup idea to Persona One, a strategic, principle-driven investor at Example Capital, known for investing in early-to-growth-stage startups with global, scalable business models.",
      instruction:
        "Persona One values visionary entrepreneurs who demonstrate clear product-market fit, disciplined execution, and a compelling global vision. Clearly present the core problem you're solving, your unique and differentiated solution, evidence of strong product-market fit, and your strategy for achieving global scalability.",
    },
  ]

  const handleInvestorClick = (investor) => {
    setSelectedInvestor(investor)
  }

  const handleCloseDetails = () => {
    setSelectedInvestor(null)
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ background: "#000000" }}>
      {/* Main Content */}
      <div
        style={{
          paddingLeft: "1.88rem",
          paddingRight: "1.88rem",
          paddingTop: "2.75rem",
          display: "flex",
          gap: "1.5rem",
          position: "relative",
        }}
      >
        {/* Left Column - Investor List (Scrollable) */}
        <div
          style={{
            width: selectedInvestor ? "37%" : "100%",
            transition: "width 0.3s ease",
            overflowY: "auto", // Enable vertical scrolling
            height: "100vh", // Full viewport height
          }}
        >
          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="relative">
              <img
                src={SearchIcon}
                alt="Search"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                style={{ width: "1.38644rem", height: "1.38644rem" }}
              />
              <input
                type="text"
                placeholder="Search investors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-16 py-4 rounded focus:outline-none"
                style={{
                  height: "3.25rem",
                  borderRadius: "0.25rem",
                  background: "#0F0E16",
                  color: "#B8B8B8",
                  fontFamily: "Inter",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  border: "none",
                }}
              />
              <img
                src={FilterIcon}
                alt="Filter"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                style={{ width: "1.525rem", height: "1.5rem" }}
              />
            </div>
          </div>

          {/* Header Text */}
          <div className="mb-8">
            <p
              style={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              Meet the most capable AI investors. Choose an AI persona to deliver your first pitch and get instant
              feedback.
            </p>
          </div>

          {/* Investor Cards */}
          <div className="space-y-6">
            {investors.map((investor) => (
              <div
                key={investor.id}
                className={`flex items-${selectedInvestor ? "start" : "center"} justify-between p-6 cursor-pointer hover:opacity-90 transition-opacity`}
                style={{
                  width: "100%",
                  height: "11.25rem",
                  borderRadius: "0.3125rem",
                  background: "#0F0E16",
                }}
                onClick={() => handleInvestorClick(investor)}
              >
                {!selectedInvestor ? (
                  // Original layout when no investor is selected
                  <>
                    <div className="flex items-center gap-6">
                      <div
                        className="bg-gray-600 overflow-hidden flex items-center justify-center"
                        style={{
                          width: "9.375rem",
                          height: "9.375rem",
                          borderRadius: "0.3125rem",
                        }}
                      >
                        <img
                          src={investor.image || "/placeholder.svg"}
                          alt={investor.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none"
                            e.target.nextSibling.style.display = "flex"
                          }}
                        />
                        <div
                          className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400 text-4xl font-bold"
                          style={{ display: "none" }}
                        >
                          {investor.name.charAt(0)}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3
                          className="mb-2"
                          style={{
                            color: "#FFF",
                            fontFamily: "Inter",
                            fontSize: "1.5rem",
                            fontWeight: 500,
                          }}
                        >
                          {investor.name}
                        </h3>
                        <div className="mb-4">
                          <span
                            style={{
                              color: "#656565",
                              fontFamily: "Inter",
                              fontSize: "1.125rem",
                              fontWeight: 400,
                            }}
                          >
                            {investor.role}{" "}
                          </span>
                          <span
                            style={{
                              color: "#FFF",
                              fontFamily: "Inter",
                              fontSize: "1.125rem",
                              fontWeight: 500,
                            }}
                          >
                            {investor.company}
                          </span>
                        </div>

                        <div className="flex gap-2 items-center flex-wrap">
                          {investor.tags.map((tag, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1"
                              style={{
                                width: tag.type === "purple" ? "7rem" : "2.5rem",
                                height: "1.0625rem",
                                borderRadius: tag.type === "purple" ? "0.5rem" : "0.625rem",
                                background: tag.type === "purple" ? "#AD6FDE" : "#621D04",
                                padding: "0 0.5rem",
                                justifyContent: "center",
                              }}
                            >
                              {tag.type === "purple" && (
                                <img
                                  src={CallIcon}
                                  alt="Call"
                                  style={{ width: "0.625rem", height: "0.625rem" }}
                                />
                              )}
                              <span
                                style={{
                                  color: "#FFF",
                                  fontFamily: "Inter",
                                  fontSize: "0.5rem",
                                  fontWeight: 500,
                                }}
                              >
                                {tag.text}
                              </span>
                            </div>
                          ))}

                          <div
                            className="flex items-center gap-1"
                            style={{
                              width: "2.5rem",
                              height: "1.0625rem",
                              borderRadius: "0.625rem",
                              background: "linear-gradient(180deg, #CC9C00 0%, #5D4100 100%)",
                              padding: "0 0.5rem",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={StarIcon}
                              alt="Star"
                              style={{ width: "0.625rem", height: "0.625rem" }}
                            />
                            <span
                              style={{
                                color: "#FFF",
                                fontFamily: "Inter",
                                fontSize: "0.5rem",
                                fontWeight: 500,
                              }}
                            >
                              {investor.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        className="hover:opacity-80 transition-opacity"
                        style={{
                          width: "15rem",
                          height: "1.95rem",
                          borderRadius: "0.1875rem",
                          border: "1px solid rgba(255, 255, 255, 0.04)",
                          background: "rgba(255, 255, 255, 0.08)",
                          color: "#D9D9D9",
                          fontFamily: "Inter",
                          fontSize: "0.625rem",
                          fontWeight: 500,
                        }}
                      >
                        View Profile
                      </button>
                      <button
                        className="hover:opacity-80 transition-opacity"
                        style={{
                          width: "15rem",
                          height: "1.95rem",
                          borderRadius: "0.1875rem",
                          border: "1px solid rgba(255, 255, 255, 0.04)",
                          background: "rgba(255, 255, 255, 0.08)",
                          color: "#D9D9D9",
                          fontFamily: "Inter",
                          fontSize: "0.625rem",
                          fontWeight: 500,
                        }}
                      >
                        Save Profile
                      </button>
                      <button
                        className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        style={{
                          width: "15rem",
                          height: "1.95rem",
                          borderRadius: "0.125rem",
                          background: "#FFF",
                          color: "#000",
                          fontFamily: "Inter",
                          fontSize: "0.625rem",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        <img
                          src={CallIcon2}
                          alt="Call"
                          style={{ width: "0.9rem", height: "0.9rem" }}
                        />
                        Call Investor
                      </button>
                    </div>
                  </>
                ) : (
                  // New layout when an investor is selected
                  <div className="flex items-start gap-6 w-full">
                    <div
                      className="bg-gray-600 overflow-hidden flex items-center justify-center"
                      style={{
                        width: "9.375rem",
                        height: "9.375rem",
                        borderRadius: "0.3125rem",
                      }}
                    >
                      <img
                        src={investor.image || "/placeholder.svg"}
                        alt={investor.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none"
                          e.target.nextSibling.style.display = "flex"
                        }}
                      />
                      <div
                        className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400 text-4xl font-bold"
                        style={{ display: "none" }}
                      >
                        {investor.name.charAt(0)}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div>
                        {/* Row 1: Name */}
                        <h3
                          style={{
                            color: "#FFF",
                            fontFamily: "Inter",
                            fontSize: "1rem",
                            fontWeight: 500,
                            marginBottom: "0rem",
                          }}
                        >
                          {investor.name}
                        </h3>

                        {/* Row 2: Role and Company on single line */}
                        <div style={{ marginBottom: "0.5rem" }}>
                          <span
                            style={{
                              color: "#656565",
                              fontFamily: "Inter",
                              fontSize: "0.625rem",
                              fontWeight: 400,
                            }}
                          >
                            {investor.role}{" "}
                          </span>
                          <span
                            style={{
                              color: "#FFF",
                              fontFamily: "Inter",
                              fontSize: "0.625rem",
                              fontWeight: 500,
                            }}
                          >
                            {investor.company}
                          </span>
                        </div>

                        {/* Row 3: Tags in single line */}
                        <div className="flex gap-2 items-center" style={{ marginBottom: "0.5rem" }}>
                          {investor.tags.map((tag, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1"
                              style={{
                                width: tag.type === "purple" ? "7rem" : "2.5rem",
                                height: "1.0625rem",
                                borderRadius: tag.type === "purple" ? "0.5rem" : "0.625rem",
                                background: tag.type === "purple" ? "#AD6FDE" : "#621D04",
                                padding: "0 0.5rem",
                                justifyContent: "center",
                              }}
                            >
                              {tag.type === "purple" && <Phone style={{ width: "0.625rem", height: "0.625rem" }} />}
                              <span
                                style={{
                                  color: "#FFF",
                                  fontFamily: "Inter",
                                  fontSize: "0.5rem",
                                  fontWeight: 500,
                                }}
                              >
                                {tag.text}
                              </span>
                            </div>
                          ))}

                          <div
                            className="flex items-center gap-1"
                            style={{
                              width: "2.5rem",
                              height: "1.0625rem",
                              borderRadius: "0.625rem",
                              background: "linear-gradient(180deg, #CC9C00 0%, #5D4100 100%)",
                              padding: "0 0.5rem",
                              justifyContent: "center",
                            }}
                          >
                            <Star style={{ width: "0.625rem", height: "0.625rem" }} />
                            <span
                              style={{
                                color: "#FFF",
                                fontFamily: "Inter",
                                fontSize: "0.5rem",
                                fontWeight: 500,
                              }}
                            >
                              {investor.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Buttons section moved below tags */}
                      <div className="flex flex-col" style={{ gap: "0.25rem" }}>
                        {/* Row 4: View Profile and Save Profile buttons side by side */}
                        <div className="flex gap-2">
                          <button
                            className="hover:opacity-80 transition-opacity"
                            style={{
                              width: "6.125rem",
                              height: "1.625rem",
                              borderRadius: "0.1875rem",
                              border: "1px solid rgba(255, 255, 255, 0.04)",
                              background: "rgba(255, 255, 255, 0.08)",
                              color: "#D9D9D9",
                              fontFamily: "Inter",
                              fontSize: "0.5rem",
                              fontWeight: 500,
                            }}
                          >
                            View Profile
                          </button>
                          <button
                            className="hover:opacity-80 transition-opacity"
                            style={{
                              width: "6.125rem",
                              height: "1.625rem",
                              borderRadius: "0.1875rem",
                              border: "1px solid rgba(255, 255, 255, 0.04)",
                              background: "rgba(255, 255, 255, 0.08)",
                              color: "#D9D9D9",
                              fontFamily: "Inter",
                              fontSize: "0.5rem",
                              fontWeight: 500,
                            }}
                          >
                            Save Profile
                          </button>
                        </div>

                        {/* Row 5: Call Investor button full width */}
                        <button
                          className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                          style={{
                            width: "12.5rem",
                            height: "1.625rem",
                            borderRadius: "0.125rem",
                            background: "#FFF",
                            color: "#000",
                            fontFamily: "Inter",
                            fontSize: "0.5rem",
                            fontWeight: 500,
                            border: "none",
                          }}
                        >
                          <Phone style={{ width: "0.9rem", height: "0.9rem" }} />
                          Call Investor
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Investor Details (Fixed) */}
        {selectedInvestor && (
          <div
            style={{
              width: "59%",
              padding: "1.5rem 8rem",
              background: "#0F0E16",
              borderRadius: "0.3125rem",
              transition: "opacity 0.3s ease",
              position: "fixed", // Fix the right column
              top: "2.75rem", // Align with main content padding
              right: "1.88rem", // Align with main content padding
              height: "100vh", // Full viewport height, no bottom padding
              overflowY: "auto", // Enable scrolling if content overflows
            }}
          >
            {/* Profile Image and Details Side by Side */}
            <div className="flex gap-6 mb-8 mt-15">
              {/* Profile Image */}
              <div
                className="bg-gray-600 overflow-hidden flex items-center justify-center"
                style={{
                  width: "15.625rem",
                  height: "15.625rem",
                  borderRadius: "0.3125rem",
                }}
              >
                <img
                  src={selectedInvestor.image || "/placeholder.svg"}
                  alt={selectedInvestor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none"
                    e.target.nextSibling.style.display = "flex"
                  }}
                />
                <div
                  className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400 font-bold"
                  style={{ display: "none", fontSize: "4rem" }}
                >
                  {selectedInvestor.name.charAt(0)}
                </div>
              </div>

              {/* Details Beside Image */}
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                {/* Name */}
                <h3
                  style={{
                    color: "#FFF",
                    fontFamily: "Inter",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                  }}
                >
                  {selectedInvestor.name}
                </h3>

                {/* Role */}
                <div style={{ marginBottom: "0.25rem" }}>
                  <span
                    style={{
                      color: "#656565",
                      fontFamily: "Inter",
                      fontSize: "0.875rem",
                      fontWeight: 400,
                    }}
                  >
                    Venture Capitalist
                  </span>
                </div>

                {/* Company */}
                <div style={{ marginBottom: "1rem" }}>
                  <span
                    style={{
                      color: "#FFF",
                      fontFamily: "Inter",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    {selectedInvestor.company}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex gap-2 mb-4 justify-center">
                  {selectedInvestor.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1"
                      style={{
                        height: "1.0625rem",
                        borderRadius: tag.type === "purple" ? "0.5rem" : "0.625rem",
                        background: tag.type === "purple" ? "#AD6FDE" : "#621D04",
                        padding: "0 0.5rem",
                        justifyContent: "center",
                      }}
                    >
                      {tag.type === "purple" && (
                        <img
                          src={CallIcon}
                          alt="Call"
                          style={{ width: "0.625rem", height: "0.625rem" }}
                        />
                      )}
                      <span
                        style={{
                          color: "#FFF",
                          fontFamily: "Inter",
                          fontSize: "0.5rem",
                          fontWeight: 500,
                        }}
                      >
                        {tag.text}
                      </span>
                    </div>
                  ))}

                  <div
                    className="flex items-center gap-1"
                    style={{
                      height: "1.0625rem",
                      borderRadius: "0.625rem",
                      background: "linear-gradient(180deg, #CC9C00 0%, #5D4100 100%)",
                      padding: "0 0.5rem",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={StarIcon}
                      alt="Star"
                      style={{ width: "0.625rem", height: "0.625rem" }}
                    />
                    <span
                      style={{
                        color: "#FFF",
                        fontFamily: "Inter",
                        fontSize: "0.5rem",
                        fontWeight: 500,
                      }}
                    >
                      {selectedInvestor.rating}
                    </span>
                  </div>
                </div>

                {/* Play Button Section */}
                <div className="mb-4 flex flex-col items-center w-[75%] px-4">
                  <div
                    className="flex items-center gap-2 mb-2 w-full max-w-[16rem]"
                    style={{
                      position: "relative",
                    }}
                  >
                    <div className="flex items-center justify-center cursor-pointer">
                      <img src={PlayIcon} alt="Play" style={{ width: "1.25rem", height: "1.25rem" }} />
                    </div>

                    {/* Progress Bar Background */}
                    <div
                      style={{
                        flex: 1,
                        height: "0.25rem",
                        background: "#333",
                        borderRadius: "0.125rem",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Progress Fill */}
                      <div
                        style={{
                          width: "40%",
                          height: "100%",
                          background: "#FFF",
                          borderRadius: "0.125rem",
                          position: "absolute",
                          top: 0,
                          left: 0,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Call Investor Button */}
                <button
                  className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  style={{
                    width: "12.5rem",
                    height: "2.25rem",
                    borderRadius: "0.125rem",
                    background: "#FFF",
                    color: "#000",
                    fontFamily: "Inter",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    border: "none",
                  }}
                >
                  <img src={CallIcon2} alt="Call" style={{ width: "0.875rem", height: "0.875rem" }} />
                  Call Investor
                </button>
              </div>
            </div>

            {/* Objective Section */}
            <div className="mb-6">
              <h4
                className="mb-3"
                style={{
                  color: "#FFF",
                  fontFamily: "Inter",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                }}
              >
                Objective
              </h4>
              <p
                style={{
                  color: "#FFF",
                  fontFamily: "Inter",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  lineHeight: "1.6",
                }}
              >
                {selectedInvestor.description}
              </p>
            </div>

            {/* Instruction Section */}
            <div className="mb-6">
              <h4
                className="mb-3"
                style={{
                  color: "#FFF",
                  fontFamily: "Inter",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                }}
              >
                Instruction
              </h4>
              <p
                style={{
                  color: "#FFF",
                  fontFamily: "Inter",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  lineHeight: "1.6",
                }}
              >
                {selectedInvestor.instruction}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div
        className="fixed bottom-2 left-0 w-full flex items-center justify-center"
        style={{ height: "4.375rem", background: "rgba(0, 0, 0, 0.90)" }}
      >
        <div
          className="flex items-center"
          style={{
            width: "20.75rem",
            height: "3.125rem",
            borderRadius: "0.5rem",
            background: "rgba(255, 255, 255, 0.94)",
            padding: "0 1rem",
            gap: "1rem",
          }}
        >
          <button
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{
              width: "2.375rem",
              height: "2.375rem",
              borderRadius: "0.25rem",
              background: "#000",
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{
                width: "1.2rem",
                height: "1.2rem",
              }}
            />
          </button>

          <div
            style={{
              width: "0.0625rem",
              height: "3.125rem",
              background: "rgba(184, 184, 184, 0.40)",
            }}
          />

          <button
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{
              width: "2.5rem",
              height: "2.25rem",
              borderRadius: "0.25rem",
              background: "#AD6FDE",
            }}
          >
            <img
              src={ContactsIcon}
              alt="Contacts"
              style={{ width: "1.2rem", height: "1.2rem" }}
            />
          </button>

          <button className="flex items-center justify-center hover:opacity-80 transition-opacity text-gray-600">
            <img
              src={AddIcon}
              alt="Add"
              style={{ width: "1.5rem", height: "1.5rem", filter: "invert(100%)" }}
            />
          </button>

          <button className="flex items-center justify-center hover:opacity-80 transition-opacity text-gray-600">
            <img
              src={SpeedometerIcon}
              alt="Speedometer"
              style={{ width: "1.5rem", height: "1.5rem" }}
            />
          </button>

          <button className="flex items-center justify-center hover:opacity-80 transition-opacity text-gray-600">
            <img
              src={TuneIcon}
              alt="Tune"
              style={{ width: "1.5rem", height: "1.5rem" }}
            />
          </button>

          <div
            style={{
              width: "0.0625rem",
              height: "3.125rem",
              background: "rgba(184, 184, 184, 0.40)",
            }}
          />

          <button
            onClick={onBack}
            className="flex items-center justify-center hover:opacity-80 transition-opacity text-xs font-medium"
            style={{
              width: "2.5rem",
              height: "1.875rem",
              borderRadius: "0.1875rem",
              background: "#33005C",
              color: "#AD6FDE",
            }}
          >
            EXIT
          </button>
        </div>
      </div>
    </div>
  )
}

export default MockPitching