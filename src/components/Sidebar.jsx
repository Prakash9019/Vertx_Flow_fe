import React from "react";
import bunnyIcon from "../assets/bunny.svg";
import LeftBackIcon from "../assets/BackIcon.svg";
import EllipseOne from "../assets/Ellipse1.svg";
import EllipseTwo from "../assets/Ellipse23.svg";
import EllipseThree from "../assets/Ellipse23.svg";
import EllipseFour from "../assets/Ellipse4.svg";
import Ellipse3 from "../assets/Ellipse 3.svg";
import UserAccount from "../assets/account.svg";
import UserPlan from "../assets/plan.svg";
import UserFeedback from "../assets/feedback.svg";
import LogOut from "../assets/logout.svg";
import Home from "../assets/home.svg";
import Rocket from "../assets/rocket.svg";

const Sidebar = () => {
  return (
    <div className="w-64 p-4  border-gray-700 flex flex-col justify-between bg-black">
      <div className="w-[240px] h-full border border-[#B8B8B821] bg-black space-y-3">
        <div className="py-2 pl-2  flex items-center gap-40">
          <img src={bunnyIcon} alt="Bunny Icon" className="w-8 h-8" />
          <img src={LeftBackIcon} alt="Back Icon" className="w-5 h-5" />
        </div>

        <div className="pt-3 border-t border-gray-600"></div>
        <div className="pb-6 flex flex-col space-y-4 px-2">
          <div className="flex items-center justify-between hover:text-gray-300 cursor-pointer">
            <span className="ml-1">Home</span>
            <img src={Home} alt="Feedback Icon" className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-between hover:text-gray-300 cursor-pointer">
            <span className="ml-1">Getting Started</span>
            <img src={Rocket} alt="Feedback Icon" className="w-6 h-6" />
          </div>
        </div>
        <div className="pt-3 border-t border-gray-600"></div>

        <div className="py-2 pl-2 text-gray-300 flex items-center gap-4">
          <img src={EllipseOne} alt="Ellipse 1" className="w-[26px] h-[26px]" />
          <span className="font-inter font-medium text-sm leading-none tracking-normal">
            Flash
          </span>
        </div>
        <div className="py-2 pl-2 text-gray-300 flex items-center gap-4">
          <img src={EllipseTwo} alt="Ellipse 2" className="w-[26px] h-[26px]" />
          <span className="font-inter font-medium text-sm leading-none tracking-normal">
            Evaluate
          </span>
        </div>
        <div className="py-2 pl-2 text-gray-300 flex items-center gap-4">
          <img src={Ellipse3} alt="Ellipse 3" className="w-[26px] h-[26px]" />
          <span className="font-inter font-medium text-sm leading-none tracking-normal">
            Fundraising
          </span>
        </div>
        <div className="py-2 pl-2 text-gray-300 flex items-center gap-4">
          <img
            src={EllipseFour}
            alt="Ellipse 4"
            className="w-[26px] h-[26px]"
          />
          <span className="font-inter font-medium text-sm leading-none tracking-normal">
            Playground
          </span>
        </div>
        <div className="h-[6rem]"></div>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4 pt-6 border-t border-gray-600">
        <div className="flex items-center justify-between hover:text-gray-300 cursor-pointer">
          <span className="ml-1">Your account</span>
          <img src={UserAccount} alt="Account Icon" className="w-6 h-6" />
        </div>
        <div className="flex items-center justify-between hover:text-gray-300 cursor-pointer">
          <span className="ml-1">Upgrade plan</span>
          <img src={UserPlan} alt="Plan Icon" className="w-6 h-5" />
        </div>
        <div className="flex items-center justify-between hover:text-gray-300 cursor-pointer">
          <span className="ml-1">Leave a feedback</span>
          <img src={UserFeedback} alt="Feedback Icon" className="w-6 h-6" />
        </div>
        <div className="flex items-center justify-between hover:text-red-400 cursor-pointer">
          <span className="ml-1">Log out</span>
          <img src={LogOut} alt="Logout Icon" className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
