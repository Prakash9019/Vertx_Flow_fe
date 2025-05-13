import React, { useState } from "react";

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

  return (
    <div className="relative w-[320px]">
      {/* Selected Items Display */}
      <button
        onClick={toggleDropdown}
        className="w-full h-[36px] px-3 py-1 text-sm font-medium text-[#656565] rounded-md border border-[#B8B8B8] bg-black text-left flex justify-between items-center"
      >
        {selected.length > 0 ? selected.join(", ") : "Select"}
        <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <ul className="absolute w-full mt-1 bg-black shadow-lg rounded-md border border-[#B8B8B8] z-10 max-h-[200px] overflow-hidden">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              className="px-3 py-2 h-10 text-sm cursor-pointer hover:bg-[#33005C] hover:text-white flex justify-between items-center"
            >
              <span className="flex items-center">{option}</span>
              {/* Reserve space for tick to avoid shift */}
              <span className="text-green-500 text-lg mr-[210px] w-5 text-right">
                {selected.includes(option) ? "✔️" : ""}
              </span>
            </li>
          ))}
        </ul>
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
