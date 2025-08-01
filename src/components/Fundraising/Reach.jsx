// src/components/Reach.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from "../Sidebar";
import BgImg from "./img.jpg";
import { useStartupProfile } from "../../context/StartupProfileContext";
import API_KEY from "../../../key";
import BasicInfoForm from "./BasicForm";
import Image from "./img.jpg"
import ReachImage from "../../assets/Rectangle 119.png"; 

const Reach = () => {
  const { profileData } = useStartupProfile();

  const [activeTab, setActiveTab] = useState("Reach Link");
  const [activeSubTab, setActiveSubTab] = useState("Link");
  const [isTargetListSelected, setIsTargetListSelected] = useState(false);
  const [fundingRounds, setFundingRounds] = useState([]);
  const [roundData, setRoundData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // PDF Upload States
  const [deck, setDeck] = useState(null);
  const [deckUrl, setDeckUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef(null);
  const [hasReachlink, setHasReachlink] = useState(false); 


  const subTabs = ["Link", "Intro", "Analytics", "Settings"];

  const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const res = await fetch(`${API_KEY}/rounds?startupId=${profileData?.id}`);
        const data = await res.json();
        setFundingRounds(data);
        if (data.length) setRoundData(data[0]);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUpgradeDeck = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch(`${API_KEY}/api/upgrade-deck`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (data.success && data.data) {
          // If we have upgrade deck data, update the form data
          setFormData(data.data);
          
          // If we have a reachLink, update the hasReachlink state
          if (data.data.reachLink) {
            setHasReachlink(true);
          }
          
          // If we have a deck URL, update the deckUrl state
          if (data.data.deckUrl) {
            setDeckUrl(data.data.deckUrl);
          }
        }
      } catch (err) {
        console.error('Error fetching upgrade deck data:', err);
      }
    };

    if (profileData?.id) {
      fetchRounds();
      fetchUpgradeDeck();
    }
  }, [profileData?.id]);

  const openFilePicker = () => fileRef.current?.click();
  const handleFileSelect = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
  
      if (!allowedTypes.includes(file.type) || file.size > 10 * 1024 * 1024) {
        setUploadError('Invalid file. Only PDF/PPT/PPTX up to 10 MB allowed.');
        return;
      }
  
      setUploadError('');
      if(deckUrl) URL.revokeObjectURL(deckUrl); // revoke old blob URL if any
      
      // Show local preview while uploading
      setDeckUrl(URL.createObjectURL(file));
      setDeck({ name: file.name, type: file.type, url: URL.createObjectURL(file) });
  
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
  
      const formData = new FormData();
      formData.append('file', file);
  
      const uploadResponse = await fetch(`${API_KEY}/api/files/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
  
      if (!uploadResponse.ok) {
        let errorMessage;
        try {
          const errorData = await uploadResponse.json();
          errorMessage = errorData.error || errorData.message || 'File upload failed';
        } catch (parseError) {
          // If we can't parse JSON, it might be an HTML error page
          errorMessage = `Server error (${uploadResponse.status}): Unable to parse response`;
        }
        throw new Error(errorMessage);
      }
  
      let uploadResult;
      try {
        uploadResult = await uploadResponse.json();
      } catch (parseError) {
        throw new Error('Server returned invalid JSON response');
      }
  
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'File upload failed');
      }
  
      // Use remote URL from server now
      setDeckUrl(uploadResult.file.fileUrl);
      setDeck({ name: file.name, type: file.type, url: uploadResult.file.fileUrl });
  
      // Update backend deck info
      const upgradeDeckData = {
        deckFileName: file.name,
        deckUrl: uploadResult.file.fileUrl,
      };
  
      const response = await fetch(`${API_KEY}/api/upgrade-deck`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(upgradeDeckData),
      });
  
      const data = await response.json();
  
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error updating deck information');
      }
  
      setFormData(data.data);
      if (data.data.reachLink) setHasReachlink(true);
  
    } catch (error) {
      console.error('Error in file upload process:', error);
      setUploadError(error.message || 'Failed to upload file.');
      setDeck(null);
      if (deckUrl) URL.revokeObjectURL(deckUrl);
      setDeckUrl('');
    }
  };
  

  const removeDeck = async () => {
    if (deckUrl) {
      URL.revokeObjectURL(deckUrl);
    }
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      // Update the upgrade deck data to remove deck information
      const updatedFormData = {
        ...formData,
        deckFileName: null,
        deckUrl: null
      };
      
      const response = await fetch(`${API_KEY}/api/upgrade-deck`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedFormData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update form data with the response
        setFormData(data.data);
      } else {
        console.error('Error updating upgrade deck data:', data.message);
      }
    } catch (error) {
      console.error('Error removing deck:', error);
    }
    
    // Update local state
    setDeck(null);
    setDeckUrl('');
    setUploadError('');
    if (fileRef.current) {
      fileRef.current.value = '';
    }
    setHasReachlink(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== "Outreach") setIsTargetListSelected(false);
  };



  const renderSubTabs = () => (
    <div className="flex gap-8 font-[Inter]">
      {subTabs.map((sub) => (
        <div key={sub} className="relative inline-block">
          <button
            onClick={() => setActiveSubTab(sub)}
            className="pb-2 text-sm sm:text-base font-medium text-left transition-colors"
            style={{
              color: activeSubTab === sub ? "#FFFFFF" : "#B8B8B8",
            }}
          >
            <span className="px-1">{sub}</span>
          </button>
  
          {activeSubTab === sub && (
            <div
              className="absolute -bottom-[2px] left-1/2 h-1 rounded-full bg-[#AD6FDE]"
              style={{
                width: 'calc(100% + 8px)',
                transform: 'translateX(-50%)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
  

  const renderLinkContent = () => {
    if (hasReachlink && deck) { 
      return (
        <div className="flex flex-col items-center font-[inter] justify-center max-w-6xl w-full">
        <div className="flex items-center justify-center mx-auto w-full lg:gap-12 xl:gap-16 md:gap-8 gap-4">
          <div className="relative bg-neutral-900 rounded-lg overflow-hidden shadow-lg w-[480px] h-[280px]">
            {deck.type === 'application/pdf' ? (
              <iframe title="Deck preview" src={deckUrl} className="w-full h-full" />
            ) : deck.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ? (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(deckUrl)}`}
                title="PPT Preview"
                className="w-full h-full"
              />
            ) : deck.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(deckUrl)}`}
                title="DOC Preview"
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white text-center px-6">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-lg font-semibold mb-2">{deck.name}</h3>
                <p className="text-sm text-neutral-400">No preview available</p>
              </div>
            )}
            <div className=" absolute justify-between w-full right-2 bottom-2 font-[inter] left-2 flex gap-2">
              <button
                onClick={openFilePicker}
                className="px-3 py-1 text-sm bg-neutral-800 text-white rounded hover:bg-neutral-700"
              >
                REPLACE
              </button>
              <button
                onClick={removeDeck}
                className="px-3 py-1 text-sm bg-red-700 mr-4 text-white rounded hover:bg-red-600"
              >
                DELETE
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 items-start">
          <button
            className="h-12 px-6 bg-white min-w-[240px] text-black font-semibold rounded hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-purple-600 transition"
            onClick={() => {
              // Open the form modal with existing data
              setShowModal(true);
            }}
          >
            Upgrade deck
          </button>
          <button
            className="h-12 px-6 bg-neutral-800 min-w-[240px] text-white font-semibold rounded hover:bg-neutral-700 focus-visible:ring-2 focus-visible:ring-purple-600 transition"
          >
            I prefer to keep it short
          </button>
        </div>
        </div>

        {/* Bottom Text */}
        <p className="mt-8 text-sm text-neutral-200 max-w-xl text-center">
          Upgrade your deck with team and traction data. Founders who do this typically land 40% more meetings.
        </p>
      </div>

      );
    }

    // "No active Reachlinks" view
    if (!hasReachlink) {
      return (
        <div
  style={{
    // backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.76), rgba(0, 0, 0, 0.76)), url(${ReachImage})`,
    backgroundImage : `url(${ReachImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  }}
  className="w-[52.5rem] h-[27rem] flex-shrink-0 rounded-lg font-[inter] flex items-center justify-center  max-w-full sm:w-[90%] sm:h-[22rem] xs:h-[18rem]"
>
  <div className="text-center px-4">
    <h2 className="text-2xl font-semibold mb-6 text-white">
      You have no active Reachlinks.
    </h2>
    <button
      onClick={() => setHasReachlink(true)}
      className="inline-flex items-center gap-2 px-6 py-3 bg-[#5F248D] text-white rounded cursor-pointer hover:bg-purple-600 focus-visible:ring-2 focus-visible:ring-purple-600 transition-colors"
      style={{ fontFamily: "Inter" }}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Create link
    </button>
  </div>
</div>

      );
    }

    return (
      <section
      className="min-h-[calc(75vh-11.5rem)] rounded-lg bg-center bg-cover flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.76), rgba(0, 0, 0, 0.76)), url(${BgImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
        <div className=" w-full h-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6 text-white">
              The only link you need for fundraising.
            </h2>

            <button
              onClick={openFilePicker}
              className="inline-flex font-semibold items-center gap-2 px-6 py-3 bg-white text-black rounded cursor-pointer hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-purple-600 transition-colors"
              style={{ fontFamily: "Inter" }}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Upload deck
            </button>

            <p className="mt-2 text-xs text-neutral-300 font-medium">
              .PDF | .PPT | .PPTX | 10MB Limit
            </p>

            {uploadError && (
              <p className="mt-2 text-sm text-red-400 font-medium">
                {uploadError}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case "Link":
        return renderLinkContent();
      case "Intro":
        return (
          <div className="min-h-[40vh] font-[inter] flex items-center justify-center">
            <h2 className="text-neutral-400 text-lg">Intro content coming soon.</h2>
          </div>
        );
      case "Analytics":
        return (
          <div className="min-h-[40vh] font-[inter] flex items-center justify-center">
            <h2 className="text-neutral-400 text-lg">Analytics dashboard in progress.</h2>
          </div>
        );
      case "Settings":
        return (
          <div className="min-h-[40vh] font-[inter] flex items-center justify-center">
            <h2 className="text-neutral-400 text-lg">Settings panel coming soon.</h2>
          </div>
        );
      default:
        return renderLinkContent();
    }
  };

  return (
    <div className="min-h-screen font-[inter] bg-black text-white flex relative">

      <div className="flex-1 h-screen overflow-y-auto">

        <div className="pt-8 px-9 md:px-14 mb-8">
          {activeTab === "Reach Link" && (
            <>
              {renderSubTabs()}
              <div className="mt-6 font-[inter]">
                {renderSubTabContent()}
              </div>
            </>
          )}

          {activeTab === "One Pager" && (
            <div className="min-h-[40vh] font-[inter] flex items-center justify-center">
              <h2 className="text-neutral-400 text-lg">One Pager content coming soon.</h2>
            </div>
          )}

          {activeTab === "Outreach" && (
            <div className="min-h-[40vh] font-[inter] flex items-center justify-center">
              <h2 className="text-neutral-400 text-lg">Outreach content coming soon.</h2>
            </div>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.ppt,.pptx"
          onChange={handleFileSelect}
          className="hidden font-[inter]"
        />
      </div>

      <BasicInfoForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default Reach;