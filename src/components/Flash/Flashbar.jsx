import{ useState, useEffect } from 'react';
import {useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from "../../assets/logo.svg";
import Rocket from "../../assets/rocket.svg";
import Home from "../../assets/home.svg";
import flash from "../../assets/flash.jpg";
import Ellipse from "../../assets/Ellipse23.svg";
import FundraseLogo from "../../assets/Ellipse 3.svg";
import Playground from "../../assets/Ellipse4.svg";
import UserAccount from "../../assets/account.svg";
import UserPlan from "../../assets/plan.svg";
import UserFeedback from "../../assets/feedback.svg";
import LogOut from "../../assets/logout.svg";
import { useStartupProfile } from "../../context/StartupProfileContext";
import CofounderPermissions from "../CofounderPermissions";
import API_KEY from "../../../key";
import { BiAddToQueue } from 'react-icons/bi';
import { HistoryIcon } from 'lucide-react';

export function NavIconFooter({ iconSrc, label }) { // Renamed prop to iconSrc for clarity
  return (
    <div
      className={`flex flex-col items-center transition-colors duration-200`}
    >
      {/* Use img tag and pass the source string to src */}
      <img src={iconSrc} alt={label} className="w-6 h-6 object-contain" />
      <span className="text-xs mt-1">{label}</span>
    </div>
  );
}

const Flashbar = () => {

  const {profileData} = useStartupProfile();
  const [currentPage, setPage] = useState("flash");
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  const [userRole, setUserRole] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);// Check user role on component mount
  //collapsed state from localStorage, 
  const [collapsed, setCollapsed] = useState(() => {
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    return savedCollapsedState ? JSON.parse(savedCollapsedState) : false;
  });

  const [fundraisingExpanded, setFundraisingExpanded] = useState(false);
  const [selectedFundraisingOption, setSelectedFundraisingOption] = useState('');

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
    // If sidebar collapses, also collapse the fundraising submenu
    if (collapsed) {
      setFundraisingExpanded(false);
    }
  }, [collapsed]);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (token) {
          const response = await axios.get(`${API_KEY}/api/auth/founder`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUserRole(response.data.role);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    checkUserRole();
  }, []);
  const isNew = path.includes('new');
  const isHistory = path.includes('history');


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("isVerified");
    localStorage.removeItem("sidebarCollapsed");
    navigate("/");
  };

  const handleFundraisingToggle = (e) => {
    // e.stopPropagation();
    // Only allow toggle if not collapsed
    if (!collapsed) {
      setFundraisingExpanded(!fundraisingExpanded);
    }
    console.log(fundraisingExpanded);
  };

  const handleFundraisingOptionClick = (option) => {
    setSelectedFundraisingOption(option);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);
  console.log("Is a Small Device",isMobile)
  const handleNavigation = (route) => {
    if (route === "flash" && !localStorage.getItem("token")) {
      // Show full-screen auth page (LandingAuth) if user is not logged in and trying to access explore
      setShowAuthPage(true);
    } else if (route === "flash" && localStorage.getItem("exe")) {
      navigate("/");
    } else {
      navigate(`/${route}`);
    }
  };

  return (
    <>
    {
      !isMobile ?
    (<div className={`flex h-screen ${collapsed ? 'flex-row' : 'flex-col'}`}>
      {/* Sidebar */}
      <div className={`bg-black text-white flex ${collapsed ? 'flex-row' : 'flex-col'} h-full border-r border-[rgba(184,184,184,0.13)] transition-all duration-300 ${collapsed ? 'lg:w-16 w-10' : 'w-32 lg:w-60'}`}>
        {/* Top section with logo and collapse button with !collapsed rule */}
        {!collapsed ? (
        <div className={`flex items-center justify-between p-4`}>
          <div className="text-white mt-2">
            <img
              src={Logo}
              alt="Icon"
              className="lg:w-8 lg:h-8 w-5 h-5 rounded-full"
            />
          </div>
          {/* Sidebar minimize button */}
          <button className="text-gray-400 hover:text-white mt-3 px-2" onClick={toggleSidebar}>
            <svg
              className={`lg:w-6 lg:h-6 w-4 h-4 transform transition-transform duration-300`}
              height="22"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
            >
              <path
                    d="M11.017 0.383523V12.3438H12.9347V0.383523H11.017ZM4.03917 10.206L5.04769 9.20455L2.94542 7.10227H7.50508V5.625H2.94542L5.04769 3.52273L4.03917 2.52131L0.19684 6.36364L4.03917 10.206Z"
                    fill="white"
                  />
            </svg>
            </button>
        </div>
        ):(<div className="text-white mt-4 px-1 lg:px-4 flex-col">
            <img
              src={Logo}
              alt="Icon"
              className="lg:w-8 lg:h-8 w-5 h-5 rounded-full"
            />
            <button className="text-gray-400 hover:text-white mt-3 mb-3 px-2" onClick={toggleSidebar}>
            <svg
              className={`lg:w-6 lg:h-6 w-4 h-4 transform transition-transform duration-300 rotate-180`}
              height="22"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
            >
              <path
                    d="M11.017 0.383523V12.3438H12.9347V0.383523H11.017ZM4.03917 10.206L5.04769 9.20455L2.94542 7.10227H7.50508V5.625H2.94542L5.04769 3.52273L4.03917 2.52131L0.19684 6.36364L4.03917 10.206Z"
                    fill="white"
                  />
            </svg>
            </button>
          </div>
        )}


        {/* First divider */}
        <div className="border-b border-[#B8B8B8] opacity-25 mx-4"></div>

        {/* Company section - updated with precise measurements */}
        <div className={`py-3 px-4 flex items-center ${collapsed ? 'justify-between' : 'justify-between'}`}>
          <div className={`flex items-center ${collapsed ? 'hidden' : 'block'}`}>
            <div className="w-7.5 h-7.5 bg-[#33005C] flex items-center justify-center rounded-sm mr-3">
              <span className="text-white text-sm font-semibold">{profileData ? profileData.companyName[0] : "C"}</span>
            </div>
            <div className={`${collapsed ? 'hidden' : ''} text-white text-sm font-medium`}>{profileData ? profileData.companyName : "Company Name"}</div>
          </div>
          <button className={`${collapsed ? 'hidden' : 'block'} text-[#656565] hover:text-white`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className={`py-4 ${collapsed ? 'hidden' : 'block'}`}>
            <ul>
              <li
                className={`px-4 py-2 flex items-center ${collapsed ? 'justify-between' : 'justify-between'} ${isNew ? 'bg-[#0F0E16]' : ''} hover:bg-[#0F0E16] cursor-pointer`}
                onClick={() => { navigate("/flash/new") }}
              >
                <span className={`${collapsed ? 'hidden' : 'block'} ${isNew ? 'text-white' : 'text-[#B8B8B8]'} font-medium text-sm`}>New</span>
                <span className='lg:scale-130 md:scale-110 mr-1'><BiAddToQueue/></span>
                
              </li>

              {/* Getting Started */}
              <li
                className={`px-4 py-2 flex items-center ${collapsed ? 'justify-between' : 'justify-between'} ${isHistory ? 'bg-[#0F0E16]' : ''} hover:bg-[#0F0E16] cursor-pointer`}
                onClick={() => { navigate("/flash/history") }}
              >
                <span className={`${collapsed ? 'hidden' : 'block'} ${isHistory ? 'text-white' : 'text-[#B8B8B8]'} font-medium text-sm`}>History</span>
                <span className='md:scale-80'><HistoryIcon/></span>
                
              </li>
            </ul>
          </nav>
        </div>

        {/* Third divider */}
        <div className="border-b border-[#B8B8B8] opacity-25 mx-4"></div>

        {/* Bottom section with account options */}
        {/* <div className="mt-auto">
          <ul>
          <li 
              className={`px-4 py-3 flex items-center justify-between hover:bg-[#0F0E16] ${userRole === 'founder' ? 'cursor-pointer' : ''}`}
              onClick={() => {
                if (userRole === 'founder') {
                  setShowPermissionsModal(true);
                }
              }}
            >
                            <span className={`${collapsed ? 'hidden' : 'block'} text-[#B8B8B8] font-medium text-sm`}>Your account</span>
              <img
                src={UserAccount}
                alt="User"
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
            </li>
            <li 
              className={`px-4 py-3 flex items-center justify-between hover:bg-[#0F0E16] cursor-pointer`}
              onClick={() => navigate('/payment')}
            >
              <span className={`${collapsed ? 'hidden' : 'block'} text-[#B8B8B8] font-medium text-sm`}>Upgrade plan</span>
              <img
                src={UserPlan}
                alt="Layers"
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
            </li>
            <li className={`px-4 py-3 flex items-center justify-between hover:bg-[#0F0E16] cursor-pointer`}>
              <span className={`${collapsed ? 'hidden' : 'block'} text-[#B8B8B8] font-medium text-sm`}>Leave a feedback</span>
              <img
                src={UserFeedback}
                alt="Chat"
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
            </li>
            <li className={`px-4 py-3 flex items-center justify-between hover:bg-[#0F0E16] cursor-pointer`} onClick={() => handleLogout()}>
              <span className={`${collapsed ? 'hidden' : 'block'} text-[#B8B8B8] font-medium text-sm`}>Log out</span>
              <img
                src={LogOut}
                alt="Logout"
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
            </li>
          </ul>
        </div> */}
      </div>

      {/* Main content area */}
      <div className="flex-1 bg-[#1a0b2e]">
        {/* Your main content goes here */}      </div>

      {/* Co-founder Permissions Modal */}
      {showPermissionsModal && (
        <CofounderPermissions onClose={() => setShowPermissionsModal(false)} />
      )}
    </div>):(
      <div className='fixed bottom-0 left-0 right-0 border-t border-gray-800 z-50 min-w-screen bg-black text-white flex hover:cursor-pointer justify-around items-center py-3'>
        <div
          className={`flex hover:cursor-pointer flex-col items-center hover:scale-130 ${isNew ? 'text-white font-bold scale-125' : 'scale-100 text-gray-400'}`}
          onClick={() => { navigate("/flash/new") }}
        >
          <NavIconFooter
            iconSrc={Home}
            label="New"
          />
        </div>
        <div
          className={`flex hover:cursor-pointer flex-col items-center hover:scale-130 ${isHistory ? 'text-white font-bold scale-125' : 'scale-100 text-gray-400'}`}
          onClick={() => handleNavigation("flash/history")}
        >
          <NavIconFooter
            iconSrc={flash}
            label="History"
          />
        </div>
      </div>
    )}
    </>
  );
};

export default Flashbar;
