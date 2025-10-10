import { useState,useEffect} from "react";
import { ArrowLeft, Play, Search } from "lucide-react";
import logo from "../../assets/logo.svg";
import ContactsIcon from "../../assets/ContactsIcon.svg";
import AddIcon from "../../assets/AddIcon.svg";
import SpeedometerIcon from "../../assets/SpeedometerIcon.svg";
import TuneIcon from "../../assets/TuneIcon.svg";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";


const BottomNavigation = ({ onBack }) => {
  const navigate = useNavigate();

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
        onClick={() => navigate("/playground/mockpitching/report")}
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

        <button 
        onClick={() => navigate("/playground/mockpitching/create")}
         className="flex items-center justify-center hover:opacity-80 transition-opacity text-gray-600">
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
          onClick={() => navigate("/playground")}
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
  const [savedReports, setSavedReports] = useState([]);

useEffect(() => {
  const reports = JSON.parse(localStorage.getItem("callReports")) || [];
  setSavedReports(reports.reverse()); // latest on top
}, []);
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
    <div className="min-h-screen bg-black text-white">
      <div
        className="relative text-white w-full h-40 md:h-[14.25rem] bg-[#f0f0f0] bg-[url(/imgBackground.png)] bg-no-repeat bg-cover bg-center"
      >
        <div className="absolute inset-0 z-0 bg-[#000000CC]"></div>

        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-20 flex items-center gap-1 text-white hover:opacity-80 transition-opacity font-inter text-sm font-medium md:top-6 md:left-6 md:text-base"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          Back
        </button>

        <div
          className="absolute bottom-0 left-0 right-0 z-10 flex flex-col sm:flex-row items-start sm:items-center gap-2 px-3 sm:px-8 lg:px-14 pb-3 sm:pb-6"
        >
          <div className="flex gap-2">
            {["Analysis", "Insights", "Summary"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full transition-colors h-8 text-sm font-inter md:h-10 md:text-base ${
                  activeTab === tab
                    ? "bg-white text-black font-medium w-20 md:w-24"
                    : "bg-[#0F0E16] text-[#656565] font-normal w-16 md:w-20"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* <div
            className="flex items-center gap-3 px-3 h-10 rounded-sm bg-[#0F0E16] w-full sm:w-auto sm:flex-1 md:gap-4 md:px-4 md:h-[3.125rem]"
          >
            <button
              className="flex items-center justify-center hover:opacity-80 transition-opacity w-5 h-5 rounded-full bg-white text-black md:w-6 md:h-6"
            >
              <Play size={10} fill="currentColor" />
            </button>
            
            <div className="flex-1">
              <div
                className="w-full rounded-full bg-white bg-opacity-30 h-1"
              >
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: "35%" }}
                ></div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <div
        className="flex-1 hide-scrollbar px-3 sm:px-8 lg:px-16 pt-6 pb-24 md:pt-8 md:pb-32"
        style={{
          maxHeight: "calc(100vh - 14.25rem)",
          overflowY: "auto",
        }}
      >
        {activeTab === "Analysis" && (
          <div className="space-y-3 md:space-y-4">
            {categoryScores
              .filter(
                (item) =>
                  ![
                    "engagement",
                    "fluency",
                    "interactivity",
                    "questions_asked",
                  ].includes(item.title.toLowerCase().replace(/ /g, "_"))
              )
              .map((item, index) => {
                const isExpanded = expandedIndex === index;
                const key = item.title.toLowerCase().replace(/ /g, "_");
                const categoryData = analysis?.category_scores?.[key] || {};
                const description = categoryData?.description;
                const score = categoryData?.score;
                const rating = categoryData?.rating;

                return (
                  <div
                    key={index}
                    className="rounded-md overflow-hidden bg-[#0F0E16]"
                  >
                    <div
                      onClick={() => toggleExpand(index)}
                      className="flex items-center justify-between px-3 sm:px-6 py-3 cursor-pointer bg-black rounded md:py-4"
                    >
                      <div className="text-white text-sm font-semibold font-['Inter'] md:text-base">
                        {item.title}
                      </div>

                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="flex items-center gap-1 md:gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block md:w-3 md:h-3"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-white text-xs font-semibold font-['Inter'] md:text-sm">
                            {item.status}
                          </span>
                        </div>
                        <ChevronDown
                          size={20} 
                          color="#FFF"
                          className={`transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </div>
                    </div>

                    {isExpanded && (
                      <div
                        className="px-3 sm:px-6 py-3 text-xs font-['Inter'] bg-[#0F0E16] border-t border-[#222] md:py-4 md:text-sm"
                      >
                        {score !== undefined && (
                          <div className="text-white font-semibold mb-1">
                            Score:{" "}
                            <span className="font-normal text-gray-300">
                              {score}
                            </span>
                          </div>
                        )}
                        {rating && (
                          <div className="text-white font-semibold mb-1">
                            Rating:{" "}
                            <span className="font-normal text-gray-300">
                              {rating}
                            </span>
                          </div>
                        )}
                        {description ? (
                          <div className="text-gray-300">{description}</div>
                        ) : (
                          <div className="text-gray-500 italic">
                            No description available.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {activeTab === "Insights" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-1 sm:px-6 py-6 md:gap-6 md:py-8">
            <div className="bg-[#0F0E16] rounded-lg p-4 text-white flex flex-col justify-between md:p-5">
              <div>
                <div className="flex justify-between items-start mb-2 md:mb-3">
                  <h3 className="text-base font-semibold md:text-lg">Engagement</h3>
                  <span className="text-lg md:text-xl">🗣️</span>
                </div>
                <p className="text-xs text-gray-400 mb-1 md:text-sm md:mb-2">
                  How much you talked vs. how much you listened
                </p>
                <div className="flex justify-between text-xl font-bold mb-2 md:text-2xl">
                  <div>
                    <div className="text-xs text-gray-400 font-normal md:text-sm">
                      Listened
                    </div>
                    <div>{analysis?.category_scores?.engagement?.listened_count ?? "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-normal md:text-sm">
                      Talked
                    </div>
                    <div>{analysis?.category_scores?.engagement?.talked_count ?? "-"}</div>
                  </div>
                </div>
                <div className="text-red-500 text-xs font-medium md:text-sm">
                  {analysis?.category_scores?.engagement?.rating ?? "-"}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {analysis?.category_scores?.engagement?.description}
                </div>
              </div>
              <button className="mt-3 text-xs text-white bg-black/50 w-full py-1.5 rounded-md hover:bg-black/70 transition md:mt-4 md:text-sm md:py-2">
                View detailed insights →
              </button>
            </div>

            <div className="bg-[#0F0E16] rounded-lg p-4 text-white flex flex-col justify-between md:p-5">
              <div>
                <div className="flex justify-between items-start mb-2 md:mb-3">
                  <h3 className="text-base font-semibold md:text-lg">Fluency</h3>
                  <span className="text-lg md:text-xl">🧠</span>
                </div>
                <p className="text-xs text-gray-400 mb-1 md:text-sm md:mb-2">
                  Fluency tells how smoothly and confidently you speak
                </p>
                <div className="grid grid-cols-3 text-center text-base font-bold mb-2 md:text-lg">
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
                <div className={`text-xs font-medium md:text-sm ${
                  analysis?.category_scores?.fluency?.rating === "Good" ? "text-teal-400" :
                  analysis?.category_scores?.fluency?.rating === "Average" ? "text-yellow-400" : "text-red-500"
                }`}>
                  {analysis?.category_scores?.fluency?.rating ?? "-"}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {analysis?.category_scores?.fluency?.description}
                </div>
              </div>
              <button className="mt-3 text-xs text-white bg-black/50 w-full py-1.5 rounded-md hover:bg-black/70 transition md:mt-4 md:text-sm md:py-2">
                View detailed insights →
              </button>
            </div>

            <div className="bg-[#0F0E16] rounded-lg p-4 text-white flex flex-col justify-between md:p-5">
              <div>
                <div className="flex justify-between items-start mb-2 md:mb-3">
                  <h3 className="text-base font-semibold md:text-lg">Interactivity</h3>
                  <span className="text-lg md:text-xl">🔁</span>
                </div>
                <p className="text-xs text-gray-400 mb-1 md:text-sm md:mb-2">
                  How often the conversation switched
                </p>
                <div className="text-2xl font-bold mb-2 md:text-3xl">
                  {analysis?.category_scores?.interactivity?.score ?? "-"}
                </div>
                <div className="text-red-500 text-xs font-medium md:text-sm">
                  {analysis?.category_scores?.interactivity?.rating ?? "-"}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {analysis?.category_scores?.interactivity?.description}
                </div>
              </div>
              <button className="mt-3 text-xs text-white bg-black/50 w-full py-1.5 rounded-md hover:bg-black/70 transition md:mt-4 md:text-sm md:py-2">
                View detailed insights →
              </button>
            </div>

            <div className="bg-[#0F0E16] rounded-lg p-4 text-white flex flex-col justify-between md:p-5">
              <div>
                <div className="flex justify-between items-start mb-2 md:mb-3">
                  <h3 className="text-base font-semibold md:text-lg">Questions Asked</h3>
                  <span className="text-lg md:text-xl">❓</span>
                </div>
                <p className="text-xs text-gray-400 mb-1 md:text-sm md:mb-2">
                  Number of questions asked per minute
                </p>
                <div className="text-2xl font-bold mb-2 md:text-3xl">
                  {analysis?.category_scores?.questions_asked?.score ?? "-"}
                </div>
                <div className="text-red-500 text-xs font-medium md:text-sm">
                  {analysis?.category_scores?.questions_asked?.rating ?? "-"}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {analysis?.category_scores?.questions_asked?.description}
                </div>
              </div>
              <button className="mt-3 text-xs text-white bg-black/50 w-full py-1.5 rounded-md hover:bg-black/70 transition md:mt-4 md:text-sm md:py-2">
                View detailed insights →
              </button>
            </div>
          </div>
        )}

        {activeTab === "Summary" && (
          <div className="relative flex flex-col gap-6 items-start w-full max-w-[1145px] mx-auto mt-2 md:mt-4 md:gap-8">
            <div className="relative bg-[#0F0E16] rounded-[15px] px-4 sm:px-12 py-6 w-full shadow-lg md:py-8">
              <div className="absolute left-0 top-6 h-6 w-[4px] bg-[#AD6FDE] rounded md:top-8 md:h-7 md:w-[5px]" />
              <h2 className="ml-6 text-white font-inter font-semibold text-lg leading-6 mb-1 md:ml-7 md:text-xl md:leading-7">
                Founder Performance
              </h2>
              <div className="flex flex-col gap-4 ml-6 w-full mt-3 md:ml-7 md:gap-6 md:mt-4">
                {Array.isArray(analysis?.founder_performance) && analysis.founder_performance.length > 0 ? (
                  analysis.founder_performance.map((item, idx) => (
                    <div key={idx}>
                      <h4 className="text-white font-medium text-base leading-5 mb-0.5 md:text-lg md:leading-6">{item.title}</h4>
                      <p className="text-[#B8B8B8] text-xs leading-4 max-w-[726px] md:text-sm md:leading-5">
                        {item.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div>
                    <p className="text-[#B8B8B8] text-xs leading-4 md:text-sm md:leading-5">No data available.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="relative bg-[#0F0E16] rounded-[15px] px-4 sm:px-12 py-6 w-full shadow-lg md:py-8">
              <div className="absolute left-0 top-6 h-6 w-[4px] bg-[#AD6FDE] rounded md:top-8 md:h-7 md:w-[5px]" />
              <h2 className="ml-6 text-white font-inter font-semibold text-lg leading-6 mb-1 md:ml-7 md:text-xl md:leading-7">
                What Worked
              </h2>
              <div className="flex flex-col gap-4 ml-6 w-full mt-3 md:ml-7 md:gap-6 md:mt-4">
                {Array.isArray(analysis?.what_worked) && analysis.what_worked.length > 0 ? (
                  analysis.what_worked.map((item, idx) => (
                    <div key={idx}>
                      <h4 className="text-white font-medium text-base leading-5 mb-0.5 md:text-lg md:leading-6">{item}</h4>
                    </div>
                  ))
                ) : (
                  <div>
                    <p className="text-[#B8B8B8] text-xs leading-4 md:text-sm md:leading-5">No data available.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="relative bg-[#0F0E16] rounded-[15px] px-4 sm:px-12 py-6 w-full shadow-lg md:py-8">
              <div className="absolute left-0 top-6 h-6 w-[4px] bg-[#AD6FDE] rounded md:top-8 md:h-7 md:w-[5px]" />
              <h2 className="ml-6 text-white font-inter font-semibold text-lg leading-6 mb-1 md:ml-7 md:text-xl md:leading-7">
                What Didn't Work
              </h2>
              <div className="flex flex-col gap-4 ml-6 w-full mt-3 md:ml-7 md:gap-6 md:mt-4">
                {Array.isArray(analysis?.what_didnt_work) && analysis.what_didnt_work.length > 0 ? (
                  analysis.what_didnt_work.map((item, idx) => (
                    <div key={idx}>
                      <h4 className="text-white font-medium text-base leading-5 mb-0.5 md:text-lg md:leading-6">{item}</h4>
                    </div>
                  ))
                ) : (
                  <div>
                    <p className="text-[#B8B8B8] text-xs leading-4 md:text-sm md:leading-5">No data available.</p>
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

const CallReportPage = ({ investor, analysis:initialAnalysis, onBack }) => {
  const [showDetailView, setShowDetailView] = useState(false);
  const [reportHistory, setReportHistory] = useState([]);
  const [analysis, setAnalysis] = useState(initialAnalysis);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("pitch_reports") || "[]");
    setReportHistory(stored);

    if (!initialAnalysis) {
      const selected = JSON.parse(localStorage.getItem("selected_report"));
      if (selected) setAnalysis(selected);
    }
  }, []);

  useEffect(() => {
  if (!analysis) {
    const selected = JSON.parse(localStorage.getItem("selected_report"));
    if (selected) setAnalysis(selected);
  }
}, []);
  const handleViewClick = (report) => {
    setAnalysis(report);  
    setShowDetailView(true);
    
  }

  const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now - time;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} h ago`;

  // fallback to formatted date
  return time.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};


  const handleDelete = (indexToDelete) => {
  const updatedReports = reportHistory.filter((_, idx) => idx !== indexToDelete);
  setReportHistory(updatedReports);
  localStorage.setItem("pitch_reports", JSON.stringify(updatedReports));
};

    if (showDetailView) return <CallDetailView analysis={analysis} onBack={() => setShowDetailView(false)} />;

  return (
    <div className="min-h-screen bg-black text-white" style={{ background: "#000000" }}>
    <div className="px-4 pt-6 pb-20 md:px-7 md:pt-11 md:pb-24">
        <div className="relative mb-8">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-[1.38644rem] md:h-[1.38644rem]" />
                <input
                    type="text"
                    placeholder="Search calls..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                    className="w-full pl-12 pr-16 py-2 rounded focus:outline-none h-[3.25rem] bg-[#0F0E16] text-[#B8B8B8] font-inter text-xs font-normal border-none"
                />
            </div>
        </div>

        <div className="hidden md:flex justify-between items-center ml-6 mb-4 text-white font-inter text-sm font-normal">
            <div className="w-[20%]">Investor</div>
            <div className="w-[20%] pl-6 lg:pl-10">Connected on</div>
            <div className="w-[20%] -ml-1 lg:ml-2">Duration</div>
            <div className="w-[20%] -ml-3 lg:ml-2">Score</div>
            <div className="w-[20%] pl-3 lg:pl-12">Result</div>
            <div className="w-[10%] mr-7 text-center">Report</div>
        </div>

        <div className="overflow-y-auto hide-scrollbar max-h-[calc(100vh-180px)] md:max-h-[60vh] pr-0 md:pr-2">
            {(() => {
                const filteredReports = reportHistory.filter((report) => {
                    const name = report.investorName?.toLowerCase() || "";
                    const connectedAgo = formatTimeAgo(report.timestamp).toLowerCase();
                    return name.includes(searchTerm) || connectedAgo.includes(searchTerm);
                });

                if (filteredReports.length === 0) {
                    return (
                        <div className="text-center text-gray-400 text-sm py-8 md:text-lg">
                            No reports found.
                        </div>
                    );
                }

                return filteredReports.map((report, index) => (
                    <div
                        key={index}
                        className="flex flex-wrap md:flex-nowrap justify-between items-center p-3 mb-2 w-full rounded-[0.3125rem] bg-[#0F0E16] text-xs md:p-6 md:mb-2 md:text-base"
                    >
                        <div className="w-full mb-1 md:mb-0 md:w-[20%] flex items-center gap-2 md:gap-4">
                            <div className="bg-gray-600 overflow-hidden flex items-center justify-center w-7 h-7 rounded-[0.1875rem] md:w-10 md:h-10">
                                <img
                                    src={report.investorImage || "/placeholder.svg"}
                                    alt={report.investorName || "Investor"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display = "flex";
                                    }}
                                />
                                <div
                                    className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold md:text-sm"
                                    style={{ display: "none" }}
                                >
                                    {report.investorName?.charAt(0) || "P"}
                                </div>
                            </div>
                            <span className="text-white font-inter text-sm font-semibold md:text-base">
                                {report.investorName || "Persona One"}
                            </span>
                        </div>

                        <div className="w-full flex justify-between items-center md:w-[80%] md:flex-nowrap">
                            <div className="w-1/2 md:w-[20%] text-white font-inter text-xs font-semibold md:pl-4 md:text-base">
                                <span className="md:hidden block text-gray-400">Connected: </span>
                                {formatTimeAgo(report.timestamp)}
                            </div>

                            <div className="w-1/2 md:w-[20%] text-white font-inter text-xs font-semibold md:text-base">
                                <span className="md:hidden block text-gray-400">Duration: </span>
                                {Math.floor(report.duration / 60)}:
                                {String(report.duration % 60).padStart(2, "0")}
                            </div>

                            <div className="w-1/2 md:w-[20%] text-white font-inter text-xs font-semibold md:text-base">
                                <span className="md:hidden block text-gray-400">Score: </span>
                                {report.score}
                            </div>

                            <div className="w-1/2 md:w-[20%] text-white font-inter text-xs font-semibold md:text-base">
                                <span className="md:hidden block text-gray-400">Result: </span>
                                {report.result}
                            </div>

                            <div className="w-full mt-2 md:mt-0 md:w-[10%] flex justify-center md:flex-col md:gap-2">
                                <button
                                    onClick={() => handleViewClick(report.report)}
                                    className="hover:opacity-80 transition-opacity text-[#AD6FDE] font-inter text-xs font-medium py-1.5 px-3 rounded md:text-base md:px-0 md:py-0"
                                >
                                    View Report
                                </button>
                            </div>
                        </div>
                    </div>
                ));
            })()}
        </div>
    </div>

    <BottomNavigation onBack={onBack} />
</div>
  );
};

export default CallReportPage;