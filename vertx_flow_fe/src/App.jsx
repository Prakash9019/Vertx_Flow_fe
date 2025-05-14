import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login_Page from "./screens/Login_page";
import PrivateRoute from "./components/PrivateRoute";

// Screens
import ProfileSetup_Page from "./screens/ProfileSetup_Page";
import Profile_Manual_Page from "./screens/Profile_Manual_Page";
import Usage_Page from "./screens/Usage_Page";
import AddCofounder_Page from "./screens/AddCofounder_Page";
import Evaluate_Page from "./screens/Evaluate_Page";
import EvaluateReport_page from "./screens/EvaluateReport_page";
import HomePage from "./screens/Home";
import ProfileSetup from "./screens/ProfileSetup";
import StartupLocation from "./screens/StartupLocation";
import LocationSetup from "./screens/LocationSetup";
import RaiseFunds from "./screens/RaiseFunds";
import RaiseSelected from "./screens/RaiseSelected";
import SelectLocation from "./screens/LocationSelect";
import RevenueStaus from "./screens/RevenueStatus";
import RevenueSelected from "./screens/RevenueSelected";
import InvestorsIndustry from "./screens/InvestorsIndustry";
import IndustrySelected from "./screens/IndustrySelected";
import InvestorsPitch from "./screens/InvestorsPitch";

function App() {
  const protectedRoutes = [
    { path: "/profile", element: <ProfileSetup_Page /> },
    { path: "/profile/manual", element: <Profile_Manual_Page /> },
    { path: "/profile/setup", element: <ProfileSetup /> },
    { path: "/Startup", element: <StartupLocation /> },
    { path: "/location", element: <LocationSetup /> },
    { path: "/location-select", element: <SelectLocation /> },
    { path: "/raise", element: <RaiseFunds /> },
    { path: "/raise-select", element: <RaiseSelected /> },
    { path: "/revenue", element: <RevenueStaus /> },
    { path: "/revenue-select", element: <RevenueSelected /> },
    { path: "/industry", element: <InvestorsIndustry /> },
    { path: "/industry-select", element: <IndustrySelected /> },
    { path: "/pitch", element: <InvestorsPitch /> },
    { path: "/usage", element: <Usage_Page /> },
    { path: "/addfounder", element: <AddCofounder_Page /> },
    { path: "/homepage", element: <HomePage /> },
    { path: "/evaluate", element: <Evaluate_Page /> },
    { path: "/evaluate/report", element: <EvaluateReport_page /> },
  ];

  return (
    <div className="relative h-screen overflow-hidden">
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login_Page />} />

        {/* Protected Routes */}
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
