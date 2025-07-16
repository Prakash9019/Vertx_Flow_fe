import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Logo from '../assets/logo.svg';

function AuthError() {
  const [errorMessage, setErrorMessage] = useState('Authentication failed');
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract error message from URL if present
    const urlParams = new URLSearchParams(location.search);
    const message = urlParams.get('message');
    if (message) {
      setErrorMessage(decodeURIComponent(message));
    }

    // Set up countdown to redirect to login page
    const timer = setInterval(() => {
      setCountdown(prev => {
        const newCount = prev - 1;
        if (newCount <= 0) {
          clearInterval(timer);
          navigate('/');
        }
        return newCount;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="bg-[#0F0E16] rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="Vertx Logo" className="h-12" />
        </div>
        
        <h2 className="text-white text-xl font-bold text-center mb-6">
          Authentication Error
        </h2>
        
        <div className="bg-red-900/30 border border-red-500 rounded p-4 mb-6">
          <p className="text-red-300 text-sm">
            {errorMessage || "An error occurred during authentication"}
          </p>
        </div>
        
        <p className="text-gray-400 text-sm mb-6 text-center">
          You'll be redirected to the login page in {countdown} seconds.
        </p>
        
        <div className="flex justify-center">
          <Link
            to="/"
            className="bg-white text-black px-6 py-2 rounded font-medium hover:bg-gray-200 transition-colors"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AuthError;
