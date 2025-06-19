import React from "react";
import Logo from "../assets/logo.svg";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem("isVerified");
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center mb-6 sm:mb-12">
      <div className="flex items-center">
        <img src={Logo} alt="Vertx Logo" className="h-6 w-auto sm:h-10" />
        <h1 className="ml-2 sm:ml-3 text-lg sm:text-2xl font-semibold tracking-widest">
          V E R T X
        </h1>
      </div>
      <button
        onClick={handleSignout}
        className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-white hover:font-bold transition-normal"
      >
        <span>Sign out</span>
        <FaSignOutAlt className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}

export default Header;
