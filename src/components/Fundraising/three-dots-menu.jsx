"use client"

export default function ThreeDotsMenu({ isOpen, onClose, listId, isVertxCreated = false, onEditName }) {
  const menuOptions = [
    { id: "edit", label: "Edit name", icon: "✏️" },
    { id: "delete", label: "Delete target list", icon: "🗑️" },
    { id: "share", label: "Share target list", icon: "📤", disabled: false },
    { id: "reach", label: "Add list to Reach", icon: "➕", disabled: false },
    { id: "pipeline", label: "Add to pipeline", icon: "💰", disabled: false },
  ]

  const handleOptionClick = (optionId) => {
    if (optionId === "edit" && onEditName) {
      onEditName()
    } else {
      // Handle other menu options
      switch (optionId) {
        case "delete":
          if (window.confirm("Are you sure you want to delete this target list?")) {     
            console.log(`Delete target list ${listId}`)
            // Add delete logic here
          }
          break
        case "share":
          console.log(`Share target list ${listId}`)
          // Add share logic here
          break
        case "reach":
          console.log(`Add list ${listId} to Reach`)
          // Add reach logic here
          break
        case "pipeline":
          console.log(`Add list ${listId} to pipeline`)
          // Add pipeline logic here
          break
        default:
          console.log(`${optionId} clicked for list ${listId}`)
      }
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="absolute z-50 top-full right-0 mt-2 w-[8.0625rem] h-[7.75rem] rounded border border-[#0F0E16] bg-black p-1"
      role="menu"
      aria-label="Target list options"
    >
      {menuOptions.map((option) => (
        <div
          key={option.id}
          className={`flex items-center gap-2 px-2 py-1 cursor-pointer transition-all w-[7.9375rem] h-5 text-[#B8B8B8] font-['Inter'] text-[0.5rem] font-normal rounded-[0.125rem] ${
            option.disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#33005C] hover:text-white focus:bg-[#33005C] focus:text-white"
          }`}
          onClick={() => {
            if (!option.disabled) {
              handleOptionClick(option.id)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              if (!option.disabled) {
                handleOptionClick(option.id)
              }
            }
          }}
          tabIndex={option.disabled ? -1 : 0}
          role="menuitem"
          aria-disabled={option.disabled}
        >
          <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <rect width="16" height="16" rx="2" />
          </svg>
          <span>{option.label}</span>
        </div>
      ))}
    </div>
  )
}
