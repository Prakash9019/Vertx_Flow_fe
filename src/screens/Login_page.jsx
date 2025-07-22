import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import BackgroundImage from "../assets/login_background.svg";
import Logo from "../assets/logo.svg";
import { useNavigate, useLocation } from "react-router-dom";
import  API_KEY  from "../../key";

function Login_Page() {
     const [userEmail, setUserEmail] = useState("");
    const [storedEmail, setStoredEmail] = useState("");
  const [otpFormDisplay, setOtpFormDisplay] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Effect to extract inviteToken from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const inviteTokenFromUrl = params.get("inviteToken");

    if (inviteTokenFromUrl) {

      localStorage.setItem("cofounderInviteToken", inviteTokenFromUrl);

      // Don't clean the URL immediately to avoid redirection issues
      // We'll clean it after successful login
    }
  }, [location]);

  // Handle email submit and OTP send
  const handleEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      setEmailError("Please enter a valid email address.");
      setUserEmail("");
      setTimeout(() => setEmailError(""), 2000);
      return;
    }

    try {

      setEmailError("OTP Sent!");
        setOtpFormDisplay(true);
      const response = await axios.post(`${API_KEY}/api/auth/send-otp`, {
        email: userEmail,
      });

      if (response) {
        setStoredEmail(userEmail);
        // setOtpFormDisplay(true);
        setUserEmail("");
        setEmailError("");
      }
    } catch (error) {
      setEmailError("Failed to send OTP. Please try again.");
      console.error("Send OTP error:", error.response?.data || error.message);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };
  // Google Login
  const handleLoginWithGoogle = () => {
    // Check if this is a cofounder login (has invite token)
    const hasInviteToken = localStorage.getItem("cofounderInviteToken");
    
    // Only set homepage redirect for cofounders
    if (hasInviteToken) {
      localStorage.setItem('postLoginRedirect', '/homepage');
    }
    
    // Log for debugging
    
    // Determine if we're in development or production
    const isDev = window.location.hostname === "localhost" || 
                  window.location.hostname === "127.0.0.1";
    
    // Use the appropriate backend URL
    const backendUrl = isDev ? "http://localhost:5000" : API_KEY;
    const backendGoogleAuthUrl = `${backendUrl}/auth/google`;
    

    window.location.href = backendGoogleAuthUrl;
  };

  // Submit OTP
  const handleOtpSubmit = async () => {
    const fullOtp = otp.join("");
    setErrorMessage("");

    try {
      const response = await axios.post(`${API_KEY}/api/auth/verify-otp`, {
        email: storedEmail,
        otp: fullOtp,
      });

      if (response && response.data?.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("isVerified", "true");

        // Clean URL after successful login
        const cleanUrl = location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        const inviteToken = localStorage.getItem("cofounderInviteToken");        const shouldRedirectToHome = localStorage.getItem("redirectToHomeAfterLogin") === "true";
        const pendingInviteId = localStorage.getItem("pendingInviteId");        if (inviteToken) {
          // console.log(
            // "Processing cofounder invitation token:",
            // inviteToken
          // );
          try {
            // Call the API to accept the cofounder invite
            const inviteResponse = await axios.post(
              `${API_KEY}/api/invites/accept-cofounder`,
              { inviteToken },
              {
                headers: {
                  Authorization: `Bearer ${response.data.token}`,
                },
              }
            );

            if (inviteResponse.data) {
              // console.log("Cofounder invite accepted successfully:", inviteResponse.data);
            }

            // Always redirect to homepage after successful login
            navigate("/homepage");
          } catch (inviteError) {
            console.error("Error processing invitation:", inviteError);
            // Still redirect to homepage even if there's an error processing the invite
            navigate("/homepage");
          } finally {
            localStorage.removeItem("cofounderInviteToken");
          }        }
        // Check for target list invite redirect flag
        else if (shouldRedirectToHome || pendingInviteId) {
          // console.log("Redirecting to homepage after target list invite login");
          // Clear the flags after use
          localStorage.removeItem("redirectToHomeAfterLogin");
          localStorage.removeItem("pendingInviteId");
          navigate("/homepage");
        } 
        else {
          // Check profile completion status before redirecting
          try {
            const profileResponse = await axios.get(`${API_KEY}/api/auth/profile-status`, {
              headers: {
                Authorization: `Bearer ${response.data.token}`,
              },
            });
            
            const { isProfileComplete, redirectTo } = profileResponse.data;
            
            if (isProfileComplete) {
              // console.log("Profile is complete, redirecting to homepage");
              navigate("/homepage");
            } else {
              // console.log(`Profile incomplete, redirecting to: ${redirectTo}`);
              navigate(redirectTo || "/profile/manual");
            }
          } catch (profileError) {
            console.error("Error checking profile status:", profileError);
            // Fallback to default profile setup if API call fails
            navigate("/profile/manual");
          }
        }
        
        setOtpFormDisplay(false);
        setOtp(["", "", "", "", "", ""]);
        setErrorMessage("");
      } else {
        setErrorMessage("OTP verified, but no token received.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.msg || "OTP has expired or is invalid"
      );
      console.error("Verify OTP error:", error.response?.data || error.message);
      setTimeout(() => {
        setOtp(["", "", "", "", "", ""]);
        setErrorMessage("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left Side     1C001E   */}
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
            className="bg-white w-72 text-sm text-black px-4 py-3 rounded-md shadow hover:bg-gray-200 active:bg-gray-200"
            onClick={handleLoginWithGoogle}
          >
            Continue with Google
          </button>
        </div>

        <p className="w-2 text-center my-5 ml-[8rem]">or</p>

        {/* Email Login */}
        <div className="flex flex-col gap-3">
          <input
            className="bg-black w-72 text-sm text-white px-4 py-3 border border-gray-700 rounded-md placeholder-gray-400"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter email address"
          />
          {emailError && (
            <p
              className={`text-sm ${
                emailError === "OTP Sent!" ? "text-green-600" : "text-red-600"
              }`}
            >
              {emailError}
            </p>
          )}
          {/* <button
            onClick={handleEmail}
            className="bg-gray-400 text-sm w-72 text-black px-4 py-3 rounded-md shadow hover:bg-gray-200 active:bg-gray-200"
          >
            Continue with email
          </button> */}
          <button
  onClick={handleEmail}
  disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)}
  className={`text-sm w-72 px-4 py-3 rounded-md shadow 
    ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)
      ? "bg-white text-black hover:bg-gray-200 active:bg-gray-200"
      : "bg-gray-400 text-black cursor-not-allowed"}
  `}
>
  Continue with email
</button>


          {/* OTP Pop-up */}
          {otpFormDisplay && (
            <div
              // className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
              onClick={() => {
                setOtpFormDisplay(false);
                setErrorMessage("");
                setOtp(["", "", "", "", "", ""]);
              }}
            >
              <div
                className="font-inter bg-[#000000] p-8 sm:px-[7rem] py-8 border border-gray-700 text-white rounded-lg flex flex-col items-center gap-5 "
                onClick={(e) => e.stopPropagation()}
              >
                <img src={Logo} alt="Logo" className="w-11 h-11 mb-3 mt-8" />
                <h2 className="font-inter font-semibold text-2xl sm:text-3xl md:text-[32px] leading-[100%] tracking-[0%] align-middle">
              Email sent
                </h2>
                <p className="text-center font-inter font-normal text-sm sm:text-base leading-[100%] tracking-[0%] align-middle">
  Check your mail for a 6-digit code and enter it below.
  <br />
  <span className="font-inter font-normal text-xs sm:text-sm text-gray-400 leading-[100%] tracking-[0%] align-middle">
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
                          : "text-black bg-gray-200"
                      }`}
                    />
                  ))}
                </div>

                {errorMessage && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}

                <button
                  onClick={handleOtpSubmit}
                  className="bg-white text-black px-6 py-2 rounded w-full sm:w-72 hover:bg-gray-300 active:bg-gray-300"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-14">
          <p className="text-sm text-gray-400">
            Trouble logging in? Email us at{" "}
            <a
              href="mailto:support@govertx.com"
              className="hover:underline hover:text-white active:text-white"
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