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
    // After 3 seconds, show the settings view
    setTimeout(() => {
      setCurrentView('settings')
    }, 500)
  }

  const handleBackToMain = () => {
    setCurrentView('main')
  }

  const getContainerHeight = () => {
    switch (currentView) {
      case 'qr': return "20.6rem"
      case 'settings': return "21.8rem"
      default: return "17.5rem"
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
      <div className="absolute inset-0 bg-black" style={{ opacity: 0.7 }} onClick={onClose}></div>

      <div
        className="relative flex flex-col items-center justify-center"
        style={{
          width: "43.75rem",
          height: "35rem",
          backgroundImage: `url(${rectangleImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer hover:opacity-80"
          style={{
            top: "2rem",
            right: "2rem",
            width: "2rem",
            height: "2rem",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M8.40002 25.6717L6.39502 23.6001L13.9617 16.0001L6.39502 8.33339L8.40002 6.26172L16.0334 13.9284L23.6 6.26172L25.605 8.33339L18.0384 16.0001L25.605 23.6001L23.6 25.6717L16.0334 18.0051L8.40002 25.6717Z"
              fill="white"
            />
          </svg>
        </button>

        {/* Header text */}
        <div className="text-center" style={{ paddingTop: "2.0rem" }}>
          <h2
            className="text-white"
            style={{
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "1.5rem",
              fontWeight: 600,
            }}
          >
            Your target list invite link is here
          </h2>
          <p
            style={{
              color: "#B8B8B8",
              textAlign: "center",
              fontFamily: "Inter",
              fontSize: "0.75rem",
              fontWeight: 500,
              maxWidth: "25rem",
              margin: "0 auto",
              marginTop: "0.25rem",
              lineHeight: "1.1",
            }}
          >
            You can share this link with anyone, even if they're not on Vertx yet.
          </p>
        </div>

        {/* Main container */}
        <div
          style={{
            width: "40rem",
            height: getContainerHeight(),
            borderRadius: "0.3125rem",
            background: "rgba(0, 0, 0, 0.76)",
            position: "relative",
            marginTop: "1.87rem",
            transition: "height 0.3s ease-in-out",
          }}
        >
          {/* QR Code View */}
          {currentView === 'qr' && (
            <div className="flex flex-col items-center justify-center h-full">


<div className="mb-6">
  {/* QR Code */}
  <img
    src={QRIcon}
    alt="QR Code"
    className="w-[150px] h-[150px]"
    style={{ width: "9.375rem", height: "9.375rem" }}
  />
</div>

              <p
                style={{
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "Inter",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}
              >
                Scan this QR to access target link
              </p>
            </div>
          )}

          {/* Settings View */}
          {currentView === 'settings' && (
            <div style={{ paddingTop: "1.5rem", paddingLeft: "2rem", paddingRight: "2rem" }}>
              {/* Back button and title */}
              <div className="flex items-center mb-3">


<button
  onClick={handleBackToMain}
  className="flex items-center text-white hover:opacity-80 transition-opacity mr-3"
  style={{
    width: "1.5rem",
    height: "1.5rem",
  }}
>
  <img
    src={BackIcon}
    alt="Back"
    className="w-full h-full"
  />
</button>

                <h3
                  style={{
                    color: "#FFF",
                    fontFamily: "Inter",
                    fontSize: "1rem",
                    fontWeight: 500,
                  }}
                >
                  Invite settings
                </h3>
              </div>

              <p
                style={{
                  color: "#B8B8B8",
                  fontFamily: "Inter",
                  fontSize: "0.625rem",
                  fontWeight: 400,
                  marginBottom: "1.5rem",
                  lineHeight: "1.3",
                  textAlign: "left",
                  paddingLeft:'2.2rem'
                }}
              >
                These settings won't apply to the people directly invited, or the members of company, who currently have access.
              </p>

              {/* Who has access section */}
              <div className="mb-4">
                <h4
                  style={{
                    color: "#FFF",
                    textAlign: "left",
                    fontFamily: "Inter",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    marginBottom: "0.75rem",
                  }}
                >
                  Who has access
                </h4>
                
                <div className="relative">
                  <div
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center justify-between cursor-pointer hover:bg-opacity-10 hover:bg-white transition-colors"
                    style={{
                      height: "2.25rem",
                      padding: "0 0.75rem",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "0.125rem",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >


<div className="flex items-center">
  <img
    src={LockIcon}
    alt="Lock"
    className="mr-2"
    style={{ width: "1.25rem", height: "1.25rem" }}
  />
  <span
    style={{
      color: "#FFF",
      fontFamily: "Inter",
      fontSize: "0.625rem",
      fontWeight: 400,
    }}
  >
    {selectedAccess}
  </span>
</div>



<img
  src={DropdownIcon}
  alt="Dropdown"
  style={{ width: "1rem", height: "1rem" }}
/>

                  </div>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        height: "5.4375rem",
                        borderRadius: "0.125rem",
                        background: "#000",
                        zIndex: 10,
                        marginTop: "0.25rem",
                        paddingTop: "0.375rem",
                        paddingBottom: "0.375rem",
                      }}
                    >
                      <div
                        onClick={() => handleAccessSelect('Anyone')}
                        className="flex items-center cursor-pointer transition-colors"
                        style={{
                          height: "2rem",
                          padding: "0 0.75rem",
                          background: "transparent",
                        }}
                        onMouseEnter={(e) => e.target.style.background = "#33005C"}
                        onMouseLeave={(e) => e.target.style.background = "transparent"}
                      >


<img
  src={EarthIcon}
  alt="Earth"
  className="mr-2"
  style={{ width: "1.25rem", height: "1.25rem" }}
/>

                        <span
                          style={{
                            color: "#FFF",
                            fontFamily: "Inter",
                            fontSize: "0.625rem",
                            fontWeight: 400,
                          }}
                        >
                          Anyone
                        </span>
                      </div>
                      <div
                        onClick={() => handleAccessSelect('Only invited people')}
                        className="flex items-center cursor-pointer transition-colors"
                        style={{
                          height: "2rem",
                          padding: "0 0.75rem",
                          background: "transparent",
                        }}
                        onMouseEnter={(e) => e.target.style.background = "#33005C"}
                        onMouseLeave={(e) => e.target.style.background = "transparent"}
                      >

<img
  src={LockIcon}
  alt="Lock"
  className="mr-2"
  style={{ width: "1.25rem", height: "1.25rem" }}
/>

                        <span
                          style={{
                            color: "#FFF",
                            fontFamily: "Inter",
                            fontSize: "0.625rem",
                            fontWeight: 400,
                          }}
                        >
                          Only invited people
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <p
                  style={{
                    color: "#B8B8B8",
                    fontFamily: "Inter",
                    fontSize: "0.625rem",
                    fontWeight: 400,
                    marginTop: "0.5rem",
                  }}
                >
                  Only people you've directly invited can access this list.
                </p>
              </div>

              {/* Additional settings */}
              <div className="mb-4">
                <h4
                  style={{
                    color: "#FFF",
                    textAlign: "left",
                    fontFamily: "Inter",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    marginBottom: "0.75rem",
                  }}
                >
                  Additional settings
                </h4>
                
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      color: "#FFF",
                      fontFamily: "Inter",
                      fontSize: "0.625rem",
                      fontWeight: 400,
                    }}
                  >
                    People can edit and share this target list
                  </span>
                  <button
                    onClick={() => setAllowEdit(!allowEdit)}
                    className={`relative inline-flex items-center rounded-full transition-colors ${
                      allowEdit ? 'bg-[#5F248D]' : 'bg-gray-600'
                    }`}
                    style={{
                      width: "1.5rem",
                      height: "0.75rem",
                    }}
                  >
                    <span
                      className={`inline-block rounded-full bg-white transition-transform`}
                      style={{
                        width: "0.5rem",
                        height: "0.5rem",
                        transform: allowEdit ? 'translateX(0.875rem)' : 'translateX(0.125rem)',
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* Save button */}
              <div className="flex justify-end">
                <button
                  onClick={handleBackToMain}
                  className="px-6 py-2 bg-white text-black rounded hover:bg-opacity-90 transition-colors"
                  style={{
                    fontFamily: "Inter",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Main Content View */}
          {currentView === 'main' && (
            <div style={{ paddingTop: "2rem", paddingLeft: "2rem", paddingRight: "2rem" }}>
              {/* Question with info icon */}
              <div className="flex items-center relative mb-4">
                <h3
                  style={{
                    color: "#FFF",
                    fontFamily: "Inter",
                    fontSize: "1rem",
                    fontWeight: 500,
                    marginRight: "0.5rem",
                  }}
                >
                  Target list invite link
                </h3>
                <div
                  className="relative inline-block"
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    flexShrink: 0,
                  }}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >


<img
  src={InfoIcon}
  alt="Info"
  className="cursor-pointer"
  style={{ width: "20px", height: "20px" }}
/>


                  {showTooltip && (
                    <div
                      className="absolute z-[9999] pointer-events-none"
                      style={{
                        top: "calc(100% - 1.1rem)",
                        transform: "translateX(15%)",
                        width: "12rem",
                        maxWidth: "12rem",
                        background: "#0F0E16",
                        borderRadius: "0.25rem",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                    >
                      <div
                        style={{
                          color: "#B8B8B8",
                          fontFamily: "Inter",
                          fontSize: "0.5rem",
                          fontWeight: 400,
                          padding: "0.81rem 1rem",
                          lineHeight: "1.2",
                        }}
                      >
                        Your target list, invite link, investor details, and related information are private. They'll only be visible if you share your InviteLink.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* URL Input Container */}
              <div className="relative mb-4 flex gap-2">
                <div
                  className="relative rounded-[0.125rem] bg-[rgba(255,255,255,0.11)] px-4 py-2 flex-1"
                  style={{
                    height: "2.25rem",
                  }}
                >
                  <div className="flex items-center justify-between h-full">
                    <span
                      style={{
                        color: "#FFF",
                        fontFamily: "Inter",
                        fontSize: "0.75rem",
                        fontWeight: 400,
                        flex: 1,
                      }}
                    >
                      https://flow.govertx.com/targetlist/invite/abc123efgyurfhrvg
                    </span>
                    
                    {/* Copy icon */}
                 

<button
  className="flex items-center justify-center hover:bg-opacity-80 transition-colors"
  style={{
    width: "1.125rem",
    height: "1.125rem",
    background: "transparent",
    border: "none",
    cursor: "pointer",
  }}
>
  <img
    src={CopyIcon}
    alt="Copy"
    style={{ width: "1.125rem", height: "1.125rem" }}
  />
</button>

                  </div>
                </div>

                {/* Generate QR button */}
                <button
                  onClick={handleGenerateQR}
                  className="flex items-center justify-center gap-1 hover:bg-opacity-80 transition-colors"
                  style={{
                    width: "7rem",
                    height: "2.25rem",
                    background: "rgba(255, 255, 255, 0.11)",
                    borderRadius: "0.125rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >


<img
  src={QRIcon}
  alt="QR Icon"
  style={{ width: "1rem", height: "1rem" }}
/>

                  <span
                    style={{
                      color: "#B8B8B8",
                      fontFamily: "Inter",
                      fontSize: "0.625rem",
                      fontWeight: 400,
                    }}
                  >
                    Generate QR
                  </span>
                </button>
              </div>

              {/* Email input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Emails, comma separated"
                  className="flex-1 px-4 py-2 rounded-[0.125rem] border-none outline-none"
                  style={{
                    height: "2.25rem",
                    background: "rgba(255, 255, 255, 0.11)",
                    color: "#B8B8B8",
                    fontFamily: "Inter",
                    fontSize: "0.75rem",
                    fontWeight: 400,
                  }}
                />
                <button
                  className="flex items-center justify-center hover:bg-opacity-80 transition-colors"
                  style={{
                    width: "7rem",
                    height: "2.25rem",
                    background: "#FFF",
                    borderRadius: "0.125rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      color: "#000",
                      textAlign: "center",
                      fontFamily: "Inter",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    Invite
                  </span>
                </button>
              </div>

              {/* Who has access section */}
              <div>
                <h4
                  style={{
                    color: "#B8B8B8",
                    textAlign: "left",
                    fontFamily: "Inter",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    marginBottom: "0.5rem",
                  }}
                >
                  Who has access
                </h4>
                <div
                  className="flex items-center justify-between cursor-pointer hover:bg-opacity-80 transition-colors rounded"
                  style={{ padding: "0.5rem 0" }}
                >


<div className="flex items-center">
  <img
    src={LockIcon}
    alt="Lock"
    className="mr-2"
    style={{ width: "1.25rem", height: "1.25rem" }}
  />
  <span
    style={{
      color: "#FFF",
      textAlign: "center",
      fontFamily: "Inter",
      fontSize: "0.875rem",
      fontWeight: 500,
    }}
  >
    Only those invited
  </span>
</div>

                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: "1rem", height: "1rem"}}>
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