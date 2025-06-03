"use client"

import { useState } from "react"
import AddInvestorsPopup from './AddInvestorsPopup'


// SOLUTION 1: Proper ES6 import (recommended)
import rectangleImage from "../assets/Rectangle 82.png"
import rectangleImage2 from "../assets/Rectangle 119.png"

// Alternative if above doesnAddInvestorsPopup
// const rectangleImage = require("../assets/Rectangle 82.png");

function NewListPopup({ isOpen, onClose, onSave }) {
  const [listName, setListName] = useState("")
  const [selectedCover, setSelectedCover] = useState("")

  const coverOptions = [
    { id: "default", color: "#0F0E16", border: "1px dashed #5F248D" },
    { id: "purple", color: "linear-gradient(180deg, #6C04BF 0%, #456BBD 100%)" },
    { id: "orange", color: "linear-gradient(0deg, #AF4F00 0%, #CC8D03 100%)" },
    { id: "pink", color: "linear-gradient(180deg, #FC6848 0%, #AD6FDE 100%)" },
    { id: "red", color: "linear-gradient(180deg, #AF4F00 0%, #FC4141 100%)" },
  ]

  const handleSave = () => {
    if (listName.trim()) {
      onSave({ name: listName, cover: selectedCover })
      setListName("")
      setSelectedCover("")
      onClose()
    }
  }

  const handleCancel = () => {
    setListName("")
    setSelectedCover("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dimmed background overlay */}
      <div className="absolute inset-0 bg-black" style={{ opacity: 0.7 }} onClick={handleCancel}></div>

      <div
        className="relative flex flex-col items-center justify-center"
        style={{
          width: "43.75rem",
          height: "35rem",
          backgroundImage: `url(${rectangleImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Header text */}
        <div className="text-center" style={{ paddingTop: "2.0rem" }}>
          <h2
            className="text-white"
            style={{
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            Let's create a new target list.
          </h2>
          <p
            style={{
              color: "#B8B8B8",
              textAlign: "center",
              fontFamily: "Inter",
              fontSize: "0.75rem",
              fontWeight: 400,
              maxWidth: "25rem",
              margin: "0 auto",
              lineHeight: "1.4",
            }}
          >
            A target list is a curated set of investors for your fundraise.
            <br />
            You can edit and share it anytime, unless it was created by Vertx.
          </p>
        </div>

        {/* Main container */}
        <div
          style={{
            width: "40rem",
            height: "18.75rem",
            borderRadius: "0.3125rem",
            background: "rgba(0, 0, 0, 0.76)",
            position: "relative",
            marginTop: "1.87rem",
            padding: "2rem",
          }}
        >
          {/* Name the target list section */}
          <div style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "1rem",
                fontWeight: 500,
                marginBottom: "1rem",
              }}
            >
              Name the target list
            </h3>

            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Enter the name of the target list..."
              className="w-full bg-transparent text-white outline-none rounded-[0.125rem] px-4 py-2"
              style={{
                width: "36rem",
                height: "2.25rem",
                background: "rgba(255, 255, 255, 0.11)",
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "0.75rem",
                fontWeight: 400,
                border: "none",
                "::placeholder": {
                  color: "#656565",
                  fontFamily: "Inter",
                  fontSize: "0.75rem",
                  fontWeight: 400,
                },
              }}
            />
            <style jsx>{`
              input::placeholder {
                color: #656565 !important;
                font-family: Inter !important;
                font-size: 0.75rem !important;
                font-weight: 400 !important;
              }
            `}</style>
          </div>

          {/* Choose the cover section */}
          <div style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "1rem",
                fontWeight: 500,
                marginBottom: "1rem",
              }}
            >
              Choose the cover
            </h3>

            <div className="flex gap-3">
              {coverOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSelectedCover(option.id)}
                  className="cursor-pointer transition-transform hover:scale-105"
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "0.125rem",
                    background: option.color,
                    border:
                      option.id === "default" ? option.border : selectedCover === option.id ? "2px solid #FFF" : "",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {option.id === "default" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 4V12M4 8H12" stroke="#5F248D" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Buttons - positioned on right side */}
          <div
            className="flex justify-end items-center gap-2"
            style={{ position: "absolute", right: "2rem", bottom: "2rem" }}
          >
            <button
              onClick={handleCancel}
              className="text-white transition-colors hover:bg-gray-500"
              style={{
                width: "5rem",
                height: "2rem",
                background: "rgba(255, 255, 255, 0.20)",
                borderRadius: "0.125rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "Inter",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Cancel
              </span>
            </button>

            <button
              onClick={handleSave}
              disabled={!listName.trim()}
              className="transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                width: "5rem",
                height: "2rem",
                borderRadius: "0.125rem",
                background: "#FFF",
                border: "none",
                cursor: listName.trim() ? "pointer" : "not-allowed",
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
                Save
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ThreeDotsMenu({ isOpen, onClose, listId, isVertxCreated = false }) {
  const menuOptions = [
    { id: "edit", label: "Edit name", icon: "✏️" },
    { id: "delete", label: "Delete target list", icon: "🗑️" },
    { id: "share", label: "Share target list", icon: "📤", disabled: false },
    { id: "reach", label: "Add list to Reach", icon: "➕", disabled: false },
    { id: "pipeline", label: "Add to pipeline", icon: "💰", disabled: false },
  ]

  if (!isOpen) return null

  return (
    <div
      className="absolute z-50"
      style={{
        top: "100%",
        right: "0",
        marginTop: "0.5rem",
        width: "8.0625rem",
        height: "7.75rem",
        borderRadius: "0.25rem",
        border: "1px solid #0F0E16",
        background: "#000",
        padding: "0.25rem",
      }}
    >
      {menuOptions.map((option) => (
        <div
          key={option.id}
          className={`flex items-center gap-2 px-2 py-1 cursor-pointer transition-all ${option.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-900"}`}
          style={{
            width: "7.9375rem",
            height: "1.25rem",
            color: "#B8B8B8",
            fontFamily: "Inter",
            fontSize: "0.5rem",
            fontWeight: 400,
            borderRadius: "0.125rem",
          }}
          onMouseEnter={(e) => {
            if (!option.disabled) {
              e.target.style.color = "#FFF"
              e.target.style.background = "#33005C"
            }
          }}
          onMouseLeave={(e) => {
            if (!option.disabled) {
              e.target.style.color = "#B8B8B8"
              e.target.style.background = "transparent"
            }
          }}
          onClick={() => {
            if (!option.disabled) {
              console.log(`${option.label} clicked for list ${listId}`)
              onClose()
            }
          }}
        >
          <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor">
            <rect width="16" height="16" rx="2" />
          </svg>
          <span>{option.label}</span>
        </div>
      ))}
    </div>
  )
}

function Target({ onListSelect }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewListPopupOpen, setIsNewListPopupOpen] = useState(false)
  const [isAddInvestorsPopupOpen, setIsAddInvestorsPopupOpen] = useState(false) // Add this state
  const [userTargetLists, setUserTargetLists] = useState([])
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [selectedList, setSelectedList] = useState(null)

  const coverOptions = {
    default: "#0F0E16",
    purple: "linear-gradient(180deg, #6C04BF 0%, #456BBD 100%)",
    orange: "linear-gradient(0deg, #AF4F00 0%, #CC8D03 100%)",
    pink: "linear-gradient(180deg, #FC6848 0%, #AD6FDE 100%)",
    red: "linear-gradient(180deg, #AF4F00 0%, #FC4141 100%)",
  }

  const handleNewListClick = () => {
    setIsNewListPopupOpen(true)
  }

  const handleNewListSave = (listData) => {
    const newList = {
      id: Date.now(),
      name: listData.name,
      cover: listData.cover,
      createdBy: "Company",
      createdDate: new Date().toLocaleDateString("en-GB"),
      updatedDate: "Updated today",
      investorCount: 0,
    }

    setUserTargetLists((prev) => [...prev, newList])
    console.log("New list created:", newList)
  }

  const handleThreeDotsClick = (e, listId) => {
    e.stopPropagation()
    setActiveMenuId(activeMenuId === listId ? null : listId)
  }

  const closeMenu = () => {
    setActiveMenuId(null)
  }

  const handleListClick = (list) => {
    setSelectedList(list)
    if (onListSelect) {
      onListSelect(true)
    }
  }

  const handleBackClick = () => {
    setSelectedList(null)
    if (onListSelect) {
      onListSelect(false)
    }
  }

  // Add this handler for the Add Investors button
  const handleAddInvestorsClick = () => {
    setIsAddInvestorsPopupOpen(true)
  }

  const getCurrentDate = () => {
    const today = new Date()
    return today.toLocaleDateString("en-GB")
  }

  // If a list is selected, show the detail view
  if (selectedList) {
    return (
      <div style={{ paddingTop: "3rem", minHeight: "calc(100vh - 4rem)", background: "#000", paddingBottom: "1rem"}}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8" style={{ paddingLeft: '4rem', paddingRight: '4rem' }}>
          <div className="flex flex-col">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 transition-colors hover:text-gray-300 mb-4"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "1rem",
                fontWeight: 500,
                alignSelf: "flex-start",
                marginLeft: "-2rem", // This creates the 2rem gap from left edge
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ width: "1.5rem", height: "1.5rem" }}
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <div className="flex items-center gap-3">
              <h1
                style={{
                  color: "#FFF",
                  fontFamily: "Inter",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {selectedList.name}
              </h1>
              <div
                className="flex items-center justify-center"
                style={{
                  width: "5.25rem",
                  height: "1.3125rem",
                  borderRadius: "6.25rem",
                  background: "#33005C",
                  color: "#FFF",
                  fontFamily: "Inter",
                  fontSize: "0.5rem",
                  fontWeight: 600,
                }}
              >
                {selectedList.investorCount} INVESTORS
              </div>
            </div>
          </div>

          {/* Three dots menu */}
          <div className="relative">
            <button
              onClick={(e) => handleThreeDotsClick(e, selectedList.id)}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
              style={{ color: "#B8B8B8" }}
            >
              <svg width="28" height="28" viewBox="0 0 16 16" fill="currentColor" style={{ width: "1.75rem", height: "1.75rem" }}>
                <circle cx="8" cy="2" r="1.5" />
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="8" cy="14" r="1.5" />
              </svg>
            </button>
            <ThreeDotsMenu
              isOpen={activeMenuId === selectedList.id}
              onClose={closeMenu}
              listId={selectedList.id}
              isVertxCreated={selectedList.createdBy === "VERTX"}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div
          style={{
            width: "calc(100% - 8rem)",
            height: "calc(100vh - 14rem)",
            borderRadius: "0.5rem",
            background: "#0F0E16",
            position: "relative",
            padding: "2.5rem",
            marginLeft: "4rem",
            marginRight: "4rem",
          }}
        >
{/* Image Placeholder */}
<div
  style={{
    width: "100%",
    height: "calc(100% - 6rem)",
    backgroundImage: `url(${rectangleImage2})`,
    backgroundSize: "100% 100%", // ✅ Stretch in both directions
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    borderRadius: "0.5rem",
    marginBottom: "4.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2rem",
  }}
>

            {/* Empty State Message */}
            <h2
              style={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "1.25rem",
                fontWeight: 600,
                margin: 0,
              }}
            >
              No investors are in this list.
            </h2>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleAddInvestorsClick} // Updated to use the new handler
                className="flex items-center justify-center gap-2 transition-colors hover:bg-purple-700"
                style={{
                  width: "10rem",
                  height: "2.5rem",
                  borderRadius: "0.25rem",
                  background: "#5F248D",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  style={{ width: "1.125rem", height: "1.125rem" }}
                >
                  <path d="M9 4.5V13.5M4.5 9H13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span
                  style={{
                    color: "#FFF",
                    fontFamily: "Inter",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  Add Investors
                </span>
              </button>

              <button
                className="flex items-center justify-center gap-2 transition-colors hover:bg-gray-100"
                style={{
                  width: "11.25rem",
                  height: "2.5rem",
                  borderRadius: "0.25rem",
                  background: "#FFF",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  style={{ width: "1.125rem", height: "1.125rem" }}
                >
                  <path
                    d="M11.8125 6.1875L14.625 9L11.8125 11.8125M14.625 9H3.375"
                    stroke="#000"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  style={{
                    color: "#000",
                    fontFamily: "Inter",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  Invite and Collab
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Info and Pagination Container */}
          <div className="flex items-center justify-between ">
            {/* Bottom Info Container */}
            <div
              className="flex items-center justify-center"
              style={{
                width: "8.43944rem",
                height: "1.875rem",
                borderRadius: "0.125rem",
                background: "#000",
                color: "#B8B8B8",
                fontFamily: "Inter",
                fontSize: "0.5rem",
                fontWeight: 400,
              }}
            >
              0 results found | 10 per page
            </div>

            {/* Pagination */}
            <div
              className="flex items-center gap-2"
              style={{
                color: "#B8B8B8",
                fontFamily: "Inter",
                fontSize: "0.5rem",
                fontWeight: 400,
              }}
            >
              <button
                style={{
                  width: "1.02081rem",
                  height: "1rem",
                  borderRadius: "0.125rem",
                  background: "rgba(51, 0, 92, 0.35)",
                  border: "none",
                  color: "#353535",
                  fontFamily: "Inter",
                  fontSize: "0.5rem",
                  fontWeight: 700,
                  cursor: "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                &lt;
              </button>
              <span>Page</span>
              <span
                style={{
                  width: "1.40363rem",
                  height: "1rem",
                  borderRadius: "0.125rem",
                  background: "#33005C",
                  color: "#AD6FDE",
                  fontFamily: "Inter",
                  fontSize: "0.5rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                000
              </span>
              <span>of 0</span>
              <button
                style={{
                  width: "1.02081rem",
                  height: "1rem",
                  borderRadius: "0.125rem",
                  background: "rgba(51, 0, 92, 0.35)",
                  border: "none",
                  color: "#353535",
                  fontFamily: "Inter",
                  fontSize: "0.5rem",
                  fontWeight: 700,
                  cursor: "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Add Investors Popup */}
        <AddInvestorsPopup
          isOpen={isAddInvestorsPopupOpen}
          onClose={() => setIsAddInvestorsPopupOpen(false)}
        />
      </div>
    )
  }

  return (
    <div style={{ paddingTop: "3rem" }} onClick={closeMenu}>
      {/* Header Section */}
      <div className="mb-8">
        {/* Search and New List Section */}
        <div className="flex justify-between items-center" style={{ marginBottom: "2.5rem" }}>
          {/* Search Bar */}
          <div className="relative" style={{ width: "20rem" }}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                style={{ width: "1rem", height: "1rem" }}
                className="text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search target list..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 bg-transparent focus:outline-none"
              style={{
                width: "20rem",
                height: "2.5rem",
                borderRadius: "0.25rem",
                border: "2px solid #000",
                background: "#0F0E16",
                fontFamily: "Inter",
                fontSize: "0.75rem",
                fontWeight: 400,
                color: "#B8B8B8",
              }}
            />
          </div>

          {/* New List Button */}
          <button
            onClick={handleNewListClick}
            className="flex items-center justify-center transition-colors hover:bg-purple-700"
            style={{
              width: "7.5rem",
              height: "2.5rem",
              borderRadius: "0.25rem",
              background: "#5F248D",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                width: "1.125rem",
                height: "1.125rem",
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M8.25 9.75H3.75V8.25H8.25V3.75H9.75V8.25H14.25V9.75H9.75V14.25H8.25V9.75Z" fill="white" />
              </svg>
            </span>
            <span style={{ color: "#FFF", fontFamily: "Inter", fontSize: "0.875rem", fontWeight: 500 }}>New list</span>
          </button>
        </div>

        {/* User Created Target Lists */}
        {userTargetLists.map((list) => (
          <div
            key={list.id}
            onClick={() => handleListClick(list)}
            className="rounded-lg cursor-pointer transition-all hover:bg-opacity-80 mb-4 relative"
            style={{
              width: "100%",
              height: "11.125rem",
              borderRadius: "0.5rem",
              background: "#0F0E16",
              padding: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            {/* Profile Cover */}
            <div
              style={{
                width: "7.5rem",
                height: "7.5rem",
                borderRadius: "0.25rem",
                background: list.cover === "default" ? "#0F0E16" : coverOptions[list.cover],
                border: list.cover === "default" ? "1px dashed #5F248D" : "none",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {list.cover === "default" && (
                <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                  <path d="M8 4V12M4 8H12" stroke="#5F248D" strokeWidth="1" strokeLinecap="round" />
                </svg>
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3
                style={{
                  color: "#FFF",
                  fontFamily: "Inter",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                {list.name}
              </h3>

              <div className="flex items-center gap-2 mb-2" style={{ fontSize: "0.625rem" }}>
                <span style={{ fontFamily: "Inter", fontWeight: 400, color: "#FFF" }}>Created by {list.createdBy}</span>
                <div
                  style={{ width: "0.1875rem", height: "0.1875rem", backgroundColor: "#AD6FDE", borderRadius: "50%" }}
                ></div>
                <span style={{ fontFamily: "Inter", fontWeight: 400, color: "#FFF" }}>{list.createdDate}</span>
                <div
                  style={{ width: "0.1875rem", height: "0.1875rem", backgroundColor: "#AD6FDE", borderRadius: "50%" }}
                ></div>
                <span style={{ fontFamily: "Inter", fontWeight: 400, color: "#FFF" }}>{list.updatedDate}</span>
              </div>

              {/* Investor Count Badge */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: "5.25rem",
                  height: "1.3125rem",
                  borderRadius: "6.25rem",
                  background: "#33005C",
                  color: "#FFF",
                  fontFamily: "Inter",
                  fontSize: "0.5rem",
                  fontWeight: 600,
                }}
              >
                {list.investorCount} INVESTORS
              </div>
            </div>

            {/* Three Dots Menu */}
            <div className="relative">
              <button
                onClick={(e) => handleThreeDotsClick(e, list.id)}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
                style={{ color: "#B8B8B8" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="8" cy="2" r="1.5" />
                  <circle cx="8" cy="8" r="1.5" />
                  <circle cx="8" cy="14" r="1.5" />
                </svg>
              </button>
              <ThreeDotsMenu
                isOpen={activeMenuId === list.id}
                onClose={closeMenu}
                listId={list.id}
                isVertxCreated={false}
              />
            </div>
          </div>
        ))}

        {/* Matched Investors Card */}
        <div
          onClick={() =>
            handleListClick({
              id: "matched-investors",
              name: "Everyone's VC",
              cover: "purple",
              createdBy: "VERTX",
              createdDate: "28/05/2025",
              updatedDate: "Updated 1 day ago",
              investorCount: 0,
            })
          }
          className="rounded-lg cursor-pointer transition-all hover:bg-opacity-80 relative"
          style={{
            width: "100%",
            height: "11.125rem",
            borderRadius: "0.5rem",
            background: "#0F0E16",
            padding: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          {/* Profile Placeholder */}
          <div
            style={{
              width: "7.5rem",
              height: "7.5rem",
              borderRadius: "0.25rem",
              background: "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
              flexShrink: 0,
            }}
          ></div>

          {/* Content */}
          <div className="flex-1">
            <h3
              style={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "1.5rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Matched Investors for you
            </h3>

            <div className="flex items-center gap-2 mb-2" style={{ fontSize: "0.625rem" }}>
              <span style={{ fontFamily: "Inter", fontWeight: 400, color: "#FFF" }}>Created by VERTX</span>
              <div
                style={{ width: "0.1875rem", height: "0.1875rem", backgroundColor: "#AD6FDE", borderRadius: "50%" }}
              ></div>
              <span style={{ fontFamily: "Inter", fontWeight: 400, color: "#FFF" }}>28/05/2025</span>
              <div
                style={{ width: "0.1875rem", height: "0.1875rem", backgroundColor: "#AD6FDE", borderRadius: "50%" }}
              ></div>
              <span style={{ fontFamily: "Inter", fontWeight: 400, color: "#FFF" }}>Updated 1 day ago</span>
            </div>

            {/* Investor Count Badge */}
            <div
              className="flex items-center justify-center"
              style={{
                width: "5.25rem",
                height: "1.3125rem",
                borderRadius: "6.25rem",
                background: "#33005C",
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "0.5rem",
                fontWeight: 600,
              }}
            >
              10 INVESTORS
            </div>
          </div>

          {/* Three Dots Menu */}
          <div className="relative">
            <button
              onClick={(e) => handleThreeDotsClick(e, "matched-investors")}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
              style={{ color: "#B8B8B8" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="2" r="1.5" />
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="8" cy="14" r="1.5" />
              </svg>
            </button>
            <ThreeDotsMenu
              isOpen={activeMenuId === "matched-investors"}
              onClose={closeMenu}
              listId="matched-investors"
              isVertxCreated={true}
            />
          </div>
        </div>
      </div>

      {/* New List Popup */}
      <NewListPopup
        isOpen={isNewListPopupOpen}
        onClose={() => setIsNewListPopupOpen(false)}
        onSave={handleNewListSave}
      />
    </div>
  )
}
export default Target
 