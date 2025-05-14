import React from "react";
import RightIcon from "../assets/RightTick.svg";

const steps = ['Stage', 'Location', 'Raise', 'Revenue', 'Industry', 'Pitch'];

const ProfileProgressBar = ({ currentStep }) => (
  <div className="flex items-center justify-between w-full mb-6">
    {steps.map((label, idx) => {
      const isCompleted = idx < currentStep;
      const isActive = idx === currentStep;
      return (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2
              ${isCompleted || isActive ? 'bg-[#6C2BD9] border-[#6C2BD9] text-white' : 'border-gray-600 text-gray-400 bg-black'}
            `}>
              {isCompleted ? <img src={RightIcon} alt="Tick" className="w-4 h-4" /> : idx + 1}
            </div>
            <span className={`text-[12px] mt-1 ${isCompleted || isActive ? 'text-white' : 'text-gray-400'}`}>{label}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-1 ${idx < currentStep ? 'bg-[#6C2BD9]' : 'bg-gray-600'}`}></div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default ProfileProgressBar; 