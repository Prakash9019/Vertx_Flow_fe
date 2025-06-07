"use client"

import { useState } from "react"

function AddInvestorsPopup({ isOpen, onClose, onInvestorsAdded }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInvestor, setSelectedInvestor] = useState(null)
  const [addedInvestors, setAddedInvestors] = useState(new Set())
  const [showNotification, setShowNotification] = useState(false)

  if (!isOpen) return null

  // Mock investor data
  const mockInvestors = [
    {
      id: 1,
      name: "Alex Bogusky",
      company: "Y Combinator",
      location: "United States",
      investment: "500K",
      type: "ACCELERATOR",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80",
      email: "alex@ycombinator.com",
      linkedin: "#",
      website: "#",
      twitter: "#",
      checkSize: "$500K",
      stage: "Pre-Seed",
      stageCount: "+3",
      industry: "AI/ML",
      industryCount: "+10",
      geography: "+18",
      match: "23%",
      matchColor: "#DE2D2D",
      matchValue: 23,
    },
    {
      id: 2,
      name: "Sarah Chen",
      company: "Sequoia Capital",
      location: "United States",
      investment: "2M",
      type: "VC",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&q=80",
      email: "sarah@sequoia.com",
      linkedin: "#",
      website: "#",
      twitter: "#",
      checkSize: "$2M",
      stage: "Series A",
      stageCount: "+5",
      industry: "FinTech",
      industryCount: "+8",
      geography: "+12",
      match: "67%",
      matchColor: "#AF4F00",
      matchValue: 67,
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      company: "Andreessen Horowitz",
      location: "United States",
      investment: "5M",
      type: "VC",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
      email: "michael@a16z.com",
      linkedin: "#",
      website: "#",
      twitter: "#",
      checkSize: "$5M",
      stage: "Series B",
      stageCount: "+2",
      industry: "SaaS",
      industryCount: "+15",
      geography: "+20",
      match: "85%",
      matchColor: "#CC8D03",
      matchValue: 85,
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      company: "Andreessen Horowitz",
      location: "United States",
      investment: "5M",
      type: "VC",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
      email: "michael@a16z.com",
      linkedin: "#",
      website: "#",
      twitter: "#",
      checkSize: "$5M",
      stage: "Series B",
      stageCount: "+2",
      industry: "SaaS",
      industryCount: "+15",
      geography: "+20",
      match: "85%",
      matchColor: "#CC8D03",
      matchValue: 85,
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      company: "Andreessen Horowitz",
      location: "United States",
      investment: "5M",
      type: "VC",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
      email: "michael@a16z.com",
      linkedin: "#",
      website: "#",
      twitter: "#",
      checkSize: "$5M",
      stage: "Series B",
      stageCount: "+2",
      industry: "SaaS",
      industryCount: "+15",
      geography: "+20",
      match: "85%",
      matchColor: "#CC8D03",
      matchValue: 85,
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      company: "Andreessen Horowitz",
      location: "United States",
      investment: "5M",
      type: "VC",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
      email: "michael@a16z.com",
      linkedin: "#",
      website: "#",
      twitter: "#",
      checkSize: "$5M",
      stage: "Series B",
      stageCount: "+2",
      industry: "SaaS",
      industryCount: "+15",
      geography: "+20",
      match: "85%",
      matchColor: "#CC8D03",
      matchValue: 85,
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      company: "Andreessen Horowitz",
      location: "United States",
      investment: "5M",
      type: "VC",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
      email: "michael@a16z.com",
      linkedin: "#",
      website: "#",
      twitter: "#",
      checkSize: "$5M",
      stage: "Series B",
      stageCount: "+2",
      industry: "SaaS",
      industryCount: "+15",
      geography: "+20",
      match: "85%",
      matchColor: "#CC8D03",
      matchValue: 85,
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      company: "Andreessen Horowitz",
      location: "United States",
      investment: "5M",
      type: "VC",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
      email: "michael@a16z.com",
      linkedin: "#",
      website: "#",
      twitter: "#",
      checkSize: "$5M",
      stage: "Series B",
      stageCount: "+2",
      industry: "SaaS",
      industryCount: "+15",
      geography: "+20",
      match: "85%",
      matchColor: "#CC8D03",
      matchValue: 85,
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      company: "Andreessen Horowitz",
      location: "United States",
      investment: "5M",
      type: "VC",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
      email: "michael@a16z.com",
      linkedin: "#",
      website: "#",
      twitter: "#",
      checkSize: "$5M",
      stage: "Series B",
      stageCount: "+2",
      industry: "SaaS",
      industryCount: "+15",
      geography: "+20",
      match: "85%",
      matchColor: "#CC8D03",
      matchValue: 85,
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      company: "Andreessen Horowitz",
      location: "United States",
      investment: "5M",
      type: "VC",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
      email: "michael@a16z.com",
      linkedin: "#",
      website: "#",
      twitter: "#",
      checkSize: "$5M",
      stage: "Series B",
      stageCount: "+2",
      industry: "SaaS",
      industryCount: "+15",
      geography: "+20",
      match: "85%",
      matchColor: "#CC8D03",
      matchValue: 85,
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      company: "Andreessen Horowitz",
      location: "United States",
      investment: "5M",
      type: "VC",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
      email: "michael@a16z.com",
      linkedin: "#",
      website: "#",
      twitter: "#",
      checkSize: "$5M",
      stage: "Series B",
      stageCount: "+2",
      industry: "SaaS",
      industryCount: "+15",
      geography: "+20",
      match: "85%",
      matchColor: "#CC8D03",
      matchValue: 85,
    },
    
  ]

  // Filter investors based on search term
  const filteredInvestors = searchTerm.trim()
    ? mockInvestors.filter(
        (investor) =>
          investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          investor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          investor.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const hasResults = filteredInvestors.length > 0
  const showResults = searchTerm.trim().length > 0

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

  const handleInvestorClick = (investor) => {
    setSelectedInvestor(investor)
  }

  const handleToggleInvestor = (investor) => {
    const newAddedInvestors = new Set(addedInvestors)

    if (addedInvestors.has(investor.id)) {
      newAddedInvestors.delete(investor.id)
    } else {
      newAddedInvestors.add(investor.id)
    }

    setAddedInvestors(newAddedInvestors)

    // Show notification
    setShowNotification(true)

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const handleClose = () => {
    // Pass added investors back to parent when closing
    if (onInvestorsAdded && addedInvestors.size > 0) {
      const addedInvestorData = mockInvestors.filter((investor) => addedInvestors.has(investor.id))
      onInvestorsAdded(addedInvestorData)
    }
    onClose()
  }

  const isInvestorAdded = selectedInvestor ? addedInvestors.has(selectedInvestor.id) : false

  return (
    <>
      {/* Notification Popup */}
      <div
        className={`fixed top-4 right-4 z-[100] transition-all duration-300 ease-in-out ${
          showNotification ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="w-[13.75rem] h-[3.25rem] rounded-[0.375rem] border border-[#18152D] bg-black flex items-center justify-between px-4 py-3 shadow-lg">
          <span className="text-white font-inter text-base font-medium">Changes saved</span>
          <button
            className="w-[2.8125rem] h-[1.28644rem] rounded-[0.125rem] bg-[#33005C] text-[#AD6FDE] text-[0.625rem] font-semibold flex items-center justify-center"
            onClick={() => setShowNotification(false)}
          >
            Undo
          </button>
        </div>
      </div>

      <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4 md:px-8 xl:px-20">
        <div className="absolute inset-0 bg-black opacity-70" onClick={handleClose}></div>

        <div
          className={`relative w-full max-w-7xl bg-[#0F0E16] rounded-lg ${
            showResults ? "h-[80vh] max-h-[700px]" : "h-auto"
          }`}
        >
          {/* Back button positioned absolutely */}
          <button
            onClick={handleClose}
            className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-5 md:left-6 xl:top-6 xl:left-8 flex items-center gap-1 sm:gap-2 xl:gap-3 hover:opacity-80 transition-opacity text-white z-10 whitespace-nowrap"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 xl:w-6 xl:h-6 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="font-inter text-xs sm:text-sm xl:text-base font-medium">Back</span>
          </button>

          {!showResults ? (
            // Original layout when no search results
            <div className="flex flex-row items-center justify-between w-full min-h-[300px] sm:min-h-[400px] md:min-h-[480px] xl:min-h-[530px] p-3 sm:p-4 md:p-6 xl:p-12">
              {/* Left side - Content */}
              <div className="flex flex-col flex-1 pr-2 sm:pr-4 md:pr-6 xl:pr-8">
                <div className="mb-4 sm:mb-6 xl:mb-8">
                  <h2 className="text-white font-inter text-sm sm:text-base md:text-lg xl:text-xl font-medium mb-1 sm:mb-2 leading-tight">
                    Add Investors from Vertx database
                  </h2>
                  <p className="text-[#B8B8B8] font-inter text-xs sm:text-sm font-normal leading-tight">
                    Search investors by name, email, or firm
                  </p>
                </div>

                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md xl:max-w-[500px]">
                  <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 xl:pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 xl:w-6 xl:h-6 text-[#B8B8B8] flex-shrink-0"
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
                    className="w-full h-8 sm:h-10 md:h-12 xl:h-[50px] pl-8 sm:pl-10 md:pl-12 xl:pl-14 pr-2 sm:pr-3 xl:pr-4 rounded-md sm:rounded-lg border border-[#0f0e16] bg-black font-inter text-xs sm:text-sm font-normal text-white outline-none focus:outline-none"
                  />
                </div>
              </div>

              {/* Right side - Image */}
              <div
                className="relative  flex items-center justify-center flex-shrink-0 w-32 sm:w-48 md:w-100 xl:w-[440px] h-24 sm:h-36 md:h-100 xl:h-[440px] rounded-sm sm:rounded-md overflow-hidden"
                style={{
                  backgroundImage: cityBackground,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-sm sm:rounded-md"></div>

                <div className="absolute bottom-2 sm:bottom-3 xl:bottom-6 left-1/2 transform -translate-x-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 sm:w-8 md:w-10 xl:w-[46px] h-1 sm:h-2 xl:h-[10px]"
                    viewBox="0 0 46 10"
                    fill="none"
                  >
                    <circle cx="5" cy="5" r="5" fill="white" />
                    <circle cx="23" cy="5" r="5" fill="white" fillOpacity="0.13" />
                    <circle cx="41" cy="5" r="5" fill="white" fillOpacity="0.13" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            // Layout when search results are shown
            <div className="flex flex-col w-full h-full">
              {/* Header with search bar */}
              <div className="pt-12 sm:pt-14 md:pt-16 xl:pt-18 px-3 sm:px-4 md:px-6 xl:px-12 pb-4">
                <div className="mb-4">
                  <h2 className="text-white font-inter text-sm sm:text-base md:text-lg xl:text-xl font-medium mb-1 leading-tight">
                    Add Investors from Vertx database
                  </h2>
                  <p className="text-[#B8B8B8] font-inter text-xs sm:text-sm font-normal leading-tight">
                    Search investors by name, email, or firm
                  </p>
                </div>

                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md xl:max-w-[500px]">
                  <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 xl:pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 xl:w-6 xl:h-6 text-[#B8B8B8] flex-shrink-0"
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
                    className="w-full h-8 sm:h-10 md:h-12 xl:h-[50px] pl-8 sm:pl-10 md:pl-12 xl:pl-14 pr-2 sm:pr-3 xl:pr-4 rounded-md sm:rounded-lg border border-[#0f0e16] bg-black font-inter text-xs sm:text-sm font-normal text-white outline-none focus:outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Content area with results and details */}
              <div className="flex flex-1 overflow-hidden px-3 sm:px-4 md:px-6 xl:px-12 pb-3 sm:pb-4 md:pb-6 xl:pb-12 relative">
                {/* Left side - Search results */}
                <div className="flex-1 pr-4 sm:pr-6 xl:pr-8">
                  <div
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md xl:max-w-[500px] bg-black rounded-[0.25rem] overflow-y-auto space-y-2 p-2"
                    style={{ height: "24.6875rem" }}
                  >
                    {hasResults ? (
                      filteredInvestors.map((investor) => (
                        <div
                          key={investor.id}
                          onClick={() => handleInvestorClick(investor)}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-[#18002C] ${
                            selectedInvestor?.id === investor.id ? "bg-[#18002C]" : "bg-transparent"
                          }`}
                          style={{ height: "6.75rem" }}
                        >
                          <img
                            src={investor.avatar || "/placeholder.svg"}
                            alt={investor.name}
                            className="rounded-lg object-cover flex-shrink-0"
                            style={{ width: "4.6875rem", height: "4.6875rem" }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                className="text-white font-inter font-normal truncate"
                                style={{ fontSize: "1.25rem" }}
                              >
                                {investor.name}
                              </h3>
                              <div className="flex items-center gap-1">
                                <svg
                                  className="text-[#0077B5]"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  style={{ width: "1.25rem", height: "1.25rem" }}
                                >
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                <svg
                                  className="text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  style={{ width: "1.25rem", height: "1.25rem" }}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                  />
                                </svg>
                                <svg
                                  className="text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  style={{ width: "1.25rem", height: "1.25rem" }}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                <svg
                                  className="text-gray-400"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  style={{ width: "1.25rem", height: "1.25rem" }}
                                >
                                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                              </div>
                            </div>
                            <p className="text-white font-inter font-normal mb-1" style={{ fontSize: "0.75rem" }}>
                              {investor.company}
                            </p>
                            <span
                              className="inline-block px-2 py-1 bg-[#456BBD] text-white font-inter font-bold rounded-full"
                              style={{
                                fontSize: "0.5rem",
                                width: "5rem",
                                height: "1rem",
                                borderRadius: "6.25rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {investor.type}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-[#B8B8B8] py-8">No investors found matching your search.</div>
                    )}
                  </div>
                </div>

                {/* Right side - Selected investor details */}
                {selectedInvestor && (
                  <div
                    className="fixed bg-[#0F0E16] rounded-lg flex flex-col z-20"
                    style={{
                      top: "50%",
                      right: "10%",
                      width: "40%",
                      height: "80vh",
                      maxHeight: "600px",
                      transform: "translateY(-50%)",
                      padding: "34px",
                      overflowY: "auto",
                    }}
                  >
                    <div className="text-center flex-shrink-0">
                      <div className="w-[12.5rem] h-[12.5rem] mx-auto mb-4 flex-shrink-0">
                        <img
                          src={selectedInvestor.avatar || "Rectangle 119.png"}
                          alt={selectedInvestor.name}
                          className="w-full h-full rounded-lg object-cover"
                        />
                      </div>
                      <h2 className="text-white font-inter font-medium mb-3" style={{ fontSize: "2rem" }}>
                        {selectedInvestor.name}
                      </h2>
                      <div className="flex justify-center gap-3 mb-6">
                        <svg
                          className="text-[#0077B5] cursor-pointer hover:opacity-80"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          style={{ width: "1.25rem", height: "1.25rem" }}
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        <svg
                          className="text-gray-400 cursor-pointer hover:opacity-80"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ width: "1.25rem", height: "1.25rem" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        <svg
                          className="text-gray-400 cursor-pointer hover:opacity-80"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ width: "1.25rem", height: "1.25rem" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <svg
                          className="text-gray-400 cursor-pointer hover:opacity-80"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          style={{ width: "1.25rem", height: "1.25rem" }}
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </div>
                    </div>

                    <div className="space-y-4 flex-1">
                      <div className="flex items-center justify-center gap-3 text-white">
                        <svg
                          className="text-gray-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ width: "1.87306rem", height: "1.87306rem" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                          />
                        </svg>
                        <span className="font-inter font-normal" style={{ fontSize: "1.25rem" }}>
                          {selectedInvestor.company}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-3 text-white">
                        <svg
                          className="text-gray-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ width: "1.87306rem", height: "1.87306rem" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="font-inter font-normal" style={{ fontSize: "1.25rem" }}>
                          {selectedInvestor.location}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-3 text-white">
                        <svg
                          className="text-gray-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ width: "1.87306rem", height: "1.87306rem" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        <span className="font-inter font-normal" style={{ fontSize: "1.25rem" }}>
                          {selectedInvestor.investment}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleInvestor(selectedInvestor)}
                      className={`font-inter font-medium transition-colors mt-6 w-full flex-shrink-0 ${
                        isInvestorAdded
                          ? "bg-[#DE2D2D] text-white hover:bg-[#C82828]"
                          : "bg-white text-black hover:bg-gray-100"
                      }`}
                      style={{
                        height: "3.75rem",
                        borderRadius: "0.25rem",
                        fontSize: "1rem",
                      }}
                    >
                      {isInvestorAdded ? "Remove from target list" : "Add to target list"}
                    </button>
                  </div>
                )}

                {/* Default right side when no investor selected */}
                {!selectedInvestor && (
                  <div className="flex-shrink-0 w-80 xl:w-[440px]">
                    <div
                      className="relative flex items-center justify-center h-full rounded-lg overflow-hidden"
                      style={{
                        backgroundImage: cityBackground,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-[46px] h-[10px]"
                          viewBox="0 0 46 10"
                          fill="none"
                        >
                          <circle cx="5" cy="5" r="5" fill="white" />
                          <circle cx="23" cy="5" r="5" fill="white" fillOpacity="0.13" />
                          <circle cx="41" cy="5" r="5" fill="white" fillOpacity="0.13" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AddInvestorsPopup
