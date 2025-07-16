import { usePermissionNotification } from '../hooks/usePermissionNotification';

// Utility functions for co-founder permission notifications
export const useCofounderNotifications = () => {
  const { showSuccessNotification } = usePermissionNotification();

  const showPermissionGranted = () => {
    showSuccessNotification('Co-founder permissions granted successfully');
  };

  const showPermissionRevoked = () => {
    showSuccessNotification('Co-founder permissions revoked successfully');
  };

  const showCofounderInvited = () => {
    showSuccessNotification('Co-founder invited successfully');
  };

  const showCofounderRemoved = () => {
    showSuccessNotification('Co-founder removed successfully');
  };

  return {
    showPermissionGranted,
    showPermissionRevoked,
    showCofounderInvited,
    showCofounderRemoved
  };
};
