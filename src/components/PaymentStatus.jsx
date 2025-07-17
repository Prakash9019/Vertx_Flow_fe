import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentStatus = ({ status, details, onClose }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to homepage after countdown
          navigate('/homepage');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Clean up timer
    return () => clearInterval(timer);
  }, [navigate]);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="bg-[#0F0E16] rounded-lg p-8 max-w-md w-full shadow-lg border border-[#33005C]">
        <div className="flex flex-col items-center">
          {/* Status Icon */}
          {status === 'success' ? (
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          )}
          
          {/* Status Title */}
          <h2 className="text-2xl font-bold text-white mb-2">
            {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
          </h2>
          
          {/* Status Message */}
          <p className="text-gray-300 text-center mb-4">
            {status === 'success' 
              ? 'Your subscription has been activated successfully.' 
              : 'There was an issue processing your payment.'}
          </p>
          
          {/* Payment Details */}
          {details && (
            <div className="w-full bg-black bg-opacity-50 rounded-md p-4 mb-6">
              {details.planName && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Plan:</span>
                  <span className="text-white font-medium">{details.planName}</span>
                </div>
              )}
              {details.amount && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-medium">${details.amount}</span>
                </div>
              )}
              {details.billingCycle && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Billing:</span>
                  <span className="text-white font-medium">{details.billingCycle}</span>
                </div>
              )}
              {details.transactionId && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Transaction ID:</span>
                  <span className="text-white font-medium">{details.transactionId}</span>
                </div>
              )}
              {details.invoiceNumber && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Invoice Number:</span>
                  <span className="text-white font-medium">{details.invoiceNumber}</span>
                </div>
              )}
              {details.expiryDate && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Valid Until:</span>
                  <span className="text-white font-medium">{new Date(details.expiryDate).toLocaleDateString()}</span>
                </div>
              )}
              {details.error && (
                <div className="flex justify-between mt-2 text-red-400">
                  <span className="font-medium">Error:</span>
                  <span className="text-right">{details.error}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Countdown */}
          <p className="text-gray-400 text-sm">
            Redirecting to homepage in {countdown} seconds...
          </p>
          
          {/* Close Button */}
          <button
            onClick={() => navigate('/homepage')}
            className="mt-6 bg-[#5F248D] text-white py-2 px-6 rounded-md hover:bg-[#33005C] transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;