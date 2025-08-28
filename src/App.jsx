// Vertx_Flow_fe/src/App.jsx
// Ensure all imported components are correctly named (PascalCase)

import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login_Page from "./screens/Login_page"; // Assuming correct path and name
import PrivateRoute from "./components/PrivateRoute";
import GoogleAuthCallback from "./components/GoogleAuthCallback";
import AuthError from "./screens/AuthError";
import Payment_Page from "./screens/Payment_Page";

// Screens for Profile Setup
import ProfileSetup_Page from "./screens/ProfileSetup_Page";
import Profile_Manual_Page from "./screens/Profile_Manual_Page";
import ProfileSetup from "./screens/ProfileSetup"; // Stage
import LocationSetup from "./screens/LocationSetup"; // Location input
import RaiseFunds from "./screens/RaiseFunds"; // Raise input
import RevenueStatus from "./screens/RevenueStatus"; // Revenue input (ensure component name matches if it's RevenueStaus.jsx)
import InvestorsIndustry from "./screens/InvestorsIndustry"; // Industry input
import InvestorsPitch from "./screens/InvestorsPitch"; // Pitch input
import GenerateEmail from "./screens/emails";
import Pipeline from "./screens/events";
import Matchflow from "./screens/matchflow"; 

//Screens for fundraising
import FundraisingManagePage from "./components/Fundraising/fundraising"

// Invite acceptance page
import InviteAcceptPage from "./components/InviteAcceptPage";

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
//import Login from './components/Login';
import Reach from "./components/Fundraising/Reach.jsx";
//screens for PlayGround 
import PlayGround from "./components/PlayGround"
import { PermissionNotificationProvider } from "./context/PermissionNotificationContext.jsx";
import MockPitching from "./components/MockPitching";
import CallReportPage from "./components/callReportPage";
import CreateREportPage, { CreatePersonaPage, PersonaSelectionPage } from "./components/CreateREportPage.jsx";
import GettingStarted from "./components/GettingStarted.jsx";
import CompaniesReachLink from "./components/Fundraising/CompaniesReachLink.jsx";
import ReachLinkPreview from "./components/Fundraising/ReachLinkPreview.jsx";
import ReachRedirect from "./components/ReachRedirect.jsx";
import Flash from "./components/Flash.jsx";
import EditorPage from "./components/new/EditorPage.jsx";
import UserBGselect from "./components/new/UserBGselect.jsx";



function App() {
  const streamlinedProtectedRoutes = [
    { path: "/linkedin", element: <ProfileSetup_Page /> },
    { path: "/profile/manual", element: <Profile_Manual_Page /> },
    { path: "/profile/stage", element: <ProfileSetup /> }, // Stage input
    { path: "/profile/location", element: <LocationSetup /> }, // Location input
    { path: "/profile/raise", element: <RaiseFunds /> }, // Raise input
    { path: "/profile/revenue", element: <RevenueStatus /> }, // Revenue input
    { path: "/profile/industry", element: <InvestorsIndustry /> }, // Industry input
    { path: "/profile/pitch", element: <InvestorsPitch /> }, // Pitch input & submit
    { path: "/usage", element: <Usage_Page /> }, // Next page after profile
    { path: "/addfounder", element: <AddCofounder_Page /> },
    { path: "/homepage", element: <HomePage /> },
    { path: "/flash", element: <Flash /> },
    { path: "/ep", element: <EditorPage /> },
    { path: "/ub", element: <UserBGselect /> },
    { path: "/evaluate", element: <Evaluate_Page /> },
    { path: "/gettingStarted", element: <GettingStarted /> },
    { path: "/evaluate/report", element: <EvaluateReport_page /> },
    // { path: "/fundraising", element: <FundraisingPage /> },
    {path:"/PlayGround", element:<PlayGround /> },
    {path:"/payment", element: <Payment_Page /> },
    {path:"/fundraising/reach", element: <FundraisingManagePage /> },
    {path:"/fundraising/reach-link", element: <CompaniesReachLink /> },

    
     { path:"/flow/outbound", element:<GenerateEmail />},
    { path:"/flow/match flow", element:<Matchflow />} ,    {path:"/flow/pipeline", element:<Pipeline /> },    {path:"/fundraising", element:<FundraisingManagePage /> },
    {path:"/fundraising/manage", element:<FundraisingManagePage /> },
    {path:"/fundraising/find", element:<FundraisingManagePage /> },
    {path:"/fundraising/target", element:<FundraisingManagePage /> },
    {path:"/fundraising/network", element:<FundraisingManagePage /> },
    {path:"/invite/:inviteId", element:<InviteAcceptPage /> },
    { path: "/playground/mockpitching", element: <MockPitching /> },
    { path: "/playground/mockpitching/report", element: <CallReportPage /> },
    { path: "/playground/mockpitching/create", element: <CreateREportPage /> },
    { path: "/playground/mockpitching/create-persona", element: <CreatePersonaPage /> },
    { path: "/playground/mockpitching/persona-selection", element: <PersonaSelectionPage /> },


  ];

  const protectedRoutes = streamlinedProtectedRoutes; //
  return (
    <PermissionNotificationProvider>
      <div className="relative h-screen overflow-hidden">
        <ToastContainer position="top-right" autoClose={5000} />
        {/* Consider CSS for global scroll if needed */}
        <Routes>
          <Route path="/" element={<Login_Page />} />
          <Route path="/login" element={<Login_Page />} />
          
          {/* Public reach redirect route */}
          <Route path="/reach/:slug" element={<ReachRedirect />} />
          
          {/* Public preview route */}
          <Route path="/fundraising/preview" element={<ReachLinkPreview />} />
          
          {/* Auth routes */}
          <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
          <Route path="/auth-error" element={<AuthError />} />
          
          {protectedRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<PrivateRoute>{element}</PrivateRoute>}
            />
          ))}
        </Routes>
      </div>
    </PermissionNotificationProvider>
  );
}

export default App;