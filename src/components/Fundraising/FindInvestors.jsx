import React, { useState,useCallback,useEffect } from 'react';
import { Search, MoreVertical, ChevronDown } from 'lucide-react';
import LinkedIn from "../../assets/LinkedIn.svg"
import Link from "../../assets/link.svg"
import Mail from "../../assets/mail.svg"
import Twitter from "../../assets/twitter.svg"
import API_KEY from '../../../key';
import Dropdown from "../Dropdown.jsx"; // adjust path as per your project


// Simple base64 fallback avatar
const fallbackAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIzMCIgZmlsbD0iIzFGMjkzNyIvPgogIDxjaXJjbGUgY3g9IjMwIiBjeT0iMjMiIHI9IjgiIGZpbGw9IiM2QjcyODAiLz4KICA8cGF0aCBkPSJNMTUgNTJDMTUgNDQuMjY4IDIxLjI2OCAzOCAyOSAzOEgzMUMzOC43MzIgMzggNDUgNDQuMjY4IDQ1IDUyVjYwSDE1VjUyWiIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K";

// Transformer function for investor data - based on the final display needs
const transformInvestorData = (investor) => {
  return {
      id: investor._id,
      name: investor.name || "Unnamed Investor",
      avatar: investor.profile_image || fallbackAvatar,
      company: investor.fund || "",
      fund: investor.fund || "",
      location: investor.global_hq || "", // Join array back to string for display
      bio: investor.overview || "",
      type: investor.type || "VC",
      checkSize: investor.cheque_range || "$N/A", // From string field
      stage: investor.stage || "N/A", // Join array for display
      stageCount: investor.stage, // Count for stage
      industry: investor.industry || "N/A", // Join array for display
      industryCount: investor.industry, // Count for industry
      geography: investor.countries || "N/A", // Join array for display
      geographyCount: investor.countries.length,  // Count for geography
      email: investor.email || "",
      linkedin: investor.linkedin_personal || "", // Map to 'linkedin'
      twitter: investor.twitter || "",
      crunchbase: investor.crunchbase || "",
      website: investor.website || "",
      match: "0%", // Fixed as per previous examples
      matchValue: 0, // Fixed as per previous examples
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
  const [activeFindTab, setActiveFindTab] = useState("Investors");
  const [advancedFiltersOn, setAdvancedFiltersOn] = useState(false);
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
      type: '', // Assuming 'type' is a single-select filter or direct input
      cheque_range: '', // Assuming 'cheque_range' is a single-select or direct input
  });

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [geographyDropdownOpen, setGeographyDropdownOpen] = useState(false);
  const [selectedGeographies, setSelectedGeographies] = useState([]);
  const itemsPerPage = 10;



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

    // Debounce function for search input
    const debounce = (func, delay) => {
      let timeout;
      return function(...args) {
          const context = this;
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(context, args), delay);
      };
  };

  const fetchInvestors = useCallback(debounce(async () => {
      setLoading(true);
      setError(null);
      try {
          const queryParams = new URLSearchParams({
              page: currentPage,
              limit: 10, // 10 docs per page as requested
              search: filters.search,
          });

          // Add filter parameters for array fields
          Object.keys(filters).forEach(key => {
              if (Array.isArray(filters[key]) && filters[key].length > 0) {
                  queryParams.append(key, filters[key].join(',')); // Send as comma-separated string to backend
              } else if (filters[key] && !Array.isArray(filters[key])) {
                  queryParams.append(key, filters[key]);
              }
          });

          const response = await fetch(`${API_KEY}/api/investors?${queryParams.toString()}`);
          console.log(response.data)
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setInvestors(data.data.map(transformInvestorData)); // Transform data for display
          setTotalPages(data.totalPages);
          setTotalCount(data.totalCount);
      } catch (err) {
          setError(err.message);
          console.error("Error fetching investors:", err);
      } finally {
          setLoading(false);
      }
  }, 300), [currentPage, filters]); // Debounce the fetch call

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
 const handleFilterChange = (e) => {
  const { name, value, selectedOptions } = e.target;
  // For multi-select dropdowns, collect all selected options
  if (e.target.multiple) {
      const selectedValues = Array.from(selectedOptions).map(option => option.value);
      setFilters(prevFilters => ({
          ...prevFilters,
          [name]: selectedValues
      }));
  } else { // For single-select dropdowns or text inputs
      setFilters(prevFilters => ({
          ...prevFilters,
          [name]: value
      }));
  }
  setCurrentPage(1); // Reset to first page on filter change
};

// Handler for search input
const handleSearchChange = (e) => {
  const { value } = e.target;
  setFilters(prevFilters => ({
      ...prevFilters,
      search: value
  }));
  setCurrentPage(1); // Reset to first page on search change
};

// Handler to clear all filters
const handleClearFilters = () => {
  setFilters({
      search: '',
      global_hq: [],
      countries: [],
      stage: [],
      industry: [],
      type: '',
      cheque_range: '',
  });
  setCurrentPage(1); // Reset to first page
};




  const handleGeographyToggle = (geography) => {
    setSelectedGeographies(prev => 
      prev.includes(geography) 
        ? prev.filter(g => g !== geography)
        : [...prev, geography]
    );
  };

  const resetAllGeographies = () => {
    setSelectedGeographies([]);
  };

  return (
    <div className="pt-12 font-inter" onClick={() => {
      setActiveDropdown(null);
      setGeographyDropdownOpen(false);
    }}>
      {/* Find Tab Navigation - Fixed */}
      {/* <div className="flex gap-12 mb-12">
        {findTabsArray.map((tab) => (
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
                  tab === "Venture Firms" ? 'w-[7.5rem]' : 
                  tab === "Investors" ? 'w-[4.5rem]' : 'w-[4rem]'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div> */}

      {activeFindTab === "Investors" && (
        <div className="mb-12">
          <div className="bg-[#0F0E16] p-6 rounded-[0.625rem]">
            {/* Search and Filters */}
            <div class="flex flex-col items-center mb-6 min-w-0 md:flex-col md:justify-between lg:flex-row lg:justify-between md:gap-y-6 lg:gap-y-0">
  <div class="relative flex-shrink-0 w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-[12.5rem]">
    <Search
      class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-[0.875rem] h-[0.875rem]"
    />
    <input
      type="text"
      value={filters.search}
      onChange={handleSearchChange}
      placeholder="Search database..."
      class="w-full h-[1.875rem] rounded-[0.1875rem] bg-black text-gray-400 font-normal text-[0.625rem] pl-8 pr-2 border-none outline-none"
    />
  </div>

  <div class="flex flex-col mt-4 min-w-0 md:mt-0 lg:ml-6 lg:flex-row lg:gap-x-10 sm:gap-x-4">
    <div class="flex flex-wrap gap-2 sm:gap-4 md:gap-6 xl:gap-8 justify-center sm:justify-start">
      <Dropdown
        label="Type"
        options={Type}
        selected={filters.type}
        setSelected={(val) =>
          setFilters((prev) => ({ ...prev, type: val }))
        }
      />
      <Dropdown
        label="Stage"
        options={STAGE_OPTIONS}
        isMulti
        selected={filters.stage}
        setSelected={(val) =>
          setFilters((prev) => ({ ...prev, stage: val }))
        }
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

            {/* Table Header */}
            <div className="flex items-center py-4 px-4 xl:px-6 overflow-x-auto min-w-full">
              {/* Investor Name Header - Adjust width for smaller screens */}
              <div className="flex-shrink-0 w-[10rem] sm:w-[12rem] md:w-[15rem] lg:w-[17rem]">
                <div className="text-white font-semibold text-[0.5rem] sm:text-xs uppercase tracking-[0.05em] whitespace-nowrap">
                  INVESTOR NAME
                </div>
              </div>

              {/* Details Headers Section - Ensure proper spacing and min-width */}
              <div className="flex items-center justify-between flex-grow gap-x-2 sm:gap-x-4 md:gap-x-6 xl:gap-x-10 min-w-fit">
                {/* CHECK SIZE Header */}
                <div className="flex justify-center flex-shrink-0 w-[3rem] sm:w-[4rem]">
                  <div className="text-white font-semibold text-[0.5rem] sm:text-xs uppercase tracking-[0.05em] text-center whitespace-nowrap">
                    CHECK SIZE
                  </div>
                </div>

                {/* STAGE Header */}
                <div className="flex justify-center flex-shrink-0 w-[4rem] sm:w-[5rem]">
                  <div className="text-white font-semibold text-[0.5rem] sm:text-xs uppercase tracking-[0.05em] text-center whitespace-nowrap">
                    STAGE
                  </div>
                </div>

                {/* INDUSTRY Header */}
                <div className="flex justify-center flex-shrink-0 w-[4rem] sm:w-[5rem] md:w-[6rem] lg:w-[7rem] xl:w-[8rem]">
                  <div className="text-white font-semibold text-[0.5rem] sm:text-xs uppercase tracking-[0.05em] text-center whitespace-nowrap">
                    INDUSTRY
                  </div>
                </div>

                {/* GEOGRAPHY Header */}
                <div className="flex justify-center flex-shrink-0 w-[4rem] sm:w-[5rem] md:w-[6rem] lg:w-[7rem] xl:w-[8rem]">
                  <div className="text-white font-semibold text-[0.5rem] sm:text-xs uppercase tracking-[0.05em] text-center whitespace-nowrap">
                    GEOGRAPHY
                  </div>
                </div>

                {/* MATCH Header */}
                <div className="flex justify-center flex-shrink-0 w-[3rem] sm:w-[4rem]">
                  <div className="text-white font-semibold text-[0.5rem] sm:text-xs uppercase tracking-[0.05em] text-center whitespace-nowrap">
                    MATCH
                  </div>
                </div>

                {/* SUBMIT DECK Header */}
                <div className="flex justify-center flex-shrink-0 w-[4rem] sm:w-[5rem] md:w-[6rem] lg:w-[7rem] xl:w-[8rem]">
                  <div className="text-white font-semibold text-[0.5rem] sm:text-xs uppercase tracking-[0.05em] text-center whitespace-nowrap">
                    SUBMIT DECK
                  </div>
                </div>

                {/* Options Header - maintains fixed space */}
                <div className="flex-shrink-0 w-[1.5rem]"></div>
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
                            {investor.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between flex-grow gap-x-2 sm:gap-x-4 md:gap-x-6 xl:gap-x-10 min-w-0">

{/* Check Size */}
<div className="bg-[#18002C] text-white text-xs font-semibold w-20 h-6 rounded-sm flex items-center justify-center flex-shrink-0 font-['Inter'] text-[0.625rem]">
{investor.checkSize || "—"}
</div>

{/* Stage */}
<div className="flex flex-col gap-y-1 flex-shrink-0">
<div className="bg-[#18002C] text-white text-xs font-semibold w-16 h-6 rounded-sm flex items-center pl-2 font-['Inter'] text-[0.625rem]">
  {investor.stage?.[0] || investor.invests_in_rounds?.[0] || "—"}
</div>
<div className="bg-[#18002C] text-white text-xs font-semibold w-6 h-6 rounded-sm flex items-center justify-center font-['Inter'] text-[0.625rem]">
  {investor.stage?.length > 1 ? `+${investor.stage.length - 1}` : 
   investor.invests_in_rounds?.length > 1 ? `+${investor.invests_in_rounds.length - 1}` : "+0"}
</div>
</div>

{/* Industry */}
<div className="flex flex-col gap-y-1 flex-shrink-0">
<div className="bg-[#18002C] text-white text-xs font-semibold w-16 h-6 rounded-sm flex items-center pl-2 font-['Inter'] text-[0.625rem]">
  {investor.industry?.[0] || investor.sectors?.[0] || "—"}
</div>
{investor.industry.length>0 && <div className="bg-[#18002C] text-white text-xs font-semibold w-6 h-6 rounded-sm flex items-center justify-center font-['Inter'] text-[0.625rem]">
  {investor.industry?.length > 1 ? `+${investor.industry.length - 1}` : 
   investor.sectors?.length > 1 ? `+${investor.sectors.length - 1}` : "+0"}
</div>}
</div>

{/* Geography */}
<div className="flex items-center gap-1 flex-shrink-0">
<div className="flex items-center gap-1 bg-[#18002C] rounded-sm px-1 py-0.5">
  <div className="w-5 h-3 flex items-center justify-center">
    <img src="/placeholder.svg?height=12&width=20" alt="Flag" />
  </div>
</div>
<div className="bg-[#18002C] text-white text-xs font-semibold w-6 h-6 rounded-sm flex items-center justify-center font-['Inter'] text-[0.625rem]">
  {investor.geography || (investor.geography?.length > 0 ? `+${investor.geography.length}` : "+0")}
</div>
</div>

{/* Match Value */}
<div className="flex items-center gap-1 flex-shrink-0">
<div
  className="w-2.5 h-2.5 rounded-full"
  style={{ background: getMatchColor(investor.matchValue) }}
></div>
<span className="text-white text-base font-semibold font-['Inter']">{investor.match || "—"}</span>
</div>

{/* Submit Button */}
<button
className="text-white text-xs font-medium rounded w-15 h-7 flex-shrink-0 font-['Inter'] text-[0.625rem] transition-all hover:scale-105"
style={{
  background:
    "linear-gradient(260deg, rgba(0, 0, 0, 0.25) -22.9%, rgba(252, 65, 65, 0.25) 119.49%), linear-gradient(99deg, #000 -4%, #33005C 104%)",
}}
>
Submit
</button>

{/* Dropdown */}
<div className="relative flex-shrink-0">
<button
  className="hover:opacity-70 transition-colors"
  onClick={(e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === investor.id ? null : investor.id);
  }}
>
  <MoreVertical className="w-6 h-6 text-gray-400" />
</button>

{activeDropdown === investor.id && (
  <div className="absolute right-0 top-full mt-1 z-50 border w-[8.0625rem] h-[5.125rem] rounded border-[#0F0E16] bg-black shadow-lg">
    <div className="py-1">
      {[{ text: "Add to pipeline", icon: "💰", action: () => console.log("Add to pipeline clicked"), requiresEdit: true },
        { text: "Remove from list", icon: "🗑️", action: () => handleRemoveInvestor(investor.id || investor._id), requiresEdit: true },
        { text: "Report an error", icon: "⚠️", action: () => console.log("Report error clicked"), requiresView: true },
      ].filter(item => {
        if (item.requiresEdit && !canEdit) return false;
        if (item.requiresView && !canView) return false;
        return true;
      }).map((item, index) => (
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
          <p>Venture Firms content will go here...</p>
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