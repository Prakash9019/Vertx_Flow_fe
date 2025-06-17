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
  const incomingData = location?.state?.reportData;
  const [reportData, setReportData] = useState(null);
  
  // Get current tab from URL hash, default to "Analysis"
  const validTabs = ["Analysis", "Overview", "Capital", "Suggestions"];
  const getTabFromHash = () => {
    const hash = window.location.hash.substring(1); // Remove the #
    const matchedTab = validTabs.find(tab => tab.toLowerCase() === hash.toLowerCase());
    return matchedTab || "Analysis";
  };
    const [activeTab, setActiveTab] = useState(getTabFromHash());
  useEffect(() => {
    console.log('EvaluateReport_page: Checking for report data');
    console.log('Incoming data:', incomingData);
    
    if (!incomingData) {
      // Check if we have stored report data in sessionStorage as fallback
      const storedData = sessionStorage.getItem('evaluateReportData');
      console.log('Stored data:', storedData);
      
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          console.log('Successfully parsed stored data');
          setReportData(parsedData);
        } catch (error) {
          console.error('Error parsing stored report data:', error);
          navigate("/");
        }
      } else {
        console.log('No report data found, redirecting to home');
        navigate("/");
      }
    } else {
      console.log('Using incoming data');
      setReportData(incomingData);
      // Store data in sessionStorage for tab navigation persistence
      sessionStorage.setItem('evaluateReportData', JSON.stringify(incomingData));
    }
  }, [incomingData, navigate]);// Update URL when tab changes
  const handleTabChange = (newTab) => {
    console.log('Tab change requested:', newTab, 'Current tab:', activeTab);
    if (newTab !== activeTab) {
      setActiveTab(newTab);
      // Use history API instead of directly modifying hash to prevent page reload
      const newUrl = `${window.location.pathname}${window.location.search}#${newTab.toLowerCase()}`;
      console.log('Updating URL to:', newUrl);
      window.history.pushState({}, '', newUrl);
    }
  };
  // Listen for hash changes (browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const newTab = getTabFromHash();
      setActiveTab(newTab);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Cleanup sessionStorage when component unmounts
  useEffect(() => {
    return () => {
      // Only clear if we're navigating away from the evaluate section
      if (!window.location.pathname.includes('/evaluate')) {
        sessionStorage.removeItem('evaluateReportData');
      }
    };
  }, []);
  const companyName = reportData?.overview?.company_name;
  const tabsArray = ["Analysis", "Overview", "Capital", "Suggestions"];

  // If no report data, don't render the page content
  if (!reportData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading Report...</h2>
          <p className="text-gray-400">Please wait while we load your evaluation report.</p>
        </div>
      </div>
    );
  }

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
            <p className="mb-8 text-sm sm:text-base">{fileName}</p>            {/* Navigation Tabs */}
            <ToggleTabHeader
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              tabsArray={tabsArray}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 sm:px-6 md:px-12">
          {activeTab === "Analysis" && reportData && (
            <EvaluateReportComponent data={Array.isArray(reportData.breakdown) ? reportData.breakdown[0] : reportData.breakdown} />
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
