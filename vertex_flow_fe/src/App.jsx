import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login_Page from "./screens/Login_page";
import PrivateRoute from "./components/PrivateRoute";
import ProfileSetup_Page from "./screens/ProfileSetup_Page";
import Profile_Manual_Page from "./screens/Profile_Manual_Page";
import Usage_Page from "./screens/Usage_Page";
import AddCofounder_Page from "./screens/AddCofounder_Page";

function App() {
  const isVerified = localStorage.getItem("isVerified") == "true";

  return (
    <Routes>
      <Route path="/" element={<Login_Page />} />
      {/* <Route path="/" element={<Usage_Page />} /> */}
      {/* <Route path="/" element={<AddCofounder_Page />} /> */}

      <Route
        path="/profile"
        element={
          <PrivateRoute isAllowed={isVerified}>
            {" "}
            <ProfileSetup_Page />{" "}
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/manual"
        element={
          <PrivateRoute isAllowed={isVerified}>
            <Profile_Manual_Page />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
