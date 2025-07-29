// LinkLiveModal.jsx
import React, { useState } from 'react';
import BgImg from "../../assets/Rectangle 82.png";
import { toast } from "react-toastify";

export default function LinkLiveModal({ isOpen, onClose, reachLink }) {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(reachLink)
      .then(() => {
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
        toast.error('Failed to copy link');
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 cursor-pointer" onClick={onClose} />
      <div
        className="relative w-full max-w-lg p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-center"
        style={{
          backgroundImage: `url(${BgImg})`, // Use the confetti image as background
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-2xl font-semibold bg-transparent border-none cursor-pointer"
        >
          &times;
        </button>

        <h2 className="text-white text-3xl font-bold mb-8 mt-10 font-['Inter']">
          Your link is live!
        </h2>

        {/* Reachlink container */}
        <div className="bg-black/80 p-4 rounded-md w-full max-w-md flex flex-col items-center justify-center space-y-4">
          <p className="text-white text-sm font-['Inter']">Here is your Reachlink</p>
          <div className="flex items-center w-full bg-white/11 rounded-[0.125rem] pr-2">
            <input
              type="text"
              value={reachLink}
              readOnly
              className="flex-grow bg-transparent text-white outline-none px-4 py-2 font-['Inter'] text-xs font-normal"
            />
            {/* Copy button with functionality */}
            <button 
              onClick={handleCopyLink}
              className="p-2 text-white hover:text-gray-300"
              title="Copy to clipboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={copied ? "#4ADE80" : "currentColor"}
                className="w-4 h-4"
              >
                {copied ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25v2.25A2.25 2.25 0 0 1 13.5 22h-2.25a2.25 2.25 0 0 1-2.25-2.25V17.25m10.5-5.25v-2.25a2.25 2.25 0 0 0-2.25-2.25H13.5m-10.5 0V7.5A2.25 2.25 0 0 1 5.25 5.25h2.25m10.5 6L12 17.25l-3.75-6m5.625-5.625a.375.375 0 1 0 0-.75.375.375 0 0 0 0 .75Zm-4.5 0a.375.375 0 1 0 0-.75.375.375 0 0 0 0 .75ZM12 12.75a.375.375 0 1 0 0-.75.375.375 0 0 0 0 .75Z"
                  />
                )}
              </svg>
            </button>
            <button 
              onClick={() => {
                onClose();
                // The parent component will need to handle reopening the form
                // This is typically done by setting showModal to true in the Reach component
              }}
              className="bg-white text-black px-4 py-2 rounded-[0.125rem] font-['Inter'] text-xs font-medium hover:bg-gray-200 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}