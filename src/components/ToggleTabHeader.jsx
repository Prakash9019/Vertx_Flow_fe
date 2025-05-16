import React from "react";

function ToggleTabHeader({ tabsArray, setActiveTab,activeTab }) {
  return (
    <div>
      <div className="bg-purple-900 rounded-md px-3 py-2 w-full sm:w-fit">
        <ul className="flex justify-between flex-wrap gap-2 text-sm sm:text-base">
          {tabsArray.map((tab) => (
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
  );
}

export default ToggleTabHeader;
