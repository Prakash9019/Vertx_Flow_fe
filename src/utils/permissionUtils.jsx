import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

// Higher-Order Component to wrap any element with permission checks
export const withPermissionCheck = (WrappedComponent, permissionType = 'create', customMessage = null) => {
  return function PermissionCheckedComponent(props) {
    const { hasFullAccess, checkPermissionWithNotification } = usePermissions();
    
    const handleClick = (originalHandler) => {
      return (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        if (checkPermissionWithNotification(permissionType, customMessage)) {
          if (originalHandler) {
            originalHandler(event);
          }
        }
      };
    };

    // If no permission, disable the component and add click handler
    if (!hasFullAccess) {
      const newProps = {
        ...props,
        onClick: handleClick(props.onClick),
        onSubmit: props.onSubmit ? handleClick(props.onSubmit) : undefined,
        disabled: props.disabled !== undefined ? true : undefined,
        className: props.className ? `${props.className} cursor-not-allowed opacity-75` : 'cursor-not-allowed opacity-75'
      };
      
      return <WrappedComponent {...newProps} />;
    }

    // If has permission, render normally
    return <WrappedComponent {...props} />;
  };
};

// Simple function to check and handle permissions manually
export const handleWithPermission = (action, hasFullAccess, checkPermissionWithNotification, permissionType = 'perform this action', customMessage = null) => {
  if (!hasFullAccess) {
    checkPermissionWithNotification(permissionType, customMessage);
    return false;
  }
  
  if (action && typeof action === 'function') {
    action();
  }
  return true;
};

// Hook to get a permission-checked handler function
export const usePermissionHandler = () => {
  const { hasFullAccess, checkPermissionWithNotification } = usePermissions();
  
  const withPermission = (callback, permissionType = 'perform this action', customMessage = null) => {
    return (...args) => {
      if (checkPermissionWithNotification(permissionType, customMessage)) {
        return callback(...args);
      }
    };
  };

  return { withPermission, hasFullAccess };
};
