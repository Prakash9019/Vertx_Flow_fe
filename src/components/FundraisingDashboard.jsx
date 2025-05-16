import React from "react";
import {
  FaBriefcase,
  FaDollarSign,
  FaMapMarkerAlt,
  FaChartBar,
  FaThLarge,
} from "react-icons/fa";

function FundraisingDashboard() {
  const infoItems = [
    { label: "Company Stage", icon: <FaBriefcase className="text-white" /> },
    { label: "Required Fund", icon: <FaDollarSign className="text-white" /> },
    { label: "Location", icon: <FaMapMarkerAlt className="text-white" /> },
    { label: "Industry", icon: <FaThLarge className="text-white" /> },
    { label: "Revenue", icon: <FaThLarge className="text-white" /> },
    { label: "Metrics", icon: <FaChartBar className="text-white" /> },
    { label: "Traction", icon: <FaChartBar className="text-white" /> },
  ];

  return (
    <div className="pt-12 px-[5rem]">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold flex items-center mb-4">
          <span className="w-1 h-6 bg-purple-700 mr-2 inline-block"></span>
          Company Profile
        </h2>

        <div className="w-full pt-5 flex flex-col md:flex-row justify-between items-start gap-4">
          {/* Logo */}
          <div className="border-dashed border-purple-600 border-3 w-full md:w-[150px] flex-shrink-0">
            <img
              src="https://placehold.co/150x150?text=No+Logo"
              alt="company logo"
              className="w-full h-auto"
            />
          </div>

          {/* Company Info */}
          <div className="w-full md:flex-1">
            <h4 className="text-2xl font-semibold mb-2">Company Name</h4>
            <p className="text-sm">
              We're building something to do something in order to solve
              something. It simplifies something by changing how something
              interacts with something, making something easier, faster, and
              more reliable. In the end, something becomes better because
              something finally works the way something should.
            </p>
          </div>
        </div>
        {/* compnay info  */}
        <div>
          <div className="flex flex-wrap gap-6 pt-6">
            {infoItems.map(({ label, icon }) => (
              <div
                key={label}
                className="flex items-center space-x-2 bg-gray-900 px-4 py-2 rounded-md shadow-md"
              >
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-medium text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attached Docs */}
      <div className="py-[5rem]">
        <h2 className="text-xl md:text-2xl font-semibold flex items-center mb-4">
          <span className="w-1 h-6 bg-purple-700 mr-2 inline-block"></span>
          Attached Docs
        </h2>

        <div className="w-full border-2 text-center rounded-md bg-gray-900">
          <label>
            <input type="file" />
          </label>
        </div>
      </div>
    </div>
  );
}

export default FundraisingDashboard;
