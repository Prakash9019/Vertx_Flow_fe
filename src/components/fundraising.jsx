import React, { useState } from 'react';
import Sidebar from "../components/Sidebar";
import AddRoundPopup from "./AddRoundPopup";

function FundraisingManagePage() {
  const [activeTab, setActiveTab] = useState("Manage");
  const [activeSubTab, setActiveSubTab] = useState("Current Round");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const tabsArray = ["Manage", "Find", "Target", "Network"];

  const handleAddRoundClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleNextClick = () => {
    // Handle next button logic here
    console.log("Next button clicked");
    setIsPopupOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row relative">
      {/* Sidebar */}
      <div className="md:col-span-3 bg-black text-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="w-full h-screen overflow-y-auto">
        {/* Header */}
        <div
  className="relative text-white w-full"
  style={{
    height: '11.375rem',
    backgroundColor: '#f0f0f0',
    backgroundImage: 'url(../src/assets/imgBackground.png)', // Replace with correct path
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%', // Ensures image stretches to fill the container
    backgroundPosition: 'center'
  }}
>


          <div className="absolute inset-0 z-0" style={{ backgroundColor: '#000000CC' }}></div>

          <div className="relative z-10 flex flex-col justify-between h-full" style={{ paddingLeft: '3.44rem', paddingRight: '3.87rem', paddingTop: '4.06rem', paddingBottom: '1.5rem' }}>
            <div>
              <h1 className="text-white font-semibold mb-2" style={{ fontFamily: 'Inter', fontSize: '2rem', fontWeight: 600 }}>
                Company
              </h1>
              <p className="text-white mb-2" style={{ fontFamily: 'Inter', fontSize: '0.75rem', fontWeight: 600 }}>
                This company helps A to solve B by addition of C and D.
              </p>
              <p className="text-white mb-4" style={{ fontFamily: 'Inter', fontSize: '0.625rem', fontWeight: 500 }}>
                www.companyname.com
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4" style={{ paddingLeft: '3.44rem', paddingRight: '3.87rem', marginTop: '1.69rem' }}>
          {tabsArray.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full transition-colors ${
                activeTab === tab ? "bg-white text-black" : "text-gray-400"
              }`}
              style={{
                width: activeTab === tab ? '6.25rem' : '5rem',
                height: '2.5rem',
                borderRadius: '6.25rem',
                backgroundColor: activeTab === tab ? '#FFF' : '#0F0E16',
                color: activeTab === tab ? '#000' : '#656565',
                fontFamily: 'Inter',
                fontSize: '1rem',
                fontWeight: activeTab === tab ? 500 : 400
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ paddingLeft: '3.44rem', paddingRight: '3.87rem' }}>
          {activeTab === "Manage" && (
            <div style={{ paddingTop: '3rem' }}>
              <div className="mb-8">
                <div className="flex items-center mb-8">
                  <div className="bg-purple-500 mr-2" style={{ width: '0.3125rem', height: '1.75rem' }}></div>
                  <h2 className="text-white" style={{ fontFamily: 'Inter', fontSize: '1.5rem', fontWeight: 600 }}>
                    Manage your fundraising
                  </h2>
                </div>

                {/* Sub Navigation */}
                <div className="flex" style={{ gap: '5.12rem' }}>
                  <div className="relative" style={{ paddingLeft: '1.19rem' }}>
                    <button 
                      onClick={() => setActiveSubTab("Current Round")}
                      className="pb-2 transition-colors"
                      style={{
                        color: activeSubTab === "Current Round" ? '#FFF' : '#B8B8B8',
                        fontFamily: 'Inter',
                        fontSize: '1rem',
                        fontWeight: 500
                      }}
                    >
                      Current Round
                    </button>
                    {activeSubTab === "Current Round" && (
                      <div className="absolute bottom-0" style={{ left: '1.19rem', width: '7.0rem', height: '0.25rem', borderRadius: '6.25rem', background: '#AD6FDE' }}></div>
                    )}
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setActiveSubTab("History")}
                      className="pb-2 transition-colors"
                      style={{
                        color: activeSubTab === "History" ? '#FFF' : '#B8B8B8',
                        fontFamily: 'Inter',
                        fontSize: '1rem',
                        fontWeight: 500
                      }}
                    >
                      History
                    </button>
                    {activeSubTab === "History" && (
                      <div className="absolute bottom-0 left-0" style={{ width: '3.5rem', height: '0.25rem', borderRadius: '6.25rem', background: '#AD6FDE' }}></div>
                    )}
                  </div>
                </div>

                {/* Main Card */}
                <div className="w-full">
                  <div className="backdrop-blur-sm rounded-lg border border-gray-800/50 relative" style={{ width: '100%', height: '15rem', borderRadius: '0.625rem', backgroundColor: '#0F0E16' }}>
                    <h3 className="text-white absolute" style={{ top: '5.44rem', left: '50%', transform: 'translateX(-50%)', fontFamily: 'Inter', fontSize: '0.875rem', fontWeight: 600 }}>
                      No fundraising round is currently open.
                    </h3>
                    <p className="absolute max-w-2xl" style={{ top: '6.81rem', left: '50%', transform: 'translateX(-50%)', color: '#B8B8B8', fontFamily: 'Inter', fontSize: '0.75rem', fontWeight: 400, textAlign: 'center' }}>
                      Open a new round to add the fundraising information and track progress.
                    </p>
                    <button 
                      onClick={handleAddRoundClick}
                      className="transition-colors flex items-center justify-center absolute hover:bg-purple-700" 
                      style={{ top: '9.06rem', left: '50%', transform: 'translateX(-50%)', width: '5.625rem', height: '1.875rem', borderRadius: '0.25rem', backgroundColor: '#33005C' }}
                    >
                      <span className="text-white" style={{ fontFamily: 'Inter', fontSize: '0.625rem', fontWeight: 600 }}>
                        + Add Round
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Find" && (
            <div className="py-8">
              <div className="text-center text-gray-400">
                <h3 className="text-2xl mb-4">Find Investors</h3>
                <p>Find investor content will go here...</p>
              </div>
            </div>
          )}

          {activeTab === "Target" && (
            <div className="py-8">
              <div className="text-center text-gray-400">
                <h3 className="text-2xl mb-4">Target Investors</h3>
                <p>Target investor content will go here...</p>
              </div>
            </div>
          )}

          {activeTab === "Network" && (
            <div className="py-8">
              <div className="text-center text-gray-400">
                <h3 className="text-2xl mb-4">Network</h3>
                <p>Network content will go here...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Round Popup */}
      <AddRoundPopup 
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onNext={handleNextClick}
      />
    </div>
  );
}

export default FundraisingManagePage;