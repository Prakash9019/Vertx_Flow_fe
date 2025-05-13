import React, { useEffect } from "react";
import Background from "../assets/imgBackground.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import EvaluateReportComponent from "../components/EvaluateReportComponent";
import EvaluateReportOverview from "../components/EvaluateReportOverview";

function EvaluateReport_page() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileName = location.state.pdfFiles[0].name;
  console.log(location.state);
  const data = location.state.reportData;

  const [reportData, setReportData] = useState([]);
  const [activeTab, setActiveTab] = useState("Analysis");

  useEffect(() => {
    if (!data) {
      navigate("/");
    }
    setReportData(data);
    console.log(data);
  }, [data, navigate]);

  const companyName = data?.overview?.company_name;

  return (
    <div className="overflow-y-auto h-screen w-full flex flex-col md:flex-row  bg-black text-white">
      {/* Sidebar */}
      <div className="w-full md:w-1/5 bg-gray-800 p-4 text-center text-xl md:text-2xl">
        Side nav
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 md:px-12 w-full">
        {/* Header */}
        <div
          className="py-16 text-white"
          style={{
            backgroundImage: `url(${Background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">
            {companyName}
          </h1>
          <p className="mb-8 text-sm sm:text-base">
            {fileName ? fileName : "filename.pdf"}{" "}
          </p>

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

        {activeTab === "Analysis" && (
          <EvaluateReportComponent data={reportData} />
        )}

        {activeTab === "Overview" && (
          <EvaluateReportOverview data={reportData.overview} />
        )}
        {activeTab === "Match" && (
          <div className="text-white py-12">Match content goes here</div>
        )}
        {activeTab === "Suggestions" && (
          <div className="text-white py-12">Suggestions content goes here</div>
        )}
      </div>
    </div>
  );
}

export default EvaluateReport_page;
