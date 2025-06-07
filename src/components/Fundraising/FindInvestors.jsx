import React, { useState } from 'react';
import { Search, MoreVertical, ChevronDown } from 'lucide-react';

function FindInvestors() {
  const [activeFindTab, setActiveFindTab] = useState("Investors");
  const [advancedFiltersOn, setAdvancedFiltersOn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [geographyDropdownOpen, setGeographyDropdownOpen] = useState(false);
  const [selectedGeographies, setSelectedGeographies] = useState(['India', 'United States', 'Europe', 'UAE']);
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
    if (matchValue >= 0 && matchValue <= 49) return "#DE2D2D";
    if (matchValue >= 50 && matchValue <= 67) return "#AF4F00";
    if (matchValue >= 68 && matchValue <= 85) return "#CC8D03";
    if (matchValue >= 86 && matchValue <= 100) return "#0E8D07";
    return "#DE2D2D";
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
    <div className="pt-12" onClick={() => {
      setActiveDropdown(null);
      setGeographyDropdownOpen(false);
    }}>
      {/* Find Tab Navigation - Fixed */}
      <div className="flex gap-12 mb-12">
        {findTabsArray.map((tab) => (
          <div key={tab} className="relative">
            <button 
              onClick={() => setActiveFindTab(tab)}
              className="pb-2 transition-colors font-medium text-base"
              style={{
                color: activeFindTab === tab ? '#FFF' : '#B8B8B8',
                fontFamily: 'Inter'
              }}
            >
              {tab}
            </button>
            {activeFindTab === tab && (
              <div 
                className="absolute bottom-0 left-0 h-1 rounded-full"
                style={{ 
                  width: tab === "Venture Firms" ? '7.5rem' : tab === "Investors" ? '4.5rem' : '4rem',
                  background: '#AD6FDE' 
                }}
              ></div>
            )}
          </div>
        ))}
      </div>

      {activeFindTab === "Investors" && (
        <div className="mb-12">
          <div className="rounded-lg bg-black p-6" style={{ background: '#0F0E16', borderRadius: '0.625rem', padding: '1.5rem 1.24rem' }}>
            {/* Search and Filters - Fixed to respect padding constraints */}
            <div className="flex items-center justify-between mb-6" style={{ minWidth: '0' }}>
              <div className="relative flex-shrink-0" style={{ width: '12.5rem' }}>
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  style={{ width: '0.875rem', height: '0.875rem' }}
                />
                <input
                  type="text"
                  placeholder="Search database..."
                  className="w-full h-8 rounded-sm bg-black text-gray-400 font-normal text-xs pl-8 pr-2 border-none outline-none"
                  style={{
                    width: '12.5rem',
                    height: '1.875rem',
                    borderRadius: '0.1875rem',
                    fontFamily: 'Inter',
                    fontSize: '0.625rem'
                  }}
                />
              </div>
              
              <div className="flex ml-6 gap-x-2 sm:gap-x-4 md:gap-x-6 xl:gap-x-10 " style={{ minWidth: '0' }}>
                {['Type', 'Stage', 'Industry'].map((label, index) => (
                  <div className="relative flex-shrink-0" key={label}>
                    <select 
                      className="bg-black text-left text-gray-400 font-normal text-xs border-none outline-none appearance-none pr-6 pl-3 py-1 rounded-sm"
                      style={{
                        fontFamily: 'Inter',
                        fontSize: '0.625rem',
                        height: '1.75rem',
                      }}
                    >
                      <option>{label}</option>
                    </select>
                    <ChevronDown 
                      className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{
                        width: '0.75rem',
                        height: '0.75rem',
                        color: '#B8B8B8',
                      }}
                    />
                  </div>
                ))}

                {/* Geography Dropdown */}
                <div className="relative flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setGeographyDropdownOpen(!geographyDropdownOpen);
                    }}
                    className="bg-black text-left text-gray-400 font-normal text-xs border-none outline-none appearance-none pr-6 pl-3 py-1 rounded-sm flex items-center"
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '0.625rem',
                      height: '1.75rem',
                    }}
                  >
                    Geography
                    <ChevronDown 
                      className="ml-2"
                      style={{
                        width: '0.75rem',
                        height: '0.75rem',
                        color: '#B8B8B8',
                      }}
                    />
                  </button>

                  {/* Geography Dropdown Menu */}
                  {geographyDropdownOpen && (
                    <div 
                      className="absolute left-0 top-8 border"
                      style={{
                        width: '7.4375rem',
                        height: '10.25rem',
                        borderRadius: '0.25rem',
                        border: '1px solid #0F0E16',
                        background: '#000',
                        zIndex: 9999,
                        position: 'absolute'
                      }}
                    >
                                              <div className="py-1 px-1 overflow-y-auto h-full">
                        {geographyOptions.map((geography, index) => (
                          <button
                            key={index}
                            className="w-full flex items-center justify-between px-2 py-1 text-left transition-colors rounded-sm"
                            style={{
                              color: '#FFF',
                              fontFamily: 'Inter',
                              fontSize: '0.5rem',
                              fontWeight: 500,
                              height: '1.0625rem'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGeographyToggle(geography);
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#33005C';
                              e.target.style.width = '7.3125rem';
                              e.target.style.height = '1.0625rem';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'transparent';
                              e.target.style.width = '100%';
                              e.target.style.height = '1.0625rem';
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
                          className="mx-auto my-2"
                          style={{
                            width: '6.5rem',
                            height: '0.0625rem',
                            background: '#333'
                          }}
                        ></div>
                        
                        {/* Reset All Button */}
                        <button
                          className="w-full text-center py-1"
                          style={{
                            color: '#AD6FDE',
                            fontFamily: 'Inter',
                            fontSize: '0.375rem',
                            fontWeight: 500
                          }}
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
                  className="flex items-center gap-2 bg-black text-gray-400 font-normal text-xs border-none rounded-sm outline-none px-3 py-1 flex-shrink-0"
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '0.625rem',
                    height: '1.75rem',
                  }}
                >
                  Advanced Filters
                  <div className="relative w-7 h-4">
                    <div 
                      className="absolute inset-0 rounded-full transition-colors"
                      style={{ backgroundColor: advancedFiltersOn ? '#9333EA' : '#374151' }}
                    ></div>
                    <div 
                      className="absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform"
                      style={{ left: advancedFiltersOn ? '0.95rem' : '0.125rem' }}
                    ></div>
                  </div>
                </button>
              </div>
            </div>

            {/* Table Header - Made Responsive with overflow behavior matching content */}
            <div className="flex items-center py-4 px-4 xl:px-6">
              {/* Fixed Width Container for Investor Name Header - matches content */}
              <div className="w-[17rem] flex-shrink-0">
                <div 
                  className="text-white font-semibold text-xs uppercase tracking-wider"
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '0.5rem',
                    letterSpacing: '0.05em'
                  }}
                >
                  INVESTOR NAME
                </div>
              </div>

              {/* Details Headers Section - matches content flex layout, stops responsiveness and hides from end when content does */}
              <div className="flex items-center justify-between flex-grow gap-x-2 sm:gap-x-4 md:gap-x-6 xl:gap-x-10 overflow-hidden" style={{ minWidth: '0' }}>
                {/* Check Size Header */}
                <div className="flex justify-center flex-shrink-0" style={{ width: '3rem' }}>
                  <div 
                    className="text-white font-semibold text-xs uppercase tracking-wider text-center whitespace-nowrap"
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '0.5rem',
                      letterSpacing: '0.05em'
                    }}
                  >
                    CHECK SIZE
                  </div>
                </div>

                {/* Stage Header */}
                <div className="flex justify-center flex-shrink-0" style={{ width: '4rem' }}>
                  <div 
                    className="text-white font-semibold text-xs uppercase tracking-wider text-center whitespace-nowrap"
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '0.5rem',
                      letterSpacing: '0.05em'
                    }}
                  >
                    STAGE
                  </div>
                </div>

                {/* Industry Header */}
                <div className="flex justify-center flex-shrink-0" style={{ width: '4rem' }}>
                  <div 
                    className="text-white font-semibold text-xs uppercase tracking-wider text-center whitespace-nowrap"
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '0.5rem',
                      letterSpacing: '0.05em'
                    }}
                  >
                    INDUSTRY
                  </div>
                </div>

                {/* Geography Header */}
                <div className="flex justify-center flex-shrink-0" style={{ width: '4rem' }}>
                  <div 
                    className="text-white font-semibold text-xs uppercase tracking-wider text-center whitespace-nowrap"
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '0.5rem',
                      letterSpacing: '0.05em'
                    }}
                  >
                    GEOGRAPHY
                  </div>
                </div>

                {/* Match Header */}
                <div className="flex justify-center flex-shrink-0" style={{ width: '3rem' }}>
                  <div 
                    className="text-white font-semibold text-xs uppercase tracking-wider text-center whitespace-nowrap"
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '0.5rem',
                      letterSpacing: '0.05em'
                    }}
                  >
                    MATCH
                  </div>
                </div>

                {/* Submit Deck Header */}
                <div className="flex justify-center flex-shrink-0" style={{ width: '4rem' }}>
                  <div 
                    className="text-white font-semibold text-xs uppercase tracking-wider text-center whitespace-nowrap"
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '0.5rem',
                      letterSpacing: '0.05em'
                    }}
                  >
                    SUBMIT DECK
                  </div>
                </div>

                {/* Options Header (for the three dots) */}
                <div className="flex-shrink-0" style={{ width: '1.5rem' }}></div>
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
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-white font-normal text-base truncate" style={{ fontFamily: 'Inter' }}>
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
            <span className="text-white text-xs truncate max-w-[5rem]" style={{ fontFamily: 'Inter', fontSize: '0.625rem' }}>
              {investor.company}
            </span>
            <span className="text-white text-[0.5rem] font-bold rounded-full bg-blue-600 w-[1.875rem] h-4 flex items-center justify-center flex-shrink-0" style={{ fontFamily: 'Inter' }}>
              VC
            </span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex items-center justify-between flex-grow gap-x-2 sm:gap-x-4 md:gap-x-6 xl:gap-x-10" style={{ minWidth: '0' }}>
        {/* Check Size */}
        <div className="bg-[#18002C] text-white text-xs font-semibold w-12 h-6 rounded-sm flex items-center justify-center flex-shrink-0" style={{ fontFamily: 'Inter', fontSize: '0.625rem' }}>
          {investor.checkSize}
        </div>

        {/* Stage */}
        <div className="flex flex-col items-center gap-y-1 flex-shrink-0">
          <div className="bg-[#18002C] text-white text-xs font-semibold w-16 h-6 rounded-sm flex items-center justify-center" style={{ fontFamily: 'Inter', fontSize: '0.625rem' }}>
            {investor.stage}
          </div>
          <div className="bg-[#18002C] text-white text-xs font-semibold w-6 h-6 rounded-sm flex items-center justify-center" style={{ fontFamily: 'Inter', fontSize: '0.625rem' }}>
            {investor.stageCount}
          </div>
        </div>

        {/* Industry */}
        <div className="flex flex-col items-center gap-y-1 flex-shrink-0">
          <div className="bg-[#18002C] text-white text-xs font-semibold w-16 h-6 rounded-sm flex items-center justify-center" style={{ fontFamily: 'Inter', fontSize: '0.625rem' }}>
            {investor.industry}
          </div>
          <div className="bg-[#18002C] text-white text-xs font-semibold w-6 h-6 rounded-sm flex items-center justify-center" style={{ fontFamily: 'Inter', fontSize: '0.625rem' }}>
            {investor.industryCount}
          </div>
        </div>

        {/* Geography */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="flex items-center gap-1 bg-[#18002C] rounded-sm px-1 py-0.5">
            <div className="w-5 h-3 flex items-center justify-center">
              <img src="../src/assets/IndiaFlag.png" alt="Flag" />
            </div>
          </div>
          <div className="bg-[#18002C] text-white text-xs font-semibold w-6 h-6 rounded-sm flex items-center justify-center" style={{ fontFamily: 'Inter', fontSize: '0.625rem' }}>
            {investor.geography}
          </div>
        </div>

        {/* Match Score */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: getMatchColor(investor.matchValue) }}></div>
          <span className="text-white text-base font-semibold" style={{ fontFamily: 'Inter' }}>{investor.match}</span>
        </div>

        {/* Submit Button */}
        <button className="text-white text-xs font-medium rounded w-15 h-7 flex-shrink-0" style={{
          fontFamily: 'Inter',
          fontSize: '0.625rem',
          background: 'linear-gradient(260deg, rgba(0, 0, 0, 0.25) -22.9%, rgba(252, 65, 65, 0.25) 119.49%), linear-gradient(99deg, #000 -4%, #33005C 104%)'
        }}>
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
              className="absolute right-0 top-8 z-50 border"
              style={{
                width: '8.0625rem',
                height: '5.125rem',
                borderRadius: '0.25rem',
                border: '1px solid #0F0E16',
                background: '#000'
              }}
            >
              <div className="py-1">
                {[
                  { text: 'Add to pipeline', icon: '💰' },
                  { text: 'Add to target list', icon: '📋' },
                  { text: 'Report an error', icon: '⚠️' }
                ].map((item, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-2 px-2 py-1 text-left hover:text-white transition-colors"
                    style={{
                      color: '#B8B8B8',
                      fontFamily: 'Inter',
                      fontSize: '0.5rem',
                      fontWeight: 400,
                      height: '1.25rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#FFF';
                      e.target.style.background = '#33005C';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#B8B8B8';
                      e.target.style.background = 'transparent';
                    }}
                  >
                    <div 
                      className="flex-shrink-0 bg-gray-300 rounded flex items-center justify-center text-xs"
                      style={{
                        width: '0.75rem',
                        height: '0.75rem'
                      }}
                    >
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

            {/* Pagination - Fixed */}
            <div className="flex items-center justify-between mt-12 pb-12">
              <div className="flex items-center justify-center bg-black text-gray-400 font-normal text-xs rounded-sm"
                   style={{ 
                     width: '9.375rem',
                     height: '1.875rem',
                     fontFamily: 'Inter',
                     fontSize: '0.5rem'
                   }}>
                {investorData.length} results found | 10 per page
              </div>
              <div className="flex items-center justify-between bg-black rounded-sm px-2"
                   style={{
                     width: '9rem',
                     height: '1.875rem'
                   }}>
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center border-none cursor-pointer rounded-sm text-purple-400 font-bold text-xs"
                  style={{
                    width: '1rem',
                    height: '1rem',
                    background: currentPage === 1 ? 'rgba(51, 0, 92, 0.35)' : '#33005C',
                    color: currentPage === 1 ? 'rgba(173, 111, 222, 0.35)' : '#AD6FDE',
                    fontFamily: 'Inter',
                    fontSize: '0.5rem',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}>
                  &lt;
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-normal text-xs"
                        style={{ 
                          fontFamily: 'Inter',
                          fontSize: '0.5rem'
                        }}>
                    Page
                  </span>
                  <span className="flex items-center justify-center bg-purple-900 rounded-sm text-purple-400 font-bold text-xs"
                        style={{
                          width: '1.375rem',
                          height: '1rem',
                          background: '#33005C',
                          color: '#AD6FDE',
                          fontFamily: 'Inter',
                          fontSize: '0.5rem'
                        }}>
                    {currentPage.toString().padStart(3, '0')}
                  </span>
                  <span className="text-gray-400 font-normal text-xs"
                        style={{ 
                          fontFamily: 'Inter',
                          fontSize: '0.5rem'
                        }}>
                    of {totalPages.toString().padStart(3, '0')}
                  </span>
                </div>
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center border-none cursor-pointer rounded-sm text-purple-400 font-bold text-xs"
                  style={{
                    width: '1rem',
                    height: '1rem',
                    background: currentPage === totalPages ? 'rgba(51, 0, 92, 0.35)' : '#33005C',
                    color: currentPage === totalPages ? 'rgba(173, 111, 222, 0.35)' : '#AD6FDE',
                    fontFamily: 'Inter',
                    fontSize: '0.5rem',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}>
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