import React, { useState, useRef, useEffect } from "react";

const Dropdown = ({ label, options, selected, setSelected, isMulti = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (isMulti) {
      if (selected.includes(option)) {
        setSelected(selected.filter((item) => item !== option));
      } else {
        setSelected([...selected, option]);
      }
    } else {
      setSelected(option);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-44" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-zinc-900 text-white py-1.5 px-3 text-xs rounded-sm w-full flex justify-between items-center relative"
      >
        {isMulti
          ? selected.length > 0
            ? label
            : label
          : selected || label}
        {isMulti && selected.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-zinc-900">{selected.length}</span>
        )}
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2"
             viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
      <ul className="absolute z-10 bg-zinc-800 text-white mt-1 rounded-sm max-h-48 overflow-y-auto scrollbar-hide w-full shadow-md">

          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-3 py-2 text-xs hover:bg-zinc-700 cursor-pointer ${
                isMulti && selected.includes(option) ? "bg-zinc-700" : ""
              }`}
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
