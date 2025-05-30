import React, { useEffect, useState } from "react";
import Background from "../assets/imgBackground.png";
import { useLocation, useNavigate } from "react-router-dom";
import EvaluateReportComponent from "../components/EvaluateReportComponent";
import EvaluateReportOverview from "../components/EvaluateReportOverview";
import EvaluateReportCapital from "../components/EvaluateReportCapital";
import EvaluateReportSuggestions from "../components/EvaluateReportSuggestions";
import ToggleTabHeader from "../components/ToggleTabHeader";
import Sidebar from "../components/Sidebar";
  
function EvaluateReport_page() {
  const location = useLocation();
  const navigate = useNavigate();

  const fileName = location?.state?.pdfFiles|| "filename.pdf";
  const incomingData = location?.state?.reportData?.result;
  console.log(location?.state?.pdfFiles);
  console.log(fileName)
  console.log(incomingData)
  const [reportData, setReportData] = useState(null);
  const [activeTab, setActiveTab] = useState("Analysis");

  useEffect(() => {
    if (!incomingData) {
      navigate("/");
    } else {
      setReportData(incomingData);
    }
  }, [incomingData, navigate]);

  const companyName = reportData?.overview?.company_name;

  const tabsArray = ["Analysis", "Overview", "Capital", "Suggestions"];

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
            <p className="mb-8 text-sm sm:text-base">{fileName}</p>

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
          {activeTab === "Analysis" && reportData && (
            <EvaluateReportComponent data={reportData} />
          )}
          {activeTab === "Overview" && reportData && (
            <EvaluateReportOverview data={reportData.overview} />
          )}
          {activeTab === "Capital" && (
            <EvaluateReportCapital data={reportData} />
          )}
          {activeTab === "Suggestions" && (
            <EvaluateReportSuggestions data={reportData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default EvaluateReport_page;
