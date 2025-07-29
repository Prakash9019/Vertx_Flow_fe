// BasicInfoForm.jsx
import { useState, useEffect } from "react";
import Rectangle82 from "../../assets/Rectangle 82.png";
import BgImg from "./img.jpg";
import LinkLiveModal from "./LinkLiveModal";
import axios from "axios";
import API_KEY from "../../../key";
import { toast } from "react-toastify";

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
    founderName: formData?.founderName || "", // This seems to be for the CEO in "profile"
    founderLinkedinUrl: formData?.founderLinkedinUrl || "", // This seems to be for the CEO in "profile"
    founderEmail: formData?.founderEmail || "", // This seems to be for the CEO in "profile"
    founded: formData?.founded || "",
    companyWebsite: formData?.companyWebsite || "https://",
    businessCategory: formData?.businessCategory || "B2C",
    businessSectors: formData?.businessSectors || [],
    companyDescription: formData?.companyDescription || "",
    marketOpportunity: formData?.marketOpportunity || "",
    businessModel: formData?.businessModel || "",
    tractionMetrics: formData?.tractionMetrics || "",
    raisedAmount: formData?.raisedAmount || "",
    raisedFrom: formData?.raisedFrom || [],
    fundraisingTarget: formData?.fundraisingTarget || "",
    fundsAllocation: formData?.fundsAllocation || "", 
    companyStage: formData?.companyStage || "", // New field for company stage

    // New fields for Team section founders
    founder1FullName: formData?.founder1FullName || "",
    founder1TitleRole: formData?.founder1TitleRole || "",
    founder1LinkedinProfileURL: formData?.founder1LinkedinProfileURL || "",
    founder2FullName: formData?.founder2FullName || "",
    founder2TitleRole: formData?.founder2TitleRole || "",
    founder2LinkedinProfileURL: formData?.founder2LinkedinProfileURL || "",
    hqLocation: formData?.hqLocation || "", // New field for HQ location

    ...formData // Ensure any other existing formData fields are merged
  });

  // Define the order of views/steps
  const views = ["profile", "basics", "team", "company", "market", "business-model", "traction", "fundraising", "deck"];
  const [currentView, setCurrentView] = useState(views[0]); // Start with the first view

  // State to control visibility of the second founder's input fields
  const [showSecondFounder, setShowSecondFounder] = useState(
    !!localFormData.founder2FullName || !!localFormData.founder2TitleRole || !!localFormData.founder2LinkedinProfileURL
  ); // Initialize based on whether second founder data exists

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

  // Functions for adding/discarding second founder
  const handleAddTeammate = () => {
    setShowSecondFounder(true);
  };

  const handleDiscardFounder = () => {
    setShowSecondFounder(false);
    // Clear the data for the second founder when discarded
    handleInputChange('founder2FullName', '');
    handleInputChange('founder2TitleRole', '');
    handleInputChange('founder2LinkedinProfileURL', '');
  };


  const handleBack = () => {
    const currentIndex = views.indexOf(currentView);
    if (currentIndex > 0) {
      setCurrentView(views[currentIndex - 1]);
    } else {
      onClose();
    }
  };

  const handleNext = async () => {
    const currentIndex = views.indexOf(currentView);
    if (currentIndex < views.length - 1) {
      setCurrentView(views[currentIndex + 1]);
    } else {
      console.log("Form Completed:", localFormData);
      
      try {
        // Get token from localStorage
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        console.log('BasicForm - Token:', token ? 'Token exists' : 'No token found');
        
        if (!token) {
          toast.error('Please log in to continue');
          return;
        }
        
        // Make API call to save upgrade deck data
        const response = await axios.post(
          `${API_KEY}/api/upgrade-deck`, 
          localFormData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (response.data.success) {
          // Update reachLink with the one returned from API
          if (response.data.data.reachLink) {
            setReachLink(response.data.data.reachLink);
          }
          
          // Show success toast
          toast.success('Upgrade deck data saved successfully!');
          
          // Open the LinkLiveModal
          setIsLinkLiveModalOpen(true);
        } else {
          toast.error('Failed to save upgrade deck data');
        }
      } catch (error) {
        console.error('Error saving upgrade deck data:', error);
        toast.error(error.response?.data?.message || 'An error occurred while saving your data');
      }
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleLinkLiveModalClose = () => {
    setIsLinkLiveModalOpen(false);
    onClose(); // Close the BasicInfoForm as well when the link live modal is closed
  };
  
  // Function to handle editing the reachLink
  const handleEditReachLink = () => {
    setIsLinkLiveModalOpen(false);
    // Keep the form open for editing
  };

  // Helper function to render common input styles
  const renderInput = (type, field, placeholder, label) => (
    <div>
      <label htmlFor={field} className="block text-white font-['Inter'] text-base font-medium mb-4">
        {label}
      </label>
      <input
        type={type}
        id={field} // Added id for accessibility
        value={localFormData[field] || ''} // Ensure value is never undefined
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full h-9 bg-white/11 text-white outline-none rounded-[0.125rem] px-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal"
        placeholder={placeholder}
      />
    </div>
  );

  // Helper function to render common textarea styles
  const renderTextarea = (field, placeholder, label, maxLength) => (
    <div>
      <label htmlFor={field} className="block text-white font-['Inter'] text-base font-medium mb-4">
        {label}
      </label>
      <textarea
        id={field} // Added id for accessibility
        value={localFormData[field] || ''} // Ensure value is never undefined
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full h-52 bg-white/11 text-white outline-none rounded-[0.125rem] px-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal resize-none"
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

  if (!isOpen && !isLinkLiveModalOpen) return null;

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
                  {currentView === "market" && ""}
                  {currentView === "business-model" && ""}
                  {currentView === "traction" && ""}
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
                      currentView === "profile" ? "text-white text-[16px]" : "text-gray-400 text-sm hover:text-white"
                    }`}
                    onClick={() => setCurrentView("profile")}
                  >
                    Profile
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`py-1 cursor-pointer transition-colors font-['Inter'] ${
                        currentView === "basics"
                          ? "text-white text-[16px]"
                          : "text-gray-400 text-sm hover:text-white"
                      }`}
                      onClick={() => setCurrentView("basics")}
                    >
                      Basics
                    </div>
                    <div
                      className={`py-1 cursor-pointer transition-colors font-['Inter'] ${
                        currentView === "team"
                          ? "text-white text-[16px]"
                          : "text-gray-400 text-sm hover:text-white"
                      }`}
                      onClick={() => setCurrentView("team")}
                    >
                      Team
                    </div>
                    <div
                      className={`py-1 cursor-pointer transition-colors font-['Inter'] ${
                        currentView === "company"
                          ? "text-white text-[16px]"
                          : "text-gray-400 text-sm hover:text-white"
                      }`}
                      onClick={() => setCurrentView("company")}
                    >
                      Company
                    </div>
                    <div
                      className={`py-1 cursor-pointer transition-colors font-['Inter'] ${
                        currentView === "market"
                          ? "text-white text-[16px]"
                          : "text-gray-400 text-sm hover:text-white"
                      }`}
                      onClick={() => setCurrentView("market")}
                    >
                      Market
                    </div>
                    <div
                      className={`py-1 cursor-pointer transition-colors font-['Inter'] ${
                        currentView === "business-model"
                          ? "text-white text-[16px]"
                          : "text-gray-400 text-sm hover:text-white"
                      }`}
                      onClick={() => setCurrentView("business-model")}
                    >
                      Business Model
                    </div>
                    <div
                      className={`py-1 cursor-pointer transition-colors font-['Inter'] ${
                        currentView === "traction"
                          ? "text-white text-[16px]"
                          : "text-gray-400 text-sm hover:text-white"
                      }`}
                      onClick={() => setCurrentView("traction")}
                    >
                      Traction
                    </div>
                    <div
                      className={`py-1 cursor-pointer transition-colors font-['Inter'] ${
                        currentView === "fundraising"
                          ? "text-white text-[16px]"
                          : "text-gray-400 text-sm hover:text-white"
                      }`}
                      onClick={() => setCurrentView("fundraising")}
                    >
                      Fundraising
                    </div>
                    <div
                      className={`py-1 cursor-pointer transition-colors font-['Inter'] ${
                        currentView === "deck"
                          ? "text-white text-[16px]"
                          : "text-gray-400 text-sm hover:text-white"
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
                        {renderInput('date', 'founded', 'YYYY', 'Founded')}
                        {renderInput('url', 'companyWebsite', 'https://www.yourcompany.com', 'Company Website')}
                      </div>

                      {/* Business Category with separate checkbox and label */}
                      <div>
                        <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                          How would you describe your business category?
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {['B2C', 'B2B', 'B2B2C', 'Other'].map((category) => (
                            <div
                              key={category}
                              className="flex items-center gap-2 p-2 rounded-[0.125rem] cursor-pointer transition-colors"
                              onClick={() => handleInputChange('businessCategory', category)}
                            >
                              {/* Custom Checkbox */}
                              <div
                                className={`w-6 h-6 rounded-[0.125rem] border border-white flex items-center justify-center transition-colors ${
                                  localFormData.businessCategory === category ? 'bg-purple-600' : 'bg-transparent'
                                }`}
                              >
                                {localFormData.businessCategory === category && (
                                  <svg
                                    className="h-6 w-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                )}
                              </div>
                              {/* Category Label */}
                              <span className="text-white font-['Inter'] text-lg font-medium">
                                {category}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Company Stage */}
                      <div>
                        <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                          What is the current stage of your company?
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Pre-Product', 'Pre-Revenue', 'Post-Revenue'].map((stage) => (
                            <div
                              key={stage}
                              className="flex items-center gap-2 p-2 rounded-[0.125rem] cursor-pointer transition-colors"
                              onClick={() => handleInputChange('companyStage', stage)}
                            >
                              {/* Custom Radio Button */}
                              <div
                                className={`w-6 h-6 rounded-full border border-white flex items-center justify-center transition-colors ${
                                  localFormData.companyStage === stage ? 'bg-purple-600' : 'bg-transparent'
                                }`}
                              >
                                {localFormData.companyStage === stage && (
                                  <div className="w-3 h-3 rounded-full bg-white"></div>
                                )}
                              </div>
                              {/* Stage Label */}
                              <span className="text-white font-['Inter'] text-lg font-medium">
                                {stage}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Business Type */}
                      <div>
                        <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                          What type of business is your company? (multiple)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Ecommerce', 'Marketplace', 'Social Network', 'SaaS', 'Hardware', 'Other'].map((source) => (
                            <div
                              key={source}
                              className="flex items-center gap-2 p-2 rounded-[0.125rem] cursor-pointer transition-colors"
                              onClick={() => handleRaisedFromToggle(source)}
                            >
                              {/* Custom Checkbox */}
                              <div
                                className={`w-6 h-6 rounded-[0.125rem] border border-white flex items-center justify-center transition-colors ${
                                  localFormData.raisedFrom.includes(source) ? 'bg-purple-600' : 'bg-transparent'
                                }`}
                              >
                                {localFormData.raisedFrom.includes(source) && (
                                  <svg
                                    className="h-6 w-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                )}
                              </div>
                              {/* Source Label */}
                              <span className="text-white font-['Inter'] text-lg font-medium">
                                {source}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>



                      {/* Business Sectors (remains the same as it correctly matches the screenshot) */}
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
                                <span className="text-[16px]">×</span>
                              )}
                              {!localFormData.businessSectors.includes(sector) && (
                                <span className="text-[16px]">+</span>
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

            {/* First Founder Input Fields (Always visible) */}
            <div className="grid grid-cols-2 gap-4">
              {renderInput('text', 'founder1FullName', '', 'Full Name')}
              {renderInput('text', 'founder1TitleRole', '', 'Title/Role')}
            </div>
            {renderInput('url', 'founder1LinkedinProfileURL', 'https://linkedin.com/in/yourname', "Linkedin Profile URL")}

            {/* Second Founder Input Fields (Conditionally visible) */}
            {showSecondFounder && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {renderInput('text', 'founder2FullName', '', 'Full Name')}
                  {renderInput('text', 'founder2TitleRole', '', 'Title/Role')}
                </div>
                {renderInput('url', 'founder2LinkedinProfileURL', 'https://linkedin.com/in/yourname', "Linkedin Profile URL")}
                <div className="flex justify-end mt-4"> {/* Added mt-4 for spacing */}
                  <button
                    onClick={handleDiscardFounder}
                    className="px-4 py-2 bg-red-700/50 text-white rounded-[0.125rem] font-['Inter'] text-xs font-normal hover:bg-red-700 transition-colors"
                  >
                    DISCARD FOUNDER
                  </button>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6"> {/* Added mt-6 for spacing */}
              {!showSecondFounder && ( // Only show "Add another teammate" if second founder is not shown
                <button
                  onClick={handleAddTeammate}
                  className="w-full h-9 bg-white/11 text-white rounded-[0.125rem] font-['Inter'] text-xs font-normal hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
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
              )}
              <button className={`${showSecondFounder ? 'col-span-2' : 'col-span-1'} h-9 bg-white/11 text-white rounded-[0.125rem] font-['Inter'] text-xs font-normal hover:bg-white/20 transition-colors flex items-center justify-center gap-2`}>
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

            {/* Where is HQ based? */}
            <div className="mt-6"> {/* Added mt-6 for spacing */}
              {renderInput('text', 'hqLocation', 'Location...', 'Where is HQ based?')}
            </div>
          </div>
        )}
                  {currentView === "company" && (
                    <div className="space-y-6">
                      {renderTextarea('companyDescription', 'Write here...', "Describe down here", 250)}
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
                      {renderTextarea('tractionMetrics', 'Write here...', 'Highlight key achievements, milestones, and user engagement.', 500)}
                    </div>
                  )}

                  {currentView === "fundraising" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                        How much money have you raised?
                      </label>
                      <div className="relative">
                        <span className="absolute  left-3 top-1/2 -translate-y-1/2 text-[#656565]">$</span>
                        <input 
                          type="text"
                          value={
                            localFormData.raisedAmount
                              ? new Intl.NumberFormat('en-US').format(localFormData.raisedAmount)
                              : ''
                          }
                          onChange={(e) => {
                            // Remove non-digit characters for storage, then convert to number
                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                            handleInputChange('raisedAmount', rawValue === '' ? '' : Number(rawValue));
                          }}
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
                          <div
                            key={source}
                            className="flex items-center gap-2 p-2 rounded-[0.125rem] cursor-pointer transition-colors"
                            onClick={() => handleRaisedFromToggle(source)}
                          >
                            {/* Custom Checkbox */}
                            <div
                              className={`w-6 h-6 rounded-[0.125rem] border border-white flex items-center justify-center transition-colors ${
                                localFormData.raisedFrom.includes(source) ? 'bg-purple-600' : 'bg-transparent'
                              }`}
                            >
                              {localFormData.raisedFrom.includes(source) && (
                                <svg
                                  className="h-6 w-6 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                            {/* Source Label */}
                            <span className="text-white font-['Inter'] text-lg font-medium">
                              {source}
                            </span>
                          </div>
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
                          type="text" // Change to text to allow custom formatting
                          value={
                            localFormData.fundraisingTarget
                              ? new Intl.NumberFormat('en-US').format(localFormData.fundraisingTarget)
                              : ''
                          }
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                            handleInputChange('fundraisingTarget', rawValue === '' ? '' : Number(rawValue));
                          }}
                          className="w-full h-9 bg-white/11 text-white outline-none rounded-[0.125rem] pl-8 pr-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal"
                          placeholder=""
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                        How do you allocate these funds?
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#656565]">$</span>
                        <input
                          type="text" // Change to text to allow custom formatting
                          value={
                            localFormData.fundsAllocation // <--- Use the new field here
                              ? new Intl.NumberFormat('en-US').format(localFormData.fundsAllocation)
                              : ''
                          }
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                            handleInputChange('fundsAllocation', rawValue === '' ? '' : Number(rawValue)); // <--- Update the new field
                          }}
                          className="w-full h-9 bg-white/11 text-white outline-none rounded-[0.125rem] pl-8 pr-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                )}

                  {currentView === "deck" && (
                    <div className="space-y-2 flex flex-col items-center justify-center h-full">
                      <div
                        className="relative w-full max-w-[480px] top-8 h-[270px] bg-neutral-900 rounded-lg overflow-hidden shadow-lg flex items-center justify-center text-white bg-cover bg-center"
                        style={{ backgroundImage: `url(${BgImg})` }} 
                      >
                        <div className="absolute inset-0 bg-black/20" />
                        
                      </div>
                      <div className=" flex justify-between w-full pt-8 max-w-[480px] gap-2">
                            <button className="px-4 py-2 text-xs font-medium bg-[#374151] text-white rounded hover:bg-[#4b5563]">
                                REPLACE
                            </button>
                            <button className="px-4 py-2 text-xs font-medium bg-[#DC2626] text-white rounded hover:bg-[#B91C1C]">
                                DELETE
                            </button>
                      </div>
                      <button className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-xl  flex items-center justify-center ">
                        <svg
                          className="w-7 h-7" // Adjust size if necessary for visual match
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      {/* Right Arrow Button - Only content changed to SVG */}
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-xl flex items-center justify-center">
                        <svg
                          className="w-7 h-7" // Adjust size if necessary for visual match
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

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