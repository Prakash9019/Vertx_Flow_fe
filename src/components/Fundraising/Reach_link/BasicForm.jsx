import React, { useState, useEffect } from "react";
import confetti from 'canvas-confetti';
import Rectangle82 from "../../../assets/Rectangle 82.png";
import BgImg from "./img.jpg";
import axios from "axios";
import API_KEY from "../../../../key";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function BasicInfoForm({ isOpen = true, onClose = () => { }, formData = {}, setFormData = () => { } }) {
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

  const [isTrue, setIsTrue] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const handleClick = async () => {
    setIsTrue(!isTrue);
  };

  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const handleCopyLink = () => {
    navigator.clipboard.writeText(reachLink)
      .then(() => {
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
        toast.error('Failed to copy link');
      });
  };
  const handleNextClick = () => {
    // navigate('/fundraising/reach-link');
  };

  const [isLinkLiveModalOpen, setIsLinkLiveModalOpen] = useState(false);

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
    companyDescription: formData?.companyDescription || "",
    marketOpportunity: formData?.marketOpportunity || "",
    businessModel: formData?.businessModel || "",
    tractionMetrics: formData?.tractionMetrics || "",
    raisedAmount: formData?.raisedAmount || "",
    raisedFrom: formData?.raisedFrom || [],
    fundraisingTarget: formData?.fundraisingTarget || "",
    fundsAllocation: formData?.fundsAllocation || "",
    companyStage: formData?.companyStage || "",
    founder1FullName: formData?.founder1FullName || "",
    founder1TitleRole: formData?.founder1TitleRole || "",
    founder1LinkedinProfileURL: formData?.founder1LinkedinProfileURL || "",
    teamMembers: formData?.teamMembers || [],
    hqLocation: formData?.hqLocation || "",
    teamNotes: formData?.teamNotes || [],
    ...formData
  });

  const [showTeamNoteTextarea, setShowTeamNoteTextarea] = useState(
    !!(formData?.teamNote && formData.teamNote.length > 0)
  );


  const views = ["profile", "basics", "team", "company", "market", "business-model", "traction", "fundraising", "deck"];
  const [currentView, setCurrentView] = useState(views[0]);

  const [focusedInput, setFocusedInput] = useState(null);

  const [reachLink, setReachLink] = useState("");

  const [nextDynamicTeamMemberCounter, setNextDynamicTeamMemberCounter] = useState(() => {
    if (localFormData.teamMembers.length > 0) {
      const maxId = Math.max(...localFormData.teamMembers.map(m => parseInt(m.id?.replace('new-', '') || 0) || 0));
      return maxId + 1;
    }
    return 0;
  });

  function triggerConfetti() {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }


  useEffect(() => {
    if (showConfetti) {
      triggerConfetti();
      setShowConfetti(false);
    }
  }, [showConfetti]);

  useEffect(() => {
    setLocalFormData(prev => {
      let updatedData = { ...prev };
      let changed = false;

      for (const key in formData) {
        if (formData.hasOwnProperty(key) && prev[key] !== formData[key]) {
          updatedData[key] = formData[key];
          changed = true;
        }
      }

      if (
        formData.teamMembers &&
        (prev.teamMembers === undefined || JSON.stringify(prev.teamMembers) !== JSON.stringify(formData.teamMembers))
      ) {
        updatedData.teamMembers = formData.teamMembers;
        changed = true;
      } else if (!formData.teamMembers && prev.teamMembers && prev.teamMembers.length > 0) {
        updatedData.teamMembers = [];
        changed = true;
      }

      return changed ? updatedData : prev;
    });
  }, [formData]);


  const handleInputChange = (field, value) => {
    setLocalFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleTeamNote = () => {
    if (showTeamNoteTextarea) {
      setLocalFormData(prev => ({
        ...prev,
        teamNote: "",
      }));
      setShowTeamNoteTextarea(false);
    } else {
      setShowTeamNoteTextarea(true);
    }
  };


  const handleDynamicTeamMemberInputChange = (id, fieldName, value) => {
    setLocalFormData(prev => {
      const updatedTeamMembers = prev.teamMembers.map(member =>
        member.id === id ? { ...member, [fieldName]: value } : member
      );
      return { ...prev, teamMembers: updatedTeamMembers };
    });
    setFormData(prev => {
      const updatedTeamMembers = (prev.teamMembers || []).map(member =>
        member.id === id ? { ...member, [fieldName]: value } : member
      );
      return { ...prev, teamMembers: updatedTeamMembers };
    });
  };


  const handleAddDynamicTeamMember = () => {
    const MAX_TOTAL_TEAM_MEMBERS = 9;
    if ((1 + localFormData.teamMembers.length) < MAX_TOTAL_TEAM_MEMBERS) {
      const newMember = {
        id: `new-${nextDynamicTeamMemberCounter}`,
        fullName: '',
        titleRole: '',
        linkedinUrl: ''
      };
      setNextDynamicTeamMemberCounter(prev => prev + 1);
      setLocalFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, newMember]
      }));
      setFormData(prev => ({
        ...prev,
        teamMembers: [...(prev.teamMembers || []), newMember]
      }));
    } else {
      toast.info(`You can have a maximum of ${MAX_TOTAL_TEAM_MEMBERS} team members.`);
    }
  };


  const handleRemoveDynamicTeamMember = (id) => {
    setLocalFormData(prev => {
      const filteredMembers = prev.teamMembers.filter(member => member.id !== id);
      return { ...prev, teamMembers: filteredMembers };
    });
    setFormData(prev => {
      const filteredMembers = (prev.teamMembers || []).filter(member => member.id !== id);
      return { ...prev, teamMembers: filteredMembers };
    });
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
        return;
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

  const handleNext = async () => {
    const currentIndex = views.indexOf(currentView);
    if (currentIndex < views.length - 1) {
      const nextView = views[currentIndex + 1];
      setCurrentView(nextView);
      return;
    }

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to continue');
        return;
      }

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
        if (response.data.data?.reachLink) {
          setReachLink(response.data.data.reachLink);
          console.log(response.data.data.reachLink);
          setIsTrue(true);
          setShowConfetti(true);
        }
        toast.success('Upgrade deck data saved successfully!');
      } else {
        toast.error('Failed to save upgrade deck data');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while saving your data');
    }
  };


  const handleCancel = () => {
    onClose();
  };


  const handleEditReachLink = () => {
    setIsLinkLiveModalOpen(false);
  };


  const renderInput = (type, field, placeholder, label, onChangeHandler = handleInputChange, value = undefined) => (
    <div>
      <label htmlFor={field} className="block text-white font-['Inter'] text-xs sm:text-sm md:text-base font-medium mb-4">
        {label}
      </label>
      <input
        type={type}
        id={field}
        value={value !== undefined ? value : (localFormData[field] || '')}
        onChange={(e) => onChangeHandler(field, e.target.value)}
        className="w-full h-9 bg-white/11 text-white outline-none rounded-[0.125rem] px-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal"
        placeholder={placeholder}
      />
    </div>
  );

  const renderCurrencyInput = (field, label, placeholder = "") => (
    <div>
      <label htmlFor={field} className="block text-white font-['Inter'] text-xs sm:text-sm md:text-base font-medium mb-4">
        {label}
      </label>
      <div className="relative">
        <span
          className={`absolute left-3 top-1/2 -translate-y-1/2 font-['Inter'] ${focusedInput === field ? 'text-white' : 'text-[#656565]'
            }`}
        >
          $
        </span>
        <input
          type="text"
          id={field}
          value={
            localFormData[field]
              ? new Intl.NumberFormat('en-US').format(localFormData[field])
              : ''
          }
          onChange={(e) => {
            const rawValue = e.target.value.replace(/[^0-9]/g, '');
            handleInputChange(field, rawValue === '' ? '' : Number(rawValue));
          }}
          onFocus={() => setFocusedInput(field)}
          onBlur={() => setFocusedInput(null)}
          className={`w-full h-9 bg-white/11 outline-none rounded-[0.125rem] pl-8 pr-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs ${focusedInput === field ? 'text-white' : 'text-[#656565]'
            }`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );


  const renderTextarea = (field, placeholder, label, maxLength) => (
    <div>
      <label htmlFor={field} className="block text-white font-['Inter'] text-xs sm:text-sm md:text-base font-medium mb-8 mt-3 sm:mt-0 md:mb-4">
        {label}
      </label>
      <textarea
        id={field}
        value={localFormData[field] || ''}
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

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 cursor-pointer" onClick={handleCancel} />

        <div
          className="relative flex flex-col items-center bg-cover bg-center bg-no-repeat w-full max-w-6xl h-[86vh] max-h-[calc(86vh)] sm:h-[calc(100vh)] overflow-y-auto "
          style={{
            backgroundImage: `url(${Rectangle82})`,
          }}
        >
          {isOpen && !isTrue && (
            <>
              <div className="relative h-32 w-full">
                <div className="absolute inset-0" />
                <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6 mt-2 mb-2">
                  <h1 className="text-white text-lg sm:text-xl md:text[22px] lg:text-2xl mt-0 md:mt-6 font-semibold mb-2 font-['Inter']">
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
                  <p className="text-white/90 text-sm mb-2 font-normal font-['Inter']">
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

              <div className="w-full flex items-start justify-center relative mb-5">
                <div className="absolute left-0 top-0 w-40 hidden md:block  lg:w-64 h-full p-6 overflow-y-auto  items-start justify-center z-10">
                  <div className="space-y-1">
                    <div
                      className={`font-medium mb-1 font-['Inter'] cursor-pointer transition-colors ${currentView === "profile" ? "text-white text-[16px]" : "text-gray-400 text-sm hover:text-white"
                        }`}
                      onClick={() => setCurrentView("profile")}
                    >
                      Profile
                    </div>

                    <div className="space-y-1">
                      <div
                        className={`py-1 cursor-pointer transition-colors font-['Inter'] ${currentView === "basics"
                          ? "text-white text-[16px]"
                          : "text-gray-400 text-sm hover:text-white"
                          }`}
                        onClick={() => setCurrentView("basics")}
                      >
                        Basics
                      </div>
                      <div
                        className={`py-1 cursor-pointer transition-colors font-['Inter'] ${currentView === "team"
                          ? "text-white text-[16px]"
                          : "text-gray-400 text-sm hover:text-white"
                          }`}
                        onClick={() => setCurrentView("team")}
                      >
                        Team
                      </div>
                      <div
                        className={`py-1 cursor-pointer transition-colors font-['Inter'] ${currentView === "company"
                          ? "text-white text-[16px]"
                          : "text-gray-400 text-sm hover:text-white"
                          }`}
                        onClick={() => setCurrentView("company")}
                      >
                        Company
                      </div>
                      <div
                        className={`py-1 cursor-pointer transition-colors font-['Inter'] ${currentView === "market"
                          ? "text-white text-[16px]"
                          : "text-gray-400 text-sm hover:text-white"
                          }`}
                        onClick={() => setCurrentView("market")}
                      >
                        Market
                      </div>
                      <div
                        className={`py-1 cursor-pointer transition-colors font-['Inter'] ${currentView === "business-model"
                          ? "text-white text-[16px]"
                          : "text-gray-400 text-sm hover:text-white"
                          }`}
                        onClick={() => setCurrentView("business-model")}
                      >
                        Business Model
                      </div>
                      <div
                        className={`py-1 cursor-pointer transition-colors font-['Inter'] ${currentView === "traction"
                          ? "text-white text-[16px]"
                          : "text-gray-400 text-sm hover:text-white"
                          }`}
                        onClick={() => setCurrentView("traction")}
                      >
                        Traction
                      </div>
                      <div
                        className={`py-1 cursor-pointer transition-colors font-['Inter'] ${currentView === "fundraising"
                          ? "text-white text-[16px]"
                          : "text-gray-400 text-sm hover:text-white"
                          }`}
                        onClick={() => setCurrentView("fundraising")}
                      >
                        Fundraising
                      </div>
                      <div
                        className={`py-1 cursor-pointer transition-colors font-['Inter']
                         ${currentView === "deck"
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

                <div className="w-99/100 max-w-120 lg:max-w-[40rem] rounded-[0.3125rem] bg-black/76 relative p-4 sm:p-8 sm:pb-13 overflow-hidden h-[360px]">
                  <div className="h-full overflow-y-auto">
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
                      <div className="space-y-3 md:space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          {renderInput('date', 'founded', 'YYYY', 'Founded')}
                          {renderInput('url', 'companyWebsite', 'https://www.yourcompany.com', 'Company Website')}
                        </div>

                        <div>
                          <label className="block text-white font-['Inter'] text-xs sm:text-sm md:text-base font-medium mb-4">
                            How would you describe your business category?
                          </label>
                          <div className="grid grid-cols-4 gap-1 sm:gap-2">
                            {['B2C', 'B2B', 'B2B2C', 'Other'].map((category) => (
                              <div
                                key={category}
                                className="flex items-center gap-2 p-2 rounded-[0.125rem] cursor-pointer transition-colors"
                                onClick={() => handleInputChange('businessCategory', category)}
                              >
                                <div
                                  className={`lg:w-6 md:w-5 md:h-5 sm:w-4 sm:h-4 h-3 w-3 lg:h-6 rounded-[0.125rem] border border-white flex items-center justify-center transition-colors ${localFormData.businessCategory === category ? 'bg-purple-600' : 'bg-transparent'
                                    }`}
                                >
                                  {localFormData.businessCategory === category && (
                                    <svg
                                      className="lg:h-5 lg:w-5 md:w-4 md:h-4 h-3 w-3 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                  )}
                                </div>
                                <span className="text-white font-['Inter'] text-xs sm:text-sm md:text-base font-medium">
                                  {category}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-white font-['Inter'] text-xs sm:text-sm md:text-base font-medium mb-4">
                            What sectors are your business in? <span className="text-[10px] sm:text-xs md:text-sm font-normal">(you can choose a max of 3)</span>
                          </label>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {sectorsList.map((sector) => (
                              <button
                                key={sector}
                                onClick={() => handleSectorToggle(sector)}
                                className={`px-3 py-1 rounded-[0.125rem] font-['Inter'] text-[10px] sm:text-xs md:text-sm font-medium transition-colors flex items-center gap-2 ${localFormData.businessSectors.includes(sector)
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white/11 text-white hover:bg-white/20'
                                  }`}
                              >
                                {sector}
                                {localFormData.businessSectors.includes(sector) && (
                                  <span className="text-xs sm:text-sm md:text-base">×</span>
                                )}
                                {!localFormData.businessSectors.includes(sector) && (
                                  <span className="text-xs sm:text-sm md:text-base">+</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-white font-['Inter'] text-xs sm:text-sm md:text-base font-medium mb-4">
                            What is the current stage of your company?
                          </label>
                          <div className="grid grid-cols-3 gap-1 sm:gap-2">
                            {['Pre-Product', 'Pre-Revenue', 'Post-Revenue'].map((stage) => (
                              <div
                                key={stage}
                                className="flex items-center gap-2 p-2 rounded-[0.125rem] cursor-pointer transition-colors"
                                onClick={() => handleInputChange('companyStage', stage)}
                              >
                                <div
                                  className={`lg:w-6 md:w-5 md:h-5 sm:w-4 sm:h-4 h-3 w-3 lg:h-6 rounded-full border border-white flex items-center justify-center transition-colors ${localFormData.companyStage === stage ? 'bg-purple-600' : 'bg-transparent'
                                    }`}
                                >
                                  {localFormData.companyStage === stage && (
                                    <div className="lg:w-3 md:w-2 md:h-2 lg:h-3 sm:w-1.5 sm:h-1.5 w-1 h-1 rounded-full bg-white"></div>
                                  )}
                                </div>
                                <span className="text-white font-['Inter'] text-xs sm:text-sm md:text-base font-medium">
                                  {stage}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-white font-['Inter'] text-xs sm:text-sm md:text-base font-medium mb-4">
                            What type of business is your company? (multiple)
                          </label>
                          <div className="grid grid-cols-3 gap-1 sm:gap-2 ">
                            {['Ecommerce', 'Marketplace', 'Social Network', 'SaaS', 'Hardware', 'Other'].map((source) => (
                              <div
                                key={source}
                                className="flex items-center gap-1 sm:gap-2  p-2 rounded-[0.125rem] cursor-pointer transition-colors"
                                onClick={() => handleRaisedFromToggle(source)}
                              >
                                <div
                                  className={`lg:w-6 md:w-5 md:h-5 sm:w-4 sm:h-4 h-3 w-3 lg:h-6rounded-[0.125rem] border border-white flex items-center justify-center transition-colors ${localFormData.raisedFrom.includes(source) ? 'bg-purple-600' : 'bg-transparent'
                                    }`}
                                >
                                  {localFormData.raisedFrom.includes(source) && (
                                    <svg
                                      className="h-5 w-5 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                  )}
                                </div>
                                <span className="text-white font-['Inter'] text-[10px] sm:text-xs md:text-sm lg:text-base font-medium">
                                  {source}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {currentView === "team" && (
                      <div className="space-y-3 sm:space-y-6">
                        <p className="text-[#656565] font-['Inter'] text-xs sm:text-sm md:text-base font-medium">
                          Edit the CEO info in the <span className="font-bold text-white">Profile</span> section.
                        </p>

                        <div className="relative p-2 sm:p-4 border border-white/10 rounded-lg space-y-2 sm:space-y-4">
                          <div className="grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-3 sm:gap-y-6">
                            {renderInput('text', 'founder1FullName', 'Full Name', 'Full Name')}
                            {renderInput('text', 'founder1TitleRole', 'Title/Role', 'Title/Role')}
                            <div className="col-span-2">
                              {renderInput('url', 'founder1LinkedinProfileURL', 'https://linkedin.com/in/...', 'Linkedin Profile URL')}
                            </div>
                          </div>
                        </div>

                        {localFormData.teamMembers.map((member, index) => (
                          <div key={member.id} className="relative p-2 sm:p-4 border border-white/10 rounded-lg space-y-2 sm:space-y-4">
                            <div className="grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-3 sm:gap-y-6">
                              {renderInput('text', 'fullName', 'Full Name', 'Full Name',
                                (field, value) => handleDynamicTeamMemberInputChange(member.id, field, value),
                                member.fullName)}
                              {renderInput('text', 'titleRole', 'Title/Role', 'Title/Role',
                                (field, value) => handleDynamicTeamMemberInputChange(member.id, field, value),
                                member.titleRole)}
                              <div className="col-span-2">
                                {renderInput('url', 'linkedinUrl', 'https://linkedin.com/in/...', 'Linkedin Profile URL',
                                  (field, value) => handleDynamicTeamMemberInputChange(member.id, field, value),
                                  member.linkedinUrl)}
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveDynamicTeamMember(member.id)}
                              className="absolute sm:bottom-1 right-4 text-white text-[10px] sm:text-xs font-medium cursor-pointer transition-colors"
                            >
                              DISCARD FOUNDER
                            </button>
                          </div>
                        ))}

                        {showTeamNoteTextarea && (
                          <div className="relative p-2 sm:p-4 border border-white/10 rounded-lg space-y-2 sm:space-y-4">
                            <label htmlFor="team-note" className="block text-white font-['Inter'] text-xs sm:text-sm md:text-base font-medium">
                              Team Note
                            </label>
                            <textarea
                              id="team-note"
                              value={localFormData.teamNote}
                              onChange={(e) => handleInputChange('teamNote', e.target.value)}
                              className="w-full h-52 bg-white/11 text-white outline-none rounded-[0.125rem] px-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal resize-none"
                              placeholder="Add a note about your team..."
                              maxLength={500}
                            />
                            {500 && (
                              <p className="text-right text-[#656565] text-xs font-['Inter'] mt-1">
                                {500 - (localFormData.teamNote?.length || 0)} chars left
                              </p>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mt-6">
                          {(1 + localFormData.teamMembers.length) < 9 && (
                            <button
                              onClick={handleAddDynamicTeamMember}
                              className="w-full h-9 text-white rounded-[0.125rem] font-['Inter'] text-[10px] sm:text-xs font-normal cursor-pointer transition-colors flex items-center justify-start gap-2"
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

                          <button
                            onClick={handleToggleTeamNote}
                            className={`h-9 text-white rounded-[0.125rem] font-['Inter'] cursor-pointer text-[10px] sm:text-xs font-normal  transition-colors flex items-center justify-end gap-2 ${(1 + localFormData.teamMembers.length) >= 9 ? 'col-span-2' : ''
                              }`}
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
                            {showTeamNoteTextarea ? 'Discard note' : 'Add a note about your team'}
                          </button>
                        </div>

                        <div className="mt-6">
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
                      <div className="space-y-4 md:space-y-6">
                        {renderCurrencyInput('raisedAmount', 'How much money have you raised?')}

                        <div>
                          <label className="block text-white font-['Inter'] text-xs sm:text-sm md:text-base font-medium mb-4">
                            Who did you raise from?
                          </label>
                          <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4">
                            {['Bootstrapped', 'Family/Friends', 'VC/Angel'].map((source) => (
                              <div
                                key={source}
                                className="flex items-center gap-1 sm:gap-2 p-0 sm:p-2 rounded-[0.125rem] cursor-pointer transition-colors"
                                onClick={() => handleRaisedFromToggle(source)}
                              >
                                <div
                                  className={`lg:w-6 md:w-5 md:h-5 sm:w-4 sm:h-4 h-3 w-3 lg:h-6 rounded-[0.125rem] border border-white flex items-center justify-center transition-colors ${localFormData.raisedFrom.includes(source) ? 'bg-purple-600' : 'bg-transparent'
                                    }`}
                                >
                                  {localFormData.raisedFrom.includes(source) && (
                                    <svg
                                      className="lg:w-6 md:w-5 md:h-5 sm:w-4 sm:h-4 h-3 w-3 lg:h-6 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                  )}
                                </div>
                                <span className="text-white font-['Inter'] text-xs sm:text-sm md:text-lg font-medium">
                                  {source}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {renderCurrencyInput('fundraisingTarget', 'What is your fundraising target?')}
                        {renderCurrencyInput('fundsAllocation', 'How do you allocate these funds?')}
                      </div>
                    )}

                    {currentView === "deck" ? (
                      <>
                        <div className="space-y-2 flex flex-col items-center justify-center h-full">
                          <div className="relative w-full max-w-[480px] h-[270px] bg-neutral-900 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
                            {localFormData.deckUrl ? (
                              <iframe
                                title="Pitch Deck Preview"
                                src={localFormData.deckUrl}
                                className="w-full h-full"
                              />
                            ) : (
                              <div
                                className="w-full h-full bg-cover bg-center flex items-center justify-center text-white"
                                style={{ backgroundImage: `url(${BgImg})` }}
                              >
                                <div className="absolute inset-0 bg-black/20" />
                                <span className="z-10">No deck uploaded</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full flex flex-col items-center pb-6 mt-2">
                      </div>
                    )}


                  </div>

                </div>
              </div>

              {currentView !== "deck" && (
                <div className="w-99/100 flex flex-col items-center pb-0 md:pb-6 mt-2">
                  <div className="flex justify-end items-center gap-2 sm:mb-3 w-full lg:max-w-[40rem] max-w-120">
                    <button
                      onClick={handleBack}
                      className="w-20 h-8 bg-white/20 rounded-[0.125rem] border-none cursor-pointer text-white transition-colors hover:bg-gray-500"
                    >
                      <span className="text-white text-center font-['Inter'] text-sm font-medium">
                        Back
                      </span>
                    </button>
                    <button
                      onClick={handleNext}
                      className="w-20 h-8 rounded-[0.125rem] bg-white border-none transition-colors hover:bg-gray-100"
                    >
                      <span className="text-black text-center font-['Inter'] text-sm font-medium">
                        Next
                      </span>
                    </button>
                  </div>

                  <div className="pt-10 w-full max-w-[32rem] flex justify-center">
                    <p className="text-[#B8B8B8] hidden md:block text-xs font-normal font-['Inter'] leading-[1.4] text-center">
                      This is private, by default. No one can see any of this. The only people
                      who can ever see the contents of your information are people you've
                      explicitly shared its private link with.
                    </p>
                  </div>
                </div>
              )}
              {currentView == "deck" && (
                <div className="w-99/100 flex flex-col items-center pb-0 md:pb-6 mt-2">
                  <div className="flex justify-end items-center gap-2 sm:mb-3 w-full lg:max-w-[40rem] max-w-120">
                    <button
                      onClick={handleBack}
                      className="w-20 h-8 bg-white/20 rounded-[0.125rem] border-none cursor-pointer text-white transition-colors hover:bg-gray-500"
                    >
                      <span className="text-white text-center font-['Inter'] text-sm font-medium">
                        Back
                      </span>
                    </button>
                    <button
                      onClick={handleNext}
                      className="w-20 h-8 rounded-[0.125rem] bg-white border-none transition-colors hover:bg-gray-100"
                    >
                      <span className="text-black text-center font-['Inter'] text-sm font-medium">
                        Next
                      </span>
                    </button>
                  </div>

                  <div className="pt-10 w-full max-w-[32rem] flex justify-center">
                    <p className="text-[#B8B8B8] hidden md:block text-xs font-normal font-['Inter'] leading-[1.4] text-center">
                      This is private, by default. No one can see any of this. The only people
                      who can ever see the contents of your information are people you've
                      explicitly shared its private link with.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          {isOpen && isTrue && (
            <>
              <div className="fixed inset-0 z-50 min-h-screen flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-black/10 cursor-pointer"
                  onClick={() => {
                    setIsTrue(false);
                  }}
                />
                <div className="relative w-full min-w-lg max-w-6xl p-6 min-h-[600px] mx-auto rounded-lg flex flex-col items-center justify-center text-center">
                  <button
                    onClick={() => {
                      setIsTrue(false);
                    }}
                    className="absolute top-6 right-24 sm:right-3 text-white text-2xl font-semibold bg-transparent border-none cursor-pointer"
                  >
                    &times;
                  </button>

                  <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold -mt-10 mb-10 font-['Inter']">
                    Your link is live!
                  </h2>

                  <div className="bg-black/76 p-3 sm:p-8 rounded-md w-full max-h-50 max-w-82 sm:max-w-140 z-10 flex flex-col space-y-5">
                    <p className="text-white justify-center sm:justify-start flex text-base font-medium font-['Inter']">
                      Here is your Reachlink
                    </p>
                    <div className="flex items-center sm:gap-4 w-full max-w-xs sm:max-w-120 bg-white/11 rounded-[0.125rem]">
                      <input
                        type="text"
                        value={reachLink}
                        readOnly
                        className="flex-grow w-80 max-w-80 sm:max-w-md text-white outline-none px-1.5 py-1 sm:px-4 sm:py-2 font-['Inter'] text-xs font-normal"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="p-2 text-white hover:text-gray-300"
                        title="Copy to clipboard"
                      >
                        <svg
                          width="13"
                          height="16"
                          viewBox="0 0 13 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {copied ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          ) : (
                            <path
                              d="M4.75 12.5C4.3375 12.5 3.98438 12.3531 3.69063 12.0594C3.39688 11.7656 3.25 11.4125 3.25 11V2C3.25 1.5875 3.39688 1.23438 3.69063 0.940625C3.98438 0.646875 4.3375 0.5 4.75 0.5H11.5C11.9125 0.5 12.2656 0.646875 12.5594 0.940625C12.8531 1.23438 13 1.5875 13 2V11C13 11.4125 12.8531 11.7656 12.5594 12.0594C12.2656 12.3531 11.9125 12.5 11.5 12.5H4.75ZM1.75 15.5C1.3375 15.5 0.984375 15.3531 0.690625 15.0594C0.396875 14.7656 0.25 14.4125 0.25 14V4.25C0.25 4.0375 0.321875 3.85938 0.465625 3.71563C0.609375 3.57188 0.7875 3.5 1 3.5C1.2125 3.5 1.39062 3.57188 1.53438 3.71563C1.67813 3.85938 1.75 4.0375 1.75 4.25V14H9.25C9.4625 14 9.64062 14.0719 9.78438 14.2156C9.92813 14.3594 10 14.5375 10 14.75C10 14.9625 9.92813 15.1406 9.78438 15.2844C9.64062 15.4281 9.4625 15.5 9.25 15.5H1.75Z"
                              fill="#B8B8B8"
                            />
                          )}
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                        }}
                        className="bg-white text-black px-4 py-2 -mr-2 rounded-[0.125rem] font-['Inter'] text-xs font-medium hover:bg-gray-200 transition-colors"
                      >
                        Share
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleNextClick}
                    className="absolute bottom-6 right-24 sm:right-4 bg-white text-black px-4 py-2 rounded-[0.125rem] font-['Inter'] text-xs font-medium hover:bg-gray-200 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}