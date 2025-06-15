"use client"

import { useState, useEffect } from "react" 

import BackButton from '../../assets/BackButton.svg';
import SearchIcon from '../../assets/SearchIcon.svg';
import CloseIcon from '../../assets/close_icon.svg';
import Investor from "../../assets/add_investor.jpg";
import LinkedIn from '../../assets/LinkedIn.svg';
import LinkIcon from '../../assets/link.svg';
import MailIcon from '../../assets/mail.svg';
import TwitterIcon from '../../assets/twitter.svg';
import WorkIcon from '../../assets/WorkIcon.svg';
import LocationIcon from '../../assets/LocationIcon.svg';
import DollarIcon from '../../assets/DollarIcon.svg';
import IndiaFlag from '../../assets/IndiaFlag.png';


import API_KEY from "../../../key.js"

// InvestorCard component for consistent investor display
const InvestorCard = ({ investor, isSelected, onClick }) => {
  // Log the full investor data to help debug
  console.log("Rendering investor card for:", investor);
  
  // Function to get match color based on percentage (copied from FindInvestors)
  const getMatchColor = (matchValue) => {
    if (!matchValue) return "bg-[#DE2D2D]";
    const value = parseInt(matchValue);
    if (value >= 0 && value <= 49) return "bg-[#DE2D2D]";
    if (value >= 50 && value <= 67) return "bg-[#AF4F00]";
    if (value >= 68 && value <= 85) return "bg-[#CC8D03]";
    if (value >= 86 && value <= 100) return "bg-[#0E8D07]";
    return "bg-[#DE2D2D]";
  };
  
  // Helper function to extract data from investor object considering different field names
  const getInvestorData = (investor) => {
    return {
      id: investor.id || investor._id,
      name: investor.name || "Unnamed Investor",
      company: investor.company || investor.firm || investor.fund || "Company not specified",
      avatar: investor.profile_image || investor.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      checkSize: investor.checkSize || investor.check_size || 
                (investor.check_size_ranges && investor.check_size_ranges.length > 0 ? 
                  investor.check_size_ranges[0] : "$N/A"),
      stage: investor.stage || 
             (investor.invests_in_rounds && investor.invests_in_rounds.length > 0 ? 
              investor.invests_in_rounds[0] : "N/A"),
      stageCount: investor.stageCount || 
                 (investor.invests_in_rounds ? 
                  `+${investor.invests_in_rounds.length - 1}` : "+0"),
      industry: investor.industry || 
               (investor.sectors && investor.sectors.length > 0 ? 
                investor.sectors[0] : "N/A"),
      industryCount: investor.industryCount || 
                    (investor.sectors ? 
                     `+${investor.sectors.length - 1}` : "+0"),
      geography: investor.geography || 
                (investor.geographies && investor.geographies.length > 0 ? 
                 `+${investor.geographies.length}` : "+0"),
      match: investor.match || "0%",
      matchValue: investor.matchValue || 0,
      type: investor.type || investor.title || "VC",
      contacts: investor.contacts || {}
    };
  };
    return (
    <div
      onClick={onClick}
      className={`flex items-center hover:bg-gray-800/30 transition-colors w-full rounded-md border-b border-gray-700/50 h-24 xl:h-[6.25rem] px-4 xl:px-6 ${
        isSelected ? "bg-[#18002C]" : "bg-black"
      }`}
    >
      {/* Get normalized investor data */}
      {(() => {
        const investorData = getInvestorData(investor);
        
        // Extract contacts
        const contacts = investor.contacts || {};
        
        return (
          <>
            {/* Left side - Name, Company, Social Icons */}
            <div className="flex items-center gap-x-4 w-[17rem] flex-shrink-0">
            <img
  src={investorData.avatar}
  alt={investorData.name}
  className="rounded object-contain w-12 h-12 xl:w-[3.75rem] xl:h-[3.75rem] bg-white"
  onError={(e) => {
    e.target.onerror = null; // prevents infinite loop
    e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  }}
/>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-white font-normal text-base truncate">
                    {investorData.name}
                  </span>
                  <div className="flex gap-1">
                    {contacts.linkedin && (
                      <img src={LinkedIn} alt="LinkedIn" className="w-2 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer" />
                    )}
                    {contacts.website && (
                      <img src={LinkIcon} alt="Link" className="w-2 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer" />
                    )}
                    {contacts.email && (
                      <img src={MailIcon} alt="Mail" className="w-2 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer" />
                    )}
                    {contacts.twitter && (
                      <img src={TwitterIcon} alt="Twitter" className="w-2 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer" />
                    )}
                    {/* If no contacts, show default icons */}
                    {!contacts.linkedin && !contacts.website && !contacts.email && !contacts.twitter && (
                      <>
                        <img src={LinkedIn} alt="LinkedIn" className="w-2 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer opacity-50" />
                        <img src={LinkIcon} alt="Link" className="w-2 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer opacity-50" />
                        <img src={MailIcon} alt="Mail" className="w-2 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer opacity-50" />
                        <img src={TwitterIcon} alt="Twitter" className="w-2 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer opacity-50" />
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1 overflow-hidden">
                  <span className="text-white text-[0.625rem] truncate max-w-[5rem]">
                    {investorData.company}
                  </span>
                  <span className="text-white text-[0.5rem] font-bold rounded-full bg-blue-600 w-[1.875rem] h-4 flex items-center justify-center flex-shrink-0">
                    {(investorData.type === "ACCELERATOR") ? "ACC" : "VC"}
                  </span>
                </div>
              </div>
            </div>

          
          </>
        );
      })()}
    </div>
  );
};

function AddInvestorsPopup({ isOpen, onClose, onInvestorsAdded, selectedList }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInvestor, setSelectedInvestor] = useState(null)
  const [addedInvestors, setAddedInvestors] = useState(new Set())
  const [addedInvestorsList, setAddedInvestorsList] = useState([]) // Added: Track list of actual investor objects
  const [showNotification, setShowNotification] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAddedInvestors, setShowAddedInvestors] = useState(false) // Added: Toggle for showing added investors
  // Log component initialization and selected list
  useEffect(() => {
    if (isOpen) {
      console.log("AddInvestorsPopup opened", { selectedList, API_KEY });
    }
  }, [isOpen, selectedList]);
    // Debug logs for monitoring data
  useEffect(() => {
    if (searchResults.length > 0) {
      console.log("Search result example:", searchResults[0]);
    }
  }, [searchResults]);
  
  // Debug logs for added investors
  useEffect(() => {
    console.log("Added investors list:", addedInvestorsList);
  }, [addedInvestorsList]);
  
  useEffect(() => {
    if (addedInvestorsList.length > 0) {
      console.log("Added investor example:", addedInvestorsList[0]);
    }
  }, [addedInvestorsList])

  // Reset states when popup is opened
  useEffect(() => {
    if (isOpen) {
      setAddedInvestors(new Set());
      setAddedInvestorsList([]);
      setShowAddedInvestors(false);
    }
  }, [isOpen]);

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
  // Show results layout if searching or showing added investors
  const showResults = searchTerm.trim().length > 0 || addedInvestorsList.length > 0 || showAddedInvestors

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
  const cityBackground = `url("data:image/svg+xml;base64,${btoa(citySvg)}")`;
  
  const handleInvestorClick = (investor) => {
    console.log("Selected investor:", investor);
    setSelectedInvestor(investor);
  };
  
  const handleToggleInvestor = async (investor) => {
    // Check if investor has an ID
    const investorId = investor.id || investor._id;
    if (!investorId) {
      console.error("Investor has no ID");
      alert("Error: Cannot identify investor");
      return;
    }
  
    const newAddedInvestors = new Set(addedInvestors);
    
    // If investor is already in the list, remove them
    if (addedInvestors.has(investorId)) {
      try {
        // Get the current list ID from the parent component
        const listId = selectedList?.id;
        if (!listId) {
          console.error("No list selected");
          return;
        }
        
        // API call to remove investor from list could go here
        // For now, we'll just update local state
        
        newAddedInvestors.delete(investorId);
        setAddedInvestors(newAddedInvestors);
        
        // Update the added investors list
        setAddedInvestorsList(prev => prev.filter(inv => (inv.id || inv._id) !== investorId));
        
        // Show success notification instead of alert
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } catch (error) {
        console.error('Error removing investor from target list:', error);
        alert('Failed to remove investor from target list');
      }
      return;
    }
    
    // Add the investor to the list
    try {
      // Get the current list ID from the parent component
      const listId = selectedList?.id;
      if (!listId) {
        console.error("No list selected");
        alert("Please select a list first");
        return;
      }      // Make API call to add investor to list
      console.log(`Adding investor ${investorId} to list ${listId}`);
      
      // First, try to get complete investor data if we only have basic info
      let enrichedInvestor = investor;
      if (!investor.sectors && !investor.check_size_ranges) {
        try {
          // Fetch full investor data
          const investorDetailsResponse = await fetch(`${API_KEY}/api/investors/${investorId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
          
          if (investorDetailsResponse.ok) {
            const detailsData = await investorDetailsResponse.json();
            if (detailsData.data) {
              console.log("Retrieved detailed investor data:", detailsData.data);
              enrichedInvestor = {
                ...investor,
                ...detailsData.data
              };
            }
          }
        } catch (detailsError) {
          console.log("Could not fetch detailed investor data:", detailsError);
          // Continue with original investor data
        }
      }
      
      const response = await fetch(`${API_KEY}/api/investors/add-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          investorId: investorId,
          listId: listId
        })
      });
        // Check response
      if (!response.ok) {
        // Try to parse error as JSON, but handle HTML errors too
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add investor');
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      }
      
      // Parse the successful response
      const result = await response.json();
        // Add to local state if API call succeeds
      newAddedInvestors.add(investorId);
      setAddedInvestors(newAddedInvestors);      // Make sure we have a complete investor object with all necessary fields
      // Use the same data normalization logic from the InvestorCard component
      const getInvestorDataForStorage = (investor) => {
        return {
          ...investor, // Keep all original data
          id: investorId,
          name: investor.name || "Unnamed Investor",
          company: investor.company || investor.firm || investor.fund || "Unknown Company",
          avatar: investor.profile_image || investor.avatar || "https://via.placeholder.com/75?text=Investor",
          checkSize: investor.checkSize || investor.check_size || 
                    (investor.check_size_ranges && investor.check_size_ranges.length > 0 ? 
                    investor.check_size_ranges[0] : "$N/A"),
          stage: investor.stage || 
                (investor.invests_in_rounds && investor.invests_in_rounds.length > 0 ? 
                investor.invests_in_rounds[0] : "N/A"),
          stageCount: investor.stageCount || 
                    (investor.invests_in_rounds ? 
                    `+${Math.max(0, investor.invests_in_rounds.length - 1)}` : "+0"),
          industry: investor.industry || 
                  (investor.sectors && investor.sectors.length > 0 ? 
                  investor.sectors[0] : "N/A"),
          industryCount: investor.industryCount || 
                      (investor.sectors ? 
                        `+${Math.max(0, investor.sectors.length - 1)}` : "+0"),
          geography: investor.geography || 
                  (investor.geographies && investor.geographies.length > 0 ? 
                    `+${investor.geographies.length}` : "+0"),
          match: investor.match || "0%",
          matchValue: investor.matchValue || 0,
          type: investor.type || investor.title || "VC",
          contacts: investor.contacts || {}
        };
      };
      
      // Use the enriched investor data we got from the API if available
      const completeInvestor = getInvestorDataForStorage(enrichedInvestor);
      
      console.log("Adding investor with complete data:", completeInvestor);
      
      // Add to the added investors list
      setAddedInvestorsList(prev => [...prev, completeInvestor]);
      
      // Show notification instead of alert
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
        // Show the added investors view after adding the first investor
      if(addedInvestorsList.length === 0) {
        setShowAddedInvestors(true);
      }
        } catch (error) {
      console.error('Error adding investor to target list:', error);
      
      // More user-friendly error message
      if (error.message.includes('404')) {
        alert('API endpoint not found. Please check the server configuration.');
      } else if (error.message.includes('401')) {
        alert('Authentication failed. Please try logging in again.');
      } else {
        alert(`Failed to add investor to target list: ${error.message}`);
      }
    }
  }
  const handleClose = () => {
    // Pass added investors back to parent when closing
    if (onInvestorsAdded && addedInvestorsList.length > 0) {
      onInvestorsAdded(addedInvestorsList);
    }
    onClose()
  }

  const isInvestorAdded = selectedInvestor ? addedInvestors.has(selectedInvestor.id) : false

  return (
    <>      {/* Notification Popup */}
      <div
        className={`fixed top-4 right-4 z-[100] transition-all duration-300 ease-in-out ${
          showNotification ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="w-[13.75rem] h-[3.25rem] rounded-[0.375rem] border border-[#18152D] bg-black flex items-center justify-between px-4 py-3 shadow-lg">
          <span className="text-white font-inter text-base font-medium">
            {addedInvestors.has(selectedInvestor?.id || selectedInvestor?._id) 
              ? "Investor added" 
              : "Investor removed"}
          </span>
          <button
            className="w-[2.8125rem] h-[1.28644rem] rounded-[0.125rem] bg-[#33005C] text-[#AD6FDE] text-[0.625rem] font-semibold flex items-center justify-center"
            onClick={() => setShowNotification(false)}
          >
            Close
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
              <img src={Investor}
                className="relative  flex items-center justify-center flex-shrink-0 w-32 sm:w-48 md:w-100 xl:w-[440px] h-24 sm:h-36 md:h-100 xl:h-[440px] rounded-sm sm:rounded-md overflow-hidden"
                style={{
                  // backgroundImage: cityBackground,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
       {/* <img src={Investor} />  dot svg */}
                {/* <div className="absolute bottom-2 sm:bottom-3 xl:bottom-6 left-1/2 transform -translate-x-1/2">
  
         <svg xmlns="http://www.w3.org/2000/svg" width="46" height="10" viewBox="0 0 46 10" fill="none">
  <circle key="circle1-top" cx="5" cy="5" r="5" fill="white"/>
  <circle key="circle2-top" cx="23" cy="5" r="5" fill="white" fillOpacity="0.13"/>
  <circle key="circle3-top" cx="41" cy="5" r="5" fill="white" fillOpacity="0.13"/>
</svg>

                </div> */}
              {/* </div> */}
            </div>
          ) : (
            // Layout when search results are shown
            <div className="flex flex-col w-full h-full">
              {/* Header with search bar */}              <div className="pt-12 sm:pt-14 md:pt-16 xl:pt-18 px-3 sm:px-4 md:px-6 xl:px-12 pb-4">
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-white font-inter text-sm sm:text-base md:text-lg xl:text-xl font-medium mb-1 leading-tight">
                      {showAddedInvestors ? "Added Investors" : "Add Investors from Vertx database"}
                    </h2>
                    <p className="text-[#B8B8B8] font-inter text-xs sm:text-sm font-normal leading-tight">
                      {showAddedInvestors 
                        ? `${addedInvestorsList.length} investors added to ${selectedList?.name || "list"}` 
                        : "Search investors by name, email, or firm"}
                    </p>
                  </div>
                  
                  {addedInvestorsList.length > 0 && (
                    <button
                      onClick={() => setShowAddedInvestors(!showAddedInvestors)}
                      className="bg-[#33005C] text-white px-3 py-2 rounded text-xs font-medium transition-colors hover:bg-[#4a0085] flex items-center"
                    >
                      {showAddedInvestors ? "Search More" : "View Added"}
                      <span className="ml-2 bg-white text-[#33005C] rounded-full px-1.5 py-0.5 text-xs">
                        {addedInvestorsList.length}
                      </span>
                    </button>
                  )}
                </div>

                {!showAddedInvestors && (
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
/>                    </button>
                  )}
                </div>
                )}
              </div>
              {/* Content area with results and details */}
              <div className="flex flex-1 overflow-hidden px-3 sm:px-4 md:px-6 xl:px-12 pb-3 sm:pb-4 md:pb-6 xl:pb-12 relative">                {/* Left side - Search results or Added Investors */}
                <div className="flex-1 pr-4 sm:pr-6 xl:pr-8">
                  <div
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md xl:max-w-[500px] bg-black rounded-[0.25rem] overflow-y-auto space-y-2 p-2"
                    style={{ height: "calc(100% - 2rem)" }}
                  >                    {showAddedInvestors ? (
                      // Show added investors view
                      addedInvestorsList.length > 0 ? (
                        addedInvestorsList.map((investor) => (
                          <InvestorCard
                            key={investor.id || investor._id}
                            investor={investor}
                            isSelected={selectedInvestor && (selectedInvestor.id === investor.id || selectedInvestor._id === investor._id)}
                            onClick={() => handleInvestorClick(investor)}
                          />
                        ))
                      ) : (
                        <div className="text-center text-[#B8B8B8] py-8">No investors added yet.</div>
                      )
                    ) : isLoading ? (
                      <div className="text-center text-[#B8B8B8] py-8">Searching investors...</div>                    ) : hasResults ? (
                      searchResults.map((investor) => (
                        <InvestorCard
                          key={investor.id || investor._id}
                          investor={investor}
                          isSelected={selectedInvestor && (selectedInvestor.id === investor.id || selectedInvestor._id === investor._id)}
                          onClick={() => handleInvestorClick(investor)}
                        />
                      ))
                    ) : (
                      <div className="text-center text-[#B8B8B8] py-8">No investors found matching your search.</div>
                    )}
                  </div>
                </div>                {/* Right side - Selected investor details */}
                {selectedInvestor && console.log(selectedInvestor)}
                {selectedInvestor && (
                  <div
                    className="relative flex-shrink-0 bg-[#0F0E16] rounded-lg flex flex-col"
                    style={{
                      width: "40%",
                      height: "100%",
                      padding: "2rem",
                      overflowY: "auto",
                    }}
                  >                    <div className="text-center flex-shrink-0">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-4 flex-shrink-0">
                        <img
                          src={selectedInvestor.profile_image || selectedInvestor.avatar || `${API_KEY}/placeholder.png`}
                          alt={selectedInvestor.name}
                          className="w-full h-full rounded-lg object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/200?text=Investor";
                          }}
                        />
                      </div>
                      <h2 className="text-white font-inter font-medium mb-3 text-xl sm:text-2xl md:text-3xl">
                        {selectedInvestor.name}
                      </h2>
                      <div className="flex justify-center gap-3 mb-6">
                        {selectedInvestor.linkedin && (
                          <img
                            key="linkedin"
                            src={LinkedIn}
                            alt="LinkedIn"
                            className="w-5 h-5 text-[#0077B5] hover:opacity-80 cursor-pointer"
                          />
                        )}
                        {selectedInvestor.website && (
                          <img
                            key="website"
                            src={LinkIcon}
                            alt="Link"
                            className="w-5 h-5 text-gray-400 hover:opacity-80 cursor-pointer"
                          />
                        )}
                        {selectedInvestor.email && (
                          <img                            key="email"
                            src={MailIcon}
                            alt="Mail"
                            className="w-5 h-5 text-gray-400 hover:opacity-80 cursor-pointer"
                          />
                        )}
                        {selectedInvestor.twitter && (
                          <img
                            key="twitter"
                            src={TwitterIcon}
                            alt="Twitter"
                            className="w-5 h-5 text-gray-400 hover:opacity-80 cursor-pointer"
                          />
                        )}
                      </div>
                    </div>                    <div className="space-y-6 flex-1 py-4">
                      {/* Company/Firm */}
                      <div className="flex items-center justify-center gap-3 text-white">
                        <img
                          src={WorkIcon}
                          alt="Work"
                          className="text-gray-400 flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7"
                        />
                        <span className="font-inter font-normal text-base sm:text-lg md:text-xl">
                          {selectedInvestor.company || selectedInvestor.firm || "N/A"}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center justify-center gap-3 text-white">
                        <img
                          src={LocationIcon}
                          alt="Location Icon"
                          className="text-gray-400 flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7"
                        />
                        <span className="font-inter font-normal text-base sm:text-lg md:text-xl">
                          {selectedInvestor.location || selectedInvestor.geography || "Location not specified"}
                        </span>
                      </div>

                      {/* Investment Size */}
                      <div className="flex items-center justify-center gap-3 text-white">
                        <img
                          src={DollarIcon}
                          alt="Dollar Icon"
                          className="text-gray-400 flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7"
                        />
                        <span className="font-inter font-normal text-base sm:text-lg md:text-xl">
                          {selectedInvestor.investment || selectedInvestor.checkSize || "Investment size not specified"}
                        </span>
                      </div>

                      {/* Additional Info - Stage */}
                      {selectedInvestor.stage && (
                        <div className="mt-6 text-center">
                          <span className="text-white font-inter font-medium text-base">Stage: </span>
                          <span className="text-white font-inter font-normal text-base">{selectedInvestor.stage}</span>
                          {selectedInvestor.stageCount && (
                            <span className="ml-2 text-[#B8B8B8] text-sm">{selectedInvestor.stageCount}</span>
                          )}
                        </div>
                      )}

                      {/* Additional Info - Industry */}
                      {selectedInvestor.industry && (
                        <div className="text-center">
                          <span className="text-white font-inter font-medium text-base">Industry: </span>
                          <span className="text-white font-inter font-normal text-base">{selectedInvestor.industry}</span>
                          {selectedInvestor.industryCount && (
                            <span className="ml-2 text-[#B8B8B8] text-sm">{selectedInvestor.industryCount}</span>
                          )}
                        </div>
                      )}
                    </div>                    <button 
                      onClick={() => handleToggleInvestor(selectedInvestor)}
                      className={`font-inter font-medium transition-colors mt-6 w-full py-3 sm:py-4 rounded flex-shrink-0 ${
                        addedInvestors.has(selectedInvestor.id || selectedInvestor._id)
                          ? "bg-[#DE2D2D] text-white hover:bg-[#C82828]"
                          : "bg-white text-black hover:bg-gray-100"
                      }`}
                    >
                      {addedInvestors.has(selectedInvestor.id || selectedInvestor._id) 
                        ? "Remove from target list" 
                        : "Add to target list"}
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
