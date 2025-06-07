"use client"

// updated page with Target component

import { useState } from "react"
import Sidebar from "../Sidebar"
import AddRoundPopup from "../AddRoundPopup"
import FindInvestors from "./FindInvestors"
import Target from "../Target"
import { useStartupProfile } from "../../context/StartupProfileContext";

function FundraisingManagePage() {
  
  const { profileData } = useStartupProfile();
  const [activeTab, setActiveTab] = useState("Manage")
  const [activeSubTab, setActiveSubTab] = useState("Current Round")
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [hasActiveRound, setHasActiveRound] = useState(false)
  const [roundData, setRoundData] = useState(null)
  const [isTargetListSelected, setIsTargetListSelected] = useState(false)

  const tabsArray = ["Manage", "Find", "Target", "Network"]

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
            className="relative text-white w-full"
            style={{
              height: "11.375rem",
              backgroundColor: "#f0f0f0",
              backgroundImage: "url(../src/assets/imgBackground.png)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 z-0" style={{ backgroundColor: "#000000CC" }}></div>

            <div
              className="relative z-10 flex flex-col justify-between h-full"
              style={{
                paddingLeft: "3.44rem",
                paddingRight: "3.87rem",
                paddingTop: "4.06rem",
                paddingBottom: "1.5rem",
              }}
            >
              <div>
                <h1
                  className="text-white font-semibold mb-2"
                  style={{ fontFamily: "Inter", fontSize: "2rem", fontWeight: 600 }}
                >
                 { profileData ? profileData.companyName :  "Company"}
                </h1>
                <p className="text-white mb-2" style={{ fontFamily: "Inter", fontSize: "0.75rem", fontWeight: 600 }}>
                { profileData ? profileData.companyName :  "This company"}   helps A to solve B by addition of C and D.
                </p>
                <p className="text-white mb-4" style={{ fontFamily: "Inter", fontSize: "0.625rem", fontWeight: 500 }}>
                { profileData ? profileData.companyWebsite :  "www.companyname.com"} 
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs - Hidden when target list is selected */}
        {!(activeTab === "Target" && isTargetListSelected) && (
          <div className="flex gap-4" style={{ paddingLeft: "3.44rem", paddingRight: "3.87rem", marginTop: "1.69rem" }}>
            {tabsArray.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full transition-colors ${
                  activeTab === tab ? "bg-white text-black" : "text-gray-400"
                }`}
                style={{
                  width: activeTab === tab ? "6.25rem" : "5rem",
                  height: "2.5rem",
                  borderRadius: "6.25rem",
                  backgroundColor: activeTab === tab ? "#FFF" : "#0F0E16",
                  color: activeTab === tab ? "#000" : "#656565",
                  fontFamily: "Inter",
                  fontSize: "1rem",
                  fontWeight: activeTab === tab ? 500 : 400,
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Tab Content */}
        <div
          style={{
            paddingLeft: activeTab === "Target" && isTargetListSelected ? "0" : "3.44rem",
            paddingRight: activeTab === "Target" && isTargetListSelected ? "0" : "3.87rem",
          }}
        >
          {activeTab === "Manage" && (
            <div style={{ paddingTop: "3rem" }}>
              <div className="mb-8">
                <div className="flex items-center mb-8">
                  <div className="bg-purple-500 mr-2" style={{ width: "0.3125rem", height: "1.75rem" }}></div>
                  <h2 className="text-white" style={{ fontFamily: "Inter", fontSize: "1.5rem", fontWeight: 600 }}>
                    Manage your fundraising
                  </h2>
                </div>

                {/* Sub Navigation */}
                <div className="flex" style={{ gap: "5.12rem" }}>
                  <div className="relative" style={{ paddingLeft: "1.19rem" }}>
                    <button
                      onClick={() => setActiveSubTab("Current Round")}
                      className="pb-2 transition-colors"
                      style={{
                        color: activeSubTab === "Current Round" ? "#FFF" : "#B8B8B8",
                        fontFamily: "Inter",
                        fontSize: "1rem",
                        fontWeight: 500,
                      }}
                    >
                      Current Round
                    </button>
                    {activeSubTab === "Current Round" && (
                      <div
                        className="absolute bottom-0"
                        style={{
                          left: "1.19rem",
                          width: "7.0rem",
                          height: "0.25rem",
                          borderRadius: "6.25rem",
                          background: "#AD6FDE",
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setActiveSubTab("History")}
                      className="pb-2 transition-colors"
                      style={{
                        color: activeSubTab === "History" ? "#FFF" : "#B8B8B8",
                        fontFamily: "Inter",
                        fontSize: "1rem",
                        fontWeight: 500,
                      }}
                    >
                      History
                    </button>
                    {activeSubTab === "History" && (
                      <div
                        className="absolute bottom-0 left-0"
                        style={{ width: "3.5rem", height: "0.25rem", borderRadius: "6.25rem", background: "#AD6FDE" }}
                      ></div>
                    )}
                  </div>
                </div>

                {/* Main Card */}
                <div className="w-full">
                  {hasActiveRound ? (
                    // Active Round Display
                    <div
                      className="rounded-lg"
                      style={{
                        width: "100%",
                        height: "18.75rem",
                        borderRadius: "0.625rem",
                        backgroundColor: "#0F0E16",
                        paddingLeft: "3.13rem",
                        paddingRight: "3.13rem",
                        paddingTop: "2.75rem",
                        paddingBottom: "2.75rem",
                      }}
                    >
                      {/* Header with title and buttons */}
                      <div className="flex justify-between items-center" style={{ marginBottom: "3.44rem" }}>
                        <h3
                          className="text-white"
                          style={{ fontFamily: "Inter", fontSize: "1.25rem", fontWeight: 600, color: "#FFF" }}
                        >
                          Angel 2 Bridge Round
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdateRound}
                            className="transition-colors hover:bg-purple-700"
                            style={{
                              width: "8.5rem",
                              height: "2.25rem",
                              borderRadius: "0.1875rem",
                              backgroundColor: "#5F248D",
                              color: "#FFF",
                              fontFamily: "Inter",
                              fontSize: "0.875rem",
                              fontWeight: 500,
                            }}
                          >
                            Update Round
                          </button>
                          <button
                            onClick={handleCloseRound}
                            className="transition-colors hover:bg-red-600"
                            style={{
                              width: "8.5rem",
                              height: "2.25rem",
                              borderRadius: "0.1875rem",
                              backgroundColor: "#DE2D2D",
                              color: "#FFF",
                              fontFamily: "Inter",
                              fontSize: "0.875rem",
                              fontWeight: 500,
                            }}
                          >
                            Close Round
                          </button>
                        </div>
                      </div>

                      {/* Progress section */}
                      <div style={{ marginBottom: "0.56rem" }}>
                        <div className="flex justify-between items-center">
                          <span
                            className="text-white"
                            style={{ fontFamily: "Inter", fontSize: "0.875rem", fontWeight: 700, color: "#FFF" }}
                          >
                            $10,000
                          </span>
                          <span
                            className="text-white"
                            style={{ fontFamily: "Inter", fontSize: "0.875rem", fontWeight: 700, color: "#FFF" }}
                          >
                            10% raised of 100K target
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div
                        className="w-full bg-gray-600 rounded-full"
                        style={{
                          width: "100%",
                          height: "0.8125rem",
                          borderRadius: "6.25rem",
                          background: "rgba(184, 184, 184, 0.13)",
                          marginBottom: "2.81rem",
                        }}
                      >
                        <div
                          className="bg-blue-500 rounded-full"
                          style={{
                            width: "8.25rem",
                            height: "0.8125rem",
                            borderRadius: "6.25rem",
                            backgroundColor: "#305FC4",
                          }}
                        ></div>
                      </div>

                      {/* Bottom stats */}
                      <div className="flex justify-between mr-6">
                        {/* Amount to raise */}
                        <div style={{ textAlign: "center" }}>
                          <p
                            className="text-gray-400"
                            style={{
                              fontFamily: "Inter",
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              color: "#B8B8B8",
                              marginBottom: "0.44rem",
                            }}
                          >
                            Amount to raise
                          </p>
                          <p
                            className="text-white"
                            style={{ fontFamily: "Inter", fontSize: "1.25rem", fontWeight: 600, color: "#FFF" }}
                          >
                            $90,000
                          </p>
                        </div>

                        {/* Closing in */}
                        <div style={{ textAlign: "center" }}>
                          <p
                            className="text-gray-400"
                            style={{
                              fontFamily: "Inter",
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              color: "#B8B8B8",
                              marginBottom: "0.44rem",
                            }}
                          >
                            Closing in
                          </p>
                          <p
                            className="text-white"
                            style={{ fontFamily: "Inter", fontSize: "1.25rem", fontWeight: 600, color: "#FFF" }}
                          >
                            130 days
                          </p>
                        </div>

                        {/* Lead Investor */}
                        <div style={{ textAlign: "center" }}>
                          <p
                            className="text-gray-400"
                            style={{
                              fontFamily: "Inter",
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              color: "#B8B8B8",
                              marginBottom: "0.44rem",
                            }}
                          >
                            Lead Investor
                          </p>
                          <p
                            className="text-white"
                            style={{ fontFamily: "Inter", fontSize: "1.25rem", fontWeight: 600, color: "#FFF" }}
                          >
                            Secured
                          </p>
                        </div>

                        {/* Term Sheet */}
                        <div style={{ textAlign: "center" }}>
                          <p
                            className="text-gray-400"
                            style={{
                              fontFamily: "Inter",
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              color: "#B8B8B8",
                              marginBottom: "0.44rem",
                            }}
                          >
                            Term Sheet
                          </p>
                          <p
                            className="text-white"
                            style={{ fontFamily: "Inter", fontSize: "1.25rem", fontWeight: 600, color: "#FFF" }}
                          >
                            Signed
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // No Active Round Display
                    <div
                      className="backdrop-blur-sm rounded-lg border border-gray-800/50 relative"
                      style={{ width: "100%", height: "15rem", borderRadius: "0.625rem", backgroundColor: "#0F0E16" }}
                    >
                      <h3
                        className="text-white absolute"
                        style={{
                          top: "5.44rem",
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontFamily: "Inter",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                        }}
                      >
                        No fundraising round is currently open.
                      </h3>
                      <p
                        className="absolute max-w-2xl"
                        style={{
                          top: "6.81rem",
                          left: "50%",
                          transform: "translateX(-50%)",
                          color: "#B8B8B8",
                          fontFamily: "Inter",
                          fontSize: "0.75rem",
                          fontWeight: 400,
                          textAlign: "center",
                        }}
                      >
                        Open a new round to add the fundraising information and track progress.
                      </p>
                      <button
                        onClick={handleAddRoundClick}
                        className="transition-colors flex items-center justify-center absolute hover:bg-purple-700"
                        style={{
                          top: "9.06rem",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "5.625rem",
                          height: "1.875rem",
                          borderRadius: "0.25rem",
                          backgroundColor: "#33005C",
                        }}
                      >
                        <span
                          className="text-white"
                          style={{ fontFamily: "Inter", fontSize: "0.625rem", fontWeight: 600 }}
                        >
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
      <AddRoundPopup isOpen={isPopupOpen} onClose={handleClosePopup} onNext={handleNextClick} />
    </div>
  )
}

export default FundraisingManagePage
