import React, { useState,useCallback,useEffect } from 'react';
import { Search, MoreVertical, ChevronDown } from 'lucide-react';
import LinkedIn from "../../assets/LinkedIn.svg"
import Link from "../../assets/link.svg"
import Mail from "../../assets/mail.svg"
import Twitter from "../../assets/twitter.svg"
import API_KEY from '../../../key';
import Dropdown from "../Dropdown.jsx"; // adjust path as per your project
import { useStartupProfile } from "../../context/StartupProfileContext.jsx";


// Simple base64 fallback avatar
const fallbackAvatar = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
// Transformer function for investor data - based on the final display needs
const transformInvestorData = (investor) => {
  // Get match percentage from API response - backend now returns match and matchValue directly
  let matchValue = 0;
  let match = "0%";
  
  // The backend now returns match and matchValue directly
  if (typeof investor.matchValue === "number") {
    matchValue = investor.matchValue;
    match = `${investor.matchValue}%`;
  } else if (typeof investor.match === "string" && investor.match.endsWith("%")) {
    match = investor.match;
    matchValue = parseInt(investor.match.replace('%', '')) || 0;
  } else if (typeof investor.match === "number") {
    matchValue = investor.match;
    match = `${investor.match}%`;
  }
  
  return {
      id: investor._id,
      name: investor.name || "Unnamed Investor",
      avatar: investor.profile_image || fallbackAvatar,
      company: investor.fund || "",
      fund: investor.fund || "",
      location: investor.global_hq || "", 
      bio: investor.overview || "",
      type: investor.type || "VC",
      checkSize: investor.cheque_range || "$N/A", 
      stage: Array.isArray(investor.stage) ? investor.stage : (investor.stage ? [investor.stage] : []),
      stageCount: Array.isArray(investor.stage) ? investor.stage.length : (investor.stage ? 1 : 0),
      industry: Array.isArray(investor.industry) ? investor.industry : (investor.industry ? [investor.industry] : []),
      industryCount: Array.isArray(investor.industry) ? investor.industry.length : (investor.industry ? 1 : 0),
      countries: Array.isArray(investor.countries) ? investor.countries : (investor.countries ? [investor.countries] : []),
      geography: Array.isArray(investor.countries) ? investor.countries : (investor.countries ? [investor.countries] : []),
      geographyCount: Array.isArray(investor.countries) ? investor.countries.length : (investor.countries ? 1 : 0),
      email: investor.email || "",
      linkedin: investor.linkedin_personal || "", 
      twitter: investor.twitter || "",
      crunchbase: investor.crunchbase || "",
      website: investor.website || "",
      match, // Use real match percentage from backend
      matchValue, // Use real match value from backend
  };
};

// Filter options extracted from investor filter.txt
const Type = [
  "VC",
  "Family Office",
  "PE Fund",
  "Incubator, Accelerator",
  "Corporate VC",
  "Solo Angel",
  "Angel Network",
  "Public fund",
  "Revenue-Based",
  "Startup Studio",
  "Seed fund",
  "Multi-stage VC",
  "Solo capitalist",
  "Full-time Operator",
  "Angel"
];
const STAGE_OPTIONS = [
  "Pre-seed", "Idea", "Prototype/MVP", "Seed", "Series A", "Series B", "Series C", "Series D", "Series E+", "Growth Equity"
];
const INDUSTRY_OPTIONS = [
  "Advertising & Marketing", "Aerospace", "Agriculture", "AI", "Analytics", "Apparel", "Applications", "AR/VR", "Art", "Automotive", "Beauty", "Biotechnology", "Blockchain", "Cannabis", "Clean Energy", "Cleantech", "Cloud Computing", "Commerce", "Community", "Construction", "Data Science", "Defense", "Design", "Developer Tools", "E-commerce", "Edtech", "Elder Care", "Electronics", "Energy", "Entertainment", "Events", "Fashion", "Fintech", "Food & Beverage", "Gaming", "Gig Economy", "Government", "Hardware", "Health & Wellness", "Healthtech", "Higher Education", "Hospitality", "Human Resources", "Impact Investing", "Industrial", "Information Technology & Services", "Insurance", "Internet", "IoT", "Legal", "Life Sciences", "Logistics", "Manufacturing", "Materials", "Media", "Media Production", "Medical Devices", "Mental Health", "Mobility", "Music", "-omics", "Online Media", "Optics, Photonics", "Outsourcing/Offshoring", "Payments", "Personal Finance", "Pharmaceuticals", "Pharma & Healthtech", "Philanthropy", "Primary/Secondary Education", "Productivity", "Program Development", "Proptech/Real Estate", "Proteins", "Public Relations & Communications", "Publishing", "Real Estate", "Recruiting", "Renewables & Environment", "Retail", "Revenue-Generating Startups", "Sales Enablement", "Security & Investigations", "Semiconductors", "Social", "Space", "Sports", "Staffing & Recruiting", "Supply Chain/Logistics", "Telecommunications", "Therapeutics", "Transportation", "Travel/Hospitality", "Travel/Tourism", "Vaccines", "Venture Capital & Private Equity", "Veterinary", "Wellness", "Wholesale", "Wireless", "B2B", "B2C", "D2C"
];
const COUNTRY_OPTIONS = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

function FindInvestors() {
  const { user_id } = useStartupProfile(); // Get user ID from context
  const [activeFindTab, setActiveFindTab] = useState("Investors");
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
      search: '',
      global_hq: [],
      countries: [],
      stage: [],
      industry: [],
      type: [], // Changed to array for multi-select
      cheque_range: '', // Assuming 'cheque_range' is a single-select or direct input
  });

  const [activeDropdown, setActiveDropdown] = useState(null);

  // Function to get match color based on percentage
  const getMatchColor = (matchValue) => {
    if (matchValue >= 0 && matchValue <= 49) return "bg-[#DE2D2D]";
    if (matchValue >= 50 && matchValue <= 67) return "bg-[#AF4F00]";
    if (matchValue >= 68 && matchValue <= 85) return "bg-[#CC8D03]";
    if (matchValue >= 86 && matchValue <= 100) return "bg-[#0E8D07]";
    return "bg-[#DE2D2D]";
  };

  // Pagination calculations
  // const totalPages = Math.ceil(investorData.length / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const currentInvestors = investorData.slice(startIndex, endIndex);

  const fetchInvestors = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
          const queryParams = new URLSearchParams({
              page: currentPage,
              limit: 10, // 10 docs per page as requested
          });

          // Add userId for AI model matching if available
          if (user_id) {
              queryParams.append('userId', user_id);
          }

          // Only add search parameter if it's not empty
          if (filters.search && filters.search.trim() !== '') {
              queryParams.append('search', filters.search.trim());
          }

          // Add filter parameters for array fields
          Object.keys(filters).forEach(key => {
              if (key === 'search') return; // Skip search as we handled it above
              
              if (Array.isArray(filters[key]) && filters[key].length > 0) {
                  queryParams.append(key, filters[key].join(',')); // Send as comma-separated string to backend
              } else if (filters[key] && !Array.isArray(filters[key]) && filters[key].trim() !== '') {
                  queryParams.append(key, filters[key]);
              }
          });

          console.log('Fetching investors with params:', queryParams.toString());
          const response = await fetch(`${API_KEY}/api/investors?${queryParams.toString()}`);
          
          if (!response.ok) {
              const errorText = await response.text();
              console.error('API Error Response:', errorText);
              throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }
          
          const data = await response.json();
          console.log('API Response Data:', data);
          
          // Transform and set investors data directly from API (which now includes match data)
          if (data.data && Array.isArray(data.data)) {
            const transformedInvestors = data.data.map(transformInvestorData);
            console.log('Transformed investors:', transformedInvestors.slice(0, 3)); // Log first 3 for debugging
            setInvestors(transformedInvestors);
              setTotalPages(data.totalPages || 1);
              setTotalCount(data.totalCount || 0);
          } else {
              console.error('Invalid data structure received:', data);
              setInvestors([]);
              setTotalPages(1);
              setTotalCount(0);
          }
      } catch (err) {
          setError(err.message);
          console.error("Error fetching investors:", err);
      } finally {
          setLoading(false);
      }
  }, [currentPage, filters, user_id]); // Include user_id in dependencies

  useEffect(() => {
    fetchInvestors();
}, [fetchInvestors]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
 // Handler for filter changes (dropdowns)
const handleSearchChange = (e) => {
  const { value } = e.target;
  setFilters(prevFilters => ({
      ...prevFilters,
      search: value
  }));
  setCurrentPage(1); // Reset to first page on search change
};

  return (
    <div className="pt-12 font-inter" onClick={() => {
      setActiveDropdown(null);
    }}>
      {/* Find Tab Navigation */}
      <div className="flex gap-12 mb-12">
        {["Venture Firms", "Investors"].map((tab) => (
          <div key={tab} className="relative">
            <button 
              onClick={() => setActiveFindTab(tab)}
              className={`pb-2 transition-colors font-medium text-base ${
                activeFindTab === tab ? 'text-white' : 'text-[#B8B8B8]'
              }`}
            >
              {tab}
            </button>
            {activeFindTab === tab && (
              <div 
                className={`absolute bottom-0 left-0 h-1 rounded-full bg-[#AD6FDE] ${
                  tab === "Venture Firms" ? 'w-[7.5rem]' : 'w-[4.5rem]'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {activeFindTab === "Investors" && (
        <div className="mb-12">
          <div className="bg-[#0F0E16] p-6 rounded-[0.625rem]">
            {/* Search and Filters */}
            <div className="flex flex-col items-center mb-6 min-w-0 md:flex-col md:justify-between lg:flex-row lg:justify-between md:gap-y-6 lg:gap-y-0">
              <div className="relative flex-shrink-0 w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-[12.5rem]">
    <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-[0.875rem] h-[0.875rem]"
    />
    <input
      type="text"
      value={filters.search}
      onChange={handleSearchChange}
      placeholder="Search database..."
                  className="w-full h-[1.875rem] rounded-[0.1875rem] bg-black text-gray-400 font-normal text-[0.625rem] pl-8 pr-2 border-none outline-none"
    />
                {loading && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2">
                    <svg className="animate-spin h-4 w-4 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  </span>
                )}
  </div>

              <div className="flex flex-col mt-4 min-w-0 md:mt-0 lg:ml-6 lg:flex-row lg:gap-x-10 sm:gap-x-4">
                <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 xl:gap-8 justify-center sm:justify-start">
     <Dropdown
  label="Type"
  options={Type}
  isMulti
  selected={filters.type}
  setSelected={(val) => setFilters((prev) => ({ ...prev, type: val }))}
 />

     <Dropdown
  label="Stage"
  options={STAGE_OPTIONS}
  isMulti
  selected={filters.stage}
  setSelected={(val) => setFilters((prev) => ({ ...prev, stage: val }))}
 />

      <Dropdown
        label="Industry"
        options={INDUSTRY_OPTIONS}
        isMulti
        selected={filters.industry}
        setSelected={(val) =>
          setFilters((prev) => ({ ...prev, industry: val }))
        }
      />
      <Dropdown
        label="Geography"
        options={COUNTRY_OPTIONS}
        isMulti
        selected={filters.countries}
        setSelected={(val) =>
          setFilters((prev) => ({ ...prev, countries: val }))
        }
      />
    </div>
  </div>
</div>

        <div className="w-full py-3">
  <div className="grid grid-cols-10 gap-5 xl:gap-4 px-2 xl:px-4">
    {/* Investor col-span-3 */}
    <div className="col-span-3 text-white text-[0.6rem] sm:text-xs font-semibold uppercase">
      INVESTOR NAME
    </div>
    <div className="text-white text-[0.6rem] sm:text-xs font-semibold uppercase text-center">
      CHECK SIZE
    </div>
    <div className="text-white text-[0.6rem] sm:text-xs font-semibold uppercase text-center">
      STAGE
    </div>
    <div className="text-white text-[0.6rem] sm:text-xs font-semibold uppercase text-center">
      INDUSTRY
    </div>
    <div className="text-white text-[0.6rem] sm:text-xs font-semibold uppercase text-center">
      GEOGRAPHY
    </div>
    <div className="text-white text-[0.6rem] sm:text-xs font-semibold uppercase text-center">
      MATCH
    </div>
    <div className="text-white text-[0.6rem] sm:text-xs font-semibold uppercase text-center">
      SUBMIT
    </div>
    <div className="text-white text-[0.6rem] sm:text-xs font-semibold uppercase text-center">
      {/* 3-dot placeholder */}
    </div>
  </div>
</div>



            {/* Scrollable Investor List */}
            <div className="bg-gray-900/30 rounded-b-lg max-h-96 overflow-y-auto scrollbar-hide scrollbar-hidden">
              {loading ? (
                <div className="text-center py-8 text-white">Loading...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">Error: {error}</div>
              ) : (
                investors.map((investor) => (
                    <div
                    key={investor.id}
                    className="grid grid-cols-10 gap-5 xl:gap-4 items-center w-full px-2 xl:px-4 py-3 hover:bg-gray-800/30 bg-black transition-colors rounded-md border-b border-gray-700/50 min-h-[5rem] xl:min-h-[6.25rem]"
                  >
                    {/* Investor Info - Takes up 3 columns */}
                    <div className="col-span-3 flex items-center gap-x-3 min-w-0">
                      <img
                        src={investor.profile_image || investor.avatar || fallbackAvatar}
                        alt={investor.name}
                        className="rounded object-cover w-10 h-10 xl:w-12 xl:h-12 bg-white flex-shrink-0" />
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-white font-normal text-sm truncate font-['Inter'] max-w-[8rem]">
                            {investor.name}
                          </span>
                          <div className="flex gap-1 flex-shrink-0">
                            <img
                              src={LinkedIn || "/placeholder.svg"}
                              alt="LinkedIn"
                              className="w-2 h-2 cursor-pointer text-[#0077B5]"
                            />
                            <img
                              src={Link || "/placeholder.svg"}
                              alt="Link"
                              className="w-2 h-2 cursor-pointer text-gray-400"
                            />
                            <img
                              src={Mail || "/placeholder.svg"}
                              alt="Mail"
                              className="w-2 h-2 cursor-pointer text-gray-400"
                            />
                            <img
                              src={Twitter || "/placeholder.svg"}
                              alt="Twitter"
                              className="w-2 h-2 cursor-pointer text-gray-400"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1 min-w-0">
                          <span className="text-white text-xs truncate font-['Inter'] text-[0.625rem] max-w-[6rem]">
                            {investor.company || investor.firm || investor.fund}
                          </span>
                          <span className="text-white text-[0.5rem] font-bold rounded-full bg-blue-600 px-2 py-0.5 flex items-center justify-center flex-shrink-0 font-['Inter'] min-w-max">
                            {investor.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Check Size - 1 column */}
                    <div className="col-span-1 flex justify-center">
                      <div className="bg-[#18002C] text-white text-xs font-semibold px-2 py-1 rounded-sm flex items-center justify-center font-['Inter'] text-[0.625rem] min-w-max max-w-full">
                        <span className="truncate">{investor.checkSize || "—"}</span>
                      </div>
                    </div>

                    {/* Stage - 1 column */}
                    <div className="col-span-1 flex flex-col gap-y-1 items-center">
                      <div className="bg-[#18002C] text-white text-xs font-semibold px-2 py-1 rounded-sm flex items-center justify-center font-['Inter'] text-[0.625rem] w-full max-w-[4rem]">
                        <span className="truncate">
                          {investor.stage?.[0] || investor.invests_in_rounds?.[0] || "—"}
                        </span>
                      </div>
                      <div className="bg-[#18002C] text-white text-xs font-semibold w-6 h-6 rounded-sm flex items-center justify-center font-['Inter'] text-[0.625rem]">
                        {investor.stage?.length > 1 ? `+${investor.stage.length - 1}` : 
                         investor.invests_in_rounds?.length > 1 ? `+${investor.invests_in_rounds.length - 1}` : "+0"}
                      </div>
                    </div>

                    {/* Industry - 1 column */}
                    <div className="col-span-1 flex flex-col gap-y-1 items-center">
                      <div className="bg-[#18002C] text-white text-xs font-semibold px-2 py-1 rounded-sm flex items-center justify-center font-['Inter'] text-[0.625rem] w-full max-w-[4rem]">
                        <span className="truncate">
                          {investor.industry?.[0] || investor.sectors?.[0] || "—"}
                        </span>
                      </div>
                      <div className="bg-[#18002C] text-white text-xs font-semibold w-6 h-6 rounded-sm flex items-center justify-center font-['Inter'] text-[0.625rem]">
                        {investor.industry?.length > 1 ? `+${investor.industry.length - 1}` : 
                         investor.sectors?.length > 1 ? `+${investor.sectors.length - 1}` : "+0"}
                      </div>
                    </div>

                    {/* Geography - 1 column */}
                    <div className="col-span-1 flex flex-col gap-y-1 items-center">
                      <div className="bg-[#18002C] text-white text-xs font-semibold px-2 py-1 rounded-sm flex items-center justify-center font-['Inter'] text-[0.625rem] w-full max-w-[4rem]">
                        <span className="truncate flex items-center gap-1">
                          {investor.countries?.[0] || "—"}
                        </span>
                      </div>
                      <div className="bg-[#18002C] text-white text-xs font-semibold w-6 h-6 rounded-sm flex items-center justify-center font-['Inter'] text-[0.625rem]">
                        {investor.countries?.length > 1 ? `+${investor.countries.length - 1}` : 
                         investor.geography?.length > 1 ? `+${investor.geography.length - 1}` : "+0"}
                      </div>
                    </div>

                    {/* Match Value - 1 column */}
                    <div className="col-span-1 flex items-center gap-1 justify-center">
                      <span
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getMatchColor(investor.matchValue)}`}
                      ></span>
                      <span className="text-white text-sm font-semibold font-['Inter']">{investor.match || "—"}</span>
                    </div>

                    {/* Submit Button - 1 column */}
                    <div className="col-span-1 flex justify-center">
                      <button
                        className="text-white text-xs font-medium rounded px-2 py-1 font-['Inter'] text-[0.625rem] transition-all hover:scale-105 min-w-[3rem] max-w-[4rem] truncate"
                        style={{
                          background:
                            "linear-gradient(260deg, rgba(0, 0, 0, 0.25) -22.9%, rgba(252, 65, 65, 0.25) 119.49%), linear-gradient(99deg, #000 -4%, #33005C 104%)",
                        }}
                      >
                        Submit
                      </button>
                    </div>

                    {/* Dropdown - 0.5 column */}
                    <div className="col-span-1 flex justify-center">
                      <div className="relative">
                        <button
                          className="hover:opacity-70 transition-colors p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === investor.id ? null : investor.id);
                          }}
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>

                        {activeDropdown === investor.id && (
                          <div className="absolute right-0 top-full mt-1 z-50 border w-[8.0625rem] h-[5.125rem] rounded border-[#0F0E16] bg-black shadow-lg">
                            <div className="py-1">
                              {[
                                { text: "Add to pipeline", icon: "💰", action: () => console.log("Add to pipeline clicked") },
                                { text: "Remove from list", icon: "🗑️", action: () => console.log("Remove from list clicked") },
                                { text: "Report an error", icon: "⚠️", action: () => console.log("Report error clicked") },
                              ].map((item, index) => (
                                <button
                                  key={index}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    item.action();
                                    setActiveDropdown(null);
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
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-12 pb-12">
              {/* Left Side: Results Count */}
              <div className="flex items-center justify-center bg-black text-gray-400 font-normal text-[0.5rem] rounded-sm w-[9.375rem] h-[1.875rem] font-inter">
                {totalCount} results found | 10 per page
              </div>

              {/* Right Side: Pagination Controls */}
              <div className="flex items-center justify-between bg-black rounded-sm px-2 w-[9rem] h-[1.875rem]">
                
                {/* Previous Button */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center justify-center rounded-sm font-bold text-[0.5rem] w-4 h-4 font-inter 
                    ${currentPage === 1 
                      ? 'bg-[rgba(51,0,92,0.35)] text-[rgba(173,111,222,0.35)] cursor-not-allowed' 
                      : 'bg-[#33005C] text-[#AD6FDE] cursor-pointer'}`}
                >
                  &lt;
                </button>

                {/* Page Info */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-normal text-[0.5rem] font-inter">
                    Page
                  </span>
                  <span className="flex items-center justify-center rounded-sm font-bold text-[0.5rem] w-[1.375rem] h-4 bg-[#33005C] text-[#AD6FDE] font-inter">
                    {currentPage.toString().padStart(3, '0')}
                  </span>
                  <span className="text-gray-400 font-normal text-[0.5rem] font-inter">
                    of {totalPages.toString().padStart(3, '0')}
                  </span>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center justify-center rounded-sm font-bold text-[0.5rem] w-4 h-4 font-inter 
                    ${currentPage === totalPages 
                      ? 'bg-[rgba(51,0,92,0.35)] text-[rgba(173,111,222,0.35)] cursor-not-allowed' 
                      : 'bg-[#33005C] text-[#AD6FDE] cursor-pointer'}`}
                >
                  &gt;
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeFindTab === "Venture Firms" && (
        <div className="py-8 text-center text-gray-400">
          <h3 className="text-2xl mb-4">Venture Firms</h3>
          <p>Browse top venture capital firms. (Coming soon: filters, search, and more details!)</p>
        </div>
      )}

      {activeFindTab === "Import" && (
        <div className="py-8 text-center text-gray-400">
          <h3 className="text-2xl mb-4">Import</h3>
          <p>Import content will go here...</p>
        </div>
      )}
    </div>
  );
}

export default FindInvestors;