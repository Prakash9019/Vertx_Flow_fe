import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./scrollbar.css"; // Import custom scrollbar styles
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import { StartupProfileProvider } from './context/StartupProfileContext';
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
   <StartupProfileProvider> {/* Provider is here */}
    <App />
        </StartupProfileProvider>
  </BrowserRouter>
);
