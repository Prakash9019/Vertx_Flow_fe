import React, { useState } from "react";
import CloseIcon from "../assets/close_icon.svg";

const MultiSelect = ({ options, selected = [], onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    if (selected.includes(option)) {
      onSelect(selected.filter((item) => item !== option));
    } else {
      onSelect([...selected, option]);
    }
  };

  const removeItem = (e, item) => {
    e.stopPropagation();
    onSelect(selected.filter((selectedItem) => selectedItem !== item));
  };

  return (
    <div className="relative w-[320px]">
      {/* Selected Items Display */}
      <button
        onClick={toggleDropdown}
        className={`w-full min-h-[36px] px-3 py-1 text-sm font-medium text-white rounded-md ${selected.length === 0 ? 'border border-[#B8B8B8]' : ''} bg-black text-left flex justify-between items-center`}
      >
        {selected.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selected.map((item, index) => (
              <div
                key={index}
                className="inline-flex items-center px-2 py-1 text-sm font-medium text-white rounded"
                style={{
                  background: 'linear-gradient(260.47deg, rgba(0, 0, 0, 0.25) -22.9%, rgba(252, 65, 65, 0.25) 119.49%), linear-gradient(99.45deg, #000000 -4%, #33005C 104%)'
                }}
              >
                <span className="mr-2">{item}</span>
                <img 
                  src={CloseIcon} 
                  alt="Remove item" 
                  onClick={(e) => removeItem(e, item)} 
                  className="cursor-pointer w-3 h-3"
                />
              </div>
            ))}
          </div>
        ) : (
          "Select"
        )}
        <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute w-full bottom-full mb-1 z-[9999]">
          <ul className="w-full bg-black shadow-lg rounded-md border border-[#B8B8B8] overflow-y-auto max-h-[200px] transform transition-all duration-200 ease-in-out">
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionClick(option)}
                className="px-3 py-2 h-10 text-sm cursor-pointer hover:bg-[#33005C] text-white flex justify-between items-center"
              >
                <span className="flex items-center">{option}</span>
                {/* Reserve space for tick to avoid shift */}
                <span className="text-green-500 text-lg mr-[210px] w-5 text-right">
                  {selected.includes(option) ? "✔️" : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;











// import React, { useState } from "react";

// const MultiSelect = ({ options, selected = [], onSelect }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleDropdown = () => setIsOpen(!isOpen);

//   const handleCheckboxChange = (option) => {
//     if (selected.includes(option)) {
//       // Remove
//       onSelect(selected.filter((item) => item !== option));
//     } else {
//       // Add
//       onSelect([...selected, option]);
//     }
//   };

//   return (
//     <div className="relative w-[320px]">
//       {/* Selected Items Display */}
//       <button
//         onClick={toggleDropdown}
//         className="w-full h-[36px] px-3 py-1 text-sm font-medium text-[#656565] rounded-md border border-[#B8B8B8] bg-black text-left flex justify-between items-center"
//       >
//         {selected.length > 0 ? selected.join(", ") : "Select"}
//         <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
//           ▼
//         </span>
//       </button>

//       {/* Dropdown List with Checkboxes */}
//       {isOpen && (
//         <ul className="absolute w-full mt-1 bg-black shadow-lg rounded-md border border-[#B8B8B8] z-10 max-h-[200px] overflow-hidden">
//           {options.map((option, index) => (
//             <li key={index} className="px-3 py-2 text-sm cursor-pointer hover:bg-[#33005C] hover:text-white flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={selected.includes(option)}
//                 onChange={() => handleCheckboxChange(option)}
//               />
//               {option}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default MultiSelect;
