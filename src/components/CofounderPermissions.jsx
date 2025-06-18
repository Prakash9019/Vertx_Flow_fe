import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import API_KEY from '../../key';

const CofounderPermissions = ({ onClose }) => {
  const [cofounders, setCofounders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startup, setStartup] = useState(null);

  useEffect(() => {
    fetchCofounderPermissions();
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to restore body scrolling
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const fetchCofounderPermissions = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_KEY}/api/auth/cofounders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setCofounders(response.data.cofounders);
      setStartup(response.data.startup);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cofounder permissions:', error);
      setError(error.response?.data?.message || 'Failed to load co-founder data');
      setLoading(false);
    }
  };

  const togglePermissions = async (cofounderId, currentAccess) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.patch(`${API_KEY}/api/auth/cofounder/permissions`, {
        cofounderId,
        fullAccess: !currentAccess
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update the local state
      setCofounders(prev => prev.map(cofounder => 
        cofounder._id === cofounderId 
          ? { ...cofounder, permissions: response.data.cofounder.permissions }
          : cofounder
      ));

      // Show success message
      alert(response.data.message);
    } catch (error) {
      console.error('Error updating permissions:', error);
      alert(error.response?.data?.message || 'Failed to update permissions');
    }
  };  if (loading) {
    const loadingModal = (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
        <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-white text-center">Loading co-founder data...</div>
        </div>
      </div>
    );
    return createPortal(loadingModal, document.body);
  }

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] pointer-events-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{ 
        isolation: 'isolate',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div 
        className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto relative z-10 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      ><div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Account Settings - Co-founder Permissions</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {startup && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-2">Company: {startup.companyName}</h3>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-600 text-white rounded-lg">
            {error}
          </div>
        )}

        {cofounders.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No co-founders found for your startup.</p>
            <p className="text-sm mt-2">Invite co-founders to see them here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-4">Co-founders ({cofounders.length})</h3>
            
            {cofounders.map((cofounder) => (
              <div key={cofounder._id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {cofounder.name ? cofounder.name[0].toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          {cofounder.name || cofounder.username}
                        </h4>
                        <p className="text-gray-400 text-sm">{cofounder.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-300">
                        Access Level: {cofounder.permissions?.fullAccess ? 'Full Access' : 'Read Only'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {cofounder.permissions?.fullAccess 
                          ? 'Can create, edit, and delete data' 
                          : 'Can only view data'}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => togglePermissions(cofounder._id, cofounder.permissions?.fullAccess)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        cofounder.permissions?.fullAccess
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {cofounder.permissions?.fullAccess ? 'Revoke Access' : 'Grant Access'}
                    </button>
                  </div>
                </div>
                
                {cofounder.permissions?.fullAccess && (
                  <div className="mt-3 p-3 bg-green-900 bg-opacity-30 rounded border border-green-600">
                    <p className="text-green-300 text-sm">
                      ✓ This co-founder has full access to create, edit, and delete startup data
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            <p><strong>Note:</strong> Co-founders can always view your startup data.</p>
            <p>Full access allows them to create, edit, and delete data including funding rounds, investor lists, and startup information.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CofounderPermissions;
