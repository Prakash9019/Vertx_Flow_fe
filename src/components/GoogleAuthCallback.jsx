import { useEffect } from 'react';
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
          console.log('Google Auth Token:', token);
          console.log('Google Auth Callback URL:', window.location.search);
          
          localStorage.setItem('authToken', token);
          localStorage.setItem('isVerified', 'true');
          
          // Clean URL after successful login
          const cleanUrl = location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          
          // Check URL parameters for cofounder status
          const searchParams = new URLSearchParams(location.search);
          const isCofounder = searchParams.get('cofounder');
          const startupId = searchParams.get('startupId');
          
          if (isCofounder === 'true' && startupId) {
            console.log('Google Login successful for cofounder, startupId:', startupId);
            
            try {
              // Make API call to associate user with startup as cofounder
              const response = await fetch('/api/startups/join-as-cofounder', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ startupId })
              });
              
              if (!response.ok) {
                throw new Error('Failed to join as cofounder');
              }
              
              // Always navigate cofounders to homepage
              console.log('Google Auth Successful, cofounder detected, navigating to /homepage');
              navigate('/homepage');
            } catch (error) {
              console.error('Error processing cofounder status:', error);
              // Still redirect to homepage on error
              navigate('/homepage');
            }
          } else {
            // Check if there's a legacy cofounder invitation token
            const inviteToken = localStorage.getItem('cofounderInviteToken');
            
            if (inviteToken) {
              console.log('Google Login successful for cofounder, invite token is present:', inviteToken);
              // This is a cofounder login with invitation token
              try {
                // Always navigate cofounders to homepage
                console.log('Google Auth Successful, cofounder detected, navigating to /homepage');
                navigate('/homepage');
              } catch (inviteError) {
                console.error('Error processing invitation:', inviteError);
                // Still redirect to homepage on error
                navigate('/homepage');
              } finally {
                localStorage.removeItem('cofounderInviteToken');
              }
            } else {
              // This is a regular user login (not a cofounder)
              console.log('Google Auth Successful, token received, navigating to /profile/manual');
              navigate('/profile/manual');
            }
          }
        } else {
          console.log('No token received in Google Auth callback, redirecting to login');
          navigate('/');
        }
      } catch (error) {
        console.error('Error in Google Auth callback:', error);
        navigate('/');
      }
    };

    fetchUserData();
  }, [navigate, location]);

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