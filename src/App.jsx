// Vertx_Flow_fe/src/App.jsx
// Ensure all imported components are correctly named (PascalCase)

import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login_Page from "./screens/Login_page"; // Assuming correct path and name
import PrivateRoute from "./components/PrivateRoute";
import GoogleAuthCallback from "./components/GoogleAuthCallback";

// Screens for Profile Setup
import ProfileSetup_Page from "./screens/ProfileSetup_Page";
import Profile_Manual_Page from "./screens/Profile_Manual_Page";
import ProfileSetup from "./screens/ProfileSetup"; // Stage
import LocationSetup from "./screens/LocationSetup"; // Location input
import RaiseFunds from "./screens/RaiseFunds"; // Raise input
import RevenueStatus from "./screens/RevenueStatus"; // Revenue input (ensure component name matches if it's RevenueStaus.jsx)
import InvestorsIndustry from "./screens/InvestorsIndustry"; // Industry input
import InvestorsPitch from "./screens/InvestorsPitch"; // Pitch input

// Intermediate "Selected" pages (if you decide to keep them)
import StartupLocation from "./screens/StartupLocation"; // Stage Selected confirmation
import LocationSelect from "./screens/LocationSelect"; // Location Selected confirmation
import RaiseSelected from "./screens/RaiseSelected"; // Raise Selected confirmation
import RevenueSelected from "./screens/RevenueSelected"; // Revenue Selected confirmation
import IndustrySelected from "./screens/IndustrySelected"; // Industry Selected confirmation

// Other Screens
import Usage_Page from "./screens/Usage_Page";
import AddCofounder_Page from "./screens/AddCofounder_Page";
import Evaluate_Page from "./screens/Evaluate_Page";
import EvaluateReport_page from "./screens/EvaluateReport_page";
import FundraisingPage from "./screens/FundraisingPage";
import HomePage from "./screens/Home";

function App() {
  const authToken = localStorage.getItem("authToken");

  // Option 1: Streamlined flow (main input pages only)
  const streamlinedProtectedRoutes = [
    { path: "/profile", element: <ProfileSetup_Page /> },
    { path: "/profile/manual", element: <Profile_Manual_Page /> },
    { path: "/profile/setup", element: <ProfileSetup /> }, // Stage input
    { path: "/profile/location", element: <LocationSetup /> }, // Location input
    { path: "/profile/raise", element: <RaiseFunds /> }, // Raise input
    { path: "/profile/revenue", element: <RevenueStatus /> }, // Revenue input
    { path: "/profile/industry", element: <InvestorsIndustry /> }, // Industry input
    { path: "/profile/pitch", element: <InvestorsPitch /> }, // Pitch input & submit
    { path: "/usage", element: <Usage_Page /> }, // Next page after profile
    { path: "/addfounder", element: <AddCofounder_Page /> },
    { path: "/homepage", element: <HomePage /> },
    { path: "/evaluate", element: <Evaluate_Page /> },
    { path: "/evaluate/report", element: <EvaluateReport_page /> },
    { path: "/fundraising", element: <FundraisingPage /> },
  ];

  const protectedRoutes = streamlinedProtectedRoutes; //

  return (
    <div className="relative h-screen overflow-hidden">
      {" "}
      {/* Consider CSS for global scroll if needed */}
      <Routes>
        <Route path="/" element={<Login_Page />} />

        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />

        {protectedRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<PrivateRoute>{element}</PrivateRoute>}
          />
        ))}
      </Routes>
    </div>
  );
}

export default App;
