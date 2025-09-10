import React, { useState, useEffect } from 'react';
import { API_KEY } from '../../../key.js'; // Adjust path as needed

const TargetListInvitePage = ({ listId }) => {
  const [inviteData, setInviteData] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Create invite when component mounts
  useEffect(() => {
    createInvite();
  }, [listId]);

  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  const createInvite = async () => {
    if (!listId) {
      setError('No list ID provided');
      return;
    }

    setCreating(true);
    setError('');
    
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please log in to create invites');
        return;
      }

      const response = await fetch(`${API_KEY}/api/targetlist-invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          listId: listId,
          title: 'Join our investor target list',
          description: 'You have been invited to join our exclusive investor network',
          accessType: 'private',
          expiresIn: 7 // 7 days
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setInviteData(result.data);
      } else {
        setError(result.message || 'Failed to create invite');
      }
    } catch (error) {
      console.error('Error creating invite:', error);
      setError('Error creating invite. Please try again.');
    } finally {
      setCreating(false);
    }
  };
  const handleGenerateQR = async () => {
    if (!inviteData) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_KEY}/api/targetlist-invite/${inviteData.inviteId}/qr`);
      const result = await response.json();
      
      if (result.success) {
        setQrCode(result.data.qrCode);
      } else {
        alert('Failed to generate QR code: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Error generating QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!inviteData) return;
    
    try {
      await navigator.clipboard.writeText(inviteData.inviteUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = inviteData.inviteUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackError) {
        alert('Failed to copy link. Please copy manually.');
      }
    }
  };
  const handleSendInvites = async () => {
    if (!inviteData || !emails.trim()) return;
    
    const emailList = emails.split(',').map(email => email.trim()).filter(email => email);
    if (emailList.length === 0) {
      alert('Please enter valid email addresses');
      return;
    }

    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        alert('Please log in to send invitations');
        return;
      }

      const response = await fetch(`${API_KEY}/api/targetlist-invite/${inviteData.inviteId}/email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emails: emailList,
          message: message.trim() || undefined
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Invitations sent successfully to ${result.data.sent} email(s)`);
        setEmails('');
        setMessage('');
      } else {
        alert(result.message || 'Failed to send invitations');
      }
    } catch (error) {
      console.error('Error sending invitations:', error);
      alert('Error sending invitations');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while creating invite
  if (creating) {
    return (
      <div className="loading" style={{ textAlign: 'center', padding: '50px' }}>
        <div>Creating your unique invite link...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="error" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <div>{error}</div>
        <button 
          onClick={createInvite}
          style={{ 
            marginTop: '20px', 
            padding: '10px 20px', 
            backgroundColor: '#6d28d9', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Try Again
        </button>
      </div>
    );
  }
  if (!inviteData) {
    return (
      <div className="loading" style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading invite data...</div>
      </div>
    );
  }

  return (
    <div className="invite-page" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div className="invite-header" style={{ marginBottom: '30px' }}>
        <h2>Your target list invite link is here</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          You can share this link with anyone, even if they're not on Vertx yet.
        </p>
        
        {/* Show invite details */}
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #4caf50'
        }}>
          <p style={{ margin: '0', color: '#2e7d32', fontWeight: 'bold' }}>
            ✅ Unique invite created successfully!
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#388e3c', fontSize: '14px' }}>
            This link is unique to your account and will expire on{' '}
            {inviteData.expiresAt ? new Date(inviteData.expiresAt).toLocaleDateString() : 'a future date'}
          </p>
        </div>
      </div>

      <div className="invite-link-section" style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '30px' 
      }}>
        <h3>Target list invite link</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
          <input
            type="text"
            value={inviteData.inviteUrl}
            readOnly
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white'
            }}
          />
          <button
            onClick={handleCopyLink}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6d28d9',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {copySuccess ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        
        <div style={{ marginTop: '15px' }}>
          <button
            onClick={handleGenerateQR}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>📱</span>
            {loading ? 'Generating...' : 'Generate QR'}
          </button>
          
          {qrCode && (
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <img 
                src={qrCode} 
                alt="QR Code" 
                style={{ maxWidth: '200px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="email-invite-section">
        <h3>Send Email Invitations</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Emails (comma separated)
          </label>
          <textarea
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="investor1@example.com, investor2@example.com"
            style={{
              width: '100%',
              height: '80px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Personal Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a personal message to your invitation..."
            style={{
              width: '100%',
              height: '60px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
        </div>
        
        <button
          onClick={handleSendInvites}
          disabled={loading || !emails.trim()}
          style={{
            padding: '12px 30px',
            backgroundColor: emails.trim() ? '#6d28d9' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: emails.trim() ? 'pointer' : 'not-allowed',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Sending...' : 'Invite'}
        </button>
      </div>

      <div className="access-info" style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#f0f8ff', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontSize: '20px' }}>🔒</span>
        <div>
          <strong>Who has access</strong>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Only those invited
          </p>
        </div>
      </div>
    </div>
  );
};

export default TargetListInvitePage;
