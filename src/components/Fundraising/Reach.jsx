// src/components/Reach.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from "../Sidebar";
import BgImg from "../../assets/imgBackground.png";
import { useStartupProfile } from "../../context/StartupProfileContext";
import API_KEY from "../../../key";
import BasicInfoForm from "./BasicForm";
import Image from "./img.jpg"

const Reach = () => {
  const { profileData } = useStartupProfile();

  const [activeTab, setActiveTab] = useState("One Pager");
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

  const tabsArray = ["One Pager", "Find", "Target"];
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

    if (profileData?.id) fetchRounds();
  }, [profileData?.id]);

  // File Upload Handlers
  const openFilePicker = () => fileRef.current?.click();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type) || file.size > 10 * 1024 * 1024) {
      setUploadError('Invalid file. Only PDF/PPT/PPTX up to 10 MB allowed.');
      return;
    }

    setUploadError('');
    setDeck(file);
    setDeckUrl(URL.createObjectURL(file));
  };

  const removeDeck = () => {
    if (deckUrl) {
      URL.revokeObjectURL(deckUrl);
    }
    setDeck(null);
    setDeckUrl('');
    setUploadError('');
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== "Target") setIsTargetListSelected(false);
  };

  const renderHeader = () => {
    if (activeTab === "Target" && isTargetListSelected) return null;
    return (
      <div
        className="relative w-full h-[182px] bg-no-repeat bg-[length:100%_100%] bg-center"
        style={{ backgroundImage: `url("${BgImg}")` }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 flex flex-col justify-between h-full px-9 pt-10 pb-6 md:px-14 md:pt-16">
          <div>
            <h1 className="text-[2rem] font-semibold text-white" style={{ fontFamily: "Inter" }}>
              {profileData?.companyName || "Company"}
            </h1>
            <p className="mt-1 text-xs font-semibold text-white" style={{ fontFamily: "Inter" }}>
              {profileData
                ? `${profileData.companyName} helps A to solve B by addition of C and D.`
                : "This company helps A to solve B by addition of C and D."}
            </p>
            <p className="mt-2 text-[0.625rem] font-medium text-white" style={{ fontFamily: "Inter" }}>
              {profileData?.companyWebsite || "www.companyname.com"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderTabs = () => {
    if (activeTab === "Target" && isTargetListSelected) return null;
    return (
      <div className="flex gap-4 px-9 mt-6 md:px-14">
        {tabsArray.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`h-10 rounded-full text-base transition-colors duration-150 ${
              activeTab === tab
                ? "w-[100px] bg-white text-black font-medium"
                : "w-[80px] bg-[#0F0E16] text-[#656565] font-normal"
            }`}
            style={{ fontFamily: "Inter" }}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  };

  const renderSubTabs = () => (
    <div className="flex gap-8">
      {subTabs.map((sub) => (
        <div key={sub} className="relative">
          <button
            onClick={() => setActiveSubTab(sub)}
            className="pb-2 text-sm sm:text-base font-medium transition-colors"
            style={{
              color: activeSubTab === sub ? "#FFFFFF" : "#B8B8B8",
              fontFamily: "Inter",
            }}
          >
            {sub}
          </button>
          {activeSubTab === sub && (
            <div 
              className="absolute bottom-0 left-0 h-1 rounded-full bg-[#AD6FDE]" 
              style={{ 
                width: sub === "Link" ? "32px" : 
                       sub === "Intro" ? "40px" : 
                       sub === "Analytics" ? "64px" : "56px" 
              }} 
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderLinkContent = () => {
    if (deck) {
      return (
        <div className="flex flex-col items-center justify-center max-w-6xl w-full">
        {/* Preview + Buttons */}
        <div className="flex items-center w-full gap-8">
          {/* Preview Card */}
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
      
            {/* Replace & Delete Buttons */}
            <div className="absolute bottom-2 left-2 flex gap-2">
              <button
                onClick={openFilePicker}
                className="px-3 py-1 text-sm bg-neutral-800 text-white rounded hover:bg-neutral-700"
              >
                REPLACE
              </button>
              <button
                onClick={removeDeck}
                className="px-3 py-1 text-sm bg-red-700 text-white rounded hover:bg-red-600"
              >
                DELETE
              </button>
            </div>
          </div>
      
          {/* Action Buttons */}
          <div className="flex flex-col gap-4 items-start">
          <button
            className="h-12 px-6 bg-white text-black font-semibold rounded hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-purple-600 transition"
            onClick={() => setShowModal(true)}
          >
            Upgrade deck
          </button>
          <button
            className="h-12 px-6 bg-neutral-800 text-white font-semibold rounded hover:bg-neutral-700 focus-visible:ring-2 focus-visible:ring-purple-600 transition"
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

    // Upload Interface (when no file)
    return (
      <section
        className="min-h-[calc(100vh-11.5rem)] bg-center bg-cover flex items-center justify-center"
        style={{
          backgroundImage: `url(${Image})`,
        }}
      >
        <div className=" w-full h-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6 text-white">
              The only link you need for fundraising.
            </h2>

            <button 
              onClick={openFilePicker}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded cursor-pointer hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-purple-600 transition-colors"
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
          <div className="min-h-[40vh] flex items-center justify-center">
            <h2 className="text-neutral-400 text-lg">Intro content coming soon.</h2>
          </div>
        );
      case "Analytics":
        return (
          <div className="min-h-[40vh] flex items-center justify-center">
            <h2 className="text-neutral-400 text-lg">Analytics dashboard in progress.</h2>
          </div>
        );
      case "Settings":
        return (
          <div className="min-h-[40vh] flex items-center justify-center">
            <h2 className="text-neutral-400 text-lg">Settings panel coming soon.</h2>
          </div>
        );
      default:
        return renderLinkContent();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex relative">
      <Sidebar />
      <div className="flex-1 h-screen overflow-y-auto">
        {renderHeader()}
        {renderTabs()}

        <div className="pt-8 px-9 md:px-14 mb-8">
          {activeTab === "One Pager" && (
            <>
              {renderSubTabs()}
              <div className="mt-6">
                {renderSubTabContent()}
              </div>
            </>
          )}

          {activeTab === "Find" && (
            <div className="min-h-[40vh] flex items-center justify-center">
              <h2 className="text-neutral-400 text-lg">Find Investors content coming soon.</h2>
            </div>
          )}

          {activeTab === "Target" && (
            <div className="min-h-[40vh] flex items-center justify-center">
              <h2 className="text-neutral-400 text-lg">Target content coming soon.</h2>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.ppt,.pptx"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>


      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-xl text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <BasicInfoForm formData={formData} setFormData={setFormData} />;
          </div>
        </div>
      )}
     
     {/* <AddRoundPopup1 isOpen={isPopupOpen} onClose={handleClosePopup} onNext={handleNextClick} /> */}
    </div>
  );
};

export default Reach;
