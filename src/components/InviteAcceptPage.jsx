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
      <div className="flex justify-center items-center min-h-screen flex-col">
        <div className="text-[18px] mb-5">Loading invite...</div>
        <div className="text-[#666]">Please wait while we fetch the invite details</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen flex-col">
        <div className="bg-[#fee] p-[30px] rounded-lg text-center max-w-lg">
          <h2 className="text-[#d32f2f] mb-[15px]">Invite Not Available</h2>
          <p className="text-[#666] mb-5">{error}</p>
          <button
            onClick={() => navigate('/homepage')}
            className="py-3 px-6 bg-[#6d28d9] text-white border-none rounded cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-5">
      <div className="bg-white p-10 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-center max-w-[500px] w-full">
        <div className="mb-[30px]">
          <h1 className="text-[#6d28d9] mb-2.5">
            You're Invited! 🎉
          </h1>
          <h2 className="text-[#333] mb-5">
            {inviteData?.title || 'Join Target List'}
          </h2>
        </div>
        {inviteData?.listName && (
          <div className="bg-[#f8f9fa] p-5 rounded-lg mb-[30px]">
            <h3 className="m-0 mb-2.5 text-[#333]">
              Target List: {inviteData.listName}
            </h3>
            {inviteData.description && (
              <p className="m-0 text-[#666]">
            {inviteData.description}
          </p>
            )}
          </div>
        )}
        <div className="mb-[30px]">
          <p className="text-[#666] mb-2.5">
            Invited by: <strong>{inviteData?.createdBy}</strong>
          </p>
          <p className="text-[#666] text-sm">
            This invite expires on {inviteData?.expiresAt ? new Date(inviteData.expiresAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
        <button
          onClick={handleAcceptInvite}
          disabled={accepting}
          className={`w-full p-[15px] text-white border-none rounded-lg text-[18px] font-bold mb-5 ${accepting ? 'bg-[#ccc] cursor-not-allowed' : 'bg-[#6d28d9] cursor-pointer'}`}
        >
          {accepting ? 'Joining...' : 'Accept Invitation'}
        </button>
        <div className="p-[15px] bg-[#e3f2fd] rounded-lg text-sm text-[#1976d2]">
          <p className="m-0 font-bold">🔒 Secure Invitation</p>
          <p className="mt-[5px] m-0">
            This is a private invitation. Only invited members can access this target list.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InviteAcceptPage;
