import EditIcon from "../../assets/EditIcon.svg";
import DeleteIcon from "../../assets/DeleteIcon.svg";
import ShareIcon from "../../assets/ShareIcon.svg";
import AddIcon from "../../assets/AddIcon.svg";
import DollarIcon2 from "../../assets/DollarIcon2.svg";

"use client"

export default function ThreeDotsMenu({ isOpen, onClose, listId, isVertxCreated = false, onEditName }) {
  const menuOptions = [
    { id: "edit", label: "Edit name" },
    { id: "delete", label: "Delete target list" },
    { id: "share", label: "Share target list", disabled: false },
    { id: "reach", label: "Add list to Reach", disabled: false },
    { id: "pipeline", label: "Add to pipeline", disabled: false },
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
          className={`group flex items-center gap-2 px-2 py-1 cursor-pointer transition-all w-[7.9375rem] h-5 text-[#B8B8B8] font-['Inter'] text-[0.5rem] font-normal rounded-[0.125rem] ${
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
          {/* Icon with hover effect */}
          {option.id === "edit" && (
            <img 
              src={EditIcon} 
              alt="Edit" 
              className="w-4 h-4 transition-all brightness-0 invert-[0.72] group-hover:brightness-0 group-hover:invert group-focus:brightness-0 group-focus:invert" 
            />
          )}
          {option.id === "delete" && (
            <img 
              src={DeleteIcon} 
              alt="Delete" 
              className="w-4 h-4 transition-all brightness-0 invert-[0.72] group-hover:brightness-0 group-hover:invert group-focus:brightness-0 group-focus:invert" 
            />
          )}
          {option.id === "share" && (
            <img 
              src={ShareIcon} 
              alt="Share" 
              className="w-4 h-4  transition-all brightness-0 invert-[0.72] group-hover:brightness-0 group-hover:invert group-focus:brightness-0 group-focus:invert" 
            />
          )}
          {option.id === "reach" && (
            <img 
              src={AddIcon} 
              alt="Reach" 
              className="w-4 h-4 transition-all brightness-0 invert-[0.72] group-hover:brightness-0 group-hover:invert group-focus:brightness-0 group-focus:invert" 
            />
          )}
          {option.id === "pipeline" && (
            <img 
              src={DollarIcon2} 
              alt="Pipeline" 
              className="w-4 h-4 transition-all brightness-0 invert-[0.72] group-hover:brightness-0 group-hover:invert group-focus:brightness-0 group-focus:invert" 
            />
          )}

          <span>{option.label}</span>
        </div>
      ))}
    </div>
  )
}