import React from "react";
import Sidebar from "../components/Sidebar";
import Background from "../assets/imgBackground.png";
import ToggleTabHeader from "../components/ToggleTabHeader";
import FundraisingDashboard from "../components/FundraisingDashboard";
import { useState } from "react";
import FundraisingMatches from "../components/FundraisingMatches";

function FundraisingPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const companyName = "Company Name";
  const fileName = "This company helps A to solve B by addition of C and D.";
  const companyWebsite = "www.companyname.com";
  const tabsArray = ["Dashboard", "Matches", "Reach"];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:col-span-3 bg-black text-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="w-full  h-screen overflow-y-auto">
        {/* Header */}
        <div
          className="relative px-9 py-16 text-white"
          style={{
            backgroundImage: `url(${Background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay Layer */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/80  z-0"></div>

          {/* Foreground Content */}
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">
              {companyName || "Company Name"}
            </h1>
            <p className="text-sm sm:text-base">{fileName}</p>
            <p className="mb-9 text-sm sm:text-base">{companyWebsite}</p>

            {/* Navigation Tabs */}
            <ToggleTabHeader
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabsArray={tabsArray}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 sm:px-6 md:px-12">
          {activeTab === "Dashboard" && <FundraisingDashboard />}
          {activeTab === "Matches" && <FundraisingMatches/>}
          {/* {activeTab === "Reach" && <EvaluateReportCapital />} */}
        </div>
      </div>
    </div>
  );
}

export default FundraisingPage;
