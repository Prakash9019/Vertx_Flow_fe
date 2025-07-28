
import { useState } from "react";
import Rectangle82 from "../../assets/Rectangle 82.png";

export default function BasicForm({ isOpen = true, onClose = () => {}, formData = {}, setFormData = () => {} }) {

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
    ...formData
  });

  const [currentView, setCurrentView] = useState("profile"); // "profile" or "basics"

  // Using a placeholder image for Rectangle82 to resolve compilation error
  const Rectangle82Placeholder = Rectangle82;

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

  const handleBack = () => {
    onClose();
  };

  const handleNext = () => {
    console.log("Next clicked", localFormData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed background overlay */}
      <div className="absolute inset-0 bg-black/70 cursor-pointer" onClick={handleCancel} />

      {/* Main modal content container with background image */}
      <div
        className="relative flex flex-col items-center bg-cover bg-center bg-no-repeat
                   w-full max-w-6xl h-[calc(100vh-1rem)] sm:h-[calc(100vh-7.5rem)] overflow-y-auto "
        style={{
          backgroundImage: `url(${Rectangle82Placeholder})`,
        }}
      >
        {/* Header with gradient background */}
        <div className="relative h-32 w-full">
          <div className="absolute inset-0 " />
          <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6">
            <h1 className="text-white text-2xl font-semibold mb-2 font-['Inter']">
              {currentView === "profile" ? "Profile Information" : "Company Information"}
            </h1>
            <p className="text-white/90 text-sm font-normal font-['Inter']">
              Start by adding your profile and contact information
            </p>
          </div>
        </div>

        {/* Main content area - centered form with sidebar overlay */}
        <div className="w-full flex items-start justify-center relative mb-5">
          {/* Sidebar - positioned absolutely to overlay */}
          <div className="absolute left-0 top-0 w-64 h-full p-6 overflow-y-auto flex items-start justify-center z-10">
            <div className="space-y-1">
              <div 
                className={`font-medium mb-6 font-['Inter'] cursor-pointer transition-colors ${
                  currentView === "profile" ? "text-white text-lg" : "text-gray-400 text-sm hover:text-white"
                }`}
                onClick={() => setCurrentView("profile")}
              >
                Profile
              </div>
              
              <div className="space-y-3">
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
                <div className="text-gray-400 text-sm font-normal font-['Inter'] py-1 cursor-pointer hover:text-white transition-colors">
                  Team
                </div>
                <div className="text-gray-400 text-sm font-normal font-['Inter'] py-1 cursor-pointer hover:text-white transition-colors">
                  Company
                </div>
                <div className="text-gray-400 text-sm font-normal font-['Inter'] py-1 cursor-pointer hover:text-white transition-colors">
                  Market
                </div>
                <div className="text-gray-400 text-sm font-normal font-['Inter'] py-1 cursor-pointer hover:text-white transition-colors">
                  Traction
                </div>
                <div className="text-gray-400 text-sm font-normal font-['Inter'] py-1 cursor-pointer hover:text-white transition-colors">
                  Fundraising
                </div>
                <div className="text-gray-400 text-sm font-normal font-['Inter'] py-1 cursor-pointer hover:text-white transition-colors">
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
              {currentView === "profile" ? (
                <div className="space-y-6">
                  {/* Company Name */}
                  <div>
                    <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={localFormData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full h-9 bg-white/11 text-white outline-none rounded-[0.125rem] px-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal"
                      placeholder="Enter company name"
                    />
                  </div>

                  {/* LinkedIn URL */}
                  <div>
                    <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                      Company's Linkedin Profile URL
                    </label>
                    <input
                      type="url"
                      value={localFormData.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                      className="w-full h-9 bg-white/11 text-white outline-none rounded-[0.125rem] px-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal"
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>

                  {/* CEO/Founder Name */}
                  <div>
                    <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                      CEO / Founder Name
                    </label>
                    <input
                      type="text"
                      value={localFormData.founderName}
                      onChange={(e) => handleInputChange('founderName', e.target.value)}
                      className="w-full h-9 bg-white/11 text-white outline-none rounded-[0.125rem] px-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal"
                      placeholder="Enter CEO/Founder name"
                    />
                  </div>

                  {/* CEO/Founder LinkedIn Profile URL */}
                  <div>
                    <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                      CEO / Founder's Linkedin Profile URL
                    </label>
                    <input
                      type="url"
                      value={localFormData.founderLinkedinUrl}
                      onChange={(e) => handleInputChange('founderLinkedinUrl', e.target.value)}
                      className="w-full h-9 bg-white/11 text-white outline-none rounded-[0.125rem] px-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal"
                      placeholder="https://linkedin.com/in/yourname"
                    />
                  </div>

                  {/* CEO/Founder Email */}
                  <div>
                    <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                      CEO / Founder's Email
                    </label>
                    <input
                      type="email"
                      value={localFormData.founderEmail}
                      onChange={(e) => handleInputChange('founderEmail', e.target.value)}
                      className="w-full h-9 bg-white/11 text-white outline-none rounded-[0.125rem] px-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal"
                      placeholder="founder@company.com"
                    />
                  </div>
                </div>
              ) : (
                /* Basics View Content */
                <div className="space-y-6">
                  {/* Founded and Company Website Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                        Founded
                      </label>
                      <input
                        type="text"
                        value={localFormData.founded}
                        onChange={(e) => handleInputChange('founded', e.target.value)}
                        className="w-full h-9 bg-white/11 text-white outline-none rounded-[0.125rem] px-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal"
                        placeholder=""
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-['Inter'] text-base font-medium mb-4">
                        Company Website
                      </label>
                      <input
                        type="url"
                        value={localFormData.companyWebsite}
                        onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                        className="w-full h-9 bg-white/11 text-white outline-none rounded-[0.125rem] px-4 py-2 font-['Inter'] text-xs font-normal placeholder:text-[#656565] placeholder:font-['Inter'] placeholder:text-xs placeholder:font-normal"
                        placeholder=""
                      />
                    </div>
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
            </div>
            
            {/* Gradient masks to hide top and bottom content */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/76 to-transparent pointer-events-none z-10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/76 to-transparenr-events-none z-10"></div>
          </div>
        </div>

        {/* Navigation Buttons and Privacy Notice - positioned to align with form container */}
        <div className="w-full flex flex-col items-center pb-6 mt-2">
          {/* Bottom Navigation Buttons - aligned with form container */}
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

          {/* Privacy Notice - aligned with form container but narrower */}
          <div className="pt-10 w-full max-w-[32rem] flex justify-center">
            <p className="text-[#B8B8B8] text-xs font-normal font-['Inter'] leading-[1.4] text-center">
              This is private, by default. No one can see any of this. The only people who can ever see 
              the contents of your information are people you've explicitly shared its private link with.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}