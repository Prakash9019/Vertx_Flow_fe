import React, { useState } from 'react';
import { PermissionNotificationContext } from './PermissionNotificationContext.js';

// Provider component
export const PermissionNotificationProvider = ({ children }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('error'); // 'error' or 'success'

  const showPermissionDenied = (customMessage = "You don't have access from founder") => {
    setNotificationMessage(customMessage);
    setNotificationType('error');
    setShowNotification(true);
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 4000);
  };

  const showSuccessNotification = (message) => {
    setNotificationMessage(message);
    setNotificationType('success');
    setShowNotification(true);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const hideNotification = () => {
    setShowNotification(false);
  };
  return (
    <PermissionNotificationContext.Provider 
      value={{ 
        showNotification,
        notificationMessage,
        notificationType,
        showPermissionDenied,
        showSuccessNotification,
        hideNotification
      }}
    >
      {children}
        {/* Sliding Notification Component */}
      <div
        className={`fixed top-4 right-4 z-[100] transition-all duration-300 ease-in-out ${
          showNotification ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className={`w-[18rem] h-[3.5rem] rounded-[0.375rem] border bg-[#1F1624] flex items-center justify-between px-4 py-3 shadow-lg ${
          notificationType === 'success' 
            ? 'border-[#0E8D07]' 
            : 'border-[#DE2D2D]'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              notificationType === 'success' 
                ? 'bg-[#0E8D07]' 
                : 'bg-[#DE2D2D]'
            }`}>
              {notificationType === 'success' ? (
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="text-white font-inter text-sm font-medium">
              {notificationMessage}
            </span>
          </div>
          <button
            className={`w-[3rem] h-[1.5rem] rounded-[0.125rem] text-white text-[0.625rem] font-semibold flex items-center justify-center transition-colors ${
              notificationType === 'success'
                ? 'bg-[#0E8D07] hover:bg-[#0C7A06]'
                : 'bg-[#DE2D2D] hover:bg-[#C82828]'
            }`}
            onClick={hideNotification}
          >
            Close
          </button>
        </div>
      </div>
    </PermissionNotificationContext.Provider>
  );
};
