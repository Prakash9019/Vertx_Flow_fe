import React, { useRef, useState } from "react";
import axios from "axios";
import BackgroundImage from "../assets/login_background.svg";
import Logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

function Login_Page() {
  const [userEmail, setUserEmail] = useState("");
  const [otpFormDisplay, setOtpFormDisplay] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [storedEmail, setStoredEmail] = useState("");
  const inputsRef = useRef([]);

  const navigate = useNavigate();

  const handleEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(userEmail)) {
      setEmailError("Please enter a valid email address.");
      setUserEmail("");
      setTimeout(() => {
        setEmailError("");
      }, 2000);
      return;
    }
    console.log(userEmail);
    try {
      setEmailError("OTP Send!");
      const response = await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        {
          email: userEmail,
        }
      );
      console.log("response from handleEmail:-", response);
      if (response) {
        setStoredEmail(userEmail);
        setOtpFormDisplay(true);
      }
      setEmailError("");
      setUserEmail("");
    } catch (error) {
      setEmailError("Failed to send OTP. Please try again.");
      console.error("Send OTP error:", error);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // only allow a single digit

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

    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email: storedEmail,
          otp: fullOtp,
        }
      );

      console.log("OTP verification response:", response);
      console.log(storedEmail, fullOtp);

      if (response && response.data?.token) {
        localStorage.setItem("token", response.data.token);

        navigate("/profile");
        setOtpFormDisplay(false);
        setOtp(["", "", "", "", "", ""]);
        setErrorMessage("");
      } else {
        setErrorMessage("Something went wrong. No token received.");
        setTimeout(() => {
          setOtp(["", "", "", "", "", ""]);
          setErrorMessage("");
        }, 3000);
      }
    } catch (error) {
      setErrorMessage("OTP has expired or is invalid");
      console.error("Verify OTP error:", error);
    }
  };

  const handleLoginWithGoogle = () => {
    fetch("https://your-backend.com/api/auth/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: googleIdToken }),
    });
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left Side */}
      <div className="w-full xl:w-[38%] sm:ml-5 lg:ml-24 flex flex-col justify-center text-white px-8">
        <div>
          <img src={Logo} alt="Logo" className="w-11 h-11 mb-14" />

          <h1 className="text-4xl font-medium mb-2">
            Welcome to <br /> vertx Flow
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

        {/*  Otp enter form  */}
        <div className="flex flex-col gap-3">
          <input
            className="bg-black w-72 text-sm text-white px-4 py-3 border border-gray-700 rounded-md placeholder-gray-400"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter email address"
          />
          {emailError &&
            (emailError === "OTP Send!" ? (
              <p className="text-green-600 text-sm">{emailError}</p>
            ) : (
              <p className="text-red-600 text-sm">{emailError}</p>
            ))}
          <button
            onClick={handleEmail}
            className="bg-gray-400 text-sm w-72 text-black px-4 py-3 rounded-md shadow hover:bg-gray-200 active:bg-gray-200 "
          >
            Continue with email
          </button>
          {/* enter otp pop up  */}
          {otpFormDisplay && (
            <div
              className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center z-5"
              onClick={() => {
                setOtpFormDisplay(false);
                setErrorMessage("");
                setOtp(["", "", "", "", "", ""]);
              }}
            >
              <div
                className="bg-black px-[7rem] pb-8 border border-gray-900 text-white rounded-lg  flex flex-col items-center gap-5"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  {" "}
                  <img src={Logo} alt="Logo" className="w-11 h-11 mb-3 mt-8" />
                </div>
                <h2 className="text-4xl font-semibold">Email sent</h2>
                <p className="text-center">
                  Check your mail for a 6-digit code and enter it below.
                  <br />
                  <span className="text-sm text-gray-400">
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
                          ? "border-2 border-red-500 bg-black"
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
                  className="bg-white text-black px-6 py-2 rounded w-72 hover:bg-gray-300 active:bg-gray-300 "
                >
                  Submit
                </button>
                {/* <button
                  onClick={() => setOtpFormDisplay(false)}
                  className="bg-white text-black px-6 py-2 rounded hover:bg-gray-300"
                >
                  back
                </button> */}
              </div>
            </div>
          )}
        </div>

        <div className="pt-14">
          <p className="text-sm text-gray-400">
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
