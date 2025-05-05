import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login_page from "./screens/Login_page";
import ProfileSetup_page from "./screens/ProfileSetup_page";
import Profile_Manual_page from "./screens/Profile_Manual_page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login_page />} />
      <Route path="/profile" element={<ProfileSetup_page />} />
      <Route path="/profile/manual" element={<Profile_Manual_page />} />
    </Routes>
  );
}

export default App;
