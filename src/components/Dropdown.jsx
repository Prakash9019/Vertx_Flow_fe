import React, { useState } from "react";

const Dropdown = ({ options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative w-[320px]">
      {/* Selected Item */}
      <button
        onClick={toggleDropdown}
        className="w-full h-[36px] px-3 py-1 text-sm font-medium text-[#656565] rounded-md border border-[#B8B8B8] bg-black text-left flex justify-between items-center"
      >
        {selected ? selected : "Select"}
        <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <ul className="absolute w-full mt-1 bg-black shadow-lg rounded-md border border-[#B8B8B8] z-10 overflow-visible">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-[#33005C] hover:text-white"
            >
              {option}
            </li>
          ))}
        </ul>
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
