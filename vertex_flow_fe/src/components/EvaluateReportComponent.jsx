import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function EvaluateReportComponent({ data }) {
  const scoreValue = data?.score?.value || 0;
  const scoreLabel = data?.score?.label || "UNKNOWN";
  const companyName = data?.overview?.company_name;

  const scoreRanges = [
    { label: "Critical", color: "bg-red-600", value: 0, max: 299 },
    { label: "Weak", color: "bg-orange-500", value: 300, max: 499 },
    { label: "Average", color: "bg-yellow-500", value: 500, max: 649 },
    { label: "Solid", color: "bg-green-600", value: 650, max: 749 },
    { label: "VERTX\nAssured", color: "bg-purple-700", value: 750, max: 800 }, // new line in label
  ];

  return (
    <div>
      {/* Score Section */}
      <div className="pt-12">
        <h2 className="text-xl md:text-2xl font-semibold flex items-center mb-4">
          <span className="w-2 h-6 bg-purple-700 mr-2 inline-block"></span>
          Score
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-center bg-[#1a1a1a] rounded-xl p-4 sm:p-6">
          {/* Score Bands */}
          <div className="flex flex-col space-y-2 w-full md:w-1/2">
            <div className="flex overflow-hidden rounded-md text-white text-xs sm:text-sm">
              {scoreRanges.map((range, idx) => {
                const isActive =
                  scoreValue >= range.value && scoreValue <= range.max;
                const rounded =
                  idx === 0
                    ? "rounded-l-md"
                    : idx === scoreRanges.length - 1
                    ? "rounded-r-md"
                    : "";

                return (
                  <div
                    key={range.label}
                    className={`flex-1 py-1 px-3 text-center whitespace-pre-line ${
                      range.color
                    } ${rounded} ${isActive ? "border-2 border-white" : ""}`}
                  >
                    <p
                      className={`font-semibold text-[10px] sm:text-xs ${
                        range.label === "VERTX\nAssured" ? "" : "pt-2"
                      }`}
                    >
                      {range.label}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 w-full">
              <span>0</span>
              <span>300</span>
              <span>500</span>
              <span>650</span>
              <span>750</span>
              <span>800</span>
            </div>
          </div>

          {/* Score Circle */}
          <div className="mt-6 md:mt-0 md:ml-6 w-full md:w-auto flex justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-4 border-yellow-500 rounded-full flex flex-col items-center justify-center">
              <p className="text-xl sm:text-2xl font-bold">{scoreValue}</p>
              <p className="text-yellow-400 text-xs sm:text-sm font-semibold uppercase">
                {scoreLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Breakdown Section */}
      <div className="sm:mt-5 py-12">
        <h2 className="text-xl md:text-2xl font-semibold flex items-center mb-4">
          <span className="w-2 h-6 bg-purple-700 mr-2 inline-block"></span>
          Breakdown
        </h2>

        <div className="bg-[#1a1a1a] rounded-xl p-4 sm:p-6 overflow-x-auto">
          {data?.breakdown?.map((breakdownData, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between text-gray-300 py-2 border-b border-gray-700 text-sm"
            >
              <span className="sm:w-1/3 mb-1 sm:mb-0">
                {breakdownData.label}
              </span>
              <div className="sm:w-1/6 mb-1 sm:mb-0">
                <span
                  className={`${
                    breakdownData.score === 0
                      ? "bg-red-500"
                      : data.score < 28
                      ? "bg-orange-500"
                      : data.score < 30
                      ? "bg-yellow-500"
                      : data.score < 36
                      ? "bg-green-500"
                      : "bg-purple-500"
                  } px-3 py-2 rounded-full text-center inline-block`}
                >
                  {breakdownData.score}
                </span>
              </div>
              <span className="sm:w-1/2">{breakdownData.comment}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EvaluateReportComponent;
