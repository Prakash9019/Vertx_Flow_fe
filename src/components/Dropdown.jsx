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
    <div className="relative" style={{ width: '86px', height: '30px' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          width: '86px',
          height: '30px',
          background: '#000000',
          border: '1px solid #33005C',
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
      <ul style={{
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
      }}>

          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              style={{
                padding: '6px 8px',
                fontSize: '10px',
                cursor: 'pointer',
                fontFamily: 'Inter',
                color: '#B8B8B8',
                backgroundColor: isMulti && selected.includes(option) ? '#33005C' : 'transparent',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#33005C'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = isMulti && selected.includes(option) ? '#33005C' : 'transparent'}
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
