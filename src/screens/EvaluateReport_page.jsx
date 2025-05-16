import React, { useEffect, useState } from "react";
import Background from "../assets/imgBackground.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import EvaluateReportComponent from "../components/EvaluateReportComponent";
import EvaluateReportOverview from "../components/EvaluateReportOverview";
import Sidebar from "../components/Sidebar";

function EvaluateReport_page() {
  const location = useLocation();
  const navigate = useNavigate();

  const fileName = location?.state?.pdfFiles?.[0]?.name || "filename.pdf";
  const incomingData = location?.state?.reportData;

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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      {/* <div className="w-full md:w-3/12 bg-black text-white"> */}
      <div className="md:col-span-3 bg-black text-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="w-full  h-screen overflow-y-auto">
        {/* Header */}
        <div
          className="px-9 py-16 text-white"
          style={{
            backgroundImage: `url(${Background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">
            {companyName || "Company Name"}
          </h1>
          <p className="mb-8 text-sm sm:text-base">{fileName}</p>

          {/* Navigation Tabs */}
          <div className="bg-purple-900 rounded-md px-3 py-2 w-full sm:w-fit">
            <ul className="flex justify-between flex-wrap gap-2 text-sm sm:text-base">
              {["Analysis", "Overview", "Match", "Suggestions"].map((tab) => (
                <li
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`cursor-pointer px-2 sm:px-4 py-1 rounded-md font-semibold ${
                    activeTab === tab
                      ? "bg-white text-purple-700"
                      : "hover:bg-white hover:text-purple-700"
                  }`}
                >
                  {tab}
                </li>
              ))}
            </ul>
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
          {activeTab === "Match" && (
            <div className="text-white py-12">Match content goes here</div>
          )}
          {activeTab === "Suggestions" && (
            <div className="text-white py-12">
              Suggestions content goes here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EvaluateReport_page;
