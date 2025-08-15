import Sidebar from './Sidebar';
import Bg from '../assets/FlashBG.png'
import { useState } from 'react';
import { BiDockLeft, BiDockRight } from 'react-icons/bi';
import { ArrowLeft } from 'lucide-react';
import logo from '../assets/logo.svg';
import U1 from '../assets/U1.jpg';
import U2 from '../assets/U2.jpg';
import { useNavigate } from 'react-router-dom';



const Flash = () => {
  const [clicked, setClicked] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const handleClicked = () => {
    setClicked(true);
  };
  const handleCollapsed = () => {
    setCollapsed(true);
  };
  const handleNCollapsed = () => {
    setCollapsed(false);
  };
  return (
    <>
    {!clicked && (
            <div  className="min-h-screen bg-black text-white flex relative overflow-hidden">    
        <div className="bg-black text-white">
                <Sidebar />
        </div>
        <div className='relative m-8 w-full bg-no-repeat bg-cover bg-right' style={{
        fontFamily: "'Crimson Text', serif",
        backgroundImage: `url(${Bg})`
        }}>
        <div className="absolute inset-0 backdrop-brightness-50"></div>
        <div className="relative z-10 p-4 text-white flex flex-col items-center justify-center text-center h-full">
            <h1 className="text-5xl font-normal mb-2">
                Generate Pitch Decks Instantly.
            </h1>
            <p className="text-base font-semibold font-[inter] mb-8">
                Decks that highlight your vision, crafted for investors and designed for impact.
            </p>
            <button onClick={handleClicked} className="bg-white text-black px-12 py-3 rounded-md font-semibold text-lg font-[inter] hover:bg-gray-200 transition-colors duration-300">
                Create now
            </button>
        </div>
        </div>

            </div>
    )}
    {clicked && (
        <div className="min-h-screen bg-black text-white flex flex-col p-2 lg:p-8 space-y-2 lg:space-y-8">
          <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center mb-0 lg:mb-8 space-y-2 lg:space-y-0">
            <div className="flex gap-1">
              {!collapsed && (
                <>
                  <div className="flex bg-[#232323AB] p-2 rounded-md items-center justify-between">
                    <div className="flex font-[inter]">
                      <button className="px-4 font-medium py-2 text-xs sm:text-sm text-white rounded-md hover:bg-gray-700">
                        New
                      </button>
                      <button className="px-4 font-medium py-2 text-xs sm:text-sm text-white rounded-md border-l border-gray-700 hover:bg-gray-700">
                        History
                      </button>
                      <button className="px-4 py-2 text-xs sm:text-sm bg-[#A55EEB] rounded-md text-black font-bold border-l border-gray-700 hover:bg-[#B393DF]">
                        EXIT
                      </button>
                      <button
                        onClick={handleCollapsed}
                        className="px-4 font-medium py-2 text-lg sm:text-xl text-white border-l border-gray-700 rounded-md hover:bg-gray-700"
                      >
                        <BiDockRight />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setClicked(false)}
                    className="flex items-center space-x-2 font-medium font-[inter] px-4 py-2 text-xs sm:text-sm bg-[#232323AB] text-white rounded-md"
                  >
                    <ArrowLeft />
                    <span>Back</span>
                  </button>
                </>
              )}
              {collapsed && (
                <div className="flex gap-2 font-medium font-[inter] w-full lg:min-w-90">
                  <button
                    onClick={handleNCollapsed}
                    className="px-4 hover:bg-gray-700 py-2 text-xl bg-[#232323AB] text-white rounded-md"
                  >
                    <BiDockRight className="" />
                  </button>
                  <button
                    onClick={() => setClicked(false)}
                    className="flex items-center space-x-2 gap-2 px-4 py-2 text-sm bg-[#232323AB] text-white rounded-md"
                  >
                    <ArrowLeft className="" />
                    <span>Back</span>
                  </button>
                </div>
              )}
            </div>
            <div
              style={{ fontFamily: "'Crimson Text', serif" }}
              className="flex items-center text-sm sm:text-base mt-3 sm:mt-0 justify-center mx-auto -mb-8 sm:mb-0"
            >
              <span className="text-gray-400">FLASH BY</span>
              <img className="w-4 h-4 mx-2" src={logo} alt="" />
              <span className="text-white font-bold ml-1">VERTX</span>
            </div>
            <div className="min-w-90"></div>
          </div>

          <div className="flex flex-col flex-1 items-center justify-center">
            <div className="flex flex-col  items-center text-center space-y-2 sm:space-y-4 mb-4 sm:mb-8">
              <h1 className="text-[28px] sm:text-[32px] font-[inter] font-semibold">
                Create a new deck
              </h1>
              <p className="text-[#D9D9D9AD]/68 text-sm sm:text-base font-[inter] font-medium">
                Describe your startup in a short description to create your pitch
                deck.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2 sm:space-y-4 mb-6 sm:mb-8 w-full max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="What would you like to create today?"
                className="w-full h-20 p-4 font-[inter] font-medium bg-[#232323]/67 text-white border placeholder:text-sm placeholder:sm:text-base border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
              <div className="flex space-x-4 justify-start w-full">
                <button className="px-4 py-2 text-xs font-medium font-[inter] bg-[#101010] text-white rounded-md ">
                  Pre-Seed Pitch Deck
                </button>
                <button className="px-4 py-2 bg-[#101010] text-xs font-medium font-[inter] text-white rounded-md ">
                  Series A Pitch Deck
                </button>
              </div>
            </div>

            <div className="flex flex-col items-start space-y-4 w-full max-w-sm md:max-w-2xl mx-auto">
              <p className="text-gray-400 text-sm font-medium font-[inter] ">
                Try these...
              </p>
              <div className="flex space-x-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-40 md:w-80 md:h-40 h-30 rounded-md overflow-hidden">
                    <img
                      src={U1}
                      alt="Create from Scratch"
                      className="object-cover brightness-50 w-full h-full"
                    />
                  </div>
                  <p className="text-xs font-medium font-[inter]">
                    Create from Scratch
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-40 md:w-80 md:h-40 h-30 rounded-md overflow-hidden">
                    <img
                      src={U2}
                      alt="Checkout Templates"
                      className="object-cover brightness-50 w-full h-full"
                    />
                  </div>
                  <p className="text-xs font-medium font-[inter]">
                    Checkout Templates
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-0 sm:mt-6 w-full max-w-sm sm:max-w-2xl mx-auto p-4 bg-[#232323]/67 gap-5 rounded-md">
            <div className="flex space-x-1 sm:space-x-4">
              <select className="bg-[#232323]/67 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md focus:outline-none">
                <option className="sm:text-xs text-[9px] font-medium font-[inter]">
                  No. of Slides
                </option>
              </select>
              <select className="bg-[#232323]/67 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md focus:outline-none">
                <option className="sm:text-xs text-[9px] font-[inter]">
                  Content Style
                </option>
              </select>
            </div>
            <button className="px-2 py-1 sm:px-6 sm:py-2 sm:text-sm text-[11px] font-medium font-[inter] bg-white text-black rounded-md">
              Continue
            </button>
          </div>
        </div>
      )}

    </>
  )
}

export default Flash