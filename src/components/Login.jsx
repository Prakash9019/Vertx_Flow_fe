import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("https://email-automation-427457295403.us-central1.run.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // 🔐 Trigger Google OAuth or backend authentication
        body: JSON.stringify({})
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error("Login failed or token missing.");
      }

      // ✅ Store token in localStorage for authenticated requests
      localStorage.setItem("token", data.token);

      // ✅ Navigate to the next route
      navigate("/flow/outbound");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-sans">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Welcome to Email Flow</h1>
        <button
          onClick={handleLogin}
          className="bg-white text-black px-6 py-2 rounded-md hover:bg-gray-200 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

