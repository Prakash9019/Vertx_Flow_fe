"use client"

import { useState, useEffect } from "react"
import rectangleImage from "../../assets/Rectangle 82.png"
import QRIcon from '../../assets/QRIcon.svg';
import BackIcon from '../../assets/BackButton.svg';
import LockIcon from '../../assets/LockIcon.svg';
import DropdownIcon from '../../assets/DropdownIcon.svg';
import EarthIcon from '../../assets/EarthIcon.svg';
import CopyIcon from '../../assets/CopyIcon.svg';
import InfoIcon from '../../assets/info.svg';

function InviteAndCollab({ isOpen, onClose }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [currentView, setCurrentView] = useState('main') // 'main', 'qr', 'settings'
  const [allowEdit, setAllowEdit] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedAccess, setSelectedAccess] = useState('Only invited people')

  // Reset view when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentView('main')
      setShowDropdown(false)
    }
  }, [isOpen])

  const handleGenerateQR = () => {
    setCurrentView('qr')
    setTimeout(() => {
      setCurrentView('settings')
    }, 500)
  }

  const handleBackToMain = () => {
    setCurrentView('main')
  }

  const getContainerHeight = () => {
    switch (currentView) {
      case 'qr': return "h-[20.6rem]"
      case 'settings': return "h-[21.8rem]"
      default: return "h-[17.5rem]"
    }
  }

  const handleAccessSelect = (option) => {
    setSelectedAccess(option)
    setShowDropdown(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dimmed background overlay */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)]" onClick={onClose}></div>

      <div
        className="relative flex flex-col items-center justify-center w-[43.75rem] h-[35rem] bg-cover bg-center"
        style={{ backgroundImage: `url(${rectangleImage})` }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer hover:opacity-80 w-8 h-8 top-8 right-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M8.40002 25.6717L6.39502 23.6001L13.9617 16.0001L6.39502 8.33339L8.40002 6.26172L16.0334 13.9284L23.6 6.26172L25.605 8.33339L18.0384 16.0001L25.605 23.6001L23.6 25.6717L16.0334 18.0051L8.40002 25.6717Z"
              fill="white"
            />
          </svg>
        </button>

        {/* Header text */}
        <div className="text-center pt-8">
          <h2 className="text-white text-2xl font-semibold font-inter">
            Your target list invite link is here
          </h2>
          <p className="text-[#B8B8B8] text-center text-xs font-medium font-inter max-w-[25rem] mx-auto mt-1 leading-snug">
            You can share this link with anyone, even if they're not on Vertx yet.
          </p>
        </div>

        {/* Main container */}
        <div
          className={`w-[40rem] ${getContainerHeight()} rounded-[0.3125rem] bg-[rgba(0,0,0,0.76)] relative mt-7 transition-all duration-300`}
        >
          {/* QR Code View */}
          {currentView === 'qr' && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="mb-6">
                <img
                  src={QRIcon}
                  alt="QR Code"
                  className="w-[9.375rem] h-[9.375rem]"
                />
              </div>
              <p className="text-white text-center text-xs font-medium font-inter">
                Scan this QR to access target link
              </p>
            </div>
          )}

          {/* Settings View */}
          {currentView === 'settings' && (
            <div className="pt-6 px-8">
              {/* Back button and title */}
              <div className="flex items-center mb-3">
                <button
                  onClick={handleBackToMain}
                  className="flex items-center text-white hover:opacity-80 transition-opacity mr-3 w-6 h-6"
                >
                  <img src={BackIcon} alt="Back" className="w-full h-full" />
                </button>
                <h3 className="text-white text-base font-medium font-inter">
                  Invite settings
                </h3>
              </div>

              <p className="text-[#B8B8B8] text-[0.625rem] font-normal font-inter mb-6 leading-[1.3] text-left pl-9">
                These settings won't apply to the people directly invited, or the members of company, who currently have access.
              </p>

              {/* Who has access section */}
              <div className="mb-4">
                <h4 className="text-white text-left text-xs font-medium font-inter mb-3">
                  Who has access
                </h4>
                
                <div className="relative">
                  <div
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center justify-between cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-colors h-9 px-3 bg-[rgba(255,255,255,0.1)] rounded-[0.125rem] border border-[rgba(255,255,255,0.2)]"
                  >
                    <div className="flex items-center">
                      <img
                        src={LockIcon}
                        alt="Lock"
                        className="mr-2 w-5 h-5"
                      />
                      <span className="text-white text-[0.625rem] font-normal font-inter">
                        {selectedAccess}
                      </span>
                    </div>
                    <img src={DropdownIcon} alt="Dropdown" className="w-4 h-4" />
                  </div>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 h-[5.4375rem] rounded-[0.125rem] bg-black z-10 mt-1 py-1.5">
                      <div
                        onClick={() => handleAccessSelect('Anyone')}
                        className="flex items-center cursor-pointer transition-colors h-8 px-3 hover:bg-[#33005C]"
                      >
                        <img src={EarthIcon} alt="Earth" className="mr-2 w-5 h-5" />
                        <span className="text-white text-[0.625rem] font-normal font-inter">
                          Anyone
                        </span>
                      </div>
                      <div
                        onClick={() => handleAccessSelect('Only invited people')}
                        className="flex items-center cursor-pointer transition-colors h-8 px-3 hover:bg-[#33005C]"
                      >
                        <img src={LockIcon} alt="Lock" className="mr-2 w-5 h-5" />
                        <span className="text-white text-[0.625rem] font-normal font-inter">
                          Only invited people
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[#B8B8B8] text-[0.625rem] font-normal font-inter mt-2">
                  Only people you've directly invited can access this list.
                </p>
              </div>

              {/* Additional settings */}
              <div className="mb-4">
                <h4 className="text-white text-left text-xs font-medium font-inter mb-3">
                  Additional settings
                </h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-white text-[0.625rem] font-normal font-inter">
                    People can edit and share this target list
                  </span>
                  <button
                    onClick={() => setAllowEdit(!allowEdit)}
                    className={`relative inline-flex items-center rounded-full transition-colors w-6 h-3 ${
                      allowEdit ? 'bg-[#5F248D]' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block rounded-full bg-white transition-transform w-2 h-2 ${
                        allowEdit ? 'translate-x-[0.875rem]' : 'translate-x-[0.125rem]'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Save button */}
              <div className="flex justify-end">
                <button
                  onClick={handleBackToMain}
                  className="px-6 py-2 bg-white text-black rounded hover:bg-opacity-90 transition-colors text-sm font-medium font-inter"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Main Content View */}
          {currentView === 'main' && (
            <div className="pt-8 px-8">
              {/* Question with info icon */}
              <div className="flex items-center relative mb-4">
                <h3 className="text-white text-base font-medium font-inter mr-2">
                  Target list invite link
                </h3>
                <div
                  className="relative inline-block w-5 h-5 flex-shrink-0"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <img src={InfoIcon} alt="Info" className="cursor-pointer w-5 h-5" />
                  {showTooltip && (
                    <div
                      className="absolute z-[9999] pointer-events-none top-[calc(100%-1.1rem)] translate-x-[15%] w-48 max-w-48 bg-[#0F0E16] rounded border border-[rgba(255,255,255,0.1)] shadow-md whitespace-normal overflow-wrap-break-word word-break-break-word"
                    >
                      <div className="text-[#B8B8B8] text-[0.5rem] font-normal font-inter px-4 py-[0.81rem] leading-[1.2]">
                        Your target list, invite link, investor details, and related information are private. They'll only be visible if you share your InviteLink.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* URL Input Container */}
              <div className="relative mb-4 flex gap-2">
                <div className="relative rounded-[0.125rem] bg-[rgba(255,255,255,0.11)] px-4 py-2 flex-1 h-9">
                  <div className="flex items-center justify-between h-full">
                    <span className="text-white text-xs font-normal font-inter flex-1">
                      https://flow.govertx.com/targetlist/invite/abc123efgyurfhrvg
                    </span>
                    
                    {/* Copy icon */}
                    <button className="flex items-center justify-center hover:opacity-80 transition-colors w-[1.125rem] h-[1.125rem] bg-transparent border-none cursor-pointer">
                      <img src={CopyIcon} alt="Copy" className="w-[1.125rem] h-[1.125rem]" />
                    </button>
                  </div>
                </div>

                {/* Generate QR button */}
                <button
                  onClick={handleGenerateQR}
                  className="flex items-center justify-center gap-1 hover:opacity-80 transition-colors w-28 h-9 bg-[rgba(255,255,255,0.11)] rounded-[0.125rem] border-none cursor-pointer"
                >
                  <img src={QRIcon} alt="QR Icon" className="w-4 h-4" />
                  <span className="text-[#B8B8B8] text-[0.625rem] font-normal font-inter">
                    Generate QR
                  </span>
                </button>
              </div>

              {/* Email input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Emails, comma separated"
                  className="flex-1 px-4 py-2 rounded-[0.125rem] border-none outline-none h-9 bg-[rgba(255,255,255,0.11)] text-[#B8B8B8] text-xs font-normal font-inter"
                />
                <button
                  className="flex items-center justify-center hover:opacity-80 transition-colors w-28 h-9 bg-white rounded-[0.125rem] border-none cursor-pointer"
                >
                  <span className="text-black text-center text-sm font-medium font-inter">
                    Invite
                  </span>
                </button>
              </div>

              {/* Who has access section */}
              <div>
                <h4 className="text-[#B8B8B8] text-left text-xs font-medium font-inter mb-2">
                  Who has access
                </h4>
                <div className="flex items-center justify-between cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-colors rounded py-2">
                  <div className="flex items-center">
                    <img src={LockIcon} alt="Lock" className="mr-2 w-5 h-5" />
                    <span className="text-white text-center text-sm font-medium font-inter">
                      Only those invited
                    </span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                    <path d="M6 4L10 8L6 12" stroke="#FFF" strokeWidth="1" fill="none"/>
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InviteAndCollab