// App.js
import React from "react";
import HomePage from "./components/Home";
import ProfileSetup from "./components/ProfileSetup";
import StartupLocation from "./components/StartupLocation";
// import StartLocation from "./components/LocationSelect";
import LocationSetup from "./components/LocationSetup";
import RaiseFunds from "./components/RaiseFunds";
import RaiseSelected from "./components/RaiseSelected";
import { Routes, Route } from "react-router-dom";
import SelectLocation from "./components/LocationSelect";
import RevenueStaus from "./components/RevenueStatus";
import RevenueSelected from "./components/RevenueSelected";
import InvestorsIndustry from "./components/InvestorsIndustry";
import IndustrySelected from "./components/IndustrySelected";
import InvestorsPitch from "./components/InvestorsPitch";

const App = () => {
  return (
    <div className="relative h-screen overflow-hidden">
       {/* <HomePage /> */}

    <Routes>
      <Route path="/" element={<ProfileSetup />} />
      <Route path="/Startup" element={<StartupLocation />} />
      <Route path="/location" element={<LocationSetup />} />
      <Route path="/location-select" element={<SelectLocation />} />
      <Route path="/raise" element={<RaiseFunds />} />
      <Route path="/raise-select" element={<RaiseSelected />} />
      <Route path="/revenue" element={<RevenueStaus />} />
      <Route path="/revenue-select" element={<RevenueSelected />} />
      <Route path="/industry" element={<InvestorsIndustry />} />
      <Route path="/industry-select" element={<IndustrySelected />} />
      <Route path="/pitch" element={<InvestorsPitch />} />
      <Route path="/homepage" element={<HomePage />} />
    </Routes>
    </div>
  );
};

export default App;















// import React from "react";
// import bunnyIcon from "./assets/bunny.svg";
// import LeftBackIcon from "./assets/BackIcon.svg";
// import EllipseOne from "./assets/Ellipse1.svg";
// import EllipseTwo from "./assets/Ellipse23.svg";
// import EllipseThree from "./assets/Ellipse23.svg";
// import EllipseFour from "./assets/Ellipse4.svg";
// import UserAccount from "./assets/account.svg";
// import UserPlan from "./assets/plan.svg";
// import UserFeedback from "./assets/feedback.svg";
// import LogOut from "./assets/logout.svg";
// import BgImg from "./assets/BackgroundImg.svg";
// import RectangleBox from "./assets/Group330.svg";
// import Text from "./assets/TextBunny.svg";

// const App = () => {
//   // const [input, setInput] = useState("");


//   return (
//     <div className="relative h-screen overflow-hidden">
//     <div className="flex h-screen w-full text-white"
//       style={{
//         backgroundImage: `linear-gradient(0deg, rgba(28, 0, 30, 0.4), rgba(28, 0, 30, 0.4)), url(${BgImg})`,
//         backgroundSize: "cover",
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "center",
//         backgroundColor: "#1C001E66", 
//         backgroundBlendMode: "overlay", 
//         width: "1530px",
//         height: "740px",
//         left:"0",
//         top:"0",
//       }}
//     >
//     <div className="flex h-screen bg-black text-white">
//       {/* Sidebar */}
//       <div className="w-64 p-4 border-r border-gray-700 flex flex-col justify-between">
//         <div className="w-[240px] h-[832px] border border-[#B8B8B821] bg-black space-y-3">
//           <div className="py-2 pl-2 text-pink-500 flex items-center gap-40">
//             <img src={bunnyIcon} alt="Bunny Icon" className="w-5 h-5" />
//             <img src={LeftBackIcon} alt="Back Icon" className="w-5 h-5" />
//           </div>
//           <div className="text-sm space-y-4 pt-6 border-t border-gray-600"></div>
//            <div className="py-2 pl-2 text-gray-300 flex items-center gap-4">
//             <img
//               src={EllipseOne}
//               alt="Ellipse 1"
//               style={{ width: "26px", height: "26px" }}
//             />
//             <span
//               style={{
//                 fontFamily: "Inter",
//                 fontWeight: 500,
//                 fontSize: "14px",
//                 lineHeight: "100%",
//                 letterSpacing: "0%",
//               }}
//             >
//                 Bunny - AI Assistant
//             </span>
//           </div>
//           <div className="py-2 pl-2 text-gray-300 flex items-center gap-4">
//             <img
//               src={EllipseTwo}
//               alt="Ellipse 23"
//               style={{ width: "26px", height: "26px" }}
//             />
//             <span
//               style={{
//                 fontFamily: "Inter",
//                 fontWeight: 500,
//                 fontSize: "14px",
//                 lineHeight: "100%",
//                 letterSpacing: "0%",
//               }}
//             >
//                 Outreach Expert
//             </span>
//           </div>
//           <div className="py-2 pl-2 text-gray-300 flex items-center gap-4">
//             <img
//               src={EllipseThree}
//               alt="Ellipse 23"
//               style={{ width: "26px", height: "26px" }}
//             />
//             <span
//               style={{
//                 fontFamily: "Inter",
//                 fontWeight: 500,
//                 fontSize: "14px",
//                 lineHeight: "100%",
//                 letterSpacing: "0%",
//               }}
//             >
//                 Outreach Expert
//             </span>
//           </div>
//           <div className="py-2 pl-2 text-gray-300 flex items-center gap-4">
//             <img
//               src={EllipseFour}
//               alt="Ellipse 4"
//               style={{ width: "26px", height: "26px" }}
//             />
//             <span
//               style={{
//                 fontFamily: "Inter",
//                 fontWeight: 500,
//                 fontSize: "14px",
//                 lineHeight: "100%",
//                 letterSpacing: "0%",
//               }}
//             >
//                 Playground
//             </span>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="text-sm space-y-4 pt-6 border-t border-gray-600">
//           <div className="flex items-center justify-between hover:text-gray-300 cursor-pointer">
//             <span className="ml-1">Your account</span>
//             <img src={UserAccount} alt="Account Icon" className="w-5 h-5" />
//           </div>

//           <div className="flex items-center justify-between hover:text-gray-300 cursor-pointer">
//             <span className="ml-1">Upgrade plan</span>
//             <img src={UserPlan} alt="Plan Icon" className="w-5 h-5" />
//           </div>

//           <div className="flex items-center justify-between hover:text-gray-300 cursor-pointer">
//             <span className="ml-1">Leave a feedback</span>
//             <img src={UserFeedback} alt="Feedback Icon" className="w-5 h-5" />
//           </div>

//           <div className="flex items-center justify-between hover:text-red-400 cursor-pointer">
//             <span className="ml-1">Log out</span>
//             <img src={LogOut} alt="Logout Icon" className="w-5 h-5" />
//           </div>
//         </div>
//       </div>
    

//       {/* Main Chat Area */}
//       <div className="absolute w-[1000px] h-[200px] top-[430px] left-[388px] text-center bg-black bg-opacity-50 z-50 mb-10">
//       <div className="relative">
//          <img
//             src={RectangleBox}
//             alt="Text Message"
//             className="w-full h-full object-cover"
//          />

//          <img
//             src={Text}
//             alt="Text Message"
//             className="absolute top-16 left-28 transform -translate-x-1/2 -translate-y-full"
//        />
//       </div>
//      </div>
//     </div>
//     </div>
//   </div>
//   );
// };

// export default App;
