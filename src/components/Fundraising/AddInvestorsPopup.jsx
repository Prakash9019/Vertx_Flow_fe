"use client"

import { useState, useEffect, useRef } from "react"
import BackButton from '../../assets/BackButton.svg';
import SearchIcon from '../../assets/SearchIcon.svg';
import CloseIcon from '../../assets/close_icon.svg';
import LinkedIn from '../../assets/LinkedIn.svg';
import LinkIcon from '../../assets/link.svg';
import MailIcon from '../../assets/mail.svg';
import TwitterIcon from '../../assets/twitter.svg';
import WorkIcon from '../../assets/WorkIcon.svg';
import LocationIcon from '../../assets/LocationIcon.svg';
import DollarIcon from '../../assets/DollarIcon.svg';
import IndiaFlag from '../../assets/IndiaFlag.png';
import DefaultAvatar from '../../assets/DefaultAvatar.svg';
import API_KEY from "../../../key.js"
import Investor from "../../assets/Investor.jpg"

// Simple base64 fallback avatar
const fallbackAvatar = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
// "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIzMCIgZmlsbD0iIzFGMjkzNyIvPgogIDxjaXJjbGUgY3g9IjMwIiBjeT0iMjMiIHI9IjgiIGZpbGw9IiM2QjcyODAiLz4KICA8cGF0aCBkPSJNMTUgNTJDMTUgNDQuMjY4IDIxLjI2OCAzOCAyOSAzOEgzMUMzOC43MzIgMzggNDUgNDQuMjY4IDQ1IDUyVjYwSDE1VjUyWiIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K";

// InvestorCard component
const InvestorCard = ({ investor, isSelected, onClick }) => {
  console.log("Rendering investor card for:", investor);
  const getCountString = (str, isGeography = false) => {
    if (!str) {
      return isGeography ? "+0" : "+0"; // Default for empty string
    }
    const items = str.split(',').filter(s => s.trim() !== '');
    if (items.length === 0) {
      return isGeography ? "+0" : "+0";
    }
    return isGeography ? `+${items.length}` : `+${items.length - 1}`;
  };
  const getMatchColor = (matchValue) => {
    if (!matchValue) return "bg-[#DE2D2D]";
    const value = parseInt(matchValue);
    if (value >= 0 && value <= 49) return "bg-[#DE2D2D]";
    if (value >= 50 && value <= 67) return "bg-[#AF4F00]";
    if (value >= 68 && value <= 85) return "bg-[#CC8D03]";
    if (value >= 86 && value <= 100) return "bg-[#0E8D07]";
    return "bg-[#DE2D2D]";
  };

  const getInvestorData = (investor) => {
    return {
      id: investor._id, // Use MongoDB's default _id as the primary identifier
      name: investor.name || "Unnamed Investor",
      company: investor.fund || "", // Maps to 'fund' in the new schema
      avatar: investor.profile_image || fallbackAvatar, // Maps to 'profile_image'
      checkSize: investor.cheque_range || "$N/A", // Directly uses 'cheque_range' from the new schema
      stage: investor.stage || "N/A", // Directly uses 'stage' (comma-separated string)
      stageCount: investor.stage.length, // Calculates count from 'stage' string
      industry: investor.industry || "N/A", // Directly uses 'industry' (comma-separated string)
      industryCount: investor.industry.length, // Calculates count from 'industry' string
      geography: investor.countries, // Maps to the count of 'countries'
      match: investor.match || "0%", // Assumed to be directly available on the investor object
      matchValue: investor.matchValue || 0, // Assumed to be directly available on the investor object
      type: investor.type || "VC",
      email:investor.email,
      twitter: investor.twitter,
      crunchbase:investor.crunchbase,
      linkedin:investor.linkedin_personal,
      website:investor.website
    };
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center hover:bg-gray-800/30 transition-colors w-full rounded-md border-b border-gray-700/50 h-24 xl:h-[6.25rem] px-4 xl:px-6 ${
        isSelected ? "bg-[#18002C]" : "bg-black"
      }`}
    >
      {(() => {
        const investorData = getInvestorData(investor);
        return (
          <>
            <div className="flex items-center gap-x-4 w-[17rem] flex-shrink-0">
              <img
                src={investorData.avatar}
                alt={investorData.name}
                className="rounded object-contain w-12 h-12 xl:w-[3.75rem] xl:h-[3.75rem] bg-white"
                onError={(e) => { e.target.src = fallbackAvatar; }}
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-normal text-sm xl:text-base truncate">
                    {investorData.name}
                  </span>
                  <div className="flex gap-1 flex-shrink-0">
                    {investorData.linkedin && (
                      <img src={LinkedIn} alt="LinkedIn" className="w-6 h-6 xl:w-2.5 xl:h-2.5 cursor-pointer" />
                    )}
                    {investorData.website && (
                      <img src={LinkIcon} alt="Link" className="w-6 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer" />
                    )}
                    {investorData.email && (
                      <img src={MailIcon} alt="Mail" className="w-6 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer" />
                    )}
                    {investorData.twitter && (
                      <img src={TwitterIcon} alt="Twitter" className="w-6 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer" />
                    )}
                    {!investorData.linkedin && !investorData.website && !investorData.email && !investorData.twitter && (
                      <>
                        <img src={LinkedIn} alt="LinkedIn" className="w-6 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer opacity-30" />
                        <img src={LinkIcon} alt="Link" className="w-6 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer opacity-30" />
                        <img src={MailIcon} alt="Mail" className="w-6 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer opacity-30" />
                        <img src={TwitterIcon} alt="Twitter" className="w-6 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer opacity-30" />
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 overflow-hidden">
                 { investorData.company && <span className="text-white text-[0.625rem] truncate max-w-[8rem]">
                    {investorData.company}
                  </span>}
                  <span className="text-white text-[0.5rem] font-bold rounded-full bg-blue-600 w-[1.875rem] h-4 flex items-center justify-center flex-shrink-0">
                    {investorData.type}
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [addedInvestors, setAddedInvestors] = useState(new Set());
  const [addedInvestorsList, setAddedInvestorsList] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddedInvestors, setShowAddedInvestors] = useState(false);
  
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      console.log("AddInvestorsPopup opened", { selectedList, API_KEY });
    }
  }, [isOpen, selectedList]);

  useEffect(() => {
    if (searchResults.length > 0) {
      console.log("Search result example:", searchResults[0]);
      // Automatically select the first investor when new search results are loaded
      if (!selectedInvestor || !searchResults.some(investor => (investor.id || investor._id) === (selectedInvestor.id || selectedInvestor._id))) {
        setSelectedInvestor(searchResults[0]);
      }
    } else {
      // Clear selected investor if no search results
      setSelectedInvestor(null);
    }
  }, [searchResults]);

  useEffect(() => {
    console.log("Added investors list:", addedInvestorsList);
  }, [addedInvestorsList]);

  useEffect(() => {
    if (addedInvestorsList.length > 0) {
      console.log("Added investor example:", addedInvestorsList[0]);
    }
  }, [addedInvestorsList]);

  useEffect(() => {
    if (isOpen) {
      setAddedInvestors(new Set());
      setAddedInvestorsList([]);
      setShowAddedInvestors(false);
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim().length > 0 && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchResults, showAddedInvestors, searchTerm]);

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
        console.log(response.data)
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

  if (!isOpen) return null;

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
  ];

  const hasResults = searchResults.length > 0;
  const showResults = searchTerm.trim().length > 0 || addedInvestorsList.length > 0 || showAddedInvestors;

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
  `;
  const cityBackground = `url("data:image/svg+xml;base64,${btoa(citySvg)}")`;

  const handleInvestorClick = (investor) => {
    console.log("Selected investor:", investor);
    setSelectedInvestor(investor);
  };
  const getCountString = (str, isGeography = false) => {
    if (!str) {
      return isGeography ? "+0" : "+0"; // Default for empty string
    }
    const items = str.split(',').filter(s => s.trim() !== '');
    if (items.length === 0) {
      return isGeography ? "+0" : "+0";
    }
    return isGeography ? `+${items.length}` : `+${items.length - 1}`;
  };

  const handleToggleInvestor = async (investor) => {
    const investorId = investor.id || investor._id;
    console.log(investorId)
    if (!investorId) {
      console.error("Investor has no ID");
      alert("Error: Cannot identify investor");
      return;
    }
  
    const newAddedInvestors = new Set(addedInvestors);
      if (addedInvestors.has(investorId)) {
      try {
        console.log(selectedList);
        const listId = selectedList?._id;
        console.log(listId);
        if (!listId) {
          console.error("No list selected");
          return;
        }
        console.log(listId);
        // Call backend API to remove investor from list
        const response = await fetch(`${API_KEY}/api/list/remove-investor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({
            listId: listId,
            investorId: investorId
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to remove investor from list');
        }

        // Update local state only after successful API call
        newAddedInvestors.delete(investorId);
        setAddedInvestors(newAddedInvestors);
        setAddedInvestorsList(prev => prev.filter(inv => (inv.id || inv._id) !== investorId));
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        
        console.log(`Successfully removed investor ${investorId} from list ${listId}`);
      } catch (error) {
        console.error('Error removing investor from target list:', error);
        alert('Failed to remove investor from target list');
      }
      return;
    }
    
    try {
      const listId = selectedList?.id;
      console.log(selectedList)
      console.log(investorId)
      if (!listId) {
        console.error("No list selected");
        alert("Please select a list first");
        return;
      }
      console.log(`Adding investor ${investorId} to list ${listId}`);
      
      let enrichedInvestor = investor;
      if (!investor.sectors && !investor.check_size_ranges) {
        try {
          const investorDetailsResponse = await fetch(`${API_KEY}/api/investors/${investorId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
          });
          
          if (investorDetailsResponse.ok) {
            const detailsData = await investorDetailsResponse.json();
            if (detailsData.data) {
              console.log("Retrieved detailed investor data:", detailsData.data);
              enrichedInvestor = { ...investor, ...detailsData.data };
            }
          }
        } catch (detailsError) {
          console.log("Could not fetch detailed investor data:", detailsError);
        }
      }
      
      const response = await fetch(`${API_KEY}/api/investors/add-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ investorId, listId })
      });
      
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add investor');
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      }
      
      const result = await response.json();
      newAddedInvestors.add(investorId);
      setAddedInvestors(newAddedInvestors);
      
      const getInvestorDataForStorage = (investor) => {
        return {
          ...investor,
          id: investor._id, // Use MongoDB's default _id as the primary identifier
          name: investor.name || "Unnamed Investor",
          company: investor.fund || "", // Maps to 'fund' in the new schema
          avatar: investor.profile_image || fallbackAvatar, // Maps to 'profile_image'
          checkSize: investor.cheque_range || "$N/A", // Directly uses 'cheque_range' from the new schema
          stage: investor.stage || "N/A", // Directly uses 'stage' (comma-separated string)
          stageCount: investor.stage.length, // Calculates count from 'stage' string
          industry: investor.industry || "N/A", // Directly uses 'industry' (comma-separated string)
          industryCount: investor.industry.length, // Calculates count from 'industry' string
          geography: investor.countries, // Maps to the count of 'countries'
          match: investor.match || "0%", // Assumed to be directly available on the investor object
          matchValue: investor.matchValue || 0, // Assumed to be directly available on the investor object
          type: investor.type || "VC",
          email:investor.email,
          twitter: investor.twitter,
          crunchbase:investor.crunchbase,
          linkedin:investor.linkedin_personal,
          website:investor.website
        };
      };
      
      const completeInvestor = getInvestorDataForStorage(enrichedInvestor);
      console.log("Adding investor with complete data:", completeInvestor);
      setAddedInvestorsList(prev => [...prev, completeInvestor]);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      if (addedInvestorsList.length === 0) {
        setShowAddedInvestors(true);
      }
    } catch (error) {
      console.error('Error adding investor to target list:', error);
      if (error.message.includes('404')) {
        alert('API endpoint not found. Please check the server configuration.');
      } else if (error.message.includes('401')) {
        alert('Authentication failed. Please try logging in again.');
      } else {
        alert(`Failed to add investor to target list: ${error.message}`);
      }
    }
  };

  const handleClose = () => {
    if (onInvestorsAdded && addedInvestorsList.length > 0) {
      onInvestorsAdded(addedInvestorsList);
    }
    onClose();
  };

  const isInvestorAdded = selectedInvestor ? addedInvestors.has(selectedInvestor.id || selectedInvestor._id) : false;

  return (
    <>
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
          <button
            onClick={handleClose}
            className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-5 md:left-6 xl:top-6 xl:left-8 flex items-center gap-1 sm:gap-2 xl:gap-3 hover:opacity-80 transition-opacity text-white z-10 whitespace-nowrap"
          >
            <img
              src={BackButton}
              alt="Back"
              className="flex-shrink-0"
              style={{ width: "1.3rem", height: "1.3rem" }}
            />
            <span className="font-inter text-xs sm:text-sm xl:text-base font-medium">Back</span>
          </button>

          {!showResults ? (
            <div className="flex flex-row items-center justify-between w-full min-h-[300px] sm:min-h-[400px] md:min-h-[480px] xl:min-h-[530px] p-3 sm:p-4 md:p-6 xl:p-12">
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
                      style={{ width: "1.3rem", height: "1.3rem" }}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    ref={searchInputRef}
                    className="w-full h-8 sm:h-10 md:h-12 xl:h-[50px] pl-8 sm:pl-10 md:pl-12 xl:pl-14 pr-10 sm:pr-12 xl:pr-14 rounded-md sm:rounded-lg border border-[#0f0e16] bg-black font-inter text-xs sm:text-sm font-normal text-white outline-none focus:outline-none"
                  />
                  {isLoading && (
                    <div className="absolute inset-y-0 right-2 sm:right-3 xl:right-4 flex items-center pointer-events-none">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              </div>
         
              <div 
  className="relative flex items-center justify-center flex-shrink-0 w-32 sm:w-48 md:w-[25rem] xl:w-[440px] h-24 sm:h-36 md:h-[25rem] xl:h-[440px] rounded-sm sm:rounded-md overflow-hidden"
>
  <img 
    src={Investor} 
    alt="Investor" 
    className="w-full h-full object-cover z-10"
  />
</div>



            </div>
          ) : (
            <div className="flex flex-col w-full h-full">
              <div className="pt-12 sm:pt-14 md:pt-16 xl:pt-18 px-3 sm:px-4 md:px-6 xl:px-12 pb-4">
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
                        style={{ width: "1.3rem", height: "1.3rem" }}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      ref={searchInputRef}
                      className="w-full h-8 sm:h-10 md:h-12 xl:h-[50px] pl-8 sm:pl-10 md:pl-12 xl:pl-14 pr-10 sm:pr-12 xl:pr-14 rounded-md sm:rounded-lg border border-[#0f0e16] bg-black font-inter text-xs sm:text-sm font-normal text-white outline-none focus:outline-none"
                    />
                    {isLoading && !searchTerm && (
                      <div className="absolute inset-y-0 right-2 sm:right-3 xl:right-4 flex items-center pointer-events-none">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      </div>
                    )}
                    {isLoading && searchTerm && (
                      <div className="absolute inset-y-0 right-8 sm:right-10 xl:right-12 flex items-center pointer-events-none">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      </div>
                    )}
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                      >
                        <img src={CloseIcon} alt="Close Icon" className="w-6 h-3"/>
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-1 overflow-hidden px-3 sm:px-4 md:px-6 xl:px-12 pb-3 sm:pb-4 md:pb-6 xl:pb-12 relative">
                <div className="flex-1 pr-4 sm:pr-6 xl:pr-8">
                  <div
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md xl:max-w-[500px] bg-black rounded-[0.25rem] overflow-y-auto space-y-2 p-2 scrollbar-hidden"
                    style={{ height: "calc(100% - 2rem)", scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    <style jsx>{`
                      .scrollbar-hidden::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                    {showAddedInvestors ? (
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
                      <div className="text-center text-[#B8B8B8] py-8">Searching investors...</div>
                    ) : hasResults ? (
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
                </div>
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
                    }}
                  >
                    <div className="text-center flex-shrink-0">
                    <div className="w-[12.5rem] h-[12.5rem] mx-auto mb-4 flex-shrink-0">
  <img
    src={selectedInvestor.profile_image || selectedInvestor.avatar || fallbackAvatar}
    alt={selectedInvestor.name}
    className="w-full h-full rounded-lg object-contain"
    onError={(e) => { e.target.src = fallbackAvatar; }}
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
                          <img
                            key="email"
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
                    </div>
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center justify-center gap-3 text-white">
                        <img
                          src={WorkIcon}
                          alt="Work"
                          className="text-gray-400 flex-shrink-0"
                          style={{ width: "1.87306rem", height: "1.87306rem" }}
                        />
                        <span className="font-inter font-normal" style={{ fontSize: "1.25rem" }}>
                          {selectedInvestor.company || selectedInvestor.fund || "N/A"}
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
                         {selectedInvestor.countries[0]}  {selectedInvestor.location || selectedInvestor.geography || "Location not specified"}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-3 text-white">
                        {/* <img
                          src={DollarIcon}
                          alt="Dollar Icon"
                          className="text-gray-400 flex-shrink-0"
                          style={{ width: "1.87306rem", height: "1.87306rem" }}
                        /> */}
                        <span className="font-inter font-normal" style={{ fontSize: "1.25rem" }}>
                          {selectedInvestor.investment || selectedInvestor.checkSize || "Investment size not specified"}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleToggleInvestor(selectedInvestor)}
                      className={`font-inter font-medium transition-colors mt-6 w-full flex-shrink-0 ${
                        addedInvestors.has(selectedInvestor.id || selectedInvestor._id)
                          ? "bg-[#DE2D2D] text-white hover:bg-[#C82828]"
                          : "bg-white text-black hover:bg-gray-100"
                      }`}
                      style={{
                        height: "3.75rem",
                        borderRadius: "0.25rem",
                        fontSize: "1rem",
                      }}
                    >
                      {addedInvestors.has(selectedInvestor.id || selectedInvestor._id) 
                        ? "Remove from target list" 
                        : "Add to target list"}
                    </button>
                  </div>
                )}
                {!selectedInvestor && (
                  <div className="flex-shrink-0 w-80 xl:w-[440px]">
                    <div
                      className="relative flex items-center justify-center h-full rounded-lg overflow-hidden"
                      style={{ backgroundImage: cityBackground, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="46" height="10" viewBox="0 0 46 10" fill="none">
                          <circle cx="5" cy="5" r="5" fill="white"/>
                          <circle cx="23" cy="5" r="5" fill="white" fillOpacity="0.13"/>
                          <circle cx="41" cy="5" r="5" fill="white" fillOpacity="0.13"/>
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
  );
}

export default AddInvestorsPopup;
