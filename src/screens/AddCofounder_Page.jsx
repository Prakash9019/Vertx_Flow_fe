// Vertx_Flow_fe/src/screens/AddCofounder_Page.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import  API_KEY  from "../../key";

function AddCofounder_Page() {
  const [cofounders, setCofounders] = useState([""]); // Start with one input
  // Replacing 'inviteAlert' with more specific states for API feedback
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState("");

  const navigate = useNavigate();

  // Handle individual cofounder email input change
  const handleCofounderChange = (index, value) => {
    const updated = [...cofounders];
    updated[index] = value;
    setCofounders(updated);
    setInviteError("");       // Clear error/success on new input
    setInviteSuccessMsg("");
  };

  // Add a new cofounder input field
  const handleAddCofounder = () => {
    if (cofounders.length < 5) { // Optional: Limit the number of cofounder fields
        setCofounders((prev) => [...prev, ""]);
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInvite = async () => {
    const emailsToInvite = cofounders.filter(email => email.trim() !== "" && validateEmail(email.trim()));

    if (emailsToInvite.length === 0) {
      setInviteError("Please enter at least one valid cofounder email address.");
      setInviteSuccessMsg("");
      setTimeout(() => setInviteError(""), 3000);
      return;
    }

    setIsInviting(true);
    setInviteError("");
    setInviteSuccessMsg("");

    const token = localStorage.getItem("authToken");
    if (!token) {
      setInviteError("Authentication error. Please log in again.");
      setIsInviting(false);
      setTimeout(() => setInviteError(""), 3000);
      return;
    }

    let successMessages = [];
    let errorMessages = [];
    let allSucceeded = true;

    for (const email of emailsToInvite) {
      try {
        const response = await axios.post(
          `${API_KEY}/api/invites/cofounder`,
          { cofounderEmail: email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        successMessages.push(response.data.msg || `Invitation sent to ${email}.`);
      } catch (err) {
        allSucceeded = false;
        const backendError = err.response?.data?.msg || `Failed to send invitation to ${email}.`;
        console.error(`Error inviting ${email}:`, backendError, err.response);
        errorMessages.push(backendError);
      }
    }

    setIsInviting(false);

    if (errorMessages.length > 0) {
      setInviteError(errorMessages.join(" \n "));
      setTimeout(() => setInviteError(""), 5000);
    }
    if (successMessages.length > 0) {
      setInviteSuccessMsg(successMessages.join(" \n "));
      setTimeout(() => setInviteSuccessMsg(""), 3000);
    }

    if (allSucceeded) {
      setCofounders([""]); // Reset form only if all were successful
      setTimeout(() => {
        navigate("/homepage"); // Navigate on full success
      }, 2000); // Delay to show success message
    }
    // If partial success or only errors, messages are displayed, user can retry or skip.
  };

  // Styles that will be applied consistently across screen sizes
  const inputStyle = {
    borderRadius: '0.1875rem',
    border: '1px solid rgba(184, 184, 184, 0.13)',
    background: 'rgba(7, 7, 7, 0.76)',
    color: '#656565',
    fontFamily: 'Inter',
    fontWeight: 400,
    padding: '0 0.75rem',
  };

  const buttonBaseStyle = {
    fontFamily: 'Inter',
    fontWeight: 500,
    cursor: isInviting ? 'not-allowed' : 'pointer',
    opacity: isInviting ? 0.5 : 1
  };

  return (
    <div className="min-h-screen text-white bg-black bg-cover bg-top bg-no-repeat p-4 sm:p-6 md:p-9">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950 opacity-65 z-0"></div>
      <div className="relative z-10">
        <Header />
        
        {/* Success Notification Popup */}
        <div
          className={`fixed top-4 right-4 z-[100] transition-all duration-1000 ease-in-out ${
            inviteSuccessMsg ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <div className="max-w-xs sm:max-w-sm md:max-w-md whitespace-pre-line rounded-md border border-[#18152D] bg-black flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 shadow-lg">
            <span className="text-white font-inter text-sm sm:text-base font-medium">{inviteSuccessMsg}</span>
          </div>
        </div>

        {/* Error Notification Popup */}
        <div
          className={`fixed top-4 right-4 z-[100] transition-all duration-1000 ease-in-out ${
            inviteError ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <div className="max-w-xs sm:max-w-sm md:max-w-md whitespace-pre-line rounded-md border border-[#18152D] bg-black flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 shadow-lg">
            <span className="text-white font-inter text-sm sm:text-base font-medium">{inviteError}</span>
          </div>
        </div>

        {/* Content container with responsive positioning */}
        <div className="flex justify-center md:block md:justify-start">
          <div className="mt-8 mx-auto md:mx-0 md:ml-[17rem] md:mt-[9.87rem] max-w-[90%] sm:max-w-[360px] md:max-w-none">
            {/* 1. Main heading */}
            <h5 className="text-white font-inter text-xl md:text-[1.5rem] font-semibold mb-2 md:mb-[0.81rem]">
              One last thing! Invite your co-founder
            </h5>
            
            {/* 2. Subtitle */}
            <p className="text-white font-inter text-sm md:text-[0.875rem] font-normal mb-6 md:mb-[2.19rem]">
              Get a lot more done with Visible by inviting your team
            </p>

            {/* 3. Email input containers */}
            <div className="flex flex-col mb-2 md:mb-[0.56rem]">
              {cofounders.map((email, index) => (
                <input
                  key={index}
                  type="email"
                  value={email}
                  onChange={(e) => handleCofounderChange(index, e.target.value)}
                  placeholder="Cofounder@yourcompany.com"
                  className="w-full md:w-[22.5rem] h-10 md:h-[2.5rem] text-xs md:text-[0.75rem] mb-2"
                  style={{
                    ...inputStyle,
                    marginBottom: index < cofounders.length - 1 ? '0.5rem' : '0'
                  }}
                />
              ))}
            </div>

            {/* 4. Add Co-founder button */}
            <button
              onClick={handleAddCofounder}
              disabled={isInviting || cofounders.length >= 5}
              className="bg-transparent border-0 text-white font-inter text-sm md:text-[0.9rem] font-normal flex items-center gap-2 mb-6 md:mb-[2.19rem]"
              style={{
                ...buttonBaseStyle
              }}
            >
              <FaPlus /> Add Co-founder
            </button>

            {/* 5. Invite and Skip buttons container */}
            <div className="flex items-center">
              {/* 5. Invite button */}
              <button
                onClick={handleInvite}
                disabled={isInviting}
                className="inline-flex justify-center items-center bg-white border-0 rounded text-black font-inter text-sm md:text-[0.875rem] px-6 py-2 md:px-8 md:py-[0.5625rem]"
                style={{
                  ...buttonBaseStyle
                }}
              >
                {isInviting ? "Sending..." : "Invite"}
              </button>
              
              {/* 6. Skip button */}
              <button
                onClick={() => navigate("/homepage")}
                disabled={isInviting}
                className="bg-transparent border-0 text-white font-inter text-sm md:text-[0.875rem] ml-4 md:ml-[1.25rem]"
                style={{
                  ...buttonBaseStyle
                }}
              >
                or   skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCofounder_Page;