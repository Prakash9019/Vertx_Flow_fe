"use client"

import { useState, useEffect } from "react"
import API_KEY from "../../../key"
import NewListPopup from "./new-list-popup"
import ThreeDotsMenu from "./three-dots-menu"
import AddInvestorsPopup from "./AddInvestorsPopup"
import InviteAndCollab from "./InviteAndCollab"
import { MoreVertical } from "lucide-react"
import Rectangle119 from "../../assets/Rectangle 119.png"
import BackButton from "../../assets/BackButton.svg"
import ShareIcon from "../../assets/ShareIcon.svg"
import AddIcon from "../../assets/AddIcon.svg"
import MoreIcon from "../../assets/MoreIcon.svg"
import SettingsIcon from "../../assets/SettingsIcon.svg"
import InfoIcon from "../../assets/info.svg"
import CopyIcon from "../../assets/CopyIcon.svg"
import QRIcon from "../../assets/QRIcon.svg"
import LockIcon from "../../assets/LockIcon.svg"
import DropdownIcon from "../../assets/DropdownIcon.svg"
import LinkedIn from "../../assets/LinkedIn.svg"
import Link from "../../assets/link.svg"
import Mail from "../../assets/mail.svg"
import Twitter from "../../assets/twitter.svg"
import SearchIcon from "../../assets/SearchIcon.svg"
import DefaultAvatar from "../../assets/DefaultAvatar.svg"

// Simple base64 fallback avatar
const fallbackAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIzMCIgZmlsbD0iIzFGMjkzNyIvPgogIDxjaXJjbGUgY3g9IjMwIiBjeT0iMjMiIHI9IjgiIGZpbGw9IiM2QjcyODAiLz4KICA8cGF0aCBkPSJNMTUgNTJDMTUgNDQuMjY4IDIxLjI2OCAzOCAyOSAzOEgzMUMzOC43MzIgMzggNDUgNDQuMjY4IDQ1IDUyVjYwSDE1VjUyWiIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K";

export default function Target({ onListSelect }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewListPopupOpen, setIsNewListPopupOpen] = useState(false)
  const [isAddInvestorsPopupOpen, setIsAddInvestorsPopupOpen] = useState(false)
  const [userTargetLists, setUserTargetLists] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [selectedList, setSelectedList] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const itemsPerPage = 10
  const [showSettings, setShowSettings] = useState(false)
  const [showInviteCollab, setShowInviteCollab] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState("")

  const [showDeleteNotification, setShowDeleteNotification] = useState(false);

  const coverOptions = {
    default: "#0F0E16",
    purple: "linear-gradient(180deg, #6C04BF 0%, #456BBD 100%)",
    orange: "linear-gradient(0deg, #AF4F00 0%, #CC8D03 100%)",
    pink: "linear-gradient(180deg, #FC6848 0%, #AD6FDE 100%)",
    red: "linear-gradient(180deg, #AF4F00 0%, #FC4141 100%)",
  }
  // Fetch user target lists on component mount
  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('Authentication required');
          return;
        }
        
        const response = await fetch(`${API_KEY}/api/list`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch lists: ${response.status}`);
        }

        const result = await response.json();
        console.log('Fetched lists with investors:', result);
        
        // Map backend lists to frontend format with populated investor data
        const mappedLists = result.data.map(list => ({
          id: list._id,
          name: list.name,
          cover: list.coverColor,
          createdBy: "Company",
          createdDate: new Date(list.createdAt).toLocaleDateString("en-GB"),
          updatedDate: list.updatedAt ? `Updated ${new Date(list.updatedAt).toLocaleDateString("en-GB")}` : "Updated today",
          investorCount: list.investors ? list.investors.length : 0,
          investors: list.investors || [],
        }));
        console.log("helllooo")
        console.log(mappedLists)
        setUserTargetLists(mappedLists);
      } catch (error) {
        console.error("Error fetching lists:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
  }, []);

  const handleNewListClick = () => {
    setIsNewListPopupOpen(true)
  }

  const handleNewListSave = async (listData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Map frontend color names to backend allowed colors
      const colorMap = {
        'default': 'blue',
        'purple': 'purple',
        'orange': 'orange',
        'pink': 'red',  // Map pink to red since backend doesn't have pink
        'red': 'red'
      };
      
      const backendColor = colorMap[listData.cover] || 'purple';
      
      const response = await fetch(`${API_KEY}/api/list/new`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: listData.name,
          coverColor: backendColor
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create list: ${response.status}`);
      }

      const result = await response.json();
      
      const newList = {
        id: result.list._id,
        name: result.list.name,
        cover: listData.cover, // Keep original frontend color for UI
        createdBy: "Company",
        createdDate: new Date().toLocaleDateString("en-GB"),
        updatedDate: "Updated today",
        investorCount: 0,
        investors: [],
      }

      setUserTargetLists((prev) => [...prev, newList]);
      console.log("New list created:", newList);
    } catch (error) {
      console.error("Error creating new list:", error);
      alert("Failed to create new list. Please try again.");
    }
  }

  const handleThreeDotsClick = (e, listId) => {
    e.stopPropagation()
    setActiveMenuId(activeMenuId === listId ? null : listId)
  }

  const closeMenu = () => {
    setActiveMenuId(null)
    setActiveDropdown(null)
  }

  const handleListClick = (list) => {
    setSelectedList(list)
    setCurrentPage(1)
    if (onListSelect) {
      onListSelect(true)
    }
  }

  const handleBackClick = () => {
    setSelectedList(null)
    setIsEditingName(false)
    if (onListSelect) {
      onListSelect(false)
    }
  }

  const handleAddInvestorsClick = () => {
    setIsAddInvestorsPopupOpen(true)
  }
  const handleInvestorsAdded = async (newInvestors) => {
    if (selectedList && newInvestors.length > 0) {
      // Refresh the entire lists to get updated data from server
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('Authentication required');
          return;
        }
        
        const response = await fetch(`${API_KEY}/api/list`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch updated lists: ${response.status}`);
        }

        const result = await response.json();
        console.log('Refreshed lists after adding investors:', result);
        
        // Map backend lists to frontend format with populated investor data
        const mappedLists = result.data.map(list => ({
          id: list._id,
          name: list.name,
          cover: list.coverColor,
          createdBy: "Company",
          createdDate: new Date(list.createdAt).toLocaleDateString("en-GB"),
          updatedDate: list.updatedAt ? `Updated ${new Date(list.updatedAt).toLocaleDateString("en-GB")}` : "Updated today",
          investorCount: list.investors ? list.investors.length : 0,
          investors: list.investors || [],
        }));
        
        setUserTargetLists(mappedLists);
        
        // Update selected list with fresh data
        const updatedSelectedList = mappedLists.find(list => list.id === selectedList.id);
        if (updatedSelectedList) {
          setSelectedList(updatedSelectedList);
        }
      } catch (error) {
        console.error("Error refreshing lists after adding investors:", error);
        // Fallback to local update if server refresh fails
        const updatedList = {
          ...selectedList,
          investors: [...(selectedList.investors || []), ...newInvestors],
          investorCount: (selectedList.investorCount || 0) + newInvestors.length,
          updatedDate: "Updated today",
        }
        setSelectedList(updatedList);
        setUserTargetLists((prev) => prev.map((list) => (list.id === selectedList.id ? updatedList : list)));
      }
    }
  }

  const handleEditNameClick = () => {
    setIsEditingName(true)
    setEditedName(selectedList.name)
    setActiveMenuId(null)
  }

  const handleCancelEdit = () => {
    if (editedName !== selectedList.name && editedName.trim()) {
      if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        setIsEditingName(false)
        setEditedName("")
      }
    } else {
      setIsEditingName(false)
      setEditedName("")
    }
  }

  const handleSaveEdit = async () => {
    const trimmedName = editedName.trim();

    if (!trimmedName) {
      alert("Please enter a valid name");
      return;
    }

    if (trimmedName.length > 50) {
      alert("Name must be 50 characters or less");
      return;
    }

    if (trimmedName === selectedList.name) {
      // No changes made
      setIsEditingName(false);
      setEditedName("");
      return;
    }

    try {
      await handleUpdateList(selectedList.id, { name: trimmedName });

      const updatedList = {
        ...selectedList,
        name: trimmedName,
        updatedDate: "Updated today",
      };

      setSelectedList(updatedList);
      setUserTargetLists((prev) => 
        prev.map((list) => (list.id === selectedList.id ? updatedList : list))
      );
      setIsEditingName(false);
      setEditedName("");
    } catch (error) {
      alert("Failed to update list name. Please try again.");
    }
  }

  const handleUpdateList = async (listId, updatedData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_KEY}/api/list/${listId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update list: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating list:', error);
      throw error;
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_KEY}/api/list/${listId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete list');
      }      // Update UI state
      setUserTargetLists(prevLists => prevLists.filter(list => list.id !== listId));
      
      // Always redirect to main target lists view after deletion
      setSelectedList(null);
      if (onListSelect) {
        onListSelect(false);
      }

      // Close menus
      setActiveMenuId(null);
      setActiveDropdown(null);

      // Show success notification
      setShowDeleteNotification(true);
      setTimeout(() => {
        setShowDeleteNotification(false);
      }, 3000);

    } catch (error) {
      console.error('Error deleting list:', error);
      throw error; // Propagate the error up
    }
  };

  const handleRemoveInvestor = async (investorId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      if (!selectedList?.id) {
        throw new Error('No list selected');
      }

      const response = await fetch(`${API_KEY}/api/list/remove-investor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          listId: selectedList.id,
          investorId: investorId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove investor from list');
      }

      // Update local state - remove investor from current list
      const updatedInvestors = selectedList.investors.filter(inv => 
        (inv.id || inv._id) !== investorId
      );
      
      const updatedList = {
        ...selectedList,
        investors: updatedInvestors,
        investorCount: updatedInvestors.length,
        updatedDate: "Updated today",
      };

      setSelectedList(updatedList);
      
      // Update the lists array
      setUserTargetLists(prev => 
        prev.map(list => 
          list.id === selectedList.id ? updatedList : list
        )
      );

      // Close dropdown
      setActiveDropdown(null);

      console.log(`Successfully removed investor ${investorId} from list ${selectedList.id}`);
      
    } catch (error) {
      console.error('Error removing investor from list:', error);
      alert('Failed to remove investor from list. Please try again.');
    }
  };

  const getMatchColor = (matchValue) => {
    if (matchValue >= 0 && matchValue <= 49) return "#DE2D2D"
    if (matchValue >= 50 && matchValue <= 67) return "#AF4F00"
    if (matchValue >= 68 && matchValue <= 85) return "#CC8D03"
    if (matchValue >= 86 && matchValue <= 100) return "#0E8D07"
    return "#DE2D2D"
  }

  const investors = selectedList?.investors || []
  const totalPages = Math.ceil(investors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentInvestors = investors.slice(startIndex, endIndex)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // If a list is selected, show the detail view
  if (selectedList) {
    const hasInvestors = investors.length > 0

    return (
      <div className="pt-12 min-h-[calc(100vh-4rem)] bg-black pb-4" onClick={closeMenu}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-16">
  <div className="flex flex-col flex-1">
    <button
      onClick={showSettings ? () => setShowSettings(false) : handleBackClick}
      className="flex items-center gap-2 transition-colors hover:text-gray-300 mb-4 bg-none border-none cursor-pointer text-white font-['Inter'] text-base font-medium self-start -ml-8"
    >
      <img src={BackButton || "/placeholder.svg"} alt="Back Icon" className="w-6 h-6" />
      {showSettings ? "Settings" : "Back"}
    </button>

    <div className="flex items-center justify-between w-full">
      {isEditingName ? (
        <div className="flex items-center gap-3 w-full">
          <div className="flex flex-col relative flex-1">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleSaveEdit()
                } else if (e.key === "Escape") {
                  e.preventDefault()
                  handleCancelEdit()
                }
              }}
              className="text-[#B8B8B8] font-['Inter'] text-[1.25rem] font-normal m-0 bg-transparent border-none outline-none pr-4 w-full"
              autoFocus
              maxLength={50}
            />
            <div className="absolute bottom-[-2px] left-0 right-0 h-0 border-b border-[#B8B8B8]"></div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <h1 className="text-white font-['Inter'] text-2xl font-semibold m-0">{selectedList.name}</h1>
          <div className="flex items-center justify-center w-21 h-[1.3125rem] rounded-[6.25rem] bg-[#33005C] text-white font-['Inter'] text-[0.5rem] font-semibold">
            {selectedList.investorCount || 0} INVESTORS
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Action Buttons and Three Dots Menu */}
  <div className="flex mt-9 items-center gap-4">
    {isEditingName ? (
      <div className="flex items-center gap-3">
        <button
          onClick={handleCancelEdit}
          className="flex items-center justify-center text-center w-20 h-8 rounded-[0.125rem] bg-[#DE2D2D] border-none cursor-pointer hover:bg-[#c02626] transition-colors"
        >
          <span className="text-white text-center font-['Inter'] text-[0.875rem]  font-medium">Cancel</span>
        </button>
        <button
          onClick={handleSaveEdit}
          disabled={!editedName.trim()}
          className={`flex items-center justify-center text-center w-20 h-8 rounded-[0.125rem] border-none cursor-pointer transition-colors ${
            editedName.trim() ? "bg-white hover:bg-gray-100" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          <span
            className={`text-center font-['Inter'] text-[0.875rem] font-medium ${
              editedName.trim() ? "text-black" : "text-gray-500"
            }`}
          >
            Save
          </span>
        </button>
      </div>
    ) : (
      <>
        {hasInvestors && !showSettings && (
          <>
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center justify-center gap-2 transition-colors hover:bg-gray-100 h-10 rounded bg-white border-none cursor-pointer px-4"
            >
              <img
                src={SettingsIcon || "/placeholder.svg"}
                alt="Settings Icon"
                className="w-[1.125rem] h-[1.125rem]"
              />
              <span className="text-black font-['Inter'] text-sm font-medium">Settings</span>
            </button>

            <button
              onClick={handleAddInvestorsClick}
              className="flex items-center justify-center gap-2 transition-colors hover:bg-purple-700 h-10 rounded bg-[#5F248D] border-none cursor-pointer px-4"
            >
              <img src={AddIcon || "/placeholder.svg"} alt="Add Icon" className="w-[1.125rem] h-[1.125rem]" />
              <span className="text-white font-['Inter'] text-sm font-medium">Add Investors</span>
            </button>
          </>
        )}

        {(!hasInvestors || hasInvestors) && !showSettings && (
          <div className="relative">
            <button
              onClick={(e) => handleThreeDotsClick(e, selectedList.id)}
              className="p-2 hover:bg-gray-700 rounded transition-colors text-[#B8B8B8]"
            >
              <img src={MoreIcon || "/placeholder.svg"} alt="More Icon" className="w-7 h-7" />
            </button>
            <ThreeDotsMenu
              isOpen={activeMenuId === selectedList.id}
              onClose={closeMenu}
              listId={selectedList.id}
              isVertxCreated={selectedList.createdBy === "VERTX"}
              onEditName={handleEditNameClick}
              onDelete={handleDeleteList}
            />
          </div>
        )}
      </>
    )}
  </div>
</div>

        {/* Main Content Area */}
        <div className="w-[calc(100%-8rem)] h-[calc(100vh-14rem)] rounded-lg bg-[#0F0E16] relative p-10 mx-16 flex flex-col">
          {showSettings ? (
            // Settings Content
            <div className="space-y-6">
              {/* Invite Link Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-white font-['Inter'] text-base font-medium">Invite link</h3>
                  <img src={InfoIcon || "/placeholder.svg"} alt="Info Icon" className="w-5 h-5 text-[#B8B8B8]" />
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 flex items-center justify-between bg-black px-4 rounded relative h-9 rounded-[0.125rem]">
                    <input
                      type="text"
                      value="https://flow.govertx.com/targetlist/invite/abc123efgyurfhrvg"
                      readOnly
                      className="bg-transparent text-white border-none outline-none flex-1 font-['Inter'] text-xs font-normal"
                    />
                    <img
                      src={CopyIcon || "/placeholder.svg"}
                      alt="Copy Icon"
                      className="w-[1.125rem] h-[1.125rem] text-[#B8B8B8]"
                    />
                  </div>                  <button 
                    onClick={() => {
                      if (activeList?.id) {
                        setShowInviteCollab(true);
                        // Set a delay to trigger QR generation after modal is open
                        setTimeout(() => {
                          const qrBtn = document.querySelector('[data-qr-button="true"]');
                          if (qrBtn) qrBtn.click();
                        }, 500);
                      } else {
                        alert('Please select a list first');
                      }
                    }} 
                    className="flex items-center justify-center gap-2 bg-black text-gray-400 hover:text-white transition-colors w-[6.75rem] h-9 rounded-[0.125rem]"
                  >
                    <img src={QRIcon || "/placeholder.svg"} alt="QR Icon" className="w-4 h-4" />
                    <span className="text-[#B8B8B8] font-['Inter'] text-[0.625rem] font-normal">Generate QR</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Emails, comma separated"
                    className="flex-1 bg-black text-white px-4 border-none outline-none placeholder-gray-400 h-9 rounded-[0.125rem] font-['Inter'] text-xs font-normal"
                  />
                  <button className="bg-white text-black hover:bg-gray-100 transition-colors font-medium flex items-center justify-center w-[6.75rem] h-9 rounded-[0.125rem] font-['Inter'] text-sm font-medium text-center">
                    Invite
                  </button>
                </div>
              </div>

              {/* Access Section */}
              <div>
                <h3 className="mb-4 text-white font-['Inter'] text-base font-medium">Access</h3>

                <div className="mb-3">
                  <div className="flex items-center justify-between bg-black p-4 rounded flex-1 h-9 px-4">
                    <div className="flex items-center gap-3">
                      <img src={LockIcon || "/placeholder.svg"} alt="Lock Icon" className="w-5 h-5" />
                      <span className="text-white font-['Inter'] text-xs font-normal">Only invited people</span>
                    </div>
                    <img
                      src={DropdownIcon || "/placeholder.svg"}
                      alt="Dropdown Icon"
                      className="w-4 h-4 text-[#B8B8B8]"
                    />
                  </div>
                </div>

                <p className="text-[#B8B8B8] font-['Inter'] text-[0.625rem] font-normal leading-[1.4]">
                  Only people you've directly invited can access this list.
                </p>
              </div>

              {/* Additional Settings Section */}
              <div>
                <h3 className="mb-4 text-white font-['Inter'] text-base font-medium">Additional settings</h3>

                <div className="flex items-center justify-between">
                  <span className="text-white font-['Inter'] text-sm font-normal">
                    People can edit and share this target list
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="editToggle"
                      className="sr-only"
                      onChange={(e) => {
                        const toggle = e.target.nextElementSibling
                        const circle = toggle.firstElementChild
                        if (e.target.checked) {
                          toggle.style.background = "#5F248D"
                          circle.style.transform = "translateX(0.75rem)"
                        } else {
                          toggle.style.background = "#FFF"
                          circle.style.transform = "translateX(0)"
                        }
                      }}
                    />
                    <label
                      htmlFor="editToggle"
                      className="bg-white rounded-full p-1 cursor-pointer flex transition-colors w-[1.875rem] h-5"
                    >
                      <div className="w-3 h-3 bg-gray-400 rounded-full transition-transform duration-200"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowSettings(false)}
                  className="bg-white text-black hover:bg-gray-100 transition-colors font-medium flex items-center justify-center rounded-[0.125rem] w-20 h-8 text-center font-['Inter'] text-sm font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          ) : !hasInvestors ? (
            // Empty State
            <>
              <div
                className="w-full h-[calc(100%-6rem)] bg-[length:100%_100%] bg-center bg-no-repeat rounded-md mb-[4.5rem] flex flex-col items-center justify-center gap-8"
                style={{
                  backgroundImage: `url(${Rectangle119})`,
                }}
              >
                <h2 className="text-white font-['Inter'] text-xl font-semibold m-0">No investors are in this list.</h2>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleAddInvestorsClick}
                    className="flex items-center justify-center gap-2 transition-colors hover:bg-purple-700 w-40 h-10 rounded bg-[#5F248D] border-none cursor-pointer"
                  >
                    <img src={AddIcon || "/placeholder.svg"} alt="Add Icon" className="w-[1.125rem] h-[1.125rem]" />
                    <span className="text-white font-['Inter'] text-sm font-medium">Add Investors</span>
                  </button>

                  <button
                    onClick={() => setShowInviteCollab(true)}
                    className="flex items-center justify-center gap-2 transition-colors hover:bg-gray-100 w-[11.25rem] h-10 rounded bg-white border-none cursor-pointer"
                  >
                    <img src={ShareIcon || "/placeholder.svg"} alt="Share Icon" className="w-[1.125rem] h-[1.125rem]" />
                    <span className="text-black font-['Inter'] text-sm font-medium">Invite and Collab</span>
                  </button>
                </div>
              </div>

              {/* Bottom Info and Pagination Container for Empty State */}
              <div className="flex items-center justify-between mt-auto pt-6">
                <div className="flex items-center justify-center w-[8.43944rem] h-[1.875rem] rounded-[0.125rem] bg-black text-[#B8B8B8] font-['Inter'] text-[0.5rem] font-normal">
                  0 results found | 10 per page
                </div>

                <div className="flex items-center gap-2 text-[#B8B8B8] font-['Inter'] text-[0.5rem] font-normal">
                  <button className="w-[1.02081rem] h-4 rounded-[0.125rem] bg-[rgba(51,0,92,0.35)] border-none text-[#353535] font-['Inter'] text-[0.5rem] font-bold cursor-not-allowed flex items-center justify-center">
                    &lt;
                  </button>
                  <span>Page</span>
                  <span className="w-[1.40363rem] h-4 rounded-[0.125rem] bg-[#33005C] text-[#AD6FDE] font-['Inter'] text-[0.5rem] font-bold flex items-center justify-center">
                    000
                  </span>
                  <span>of 0</span>
                  <button className="w-[1.02081rem] h-4 rounded-[0.125rem] bg-[rgba(51,0,92,0.35)] border-none text-[#353535] font-['Inter'] text-[0.5rem] font-bold cursor-not-allowed flex items-center justify-center">
                    &gt;
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Investor List View
            <>
              {/* Table Header */}
              <div className="flex items-center py-4 px-4 xl:px-6">
                <div className="w-[17rem] flex-shrink-0">
                  <div className="text-white font-semibold text-xs uppercase tracking-wider font-['Inter'] text-[0.5rem] tracking-[0.05em]">
                    INVESTOR NAME
                  </div>
                </div>

                <div className="flex items-center justify-between flex-grow gap-x-2 sm:gap-x-4 md:gap-x-6 xl:gap-x-10 overflow-hidden min-w-0">
                  <div className="flex justify-center flex-shrink-0 w-12">
                    <div className="text-white font-semibold text-xs uppercase tracking-wider text-center whitespace-nowrap font-['Inter'] text-[0.5rem] tracking-[0.05em]">
                      CHECK SIZE
                    </div>
                  </div>

                  <div className="flex justify-center flex-shrink-0 w-16">
                    <div className="text-white font-semibold text-xs uppercase tracking-wider text-center whitespace-nowrap font-['Inter'] text-[0.5rem] tracking-[0.05em]">
                      STAGE
                    </div>
                  </div>

                  <div className="flex justify-center flex-shrink-0 w-16">
                    <div className="text-white font-semibold text-xs uppercase tracking-wider text-center whitespace-nowrap font-['Inter'] text-[0.5rem] tracking-[0.05em]">
                      INDUSTRY
                    </div>
                  </div>

                  <div className="flex justify-center flex-shrink-0 w-16">
                    <div className="text-white font-semibold text-xs uppercase tracking-wider text-center whitespace-nowrap font-['Inter'] text-[0.5rem] tracking-[0.05em]">
                      GEOGRAPHY
                    </div>
                  </div>

                  <div className="flex justify-center flex-shrink-0 w-12">
                    <div className="text-white font-semibold text-xs uppercase tracking-wider text-center whitespace-nowrap font-['Inter'] text-[0.5rem] tracking-[0.05em]">
                      MATCH
                    </div>
                  </div>

                  <div className="flex justify-center flex-shrink-0 w-16">
                    <div className="text-white font-semibold text-xs uppercase tracking-wider text-center whitespace-nowrap font-['Inter'] text-[0.5rem] tracking-[0.05em]">
                      SUBMIT DECK
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-6"></div>
                </div>
              </div>

              {/* Scrollable Investor List */}
              <div className="bg-gray-900/30 rounded-b-lg max-h-96 overflow-y-auto scrollbar-hide">
                {currentInvestors.map((investor) => (
                  <div
                    key={investor.id}
                    className="flex items-center bg-black hover:bg-gray-800/30 transition-colors w-full rounded-md border-b border-gray-700/50 h-24 xl:h-[6.25rem] px-4 xl:px-6"
                  >
                    <div className="flex items-center gap-x-4 w-[17rem] flex-shrink-0">
                      <img
                        src={investor.profile_image || investor.avatar || fallbackAvatar}
                        alt={investor.name}
                        className="rounded object-contain w-12 h-12 xl:w-[3.75rem] xl:h-[3.75rem] bg-white" />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-normal text-base truncate font-['Inter']">
                            {investor.name}
                          </span>

                          <div className="flex gap-1">
                            <img
                              src={LinkedIn || "/placeholder.svg"}
                              alt="LinkedIn"
                              className="w-2 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer text-[#0077B5]"
                            />
                            <img
                              src={Link || "/placeholder.svg"}
                              alt="Link"
                              className="w-2 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer text-gray-400"
                            />
                            <img
                              src={Mail || "/placeholder.svg"}
                              alt="Mail"
                              className="w-2 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer text-gray-400"
                            />
                            <img
                              src={Twitter || "/placeholder.svg"}
                              alt="Twitter"
                              className="w-2 h-2 xl:w-2.5 xl:h-2.5 cursor-pointer text-gray-400"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1 overflow-hidden">
                          <span className="text-white text-xs truncate max-w-[5rem] font-['Inter'] text-[0.625rem]">
                            {investor.company || investor.firm || investor.fund}
                          </span>
                          <span className="text-white text-[0.5rem] font-bold rounded-full bg-blue-600 w-[1.875rem] h-4 flex items-center justify-center flex-shrink-0 font-['Inter']">
                            {investor.type === "ACCELERATOR" ? "ACC" : "VC"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between flex-grow gap-x-2 sm:gap-x-4 md:gap-x-6 xl:gap-x-10 min-w-0">
                      <div className="bg-[#18002C] text-white text-xs font-semibold w-20 h-6 rounded-sm flex items-center justify-center flex-shrink-0 font-['Inter'] text-[0.625rem]">
                        {investor.checkSize || investor.check_size || 
                (investor.check_size_ranges && investor.check_size_ranges.length > 0 ? 
                  investor.check_size_ranges[0] : "$N/A")}
                      </div>

                      <div className="flex flex-col  gap-y-1 flex-shrink-0">
                        <div className="bg-[#18002C] text-white text-xs font-semibold w-20 h-6 rounded-sm flex items-center justify-center font-['Inter'] text-[0.625rem]">
                          {investor.stage || 
             (investor.invests_in_rounds && investor.invests_in_rounds.length > 0 ? 
              investor.invests_in_rounds[0] : "N/A")}
                        </div>
                        <div className="bg-[#18002C] text-white text-xs font-semibold w-6 h-6 rounded-sm flex items-center justify-center font-['Inter'] text-[0.625rem]">
                          {investor.stageCount ||   (investor.invests_in_rounds ? `+${investor.invests_in_rounds.length - 1}` : "+0")}
                        </div>
                      </div>

                      <div className="flex flex-col  gap-y-1 flex-shrink-0">
                        <div className="bg-[#18002C] text-white text-xs font-semibold w-16 h-6 rounded-sm flex items-center justify-center font-['Inter'] text-[0.625rem]">
                          {investor.industry || 
               (investor.sectors && investor.sectors.length > 0 ? 
                investor.sectors[0] : "N/A")}
                        </div>
                        <div className="bg-[#18002C] text-white text-xs font-semibold w-6 h-6 rounded-sm flex items-center justify-center font-['Inter'] text-[0.625rem]">
                          {investor.industryCount || (investor.sectors ?  `+${investor.sectors.length - 1}` : "+0")}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <div className="flex items-center gap-1 bg-[#18002C] rounded-sm px-1 py-0.5">
                          <div className="w-5 h-3 flex items-center justify-center">
                            <img src="/placeholder.svg?height=12&width=20" alt="Flag" />
                          </div>
                        </div>
                        <div className="bg-[#18002C] text-white text-xs font-semibold w-6 h-6 rounded-sm flex items-center justify-center font-['Inter'] text-[0.625rem]">
                          {investor.geography || 
                (investor.geographies && investor.geographies.length > 0 ? 
                 `+${investor.geographies.length}` : "+0")}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: getMatchColor(investor.matchValue) }}
                        ></div>
                        <span className="text-white text-base font-semibold font-['Inter']">{investor.match}</span>
                      </div>

                      <button
                        className="text-white text-xs font-medium rounded w-15 h-7 flex-shrink-0 font-['Inter'] text-[0.625rem]"
                        style={{
                          background:
                            "linear-gradient(260deg, rgba(0, 0, 0, 0.25) -22.9%, rgba(252, 65, 65, 0.25) 119.49%), linear-gradient(99deg, #000 -4%, #33005C 104%)",
                        }}
                      >
                        Submit
                      </button>

                      <div className="relative flex-shrink-0">
                        <button
                          className="hover:opacity-70 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveDropdown(activeDropdown === investor.id ? null : investor.id)
                          }}
                        >
                          <MoreVertical className="w-6 h-6 text-gray-400" />
                        </button>                        {activeDropdown === investor.id && (
                          <div className="absolute right-0 top-full mt-1 z-50 border w-[8.0625rem] h-[5.125rem] rounded border-[#0F0E16] bg-black shadow-lg">
                            <div className="py-1">{[
                                { text: "Add to pipeline", icon: "💰", action: () => console.log("Add to pipeline clicked") },
                                { text: "Remove from list", icon: "🗑️", action: () => handleRemoveInvestor(investor.id || investor._id) },
                                { text: "Report an error", icon: "⚠️", action: () => console.log("Report error clicked") },
                              ].map((item, index) => (
                                <button
                                  key={index}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    item.action();
                                  }}
                                  className="w-full flex items-center gap-2 px-2 py-1 text-left hover:text-white transition-colors text-[#B8B8B8] font-['Inter'] text-[0.5rem] font-normal h-5 hover:bg-[#33005C]"
                                >
                                  <div className="flex-shrink-0 bg-gray-300 rounded flex items-center justify-center text-xs w-3 h-3">
                                    {item.icon}
                                  </div>
                                  {item.text}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Info and Pagination Container for Investor List */}
              <div className="flex items-center justify-between mt-auto pt-6">
                <div className="flex items-center justify-center w-[9.375rem] h-[1.875rem] rounded-[0.125rem] bg-black text-[#B8B8B8] font-['Inter'] text-[0.5rem] font-normal">
                  {investors.length} results found | 10 per page
                </div>

                <div className="flex items-center gap-2 text-[#B8B8B8] font-['Inter'] text-[0.5rem] font-normal">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="w-[1.02081rem] h-4 rounded-[0.125rem] border-none font-['Inter'] text-[0.5rem] font-bold flex items-center justify-center"
                    style={{
                      background: currentPage === 1 ? "rgba(51, 0, 92, 0.35)" : "#33005C",
                      color: currentPage === 1 ? "#353535" : "#AD6FDE",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    &lt;
                  </button>
                  <span>Page</span>
                  <span className="w-[1.40363rem] h-4 rounded-[0.125rem] bg-[#33005C] text-[#AD6FDE] font-['Inter'] text-[0.5rem] font-bold flex items-center justify-center">
                    {currentPage.toString().padStart(3, "0")}
                  </span>
                  <span>of {totalPages || 1}</span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="w-[1.02081rem] h-4 rounded-[0.125rem] border-none font-['Inter'] text-[0.5rem] font-bold flex items-center justify-center"
                    style={{
                      background: currentPage === totalPages || totalPages === 0 ? "rgba(51, 0, 92, 0.35)" : "#33005C",
                      color: currentPage === totalPages || totalPages === 0 ? "#353535" : "#AD6FDE",
                      cursor: currentPage === totalPages || totalPages === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <AddInvestorsPopup
          isOpen={isAddInvestorsPopupOpen}
          onClose={() => setIsAddInvestorsPopupOpen(false)}
          onInvestorsAdded={handleInvestorsAdded}
          selectedList={selectedList}
        />
        <InviteAndCollab 
          isOpen={showInviteCollab} 
          onClose={() => setShowInviteCollab(false)} 
          listId={selectedList?.id}
        />
      </div>
    )
  }

  return (
    <div className="pt-12" onClick={closeMenu}>
      {/* Header Section */}
      <div className="mb-8">
        {/* Search and New List Section */}
        <div className="flex justify-between items-center mb-10">
          {/* Search Bar */}
          <div className="relative w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <img src={SearchIcon || "/placeholder.svg"} alt="Search Icon" className="w-4 h-4 text-gray-400" />
            </div>

            <input
              type="text"
              placeholder="Search target list..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 h-10 rounded border-2 border-black bg-[#0F0E16] pl-10 pr-4 bg-transparent focus:outline-none font-['Inter'] text-xs font-normal text-[#B8B8B8]"
            />
          </div>

          {/* New List Button */}
          <button
            onClick={handleNewListClick}
            className="flex items-center justify-center transition-colors hover:bg-purple-700 w-30 h-10 rounded bg-[#5F248D] gap-2"
          >
            <img src={AddIcon || "/placeholder.svg"} alt="Add" className="w-[1.125rem] h-[1.125rem]" />
            <span className="text-white font-['Inter'] text-sm font-medium">New list</span>
          </button>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="w-full h-20 flex items-center justify-center">
            <div className="text-white">Loading lists...</div>
          </div>
        )}
        
        {/* User Created Target Lists */}
        {!isLoading && userTargetLists.map((list) => (
          <div
            key={list.id}
            onClick={() => handleListClick(list)}
            className="rounded-lg cursor-pointer transition-all hover:bg-opacity-80 mb-4 relative w-full h-[11.125rem] rounded-lg bg-[#0F0E16] p-8 flex items-center gap-8"
          >
            {/* Profile Cover */}
            <div
              className="w-30 h-30 rounded flex-shrink-0 flex items-center justify-center"
              style={{
                background: list.cover === "default" ? "#0F0E16" : coverOptions[list.cover],
                border: list.cover === "default" ? "1px dashed #5F248D" : "none",
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
              <h3 className="text-white font-['Inter'] text-2xl font-semibold mb-2">{list.name}</h3>

              <div className="flex items-center gap-2 mb-2 text-[0.625rem]">
                <span className="font-['Inter'] font-normal text-white">Created by {list.createdBy}</span>
                <div className="w-[0.1875rem] h-[0.1875rem] bg-[#AD6FDE] rounded-full"></div>
                <span className="font-['Inter'] font-normal text-white">{list.createdDate}</span>
                <div className="w-[0.1875rem] h-[0.1875rem] bg-[#AD6FDE] rounded-full"></div>
                <span className="font-['Inter'] font-normal text-white">{list.updatedDate}</span>
              </div>

              {/* Investor Count Badge */}
              <div className="flex items-center justify-center w-21 h-[1.3125rem] rounded-[6.25rem] bg-[#33005C] text-white font-['Inter'] text-[0.5rem] font-semibold">
                {list.investorCount} INVESTORS
              </div>
            </div>

            {/* Three Dots Menu - Only show if list has investors */}
            {list.investorCount > 0 && (
              <div className="relative">
                <button
                  onClick={(e) => handleThreeDotsClick(e, list.id)}
                  className="p-2 hover:bg-gray-700 rounded transition-colors text-[#B8B8B8]"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="2" r="1.5" />
                    <circle cx="8" cy="8" r="1.5" />
                    <circle cx="8" cy="14" r="1.5" />
                  </svg>
                </button>
                <ThreeDotsMenu
                  isOpen={activeMenuId === list.id}
                  onClose={() => setActiveMenuId(null)}
                  listId={list.id}
                  isVertxCreated={list.createdBy === "VERTX"}
                  onEditName={() => handleEditNameClick(list)}
                  onDelete={handleDeleteList}
                />
              </div>
            )}
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
              investors: [],
            })
          }
          className="rounded-lg cursor-pointer transition-all hover:bg-opacity-80 relative w-full h-[11.125rem] rounded-lg bg-[#0F0E16] p-8 flex items-center gap-8"
        >
          {/* Profile Placeholder */}
          <div className="w-30 h-30 rounded flex-shrink-0 bg-gradient-to-br from-purple-600 to-blue-500"></div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-white font-['Inter'] text-2xl font-semibold mb-2">Matched Investors for you</h3>

            <div className="flex items-center gap-2 mb-2 text-[0.625rem]">
              <span className="font-['Inter'] font-normal text-white">Created by VERTX</span>
              <div className="w-[0.1875rem] h-[0.1875rem] bg-[#AD6FDE] rounded-full"></div>
              <span className="font-['Inter'] font-normal text-white">28/05/2025</span>
              <div className="w-[0.1875rem] h-[0.1875rem] bg-[#AD6FDE] rounded-full"></div>
              <span className="font-['Inter'] font-normal text-white">Updated 1 day ago</span>
            </div>

            {/* Investor Count Badge */}
            <div className="flex items-center justify-center w-21 h-[1.3125rem] rounded-[6.25rem] bg-[#33005C] text-white font-['Inter'] text-[0.5rem] font-semibold">
              10 INVESTORS
            </div>
          </div>

          {/* Three Dots Menu */}
          <div className="relative">
            <button
              onClick={(e) => handleThreeDotsClick(e, "matched-investors")}
              className="p-2 hover:bg-gray-700 rounded transition-colors text-[#B8B8B8]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="2" r="1.5" />
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="8" cy="14" r="1.5" />
              </svg>
            </button>
            <ThreeDotsMenu
              isOpen={activeMenuId === "matched-investors"}
              onClose={() => setActiveMenuId(null)}
              listId="matched-investors"
              isVertxCreated={true}
              onEditName={handleEditNameClick}
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

      {/* Delete Notification Toast */}
      <div
  className={`fixed top-4 right-4 z-[100] transition-all duration-600 ease-in-out ${
    showDeleteNotification ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
  }`}
>
  <div className="max-w-xs sm:max-w-sm md:max-w-md whitespace-nowrap rounded-md border border-[#18152D] bg-black flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 shadow-lg">
    <span className="text-white font-inter text-sm sm:text-base font-medium">List deleted successfully!</span>
  </div>
</div>
    </div>
  )
}
