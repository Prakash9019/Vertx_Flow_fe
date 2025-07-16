import React, { useState, useEffect } from 'react';
import TargetListInvitePage from './TargetListInvitePage';
import { API_KEY } from '../../../key.js';

const InvitePageWrapper = () => {
  const [userLists, setUserLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showInvitePage, setShowInvitePage] = useState(false);

  useEffect(() => {
    fetchUserLists();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  const fetchUserLists = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        alert('Please log in to view your lists');
        return;
      }

      const response = await fetch(`${API_KEY}/api/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setUserLists(result.data);
        if (result.data.length > 0) {
          setSelectedListId(result.data[0]._id);
        }
      } else {
        console.error('Failed to fetch lists:', result);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvite = () => {
    if (!selectedListId) {
      alert('Please select a list first');
      return;
    }
    setShowInvitePage(true);
  };

  const handleBackToSelection = () => {
    setShowInvitePage(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading your lists...</div>
      </div>
    );
  }

  if (showInvitePage && selectedListId) {
    return (
      <div>
        <button 
          onClick={handleBackToSelection}
          style={{
            marginBottom: '20px',
            padding: '10px 20px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back to List Selection
        </button>
        <TargetListInvitePage listId={selectedListId} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Create Target List Invite</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Select a target list to create a shareable invite link.
      </p>

      {userLists.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px' 
        }}>
          <p>You don't have any target lists yet.</p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Create a target list first to generate invite links.
          </p>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Select Target List:
            </label>
            <select
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              {userLists.map(list => (
                <option key={list._id} value={list._id}>
                  {list.name} ({list.coverColor})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCreateInvite}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#6d28d9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Create Invite Link for Selected List
          </button>

          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#fff3cd', 
            borderRadius: '8px',
            border: '1px solid #ffc107'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>What happens next:</h4>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#856404' }}>
              <li>A unique invite link will be generated for the selected list</li>
              <li>You can share this link with anyone via email or QR code</li>
              <li>The link will be valid for 7 days</li>
              <li>Only invited people can access your target list</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitePageWrapper;
