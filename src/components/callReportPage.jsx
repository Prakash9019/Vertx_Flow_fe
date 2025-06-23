import { useState } from "react";
import { ArrowLeft, Play, Search } from "lucide-react";
import logo from "../assets/logo.svg";
import ContactsIcon from "../assets/ContactsIcon.svg";
import AddIcon from "../assets/AddIcon.svg";
import SpeedometerIcon from "../assets/SpeedometerIcon.svg";
import TuneIcon from "../assets/TuneIcon.svg";
import { ChevronDown } from "lucide-react";

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

const CallDetailView = ({ analysis, onBack }) => {
  const [activeTab, setActiveTab] = useState("Analysis");
  const [expandedIndex, setExpandedIndex] = useState(null);
const toggleExpand = (index) => {
  setExpandedIndex((prev) => (prev === index ? null : index));
}
  const getColor = (score) => {
    if (score >= 75) return ["Excellent", "#10B981"];
    if (score >= 60) return ["Good", "#22D3EE"];
    if (score >= 45) return ["Satisfactory", "#EAB308"];
    if (score >= 30) return ["Below Average", "#F59E0B"];
    return ["Needs Improvement", "#DE2D2D"];
  };

  const categoryScores = Object.entries(analysis?.category_scores || {}).map(([title, scoreData]) => {
    const score = typeof scoreData === 'object' ? scoreData.score : scoreData;
    const [label, color] = getColor(score);
    return { title: title.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), status: label, color, score };
  });

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
        className="flex-1 hide-scrollbar"
        style={{
          paddingLeft: "4rem",
          paddingRight: "4rem",
          paddingTop: "2rem",
          paddingBottom: "8rem",
          maxHeight: "calc(100vh - 14.25rem)", // 14.25rem is the header height
          overflowY: "auto", // Enable vertical scrolling
          scrollbarWidth: "none",        // Firefox
          msOverflowStyle: "none",       // IE and Edge
        }}
      >
        {/* {activeTab === "Analysis" && (
          <div
            className="pt-8 pb-8 px-4 rounded-lg"
            style={{
              borderRadius: "0.625rem",
              background: "#0F0E16",
            }}
          >
            <div className="space-y-2">
              {categoryScores.map((item, index) => (
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
        )} */}

        {/* {activeTab === "Analysis" && (
  <div
    className="px-8 py-6"
    style={{
      background: "#0F0E16",
      borderRadius: "10px",
    }}
  >
    <div className="space-y-4">
      {categoryScores.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center px-6 py-4"
          style={{
            background: "#000000",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              color: "#FFFFFF",
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "18px",
              lineHeight: "22px",
            }}
          >
            {item.title}
          </div>

          <div className="flex items-center gap-2">
            <span
              style={{
                width: "13px",
                height: "13px",
                borderRadius: "999px",
                backgroundColor: item.color,
                display: "inline-block",
              }}
            />
            <span
              style={{
                color: "#FFFFFF",
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "17px",
              }}
            >
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
)} */}



{activeTab === "Analysis" && (
  <div className="space-y-4">
    {categoryScores.map((item, index) => {
      const isExpanded = expandedIndex === index;
      const key = item.title.toLowerCase().replace(/ /g, "_");
      const categoryData = analysis?.category_scores?.[key] || {};
      const description = categoryData?.description; // ← Correct key
      const score = categoryData?.score;
      const rating = categoryData?.rating;

      return (
        <div
          key={index}
          className="rounded-md overflow-hidden"
          style={{ background: "#0F0E16" }}
        >
          {/* Accordion Header */}
          <div
            onClick={() => toggleExpand(index)}
            className="flex items-center justify-between px-6 py-4 cursor-pointer"
            style={{ background: "#000", borderRadius: "5px" }}
          >
            <div className="text-white text-base font-semibold font-['Inter']">
              {item.title}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span
                  style={{
                    backgroundColor: item.color,
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                />
                <span className="text-white text-sm font-semibold font-['Inter']">
                  {item.status}
                </span>
              </div>
              <ChevronDown
                size={20}
                color="#FFF"
                style={{
                  transition: "transform 0.3s ease",
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </div>
          </div>

          {/* Accordion Content */}
          {isExpanded && (
            <div
              className="px-6 py-4 text-sm font-['Inter']"
              style={{
                background: "#0F0E16",
                borderTop: "1px solid #222",
              }}
            >
              {score !== undefined && (
                <div className="text-white font-semibold mb-1">
                  Score: <span className="font-normal text-gray-300">{score}</span>
                </div>
              )}
              {rating && (
                <div className="text-white font-semibold mb-1">
                  Rating: <span className="font-normal text-gray-300">{rating}</span>
                </div>
              )}
              {description && (
                <div className="text-gray-300">
                  {description}
                </div>
              )}
              {!description && (
                  <div className="text-gray-500 italic">No description available.</div>
              )}
            </div>
          )}
        </div>
      );
    })}
  </div>
)}



        {/* {activeTab === "Insights" && (
          <div
            className="pt-8 pb-8 px-4 rounded-lg space-y-4"
            style={{
              borderRadius: "0.625rem",
              background: "#0F0E16",
            }}
          >
            {analysis?.investor_perspective && (
              <div className="p-4 rounded-lg" style={{ background: "#000" }}>
                <h4 className="text-white font-medium mb-2" style={{ fontFamily: "Inter", fontSize: "1rem", fontWeight: 600 }}>Investor Perspective</h4>
                <p className="text-gray-300" style={{ fontFamily: "Inter", fontSize: "0.875rem" }}>{analysis.investor_perspective}</p>
              </div>
            )}
            {analysis?.key_recommendations && analysis.key_recommendations.length > 0 && (
              <div className="p-4 rounded-lg" style={{ background: "#000" }}>
                <h4 className="text-white font-medium mb-2" style={{ fontFamily: "Inter", fontSize: "1rem", fontWeight: 600 }}>Key Recommendations</h4>
                <ul className="text-gray-300 space-y-1" style={{ fontFamily: "Inter", fontSize: "0.875rem" }}>
                  {analysis.key_recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
            {analysis?.next_steps && analysis.next_steps.length > 0 && (
              <div className="p-4 rounded-lg" style={{ background: "#000" }}>
                <h4 className="text-white font-medium mb-2" style={{ fontFamily: "Inter", fontSize: "1rem", fontWeight: 600 }}>Next Steps</h4>
                <ul className="text-gray-300 space-y-1" style={{ fontFamily: "Inter", fontSize: "0.875rem" }}>
                  {analysis.next_steps.map((step, index) => (
                    <li key={index}>• {step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )} */}
        {activeTab === "Insights" && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 py-8">
    
    {/* ENGAGEMENT */}
    <div className="bg-[#0F0E16] rounded-lg p-5 text-white flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">Engagement</h3>
          <span className="text-xl">🗣️</span>
        </div>
        <p className="text-sm text-gray-400 mb-2">
          How much you talked vs. how much you listened
        </p>
        <div className="flex justify-between text-2xl font-bold mb-2">
          <div>
            <div className="text-sm text-gray-400 font-normal">Listened</div>
            <div>{analysis?.category_scores?.engagement?.listened_count ?? "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 font-normal">Talked</div>
            <div>{analysis?.category_scores?.engagement?.talked_count ?? "-"}</div>
          </div>
        </div>
        <div className="text-red-500 text-sm font-medium">
          {analysis?.category_scores?.engagement?.rating ?? "-"}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {analysis?.category_scores?.engagement?.description}
        </div>
      </div>
      <button className="mt-4 text-sm text-white bg-black/50 w-full py-2 rounded-md hover:bg-black/70 transition">
        View detailed insights →
      </button>
    </div>

    {/* FLUENCY */}
    <div className="bg-[#0F0E16] rounded-lg p-5 text-white flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">Fluency</h3>
          <span className="text-xl">🧠</span>
        </div>
        <p className="text-sm text-gray-400 mb-2">
          Fluency tells how smoothly and confidently you speak
        </p>
        <div className="grid grid-cols-3 text-center text-lg font-bold mb-2">
          <div>
            <div className="text-xs text-gray-400">Fillers</div>
            <div>{analysis?.category_scores?.fluency?.fillers ?? "-"}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Grammar</div>
            <div>{analysis?.category_scores?.fluency?.grammar ?? "-"}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Vocab</div>
            <div>{analysis?.category_scores?.fluency?.vocabulary ?? "-"}</div>
          </div>
        </div>
        <div className={`text-sm font-medium ${
          analysis?.category_scores?.fluency?.rating === "Good" ? "text-teal-400" :
          analysis?.category_scores?.fluency?.rating === "Average" ? "text-yellow-400" : "text-red-500"
        }`}>
          {analysis?.category_scores?.fluency?.rating ?? "-"}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {analysis?.category_scores?.fluency?.description}
        </div>
      </div>
      <button className="mt-4 text-sm text-white bg-black/50 w-full py-2 rounded-md hover:bg-black/70 transition">
        View detailed insights →
      </button>
    </div>

    {/* INTERACTIVITY */}
    <div className="bg-[#0F0E16] rounded-lg p-5 text-white flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">Interactivity</h3>
          <span className="text-xl">🔁</span>
        </div>
        <p className="text-sm text-gray-400 mb-2">
          How often the conversation switched
        </p>
        <div className="text-3xl font-bold mb-2">
          {analysis?.category_scores?.interactivity?.score ?? "-"}
        </div>
        <div className="text-red-500 text-sm font-medium">
          {analysis?.category_scores?.interactivity?.rating ?? "-"}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {analysis?.category_scores?.interactivity?.description}
        </div>
      </div>
      <button className="mt-4 text-sm text-white bg-black/50 w-full py-2 rounded-md hover:bg-black/70 transition">
        View detailed insights →
      </button>
    </div>

    {/* QUESTIONS ASKED */}
    <div className="bg-[#0F0E16] rounded-lg p-5 text-white flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">Questions Asked</h3>
          <span className="text-xl">❓</span>
        </div>
        <p className="text-sm text-gray-400 mb-2">
          Number of questions asked per minute
        </p>
        <div className="text-3xl font-bold mb-2">
          {analysis?.category_scores?.questions_asked?.score ?? "-"}
        </div>
        <div className="text-red-500 text-sm font-medium">
          {analysis?.category_scores?.questions_asked?.rating ?? "-"}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {analysis?.category_scores?.questions_asked?.description}
        </div>
      </div>
      <button className="mt-4 text-sm text-white bg-black/50 w-full py-2 rounded-md hover:bg-black/70 transition">
        View detailed insights →
      </button>
    </div>

  </div>
)}


        {activeTab === "Summary" && (
          <div className="relative flex flex-col gap-8 items-start w-[1145px] max-w-full min-h-[430px] mx-auto mt-4">
            {/* Founder Performance Box */}
            <div className="relative bg-[#0F0E16] rounded-[15px] px-12 py-8 w-full shadow-lg">
              <div className="absolute left-0 top-8 h-[28px] w-[5px] bg-[#AD6FDE] rounded" />
              <h2 className="ml-7 text-white font-inter font-semibold text-[24px] leading-[29px] mb-2">
                Founder Performance
              </h2>
              <div className="flex flex-col gap-6 ml-7 w-full mt-4">
                {Array.isArray(analysis?.founder_performance) && analysis.founder_performance.length > 0 ? (
                  analysis.founder_performance.map((item, idx) => (
                    <div key={idx}>
                      <h4 className="text-white font-medium text-[18px] leading-[22px] mb-1">{item.title}</h4>
                      <p className="text-[#B8B8B8] text-[14px] leading-[17px] max-w-[726px]">
                        {item.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div>
                    <p className="text-[#B8B8B8] text-[14px] leading-[17px]">No data available.</p>
                  </div>
                )}
              </div>
            </div>

            {/* What Worked Box */}
            <div className="relative bg-[#0F0E16] rounded-[15px] px-12 py-8 w-full shadow-lg">
              <div className="absolute left-0 top-8 h-[28px] w-[5px] bg-[#AD6FDE] rounded" />
              <h2 className="ml-7 text-white font-inter font-semibold text-[24px] leading-[29px] mb-2">
                What Worked
              </h2>
              <div className="flex flex-col gap-6 ml-7 w-full mt-4">
              {Array.isArray(analysis?.what_worked) && analysis.what_worked.length > 0 ? (analysis.what_worked.map((item, idx) => (
                    <div key={idx}>
                      <h4 className="text-white font-medium text-[18px] leading-[22px] mb-1">{item}</h4>
                    </div>
                  ))
                ) : (
                  <div>
                    <p className="text-[#B8B8B8] text-[14px] leading-[17px]">No data available.</p>
                  </div>
                )}
              </div>
            </div>

            {/* What Didn't Work Box */}
            <div className="relative bg-[#0F0E16] rounded-[15px] px-12 py-8 w-full shadow-lg">
              <div className="absolute left-0 top-8 h-[28px] w-[5px] bg-[#AD6FDE] rounded" />
               <h2 className="ml-7 text-white font-inter font-semibold text-[24px] leading-[29px] mb-2">
                What Didn't Work
              </h2>
              <div className="flex flex-col gap-6 ml-7 w-full mt-4">
              {Array.isArray(analysis?.what_didnt_work) && analysis.what_didnt_work.length > 0 ? (analysis.what_didnt_work.map((item, idx) => (
                    <div key={idx}>
                      <h4 className="text-white font-medium text-[18px] leading-[22px] mb-1">{item}</h4>
                    </div>
                  ))
                ) : (
                  <div>
                    <p className="text-[#B8B8B8] text-[14px] leading-[17px]">No data available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

const CallReportPage = ({ investor, analysis, onBack }) => {
  const [showDetailView, setShowDetailView] = useState(false);
  const handleViewClick = () => setShowDetailView(true);
  if (showDetailView) return <CallDetailView analysis={analysis} onBack={() => setShowDetailView(false)} />;

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
            {analysis?.timestamp ? new Date(analysis.timestamp).toLocaleString() : "Now"}
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
            {analysis?.session_duration_minutes ? `${Math.floor(analysis.session_duration_minutes)}:${String(Math.floor((analysis.session_duration_minutes % 1) * 60)).padStart(2, '0')}` : "0:00"}
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
            {analysis?.overall_score || "-"}
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
            {analysis?.overall_rating || "-"}
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
