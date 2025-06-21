import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import logo from "../assets/logo.svg";
import ContactsIcon from "../assets/ContactsIcon.svg";
import AddIcon from "../assets/AddIcon.svg";
import SpeedometerIcon from "../assets/SpeedometerIcon.svg";
import TuneIcon from "../assets/TuneIcon.svg";

const BottomNavigation = ({ onBack }) => {
  return (
    <div className="fixed bottom-2 left-0 w-full flex items-center justify-center">
      <div className="flex items-center bg-white bg-opacity-90 rounded-lg px-4 py-2 gap-3" style={{ width: "20.75rem", height: "3.125rem" }}>
        <button className="bg-black p-2 rounded hover:opacity-80 transition">
          <img src={logo} alt="logo" className="w-5 h-5" />
        </button>
        <div className="h-full w-px bg-gray-300" />
        <button className="bg-purple-400 p-2 rounded hover:opacity-80 transition">
          <img src={ContactsIcon} alt="Contacts" className="w-5 h-5" />
        </button>
        <button className="hover:opacity-80 transition">
          <img src={AddIcon} alt="Add" className="w-6 h-6 invert" />
        </button>
        <button className="hover:opacity-80 transition">
          <img src={SpeedometerIcon} alt="Speedometer" className="w-6 h-6" />
        </button>
        <button className="hover:opacity-80 transition">
          <img src={TuneIcon} alt="Tune" className="w-6 h-6" />
        </button>
        <div className="h-full w-px bg-gray-300" />
        <button onClick={onBack} className="bg-purple-900 text-purple-300 text-xs px-3 py-1.5 rounded hover:opacity-80 transition">EXIT</button>
      </div>
    </div>
  );
};

const CallDetailView = ({ analysis, onBack }) => {
  const [activeTab, setActiveTab] = useState("Analysis");
  const getColor = (score) => {
    if (score >= 75) return ["Excellent", "#10B981"];
    if (score >= 60) return ["Good", "#22D3EE"];
    if (score >= 45) return ["Satisfactory", "#EAB308"];
    if (score >= 30) return ["Below Average", "#F59E0B"];
    return ["Needs Improvement", "#DE2D2D"];
  };

  const categoryScores = Object.entries(analysis?.category_scores || {}).map(([title, { score }]) => {
    const [label, color] = getColor(score);
    return { title: title.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), status: label, color };
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative w-full h-56 bg-cover bg-center" style={{ backgroundImage: "url(../src/assets/imgBackground.png)" }}>
        <div className="absolute inset-0 bg-black bg-opacity-80" />
        <button onClick={onBack} className="absolute top-6 left-6 z-10 flex items-center gap-2 text-white font-medium">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="absolute bottom-6 left-10 flex gap-4 z-10">
          {["Analysis", "Insights", "Summary"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeTab === tab ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}>{tab}</button>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-16 pt-10 pb-32">
        {activeTab === "Analysis" && (
          <div className="space-y-4">
            {categoryScores.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-zinc-900 rounded-lg p-4 md:p-6">
                <h3 className="text-lg font-medium">{item.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-sm">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Insights" && (
          <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
            <p><strong>Investor Perspective:</strong> {analysis?.investor_perspective}</p>
            <p><strong>Key Recommendations:</strong> {analysis?.key_recommendations?.join(', ')}</p>
            <p><strong>Next Steps:</strong> {analysis?.next_steps?.join(', ')}</p>
          </div>
        )}

        {activeTab === "Summary" && (
          <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
            <p><strong>Founder Name:</strong> {analysis?.founder_name}</p>
            <p><strong>Company Name:</strong> {analysis?.company_name}</p>
            <p><strong>Score:</strong> {analysis?.overall_score}</p>
            <p><strong>Rating:</strong> {analysis?.overall_rating}</p>
            <p><strong>Description:</strong> {analysis?.overall_description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallReportPage = ({ investor, analysis, onBack }) => {
  const [showDetailView, setShowDetailView] = useState(false);
  const handleViewClick = () => setShowDetailView(true);
  if (showDetailView) return <CallDetailView analysis={analysis} onBack={() => setShowDetailView(false)} />;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="px-6 pt-10 pb-24">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search calls..." className="w-full pl-12 py-3 rounded bg-zinc-900 text-gray-300 placeholder-gray-500" />
        </div>

        <div className="grid grid-cols-6 text-xs text-gray-500 mb-3">
          <span>Investor</span>
          <span>Connected</span>
          <span>Duration</span>
          <span>Score</span>
          <span>Result</span>
          <span>Report</span>
        </div>

        <div className="grid grid-cols-6 items-center text-sm bg-zinc-900 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2 col-span-1">
            <img src={investor?.image || "/placeholder.svg"} alt="" className="w-10 h-10 rounded bg-gray-600" />
            <span>{investor?.name || "Persona One"}</span>
          </div>
          <span className="text-gray-300">Now</span>
          <span className="text-gray-300">{analysis?.session_duration_minutes?.toFixed(2) || '0'} min</span>
          <span className="text-gray-300">{analysis?.overall_score || '-'}</span>
          <span className="text-gray-300">{analysis?.overall_rating || '-'}</span>
          <button onClick={handleViewClick} className="text-purple-300 hover:underline">View</button>
        </div>
      </div>

      <BottomNavigation onBack={onBack} />
    </div>
  );
};

export default CallReportPage;
