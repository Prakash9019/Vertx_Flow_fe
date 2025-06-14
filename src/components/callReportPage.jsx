import { useState } from "react";
import { ArrowLeft, Play, Search } from "lucide-react";

// SVG imports for the bottom navigation (reused from MockPitching)
import logo from "../assets/logo.svg";
import ContactsIcon from "../assets/ContactsIcon.svg";
import AddIcon from "../assets/AddIcon.svg";
import SpeedometerIcon from "../assets/SpeedometerIcon.svg";
import TuneIcon from "../assets/TuneIcon.svg";

// Reusing the bottom navigation style from MockPitching
const BottomNavigation = ({ onBack }) => {
  return (
    <div
      className="fixed bottom-2 left-0 w-full flex items-center justify-center"
      style={{ height: "4.375rem", background: "rgba(0, 0, 0, 0.90)" }}
    >
      <div
        className="flex items-center"
        style={{
          width: "20.75rem",
          height: "3.125rem",
          borderRadius: "0.5rem",
          background: "rgba(255, 255, 255, 0.94)",
          padding: "0 1rem",
          gap: "1rem",
        }}
      >
        <button
          className="flex items-center justify-center hover:opacity-80 transition-opacity"
          style={{
            width: "2.375rem",
            height: "2.375rem",
            borderRadius: "0.25rem",
            background: "#000",
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{
              width: "1.2rem",
              height: "1.2rem",
            }}
          />
        </button>

        <div
          style={{
            width: "0.0625rem",
            height: "3.125rem",
            background: "rgba(184, 184, 184, 0.40)",
          }}
        />

        <button
          className="flex items-center justify-center hover:opacity-80 transition-opacity"
          style={{
            width: "2.5rem",
            height: "2.25rem",
            borderRadius: "0.25rem",
            background: "#AD6FDE",
          }}
        >
          <img
            src={ContactsIcon}
            alt="Contacts"
            style={{ width: "1.2rem", height: "1.2rem" }}
          />
        </button>

        <button className="flex items-center justify-center hover:opacity-80 transition-opacity text-gray-600">
          <img
            src={AddIcon}
            alt="Add"
            style={{ width: "1.5rem", height: "1.5rem", filter: "invert(100%)" }}
          />
        </button>

        <button className="flex items-center justify-center hover:opacity-80 transition-opacity text-gray-600">
          <img
            src={SpeedometerIcon}
            alt="Speedometer"
            style={{ width: "1.5rem", height: "1.5rem" }}
          />
        </button>

        <button className="flex items-center justify-center hover:opacity-80 transition-opacity text-gray-600">
          <img
            src={TuneIcon}
            alt="Tune"
            style={{ width: "1.5rem", height: "1.5rem" }}
          />
        </button>

        <div
          style={{
            width: "0.0625rem",
            height: "3.125rem",
            background: "rgba(184, 184, 184, 0.40)",
          }}
        />

        <button
          onClick={onBack}
          className="flex items-center justify-center hover:opacity-80 transition-opacity text-xs font-medium"
          style={{
            width: "2.5rem",
            height: "1.875rem",
            borderRadius: "0.1875rem",
            background: "#33005C",
            color: "#AD6FDE",
          }}
        >
          EXIT
        </button>
      </div>
    </div>
  );
};

const CallDetailView = ({ investor, onBack }) => {
  const [activeTab, setActiveTab] = useState("Analysis");

  const analysisItems = [
    {
      title: "Hook & Story",
      status: "Needs Improvement",
      color: "#DE2D2D",
      bgColor: "rgba(222, 45, 45, 0.1)"
    },
    {
      title: "Problem & Urgency", 
      status: "Below Average",
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.1)"
    },
    {
      title: "Solution & Fit",
      status: "Satisfactory",
      color: "#EAB308",
      bgColor: "rgba(234, 179, 8, 0.1)"
    },
    {
      title: "Market & Opportunity",
      status: "Good",
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)"
    },
    {
      title: "Market & Opportunity",
      status: "Good", 
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white" style={{ background: "#000000" }}>
      {/* Header with background image */}
      <div
        className="relative text-white w-full"
        style={{
          height: "14.25rem",
          backgroundColor: "#f0f0f0",
          backgroundImage: "url(../src/assets/imgBackground.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 z-0" style={{ backgroundColor: "#000000CC" }}></div>

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
          style={{
            fontFamily: "Inter",
            fontSize: "1rem",
            fontWeight: 500,
            color: "#FFF",
          }}
        >
          <ArrowLeft style={{ width: "1.5rem", height: "1.5rem" }} />
          Back
        </button>

        {/* Tabs and Audio Player */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-4"
          style={{
            paddingLeft: "3.44rem",
            paddingRight: "3.87rem", 
            paddingBottom: "1.5rem",
          }}
        >
          {/* Navigation Tabs */}
          <div className="flex gap-2">
            {["Analysis", "Insights", "Summary"].map((tab) => (
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

          {/* Audio Player Container */}
          <div 
            className="flex items-center gap-4 px-4"
            style={{
              height: "3.125rem",
              borderRadius: "0.125rem",
              background: "#0F0E16",
              width: "calc(100vw - 14.62rem)",
            }}
          >
            <button
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
              style={{
                width: "1.5rem",
                height: "1.5rem",
                borderRadius: "50%",
                background: "#FFF",
                color: "#000",
              }}
            >
              <Play size={12} fill="currentColor" />
            </button>
            
            {/* Progress bar */}
            <div className="flex-1">
              <div
                className="w-full rounded-full bg-white bg-opacity-30"
                style={{ height: "0.25rem" }}
              >
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: "35%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-1"
        style={{
          paddingLeft: "4rem",
          paddingRight: "4rem",
          paddingTop: "2rem",
          paddingBottom: "8rem",
        }}
      >
        {activeTab === "Analysis" && (
        <div
        className="pt-8 pb-8 px-4 rounded-lg"
        style={{
          borderRadius: "0.625rem",
          background: "#0F0E16",
        }}
      >
      
            <div className="space-y-2">
              {analysisItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-6 rounded-lg"
                  style={{
                    background: "#000",
                    borderRadius: "0.3125rem",
                    height: "3.75rem",
                  }}
                >
                  <h3
                    className="text-white font-medium"
                    style={{
                      fontFamily: "Inter",
                      fontSize: "1.125rem",
                      fontWeight: 600,
                      color: "#FFF",
                    }}
                  >
                    {item.title}
                  </h3>
                  
                  <div 
                    className="flex items-center gap-2 px-3 py-1"
                    style={{ width: "12rem", justifyContent: "flex-start" }}
                  >
                    <div
                      className="rounded-full"
                      style={{ 
                        backgroundColor: item.color,
                        width: "0.8125rem",
                        height: "0.8125rem",
                      }}
                    ></div>
                    <span
                      className="text-sm font-medium whitespace-nowrap"
                      style={{
                        color: "#FFF",
                        fontFamily: "Inter",
                        fontSize: "0.875rem",
                        fontWeight: 400,
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Insights" && (
          <div className="text-center text-gray-400 py-12">
            <h3 className="text-xl mb-4">Insights</h3>
            <p>Detailed insights about the call will be displayed here...</p>
          </div>
        )}

        {activeTab === "Summary" && (
          <div className="text-center text-gray-400 py-12">
            <h3 className="text-xl mb-4">Summary</h3>
            <p>Call summary and key takeaways will be displayed here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallReportPage = ({ investor, onBack }) => {
  const [showDetailView, setShowDetailView] = useState(false);

  const handleViewClick = () => {
    setShowDetailView(true);
  };

  const handleBackToList = () => {
    setShowDetailView(false);
  };

  if (showDetailView) {
    return <CallDetailView investor={investor} onBack={handleBackToList} />;
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ background: "#000000" }}>
      {/* Main Content */}
      <div
        style={{
          paddingLeft: "1.88rem",
          paddingRight: "1.88rem",
          paddingTop: "2.75rem",
          paddingBottom: "6rem", // To ensure content isn't hidden behind bottom nav
        }}
      >
        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="relative">
            <Search 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              style={{
                width: "1.38644rem",
                height: "1.38644rem",
              }}
            />
            <input
              type="text"
              placeholder="Search calls..."
              className="w-full pl-12 pr-16 py-4 rounded focus:outline-none"
              style={{
                width: "100%",
                height: "3.25rem",
                borderRadius: "0.25rem",
                background: "#0F0E16",
                color: "#B8B8B8",
                fontFamily: "Inter",
                fontSize: "0.875rem",
                fontWeight: 400,
                border: "none",
                paddingLeft: "3rem",
              }}
            />
          </div>
        </div>

        {/* Table Header */}
        <div
          className="flex justify-between items-center mb-4"
          style={{
            color: "#FFF",
            fontFamily: "Inter",
            fontSize: "0.875rem",
            fontWeight: 400,
          }}
        >
          <div style={{ width: "20%" }}>Investor</div>
          <div style={{ width: "20%" }}>Connected on</div>
          <div style={{ width: "20%" }}>Duration</div>
          <div style={{ width: "20%" }}>Score</div>
          <div style={{ width: "20%" }}>Result</div>
          <div style={{ width: "10%" }}>Report</div>
        </div>

        {/* Table Row */}
        <div
          className="flex justify-between items-center p-6"
          style={{
            width: "100%",
            borderRadius: "0.3125rem",
            background: "#0F0E16",
          }}
        >
          <div style={{ width: "20%", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              className="bg-gray-600 overflow-hidden flex items-center justify-center"
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "0.1875rem",
              }}
            >
              <img
                src={investor?.image || "/placeholder.svg"}
                alt={investor?.name || "Investor"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div
                className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-sm font-bold"
                style={{ display: "none" }}
              >
                {investor?.name?.charAt(0) || "P"}
              </div>
            </div>
            <span
              style={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {investor?.name || "Persona One"}
            </span>
          </div>

          <div
            style={{
              width: "20%",
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            1 hour ago
          </div>

          <div
            style={{
              width: "20%",
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            13:49
          </div>

          <div
            style={{
              width: "20%",
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            31
          </div>

          <div
            style={{
              width: "20%",
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            BAD
          </div>

          <div style={{ width: "10%" }}>
            <button
              onClick={handleViewClick}
              className="hover:opacity-80 transition-opacity"
              style={{
                color: "#AD6FDE",
                fontFamily: "Inter",
                fontSize: "1rem",
                fontWeight: 500,
              }}
            >
              View
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Only show when not in detail view */}
      <BottomNavigation onBack={onBack} />
    </div>
  );
};

export default CallReportPage;