import React, { useState } from "react";
import CloseIcon from "../assets/close_icon.svg";

const Dropdown = ({ options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const clearSelection = (e) => {
    e.stopPropagation();
    onSelect("");
  };

  return (
    <div className="relative w-[320px]">
      {/* Selected Item */}      <button
        onClick={toggleDropdown}
        className={`w-full h-[36px] px-3 py-1 text-sm font-medium text-white rounded-md ${!selected ? 'border border-[#B8B8B8]' : ''} bg-black text-left flex justify-between items-center`}
      >
        {selected ? (
          <div className="inline-flex items-center px-2 py-1 text-sm font-medium text-white rounded" style={{
            background: 'linear-gradient(260.47deg, rgba(0, 0, 0, 0.25) -22.9%, rgba(252, 65, 65, 0.25) 119.49%), linear-gradient(99.45deg, #000000 -4%, #33005C 104%)'
          }}>
            <span className="mr-2">{selected}</span>
            <img 
              src={CloseIcon} 
              alt="Clear selection" 
              onClick={clearSelection} 
              className="cursor-pointer w-3 h-3"
            />
          </div>
        ) : (
          <>
            <span>Select</span>
            <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
              ▼
            </span>
          </>
        )}
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute w-full bottom-full mb-1 z-[9999]">
          <ul className="w-full bg-black shadow-lg rounded-md border border-[#B8B8B8] overflow-y-auto max-h-[200px] transform transition-all duration-200 ease-in-out">
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-[#33005C] text-white"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;






// import React, { useState } from "react";

// const Dropdown = ({ options, selected, onSelect }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleDropdown = () => setIsOpen(!isOpen);

//   return (
//     <div className="relative w-[320px]">
//       {/* Selected Item */}
//       <button
//         onClick={toggleDropdown}
//         className="w-full h-[36px] px-3 py-1 text-sm font-medium text-black rounded-md border border-[#B8B8B8] bg-white text-left flex justify-between items-center"
//       >
//         {selected ? selected : "Select"}
//         <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
//           ▼
//         </span>
//       </button>

//       {/* Dropdown List */}
//       {isOpen && (
//         <ul className="absolute w-full mt-1 bg-white shadow-lg rounded-md border border-[#B8B8B8] z-10 max-h-[200px] overflow-y-auto">
//           {options.map((option, index) => (
//             <li
//               key={index}
//               onClick={() => {
//                 onSelect(option);
//                 setIsOpen(false);
//               }}
//               className="px-3 py-2 text-sm cursor-pointer hover:bg-[#f0f0f0]"
//             >
//               {option}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Dropdown;
