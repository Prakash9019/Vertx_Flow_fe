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
        
        {/* Content positioned with exact specifications */}
        <div style={{ marginLeft: '17rem', marginTop: '9.87rem' }}>
          {/* API Feedback Messages */}
          {inviteSuccessMsg && !inviteError && ( // Show success only if no errors
            <div className="bg-green-600 text-white px-4 py-3 mb-4 rounded-md border border-green-700 shadow-md whitespace-pre-line text-sm">
              {inviteSuccessMsg}
            </div>
          )}
          {inviteError && (
            <div className="bg-red-600 text-white px-4 py-3 mb-4 rounded-md border border-red-700 shadow-md whitespace-pre-line text-sm">
              {inviteError}
            </div>
          )}
          {/* End API Feedback Messages */}
          
          {/* 1. Main heading */}
          <h5 style={{
            color: '#FFF',
            fontFamily: 'Inter',
            fontSize: '1.25rem',
            fontWeight: 600,
            marginBottom: '0.81rem'
          }}>
            One last thing! Invite your co-founder
          </h5>
          
          {/* 2. Subtitle */}
          <p style={{
            color: '#FFF',
            fontFamily: 'Inter',
            fontSize: '0.875rem',
            fontWeight: 400,
            marginBottom: '2.19rem'
          }}>
            Get a lot more done with Visible by inviting your team
          </p>

          {/* 3. Email input containers */}
          <div style={{ marginBottom: '0.56rem' }}>
            {cofounders.map((email, index) => (
              <input
                key={index}
                type="email"
                value={email}
                onChange={(e) => handleCofounderChange(index, e.target.value)}
                placeholder="Cofounder@yourcompany.com"
                style={{
                  width: '22.5rem',
                  height: '2.5rem',
                  borderRadius: '0.1875rem',
                  border: '1px solid rgba(184, 184, 184, 0.13)',
                  background: 'rgba(7, 7, 7, 0.76)',
                  color: '#656565',
                  fontFamily: 'Inter',
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  padding: '0 0.75rem',
                  marginBottom: index < cofounders.length - 1 ? '0.5rem' : '0'
                }}
              />
            ))}
          </div>

          {/* 4. Add Co-founder button */}
          <button
            onClick={handleAddCofounder}
            disabled={isInviting || cofounders.length >= 5}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFF',
              fontFamily: 'Inter',
              fontSize: '0.75rem',
              fontWeight: 400,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '2.19rem',
              cursor: isInviting || cofounders.length >= 5 ? 'not-allowed' : 'pointer',
              opacity: isInviting || cofounders.length >= 5 ? 0.5 : 1
            }}
          >
            <FaPlus /> Add Co-founder
          </button>

          {/* 5. Invite and Skip buttons container */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* 5. Invite button */}
            <button
              onClick={handleInvite}
              disabled={isInviting}
              style={{
                display: 'inline-flex',
                padding: '0.5625rem 2rem 0.625rem 1.9375rem',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#FFF',
                border: 'none',
                borderRadius: '0.25rem',
                color: '#000',
                fontFamily: 'Inter',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: isInviting ? 'not-allowed' : 'pointer',
                opacity: isInviting ? 0.5 : 1
              }}
            >
              {isInviting ? "Sending..." : "Invite"}
            </button>
            
            {/* 6. Skip button */}
            <button
              onClick={() => navigate("/homepage")}
              disabled={isInviting}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFF',
                fontFamily: 'Inter',
                fontSize: '0.875rem',
                fontWeight: 500,
                marginLeft: '1.25rem',
                cursor: isInviting ? 'not-allowed' : 'pointer',
                opacity: isInviting ? 0.5 : 1
              }}
            >
              or Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCofounder_Page;