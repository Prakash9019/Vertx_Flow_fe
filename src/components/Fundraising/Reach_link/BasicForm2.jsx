import React, { useState } from 'react';

// Use a mock data object to populate the component content
const MOCK_LINK_DATA = {
    name: "Vertx Pitch Deck",
    url: "https://reachlink.govertx.com/reach/jaguixvyyfz",
    views: 1357,
    isActive: true,
};

// Helper function for the Copy to Clipboard action (using document.execCommand)
const copyToClipboard = (text) => {
    try {
        // Use modern navigator.clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
            return true;
        }

        // Fallback for older browsers or non-secure contexts
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        return true;
    } catch (err) {
        console.error('Copy failed:', err);
        return false;
    }
};

const LinkEntry = ({ link }) => {
    const [copied, setCopied] = useState(false);
    const [active, setActive] = useState(link.isActive);

    const handleCopyLink = () => {
        if (copyToClipboard(link.url)) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleToggle = () => {
        setActive(!active);
        // In a real app, you would call an API here to update the status
    };
    
    // --- Icons (Inline SVG for clean, fast rendering) ---

    // Copy Icon
    const CopyIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 group-hover:text-white transition duration-200">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
    );

    // Checkmark Icon for Copied state
    const CheckIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-green-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    );

    // Eye Icon for Views
    const EyeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.433 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );

    // More (Vertical Ellipsis) Icon
    const MoreIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-gray-400 hover:text-white transition duration-200">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
        </svg>
    );

    return (
        <div className="flex items-center w-full bg-[#24133d] p-3 md:p-4 rounded-xl shadow-lg border border-[#3e1b68] text-white">

            {/* 1. Link Name */}
            <div className="w-1/4 min-w-[100px] max-w-[150px] font-medium text-sm md:text-base truncate pr-2">
                {link.name}
            </div>

            {/* 2. Link URL & Copy Button */}
            <div className="flex-auto min-w-0 flex items-center bg-[#1e0d33] rounded-lg border border-[#3e1b68] mx-2">
                <input
                    type="text"
                    value={link.url}
                    readOnly
                    className="flex-grow w-full text-white outline-none bg-transparent px-3 py-2 text-xs sm:text-sm truncate font-mono"
                    title={link.url}
                />
                <button
                    onClick={handleCopyLink}
                    className={`group p-2 rounded-r-lg ${copied ? 'bg-green-700' : 'hover:bg-[#3e1b68]'} transition duration-200`}
                    title={copied ? "Copied!" : "Copy to clipboard"}
                >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
            </div>

            {/* 3. Views (Visible on sm and up) */}
            <div className="hidden sm:flex items-center space-x-1.5 w-[80px] md:w-[100px] justify-center text-sm font-light">
                <EyeIcon />
                <span className="text-gray-300">{link.views.toLocaleString()}</span>
            </div>

            {/* 4. Active Status (Toggle Switch) (Visible on sm and up) */}
            <div className="w-[100px] justify-center hidden sm:flex">
                <label htmlFor="active-toggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            id="active-toggle"
                            className="sr-only"
                            checked={active}
                            onChange={handleToggle}
                        />
                        <div className={`block ${active ? ' bg-fuchsia-400' : 'bg-white'} w-12 h-6 rounded-full`}></div>
                        <div className={` absolute left-1 top-1 w-4 h-4 rounded-full transition ${active ? 'transform translate-x-6 bg-white' : 'bg-fuchsia-600'}`}></div>
                    </div>
                </label>
            </div>

            {/* 5. View Analytics Button (Visible on md and up) */}
            <div className="w-[130px] hidden md:flex justify-center ml-4">
                <button
                    className="bg-[#9d3c5f] hover:bg-[#c24b78] text-white text-sm font-medium py-2 px-3 rounded-lg shadow-md transition duration-200"
                    onClick={() => console.log('Viewing analytics for', link.name)}
                >
                    Analytics
                </button>
            </div>

            {/* 6. More Menu */}
            <div className="w-10 flex justify-center ml-2">
                <button
                    className="p-1 rounded-full hover:bg-[#3e1b68] transition duration-200"
                    title="More options"
                >
                    <MoreIcon />
                </button>
            </div>
        </div>
    );
};

export default function BasicForm2() {
    const linkData = MOCK_LINK_DATA;

    return (
        <div className="min-h-screen bg-[#110b1a] p-4 sm:p-8 font-['Inter']">

            <div className="max-w-7xl mx-auto">
                {/* Dashboard Headers - Adjusted for sm/md alignment */}
                <div className="hidden sm:flex text-xs font-semibold uppercase text-gray-500 mb-2 pl-4 items-center">
                    {/* Widths match the LinkEntry component */}
                    <div className="w-1/4 min-w-[100px] max-w-[150px] pr-2">Link Name</div>
                    <div className="flex-1 mx-2">Link</div>
                    <div className="w-[80px] md:w-[80px] text-center">Views</div>
                    <div className="w-[100px] text-center">Active</div>
                    <div className="w-[140px] ml-4 text-center hidden md:block">Detailed Analytics</div>
                    <div className="w-13 ml-2 text-center">More</div> {/* For the More icon */}
                </div>

                {/* Single Link Entry (The component you were working on) */}
                <LinkEntry link={linkData} />

                {/* Optional: Add a subtle mobile view hint */}
                <div className="text-center text-xs text-gray-600 mt-8">
                    Resize the window to see how the component adapts responsively.
                </div>
            </div>
        </div>
    );
}