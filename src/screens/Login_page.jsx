import React, { useRef, useState, useEffect } from "react"; // Added useEffect
import axios from "axios";
import BackgroundImage from "../assets/login_background.svg";
import Logo from "../assets/logo.svg";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation

function Login_Page() {
  const [userEmail, setUserEmail] = useState("");
  const [otpFormDisplay, setOtpFormDisplay] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const inputsRef = useRef([]);

  const navigate = useNavigate();
  const location = useLocation(); // Get location object to read URL params

  // Effect to check for inviteToken in URL when component mounts or location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const inviteTokenFromUrl = params.get('inviteToken');

    if (inviteTokenFromUrl) {
      console.log("Login Page: Invite Token found in URL:", inviteTokenFromUrl);
      // Store it for later use (e.g., after successful login/signup)
      localStorage.setItem('cofounderInviteToken', inviteTokenFromUrl);

      // Optional: Decode JWT to get cofounderEmail and pre-fill
      // This requires a JWT decoding library like 'jwt-decode' (npm install jwt-decode)
      // For this example, we'll skip pre-filling to keep it simpler for now.
      // If you implement it, you'd do:
      // try {
      //   const { jwtDecode } = await import('jwt-decode'); // Dynamic import
      //   const decodedInviteToken = jwtDecode(inviteTokenFromUrl);
      //   if (decodedInviteToken && decodedInviteToken.cofounderEmail) {
      //     setUserEmail(decodedInviteToken.cofounderEmail);
      //     console.log("Prefilled email from invite token:", decodedInviteToken.cofounderEmail);
      //   }
      // } catch (error) {
      //   console.error("Error decoding invite token for prefill:", error);
      // }

      // Clean the URL by removing the token, so it's not there on refresh or if the user navigates away and back.
      // This also prevents it from being processed multiple times.
      // We replace the current entry in history so back button works as expected.
      navigate(location.pathname, { replace: true, state: location.state });
    }
  }, [location, navigate]); // Rerun if location (URL query params) changes


  const handleEmail = async () => {
    // const emailRegex = /^[^\\s@]+@[^\\s@]+\.[^\\s@]+$/;
    // if (!emailRegex.test(userEmail)) {
    //   setEmailError("Please enter a valid email address.");
    //   return;
    // }
    try {
      setEmailError("OTP Send!");
      const response = await axios.post(
        "http://localhost:5000/api/auth/send-otp", // Your OTP endpoint
        { email: userEmail }
      );
      if (response) {
        setOtpFormDisplay(true);
      }
      setEmailError("");
    } catch (error) {
      setEmailError("Failed to send OTP. Please try again.");
      console.error("Send OTP error:", error.response ? error.response.data : error.message);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleOtpSubmit = async () => {
    const fullOtp = otp.join("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp", // Your OTP verification
        { email: userEmail, otp: fullOtp }
      );
       console.log(response);
      if (response && response.data && response.data.token) {
        localStorage.setItem("authToken", response.data.token); // Cofounder's own auth token
        localStorage.setItem("isVerified", "true");

        // Check if a cofounderInviteToken was stored earlier
        const cofounderInviteToken = localStorage.getItem('cofounderInviteToken');
        if (cofounderInviteToken) {
          console.log("OTP Login successful for cofounder, invite token is present:", cofounderInviteToken);
          // NEXT STEP (Future): Call backend API to process this inviteToken using the new authToken
          // For example: await processInvite(cofounderInviteToken, response.data.token);
          // After processing, you might want to remove it:
          // localStorage.removeItem('cofounderInviteToken');
        }

        navigate("/profile"); // Or a specific "welcome cofounder" page
        setOtpFormDisplay(false);
        setOtp(["", "", "", "", "", ""]);
        setErrorMessage("");
      } else {
         setErrorMessage(response?.data?.msg || "OTP verified, but login failed.");
         console.error("OTP Verification did not return a token or expected data", response.data);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "OTP has expired or is invalid");
      console.error("Verify OTP error:", error.response ? error.response.data : error.message);
    }
  };

  const handleLoginWithGoogle = () => {
    // If an inviteToken was present in the URL when this page loaded,
    // it would have been stored in localStorage by the useEffect hook.
    // We don't need to do anything special here for it before the Google redirect,
    // as GoogleAuthCallback will pick up 'cofounderInviteToken' from localStorage
    // after Google redirects back.
    const backendGoogleAuthUrl = "http://localhost:5000/auth/google";
    window.location.href = backendGoogleAuthUrl;
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left Side */}
      <div className="w-full xl:w-[38%] sm:ml-5 lg:ml-24 flex flex-col justify-center text-white px-8">
        <div>
          <img src={Logo} alt="Logo" className="w-11 h-11 mb-14" />
          <h1 className="text-4xl font-medium mb-2">
            Welcome to <br /> Vertx Flow
          </h1>
          <p className="my-6 text-sm leading-relaxed">
            Optimize your pitching using flow and raise <br />
            capital 10x smarter.
          </p>
          <button
            className="bg-white w-72 text-sm text-black px-4 py-3 rounded-md shadow hover:bg-gray-200 active:bg-gray-200 "
            onClick={handleLoginWithGoogle}
          >
            Continue with Google
          </button>
        </div>

        <p className="w-72 text-center my-5">or</p>

        <div className="flex flex-col gap-3">
          <input
            className="bg-black w-72 text-sm text-white px-4 py-3 border border-gray-700 rounded-md placeholder-gray-400"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter email address"
          />
          {emailError && (
            <p className={`text-sm ${emailError === "OTP Send!" ? "text-green-600" : "text-red-600"}`}>
              {emailError}
            </p>
          )}
          <button
            onClick={handleEmail}
            className="bg-gray-400 text-sm w-72 text-black px-4 py-3 rounded-md shadow hover:bg-gray-200 active:bg-gray-200 "
          >
            Continue with email
          </button>
          {otpFormDisplay && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setOtpFormDisplay(false)}
            >
              <div
                className="bg-black p-8 sm:px-[7rem] py-8 border border-gray-700 text-white rounded-lg flex flex-col items-center gap-5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <img src={Logo} alt="Logo" className="w-11 h-11 mb-3 mt-8" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold">Email sent</h2>
                <p className="text-center text-sm sm:text-base">
                  Check your mail for a 6-digit code and enter it below.
                  <br />
                  <span className="text-xs sm:text-sm text-gray-400">
                    (Might be in your spam folder)
                  </span>
                </p>
                <div className="flex gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      ref={(el) => (inputsRef.current[index] = el)}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-10 h-10 text-center text-xl font-medium rounded ${
                        errorMessage
                          ? "border-2 border-red-500 bg-black text-white"
                          : "text-black bg-gray-200 "
                      }`}
                    />
                  ))}
                </div>
                {errorMessage && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}
                <button
                  onClick={handleOtpSubmit}
                  className="bg-white text-black px-6 py-2 rounded w-full sm:w-72 hover:bg-gray-300 active:bg-gray-300 "
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-14">
          <p className="text-sm text-white-400">
            Trouble logging in? Email us at{" "}
            <a
              href="mailto:support@govertx.com"
              className="hover:underline hover:text-white active:text-white "
            >
              support@govertx.com
            </a>
          </p>
        </div>
      </div>

      {/* Right Side with Background Image */}
      <div
        className="w-full bg-cover hidden xl:block"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      ></div>
      <div
        className="w-full bg-cover bg-center xl:hidden"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      ></div>
    </div>
  );
}

export default Login_Page;