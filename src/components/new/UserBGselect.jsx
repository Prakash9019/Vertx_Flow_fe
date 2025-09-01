import React, { useState, useEffect } from 'react';
import A1 from "./1.jpg";
import A2 from "./2.jpg";
import A3 from "./3.jpg";
import A4 from "./4.jpg";
import A5 from "./5.jpg";
import A6 from "./6.jpg";
import A7 from "./7.jpg";
import A8 from "./8.jpg";
import A9 from "./9.jpg";
import A10 from "./10.jpg";
import A11 from "./11.jpg";
import A12 from "./12.jpg";
import A13 from "./13.jpg";
import A14 from "./14.jpg";
import A15 from "./15.jpg";
import A16 from "./16.jpg";
import A17 from "./17.jpg";
import A18 from "./18.jpg";
import A19 from "./19.jpg";
import A20 from "./20.jpg";
import A21 from "./21.jpg";
import A22 from "./22.jpg";
import A23 from "./23.jpg";
import { ImageIcon, Palette, Check } from 'lucide-react';
import { BiDockRight } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { IoPersonCircleOutline } from "react-icons/io5";
import { PiDotsThreeBold } from "react-icons/pi";


const images = [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14, A15, A16, A17, A18, A19, A20, A21, A22, A23];

const themes = {
  original: {
    name: 'Original',
    containerClass: 'bg-black',
    textClass: 'text-white',
    buttonBg: 'bg-gray-900',
    buttonText: 'text-white',
    modalBg: 'bg-gray-900',
    modalText: 'text-white',
    iconBorder: 'border-white',
    color: '#000000',
  },
  'dark-blue': {
    name: 'Dark Blue',
    containerClass: 'bg-blue-950',
    textClass: 'text-blue-200',
    buttonBg: 'bg-blue-950',
    buttonText: 'text-blue-200',
    modalBg: 'bg-blue-900',
    modalText: 'text-blue-200',
    iconBorder: 'border-blue-200',
    color: '#1e3a8a',
  },
  'light': {
    name: 'Light',
    containerClass: 'bg-gray-200',
    textClass: 'text-gray-800',
    buttonBg: 'bg-gray-200',
    buttonText: 'text-gray-800',
    modalBg: 'bg-gray-300',
    modalText: 'text-gray-800',
    iconBorder: 'border-gray-800',
    color: '#e5e7eb',
  },
  'deep-purple': {
    name: 'Deep Purple',
    containerClass: 'bg-purple-900',
    textClass: 'text-purple-200',
    buttonBg: 'bg-purple-900',
    buttonText: 'text-purple-200',
    modalBg: 'bg-purple-950',
    modalText: 'text-purple-200',
    iconBorder: 'border-purple-200',
    color: '#581c87',
  },
  'earth-tone': {
    name: 'Earth Tone',
    containerClass: 'bg-stone-800',
    textClass: 'text-stone-300',
    buttonBg: 'bg-stone-800',
    buttonText: 'text-stone-300',
    modalBg: 'bg-stone-900',
    modalText: 'text-stone-300',
    iconBorder: 'border-stone-300',
    color: '#44403c',
  },
};

const UserBGselect = () => {
  const [backgroundImage, setBackgroundImage] = useState(images[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textPosition, setTextPosition] = useState('center');
  const [glowEffect, setGlowEffect] = useState(false);
  const [isNoCover, setIsNoCover] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(['Original']);
  const [selectedTheme, setSelectedTheme] = useState('original');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const handleImageClick = (image) => {
    setBackgroundImage(image);
    setIsModalOpen(false);
    setIsNoCover(false);
  };
  const navigate = useNavigate();
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOptionClick = (option) => {
    setSelectedOptions(prevSelected => {
      if (prevSelected.includes(option)) {
        const newSelected = prevSelected.filter(item => item !== option);
        return newSelected.length > 0 ? newSelected : ['Original'];
      } else {
        if (prevSelected.length < 1) {
          return [...prevSelected, option];
        }
        return [...prevSelected.slice(1), option];
      }
    });
    setIsMenuOpen(false);
  };

  const handleThemeClick = (themeKey) => {
    setSelectedTheme(themeKey);
    setIsThemeModalOpen(false);
  };

  useEffect(() => {
    let newTextPosition = 'center';
    let newGlowEffect = false;
    let newIsNoCover = false;

    if (selectedOptions.includes('Top')) {
      newTextPosition = 'top-left';
    }

    if (selectedOptions.includes('Center Glow')) {
      newGlowEffect = true;
    }

    if (selectedOptions.includes('No Cover')) {
      newIsNoCover = true;
    }

    setTextPosition(newTextPosition);
    setGlowEffect(newGlowEffect);
    setIsNoCover(newIsNoCover);
  }, [selectedOptions]);

  const currentTheme = themes[selectedTheme];

  return (
    <div
      className={`h-screen w-screen bg-center transition-all duration-500 relative ${isNoCover ? currentTheme.containerClass : 'bg-cover'}`}
      style={{ backgroundImage: isNoCover ? 'none' : `url(${backgroundImage})` }}
    >
      <div
        className={`${currentTheme.textClass} text-center p-4  mx-auto transition-all duration-500 relative
          ${textPosition === 'top-left' ? 'absolute top-10 left-10' : 'flex flex-col justify-center items-center h-full w-full'}`}
      >
        <h2 className={`xl:text-7xl max-w-5xl lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-[inter] font-semibold`}>
          Vertx: Pioneering Deeptech Innovation
        </h2>
        <h2 className={`xl:text-xl max-w-5xl lg:text-[19px] md:text-lg sm:text-base text-sm  mt-10 font-[inter]`}>
          Transforming The Future Through Breakthrough Technology
        </h2>
        {glowEffect && (
          <div className="w-full absolute bottom-0 left-0 glowing-text-bottom"></div>
        )}
      </div>
      <div className="absolute top-2 left-2 flex">
        <button
          onClick={() => navigate(-1)}
          className={`py-2 px-4 text-base font-[inter] font-semibold cursor-pointer rounded-l-xl border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors`}
        >
          <BiDockRight size={24} />
        </button>
        <button
          className={`pr-3 text-sm cursor-pointer font-[inter] font-semibold rounded-r-xl border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors flex items-center`}
        >
            <span>Vertx: Pioneering Deeptech Innovation</span>
        </button>
      </div>

      <div className="absolute top-2 right-2 flex">
        <button
          onClick={() => navigate()}
          className={`py-2 px-2 text-base font-[inter] font-semibold cursor-pointer rounded-l-xl border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors`}
        >
          <IoPersonCircleOutline size={24} />
        </button>
        <button
          className={`px-2 text-sm cursor-pointer font-[inter] font-semibold border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors flex items-center`}
        >
            <span>Share</span>
        </button>

        <button
          className={`px-2 text-sm cursor-pointer font-[inter] font-semibold border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors flex items-center`}
        >
            <span>Present</span>
        </button>

        <button
          onClick={() => navigate()}
          className={`py-2 px-2 text-base font-[inter] font-extrabold cursor-pointer rounded-r-xl border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors`}
        >
          <PiDotsThreeBold size={24} />
        </button>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex ">
        <button
          onClick={() => setIsModalOpen(true)}
          className={`py-2 px-4 text-base font-[inter] font-semibold cursor-pointer rounded-l-xl border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors`}
        >
          <ImageIcon size={24} />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`py-3 px-4 text-sm font-[inter] font-semibold cursor-pointer border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors`}
          >
            {selectedOptions.join(' & ')}
          </button>

          {isMenuOpen && (
            <div className={`absolute bottom-full mb-2 w-40 ${currentTheme.buttonBg} bg-opacity-75 ${currentTheme.buttonText} rounded-lg shadow-lg overflow-hidden`}>
              {['Original', 'Center Glow', 'Top', 'No Cover'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-400 transition-colors ${
                    selectedOptions.includes(option) ? 'bg-gray-500 brightness-150' : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setIsThemeModalOpen(true)}
          className={` px-4 text-sm cursor-pointer font-[inter] font-semibold rounded-r-xl border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors flex items-center`}
        >
          <Palette size={20} className="mr-2" />
            <span>{currentTheme.name === 'Original' ? 'Select Theme' : currentTheme.name}</span>
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-opacity-75 backdrop-blur-md z-50"
          onClick={closeModal}
        >
          <div
            className={`${currentTheme.modalBg} p-6 rounded-lg shadow-2xl max-w-4xl max-h-[80vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-center">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Background option ${index + 1}`}
                  onClick={() => handleImageClick(img)}
                  className={`aspect-square object-cover cursor-pointer rounded-md border-4 transition-all duration-300
                    ${backgroundImage === img ? 'border-blue-500 scale-105' : 'border-transparent hover:border-gray-300'}`}
                />
              ))}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 py-2 px-4 text-sm cursor-pointer rounded-md border-none bg-red-500 text-white float-right hover:bg-red-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isThemeModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={() => setIsThemeModalOpen(false)}
        >
          <div
            className={`${currentTheme.modalBg} ${currentTheme.modalText} p-4 rounded-lg shadow-2xl w-full max-w-sm`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Change document theme</h3>
            <div className="space-y-2">
              {Object.keys(themes).map((themeKey) => (
                <button
                  key={themeKey}
                  onClick={() => handleThemeClick(themeKey)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors
                    ${selectedTheme === themeKey ? 'bg-gray-500' : 'hover:bg-gray-400'}`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${themes[themeKey].modalBg} ${themes[themeKey].textClass}`}
                    >
                      <span className="font-bold text-xl">Aa</span>
                    </span>
                    <span className="font-medium">{themes[themeKey].name}</span>
                  </div>
                  {selectedTheme === themeKey && (
                    <Check size={20} className="text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBGselect;