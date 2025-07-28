"use client"

// updated page with Target component - converted to responsive Tailwind

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Sidebar from "../Sidebar"
import AddRoundPopup from "./AddRoundPopup"
import FindInvestors from "./FindInvestors"
import Target from "./Target"
import BgImg from "../../assets/imgBackground.png";
import { useStartupProfile } from "../../context/StartupProfileContext";
import API_KEY from "../../../key";
// import Raise from 
function FundraisingManagePage() {
  
  const { profileData } = useStartupProfile();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState("Manage")
  const [activeSubTab, setActiveSubTab] = useState("Current Round")
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [hasActiveRound, setHasActiveRound] = useState(false)
  const [roundData, setRoundData] = useState(null)
  const [isTargetListSelected, setIsTargetListSelected] = useState(false)
  const [fundingRounds, setFundingRounds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const tabsArray = ["Manage", "Find", "Target"]  // Initialize activeTab based on URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/manage')) {
      setActiveTab('Manage');
    } else if (path.includes('/find')) {
      setActiveTab('Find');
    } else if (path.includes('/target')) {
      setActiveTab('Target');
    }  else if (path === '/fundraising/raise') {
      // Default to Manage if only /fundraising/raise is accessed
      setActiveTab('Manage');
      navigate('/fundraising/raise/manage', { replace: true });
    } else {
      // Default to Manage for any other case
      setActiveTab('Manage');
    }
  }, [location.pathname, navigate]);

  // Function to handle tab change with URL update
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Update URL based on selected tab
    const baseUrl = '/fundraising/raise';
    switch(tab) {
      case 'Manage':
        navigate(`${baseUrl}/manage`);
        break;
      case 'Find':
        navigate(`${baseUrl}/find`);
        break;
      case 'Target':
        navigate(`${baseUrl}/target`);
        break;
      default:
        navigate(`${baseUrl}/manage`);
    }
  };

  // Fetch funding rounds on component mount
  useEffect(() => {
    fetchFundingRounds();
  }, []);  const fetchFundingRounds = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_KEY}/api/funding-rounds`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          // 404 could mean no funding rounds exist, which is normal
          setFundingRounds([]);
          setHasActiveRound(false);
          setRoundData(null);
          return;
        }
        throw new Error(`Failed to fetch funding rounds: ${response.status}`);
      }

      const responseData = await response.json();
      
      // Extract the actual funding rounds from the response
      const fundingRoundsArray = responseData.data || responseData;
      setFundingRounds(fundingRoundsArray);
      
      // Check if there are any active rounds
      if (fundingRoundsArray && fundingRoundsArray.length > 0) {
        setHasActiveRound(true);
        setRoundData(fundingRoundsArray[0]); // Use the most recent round (sorted by createdAt desc)
      } else {
        setHasActiveRound(false);
        setRoundData(null);
      }
    } catch (err) {
      console.error('Error fetching funding rounds:', err);
      setError(err.message);
      // If there's an error, assume no rounds and show the add button
      setHasActiveRound(false);
      setRoundData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate days until close date
  const calculateDaysToClose = (plannedCloseDate) => {
    if (!plannedCloseDate) return "TBD";
    
    const closeDate = new Date(plannedCloseDate);
    const today = new Date();
    const diffTime = closeDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    return `${diffDays} days`;
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (!amount) return "$0";
    
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `$${amount.toLocaleString()}`;
    }
  };

  // Helper function to calculate progress percentage
  const calculateProgress = (raised, target) => {
    if (!target || target === 0) return 0;
    return Math.min((raised / target) * 100, 100);
  };

  // Helper function to get round type display
  const getRoundTypeDisplay = (roundData) => {
    if (!roundData) return "Current Round";
    
    if (roundData.isBridgeRound) {
      return `${roundData.lastPrimaryRoundType} ${roundData.bridgeOrExtensionType}`;
    } else {
      return roundData.bridgeOrExtensionType || roundData.lastPrimaryRoundType || "Current Round";
    }
  };

  const handleAddRoundClick = () => {
    setIsPopupOpen(true)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
  }
  const handleNextClick = (data) => {
    setRoundData(data)
    setHasActiveRound(true)
    setIsPopupOpen(false)
    // Refresh funding rounds after adding a new one
    fetchFundingRounds();
  }

  const handleUpdateRound = () => {
    console.log("Update round clicked")
  }

  const handleCloseRound = () => {
    setHasActiveRound(false)
    setRoundData(null)
  }

  return (
    <div className="min-h-screen bg-black text-white flex relative">
      {/* Sidebar */}
      <div className="bg-black text-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto">
        {/* Header - Hidden when target list is selected */}
        {!(activeTab === "Target" && isTargetListSelected) && (
          <div
            className="relative text-white w-full h-[11.375rem] bg-[#f0f0f0] bg-no-repeat bg-[size:100%_100%] bg-center"
            style={{
              backgroundImage: `url("${BgImg}")`,
            }}
          >
          <div className="absolute inset-0 z-0 bg-black/80"></div>
            <div
              className="relative z-10 flex flex-col justify-between h-full pl-8 md:pl-[3.44rem] pr-9 md:pr-[3.87rem] pt-10 md:pt-[4.06rem] pb-6"
            >
              <div>
                <h1
                  className="text-white font-semibold mb-2 text-[2rem]"
                  style={{ fontFamily: "Inter" }}>
                  {profileData ? profileData.companyName : "Company"}
                </h1>
                <p className="text-white mb-2 text-xs font-semibold" style={{ fontFamily: "Inter" }}>
                  {profileData ? profileData.companyName : "This company"} helps A to solve B by addition of C and D.
                </p>
                <p className="text-white mb-4 text-[0.625rem] font-medium" style={{ fontFamily: "Inter" }}>
                  {profileData ? profileData.companyWebsite : "www.companyname.com"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs - Hidden when target list is selected */}
        {!(activeTab === "Target" && isTargetListSelected) && (        
            <div className="flex gap-4 pl-8 md:pl-[3.44rem] pr-9 md:pr-[3.87rem] mt-3 md:mt-[1.69rem]">
            {tabsArray.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`rounded-full transition-colors h-10 text-base
                  ${activeTab === tab
                    ? 'w-[6.25rem] bg-white text-black font-medium'
                    : 'w-[5rem] bg-[#0F0E16] text-[#656565] font-normal'
                  }
                `}
                style={{
                  fontFamily: "Inter",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Tab Content */}
        <div className="pl-8 md:pl-14 pr-9 md:pr-16"
          // style={{
          //   paddingLeft: activeTab === "Target" && isTargetListSelected ? "0" : "3.44rem",
          //   paddingRight: activeTab === "Target" && isTargetListSelected ? "0" : "3.87rem",
          // }}
        >
          {activeTab === "Manage" && (
            <div className="pt-8 md:pt-12">
              <div className="mb-8">
                <div className="flex items-center mb-6 md:mb-8">
                  <div className="bg-purple-500 mr-2 w-[0.3125rem] h-7"></div>
                  <h2 className="text-white text-lg sm:text-xl md:text-2xl xl:text-[1.5rem] font-semibold font-inter">
                    Manage your fundraising
                  </h2>
                </div>

                {/* Sub Navigation */}
                <div className="flex gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-[5.12rem]">
                  <div className="relative pl-5">
                    <button
                      onClick={() => setActiveSubTab("Current Round")}
                      className="pb-2 transition-colors font-inter text-sm sm:text-base font-medium"
                      style={{
                        color: activeSubTab === "Current Round" ? "#FFF" : "#B8B8B8",
                      }}
                    >
                      Current Round
                    </button>
                    {activeSubTab === "Current Round" && (
                      <div className="absolute bottom-0 left-5 w-28 h-1 rounded-full bg-[#AD6FDE]"></div>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setActiveSubTab("History")}
                      className="pb-2 transition-colors font-inter text-sm sm:text-base font-medium"
                      style={{
                        color: activeSubTab === "History" ? "#FFF" : "#B8B8B8",
                      }}
                    >
                      History
                    </button>
                    {activeSubTab === "History" && (
                      <div className="absolute bottom-0 left-0 w-14 h-1 rounded-full bg-[#AD6FDE]"></div>
                    )}
                  </div>
                </div>

                {/* Main Card */}
                <div className="w-full">
                  {hasActiveRound && roundData ? (
                    // Active Round Display
                    <div className="rounded-lg bg-[#0F0E16] h-[18.75rem] px-6 sm:px-8 md:px-12 xl:px-[3.13rem] py-8 sm:py-10 xl:py-[2.75rem]">
                      {/* Header with title and buttons */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-[3.44rem]">                        <h3 className="text-white text-lg sm:text-xl xl:text-[1.25rem] font-semibold font-inter">
                          {getRoundTypeDisplay(roundData)}
                        </h3>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            onClick={handleUpdateRound}
                            className="transition-colors hover:bg-purple-700 h-9 px-4 rounded-sm bg-[#5F248D] text-white font-inter text-sm font-medium flex-1 sm:flex-none sm:w-[8.5rem]"
                          >
                            Update Round
                          </button>
                          <button
                            onClick={handleCloseRound}
                            className="transition-colors hover:bg-red-600 h-9 px-4 rounded-sm bg-[#DE2D2D] text-white font-inter text-sm font-medium flex-1 sm:flex-none sm:w-[8.5rem]"
                          >
                            Close Round
                          </button>
                        </div>
                      </div>                      {/* Progress section */}
                      <div className="mb-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-inter text-sm font-bold">
                            {formatCurrency(roundData?.amountWiredOrCommitted || 0)}
                          </span>
                          <span className="text-white font-inter text-sm font-bold">
                            {Math.round(calculateProgress(roundData?.amountWiredOrCommitted || 0, roundData?.plannedRaiseAmount || 0))}% raised of {formatCurrency(roundData?.plannedRaiseAmount || 0)} target
                          </span>
                        </div>
                      </div>                      {/* Progress bar */}
                      <div className="w-full h-[0.8125rem] rounded-full bg-white bg-opacity-13 mb-8 sm:mb-[2.81rem]">
                        <div 
                          className="h-[0.8125rem] rounded-full bg-[#305FC4]" 
                          style={{ 
                            width: `${calculateProgress(roundData?.amountWiredOrCommitted || 0, roundData?.plannedRaiseAmount || 0)}%`,
                            minWidth: calculateProgress(roundData?.amountWiredOrCommitted || 0, roundData?.plannedRaiseAmount || 0) > 0 ? '8px' : '0'
                          }}
                        ></div>
                      </div>

                      {/* Bottom stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">                        {/* Amount to raise */}
                        <div className="text-center">
                          <p className="text-[#B8B8B8] font-inter text-sm font-medium mb-2">
                            Amount to raise
                          </p>
                          <p className="text-white font-inter text-lg sm:text-xl font-semibold">
                            {formatCurrency(roundData?.plannedRaiseAmount || 0)}
                          </p>
                        </div>                        {/* Closing in */}
                        <div className="text-center">
                          <p className="text-[#B8B8B8] font-inter text-sm font-medium mb-2">
                            Closing in
                          </p>
                          <p className="text-white font-inter text-lg sm:text-xl font-semibold">
                            {calculateDaysToClose(roundData?.plannedCloseDate)}
                          </p>
                        </div>                        {/* Lead Investor */}
                        <div className="text-center">
                          <p className="text-[#B8B8B8] font-inter text-sm font-medium mb-2">
                            Lead Investor
                          </p>
                          <p className="text-white font-inter text-lg sm:text-xl font-semibold">
                            {roundData?.isLeadInvestorCommitted ? "Secured" : "Pending"}
                          </p>
                        </div>                        {/* Term Sheet */}
                        <div className="text-center">
                          <p className="text-[#B8B8B8] font-inter text-sm font-medium mb-2">
                            Term Sheet
                          </p>
                          <p className="text-white font-inter text-lg sm:text-xl font-semibold">
                            {roundData?.isTermSheetSigned ? "Signed" : "Pending"}
                          </p>
                        </div>
                      </div>                    </div>
                  ) : isLoading ? (
                    // Loading state
                    <div className="backdrop-blur-sm rounded-lg border border-gray-800/50 relative w-full h-60 bg-[#0F0E16] flex items-center justify-center">
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                      </div>
                    </div>
                  ) : (
                    // No Active Round Display
                    <div className="backdrop-blur-sm rounded-lg border border-gray-800/50 relative w-full h-60 bg-[#0F0E16]">
                      <h3 className="text-white absolute top-13 md:top-20 left-0 right-0 mx-auto font-inter text-sm font-semibold text-center px-4">
                        No fundraising round is currently open.
                      </h3>
                      <p className="absolute top-24 md:top-[6.81rem] left-0 right-0 mx-auto text-[#B8B8B8] font-inter text-xs font-normal text-center max-w-2xl px-4">
                        Open a new round to add the fundraising information and track progress.
                      </p>
                      <button
                        onClick={handleAddRoundClick}
                        className=" md:mt-0 transition-colors flex items-center justify-center absolute top-36 left-0 right-0 mx-auto w-[5.625rem] h-[1.875rem] rounded bg-[#33005C] hover:bg-purple-700"
                      >
                        <span className="text-white font-inter text-[0.625rem] font-semibold">
                          + Add Round
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "Find" && <FindInvestors />}

          {activeTab === "Target" && <Target onListSelect={setIsTargetListSelected} />}

          
        </div>
      </div>

      {/* Add Round Popup */}
      <AddRoundPopup isOpen={isPopupOpen} onClose={handleClosePopup} onNext={handleNextClick} />
    </div>
  )
}

export default FundraisingManagePage