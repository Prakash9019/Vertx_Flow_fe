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
    <div className="py-12 px-[5rem]">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold flex items-center mb-4">
          <span className="w-1 h-6 bg-purple-700 mr-2 inline-block"></span>
          Company Profile
        </h2>

        <div className="w-full pt-3 flex flex-col md:flex-row justify-between items-start gap-4">
          {/* Logo */}
          <div className="border-dashed border-purple-600 border-3 rounded-lg w-full md:w-[150px] flex-shrink-0">
            <div className="w-full h-[120px] bg-gray-800 text-white flex items-center justify-center rounded-lg text-sm">
              No Logo
            </div>
          </div>

          {/* for future when image is avaible  */}
          {/* <div className="border-dashed border-purple-600 border-3 rounded-lg w-full md:w-[150px] flex-shrink-0 bg-gray-800">
            <img
              src="https://placehold.co/120x120/1f2937/ffffff?text=No+Logo"
              alt="company logo"
              className="w-full h-[120px] object-contain rounded-lg"
            />
          </div> */}

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
        <h2 className="text-xl md:text-2xl font-semibold flex items-center mb-7">
          <span className="w-1 h-6 bg-purple-700 mr-2 inline-block"></span>
          Attached Docs
        </h2>

        <div className="w-full rounded-lg bg-gray-900 h-[11rem] flex justify-center items-center">
          {/* <label> */}
          {/* <input type="file" /> */}
          {/* </label> */}
          <p>No docs found.</p>
        </div>
      </div>

      {/* founding team  */}
      <div className="py-[0.4rem]">
        <h2 className="text-xl md:text-2xl font-semibold flex items-center mb-7">
          <span className="w-1 h-6 bg-purple-700 mr-2 inline-block"></span>
          Founding Team
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div>
              <img
                src="https://placehold.co/140x140?text=Founder"
                alt="founder image"
                className="rounded-lg"
              />
            </div>
            <div className="pt-5">
              <h4 className="text-2xl font-semibold">John Doe</h4>
              <h4 className="text-2xl">Co-founder, Head of Design</h4>
              <p className="mt-2">
                Early age founder with a successful exit, now working on Vertx.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <img
                src="https://placehold.co/140x140?text=Founder"
                alt="founder image"
                className="rounded-lg"
              />
            </div>
            <div className="pt-5">
              <h4 className="text-2xl font-semibold">John Doe</h4>
              <h4 className="text-2xl">Co-founder, Head of Design</h4>
              <p className="mt-2">
                Early age founder with a successful exit, now working on Vertx.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FundraisingDashboard;
