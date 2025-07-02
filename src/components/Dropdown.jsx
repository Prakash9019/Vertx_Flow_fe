import React, { useState, useRef, useEffect } from "react";

const Dropdown = ({ label, options, selected, setSelected, isMulti = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
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

  const isSelected = (option) => {
    if (Array.isArray(selected)) return selected.includes(option);
    return selected === option;
  };

  return (
    <div className="relative" style={{ width: '86px', height: '30px' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          width: '86px',
          height: '30px',
          background: '#000000',
          border: (isMulti && selected.length > 0) || (!isMulti && selected) ? '1px solid #33005C' : '1px solid #1A1A1A',
          borderRadius: '3px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 10px'
        }}
      >
        <span style={{
          fontFamily: 'Inter',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '10px',
          lineHeight: '12px',
          color: '#B8B8B8'
        }}>
          {isMulti
            ? selected.length > 0
              ? label
              : label
            : selected || label}
        </span>
        {isMulti && selected.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            width: '13px',
            height: '13px',
            background: '#33005C',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '8px',
              lineHeight: '10px',
              color: '#FFFFFF'
            }}>{selected.length}</span>
          </div>
        )}
        <svg style={{ width: '8px', height: '8px' }} fill="none" stroke="#B8B8B8" strokeWidth="2"
          viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul
          style={{
            position: 'absolute',
            zIndex: 10,
            background: '#1A1A1A',
            width: '86px',
            marginTop: '1px',
            borderRadius: '3px',
            maxHeight: '150px',
            overflowY: 'auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: 0
          }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-3 py-1 cursor-pointer hover:bg-[#33005C] text-[10px] text-white font-[Inter]"
              style={{
                backgroundColor: isSelected(option) ? '#33005C' : 'transparent',
              }}
              onClick={() => handleSelect(option)}
            >
              <span>{option}</span>
              {isSelected(option) && (
                <span className="text-green-400">✔</span>
              )}
            </div>
          ))}

          {/* Optional: Reset Button */}
          {isMulti && selected.length > 0 && (
            <div
              className="px-3 py-2 text-xs text-purple-400 hover:underline cursor-pointer border-t border-gray-700"
              onClick={() => setSelected([])}
            >
              Reset All
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
