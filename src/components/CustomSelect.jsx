import React, { useState } from 'react';

const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-[#1e1e1e] border border-gray-600 rounded text-sm text-white cursor-pointer flex justify-between items-center"
      >
        <span className={value ? 'text-white' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>      {isOpen && (
        <div className="absolute w-full mt-1 bg-[#1e1e1e] border border-gray-600 rounded shadow-lg z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="p-3 hover:bg-gray-700 cursor-pointer text-sm text-white"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
