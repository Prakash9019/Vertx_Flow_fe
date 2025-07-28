// BasicInfoForm.jsx
import { useState, useEffect } from "react";
import Rectangle82 from "../../assets/Rectangle 82.png";
import BgImg from "./img.jpg";
import LinkLiveModal from "./LinkLiveModal";

export default function BasicInfoForm({ isOpen = true, onClose = () => {}, formData = {}, setFormData = () => {} }) {
  const sectorsList = [
    'Advertising', 'AgTech', 'AI', 'Analytics', 'AR/VR', 'AudioTech', 'AutoTech', 'BioTech', 'Chemicals',
    'ClimateTech/CleanTech', 'Cloud Infrastructure', 'ConstructionTech', 'Consumer Health', 'Consumer Internet',
    'Cosemetics', 'Creator/Passion Economy', 'Cybersecurity', 'Data Services', 'DeepTech', 'DefenseTech',
    'DeveloperTools', 'Diagnostics', 'Digital Health', 'DTC', 'Drug Delivery', 'E-Commerce', 'Education',
    'EnergyTech', 'Enterprise', 'Enterprise Applications', 'Enterprise Infrastructure', 'Entertainment & Sports',
    'Fashion', 'FinTech', 'Food and Beverage', 'Future of Work', 'Games', 'Gaming/ESports', 'General Tech',
    'GenTech/AI', 'Gig Economy', 'GovTech', 'Hardware', 'Health & Hospital Services', 'Health IT',
    'Human Capital/HRTech', 'Impact', 'Insurance', 'IoT', 'LegalTech', 'Local Services', 'Lodging/Hospitality',
    'Logistics', 'Manufacturing', 'MarketingTech', 'Marketplaces', 'Material Science', 'Media/Content',
    'Medical Devices', 'Messaging', 'Parenting/Families', 'Payments', 'Pharmaceuticals', 'Real Estate/PropTech',
    'Retail', 'Robotics', 'SaaS', 'Sales & CRM', 'Security', 'Semiconductors', 'Smart Cities/UrbanTech',
    'SMB Software', 'Social Commerce', 'Social Networks', 'Space', 'Supply Chain Tech', 'Therapeutics',
    'TransportationTech', 'Travel', 'Web3/Blockchain', 'Web3/Crypto', 'Wellness & Fitness'
  ];

  const [localFormData, setLocalFormData] = useState({
    companyName: formData?.companyName || "",
    linkedinUrl: formData?.linkedinUrl || "",
    founderName: formData?.founderName || "",
    founderLinkedinUrl: formData?.founderLinkedinUrl || "",
    founderEmail: formData?.founderEmail || "",
    founded: formData?.founded || "",
    companyWebsite: formData?.companyWebsite || "https://",
    businessCategory: formData?.businessCategory || "B2C",
    businessSectors: formData?.businessSectors || [],
    companyDescription: formData?.companyDescription || "", // New field for Company
    marketOpportunity: formData?.marketOpportunity || "", // New field for Market
    businessModel: formData?.businessModel || "", // New field for Business Model
    tractionMetrics: formData?.tractionMetrics || "", // New field for Traction
    raisedAmount: formData?.raisedAmount || "", // New field for Fundraising
    raisedFrom: formData?.raisedFrom || [], // New field for Fundraising (array for checkboxes)
    fundraisingTarget: formData?.fundraisingTarget || "", // New field for Fundraising
    // Deck is handled by the parent component (Reach.jsx) for file upload/preview,
    // but you could add a field here if you need to store metadata about the deck.
    ...formData
  });

  // Define the order of views/steps
  const views = ["profile", "basics", "team", "company", "market", "business-model", "traction", "fundraising", "deck"];
  const [currentView, setCurrentView] = useState(views[0]); // Start with the first view

  // New state for the "Your link is live!" modal
  const [isLinkLiveModalOpen, setIsLinkLiveModalOpen] = useState(false);
  // Example for a static Reachlink, in a real app this would be generated
  const [reachLink, setReachLink] = useState("https://re.hink.govrtx.com/reach/fguccyyyyfz");


  // Sync localFormData with parent's formData when parent updates
  useEffect(() => {
    setLocalFormData(prev => ({ ...prev, ...formData }));
  }, [formData]);

  const handleInputChange = (field, value) => {
    setLocalFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Update parent component's formData
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSectorToggle = (sector) => {
    const currentSectors = localFormData.businessSectors;
    let newSectors;

    if (currentSectors.includes(sector)) {
      newSectors = currentSectors.filter(s => s !== sector);
    } else {
      if (currentSectors.length < 3) {
        newSectors = [...currentSectors, sector];
      } else {
        return; // Don't add more than 3
      }
    }
    handleInputChange('businessSectors', newSectors);
  };

  const handleRaisedFromToggle = (source) => {
    const currentSources = localFormData.raisedFrom;
    let newSources;

    if (currentSources.includes(source)) {
      newSources = currentSources.filter(s => s !== source);
    } else {
      newSources = [...currentSources, source];
    }
    handleInputChange('raisedFrom', newSources);
  };

  const handleBack = () => {
    const currentIndex = views.indexOf(currentView);
    if (currentIndex > 0) {
      setCurrentView(views[currentIndex - 1]);
    } else {
      onClose();
    }
  };

  const handleNext = () => {
    const currentIndex = views.indexOf(currentView);
    if (currentIndex < views.length - 1) {
      setCurrentView(views[currentIndex + 1]);
    } else {
      console.log("Form Completed:", localFormData);
      // Instead of closing the form, open the LinkLiveModal
      setIsLinkLiveModalOpen(true);
      // Optionally, you can also close the BasicInfoForm if you want it to disappear
      // onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleLinkLiveModalClose = () => {
    setIsLinkLiveModalOpen(false);
    onClose(); // Close the BasicInfoForm as well when the link live modal is closed
  };

  // Helper function to render common input styles
  const renderInput = (type, field, placeholder, label) => (
    <div>
      <label className="block text-white font-['Inter'] text-base font-medium mb-4">
        {label}
      </label>
      <input
        type={type}
        value={localFormData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full h-9 bg-white/11 text-white outline-none rounded-[0.125rem] px-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal"
        placeholder={placeholder}
      />
    </div>
  );

  // Helper function to render common textarea styles
  const renderTextarea = (field, placeholder, label, maxLength) => (
    <div>
      <label className="block text-white font-['Inter'] text-base font-medium mb-4">
        {label}
      </label>
      <textarea
        value={localFormData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full h-32 bg-white/11 text-white outline-none rounded-[0.125rem] px-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal resize-none"
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {maxLength && (
        <p className="text-right text-[#656565] text-xs font-['Inter'] mt-1">
          {maxLength - (localFormData[field]?.length || 0)} chars left
        </p>
      )}
    </div>
  );

  if (!isOpen && !isLinkLiveModalOpen) return null; // Only render if either modal is open

  return (
    <>
      {/* BasicInfoForm Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dimmed background overlay */}
          <div className="absolute inset-0 bg-black/70 cursor-pointer" onClick={handleCancel} />

          {/* Main modal content container with background image */}
          <div
            className="relative flex flex-col items-center bg-cover bg-center bg-no-repeat
                      w-full max-w-6xl h-[calc(100vh-1rem)] sm:h-[calc(100vh-7.5rem)] overflow-y-auto "
            style={{
              backgroundImage: `url(${Rectangle82})`, // Use the imported image
            }}
          >
            {/* Header with gradient background */}
            <div className="relative h-32 w-full">
              <div className="absolute inset-0" />
              <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6">
                <h1 className="text-white text-2xl font-semibold mb-2 font-['Inter']">
                  {currentView === "profile" && "Profile Information"}
                  {currentView === "basics" && "Company Information"}
                  {currentView === "team" && "Founder's Information"}
                  {currentView === "company" && "Company Description"}
                  {currentView === "market" && "Market Opportunity"}
                  {currentView === "business-model" && "Business Model"}
                  {currentView === "traction" && "Potential metrics to highlight your company"}
                  {currentView === "fundraising" && "Fundraising Information"}
                  {currentView === "deck" && "Pitch Deck"}
                </h1>
                <p className="text-white/90 text-sm font-normal font-['Inter']">
                  {currentView === "profile" && "Start by adding your profile and contact information"}
                  {currentView === "basics" && "Let's fill some basic information about your company."}
                  {currentView === "team" && "Add your founding team profile details"}
                  {currentView === "company" && "Describe what your company does in one sentence"}
                  {currentView === "market" && "What is the market opportunity and why will it be really big?"}
                  {currentView === "business-model" && "How do you make money? Who pays? What are the margins?"}
                  {currentView === "traction" && "Highlight key achievements, milestones, and user engagement."}
                  {currentView === "fundraising" && "Tell us about your fundraising history and targets."}
                  {currentView === "deck" && "Upload your pitch deck here."}
                </p>
              </div>
            </div>

            {/* Main content area - centered form with sidebar overlay */}
            <div className="w-full flex items-start justify-center relative mb-5">
              {/* Sidebar - positioned absolutely to overlay */}
              <div className="absolute left-0 top-0 w-64 h-full p-6 overflow-y-auto flex items-start justify-center z-10">
                <div className="space-y-1">
                  <div
                    className={`font-medium mb-1 font-['Inter'] cursor-pointer transition-colors ${
                      currentView === "profile" ? "text-white text-lg" : "text-gray-400 text-sm hover:text-white"
                    }`}
                    onClick={() => setCurrentView("profile")}
                  >
                    Profile
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`py-1 cursor-pointer transition-colors font-['Inter'] ${
                        currentView === "basics"
                          ? "text-white text-lg font-medium"
                          : "text-gray-400 text-sm font-normal hover:text-white"
                      }`}
                      onClick={() => setCurrentView("basics")}
                    >
                      Basics
                    </div>
                    <div
                      className={`py-1 cursor-pointer transition-colors font-['Inter'] ${
                        currentView === "team"
                          ? "text-white text-lg font-medium"
                          : "text-gray-400 text-sm font-normal hover:text-white"
                      }`}
                      onClick={() => setCurrentView("team")}
                    >
                      Team
                    </div>
                    <div
                      className={`py-1 cursor-pointer transition-colors font-['Inter'] ${
                        currentView === "company"
                          ? "text-white text-lg font-medium"
                          : "text-gray-400 text-sm font-normal hover:text-white"
                      }`}
                      onClick={() => setCurrentView("company")}
                    >
                      Company
                    </div>
                    <div
                      className={`py-1 cursor-pointer transition-colors font-['Inter'] ${
                        currentView === "market"
                          ? "text-white text-lg font-medium"
                          : "text-gray-400 text-sm font-normal hover:text-white"
                      }`}
                      onClick={() => setCurrentView("market")}
                    >
                      Market
                    </div>
                    <div
                      className={`py-1 cursor-pointer transition-colors font-['Inter'] ${
                        currentView === "business-model"
                          ? "text-white text-lg font-medium"
                          : "text-gray-400 text-sm font-normal hover:text-white"
                      }`}
                      onClick={() => setCurrentView("business-model")}
                    >
                      Business Model
                    </div>
                    <div
                      className={`py-1 cursor-pointer transition-colors font-['Inter'] ${
                        currentView === "traction"
                          ? "text-white text-lg font-medium"
                          : "text-gray-400 text-sm font-normal hover:text-white"
                      }`}
                      onClick={() => setCurrentView("traction")}
                    >
                      Traction
                    </div>
                    <div
                      className={`py-1 cursor-pointer transition-colors font-['Inter'] ${
                        currentView === "fundraising"
                          ? "text-white text-lg font-medium"
                          : "text-gray-400 text-sm font-normal hover:text-white"
                      }`}
                      onClick={() => setCurrentView("fundraising")}
                    >
                      Fundraising
                    </div>
                    <div
                      className={`py-1 cursor-pointer transition-colors font-['Inter'] ${
                        currentView === "deck"
                          ? "text-white text-lg font-medium"
                          : "text-gray-400 text-sm font-normal hover:text-white"
                      }`}
                      onClick={() => setCurrentView("deck")}
                    >
                      Deck
                    </div>
                  </div>
                </div>
              </div>

              {/* Centered Form Container with scrolling and masked edges */}
              <div className="w-full max-w-[40rem] rounded-[0.3125rem] bg-black/76 relative p-6 sm:p-8 sm:pb-13 overflow-hidden h-[360px]">
                {/* Content container with scroll */}
                <div className="h-full overflow-y-auto">
                  {/* Conditional Form Content */}
                  {currentView === "profile" && (
                    <div className="space-y-6">
                      {renderInput('text', 'companyName', 'Enter company name', 'Company Name')}
                      {renderInput('url', 'linkedinUrl', 'https://linkedin.com/company/yourcompany', "Company's Linkedin Profile URL")}
                      {renderInput('text', 'founderName', 'Enter CEO/Founder name', 'CEO / Founder Name')}
                      {renderInput('url', 'founderLinkedinUrl', 'https://linkedin.com/in/yourname', "CEO / Founder's Linkedin Profile URL")}
                      {renderInput('email', 'founderEmail', 'founder@company.com', "CEO / Founder's Email")}
                    </div>
                  )}

                  {currentView === "basics" && (
                    <div className="space-y-6">
                      {/* Founded and Company Website Row */}
                      <div className="grid grid-cols-2 gap-4">
                        {renderInput('text', 'founded', 'YYYY', 'Founded')}
                        {renderInput('url', 'companyWebsite', 'https://www.yourcompany.com', 'Company Website')}
                      </div>

                      {/* Business Category */}
                      <div>
                        <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                          How would you describe your business category?
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {['B2C', 'B2B', 'B2B2C', 'Other'].map((category) => (
                            <button
                              key={category}
                              onClick={() => handleInputChange('businessCategory', category)}
                              className={`h-10 rounded-[0.125rem] font-['Inter'] text-sm font-medium transition-colors ${
                                localFormData.businessCategory === category
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white/11 text-white hover:bg-white/20'
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Business Sectors */}
                      <div>
                        <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                          What sectors are your business in? <span className="text-sm font-normal">(you can choose a max of 3)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {sectorsList.map((sector) => (
                            <button
                              key={sector}
                              onClick={() => handleSectorToggle(sector)}
                              className={`px-3 py-1 rounded-[0.125rem] font-['Inter'] text-sm font-medium transition-colors flex items-center gap-2 ${
                                localFormData.businessSectors.includes(sector)
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white/11 text-white hover:bg-white/20'
                              }`}
                            >
                              {sector}
                              {localFormData.businessSectors.includes(sector) && (
                                <span className="text-xs">×</span>
                              )}
                              {!localFormData.businessSectors.includes(sector) && (
                                <span className="text-xs">+</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentView === "team" && (
                    <div className="space-y-6">
                        <p className="block text-white font-['Inter'] text-base font-medium mb-4">
                            Edit the CEO info in the Profile section.
                        </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                            Full Name
                          </label>
                          <input
                            type="text"
                            className="w-full h-9 bg-white/11 text-white outline-none rounded-[0.125rem] px-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal"
                            placeholder=""
                          />
                        </div>
                        <div>
                          <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                            Title/Role
                          </label>
                          <input
                            type="text"
                            className="w-full h-9 bg-white/11 text-white outline-none rounded-[0.125rem] px-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal"
                            placeholder=""
                          />
                        </div>
                      </div>
                      {renderInput('url', 'linkedinProfileURL', 'https://linkedin.com/in/yourname', "Linkedin Profile URL")}
                      <button className="w-full h-9 bg-red-700/50 text-white rounded-[0.125rem] font-['Inter'] text-xs font-normal hover:bg-red-700 transition-colors">
                        DISCARD FOUNDER
                      </button>
                      <button className="w-full h-9 bg-white/11 text-white rounded-[0.125rem] font-['Inter'] text-xs font-normal hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add another teammate
                      </button>
                      <button className="w-full h-9 bg-white/11 text-white rounded-[0.125rem] font-['Inter'] text-xs font-normal hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add a note about your team
                      </button>
                    </div>
                  )}

                  {currentView === "company" && (
                    <div className="space-y-6">
                      {renderTextarea('companyDescription', 'Write here...', 'Describe what your company does in one sentence', 250)}
                    </div>
                  )}

                  {currentView === "market" && (
                    <div className="space-y-6">
                      {renderTextarea('marketOpportunity', 'Write here...', 'What is the market opportunity and why will it be really big?', 500)}
                    </div>
                  )}

                  {currentView === "business-model" && (
                    <div className="space-y-6">
                      {renderTextarea('businessModel', 'Write here...', 'How do you make money? Who pays? What are the margins?', 500)}
                    </div>
                  )}

                  {currentView === "traction" && (
                    <div className="space-y-6">
                      {renderTextarea('tractionMetrics', 'Write here...', 'Potential metrics to highlight your company', 500)}
                    </div>
                  )}

                  {currentView === "fundraising" && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                          How much money have you raised?
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#656565]">$</span>
                          <input
                            type="number"
                            value={localFormData.raisedAmount}
                            onChange={(e) => handleInputChange('raisedAmount', e.target.value)}
                            className="w-full h-9 bg-white/11 text-white outline-none rounded-[0.125rem] pl-8 pr-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal"
                            placeholder=""
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                          Who did you raise from?
                        </label>
                        <div className="flex gap-4">
                          {['Bootstrapped', 'Family/Friends', 'VC/Angel'].map((source) => (
                            <button
                              key={source}
                              onClick={() => handleRaisedFromToggle(source)}
                              className={`h-10 px-4 rounded-[0.125rem] font-['Inter'] text-sm font-medium transition-colors ${
                                localFormData.raisedFrom.includes(source)
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white/11 text-white hover:bg-white/20'
                              }`}
                            >
                              {source}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                          What is your fundraising target?
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#656565]">$</span>
                          <input
                            type="number"
                            value={localFormData.fundraisingTarget}
                            onChange={(e) => handleInputChange('fundraisingTarget', e.target.value)}
                            className="w-full h-9 bg-white/11 text-white outline-none rounded-[0.125rem] pl-8 pr-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal"
                            placeholder=""
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentView === "deck" && (
                    <div className="space-y-6 flex flex-col items-center justify-center h-full">
                      <div
                        className="relative w-full max-w-[480px] h-[270px] bg-neutral-900 rounded-lg overflow-hidden shadow-lg flex items-center justify-center text-white bg-cover bg-center"
                        style={{ backgroundImage: `url(${BgImg})` }} 
                      >
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-3 left-3 flex gap-2">
                            <button className="px-4 py-2 text-xs font-medium bg-[#374151] text-white rounded hover:bg-[#4b5563]">
                                REPLACE
                            </button>
                            <button className="px-4 py-2 text-xs font-medium bg-[#DC2626] text-white rounded hover:bg-[#B91C1C]">
                                DELETE
                            </button>
                        </div>
                        <button className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-xl bg-black/50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70">
                            &lt;
                        </button>
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-xl bg-black/50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70">
                            &gt;
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/76 to-transparent pointer-events-none z-10"></div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/76 to-transparent pointer-events-none z-10"></div>
              </div>
            </div>

            <div className="w-full flex flex-col items-center pb-6 mt-2">
              <div className="flex justify-end items-center gap-2 mb-3 w-full max-w-[40rem]">
                <button
                  onClick={handleBack}
                  className="w-20 h-8 bg-white/20 rounded-[0.125rem] border-none cursor-pointer text-white transition-colors hover:bg-gray-500"
                >
                  <span className="text-white text-center font-['Inter'] text-sm font-medium">Back</span>
                </button>
                <button
                  onClick={handleNext}
                  className="w-20 h-8 rounded-[0.125rem] bg-white border-none transition-colors hover:bg-gray-100"
                >
                  <span className="text-black text-center font-['Inter'] text-sm font-medium">Next</span>
                </button>
              </div>

              <div className="pt-10 w-full max-w-[32rem] flex justify-center">
                <p className="text-[#B8B8B8] text-xs font-normal font-['Inter'] leading-[1.4] text-center">
                  This is private, by default. No one can see any of this. The only people who can ever see
                  the contents of your information are people you've explicitly shared its private link with.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <LinkLiveModal
        isOpen={isLinkLiveModalOpen}
        onClose={handleLinkLiveModalClose}
        reachLink={reachLink}
      />
    </>
  );
}