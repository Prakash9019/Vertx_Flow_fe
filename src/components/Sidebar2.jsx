import React, { useState } from 'react';

const Sidebar2 = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [fundraisingExpanded, setFundraisingExpanded] = useState(true);
  const [selectedFundraisingOption, setSelectedFundraisingOption] = useState('');

  const handleFundraisingToggle = () => {
    setFundraisingExpanded(!fundraisingExpanded);
  };

  const handleFundraisingOptionClick = (option) => {
    setSelectedFundraisingOption(option);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-black text-white flex flex-col h-full border-r border-[rgba(184,184,184,0.13)]">
        {/* Top section with logo and collapse button */}
        <div className="flex items-center justify-between p-4">
          <div className="text-white">
            <img
              src="../src/assets/logo.svg"
              alt="Icon"
              className="w-8 h-8"
            />
          </div>

          <button className="text-gray-400 hover:text-white">
            <img
              src="../src/assets/BackIcon.svg"
              alt="Back icon"
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* First divider */}
        <div className="border-b border-[#B8B8B8] opacity-25 mx-4"></div>

        {/* Company section - updated with precise measurements */}
        <div className="py-3 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-7.5 h-7.5 bg-[#33005C] flex items-center justify-center rounded-sm mr-3">
              <span className="text-white text-sm font-semibold">C</span>
            </div>
            <div className="text-white text-sm font-medium">Company Name</div>
          </div>
          <button className="text-[#656565] hover:text-white">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Main navigation - updated order and icons to match image */}
        <div className="flex-1 overflow-y-auto">
          <nav className="py-4">
            <ul>
              <li className="px-4 py-2 flex items-center justify-between hover:bg-gray-900">
                <span className="text-white font-medium text-sm">Home</span>
                <img 
                  src="../src/assets/home.svg" 
                  alt="Home" 
                  className="w-5 h-5" 
                  style={{ width: '1.25rem', height: '1.25rem' }} 
                />
              </li>
              <li className="px-4 py-2 flex items-center justify-between hover:bg-gray-900">
                <span className="text-[#B8B8B8] font-medium text-sm">Getting Started</span>
                <img 
                  src="../src/assets/rocket.svg" 
                  alt="Magic" 
                  style={{ width: '1.25rem', height: '1.25rem' }} 
                />
              </li>
            </ul>
          </nav>

          {/* Second divider */}
          <div className="border-b border-[#B8B8B8] opacity-25 mx-4 my-2"></div>

          {/* Features with icons */}
          <nav className="py-2">
            <ul>
              <li className="px-4 py-2 flex items-center hover:bg-gray-900">
                <img 
                  src="../src/assets/flash.svg" 
                  alt="Flash" 
                  className="mr-3" 
                  style={{ width: '1.625rem', height: '1.625rem', borderRadius: '1.625rem' }} 
                />
                <span className="text-[#B8B8B8] font-medium text-sm">Flash</span>
                <div className="ml-2 w-[33px] h-[17px] bg-[#33005C] rounded flex items-center justify-center">
                  <span className="text-[#AD6FDE] text-[8px] font-bold">BETA</span>
                </div>
              </li>
              <li className="px-4 py-2 flex items-center hover:bg-gray-900">
                <img 
                  src="../src/assets/Ellipse23.svg" 
                  alt="Ellipse " 
                  className="mr-3" 
                  style={{ width: '1.625rem', height: '1.625rem', borderRadius: '1.625rem' }} 
                />
                <span className="text-[#B8B8B8] font-medium text-sm">Evaluate</span>
              </li>
              
              {/* Fundraising with collapsible dropdown */}
              <li>
                <div 
                  className="px-4 py-2 flex items-center hover:bg-gray-900 cursor-pointer"
                  onClick={handleFundraisingToggle}
                >
                  <img 
                    src="../src/assets/Ellipse 3.svg" 
                    alt="Fundraising" 
                    className="mr-3" 
                    style={{ width: '1.625rem', height: '1.625rem', borderRadius: '1.625rem' }} 
                  />
                  <span className="text-[#B8B8B8] font-medium text-sm">Fundraising</span>
                  <div className="ml-auto">
                    <svg 
                      width="5" 
                      height="9" 
                      viewBox="0 0 5 9" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transform transition-transform ${fundraisingExpanded ? 'rotate-90' : ''}`}
                      style={{ width: '0.3125rem', height: '0.5625rem' }}
                    >
                      <path d="M1 1L4 4.5L1 8" stroke="#B8B8B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                
                {/* Fundraising submenu */}
                {fundraisingExpanded && (
                  <ul className="ml-12">
                    <li 
                      className="px-4 py-2 hover:bg-gray-900 cursor-pointer"
                      onClick={() => handleFundraisingOptionClick('Dashboard')}
                    >
                      <span 
                        className={`font-medium ${selectedFundraisingOption === 'Dashboard' ? 'text-white' : 'text-[#B8B8B8]'}`}
                        style={{ 
                          fontFamily: 'Inter', 
                          fontSize: '0.75rem', 
                          fontWeight: 500 
                        }}
                      >
                        Dashboard
                      </span>
                    </li>
                    <li 
                      className="px-4 py-2 hover:bg-gray-900 cursor-pointer"
                      onClick={() => handleFundraisingOptionClick('Raise')}
                    >
                      <span 
                        className={`font-medium ${selectedFundraisingOption === 'Raise' ? 'text-white' : 'text-[#B8B8B8]'}`}
                        style={{ 
                          fontFamily: 'Inter', 
                          fontSize: '0.75rem', 
                          fontWeight: 500 
                        }}
                      >
                        Raise
                      </span>
                    </li>
                    <li 
                      className="px-4 py-2 hover:bg-gray-900 cursor-pointer"
                      onClick={() => handleFundraisingOptionClick('Reach')}
                    >
                      <span 
                        className={`font-medium ${selectedFundraisingOption === 'Reach' ? 'text-white' : 'text-[#B8B8B8]'}`}
                        style={{ 
                          fontFamily: 'Inter', 
                          fontSize: '0.75rem', 
                          fontWeight: 500 
                        }}
                      >
                        Reach
                      </span>
                    </li>
                  </ul>
                )}
              </li>
              
              <li className="px-4 py-2 flex items-center hover:bg-gray-900">
                <img 
                  src="../src/assets/Ellipse4.svg" 
                  alt="Playground" 
                  className="mr-3" 
                  style={{ width: '1.625rem', height: '1.625rem', borderRadius: '1.625rem' }} 
                />
                <span className="text-[#B8B8B8] font-medium text-sm">Playground</span>
                <div className="ml-2 w-[33px] h-[17px] bg-[#33005C] rounded flex items-center justify-center">
                  <span className="text-[#AD6FDE] text-[8px] font-bold">BETA</span>
                </div>
              </li>
            </ul>
          </nav>
        </div>

        {/* Third divider */}
        <div className="border-b border-[#B8B8B8] opacity-25 mx-4"></div>

        {/* Bottom section with account options */}
        <div className="mt-auto">
          <ul>
            <li className="px-4 py-3 flex items-center justify-between hover:bg-gray-900">
              <span className="text-[#B8B8B8] font-medium text-sm">Your account</span>
              <img 
                src="../src/assets/account.svg" 
                alt="User" 
                style={{ width: '1.25rem', height: '1.25rem' }} 
              />
            </li>
            <li className="px-4 py-3 flex items-center justify-between hover:bg-gray-900">
              <span className="text-[#B8B8B8] font-medium text-sm">Upgrade plan</span>
              <img 
                src="../src/assets/plan.svg" 
                alt="Layers" 
                style={{ width: '1.25rem', height: '1.25rem' }} 
              />
            </li>
            <li className="px-4 py-3 flex items-center justify-between hover:bg-gray-900">
              <span className="text-[#B8B8B8] font-medium text-sm">Leave a feedback</span>
              <img 
                src="../src/assets/feedback.svg" 
                alt="Chat" 
                style={{ width: '1.25rem', height: '1.25rem' }} 
              />
            </li>
            <li className="px-4 py-3 flex items-center justify-between hover:bg-gray-900">
              <span className="text-[#B8B8B8] font-medium text-sm">Log out</span>
              <img 
                src="../src/assets/logout.svg" 
                alt="Logout" 
                style={{ width: '1.25rem', height: '1.25rem' }} 
              />
            </li>
          </ul>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 bg-[#1a0b2e]">
        {/* Your main content goes here */}
      </div>
    </div>
  );
};


export default Sidebar2;