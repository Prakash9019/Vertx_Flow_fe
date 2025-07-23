import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_KEY from '../../key.js';

function GoogleAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
          // console.log('Google Auth Token:', token);
          // console.log('Google Auth Callback URL:', window.location.search);
          
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
            // console.log('Google Login successful for cofounder, startupId:', startupId);
            
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
              // console.log('Google Auth Successful, cofounder detected, navigating to /homepage');
              navigate('/homepage');
            } catch (error) {
              // console.error('Error processing cofounder status:', error);
              // Still redirect to homepage on error
              navigate('/homepage');
            }
          } else {
            // Check if there's a legacy cofounder invitation token
            const inviteToken = localStorage.getItem('cofounderInviteToken');
              if (inviteToken) {
              // console.log('Google Login successful for cofounder, invite token is present:', inviteToken);
              // This is a cofounder login with invitation token
              try {                // Call the API to accept the cofounder invite
                const inviteResponse = await fetch(`${API_KEY}/api/invites/accept-cofounder`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ inviteToken })
                });

                if (inviteResponse.ok) {
                  const inviteData = await inviteResponse.json();
                  // console.log('Cofounder invite accepted successfully:', inviteData);
                } else {
                  // console.error('Failed to accept cofounder invite:', await inviteResponse.text());
                }

                // Always navigate cofounders to homepage
                // console.log('Google Auth Successful, cofounder detected, navigating to /homepage');
                navigate('/homepage');
              } catch (inviteError) {
                // console.error('Error processing invitation:', inviteError);
                // Still redirect to homepage on error
                navigate('/homepage');
              } finally {
                localStorage.removeItem('cofounderInviteToken');
              }
            }else {
              // Check if we should redirect to homepage after target list invite
              const shouldRedirectToHome = localStorage.getItem("redirectToHomeAfterLogin") === "true";
              const pendingInviteId = localStorage.getItem("pendingInviteId");
              
              if (shouldRedirectToHome || pendingInviteId) {
                // console.log('Google Auth Successful, target list invite detected, navigating to /homepage');
                // Clear the flags after use
                localStorage.removeItem("redirectToHomeAfterLogin");
                localStorage.removeItem("pendingInviteId");
                navigate('/homepage');              } else {
                // This is a regular user login (not a cofounder)
                // console.log('Google Auth Successful, checking profile completion status');
                  try {
                  // Check profile completion status before redirecting
                  const profileResponse = await axios.get(`${API_KEY}/api/auth/profile-status`, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                  
                  const { isProfileComplete, redirectTo } = profileResponse.data;
                  
                  if (isProfileComplete) {
                    // console.log('Profile is complete, redirecting to homepage');
                    navigate('/homepage');
                  } else {
                    // console.log(`Profile incomplete, redirecting to: ${redirectTo}`);
                    navigate(redirectTo || '/profile/manual');
                  }
                } catch (profileError) {
                  // console.error('Error checking profile status:', profileError);
                  // Fallback to default profile setup if API call fails
                  navigate('/profile/manual');
                }
              }
            }
          }
        } else {
          // console.log('No token received in Google Auth callback, redirecting to login');
          navigate('/');
        }
      } catch (error) {
        // console.error('Error in Google Auth callback:', error);
        navigate('/');
      }
    };

    fetchUserData();
  }, [navigate, location]);

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white text-lg">
      Processing Google authentication, please wait...
    </div>
  );
}

export default GoogleAuthCallback;