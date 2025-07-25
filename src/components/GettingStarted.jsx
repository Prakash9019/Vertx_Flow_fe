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
      <div className='font-[inter] min-h-screen mb-80 bg-black w-full text-white p-8'>
        <div style={{
          backgroundImage: `url(${PurpleBG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }} className="rounded-lg p-6 mb-8 w-full max-w-5xl mx-auto flex flex-row items-center gap-6">
          <div className="flex-1 text-left">
            <h2 className="text-xl font-bold mb-2">Not sure where to start?</h2>
            <p className="text-sm text-gray-300">
              Check out our resources to help get started
            </p>
          </div>
          <div className="flex flex-row gap-4 flex-shrink-0 w-auto">
            <div
              className="relative w-40 h-28 rounded-md overflow-scroll flex items-center justify-center"
            >
              <div style={{
                backgroundImage: `url(${UpperBG1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div
              className="relative w-40 h-28 rounded-md overflow-scroll flex items-center justify-center"
            >
              <div style={{
                backgroundImage: `url(${UpperBG2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-5xl mx-auto px-0">
          <h2 className="text-xl font-bold mb-6">Getting started with Vertx</h2>

          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-[#AD6FDE] mt-1"></div>
            <div className="flex-grow bg-[#0F0E16] rounded-lg p-5 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Create a Dashboard</h3>
              <p className="text-sm text-gray-300 mb-4">
                Create a dashboard and share it via login. link to keep your most
                important stakeholders in the loop at all times. Track progress, share,
                updates, and maintain full visibility throughout your fundraising journey.
              </p>
              <button
                onClick={() => navigate("/create-dashboard")}
                className="px-6 py-2 bg-white text-black hover:text-white rounded-md font-semibold hover:bg-black/70 transition-colors text-sm"
              >
                Create Dashboard
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-[#AD6FDE] mt-1"></div>
            <div className="flex-grow bg-[#0F0E16] rounded-lg p-5 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Invite a Co-founder</h3>
              <p className="text-sm text-gray-300 mb-4">
                Bring your co-founder into the flow early. Share access, collaborate on
                outreach, and align on investor conversations because fundraising isn't
                a solo game.
              </p>
              <button
                onClick={() => navigate("/invite-co-founder")}
                className="px-6 py-2 bg-white text-black hover:text-white rounded-md font-semibold hover:bg-black/70 transition-colors text-sm"
              >
                Invite Co-founder
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-[#AD6FDE] mt-1"></div>
            <div className="flex-grow bg-[#0F0E16] rounded-lg p-5 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Upload Pitch Deck</h3>
              <p className="text-sm text-gray-300 mb-4">
                Upload your latest deck to give investors the full picture. Whether it’s product, vision, or traction let your story speak, wherever they are.
              </p>
              <div className='flex gap-2'>
                <button
                  onClick={() => navigate("/invite-co-founder")}
                  className="px-6 py-2 bg-white text-black hover:text-white rounded-md font-semibold hover:bg-black/70 transition-colors text-sm"
                >
                  Upload Deck
                </button>
                <button
                  onClick={() => navigate("/invite-co-founder")}
                  className="px-6 py-2 bg-white text-black hover:text-white rounded-md font-semibold hover:bg-black/70 transition-colors text-sm"
                >
                  Customize Deck
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-[#AD6FDE] mt-1"></div>
            <div className="flex-grow bg-[#0F0E16] rounded-lg p-5 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Create Fundraising Pipeline</h3>
              <p className="text-sm text-gray-300 mb-4">
                Plan your raise with structure. Create stages, add leads, and track conversations so you stay in control from first intro to signed cheque.
              </p>
              <div className='flex gap-2'>
                <button
                  onClick={() => navigate("/invite-co-founder")}
                  className="px-6 py-2 bg-white text-black hover:text-white rounded-md font-semibold hover:bg-black/70 transition-colors text-sm"
                >
                  Create a Pipeline
                </button>
                <button
                  onClick={() => navigate("/invite-co-founder")}
                  className="px-6 py-2 bg-white text-black hover:text-white rounded-md font-semibold hover:bg-black/70 transition-colors text-sm"
                >
                  Find Investors
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-[#AD6FDE] mt-1"></div>
            <div className="flex-grow bg-[#0F0E16] rounded-lg p-5 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Create ReachLink</h3>
              <p className="text-sm text-gray-300 mb-4">
                Generate a private, shareable link to your fundraising space. Let investors explore your deck, updates, and pipeline with full control and visibility.
              </p>
              <button
                onClick={() => navigate("/invite-co-founder")}
                className="px-6 py-2 bg-white text-black hover:text-white rounded-md font-semibold hover:bg-black/70 transition-colors text-sm"
              >
                Create ReachLink
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-[#AD6FDE] mt-1"></div>
            <div className="flex-grow bg-[#0F0E16] rounded-lg p-5 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Raise a Fundraising Round</h3>
              <p className="text-sm text-gray-300 mb-4">
                Push your round live, send investor invites, and collect commitments all in one place. From pitch to close, keep the momentum going.
              </p>
              <button
                onClick={() => navigate("/invite-co-founder")}
                className="px-6 py-2 bg-white text-black hover:text-white rounded-md font-semibold mb-16 hover:bg-black/70 transition-colors text-sm"
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