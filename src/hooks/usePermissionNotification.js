import { useContext } from 'react';
import { PermissionNotificationContext } from '../context/PermissionNotificationContext.js';

// Custom hook to use the notification context
export const usePermissionNotification = () => {
  const context = useContext(PermissionNotificationContext);
  if (!context) {
    throw new Error('usePermissionNotification must be used within a PermissionNotificationProvider');
  }
  return context;
};

// Custom hook for checking permissions with automatic notification
export const usePermissionCheck = () => {
  const { showPermissionDenied } = usePermissionNotification();

  const checkPermission = (hasPermission, action = null, customMessage = null) => {
    if (!hasPermission) {
      const message = customMessage || 
        (action ? `You don't have permission to ${action}` : "You don't have access from founder");
      showPermissionDenied(message);
      return false;
    }
    return true;
  };

  return { checkPermission };
};
