import React, { useState } from 'react';
import { Search, MoreVertical, ChevronDown } from 'lucide-react';

// Simple base64 fallback avatar
const fallbackAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIzMCIgZmlsbD0iIzFGMjkzNyIvPgogIDxjaXJjbGUgY3g9IjMwIiBjeT0iMjMiIHI9IjgiIGZpbGw9IiM2QjcyODAiLz4KICA8cGF0aCBkPSJNMTUgNTJDMTUgNDQuMjY4IDIxLjI2OCAzOCAyOSAzOEgzMUMzOC43MzIgMzggNDUgNDQuMjY4IDQ1IDUyVjYwSDE1VjUyWiIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K";

function FindInvestors() {
  const [activeFindTab, setActiveFindTab] = useState("Investors");
  const [advancedFiltersOn, setAdvancedFiltersOn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [geographyDropdownOpen, setGeographyDropdownOpen] = useState(false);
  const [selectedGeographies, setSelectedGeographies] = useState([]);
  const itemsPerPage = 10;

  const findTabsArray = ["Venture Firms", "Investors", "Import"];

  const geographyOptions = [
    'India',
    'United States', 
    'United Kingdom',
    'Europe',
    'UAE',
    'Canada',
    'Australia'
  ];

  // Mock investor data
  const investorData = [
    {
      id: 1,
      name: "Alex Bogusky",
      company: "Batshit Crazy Ventures",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80",
      checkSize: "$500K",
      stage: "Pre-Seed",
      stageCount: "+3",
      industry: "AI/ML",
      industryCount: "+10",
      geography: "+18",
      match: "23%",
      matchColor: "#DE2D2D",
      matchValue: 23
    },
  ];

  // Function to get match color based on percentage
  const getMatchColor = (matchValue) => {
    if (matchValue >= 0 && matchValue <= 49) return "bg-[#DE2D2D]";
    if (matchValue >= 50 && matchValue <= 67) return "bg-[#AF4F00]";
    if (matchValue >= 68 && matchValue <= 85) return "bg-[#CC8D03]";
    if (matchValue >= 86 && matchValue <= 100) return "bg-[#0E8D07]";
    return "bg-[#DE2D2D]";
  };

  // Pagination calculations
  const totalPages = Math.ceil(investorData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvestors = investorData.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleGeographyToggle = (geography) => {
    setSelectedGeographies(prev => 
      prev.includes(geography) 
        ? prev.filter(g => g !== geography)
        : [...prev, geography]
    );
  };

  const resetAllGeographies = () => {
    setSelectedGeographies([]);
  };

  return (
    <div className="pt-12 font-inter" onClick={() => {
      setActiveDropdown(null);
      setGeographyDropdownOpen(false);
    }}>
      {/* Find Tab Navigation - Fixed */}
      <div className="flex gap-12 mb-12">
        {findTabsArray.map((tab) => (
          <div key={tab} className="relative">
            <button 
              onClick={() => setActiveFindTab(tab)}
              className={`pb-2 transition-colors font-medium text-base ${
                activeFindTab === tab ? 'text-white' : 'text-[#B8B8B8]'
              }`}
            >
              {tab}
            </button>
            {activeFindTab === tab && (
              <div 
                className={`absolute bottom-0 left-0 h-1 rounded-full bg-[#AD6FDE] ${
                  tab === "Venture Firms" ? 'w-[7.5rem]' : 
                  tab === "Investors" ? 'w-[4.5rem]' : 'w-[4rem]'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {activeFindTab === "Investors" && (
        <div className="mb-12">
          <div className="bg-[#0F0E16] p-6 rounded-[0.625rem]">
            {/* Search and Filters */}
            <div className="flex items-center justify-between mb-6 min-w-0">
              <div className="relative flex-shrink-0 w-[12.5rem]">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-[0.875rem] h-[0.875rem]" 
                />
                <input
                  type="text"
                  placeholder="Search database..."
                  className="w-full h-[1.875rem] rounded-[0.1875rem] bg-black text-gray-400 font-normal text-[0.625rem] pl-8 pr-2 border-none outline-none"
                />
              </div>
              
              <div className="flex ml-6 gap-x-2 sm:gap-x-4 md:gap-x-6 xl:gap-x-10 min-w-0">
                {['Type', 'Stage', 'Industry'].map((label) => (
                  <div className="relative flex-shrink-0" key={label}>
                    <select 
                      className="bg-black text-left text-gray-400 font-normal text-[0.625rem] border-none outline-none appearance-none pr-6 pl-3 py-1 rounded-[0.1875rem] h-[1.75rem]"
                    >
                      <option>{label}</option>
                    </select>
                    <ChevronDown 
                      className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none w-[0.75rem] h-[0.75rem] text-[#B8B8B8]"
                    />
                  </div>
                ))}

                {/* Geography Dropdown - FIXED VERSION */}
                <div className="relative flex-shrink-0">
                <button
  onClick={(e) => {
    e.stopPropagation();
    setGeographyDropdownOpen(!geographyDropdownOpen);
  }}
  className={`relative text-left text-gray-400 font-normal text-[0.625rem] outline-none appearance-none pr-6 pl-3 py-1 h-[1.75rem] flex items-center transition-all rounded-[0.1875rem] border ${
    selectedGeographies.length > 0 
      ? 'border-[#33005C]' 
      : 'border-transparent'
  } bg-black`}
>

                    Geography
                    <ChevronDown 
                      className="ml-2 w-[0.75rem] h-[0.75rem] text-[#B8B8B8]"
                    />
                    
                    {/* Selection Count Badge */}
                    {selectedGeographies.length > 0 && (
                      <div 
                        className="absolute -top-1.5 -right-1.5 w-[0.8125rem] h-[0.8125rem] rounded-full bg-[#33005C] flex items-center justify-center"
                        style={{
                          color: '#FFF',
                          fontFamily: 'Inter',
                          fontSize: '0.5rem',
                          fontWeight: '500'
                        }}
                      >
                        {selectedGeographies.length}
                      </div>
                    )}
                  </button>

                  {/* Geography Dropdown Menu */}
                  {geographyDropdownOpen && (
                    <div 
                      className="absolute left-0 top-8 border border-[#0F0E16] w-[7.4375rem] h-[10.25rem] rounded-[0.25rem] bg-black z-50"
                    >
                      <div className="py-1 px-1  h-full">
                        {geographyOptions.map((geography, index) => (
                          <button
                            key={index}
                            className="w-full flex items-center justify-between px-2 py-1 text-left transition-colors rounded-[0.1875rem] text-white text-[0.5rem] font-medium h-[1.0625rem] hover:bg-[#33005C] hover:w-[7.3125rem]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGeographyToggle(geography);
                            }}
                          >
                            <span>{geography}</span>
                            {selectedGeographies.includes(geography) && (
                              <svg
                                width="0.5rem"
                                height="0.5rem"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10 3L4.5 8.5L2 6"
                                  stroke="#FFF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </button>
                        ))}
                        
                        {/* Divider Line */}
                        <div 
                          className="mx-auto my-1 w-[6.5rem] h-[0.0625rem] bg-[#333]"
                        ></div>
                        
                        {/* Reset All Button */}
                        <button
                          className="w-full text-center py-1 text-[#AD6FDE] text-[0.375rem] font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            resetAllGeographies();
                          }}
                        >
                          Reset All
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setAdvancedFiltersOn(!advancedFiltersOn)}
                  className="flex items-center gap-2 bg-black text-gray-400 font-normal text-[0.625rem] border-none rounded-[0.1875rem] outline-none px-3 py-1 flex-shrink-0 h-[1.75rem]"
                >
                  Advanced Filters
                  <div className="relative w-7 h-4">
                    <div 
                      className={`absolute inset-0 rounded-full transition-colors ${
                        advancedFiltersOn ? 'bg-[#9333EA]' : 'bg-[#374151]'
                      }`}
                    ></div>
                    <div 
                      className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
                        advancedFiltersOn ? 'translate-x-[0.825rem]' : 'translate-x-0.5'
                      }`}
                    ></div>
                  </div>
                </button>
              </div>
            </div>



            {/* Table Header */}
            <div className="flex items-center py-4 px-4 xl:px-6">
              {/* Fixed Width Container for Investor Name Header */}
              <div className="w-[17rem] flex-shrink-0">
                <div className="text-white font-semibold text-[0.5rem] uppercase tracking-[0.05em]">
                  INVESTOR NAME
                </div>
              </div>

              {/* Details Headers Section */}
              <div className="flex items-center justify-between flex-grow gap-x-2 sm:gap-x-4 md:gap-x-6 xl:gap-x-10 overflow-hidden min-w-0">
                {/* Check Size Header */}
                <div className="flex justify-center flex-shrink-0 w-[3rem]">
                  <div className="text-white font-semibold text-[0.5rem] uppercase tracking-[0.05em] text-center whitespace-nowrap">
                    CHECK SIZE
                  </div>
                </div>

                {/* Stage Header */}
                <div className="flex justify-center flex-shrink-0 w-[4rem]">
                  <div className="text-white font-semibold text-[0.5rem] uppercase tracking-[0.05em] text-center whitespace-nowrap">
                    STAGE
                  </div>
                </div>

                {/* Industry Header */}
                <div className="flex justify-center flex-shrink-0 w-[4rem]">
                  <div className="text-white font-semibold text-[0.5rem] uppercase tracking-[0.05em] text-center whitespace-nowrap">
                    INDUSTRY
                  </div>
                </div>

                {/* Geography Header */}
                <div className="flex justify-center flex-shrink-0 w-[4rem]">
                  <div className="text-white font-semibold text-[0.5rem] uppercase tracking-[0.05em] text-center whitespace-nowrap">
                    GEOGRAPHY
                  </div>
                </div>

                {/* Match Header */}
                <div className="flex justify-center flex-shrink-0 w-[3rem]">
                  <div className="text-white font-semibold text-[0.5rem] uppercase tracking-[0.05em] text-center whitespace-nowrap">
                    MATCH
                  </div>
                </div>

                {/* Submit Deck Header */}
                <div className="flex justify-center flex-shrink-0 w-[4rem]">
                  <div className="text-white font-semibold text-[0.5rem] uppercase tracking-[0.05em] text-center whitespace-nowrap">
                    SUBMIT DECK
                  </div>
                </div>

                {/* Options Header */}
                <div className="flex-shrink-0 w-[1.5rem]"></div>
              </div>
            </div>

            {/* Scrollable Investor List */}
            <div className="bg-gray-900/30 rounded-b-lg max-h-96 overflow-y-auto scrollbar-hide">
              {currentInvestors.map((investor) => (
                <div 
                  key={investor.id}
                  className="flex items-center bg-black hover:bg-gray-800/30 transition-colors w-full rounded-md border-b border-gray-700/50 h-24 xl:h-[6.25rem] px-4 xl:px-6"
                >
                  {/* Fixed Width Container for Avatar + Name + Links */}
                  <div className="flex items-center gap-x-4 w-[17rem] flex-shrink-0">
                    <img 
                      src={investor.avatar} 
                      alt={investor.name}
                      className="rounded object-cover w-12 h-12 xl:w-[3.75rem] xl:h-[3.75rem]"
                      onError={(e) => {
                        e.target.src = fallbackAvatar;
                      }}
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-normal text-base truncate">
                          {investor.name}
                        </span>
                        <div className="flex gap-1">
                          <img src="../src/assets/LinkedIn.svg" alt="LinkedIn" className="w-2 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer" />
                          <img src="../src/assets/link.svg" alt="Link" className="w-2 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer" />
                          <img src="../src/assets/mail.svg" alt="Mail" className="w-2 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer" />
                          <img src="../src/assets/twitter.svg" alt="Twitter" className="w-2 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1 overflow-hidden">
                        <span className="text-white text-[0.625rem] truncate max-w-[5rem]">
                          {investor.company}
                        </span>
                        <span className="text-white text-[0.5rem] font-bold rounded-full bg-blue-600 w-[1.875rem] h-4 flex items-center justify-center flex-shrink-0">
                          VC
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="flex items-center justify-between flex-grow gap-x-2 sm:gap-x-4 md:gap-x-6 xl:gap-x-10 min-w-0">
                    {/* Check Size */}
                    <div className="bg-[#18002C] text-white text-[0.625rem] font-semibold w-12 h-6 rounded-[0.1875rem] flex items-center justify-center flex-shrink-0">
                      {investor.checkSize}
                    </div>

                    {/* Stage */}
                    <div className="flex flex-col items-center gap-y-1 flex-shrink-0">
                      <div className="bg-[#18002C] text-white text-[0.625rem] font-semibold w-16 h-6 rounded-[0.1875rem] flex items-center justify-center">
                        {investor.stage}
                      </div>
                      <div className="bg-[#18002C] text-white text-[0.625rem] font-semibold w-6 h-6 rounded-[0.1875rem] flex items-center justify-center">
                        {investor.stageCount}
                      </div>
                    </div>

                    {/* Industry */}
                    <div className="flex flex-col items-center gap-y-1 flex-shrink-0">
                      <div className="bg-[#18002C] text-white text-[0.625rem] font-semibold w-16 h-6 rounded-[0.1875rem] flex items-center justify-center">
                        {investor.industry}
                      </div>
                      <div className="bg-[#18002C] text-white text-[0.625rem] font-semibold w-6 h-6 rounded-[0.1875rem] flex items-center justify-center">
                        {investor.industryCount}
                      </div>
                    </div>

                    {/* Geography */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <div className="flex items-center gap-1 bg-[#18002C] rounded-[0.1875rem] px-1 py-0.5">
                        <div className="w-5 h-3 flex items-center justify-center">
                          <img src="../src/assets/IndiaFlag.png" alt="Flag" />
                        </div>
                      </div>
                      <div className="bg-[#18002C] text-white text-[0.625rem] font-semibold w-6 h-6 rounded-[0.1875rem] flex items-center justify-center">
                        {investor.geography}
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <div className={`w-2.5 h-2.5 rounded-full ${getMatchColor(investor.matchValue)}`}></div>
                      <span className="text-white text-base font-semibold">{investor.match}</span>
                    </div>

                    {/* Submit Button */}
                    <button
                      className="text-white text-[0.625rem] font-medium rounded w-15 h-7 flex-shrink-0"
                      style={{
                        background: `linear-gradient(260deg, rgba(0, 0, 0, 0.25) -22.9%, rgba(252, 65, 65, 0.25) 119.49%), linear-gradient(99deg, #000 -4%, #33005C 104%)`
                      }}
                    >
                      Submit
                    </button>

                    {/* Options */}
                    <div className="relative flex-shrink-0">
                      <button 
                        className="hover:opacity-70 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === investor.id ? null : investor.id);
                        }}
                      >
                        <MoreVertical className="w-6 h-6 text-gray-400" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeDropdown === investor.id && (
                        <div 
                          className="absolute right-0 top-8 z-50 border border-[#0F0E16] w-[8.0625rem] h-[5.125rem] rounded-[0.25rem] bg-black"
                        >
                          <div className="py-1">
                            {[
                              { text: 'Add to pipeline', icon: '💰' },
                              { text: 'Add to target list', icon: '📋' },
                              { text: 'Report an error', icon: '⚠️' }
                            ].map((item, index) => (
                              <button
                                key={index}
                                className="w-full flex items-center gap-2 px-2 py-1 text-left text-[#B8B8B8] hover:text-white transition-colors text-[0.5rem] font-normal h-[1.25rem] hover:bg-[#33005C]"
                              >
                                <div className="flex-shrink-0 bg-gray-300 rounded flex items-center justify-center text-xs w-[0.75rem] h-[0.75rem]">
                                  {item.icon}
                                </div>
                                {item.text}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-12 pb-12">
              {/* Left Side: Results Count */}
              <div className="flex items-center justify-center bg-black text-gray-400 font-normal text-[0.5rem] rounded-sm w-[9.375rem] h-[1.875rem] font-inter">
                {investorData.length} results found | 10 per page
              </div>

              {/* Right Side: Pagination Controls */}
              <div className="flex items-center justify-between bg-black rounded-sm px-2 w-[9rem] h-[1.875rem]">
                
                {/* Previous Button */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center justify-center rounded-sm font-bold text-[0.5rem] w-4 h-4 font-inter 
                    ${currentPage === 1 
                      ? 'bg-[rgba(51,0,92,0.35)] text-[rgba(173,111,222,0.35)] cursor-not-allowed' 
                      : 'bg-[#33005C] text-[#AD6FDE] cursor-pointer'}`}
                >
                  &lt;
                </button>

                {/* Page Info */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-normal text-[0.5rem] font-inter">
                    Page
                  </span>
                  <span className="flex items-center justify-center rounded-sm font-bold text-[0.5rem] w-[1.375rem] h-4 bg-[#33005C] text-[#AD6FDE] font-inter">
                    {currentPage.toString().padStart(3, '0')}
                  </span>
                  <span className="text-gray-400 font-normal text-[0.5rem] font-inter">
                    of {totalPages.toString().padStart(3, '0')}
                  </span>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center justify-center rounded-sm font-bold text-[0.5rem] w-4 h-4 font-inter 
                    ${currentPage === totalPages 
                      ? 'bg-[rgba(51,0,92,0.35)] text-[rgba(173,111,222,0.35)] cursor-not-allowed' 
                      : 'bg-[#33005C] text-[#AD6FDE] cursor-pointer'}`}
                >
                  &gt;
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeFindTab === "Venture Firms" && (
        <div className="py-8 text-center text-gray-400">
          <h3 className="text-2xl mb-4">Venture Firms</h3>
          <p>Venture Firms content will go here...</p>
        </div>
      )}

      {activeFindTab === "Import" && (
        <div className="py-8 text-center text-gray-400">
          <h3 className="text-2xl mb-4">Import</h3>
          <p>Import content will go here...</p>
        </div>
      )}
    </div>
  );
}

export default FindInvestors;