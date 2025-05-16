import React from "react";
import RightIcon from "../assets/RightTick.svg";

const steps = ['Stage', 'Location', 'Raise', 'Revenue', 'Industry', 'Pitch'];

const ProfileProgressBar = ({ currentStep }) => (
  <div className="flex items-center justify-between w-full mb-6">
    {steps.map((label, idx) => {
      const isCompleted = idx < currentStep;
      let bg = '#33005C';
      let border = '#33005C';
      return (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2`}
              style={{ background: bg, borderColor: border, color: '#fff' }}
            >
              {isCompleted ? <img src={RightIcon} alt="Tick" className="w-4 h-4" /> : idx + 1}
            </div>
            <span className={`text-[12px] mt-1 text-white`}>{label}</span>
          </div>
          {idx < steps.length - 1 && (
            idx < currentStep  ? (
              <div className="flex-1 mx-1 mb-4" style={{ height: '2px', background: '#6C2BD9', alignSelf: 'center' }}></div>
            ) : (
              <div className="flex-1 mx-1 mb-4" style={{ height: '2px', background: 'transparent', alignSelf: 'center' }}></div>
            )
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default ProfileProgressBar; 