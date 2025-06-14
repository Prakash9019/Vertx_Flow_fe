import { Eye } from "lucide-react";

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

const CallReportPage = ({ investor, onBack }) => {
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
            <input
              type="text"
              placeholder="Search calls..."
              className="w-full pl-12 pr-16 py-4 rounded focus:outline-none"
              style={{
                height: "3.25rem",
                borderRadius: "0.25rem",
                background: "#0F0E16",
                color: "#B8B8B8",
                fontFamily: "Inter",
                fontSize: "0.875rem",
                fontWeight: 400,
                border: "none",
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
            fontWeight: 500,
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
              className="bg-gray-600 overflow-hidden flex items-center justify-center rounded-full"
              style={{
                width: "2.5rem",
                height: "2.5rem",
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
                fontSize: "0.875rem",
                fontWeight: 500,
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
              fontSize: "0.875rem",
              fontWeight: 400,
            }}
          >
            1 hour ago
          </div>

          <div
            style={{
              width: "20%",
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "0.875rem",
              fontWeight: 400,
            }}
          >
            13:49
          </div>

          <div
            style={{
              width: "20%",
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "0.875rem",
              fontWeight: 400,
            }}
          >
            31
          </div>

          <div
            style={{
              width: "20%",
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "0.875rem",
              fontWeight: 400,
            }}
          >
            BAD
          </div>

          <div style={{ width: "10%" }}>
            <button
              className="flex items-center justify-center gap-1 hover:opacity-80 transition-opacity"
              style={{
                color: "#AD6FDE",
                fontFamily: "Inter",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              <Eye style={{ width: "1rem", height: "1rem" }} />
              View
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation onBack={onBack} />
    </div>
  );
};

export default CallReportPage;