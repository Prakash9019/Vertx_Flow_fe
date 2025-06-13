import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_KEY from '../../key.js';

const InviteAcceptPage = () => {
  const { inviteId } = useParams();
  const navigate = useNavigate();
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (inviteId) {
      fetchInviteDetails();
    }
  }, [inviteId]);

  const fetchInviteDetails = async () => {
    try {
      const response = await fetch(`${API_KEY}/api/targetlist-invite/${inviteId}`);
      const result = await response.json();
      
      if (result.success) {
        setInviteData(result.data);
      } else {
        setError(result.message || 'Invite not found or expired');
      }
    } catch (error) {
      console.error('Error fetching invite details:', error);
      setError('Error loading invite details');
    } finally {
      setLoading(false);
    }
  };
  const handleAcceptInvite = async () => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (!token) {
      // User is not logged in, redirect to login with invite context
      localStorage.setItem('pendingInviteId', inviteId);
      localStorage.setItem('redirectToHomeAfterLogin', 'true'); // Flag to redirect to homepage after login
      navigate(`/login?invite=${inviteId}`);
      return;
    }

    setAccepting(true);
    try {
      // Here you would implement the actual invite acceptance logic
      // Now we'll redirect to the homepage after acceptance
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      alert('Successfully joined the target list!');
      navigate('/homepage'); // Redirect directly to homepage
    } catch (error) {
      console.error('Error accepting invite:', error);
      alert('Error accepting invite. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '20px' }}>Loading invite...</div>
        <div style={{ color: '#666' }}>Please wait while we fetch the invite details</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{ 
          backgroundColor: '#fee', 
          padding: '30px', 
          borderRadius: '8px', 
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#d32f2f', marginBottom: '15px' }}>Invite Not Available</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6d28d9',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#6d28d9', marginBottom: '10px' }}>
            You're Invited! 🎉
          </h1>
          <h2 style={{ color: '#333', marginBottom: '20px' }}>
            {inviteData?.title || 'Join Target List'}
          </h2>
        </div>

        {inviteData?.listName && (
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '30px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
              Target List: {inviteData.listName}
            </h3>
            {inviteData.description && (
              <p style={{ margin: '0', color: '#666' }}>
                {inviteData.description}
              </p>
            )}
          </div>
        )}

        <div style={{ marginBottom: '30px' }}>
          <p style={{ color: '#666', marginBottom: '10px' }}>
            Invited by: <strong>{inviteData?.createdBy}</strong>
          </p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            This invite expires on {inviteData?.expiresAt ? new Date(inviteData.expiresAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>

        <button
          onClick={handleAcceptInvite}
          disabled={accepting}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: accepting ? '#ccc' : '#6d28d9',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: accepting ? 'not-allowed' : 'pointer',
            marginBottom: '20px'
          }}
        >
          {accepting ? 'Joining...' : 'Accept Invitation'}
        </button>

        <div style={{ 
          padding: '15px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '8px',
          fontSize: '14px',
          color: '#1976d2'
        }}>
          <p style={{ margin: '0', fontWeight: 'bold' }}>🔒 Secure Invitation</p>
          <p style={{ margin: '5px 0 0 0' }}>
            This is a private invitation. Only invited members can access this target list.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InviteAcceptPage;
