import React from 'react';
import { useCofounderNotifications } from '../utils/cofounderNotifications';

// Example component showing how to use co-founder permission notifications
const CofounderPermissionExample = () => {
  const { showPermissionGranted, showPermissionRevoked, showCofounderInvited, showCofounderRemoved } = useCofounderNotifications();

  // Example functions that would typically make API calls
  const handleGrantPermissions = async () => {
    try {
      // Simulate API call
      // console.log('Granting co-founder permissions...');
      // await api.grantCofounderPermissions(cofounderId);
      
      // Show success notification
      showPermissionGranted();
    } catch (error) {
      console.error('Failed to grant permissions:', error);
    }
  };

  const handleRevokePermissions = async () => {
    try {
      // Simulate API call
      // console.log('Revoking co-founder permissions...');
      // await api.revokeCofounderPermissions(cofounderId);
      
      // Show success notification
      showPermissionRevoked();
    } catch (error) {
      console.error('Failed to revoke permissions:', error);
    }
  };

  const handleInviteCofounder = async () => {
    try {
      // Simulate API call
      // console.log('Inviting co-founder...');
      // await api.inviteCofounder(email);
      
      // Show success notification
      showCofounderInvited();
    } catch (error) {
      console.error('Failed to invite co-founder:', error);
    }
  };

  const handleRemoveCofounder = async () => {
    try {
      // Simulate API call
      // console.log('Removing co-founder...');
      // await api.removeCofounder(cofounderId);
      
      // Show success notification
      showCofounderRemoved();
    } catch (error) {
      console.error('Failed to remove co-founder:', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-white text-xl font-semibold">Co-founder Permission Notifications Demo</h2>
      
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleGrantPermissions}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Grant Permissions
        </button>
        
        <button
          onClick={handleRevokePermissions}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Revoke Permissions
        </button>
        
        <button
          onClick={handleInviteCofounder}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Invite Co-founder
        </button>
        
        <button
          onClick={handleRemoveCofounder}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
        >
          Remove Co-founder
        </button>
      </div>
      
      <p className="text-gray-400 text-sm">
        Click any button above to see the corresponding success notification appear.
      </p>
    </div>
  );
};

export default CofounderPermissionExample;
