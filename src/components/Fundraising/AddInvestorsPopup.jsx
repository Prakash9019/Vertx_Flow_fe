"use client"

import { useState, useEffect } from "react" 

import BackButton from '../../assets/BackButton.svg';
import SearchIcon from '../../assets/SearchIcon.svg';
import CloseIcon from '../../assets/close_icon.svg';

import LinkedIn from '../../assets/LinkedIn.svg';
import LinkIcon from '../../assets/link.svg';
import MailIcon from '../../assets/mail.svg';
import TwitterIcon from '../../assets/twitter.svg';
import WorkIcon from '../../assets/workIcon.svg'; // replace with actual path to your SVG or PNG
import LocationIcon from '../../assets/LocationIcon.svg';
import DollarIcon from '../../assets/DollarIcon.svg';


import API_KEY from "../../../key.js"

function AddInvestorsPopup({ isOpen, onClose, onInvestorsAdded, selectedList }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInvestor, setSelectedInvestor] = useState(null)
  const [addedInvestors, setAddedInvestors] = useState(new Set())
  const [showNotification, setShowNotification] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Search for investors using API
  useEffect(() => {
    if (!isOpen) return;
    
    const searchInvestors = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch(`${API_KEY}/api/investors/search?name=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        setSearchResults(data.data || []);
      } catch (error) {
        console.error('Error searching investors:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    const debounceTimer = setTimeout(searchInvestors, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, isOpen]);

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



  const hasResults = searchResults.length > 0
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

  const handleToggleInvestor = async (investor) => {
    const newAddedInvestors = new Set(addedInvestors)
    
    if (addedInvestors.has(investor.id)) {
      newAddedInvestors.delete(investor.id)
      setAddedInvestors(newAddedInvestors)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
      return;
    }
    
    try {
      // Get the current list ID from the parent component
      const listId = selectedList?.id;
      if (!listId) {
        console.error("No list selected");
        return;
      }
      
      const response = await fetch(`${API_KEY}/api/investors/add-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          investorId: investor.id,
          listId: listId
        })
      });
      
      if (!response.ok) throw new Error('Failed to add investor');
      
      // Add to local state if API call succeeds
      newAddedInvestors.add(investor.id)
      setAddedInvestors(newAddedInvestors)
      
      // Show notification
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
      
    } catch (error) {
      console.error('Error adding investor to target list:', error);
      alert('Failed to add investor to target list');
    }
  }

  const handleClose = () => {
    // Pass added investors back to parent when closing
    if (onInvestorsAdded && addedInvestors.size > 0) {
      const addedInvestorData = searchResults.filter((investor) => addedInvestors.has(investor.id))
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
  <img
    src={BackButton}
    alt="Back"
    className="flex-shrink-0"
    style={{
      width: "1.3rem", // w-4
      height: "1.3rem", // h-4
      // Adjust sizes for sm and xl via CSS or tailwind as needed
    }}
  />
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
  <img
    src={SearchIcon}
    alt="Search"
    className="text-[#B8B8B8] flex-shrink-0"
    style={{
      width: "1.3rem",   // w-4
      height: "1.3rem",  // h-4
      // For sm and xl sizes, add responsive CSS if needed
      color: "#B8B8B8", // fallback for stroke color, but for img it won’t affect
    }}
  />
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
                <svg xmlns="http://www.w3.org/2000/svg" width="46" height="10" viewBox="0 0 46 10" fill="none">
  <circle key="circle1-top" cx="5" cy="5" r="5" fill="white"/>
  <circle key="circle2-top" cx="23" cy="5" r="5" fill="white" fillOpacity="0.13"/>
  <circle key="circle3-top" cx="41" cy="5" r="5" fill="white" fillOpacity="0.13"/>
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
  <img
    src={SearchIcon}
    alt="Search"
    className="text-[#B8B8B8] flex-shrink-0"
    style={{
      width: "1.3rem",   // w-4
      height: "1.3rem",  // h-4
      // For sm and xl sizes, add responsive CSS if needed
      color: "#B8B8B8", // fallback for stroke color, but for img it won’t affect
    }}
  />
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


<img
  src={CloseIcon}
  alt="Close Icon"
  className="w-3 h-3"
/>

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
                    {isLoading ? (
                      <div className="text-center text-[#B8B8B8] py-8">Searching investors...</div>
                    ) : hasResults ? (
                      searchResults.map((investor) => (
                        <div
                          key={investor.id}
                          onClick={() => handleInvestorClick(investor)}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-[#18002C] ${
                            selectedInvestor?.id === investor.id ? "bg-[#18002C]" : "bg-transparent"
                          }`}
                          style={{ height: "6.75rem" }}
                        >
                          <img
                            src={investor.profile_image || "/placeholder.svg"}
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
                                {investor.linkedin && (
                                  <img
                                    key={`linkedin-${investor.id}`}
                                    src={LinkedIn}
                                    alt="LinkedIn"
                                    style={{ width: "1.25rem", height: "1.25rem" }}
                                    className="text-[#0077B5]"
                                  />
                                )}
                                {investor.website && (
                                  <img
                                    key={`website-${investor.id}`}
                                    src={LinkIcon}
                                    alt="Link Icon"
                                    className="text-gray-400"
                                    style={{ width: "1.25rem", height: "1.25rem" }}
                                  />
                                )}
                                {investor.email && (
                                  <img
                                    key={`email-${investor.id}`}
                                    src={MailIcon}
                                    alt="Mail Icon"
                                    className="text-gray-400"
                                    style={{ width: "1.25rem", height: "1.25rem" }}
                                  />
                                )}
                                {investor.twitter && (
                                  <img
                                    key={`twitter-${investor.id}`}
                                    src={TwitterIcon}
                                    alt="Twitter Icon"
                                    className="text-gray-400"
                                    style={{ width: "1.25rem", height: "1.25rem" }}
                                  />
                                )}
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
                              {investor.title || "INVESTOR"}
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
                        {selectedInvestor.linkedin && (
                          <img
                            key="linkedin"
                            src={LinkedIn}
                            alt="LinkedIn"
                            style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }}
                            className="text-[#0077B5] hover:opacity-80"
                          />
                        )}
                        {selectedInvestor.website && (
                          <img
                            key="website"
                            src={LinkIcon}
                            alt="Link"
                            style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }}
                            className="text-gray-400 hover:opacity-80"
                          />
                        )}
                        {selectedInvestor.email && (
                          <img
                            key="email"
                            src={MailIcon}
                            alt="Mail"
                            style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }}
                            className="text-gray-400 hover:opacity-80"
                          />
                        )}
                        {selectedInvestor.twitter && (
                          <img
                            key="twitter"
                            src={TwitterIcon}
                            alt="Twitter"
                            style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }}
                            className="text-gray-400 hover:opacity-80"
                          />
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 flex-1">
                    

<div className="flex items-center justify-center gap-3 text-white">
  <img
    src={WorkIcon}
    alt="Work"
    style={{ width: "1.87306rem", height: "1.87306rem" }}
    className="text-gray-400 flex-shrink-0"
  />
  <span className="font-inter font-normal" style={{ fontSize: "1.25rem" }}>
    {selectedInvestor.company}
  </span>
</div>


                      <div className="flex items-center justify-center gap-3 text-white">
                    

<img
  src={LocationIcon}
  alt="Location Icon"
  className="text-gray-400 flex-shrink-0"
  style={{ width: "1.87306rem", height: "1.87306rem" }}
/>

                        <span className="font-inter font-normal" style={{ fontSize: "1.25rem" }}>
                          {selectedInvestor.location}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-3 text-white">
                      <img
  src={DollarIcon}
  alt="Dollar Icon"
  className="text-gray-400 flex-shrink-0"
  style={{ width: "1.87306rem", height: "1.87306rem" }}
/>

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
                      <svg xmlns="http://www.w3.org/2000/svg" width="46" height="10" viewBox="0 0 46 10" fill="none">
  <circle key="circle1" cx="5" cy="5" r="5" fill="white"/>
  <circle key="circle2" cx="23" cy="5" r="5" fill="white" fillOpacity="0.13"/>
  <circle key="circle3" cx="41" cy="5" r="5" fill="white" fillOpacity="0.13"/>
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
