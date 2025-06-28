import React from "react";

function ToggleTabHeader({ tabsArray, setActiveTab,activeTab }) {
  return (
    <div>
       <div className="flex gap-4 pr-9 md:pr-[3.87rem] mt-3 md:mt-[1.69rem]">
            {tabsArray.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full transition-colors h-10 text-base
                  ${activeTab === tab
                    ? 'w-[6.25rem] bg-white text-black font-medium'
                    : 'w-[5rem] bg-[#0F0E16] text-[#656565] font-normal'
                  }
                `}
                style={{
                  fontFamily: "Inter",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
    </div>
  );
}

export default ToggleTabHeader;
