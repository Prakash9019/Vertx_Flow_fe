import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function GoogleAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('isVerified', 'true');
          
          // Clean URL after successful login
          const cleanUrl = location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          
          // Check if there's a cofounder invitation token
          const inviteToken = localStorage.getItem('cofounderInviteToken');
          if (inviteToken) {
            console.log('Processing cofounder invitation after Google login:', inviteToken);
            // Process the invitation token
            try {
              // Optional: Add API call to process the invitation token
              // For now, just navigate to the homepage
              navigate('/homepage');
            } catch (inviteError) {
              console.error('Error processing invitation:', inviteError);
              navigate('/profile/manual');
            } finally {
              // Clear the token after processing
              localStorage.removeItem('cofounderInviteToken');
            }
          } else {
            // Normal login flow
            navigate('/profile/manual');
          }
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error in Google Auth callback:', error);
        navigate('/');
      }
    };

    fetchUserData();
  }, [navigate]);

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