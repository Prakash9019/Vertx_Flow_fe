import { useState } from "react"

import Rectangle82 from "../../assets/Rectangle 82.png"

export default function NewListPopup({ isOpen, onClose, onSave }) {
  const [listName, setListName] = useState("")
  const [selectedCover, setSelectedCover] = useState("purple")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const coverOptions = [
    { id: "default", color: "#0F0E16", border: "1px dashed #5F248D" },
    { id: "purple", color: "linear-gradient(180deg, #6C04BF 0%, #456BBD 100%)" },
    { id: "orange", color: "linear-gradient(0deg, #AF4F00 0%, #CC8D03 100%)" },
    { id: "pink", color: "linear-gradient(180deg, #FC6848 0%, #AD6FDE 100%)" },
    { id: "red", color: "linear-gradient(180deg, #AF4F00 0%, #FC4141 100%)" },
  ]

  const handleSave = async () => {
    if (listName.trim()) {
      setIsSubmitting(true)
      try {
        await onSave({ name: listName, cover: selectedCover })
        setListName("")
        setSelectedCover("purple")
        onClose()
      } catch (error) {
        console.error("Error saving list:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleCancel = () => {
    setListName("")
    setSelectedCover("purple")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dimmed background overlay */}
      <div className="absolute inset-0 bg-black cursor-pointer" style={{ opacity: 0.7 }} onClick={handleCancel} />

      <div
        className="relative flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          width: "43.75rem",
          height: "35rem",
    backgroundImage: `url(${Rectangle82})`,
        }}
      >
        {/* Header text */}
        <div className="text-center pt-8">
          <h2 className="text-white text-2xl font-semibold mb-2 font-['Inter']">Let's create a new target list.</h2>
          <p className="text-[#B8B8B8] text-center font-['Inter'] text-xs font-normal max-w-[25rem] mx-auto leading-[1.4]">
            A target list is a curated set of investors for your fundraise.
            <br />
            You can edit and share it anytime, unless it was created by Vertx.
          </p>
        </div>

        {/* Main container */}
        <div className="w-[40rem] h-[18.75rem] rounded-[0.3125rem] bg-black/76 relative mt-[1.87rem] p-8">
          {/* Name the target list section */}
          <div className="mb-8">
            <h3 className="text-white font-['Inter'] text-base font-medium mb-4">Name the target list</h3>

            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Enter the name of the target list..."
              className="w-[36rem] h-9 bg-white/11 text-white outline-none rounded-[0.125rem] px-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal"
            />
          </div>

          {/* Choose the cover section */}
          <div className="mb-8">
            <h3 className="text-white font-['Inter'] text-base font-medium mb-4">Choose the cover</h3>

            <div className="flex gap-3">
              {coverOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSelectedCover(option.id)}
                  className="cursor-pointer w-10 h-10 rounded-[0.125rem] flex items-center justify-center transition-transform duration-200"
                  style={{
                    background: option.color,
                    border:
                      option.id === "default" ? option.border : selectedCover === option.id ? "2px solid #FFF" : "",
                    transform: selectedCover === option.id ? "scale(1.2)" : "scale(1)",
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
          <div className="flex justify-end items-center gap-2 absolute right-8 bottom-8">
            <button
              onClick={handleCancel}
              className="w-20 h-8 bg-white/20 rounded-[0.125rem] border-none cursor-pointer text-white transition-colors hover:bg-gray-500"
            >
              <span className="text-white text-center font-['Inter'] text-sm font-medium">Cancel</span>
            </button>

            <button
              onClick={handleSave}
              disabled={!listName.trim() || isSubmitting}
              className="w-20 h-8 rounded-[0.125rem] bg-white border-none transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                cursor: listName.trim() && !isSubmitting ? "pointer" : "not-allowed",
              }}
            >
              <span className="text-black text-center font-['Inter'] text-sm font-medium">
                {isSubmitting ? "Saving..." : "Save"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}