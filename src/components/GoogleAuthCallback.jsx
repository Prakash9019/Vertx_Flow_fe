import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function GoogleAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const googleAuthToken = params.get('token'); // This is the cofounder's own authToken from Google login
        console.log("Google Auth Token:", googleAuthToken);
        console.log("Google Auth Callback URL:", location.search);
    if (googleAuthToken) {
      localStorage.setItem('authToken', googleAuthToken);
      localStorage.setItem('isVerified', 'true');

      // Check if a cofounderInviteToken was stored before the Google redirect
      const cofounderInviteToken = localStorage.getItem('cofounderInviteToken');
      if (cofounderInviteToken) {
        console.log("Google Login successful for cofounder, invite token is present:", cofounderInviteToken);
        // NEXT STEP (Future): Call backend API to process this inviteToken using the new googleAuthToken
        // For example: await processInvite(cofounderInviteToken, googleAuthToken);
        // After processing, you might want to remove it:
        // localStorage.removeItem('cofounderInviteToken');
      }

      console.log("Google Auth Successful, token received, navigating to /linkedin");
      navigate('/linkedin'); // Or a specific "welcome cofounder" page
    } else {
      console.error("Google Auth Callback Error: Main auth token not found in URL.");
      navigate('/');
    }
  }, [location, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#000',
      color: 'white',
      fontSize: '1.2rem'
    }}>
      Processing Google authentication, please wait...
    </div>
  );
}

export default GoogleAuthCallback;