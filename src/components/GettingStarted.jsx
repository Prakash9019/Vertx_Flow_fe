import React from 'react';
import { useNavigate } from 'react-router-dom';
import PurpleBG from "../assets/PurpleBG.jpg";
import UpperBG1 from "../assets/UperBG1.jpg";
import UpperBG2 from "../assets/UperBG2.jpg";

import Sidebar from './Sidebar';



const GettingStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen h-full bg-black text-white flex relative overflow-scroll">
    <div className="bg-black text-white sticky top-0 bottom-0">
            <Sidebar />
    </div>
    <div className='font-[inter] min-h-screen  mb-80 bg-black w-full text-white p-4 md:p-8'>
      <div 
      style={{
            backgroundImage: `url(${PurpleBG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }} className=" rounded-lg p-4 md:p-6 mb-8 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Not sure where to start?</h2>
          <p className="text-xs md:text-sm text-gray-300">
            Check out our resources to help get started
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 flex-shrink-0 w-full md:w-auto">
          <div
            className="relative w-full md:w-40 h-24 md:h-28 rounded-md overflow-scroll flex items-center justify-center"
          >
            <div style={{
              backgroundImage: `url(${UpperBG1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} className="absolute hover:brightness-50 hover:cursor-pointer inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div
            className="relative w-full md:w-40 h-24 md:h-28 rounded-md overflow-scroll flex items-center justify-center"
          >
            <div style={{
              backgroundImage: `url(${UpperBG2})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} className="absolute hover:brightness-50 hover:cursor-pointer inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-2 md:px-0">
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Getting started with Vertx</h2>

        <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-[#AD6FDE] mt-1"></div>
          <div className="flex-grow bg-[#0F0E16] rounded-lg p-4 md:p-5 shadow-lg">
            <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Create a Dashboard</h3>
            <p className="text-xs md:text-sm text-gray-300 mb-3 md:mb-4">
              Create a dashboard and share it via login. link to keep your most
              important stakeholders in the loop at all times. Track progress, share,
              updates, and maintain full visibility throughout your fundraising journey.
            </p>
            <button
              // onClick={() => navigate("/create-dashboard")}
              className="px-4 py-1.5 md:px-6 md:py-2 hover:cursor-pointer bg-white text-black hover:text-white rounded-md font-semibold hover:bg-black/70 transition-colors text-xs md:text-sm"
            >
              Create Dashboard
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-[#AD6FDE] mt-1"></div>
          <div className="flex-grow bg-[#0F0E16] rounded-lg p-4 md:p-5 shadow-lg">
            <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Invite a Co-founder</h3>
            <p className="text-xs md:text-sm text-gray-300 mb-3 md:mb-4">
              Bring your co-founder into the flow early. Share access, collaborate on
              outreach, and align on investor conversations because fundraising isn't
              a solo game.
            </p>
            <button
              // onClick={() => navigate("/invite-co-founder")}
              className="px-4 py-1.5 md:px-6 md:py-2 bg-white text-black hover:text-white rounded-md font-semibold hover:cursor-pointer hover:bg-black/70 transition-colors text-xs md:text-sm"
            >
              Invite Co-founder
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-[#AD6FDE] mt-1"></div>
          <div className="flex-grow bg-[#0F0E16] rounded-lg p-4 md:p-5 shadow-lg">
            <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Upload Pitch Deck</h3>
            <p className="text-xs md:text-sm text-gray-300 mb-3 md:mb-4">
              Upload your latest deck to give investors the full picture. Whether it’s product, vision, or traction let your story speak, wherever they are.
            </p>
            <div className='flex gap-2'>
            <button
              onClick={() => navigate("/evaluate")}
              className="px-4 py-1.5 md:px-6 md:py-2 bg-white text-black hover:text-white rounded-md font-semibold hover:cursor-pointer hover:bg-black/70 transition-colors text-xs md:text-sm"
            >
              Upload Deck
            </button>
            <button
              onClick={() => navigate("/evaluate")}
              className="px-4 py-1.5 md:px-6 md:py-2 bg-white text-black hover:text-white rounded-md font-semibold hover:cursor-pointer hover:bg-black/70 transition-colors text-xs md:text-sm"
            >
              Customize Deck
            </button>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 md:gap-4 mb-10 md:mb-6">
          <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-[#AD6FDE] mt-1"></div>
          <div className="flex-grow bg-[#0F0E16] rounded-lg p-4 md:p-5 shadow-lg">
            <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Create Fundraising Pipeline</h3>
            <p className="text-xs md:text-sm text-gray-300 mb-3 md:mb-4">
              Plan your raise with structure. Create stages, add leads, and track conversations so you stay in control from first intro to signed cheque.
            </p>
            <div className='flex gap-2'>
            <button
              onClick={() => navigate("/fundraising/manage")}
              className="px-4 py-1.5 md:px-6 md:py-2 bg-white text-black hover:text-white rounded-md font-semibold hover:cursor-pointer hover:bg-black/70 transition-colors text-xs md:text-sm"
            >
              Create a Pipeline
            </button>
            <button
              onClick={() => navigate("/fundraising/find")}
              className="px-4 py-1.5 md:px-6 md:py-2 bg-white text-black hover:text-white rounded-md font-semibold hover:cursor-pointer hover:bg-black/70 transition-colors text-xs md:text-sm"
            >
              Find Investors
            </button>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-[#AD6FDE] mt-1"></div>
          <div className="flex-grow bg-[#0F0E16] rounded-lg p-4 md:p-5 shadow-lg">
            <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Create ReachLink</h3>
            <p className="text-xs md:text-sm text-gray-300 mb-3 md:mb-4">
              Generate a private, shareable link to your fundraising space. Let investors explore your deck, updates, and pipeline with full control and visibility.
            </p>
            <button
              onClick={() => navigate("/fundraising/reach")}
              className="px-4 py-1.5 md:px-6 md:py-2 bg-white text-black hover:text-white rounded-md font-semibold hover:cursor-pointer hover:bg-black/70 transition-colors text-xs md:text-sm"
            >
              Create ReachLink
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-[#AD6FDE] mt-1"></div>
          <div className="flex-grow bg-[#0F0E16] rounded-lg p-4 md:p-5 shadow-lg">
            <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Raise a Fundraising Round</h3>
            <p className="text-xs md:text-sm text-gray-300 mb-3 md:mb-4">
              Push your round live, send investor invites, and collect commitments all in one place. From pitch to close, keep the momentum going.
            </p>
            <button
              onClick={() => navigate("/fundraising/manage")}
              className="px-4 py-1.5 md:px-6 md:py-2 bg-white text-black hover:text-white rounded-md font-semibold hover:cursor-pointer mb-16 hover:bg-black/70 transition-colors text-xs md:text-sm"
            >
              Raise a Round
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default GettingStarted;