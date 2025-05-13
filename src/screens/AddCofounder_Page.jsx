// Vertx_Flow_fe/src/screens/AddCofounder_Page.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

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
      return;
    }

    setIsInviting(true);
    setInviteError("");
    setInviteSuccessMsg("");

    const token = localStorage.getItem("authToken");
    if (!token) {
      setInviteError("Authentication error. Please log in again.");
      setIsInviting(false);
      return;
    }

    let successMessages = [];
    let errorMessages = [];
    let allSucceeded = true;

    for (const email of emailsToInvite) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/invites/cofounder",
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
    }
    if (successMessages.length > 0) {
      setInviteSuccessMsg(successMessages.join(" \n "));
    }

    if (allSucceeded) {
      setCofounders([""]); // Reset form only if all were successful
      setTimeout(() => {
        navigate("/homepage"); // Navigate on full success
      }, 2000); // Delay to show success message
    }
    // If partial success or only errors, messages are displayed, user can retry or skip.
  };

  return (
    <div className="min-h-screen text-white bg-black bg-cover bg-top bg-no-repeat p-4 sm:p-6 md:p-9">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950 opacity-65 z-0"></div>
      <div className="relative z-10">
        <Header />
        {/* body  */}
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="w-full sm:w-3/5 lg:w-3/6 xl:w-3/10 flex flex-col gap-8 justify-center px-4 sm:px-0 text-white">
            {/* API Feedback Messages */}
            {inviteSuccessMsg && !inviteError && ( // Show success only if no errors
              <div className="bg-green-600 text-white px-4 py-3 mb-4 rounded-md border border-green-700 shadow-md whitespace-pre-line text-sm text-center">
                {inviteSuccessMsg}
              </div>
            )}
            {inviteError && (
              <div className="bg-red-600 text-white px-4 py-3 mb-4 rounded-md border border-red-700 shadow-md whitespace-pre-line text-sm text-center">
                {inviteError}
              </div>
            )}
            {/* End API Feedback Messages */}
            
            <div>
              <h5 className="text-xl sm:text-2xl font-semibold mb-2">
                One last thing! Invite your co-founder
              </h5>
              <p className="text-sm sm:text">
                Get a lot more done with Vertx Flow by inviting your team {/* Corrected "Visible" to "Vertx Flow" based on context */}
              </p>
            </div>

            <div className="space-y-2">
              {cofounders.map((email, index) => (
                <input
                  key={index}
                  type="email"
                  value={email}
                  onChange={(e) => handleCofounderChange(index, e.target.value)}
                  placeholder={`Enter cofounder email`}
                  className="w-full py-1 rounded-md px-2 border border-gray-700 text-white"
                />
              ))}

              <button
                onClick={handleAddCofounder}
                className="bg-black px-4 py-2 mt-2 flex items-center gap-2 rounded-md border-2 border-gray-700 hover:border-purple-500 active:border-gray-700 disabled:opacity-50" // Adjusted border and hover/active, added disabled
                disabled={isInviting || cofounders.length >= 5} // Example limit
              >
                <FaPlus /> Add Co-founder
              </button>
            </div>

            <div>
              <button
                onClick={handleInvite}
                className="bg-white text-black px-5 py-2 rounded-md font-semibold border-2 border-white hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50" // Consistent border, hover, active, disabled
                disabled={isInviting}
              >
                {isInviting ? "Sending..." : "Invite"}
              </button>
              <span className="mx-3">or</span>
              <button
                onClick={() => navigate("/homepage")}
                className="bg-black px-5 py-2 rounded-md font-semibold border-2 border-gray-700 hover:border-purple-500 active:border-purple-600 disabled:opacity-50" // Adjusted border and hover/active, added disabled
                disabled={isInviting}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCofounder_Page;