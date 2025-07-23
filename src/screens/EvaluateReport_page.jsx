import React, { useEffect, useState } from "react";
import axios from "axios";
import Background from "../assets/imgBackground.png";
import API_KEY from "../../key";
import { useLocation, useNavigate } from "react-router-dom";
import EvaluateReportComponent from "../components/EvaluateReportComponent";
import EvaluateReportOverview from "../components/EvaluateReportOverview";
import EvaluateReportCapital from "../components/EvaluateReportCapital";
import EvaluateReportSuggestions from "../components/EvaluateReportSuggestions";
import ToggleTabHeader from "../components/ToggleTabHeader";
import Sidebar from "../components/Sidebar";
import UpgradeSubscriptionPopup from "../components/UpgradeSubscriptionPopup";
import { usePermissions } from "../hooks/usePermissions";
  
function EvaluateReport_page() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileName = location?.state?.pdfFiles || "filename.pdf";
  const incomingData = location?.state?.reportData;
  const analysisId = location?.state?.analysisId;
  const [reportData, setReportData] = useState(null);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const { canUsePdfEvaluation, loading: permissionsLoading } = usePermissions();
  
  // Get current tab from URL hash, default to "Analysis"
  const validTabs = ["Analysis", "Overview",  "Suggestions"];

  const getTabFromHash = () => {
    const hash = window.location.hash.substring(1); // Remove the #
    const matchedTab = validTabs.find(tab => tab.toLowerCase() === hash.toLowerCase());
    return matchedTab || "Analysis";
  };
    const [activeTab, setActiveTab] = useState(getTabFromHash());
  useEffect(() => {
    // Check if user has appropriate subscription
    if (!canUsePdfEvaluation && !permissionsLoading) {
      setShowUpgradePopup(true);
      return;
    }
    
    // console.log('EvaluateReport_page: Checking for report data');
    // console.log('Incoming data:', incomingData);
      if (!incomingData) {
      // Try to fetch from API using analysisId
      const fetchAnalysis = async () => {
        try {
          const token = localStorage.getItem('authToken');
          if (!token) {
            console.error('No auth token found');
            navigate("/evaluate");
            return;
          }

          const response = await axios.get(
            `${API_KEY}/api/pitch/analysis/id/${analysisId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (response.data && response.data.result) {
            // console.log('Successfully fetched analysis from API');
            setReportData(response.data.result);
          } else {
            console.error('Invalid analysis data received');
            navigate("/evaluate");
          }
        } catch (error) {
          console.error('Error fetching analysis:', error);
          // Check if error is due to subscription restrictions
          if (error.response && error.response.status === 403 && error.response.data.upgradeRequired) {
            // Redirect to evaluate page where the upgrade popup will be shown
            navigate("/evaluate");
          } else if (error.response && error.response.status === 404) {
            // console.log('No analysis found with this ID');
            navigate("/evaluate");
          } else {
            navigate("/evaluate");
          }
        }
      };

      if (analysisId) {
        fetchAnalysis();
      } else {
        // console.log('No analysis ID found, redirecting to home');
        navigate("/");
      }
    } else {
      // console.log('Using incoming data');      
      setReportData(incomingData);
    }
  }, [incomingData, navigate, canUsePdfEvaluation, permissionsLoading]);// Update URL when tab changes
  const handleTabChange = (newTab) => {
    // console.log('Tab change requested:', newTab, 'Current tab:', activeTab);
    if (newTab !== activeTab) {
      setActiveTab(newTab);
      // Use history API instead of directly modifying hash to prevent page reload
      const newUrl = `${window.location.pathname}${window.location.search}#${newTab.toLowerCase()}`;
      // console.log('Updating URL to:', newUrl);
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
  // No need for cleanup since we're not using sessionStorage anymore
  const companyName = reportData?.overview?.companyName;
  const tabsArray = ["Analysis", "Overview", "Suggestions"];

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
           
        <div className="px-4 sm:px-6 md:px-12">
          {activeTab === "Analysis" && reportData && (
            <EvaluateReportComponent data={Array.isArray(reportData.breakdown) ? reportData.breakdown[0] : reportData.breakdown} />
          )}
          {activeTab === "Overview" && reportData && (
            <EvaluateReportOverview data={reportData.overview} />
          )}
          {activeTab === "Suggestions" && (
            <EvaluateReportSuggestions data={reportData} />
          )}
        </div>
      </div>
      
      {/* Subscription Upgrade Popup */}
      <UpgradeSubscriptionPopup 
        isOpen={showUpgradePopup} 
        onClose={() => {
          setShowUpgradePopup(false);
          navigate('/evaluate');
        }} 
        requiredPlans={['Launch', 'Scale']} 
      />
    </div>
  );
}

export default EvaluateReport_page;
