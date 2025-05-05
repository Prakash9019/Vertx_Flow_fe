import React from "react";
import Logo from "../assets/logo.svg";
import { FaSignOutAlt } from "react-icons/fa"; // FontAwesome Icons

function Header() {
  return (
    <div className="flex justify-between items-center mb-12">
      <div className="flex items-center">
        <img src={Logo} alt="Vertx Logo" className="h-10 w-auto" />
        <h1 className="ml-3 text-2xl font-semibold tracking-widest">
          V E R T X
        </h1>
      </div>
      <button className="flex items-center gap-2 text-white hover:text-black hover:font-bold transition-normal">
        <span>Sign out</span>
        <FaSignOutAlt />
      </button>
    </div>
  );
}

export default Header;
