import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { createRoot } from 'react-dom/client';
import { Image, Palette, Plus } from 'lucide-react';
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
import B1 from "./1.png"
import B2 from "./24.jpg"
import B3 from "./25.jpg"
import C1 from "./26.jpg"
import B4 from "./2.png"


import { ImageIcon, Check } from 'lucide-react';
import { BiDockRight } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { IoPersonCircleOutline } from "react-icons/io5";
import { PiDotsThreeBold, PiSelectionBackground } from "react-icons/pi";
const images = [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14, A15, A16, A17, A18, A19, A20, A21, A22, A23];
// Theme classes
const themes = {
  dark: {
    bg: 'bg-[#021e1d]',
    text: 'text-white',
    card: 'bg-gradient-to-b from-black/70 from-35% via-white/30 via-129% to-black to-100%',
  },
  light: {
    bg: 'bg-gray-100',
    text: 'text-gray-900',
    card: 'bg-gradient-to-b from-white/70 to-gray-200',
  },
  warm: {
    bg: 'bg-orange-100',
    text: 'text-black',
    card: 'bg-gradient-to-b from-orange-200 to-orange-100',
  },
  DeepPurple: {
    bg: 'bg-purple-400',
    text: 'text-black',
    card: 'bg-gradient-to-b from-purple-300 to-orange-100',
  },
  DarkBlue: {
    bg: 'bg-blue-950',
    text: 'text-white',
    card: 'bg-gradient-to-b from-blue-400 to-blue-100',
  },
  EarthStone: {
    bg: 'bg-stone-800',
    text: 'text-stone-900',
    card: 'bg-gradient-to-b from-stone-400 to-stone-100',
  }
};

const backgrounds = {
  original: {
    text: 'text-white',
    card: 'bg-gradient-to-b from-black/70 from-35% via-white/30 via-129% to-black to-100%',
  },
  light: {
    text: 'text-gray-900',
    card: 'bg-gradient-to-b from-white/70 to-gray-200',
  },
  dark: {
    text: 'text-white',
    card: 'bg-black',
  },
  red: {
    text: 'text-gray-100',
    card: 'bg-red-600',
  },
  orange: {
    text: 'text-white',
    card: 'bg-orange-600',
  },
  amber: {
    text: 'text-gray-900',
    card: 'bg-amber-400',
  },
  yellow: {
    text: 'text-white',
    card: 'bg-yellow-600',
  },
  pink: {
    text: 'text-gray-100',
    card: 'bg-pink-600',
  },
  sky: {
    text: 'text-white',
    card: 'bg-sky-600',
  },
  lime: {
    text: 'text-gray-900',
    card: 'bg-lime-600',
  },
  teal: {
    text: 'text-white',
    card: 'bg-teal-600',
  },
  purple: {
    text: 'text-gray-900',
    card: 'bg-purple-600',
  },
  rose: {
    text: 'text-white',
    card: 'bg-rose-600',
  },
  green: {
    text: 'text-gray-900',
    card: 'bg-green-500',
  },
  cyan: {
    text: 'text-white',
    card: 'bg-cyan-600',
  },
  blue: {
    text: 'text-gray-900',
    card: 'bg-blue-700',
  },
  indigo: {
    text: 'text-gray-100',
    card: 'bg-indigo-800',
  },
  emerald: {
    text: 'text-white',
    card: 'bg-emerald-700',
  },
  violet: {
    text: 'text-gray-900',
    card: 'bg-violet-600',
  },
  fuchsia: {
    text: 'text-black',
    card: 'bg-fuchsia-600',
  },
  LightPurple: {
    text: 'text-black',
    card: 'bg-gradient-to-b from-purple-300 to-orange-100',
  },
  SkyBlue: {
    text: 'text-white',
    card: 'bg-gradient-to-b from-blue-400 to-blue-100',
  },
  EarthStone: {
    text: 'text-stone-900',
    card: 'bg-gradient-to-b from-stone-400 to-stone-100',
  },
  OceanSky: {
    text: 'text-white',
    card: 'bg-gradient-to-br from-cyan-500 to-blue-800',
  },
  Sunrise: {
    text: 'text-gray-900',
    card: 'bg-gradient-to-r from-red-400 via-orange-300 to-yellow-200',
  },
  ForestMoss: {
    text: 'text-white',
    card: 'bg-gradient-to-b from-green-700 to-lime-500',
  },
  CrimsonFade: {
    text: 'text-white',
    card: 'bg-gradient-to-t from-red-800 to-pink-500', // Bottom-up fade from dark red
  },
  Midnight: {
    text: 'text-white',
    card: 'bg-gradient-to-l from-gray-900 via-indigo-900 to-blue-900', // Dark, multi-stop leftward fade
  },
  PeachCobbler: {
    text: 'text-gray-900',
    card: 'bg-gradient-to-tr from-orange-200 to-pink-100', // Top-right light gradient
  },
  CoolMint: {
    text: 'text-gray-900',
    card: 'bg-gradient-to-r from-teal-200 to-green-100', // Light green and teal
  },
  Cyberpunk: {
    text: 'text-white',
    card: 'bg-gradient-to-bl from-fuchsia-600 via-purple-700 to-black', // Neon/Dark contrast
  },
  GoldenHour: {
    text: 'text-gray-900',
    card: 'bg-gradient-to-b from-yellow-300 via-amber-400 to-orange-500', // Sunset golds
  },
  LavenderDream: {
    text: 'text-gray-900',
    card: 'bg-gradient-to-tl from-indigo-300 to-pink-200', // Top-left gentle purple and pink
  },
  OceanDeep: {
    text: 'text-white',
    card: 'bg-gradient-to-b from-blue-900 to-cyan-500', // Dark blue to bright cyan
  },
  DesertHeat: {
    text: 'text-white',
    card: 'bg-gradient-to-r from-red-700 via-yellow-600 to-amber-900', // Hot desert tones
  },
  AuroraBorealis: {
    text: 'text-white',
    card: 'bg-gradient-to-br from-emerald-400 via-lime-500 to-sky-400', // Vibrant northern lights colors
  },
  PlumBlossom: {
    text: 'text-white',
    card: 'bg-gradient-to-r from-purple-800 to-rose-500', // Rich purple to rose
  },
  StoneWash: {
    text: 'text-gray-900',
    card: 'bg-gradient-to-t from-gray-300 to-white', // Simple light gray/white
  },
  NeonPunch: {
    text: 'text-black',
    card: 'bg-gradient-to-l from-lime-300 to-fuchsia-300', // Very bright, high-contrast colors
  },
  SlateOcean: {
    text: 'text-white',
    card: 'bg-gradient-to-tr from-slate-900 to-blue-700', // Dark slate to blue
  },
  Bubblegum: {
    text: 'text-gray-900',
    card: 'bg-gradient-to-b from-pink-400 to-purple-400', // Fun, vibrant pink and purple
  }
};

const themes2 = {
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
    // Refs for Froala Editors
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

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

    // Froala Editor Initialization
    useEffect(() => {
        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        // Define the requested expanded configuration object
        const expandedFroalaConfig = {
            inline: true,
            toolbarInline: true,
            toolbarVisibleWithoutSelection: true,
            charCounterCount: false,
            wordCounterCount: false,
            
            toolbarButtons: {
                'moreText': {
                    buttons: [
                        'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
                        'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'insertImage',
                        'align', 'quote', 'formatOL', 'formatUL', 'outdent', 'indent',
                        'insertLink', 'paragraphStyle', 'insertVideo', 'insertFile', 'insertTable',
                        'undo', 'redo', 'clearFormatting', 'selectAll', 'html'
                    ],
                    buttonsVisible: 12,
                    align: 'center'
                }
            },
            
            imageEditButtons: ['imageDisplay', 'imageAlign', 'imageSize', 'imageRemove'],
            imageResizer: {
                handle: 'all',
                minWidth: 16,
                minHeight: 16
            },
        };

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                
                // Initialize Title Editor with expanded config
                if (titleRef.current) {
                    new window.FroalaEditor(titleRef.current, expandedFroalaConfig);
                }
                
                // Initialize Subtitle Editor with expanded config
                if (subtitleRef.current) {
                    new window.FroalaEditor(subtitleRef.current, expandedFroalaConfig);
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            // Cleanup the dynamically added elements
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
            // Froala editor cleanup (if required, though for inline this often works without it)
            // Note: Destroying a Froala instance requires accessing the instance object which is not directly exposed by `new window.FroalaEditor` call.
            // For a clean React unmount, you'd typically manage the editor instances, but for brevity, we focus on DOM cleanup.
        };
    }, []);

    const currentTheme = themes2[selectedTheme];

    return (
        <div
            className={`h-screen w-screen bg-center transition-all duration-500 relative ${isNoCover ? currentTheme.containerClass : 'bg-cover'}`}
            style={{ backgroundImage: isNoCover ? 'none' : `url(${backgroundImage})` }}
        >
            <div
                className={`${currentTheme.textClass} text-center p-4  mx-auto transition-all duration-500 relative
                ${textPosition === 'top-left' ? 'absolute top-10 left-10' : 'flex flex-col justify-center items-center h-full w-full'}`}
            >
                <div ref={titleRef}>
                <h2  
                    contentEditable 
                    suppressContentEditableWarning 
                    className={`xl:text-7xl max-w-5xl lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-[inter] font-semibold`}
                >
                    Vertx: Pioneering Deeptech Innovation
                </h2>
                </div>
                <div ref={subtitleRef} >
                <h2 
                    contentEditable 
                    suppressContentEditableWarning 
                    className={`xl:text-xl max-w-5xl lg:text-[19px] md:text-lg sm:text-base text-sm  mt-10 font-[inter]`}
                >
                    Transforming The Future Through Breakthrough Technology
                </h2>
                </div>
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
                            {Object.keys(themes2).map((themeKey) => (
                                <button
                                    key={themeKey}
                                    onClick={() => handleThemeClick(themeKey)}
                                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors
                                        ${selectedTheme === themeKey ? 'bg-gray-500' : 'hover:bg-gray-400'}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${themes2[themeKey].modalBg} ${themes2[themeKey].textClass}`}
                                        >
                                            <span className="font-bold text-xl">Aa</span>
                                        </span>
                                        <span className="font-medium">{themes2[themeKey].name}</span>
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

const TheChallangePage = ({theme, background}) => {
  const editorRef = useRef(null);
  const currentTheme = themes[theme];
  const currentBG = backgrounds[background]
  useEffect(() => {
    // Dynamically load the Froala CSS and JS files from CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';
    
    const initializeEditor = () => {
      if (editorRef.current && window.FroalaEditor) {
        new window.FroalaEditor(editorRef.current, {
          inline: true,
          toolbarInline: true,
          toolbarButtons: {
            'moreText': {
                buttons: [
                    'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
                    'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'insertImage',
                    'align', 'quote', 'formatOL', 'formatUL', 'outdent', 'indent',
                    'insertLink', 'paragraphStyle', 'insertVideo', 'insertFile', 'insertTable',
                    'undo', 'redo', 'clearFormatting', 'selectAll', 'html'
                ],
                buttonsVisible: 12,
                align: 'center'
            }
          },
          imageEditButtons: ['imageDisplay', 'imageAlign', 'imageSize', 'imageRemove'],
          imageResizer: {
            handle: 'all',
            minWidth: 16,
            minHeight: 16 
          },
          charCounterCount: false,
          wordCounterCount: false,
          toolbarVisibleWithoutSelection: true
        });
      }
    };

    script.onload = () => {
      setTimeout(initializeEditor, 100);
    };

    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      if (editorRef.current && editorRef.current.editor) {
        editorRef.current.editor.destroy();
      }
    };
  }, []);
  return (
    <div className={`p-10 font-[inter] min-h-screen max-h-screen overflow-hidden ${themes[theme].bg} ${currentBG.text}`}>
      <div className={`max-w-5xl shadow-2xl rounded-md ${currentBG.card} p-5 mx-auto flex flex-col justify-center text-center items-center`}>
        <div className='border-[2.5px] w-full min-h-150 p-5'>
          <div
            ref={editorRef}
            className="prose max-w-xl mx-auto focus:outline-none"
          >
            <h1 className="text-4xl font-semibold my-15">
              The Challenge
            </h1>
            <h2>Welcome to the Editable Page. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat beatae magni perspiciatis ex earum consequatur, commodi a laudantium incidunt ad.</h2>
            <p>Feel free to experiment with the different editing options.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const OurSolutionPage = ({ theme, background }) => {
  const editorRef = useRef(null);
  const currentTheme = themes[theme];
  const currentBG = backgrounds[background]
  useEffect(() => {
    // Dynamically load the Froala CSS and JS files from CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';
    
    const initializeEditor = () => {
      if (editorRef.current && window.FroalaEditor) {
        new window.FroalaEditor(editorRef.current, {
          inline: true,
          toolbarInline: true,
          toolbarVisibleWithoutSelection: true,
          charCounterCount: false,
          wordCounterCount: false,
          toolbarButtons: {
            'moreText': {
                buttons: [
                    'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
                    'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'insertImage',
                    'align', 'quote', 'formatOL', 'formatUL', 'outdent', 'indent',
                    'insertLink', 'paragraphStyle', 'insertVideo', 'insertFile', 'insertTable',
                    'undo', 'redo', 'clearFormatting', 'selectAll', 'html'
                ],
                buttonsVisible: 12,
                align: 'center'
            }
          },
          imageEditButtons: ['imageDisplay', 'imageAlign', 'imageSize', 'imageCaption', 'imageStyle', 'imageFilter', 'imageRemove', 'imageReplace'],
          imageResizer: {
            handle: 'all',
            minWidth: 16,
            minHeight: 16 
          },
          imageStyles: {
            'fr-style-card': 'Card',
            'fr-style-polaroid': 'Polaroid'
          },
          imageFilters: [
            { title: 'Normal', filter: 'none' },
            { title: 'Grayscale', filter: 'grayscale(100%)' },
            { title: 'Sepia', filter: 'sepia(100%)' },
            { title: 'Blur', filter: 'blur(2px)' }
          ]
        });
      }
    };

    script.onload = () => {
      setTimeout(initializeEditor, 100);
    };

    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      if (editorRef.current && editorRef.current.editor) {
        editorRef.current.editor.destroy();
      }
    };
  }, []);

  return (
    <div className={`p-10 font-[inter] min-h-screen max-h-screen overflow-hidden ${currentTheme.bg} ${currentBG.text}`}>
      <style>
        {`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');
          .fr-style-polaroid {
            background-color: white;
            color: black;
            padding: 10px 10px 20px 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            display: inline-block;
          }
        `}
      </style>
      <div className={`max-w-5xl shadow-2xl rounded-md ${currentBG.card} p-5 mx-auto flex flex-col justify-center text-center items-center`}>
        <div className='border-[2.5px] w-full min-h-150 max-h-170 p-5'>
          <div
            ref={editorRef}
            className="prose max-w-xl mx-auto focus:outline-none"
          >
            <h1 className="text-4xl font-semibold my-8">
              Our solution
            </h1>
            <h2 className='mb-4'>
              Vertx delivers breakthrough technology that bridges innovation gaps, reducing implementation time by 80%.
            </h2>
            {/* The Canvas environment cannot access local files. Please use a public URL for your image. */}
            <img src={B1} alt="Two people silhouetted against a colorful background" className='my-8 w-full rounded-md' />
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketPotentialPage = ({ theme, background }) => {
  const editorRef = useRef(null);
  const currentTheme = themes[theme];
    const currentBG = backgrounds[background]
  const [cardData, setCardData] = useState([
    {
      icon: 'fas fa-bullseye',
      color: 'text-blue-400',
      title: 'Strategic market capture',
      description: 'We will identify and prioritize key market segments to ensure a strong foothold and scalable growth.'
    },
    {
      icon: 'fas fa-handshake',
      color: 'text-green-400',
      title: 'Partnership approach',
      description: 'By leveraging strategic alliances and collaborations, we will accelerate our market entry and expand our reach.'
    },
    {
      icon: 'fas fa-chart-line',
      color: 'text-yellow-400',
      title: 'Explosive market growth',
      description: 'Our innovative solutions are designed to capitalize on rapid market expansion, ensuring exponential returns.'
    }
  ]);

  const handleCardChange = (index, field, value) => {
    setCardData(prevData => {
      const newData = [...prevData];
      newData[index][field] = value;
      return newData;
    });
  };

  useEffect(() => {
    // Dynamically load the Froala CSS and JS files from CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';
    
    const initializeEditor = () => {
      if (editorRef.current && window.FroalaEditor) {
        new window.FroalaEditor(editorRef.current, {
          inline: true,
          toolbarInline: true,
          toolbarVisibleWithoutSelection: true,
          charCounterCount: false,
          wordCounterCount: false,
          toolbarButtons: {
            'moreText': {
                buttons: [
                    'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
                    'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'insertImage',
                    'align', 'quote', 'formatOL', 'formatUL', 'outdent', 'indent',
                    'insertLink', 'paragraphStyle', 'insertVideo', 'insertFile', 'insertTable',
                    'undo', 'redo', 'clearFormatting', 'selectAll', 'html'
                ],
                buttonsVisible: 12,
                align: 'center'
            }
          },
          imageResizer: {
            handle: 'all',
            minWidth: 16,
            minHeight: 16 
          },
          imageStyles: {
            'fr-style-card': 'Card',
            'fr-style-polaroid': 'Polaroid',
            'fr-style-red': 'Red',
            'fr-style-green': 'Green',
            'fr-style-sky': 'Sky'
          },
          imageEditButtons: ['imageDisplay', 'imageAlign', 'imageSize', 'imageCaption', 'imageStyle', 'imageRemove', 'imageReplace']
        });
      }
    };

    script.onload = () => {
      setTimeout(initializeEditor, 100);
    };

    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      if (editorRef.current && editorRef.current.editor) {
        editorRef.current.editor.destroy();
      }
    };
  }, []);

  return (
    <div className={`p-10 font-[inter] min-h-screen max-h-screen overflow-hidden ${currentTheme} ${currentBG.text}`}>
      <style>
        {`
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');
          .fr-style-polaroid {
            background-color: white;
            color: black;
            padding: 10px 10px 10px 10px;
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
            display: inline-block;
          }
          .fr-style-red {
            background-color: #B22222;
            color: white;
            padding: 10px 10px 10px 10px;
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
            display: inline-block;
          }
          .fr-style-green {
            background-color: #00FA9A;
            color: black;
            padding: 10px 10px 10px 10px;
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
            display: inline-block;
          }
          .fr-style-sky {
            background-color: #1E90FF;
            color: white;
            padding: 10px 10px 10px 10px;
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
            display: inline-block;
          }
          .fr-style-card {
          background-color: #004526;
            color: white;
            padding: 10px 10px 10px 10px;
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
            display: inline-block;
          }
        `}
      </style>
      <div className={`max-w-7xl mx-auto flex flex-col md:flex-row gap-8 p-5 rounded-md shadow-2xl ${currentBG.card}`}>
        <div className='flex-1 flex flex-col justify-center text-center items-center'>
          <div className='w-full min-h-150 max-h-170 p-5'>
            <div
              ref={editorRef}
              className="focus:outline-none"
            >
              <h1 className="text-4xl font-semibold my-5">
                Market Potential
              </h1>
              <h2 className='mb-4'>
                The deep tech market is projected to reach $125B by 2025 with 35% CAGR.
              </h2>
              <img src={B2} alt="Two people silhouetted against a colorful background" className='my-8 w-full max-h-100 rounded-md' />
            </div>
          </div>
        </div>

        <div className='flex flex-col my-auto gap-4 w-full md:w-1/3 '>
          {cardData.map((card, index) => (
            <div key={index} className={`rounded-lg shadow-2xl p-2 h-40 overflow-y-auto ${currentBG.card}`}>
              <div className='flex items-center justify-self-start mb-4'>
                <i className={`${card.icon} text-4xl ${card.color}`}></i>
              </div>
              <h3 
                className='font-semibold text-xl mb-2 focus:outline-none'
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleCardChange(index, 'title', e.target.innerText)}
              >
                {card.title}
              </h3>
              <p 
                className='text-sm opacity-50 focus:outline-none'
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleCardChange(index, 'description', e.target.innerText)}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CompetitiveEdgePAge = ({ theme, background }) => {
  const editorRef = useRef(null);
  const imageEditorRef = useRef(null);
  const currentTheme = themes[theme];
  const currentBG = backgrounds[background]
  const [cardData, setCardData] = useState([
    {
      icon: 'fas fa-star',
      title: '40% higher customer satisfaction scores'
    },
    {
      icon: 'fas fa-code',
      title: 'Proprietary technology'
    },
    {
      icon: 'fas fa-handshake-alt',
      title: 'Strategic partnerships'
    },
    {
      icon: 'fas fa-rocket',
      title: '3x faster implementation than competitors'
    }
  ]);

  const handleCardChange = (index, field, value) => {
    setCardData(prevData => {
      const newData = [...prevData];
      newData[index][field] = value;
      return newData;
    });
  };

  useEffect(() => {
    // Dynamically load the Froala CSS and JS files from CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';
    
    const initializeEditors = () => {
      if (window.FroalaEditor) {
        if (editorRef.current) {
          new window.FroalaEditor(editorRef.current, {
            inline: true,
            toolbarInline: true,
            toolbarVisibleWithoutSelection: true,
            charCounterCount: false,
            wordCounterCount: false,
            toolbarButtons: {
              'moreText': {
                  buttons: [
                      'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
                      'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'insertImage',
                      'align', 'quote', 'formatOL', 'formatUL', 'outdent', 'indent',
                      'insertLink', 'paragraphStyle', 'insertVideo', 'insertFile', 'insertTable',
                      'undo', 'redo', 'clearFormatting', 'selectAll', 'html'
                  ],
                  buttonsVisible: 12,
                  align: 'center'
              }
            },
            imageResizer: {
              handle: 'all',
              minWidth: 16,
              minHeight: 16 
            },
            imageStyles: {
              'fr-style-card': 'Card',
              'fr-style-polaroid': 'Polaroid',
              'fr-style-red': 'Red',
              'fr-style-green': 'Green',
              'fr-style-sky': 'Sky'
            },
            imageEditButtons: ['imageDisplay', 'imageAlign', 'imageSize', 'imageCaption', 'imageStyle', 'imageRemove', 'imageReplace']
          });
        }
        
        if (imageEditorRef.current) {
            new window.FroalaEditor(imageEditorRef.current, {
                inline: true,
                toolbarInline: true,
                toolbarVisibleWithoutSelection: true,
                charCounterCount: false,
                wordCounterCount: false,
                toolbarButtons: ['insertImage'],
                imageResizer: true,
                imageEditButtons: ['imageDisplay', 'imageAlign', 'imageSize', 'imageCaption', 'imageStyle', 'imageRemove', 'imageReplace']
            });
        }
      }
    };

    script.onload = () => {
      setTimeout(initializeEditors, 100);
    };

    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      if (editorRef.current && editorRef.current.editor) {
        editorRef.current.editor.destroy();
      }
      if (imageEditorRef.current && imageEditorRef.current.editor) {
        imageEditorRef.current.editor.destroy();
      }
    };
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center h-screen p-10 font-[inter] ${currentTheme.bg} ${currentBG.text}`}>
      <style>
        {`
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');
          .fr-style-polaroid {
            background-color: white;
            padding: 10px 10px 20px 10px; /* Top, right, left = 10px; Bottom = 20px */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            display: inline-block;
          }
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
          }
          .modal-image {
            display: block;
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
          .modal-close {
            position: absolute;
            top: 10px;
            right: 20px;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            z-index: 1001;
          }
          .fr-style-red {
            border: 2px solid red;
          }
          .fr-style-green {
            border: 2px solid green;
          }
          .fr-style-sky {
            border: 2px solid skyblue;
          }
        `}
      </style>
      <div className={`max-w-7xl min-h-150 max-h-170 mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-5 rounded-md shadow-2xl ${currentBG.card}`}>
        {/* Left column: Image */}
        <div ref={imageEditorRef} contentEditable={true} suppressContentEditableWarning={true} className='flex items-center w-auto col-span-1 justify-center p-5'>
          <img 
            src={B3} 
            alt="Strong shadows and light on a city street" 
            className='w-full max-h-145 object-cover rounded-md cursor-pointer'
          />
        </div>

        {/* Right column: Text and Cards */}
        <div className='flex flex-col col-span-1 justify-between gap-8 w-full mt-10 md:my-4'>
          {/* Froala editor for title and description */}
          <div ref={editorRef} className="focus:outline-none">
            <span className='inline-block mb-4 px-2 py-1 bg-lime-600 text-white rounded-md text-xs font-semibold uppercase'>
              Advantage
            </span>
            <h1 className="text-5xl mb-2">
              Competitive Edge
            </h1>
            <h2 className='mt-12'>
              Vertx stands apart through proprietary technology, strategic partnerships, and our founder-investor model.
            </h2>
          </div>
          
          {/* Grid for cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {cardData.map((card, index) => (
              <div key={index} className={`rounded-lg shadow-2xl p-2 h-auto overflow-y-auto ${currentBG.card} flex items-center gap-3`}>
                <i className={`${card.icon} text-3xl text-gray-400`}></i>
                <h3 
                  className='font-semibold text-sm mb-1 focus:outline-none flex-1'
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleCardChange(index, 'title', e.target.innerText)}
                >
                  {card.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const GrowthTrajectoryPage = ({ theme, background }) => {
  const editorRef = useRef(null);
  const imageRef1 = useRef(null);
  const imageRef2 = useRef(null);
  const imageRef3 = useRef(null);
  const imageRef4 = useRef(null);
  const currentTheme = themes[theme];
  const currentBG = backgrounds[background]


  const [cardData, setCardData] = useState([
    {
      title: 'Revenue',
      description: 'Achieved 200% year-over-year revenue growth, consistently exceeding industry benchmarks.'
    },
    {
      title: 'Retention',
      description: 'Maintained 95% customer retention rate, demonstrating strong product-market fit and customer satisfaction.'
    },
    {
      title: 'Enterprise',
      description: 'Successfully implemented pilot programs with Fortune 500 companies, validating our enterprise-ready solution.'
    }
  ]);

  const handleCardChange = (index, field, value) => {
    setCardData(prevData => {
      const newData = [...prevData];
      if (newData[index]) {
        newData[index][field] = value;
      }
      return newData;
    });
  };

  useEffect(() => {
    // Dynamically load the Froala CSS and JS files from CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';
    
    const initializeEditors = () => {
      if (window.FroalaEditor) {
        if (editorRef.current) {
          new window.FroalaEditor(editorRef.current, {
            inline: true,
            toolbarInline: true,
            toolbarVisibleWithoutSelection: true,
            charCounterCount: false,
            wordCounterCount: false,
            toolbarButtons: {
              'moreText': {
                  buttons: [
                      'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
                      'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'insertImage',
                      'align', 'quote', 'formatOL', 'formatUL', 'outdent', 'indent',
                      'insertLink', 'paragraphStyle', 'insertVideo', 'insertFile', 'insertTable',
                      'undo', 'redo', 'clearFormatting', 'selectAll', 'html'
                  ],
                  buttonsVisible: 12,
                  align: 'center'
              }
            },
            imageResizer: {
              handle: 'all',
              minWidth: 16,
              minHeight: 16 
            },
            imageStyles: {
              'fr-style-card': 'Card',
              'fr-style-polaroid': 'Polaroid',
              'fr-style-red': 'Red',
              'fr-style-green': 'Green',
              'fr-style-sky': 'Sky'
            },
            imageEditButtons: ['imageDisplay', 'imageAlign', 'imageSize', 'imageCaption', 'imageStyle', 'imageRemove', 'imageReplace']
          });
        }

        const imageRefs = [imageRef1, imageRef2, imageRef3, imageRef4];
        imageRefs.forEach(ref => {
          if (ref.current) {
            new window.FroalaEditor(ref.current, {
              inline: true,
              toolbarInline: true,
              toolbarVisibleWithoutSelection: true,
              charCounterCount: false,
              wordCounterCount: false,
              imageResizer: {
                handle: 'all',
                minWidth: 16,
                minHeight: 16
              },
              imageEditButtons: ['imageDisplay', 'imageAlign', 'imageSize', 'imageCaption', 'imageStyle', 'imageRemove', 'imageReplace'],
              toolbarButtons: {
                'moreText': {
                  buttons: ['insertImage']
                }
              }
            });
          }
        });
      }
    };

    script.onload = () => {
      setTimeout(initializeEditors, 100);
    };

    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      if (editorRef.current && editorRef.current.editor) {
        editorRef.current.editor.destroy();
      }
      if (imageRef1.current && imageRef1.current.editor) { imageRef1.current.editor.destroy(); }
      if (imageRef2.current && imageRef2.current.editor) { imageRef2.current.editor.destroy(); }
      if (imageRef3.current && imageRef3.current.editor) { imageRef3.current.editor.destroy(); }
      if (imageRef4.current && imageRef4.current.editor) { imageRef4.current.editor.destroy(); }
    };
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-10 font-[inter] ${currentTheme.bg} ${currentBG.text}`}>
      <style>
        {`
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');
          .fr-style-polaroid {
            background-color: white;
            padding: 10px 10px 20px 10px; /* Top, right, left = 10px; Bottom = 20px */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            display: inline-block;
          }
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
          }
          .modal-image {
            display: block;
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
          .modal-close {
            position: absolute;
            top: 10px;
            right: 20px;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            z-index: 1001;
          }
          .fr-style-red {
            border: 2px solid red;
          }
          .fr-style-green {
            border: 2px solid green;
          }
          .fr-style-sky {
            border: 2px solid skyblue;
          }
        `}
      </style>


      <div className={`max-w-7xl mx-auto min-h-150 max-h-160 grid grid-cols-1 md:grid-cols-5 gap-8 p-5 rounded-md shadow-2xl ${currentBG.card}`}>
        {/* Left column: Text */}
        <div className='col-span-1 md:col-span-2 flex flex-col items-start justify-center p-5'>
          <div ref={editorRef} className="focus:outline-none">
            <span className='inline-block mb-4 px-2 py-1 bg-green-500 text-white rounded-md text-xs font-semibold uppercase'>
              Traction
            </span>
            <h1 className="text-4xl font-semibold mb-2">
              Growth Trajectory
            </h1>
            <h2 className='mb-4'>
              Our traction demonstrates market validation with 200% YoY revenue growth.
            </h2>
          </div>
        </div>
        
        {/* Right columns: Grid of cards and photos */}
        <div className='col-span-1 md:col-span-3 grid grid-cols-3 gap-4'>
          {/* Column 1 */}
          <div className='flex flex-col gap-4'>
            <div ref={imageRef1} contentEditable={true} suppressContentEditableWarning={true} className={`rounded-lg row-span-1 shadow-2xl p-2 h-full ${currentBG.card} flex items-center justify-center`}>
              <img 
                src={A1}
                alt="Silhouetted person looking at the sun" 
                className='h-full w-full object-cover rounded-md'
              />
            </div>
            <div className={`rounded-lg max-h-48 shadow-2xl p-2 ${currentBG.card} flex flex-col`}>
              <h3 className={`font-semibold text-xl mb-2`}>
                {cardData[0].title}
              </h3>
              <div 
                className='flex-1 overflow-y-auto overflow-x-hidden focus:outline-none break-words opacity-70 min-w-0'
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleCardChange(0, 'description', e.target.innerText)}
              >
                {cardData[0].description}
              </div>
            </div>
            <div ref={imageRef2} contentEditable={true} suppressContentEditableWarning={true} className={`rounded-lg row-span-1 shadow-2xl p-2 h-full ${currentBG.card} flex items-center justify-center`}>
              <img 
                src={A3}
                alt="Silhouetted person looking at the sun" 
                className='h-full w-full object-cover rounded-md'
              />
            </div>
          </div>
          
          {/* Column 2 */}
          <div className='flex flex-col gap-4'>
            <div ref={imageRef3} contentEditable={true} suppressContentEditableWarning={true} className={`rounded-lg shadow-2xl row-span-2 p-2 h-full ${currentBG.card} flex items-center justify-center`}>
              <img 
                src={B4} 
                alt="Silhouetted person looking at the sun" 
                className='h-full w-full object-cover rounded-md'
              />
            </div>
            <div className={`rounded-lg max-h-48 shadow-2xl p-2 ${currentBG.card} flex flex-col`}>
              <h3 className={` font-semibold text-xl mb-2`}>
                {cardData[1].title}
              </h3>
              <div 
                className='flex-1 overflow-y-auto overflow-x-hidden focus:outline-none break-words opacity-70 min-w-0'
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleCardChange(1, 'description', e.target.innerText)}
              >
                {cardData[1].description}
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className='flex flex-col gap-4'>
            <div className={`rounded-lg max-h-48 shadow-2xl p-2 ${currentBG.card} flex flex-col`}>
              <h3 className={` font-semibold text-xl mb-2`}>
                {cardData[2].title}
              </h3>
              <div 
                className='flex-1 overflow-y-auto overflow-x-hidden focus:outline-none break-words min-w-0 opacity-70'
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleCardChange(2, 'description', e.target.innerText)}
              >
                {cardData[2].description}
              </div>
            </div>
            <div ref={imageRef4} contentEditable={true} suppressContentEditableWarning={true} className={`rounded-lg shadow-2xl row-span-2 p-2 h-full ${currentBG.card} flex items-center justify-center`}>
              <img 
                src={C1} 
                alt="Silhouetted person looking at the sun" 
                className='h-full w-full object-cover rounded-md'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProvenModelPage = ({ theme, background }) => {
  const editorRef = useRef(null);
  const cardRefs = useRef([]);
  const cardTitleRefs = useRef([]);
  const currentTheme = themes[theme];
  const currentBG = backgrounds[background]

  const [cardData, setCardData] = useState([
    {
      title: 'Tangible outcomes',
      description: 'Our proven methodology delivers consistent results through strategic alignment, data-driven decision-making, and client-focused solutions.'
    },
    {
      title: 'Stakeholder synergy',
      description: 'Our founder-investor model creates perfect alignment between stakeholders, ensuring all parties are working toward common goals.'
    },
    {
      title: 'Driving responsibility',
      description: 'The model establishes clear accountability frameworks, which directly contributes to achieving measurable results across the organization.'
    },
    {
      title: 'Market fit confirmed',
      description: 'Mock pitching sessions with potential clients have yielded an impressive 80% conversion rate, validating our approach to the market.'
    }
  ]);

  const handleCardChange = (index, field, value) => {
    setCardData(prevData => {
      const newData = [...prevData];
      if (newData[index]) {
        newData[index][field] = value;
      }
      return newData;
    });
  };

  useEffect(() => {
    // Dynamically load the Froala CSS and JS files from CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';
    
    const initializeEditors = () => {
      if (window.FroalaEditor) {
        if (editorRef.current) {
          new window.FroalaEditor(editorRef.current, {
            inline: true,
            toolbarInline: true,
            toolbarVisibleWithoutSelection: true,
            charCounterCount: false,
            wordCounterCount: false,
            toolbarButtons: {
              'moreText': {
                  buttons: [
                      'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
                      'fontFamily', 'fontSize', 'textColor', 'backgroundColor',
                      'align', 'quote', 'formatOL', 'formatUL', 'outdent', 'indent',
                      'insertLink', 'paragraphStyle', 'undo', 'redo', 'clearFormatting', 'selectAll'
                  ],
                  buttonsVisible: 12,
                  align: 'center'
              }
            }
          });
        }

        cardRefs.current.forEach(cardRef => {
          if (cardRef) {
            new window.FroalaEditor(cardRef, {
              inline: true,
              toolbarInline: true,
              toolbarVisibleWithoutSelection: true,
              charCounterCount: false,
              wordCounterCount: false,
              toolbarButtons: {
                'moreText': {
                  buttons: [
                      'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
                      'fontFamily', 'fontSize', 'textColor', 'backgroundColor',
                      'align', 'quote', 'formatOL', 'formatUL', 'outdent', 'indent',
                      'insertLink', 'paragraphStyle', 'undo', 'redo', 'clearFormatting', 'selectAll'
                  ],
                  buttonsVisible: 12,
                  align: 'center'
                }
              }
            });
          }
        });

        cardTitleRefs.current.forEach(titleRef => {
          if (titleRef) {
            new window.FroalaEditor(titleRef, {
              inline: true,
              toolbarInline: true,
              toolbarVisibleWithoutSelection: true,
              charCounterCount: false,
              wordCounterCount: false,
              toolbarButtons: {
                'moreText': {
                  buttons: [
                      'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
                      'fontFamily', 'fontSize', 'textColor', 'backgroundColor',
                      'align', 'quote', 'formatOL', 'formatUL', 'outdent', 'indent',
                      'insertLink', 'paragraphStyle', 'undo', 'redo', 'clearFormatting', 'selectAll'
                  ],
                  buttonsVisible: 12,
                  align: 'center'
                }
              }
            });
          }
        });
      }
    };

    script.onload = () => {
      setTimeout(initializeEditors, 100);
    };

    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      if (editorRef.current && editorRef.current.editor) {
        editorRef.current.editor.destroy();
      }
      cardRefs.current.forEach(cardRef => {
        if (cardRef && cardRef.editor) {
          cardRef.editor.destroy();
        }
      });
      cardTitleRefs.current.forEach(titleRef => {
        if (titleRef && titleRef.editor) {
          titleRef.editor.destroy();
        }
      });
    };
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-10 font-[inter] ${currentTheme.bg} ${currentBG.text}`}>
      <style>
        {`
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');
          .fr-style-polaroid {
            background-color: white;
            padding: 10px 10px 20px 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            display: inline-block;
          }
          .fr-style-red {
            border: 2px solid red;
          }
          .fr-style-green {
            border: 2px solid green;
          }
          .fr-style-sky {
            border: 2px solid skyblue;
          }
          .froala-content {
            word-break: break-all;
          }
        `}
      </style>
      <div className={`max-w-7xl mx-auto flex flex-col items-center p-5 rounded-md shadow-2xl ${currentBG.card}`}>
        {/* Top section: Title and description */}
        <div className='text-center p-5'>
          <div ref={editorRef} className="focus:outline-none max-w-5xl">
            <h1 className="text-6xl font-[inter] font-medium mb-2 my-5">
              <span className='text-gray-600'>Proven model</span> creates alignment and drives results
            </h1>
          </div>
        </div>
        
        {/* Bottom section: Grid of cards */}
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-5'>
          {cardData.map((card, index) => (
            <div ref={el => cardTitleRefs.current[index] = el} key={index} className={`rounded-lg shadow-2xl p-6 ${currentBG.card} flex flex-col min-h-[350px] max-h-[350px] overflow-y-auto`}>
              <h3 
                className='text-gray-200 font-semibold text-xl mb-2' 
                contentEditable={true} 
                suppressContentEditableWarning={true} 
                onBlur={(e) => handleCardChange(index, 'title', e.target.innerText)}
                
              >
                {card.title}
              </h3>
              <div 
                className='froala-content flex-1 text-base overflow-y-auto overflow-x-hidden min-h-0 focus:outline-none break-words min-w-0'
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleCardChange(index, 'description', e.target.innerText)}
              >
                {card.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SeriesAPage = ({ theme, background }) => {
  const headingRef = useRef(null);
  const cardRefs = useRef([]);
  const cardTitleRefs = useRef([]);
  const currentTheme = themes[theme];
  const currentBG = backgrounds[background]

  const [pageData, setPageData] = useState({
    heading: 'Series A funding will accelerate our growth',
    cards: [
      {
        title: 'Series B readiness',
        description: 'Positioning for next funding round within 24 months.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rocket"><path d="M4.5 16.5c-1.5 1.26-2.25 2.92-2.25 4.75a2.25 2.25 0 0 0 2.25 2.25c1.83 0 3.5-1.26 4.75-2.25l7.5-7.5-7.5-7.5-4.75 4.75z"/><path d="M14.5 14.5l7.5-7.5"/><path d="M12 2v2h2v-2l-2-2z"/><path d="M12 20v2h2v-2l-2-2z"/></svg>
        )
      },
      {
        title: 'Revenue growth',
        description: 'Targeting a 3x increase within 18 months.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        )
      },
      {
        title: 'Market penetration',
        description: 'Strategic expansion into key market segments.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
        )
      },
      {
        title: 'Expanded R&D',
        description: 'Investing in product development and innovation.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flask-conical"><path d="M10 16a2 2 0 0 1-2-2v-3"/><path d="M16 16a2 2 0 0 0-2-2V8"/><path d="M8 2h8"/><path d="M8 22h8"/><path d="M16 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg>
        )
      },
      {
        title: 'Team expansion',
        description: 'Growing our talent pool for scaling operations.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        )
      },
    ]
  });

  const handlePageChange = (field, value) => {
    setPageData(prevData => ({ ...prevData, [field]: value }));
  };

  const handleCardChange = (index, field, value) => {
    setPageData(prevData => {
      const newCards = [...prevData.cards];
      if (newCards[index]) {
        newCards[index] = { ...newCards[index], [field]: value };
      }
      return { ...prevData, cards: newCards };
    });
  };

  useEffect(() => {
    // Dynamically load the Froala CSS and JS files from CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';
    
    const initializeEditors = () => {
      if (window.FroalaEditor) {
        // Main heading editor
        if (headingRef.current) {
          const editor = new window.FroalaEditor(headingRef.current, {
            inline: true,
            toolbarInline: true,
            toolbarVisibleWithoutSelection: true,
            charCounterCount: false,
            wordCounterCount: false,
            toolbarButtons: ['bold', 'italic', 'underline', '|', 'fontSize', 'textColor', 'backgroundColor', '|', 'undo', 'redo'],
          });
          // editor.events.on('contentChanged', function() {
          //   handlePageChange('heading', this.html.get());
          // });
        }
        
        // Card editors for descriptions
        cardRefs.current.forEach((cardRef, index) => {
          if (cardRef) {
            const editor = new window.FroalaEditor(cardRef, {
              inline: true,
              toolbarInline: true,
              toolbarVisibleWithoutSelection: true,
              charCounterCount: false,
              wordCounterCount: false,
              toolbarButtons: ['bold', 'italic', 'underline', '|', 'fontSize', 'textColor', 'backgroundColor', '|', 'undo', 'redo'],
            });
            // editor.events.on('contentChanged', function() {
            //   handleCardChange(index, 'description', this.html.get());
            // });
          }
        });

        // Card editors for titles
        cardTitleRefs.current.forEach((titleRef, index) => {
          if (titleRef) {
            const editor = new window.FroalaEditor(titleRef, {
              inline: true,
              toolbarInline: true,
              toolbarVisibleWithoutSelection: true,
              charCounterCount: false,
              wordCounterCount: false,
              toolbarButtons: ['bold', 'italic', 'underline', '|', 'fontSize', 'textColor', 'backgroundColor', '|', 'undo', 'redo'],
            });
            // editor.events.on('contentChanged', function() {
            //   handleCardChange(index, 'title', this.html.get());
            // });
          }
        });
      }
    };

    script.onload = () => {
      setTimeout(initializeEditors, 100);
    };

    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      if (headingRef.current && headingRef.current.editor) {
        headingRef.current.editor.destroy();
      }
      cardRefs.current.forEach(cardRef => {
        if (cardRef && cardRef.editor) {
          cardRef.editor.destroy();
        }
      });
      cardTitleRefs.current.forEach(titleRef => {
        if (titleRef && titleRef.editor) {
          titleRef.editor.destroy();
        }
      });
    };
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-10 font-[inter] ${currentTheme.bg} ${currentBG.text}`}>
      <style>
        {`
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');
          .froala-content {
            word-break: break-all;
          }
        `}
      </style>
      <div className={`max-w-7xl min-w-7xl mx-auto flex flex-col items-center p-5 rounded-md shadow-2xl ${currentBG.card} min-h-150 max-h-170`}>
        {/* Top section: Title */}
        <div ref={headingRef}  className='text-left max-w-4xl p-5'>
          <h1 
            className="text-[51px] font-[inter] font-medium mb-2 my-5 leading-14 "
            contentEditable={true}
            suppressContentEditableWarning={true}
          >
            {pageData.heading}
          </h1>
        </div>
        
        {/* Bottom section: Grid of cards with 6 columns */}
        <div  className='w-full max-w-4xl grid grid-cols-1 md:grid-cols-6 gap-8 p-5'>
          {pageData.cards.map((card, index) => (
            <div  
              key={index} 
              ref={el => cardTitleRefs.current[index] = el}
              className={`rounded-lg shadow-2xl overflow-auto p-4 ${currentBG.card} flex flex-col min-h-[175px] max-h-[175px] ${index < 2 ? 'md:col-span-3' : 'md:col-span-2'}`}
            >
              <div  className="flex items-center space-x-4 mb-4 ">
                {card.icon}
                <h3 
                  className='font-semibold text-xl opacity-90' 
                  contentEditable={true} 
                  suppressContentEditableWarning={true}
                >
                  {card.title}
                </h3>
              </div>
              <div 
                className='froala-content flex-1 text-sm overflow-y-auto overflow-x-hidden min-h-0 focus:outline-none break-words min-w-0 opacity-60'
                contentEditable={true}
                suppressContentEditableWarning={true}
              >
                {card.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const JoinUsPage = ({ theme, background }) => {
  const textEditorRef = useRef(null);
  const imageEditorRef = useRef(null);
  const currentTheme = themes[theme];
  const currentBG = backgrounds[background]

  useEffect(() => {
    // Dynamically load the Froala CSS and JS files from CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';
    
    const initializeEditors = () => {
      if (window.FroalaEditor) {
        // Initialize the text editor
        if (textEditorRef.current) {
          new window.FroalaEditor(textEditorRef.current, {
            inline: true,
            toolbarInline: true,
            toolbarVisibleWithoutSelection: true,
            charCounterCount: false,
            wordCounterCount: false,
            toolbarButtons: {
              'moreText': {
                  buttons: [
                      'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
                      'fontFamily', 'fontSize', 'textColor', 'backgroundColor',
                      'align', 'quote', 'formatOL', 'formatUL', 'outdent', 'indent',
                      'insertLink', 'paragraphStyle',
                      'undo', 'redo', 'clearFormatting', 'selectAll', 'html'
                  ],
                  buttonsVisible: 12,
                  align: 'center'
              }
            }
          });
        }
        // Initialize the image editor with image-specific options
        if (imageEditorRef.current) {
          new window.FroalaEditor(imageEditorRef.current, {
            inline: true,
            toolbarInline: true,
            toolbarVisibleWithoutSelection: true,
            charCounterCount: false,
            wordCounterCount: false,
            toolbarButtons: [ 'insertImage', 'imageAlign', 'imageSize', 'imageCaption', 'imageStyle', 'imageFilter', 'imageRemove', 'imageReplace' ],
            imageResizer: {
              handle: 'all',
              minWidth: 16,
              minHeight: 16 
            },
            imageStyles: {
              'fr-style-card': 'Card',
              'fr-style-polaroid': 'Polaroid'
            },
            imageFilters: [
              { title: 'Normal', filter: 'none' },
              { title: 'Grayscale', filter: 'grayscale(100%)' },
              { title: 'Sepia', filter: 'sepia(100%)' },
              { title: 'Blur', filter: 'blur(2px)' }
            ],
            imageEditButtons: ['imageDisplay', 'imageAlign', 'imageSize', 'imageCaption', 'imageStyle', 'imageFilter', 'imageRemove', 'imageReplace']
          });
        }
      }
    };

    script.onload = () => {
      setTimeout(initializeEditors, 100);
    };

    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      if (textEditorRef.current && textEditorRef.current.editor) {
        textEditorRef.current.editor.destroy();
      }
      if (imageEditorRef.current && imageEditorRef.current.editor) {
        imageEditorRef.current.editor.destroy();
      }
    };
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme.bg} ${currentBG.text}`}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');
        .fr-style-polaroid {
          background-color: white;
          color: black;
          padding: 10px 10px 20px 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          display: inline-block;
        }
      `}} />
      <div className={`flex flex-col md:flex-row items-center justify-center w-full max-w-7xl min-h-150 max-h-150 rounded-3xl shadow-2xl p-6 sm:p-12 ${currentBG.card}`}>
        
        {/* Left Section: Text Content */}
        <div 
          ref={textEditorRef}
          className="flex-1 focus:outline-none"
        >
          <span className="text-sm font-semibold tracking-wider bg-lime-600 uppercase text-white mb-4">
            Investment Opportunity
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl max-w-110 font-medium leading-tight mb-4">
            Join us in revolutionizing deep tech
          </h1>
        </div>

        {/* Right Section: Blurry Image/Placeholder */}
        <div ref={imageEditorRef} className="flex-1 w-full h-80 md:h-96 relative overflow-hidden">
          <img src={B1} alt="Two people silhouetted against a colorful background" className=' w-full' />
        </div>
      </div>
    </div>
  );
};

const TitleOnlyPage = ({ id, theme, background }) => {
  const headingRef = useRef(null);
  const currentTheme = themes[theme];
  const currentBG = backgrounds[background]

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';
    
    const initializeEditors = () => {
      if (window.FroalaEditor) {
        if (headingRef.current) {
          new window.FroalaEditor(headingRef.current, {
            inline: true,
            toolbarInline: true,
            toolbarVisibleWithoutSelection: true,
            charCounterCount: false,
            wordCounterCount: false,
            toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor'],
          });
        }
      }
    };

    script.onload = () => {
      setTimeout(initializeEditors, 100);
    };

    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
      <div className={`w-full max-w-7xl p-12 text-center rounded-3xl shadow-2xl ${currentBG.card} min-h-[600px] max-h-[600px] overflow-y-auto flex items-center justify-center`}>
        <div ref={headingRef}>
          <h1 className="text-7xl font-bold" contentEditable suppressContentEditableWarning>
            Title Only
          </h1>
        </div>
      </div>
    </div>
  );
};

const TitleAndSubtitlePage = ({ id, theme, background }) => {
    const headingRef = useRef(null);
    const subheadingRef = useRef(null);
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                if (headingRef.current) {
                    new window.FroalaEditor(headingRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor'],
                    });
                }
                if (subheadingRef.current) {
                    new window.FroalaEditor(subheadingRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor'],
                    });
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
            <div className={`w-full max-w-7xl p-12 text-center rounded-3xl shadow-2xl min-h-[600px] max-h-[600px] overflow-y-auto flex flex-col items-center justify-center ${currentBG.card}`}>
                <div ref={headingRef}>
                    <h1 className="text-6xl font-bold" contentEditable suppressContentEditableWarning>
                        Title & Subtitle
                    </h1>
                </div>
                <div ref={subheadingRef} className="mt-4">
                    <p className="text-2xl opacity-60" contentEditable suppressContentEditableWarning>
                        A traditional opener with a tagline.
                    </p>
                </div>
            </div>
        </div>
    );
};

const TitleAndContentPage = ({ id, theme, background }) => {
    const headingRef = useRef(null);
    const contentRef = useRef(null);
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                if (headingRef.current) {
                    new window.FroalaEditor(headingRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor'],
                    });
                }
                if (contentRef.current) {
                    new window.FroalaEditor(contentRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'formatUL', 'formatOL'],
                    });
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
            <div className={`w-full max-w-7xl p-12 rounded-3xl shadow-2xl ${currentBG.card} min-h-[600px] max-h-[600px] overflow-y-auto flex flex-col justify-center`}>
                <div ref={headingRef} className="text-center">
                    <h1 className="text-5xl font-bold" contentEditable suppressContentEditableWarning>
                        Title & Content
                    </h1>
                </div>
                <div ref={contentRef} className="mt-8 text-left">
                    <ul contentEditable suppressContentEditableWarning className="list-disc list-inside opacity-70 text-xl">
                        <li>Bullet point 1</li>
                        <li>Bullet point 2</li>
                        <li>Bullet point 3</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const SectionHeaderPage = ({ id, theme, background }) => {
    const headingRef = useRef(null);
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                if (headingRef.current) {
                    new window.FroalaEditor(headingRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor'],
                    });
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text} bg-cover bg-center`} style={{ backgroundImage: `url(${B1})` }}>
            <div className={`w-full max-w-7xl p-12 text-center rounded-3xl shadow-2xl ${currentBG.card} bg-opacity-50 min-h-[600px] max-h-[600px] overflow-y-auto flex items-center justify-center`}>
                <div ref={headingRef}>
                    <h1 className="text-6xl font-bold" contentEditable suppressContentEditableWarning>
                        Section Header
                    </h1>
                </div>
            </div>
        </div>
    );
};

const ContentWithCaptionPage = ({ id, theme, background }) => {
    const contentRef = useRef(null);
    const captionRef = useRef(null);
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                if (contentRef.current) {
                    new window.FroalaEditor(contentRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'formatUL', 'formatOL'],
                    });
                }
                if (captionRef.current) {
                    new window.FroalaEditor(captionRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor'],
                    });
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
            <div className={`w-full max-w-7xl p-12 rounded-3xl shadow-2xl ${currentBG.card} min-h-[600px] max-h-[600px] overflow-y-auto flex flex-col justify-center`}>
                <div ref={contentRef} className="text-left">
                    <p contentEditable suppressContentEditableWarning className="text-xl">
                        Main content with additional context/sources. This is where the primary information goes.
                    </p>
                </div>
                <div ref={captionRef} className="mt-8 text-left">
                    <p contentEditable suppressContentEditableWarning className="text-lg opacity-70">
                        Caption or source information.
                    </p>
                </div>
            </div>
        </div>
    );
};

const TwoContentPage = ({ id, theme, background }) => {
    const content1Ref = useRef(null);
    const content2Ref = useRef(null);
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                if (content1Ref.current) {
                    new window.FroalaEditor(content1Ref.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'formatUL', 'formatOL'],
                    });
                }
                if (content2Ref.current) {
                    new window.FroalaEditor(content2Ref.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'formatUL', 'formatOL'],
                    });
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
            <div className={`w-full max-w-7xl p-12 rounded-3xl shadow-2xl ${currentBG.card} min-h-[600px] max-h-[600px] overflow-y-auto flex justify-around`}>
                <div ref={content1Ref} className="w-1/2 pr-4">
                    <p contentEditable suppressContentEditableWarning className="text-xl">
                        Side-by-side content comparison. This is the first column.
                    </p>
                </div>
                <div ref={content2Ref} className="w-1/2 pl-4">
                    <p contentEditable suppressContentEditableWarning className="text-xl">
                        This is the second column for comparison.
                    </p>
                </div>
            </div>
        </div>
    );
};

const ComparisonPage = ({ id, theme, background }) => {
    const card1Ref = useRef(null);
    const card2Ref = useRef(null);
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                if (card1Ref.current) {
                    new window.FroalaEditor(card1Ref.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'formatUL', 'formatOL'],
                    });
                }
                if (card2Ref.current) {
                    new window.FroalaEditor(card2Ref.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'formatUL', 'formatOL'],
                    });
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
            <div className={`w-full max-w-7xl p-12 rounded-3xl shadow-2xl ${currentBG.card} min-h-[600px] max-h-[600px] overflow-y-auto flex justify-around`}>
                <div ref={card1Ref} className={`w-1/2 p-6 rounded-lg shadow-lg ${currentBG.card}`}>
                    <h3 className="text-2xl font-bold mb-4 " contentEditable suppressContentEditableWarning>Feature 1</h3>
                    <p contentEditable suppressContentEditableWarning className=' opacity-80'>Description of feature 1.</p>
                </div>
                <div ref={card2Ref} className={`w-1/2 p-6 rounded-lg shadow-lg ${currentBG.card}`}>
                    <h3 className="text-2xl font-bold mb-4" contentEditable suppressContentEditableWarning>Feature 2</h3>
                    <p contentEditable suppressContentEditableWarning className='opacity-80'>Description of feature 2.</p>
                </div>
            </div>
        </div>
    );
};

const ContentOverImagePage = ({ id, theme, background }) => {
    const contentRef = useRef(null);
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                if (contentRef.current) {
                    new window.FroalaEditor(contentRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor'],
                    });
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text} bg-cover bg-center`} style={{ backgroundImage: `url(${B2})` }}>
            <div className={`w-full max-w-7xl p-12 text-center rounded-3xl shadow-2xl ${currentBG.card} bg-opacity-50 min-h-[600px] max-h-[600px] overflow-y-auto flex items-center justify-center`}>
                <div ref={contentRef}>
                    <h1 className="text-5xl font-bold" contentEditable suppressContentEditableWarning>
                        Impactful Messaging
                    </h1>
                </div>
            </div>
        </div>
    );
};

const PictureWithCaptionPage = ({ id, theme, background }) => {
    const imageRef = useRef(null); 
    const captionRef = useRef(null);
    const currentTheme = themes[theme]; 
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                if (captionRef.current) {
                    new window.FroalaEditor(captionRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor'],
                    });
                }
                
                if (imageRef.current) {
                    new window.FroalaEditor(imageRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['insertImage', 'imageAlign', 'imageSize', 'imageRemove'], 
                        imageEditButtons: [
                            'imageReplace', // The button to replace the image
                            'imageAlign', 
                            'imageCaption', 
                            'imageRemove', 
                            '|', 
                            'imageLink', 
                            'imageDisplay', 
                            'imageAlt', 
                            'imageSize'
                        ],
                    });
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100); 
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
            <div className={`w-full max-w-7xl p-12 rounded-3xl shadow-2xl ${currentBG.card} min-h-[600px] max-h-[600px] overflow-y-auto flex flex-col items-center justify-center`}>
                
                <div ref={imageRef} className="w-2/3 max-h-125 rounded-lg cursor-pointer">
                    <img src={B3} alt="placeholder" className="w-full max-h-110 rounded-lg" />
                </div>
                
                <div ref={captionRef} className="mt-4 text-center">
                    <p contentEditable suppressContentEditableWarning className="text-lg opacity-70">
                        Large centered image with descriptive text.
                    </p>
                </div>
            </div>
        </div>
    );
};

const ContentWithImagePage = ({ id, theme, background }) => {
    const contentRef = useRef(null);
    const imageRef = useRef(null); 
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                // Initialize Content/Text Editor
                if (contentRef.current) {
                    new window.FroalaEditor(contentRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'formatUL', 'formatOL'],
                    });
                }
                
                // Initialize Image Editor
                if (imageRef.current) {
                    new window.FroalaEditor(imageRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        
                        // Main toolbar buttons for the image wrapper
                        toolbarButtons: ['insertImage', 'imageRemove'], 
                        
                        // Buttons that appear when you click the image itself
                        imageEditButtons: [
                            'imageReplace', 
                            'imageAlign', 
                            'imageCaption', 
                            'imageRemove', 
                            '|', 
                            'imageLink', 
                            'imageDisplay', 
                            'imageAlt', 
                            'imageSize'
                        ],
                        
                        // Buttons that appear inside the image pop-up when inserting/replacing
                        imageInsertButtons: [
                            'imageBack', 
                            '|', 
                            'imageUpload', 
                            'imageByURL', 
                            'imageManager'
                        ],
                        
                        // Note: You must configure a valid server endpoint for 'imageUpload' to work
                        imageUploadURL: '/your-server-endpoint/upload_froala_image' 
                    });
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
            <div className={`w-full max-w-7xl p-12 rounded-3xl shadow-2xl ${currentBG.card} min-h-[600px] max-h-[600px] overflow-y-auto flex items-center`}>
                
                {/* Content Editor */}
                <div ref={contentRef} className="w-1/2 pr-8">
                    <p contentEditable suppressContentEditableWarning className="text-xl">
                        Text content with supporting image (left-right).
                    </p>
                </div>
                
                {/* Image Editor */}
                <div ref={imageRef} className="w-1/2 max-h-150 cursor-pointer">
                    <img src={C1} alt="placeholder" className="w-full max-h-140 rounded-lg" />
                </div>
                
            </div>
        </div>
    );
};

const ImageWithContentPage = ({ id, theme, background }) => {
    const contentRef = useRef(null);
    const imageRef = useRef(null);
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                // Initialize Image Editor
                if (imageRef.current) {
                    new window.FroalaEditor(imageRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        
                        toolbarButtons: ['insertImage', 'imageRemove'], 
                        
                        imageEditButtons: [
                            'imageReplace', 
                            'imageAlign', 
                            'imageCaption', 
                            'imageRemove', 
                            '|', 
                            'imageLink', 
                            'imageDisplay', 
                            'imageAlt', 
                            'imageSize'
                        ],
                        
                        imageInsertButtons: [
                            'imageBack', 
                            '|', 
                            'imageUpload', 
                            'imageByURL', 
                            'imageManager'
                        ],
                        
                        imageUploadURL: '/your-server-endpoint/upload_froala_image' 
                    });
                }
                
                // Initialize Content/Text Editor
                if (contentRef.current) {
                    new window.FroalaEditor(contentRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'formatUL', 'formatOL'],
                    });
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
            <div className={`w-full max-w-7xl p-12 rounded-3xl shadow-2xl ${currentBG.card} min-h-[600px] max-h-[600px] overflow-y-auto flex items-center`}>
                
                {/* Image Editor (Left Side) */}
                <div ref={imageRef} className="w-1/2 cursor-pointer">
                    <img src={A1} alt="placeholder" className="w-full rounded-lg" />
                </div>
                
                {/* Content Editor (Right Side) */}
                <div ref={contentRef} className="w-1/2 pl-8">
                    <p contentEditable suppressContentEditableWarning className="text-xl">
                        Image-first with supporting text (right-left).
                    </p>
                </div>
                
            </div>
        </div>
    );
};

const TwoContentWithImagePage = ({ id, theme, background }) => {
    const content1Ref = useRef(null);
    const content2Ref = useRef(null);
    const imageRef = useRef(null);
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                // Initialize Content 1 Editor
                if (content1Ref.current) {
                    new window.FroalaEditor(content1Ref.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'formatUL', 'formatOL'],
                    });
                }
                
                // Initialize Content 2 Editor
                if (content2Ref.current) {
                    new window.FroalaEditor(content2Ref.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'formatUL', 'formatOL'],
                    });
                }

                // Initialize Image Editor
                if (imageRef.current) {
                    new window.FroalaEditor(imageRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        
                        toolbarButtons: ['insertImage', 'imageRemove'], 
                        
                        imageEditButtons: [
                            'imageReplace', 
                            'imageAlign', 
                            'imageCaption', 
                            'imageRemove', 
                            '|', 
                            'imageLink', 
                            'imageDisplay', 
                            'imageAlt', 
                            'imageSize'
                        ],
                        
                        imageInsertButtons: [
                            'imageBack', 
                            '|', 
                            'imageUpload', 
                            'imageByURL', 
                            'imageManager'
                        ],
                        
                        imageUploadURL: '/your-server-endpoint/upload_froala_image' 
                    });
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
            <div className={`w-full max-w-7xl p-12 rounded-3xl shadow-2xl ${currentBG.card} min-h-[600px] max-h-[600px] overflow-y-auto flex items-center`}>
                
                {/* Content 1 Editor (Left) */}
                <div ref={content1Ref} className="w-1/3 pr-4">
                    <p contentEditable suppressContentEditableWarning className="text-xl">
                        Central image with content on both sides.
                    </p>
                </div>
                
                {/* Image Editor (Center) */}
                <div ref={imageRef} className="w-1/3 cursor-pointer">
                    <img src={A2} alt="placeholder" className="w-full rounded-lg" />
                </div>
                
                {/* Content 2 Editor (Right) */}
                <div ref={content2Ref} className="w-1/3 pl-4">
                    <p contentEditable suppressContentEditableWarning className="text-xl">
                        More content on the other side.
                    </p>
                </div>
            </div>
        </div>
    );
};

const VerticalTextPage = ({ id, theme, background }) => {
    const contentRef = useRef(null);
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                if (contentRef.current) {
                    new window.FroalaEditor(contentRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'formatUL', 'formatOL'],
                    });
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
            <div className={`w-full max-w-7xl p-12 rounded-3xl shadow-2xl ${currentBG.card} min-h-[600px] max-h-[600px] overflow-y-auto flex flex-col justify-center`}>
                <div className=' opacity-80' ref={contentRef}>
                    <p contentEditable suppressContentEditableWarning className="text-xl mb-4">Sequential information in vertical flow.</p>
                    <p contentEditable suppressContentEditableWarning className="text-xl mb-4">Step 2.</p>
                    <p contentEditable suppressContentEditableWarning className="text-xl">Step 3.</p>
                </div>
            </div>
        </div>
    );
};

const VerticalTitleAndTextPage = ({ id, theme, background }) => {
    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                if (titleRef.current) {
                    new window.FroalaEditor(titleRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor'],
                    });
                }
                if (contentRef.current) {
                    new window.FroalaEditor(contentRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'formatUL', 'formatOL'],
                    });
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
            <div className={`w-full max-w-7xl p-12 rounded-3xl shadow-2xl ${currentBG.card} min-h-[600px] max-h-[600px] overflow-y-auto flex flex-col justify-center`}>
                <div ref={titleRef}>
                    <h1 className="text-4xl font-bold mb-4" contentEditable suppressContentEditableWarning>Title with organized vertical content</h1>
                </div>
                <div ref={contentRef}>
                    <p contentEditable suppressContentEditableWarning className="text-xl opacity-70">
                        Content goes here.
                    </p>
                </div>
            </div>
        </div>
    );
};

const FourObjectsPage = ({ id, theme, background }) => {
    const object1Ref = useRef(null);
    const object2Ref = useRef(null);
    const object3Ref = useRef(null);
    const object4Ref = useRef(null);
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                [object1Ref, object2Ref, object3Ref, object4Ref].forEach(ref => {
                    if (ref.current) {
                        new window.FroalaEditor(ref.current, {
                            inline: true,
                            toolbarInline: true,
                            toolbarVisibleWithoutSelection: true,
                            charCounterCount: false,
                            wordCounterCount: false,
                            toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor'],
                        });
                    }
                });
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
            <div className={`w-full max-w-7xl p-12 rounded-3xl shadow-2xl ${currentBG.card} min-h-[600px] max-h-[600px] overflow-y-auto grid grid-cols-2 gap-8`}>
                <div ref={object1Ref} className={`p-6 rounded-lg shadow-lg ${currentBG.card}`}>
                    <p contentEditable suppressContentEditableWarning>Object 1</p>
                </div>
                <div ref={object2Ref} className={`p-6 rounded-lg shadow-lg ${currentBG.card}`}>
                    <p contentEditable suppressContentEditableWarning>Object 2</p>
                </div>
                <div ref={object3Ref} className={`p-6 rounded-lg shadow-lg ${currentBG.card}`}>
                    <p contentEditable suppressContentEditableWarning>Object 3</p>
                </div>
                <div ref={object4Ref} className={`p-6 rounded-lg shadow-lg ${currentBG.card}`}>
                    <p contentEditable suppressContentEditableWarning>Object 4</p>
                </div>
            </div>
        </div>
    );
};

const TitleAndFourObjectsPage = ({ id, theme, background }) => {
    const titleRef = useRef(null);
    const object1Ref = useRef(null);
    const object2Ref = useRef(null);
    const object3Ref = useRef(null);
    const object4Ref = useRef(null);
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                if (titleRef.current) {
                    new window.FroalaEditor(titleRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor'],
                    });
                }
                [object1Ref, object2Ref, object3Ref, object4Ref].forEach(ref => {
                    if (ref.current) {
                        new window.FroalaEditor(ref.current, {
                            inline: true,
                            toolbarInline: true,
                            toolbarVisibleWithoutSelection: true,
                            charCounterCount: false,
                            wordCounterCount: false,
                            toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor'],
                        });
                    }
                });
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
            <div className={`w-full max-w-7xl p-12 rounded-3xl shadow-2xl ${currentBG.card} min-h-[600px] max-h-[600px] overflow-y-auto`}>
                <div ref={titleRef} className="text-center mb-8">
                    <h1 className="text-5xl font-bold" contentEditable suppressContentEditableWarning>Titled 2x2 grid layout</h1>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div ref={object1Ref} className={`p-6 min-h-50 rounded-lg shadow-lg ${currentBG.card}`}>
                        <p contentEditable suppressContentEditableWarning>Object 1</p>
                    </div>
                    <div ref={object2Ref} className={`p-6 rounded-lg shadow-lg min-h-50 ${currentBG.card}`}>
                        <p contentEditable suppressContentEditableWarning>Object 2</p>
                    </div>
                    <div ref={object3Ref} className={`p-6 rounded-lg shadow-lg min-h-50 ${currentBG.card}`}>
                        <p contentEditable suppressContentEditableWarning>Object 3</p>
                    </div>
                    <div ref={object4Ref} className={`p-6 rounded-lg shadow-lg min-h-50 ${currentBG.card}`}>
                        <p contentEditable suppressContentEditableWarning>Object 4</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TitleAndTextPage = ({ id, theme, background }) => {
    const titleRef = useRef(null);
    const textRef = useRef(null);
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                if (titleRef.current) {
                    new window.FroalaEditor(titleRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor'],
                    });
                }
                if (textRef.current) {
                    new window.FroalaEditor(textRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'formatUL', 'formatOL', 'align'],
                    });
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
            <div className={`w-full max-w-7xl p-12 rounded-3xl shadow-2xl ${currentBG.card} min-h-[600px] max-h-[600px] overflow-y-auto`}>
                <div ref={titleRef} className="text-center mb-8">
                    <h1 className="text-5xl font-bold" contentEditable suppressContentEditableWarning>Long-form content</h1>
                </div>
                <div ref={textRef}>
                    <p contentEditable suppressContentEditableWarning className="text-xl opacity-70">
                        This is a layout for long-form content with professional typography. You can write detailed explanations, articles, or reports here.
                    </p>
                </div>
            </div>
        </div>
    );
};

const TitleAndTwoColumnTextPage = ({ id, theme, background }) => {
    const titleRef = useRef(null);
    const col1Ref = useRef(null);
    const col2Ref = useRef(null);
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                if (titleRef.current) {
                    new window.FroalaEditor(titleRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor'],
                    });
                }
                if (col1Ref.current) {
                    new window.FroalaEditor(col1Ref.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'formatUL', 'formatOL', 'align'],
                    });
                }
                if (col2Ref.current) {
                    new window.FroalaEditor(col2Ref.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'formatUL', 'formatOL', 'align'],
                    });
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
            <div className={`w-full max-w-7xl p-12 rounded-3xl shadow-2xl ${currentBG.card} min-h-[600px] max-h-[600px] overflow-y-auto`}>
                <div ref={titleRef} className="text-center mb-8">
                    <h1 className="text-5xl font-bold" contentEditable suppressContentEditableWarning>Organized text in dual columns</h1>
                </div>
                <div className="flex">
                    <div ref={col1Ref} className="w-1/2 pr-4">
                        <p contentEditable suppressContentEditableWarning className="text-xl opacity-70">
                            This is the first column.
                        </p>
                    </div>
                    <div ref={col2Ref} className="w-1/2 pl-4">
                        <p contentEditable suppressContentEditableWarning className="text-xl opacity-70">
                            This is the second column.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const QuotePage = ({ id, theme, background }) => {
    const quoteRef = useRef(null);
    const authorRef = useRef(null);
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                if (quoteRef.current) {
                    new window.FroalaEditor(quoteRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor'],
                    });
                }
                if (authorRef.current) {
                    new window.FroalaEditor(authorRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor'],
                    });
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
            <div className={`w-full max-w-7xl p-12 text-center rounded-3xl shadow-2xl ${currentBG.card} min-h-[600px] max-h-[600px] overflow-y-auto flex flex-col items-center justify-center`}>
                <div ref={quoteRef}>
                    <blockquote className="text-4xl italic" contentEditable suppressContentEditableWarning>
                        "Large inspirational quotes with attribution."
                    </blockquote>
                </div>
                <div ref={authorRef} className="mt-4">
                    <cite className="text-xl" contentEditable suppressContentEditableWarning>
                        - Author
                    </cite>
                </div>
            </div>
        </div>
    );
};

const BlankPage = ({ id, theme, background }) => {
    const contentRef = useRef(null);
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';

        const initializeEditors = () => {
            if (window.FroalaEditor) {
                if (contentRef.current) {
                    new window.FroalaEditor(contentRef.current, {
                        inline: true,
                        toolbarInline: true,
                        toolbarVisibleWithoutSelection: true,
                        charCounterCount: false,
                        wordCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'insertImage', 'formatUL', 'formatOL', 'align'],
                    });
                }
            }
        };

        script.onload = () => {
            setTimeout(initializeEditors, 100);
        };

        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div key={id} className={`flex flex-col items-center justify-center min-h-screen p-8 sm:p-16 font-[inter] ${currentTheme} ${currentBG.text}`}>
            <div ref={contentRef} className={`w-full max-w-7xl p-12 rounded-3xl shadow-2xl ${currentBG.card} min-h-[600px] max-h-[600px] overflow-y-auto`}>
                <p contentEditable suppressContentEditableWarning>Custom content creation canvas.</p>
            </div>
        </div>
    );
};


const LayoutPicker = ({ onSelect, onClose, theme, background }) => {
    const currentTheme = themes[theme];
    const currentBG = backgrounds[background]
    const layouts = [
        { name: 'Title Only', component: TitleOnlyPage },
        { name: 'Title & Subtitle', component: TitleAndSubtitlePage },
        { name: 'Title & Content', component: TitleAndContentPage },
        { name: 'Section Header', component: SectionHeaderPage },
        { name: 'Content with Caption', component: ContentWithCaptionPage },
        { name: 'Two Content', component: TwoContentPage },
        { name: 'Comparison', component: ComparisonPage },
        { name: 'Content Over Image', component: ContentOverImagePage },
        { name: 'Picture with Caption', component: PictureWithCaptionPage },
        { name: 'Content with Image', component: ContentWithImagePage },
        { name: 'Image with Content', component: ImageWithContentPage },
        { name: 'Two Content with Image', component: TwoContentWithImagePage },
        { name: 'Vertical Text', component: VerticalTextPage },
        { name: 'Vertical Title & Text', component: VerticalTitleAndTextPage },
        { name: 'Four Objects', component: FourObjectsPage },
        { name: 'Title & Four Objects', component: TitleAndFourObjectsPage },
        { name: 'Title & Text', component: TitleAndTextPage },
        { name: 'Title & Two Column Text', component: TitleAndTwoColumnTextPage },
        { name: 'Quote', component: QuotePage },
        { name: 'Blank', component: BlankPage },
    ];

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xl bg-opacity-70 flex items-center justify-center z-[100]">
            <div className={`${currentBG} rounded-lg p-8 shadow-xl`}>
                <h2 className="text-xl font-semibold text-white mb-6">Choose a Layout</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto">
                    {layouts.map(layout => (
                        <button
                            key={layout.name}
                            onClick={() => onSelect(layout.component)}
                            className="p-4 border rounded-lg text-white hover:text-black hover:bg-gray-200 hover:transition-all"
                        >
                            {layout.name}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className={`mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300`}
                >
                    Close
                </button>
            </div>
        </div>
    );
}


export default function EditorPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  // const [theme, setTheme] = useState('dark');
  // const [background, setbackground] = useState('original')
  // const [slideBackgrounds, setSlideBackgrounds] = useState({});
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showBackgroundModal, setshowBackgroundModal] = useState(false);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  // const currentTheme = themes[theme];
  // const currentBG = backgrounds[background]
  // console.log(background)
  const initialSlidesData = [
    { id: 'user-bg-select', component: UserBGselect},
    { id: 'the-challenge', component: TheChallangePage, defaultBg: 'original', defaultTheme: 'dark' },
    { id: 'our-solution', component: OurSolutionPage, defaultBg: 'original', defaultTheme: 'dark' },
    { id: 'market-potential', component: MarketPotentialPage, defaultBg: 'original', defaultTheme: 'dark' },
    { id: 'competitive-edge', component: CompetitiveEdgePAge, defaultBg: 'original', defaultTheme: 'dark' },
    { id: 'growth-trajectory', component: GrowthTrajectoryPage, defaultBg: 'original', defaultTheme: 'dark' },
    { id: 'proven-model', component: ProvenModelPage, defaultBg: 'original', defaultTheme: 'dark' },
    { id: 'series-a', component: SeriesAPage, defaultBg: 'original', defaultTheme: 'dark' },
    { id: 'join-us', component: JoinUsPage, defaultBg: 'original', defaultTheme: 'dark' },
]
const initialSlideBGs = initialSlidesData.reduce((acc, slide) => {
    acc[slide.id] = slide.defaultBg;
    return acc;
}, {});

const initialSlideThemes = initialSlidesData.reduce((acc, slide) => {
    acc[slide.id] = slide.defaultTheme;
    return acc;
}, {});

const initialSlides = initialSlidesData.map(data => 
    <data.component 
        key={data.id} 
        id={data.id} // Pass the ID down
        theme={initialSlideThemes[data.id]} 
        background={initialSlideBGs[data.id]} // Pass the specific background
    />
    
);
const [slides, setSlides] = useState(initialSlides);
const [slideBackgrounds, setSlideBackgrounds] = useState(initialSlideBGs);
const [slideThemes, setSlideThemes] = useState(initialSlideThemes);
  // const initialSlides = [
  //   <UserBGselect key="user-bg-select" />,
  //   <TheChallangePage key="the-challenge" theme={theme} background={background} />,
  //   <OurSolutionPage key="our-solution" theme={theme} background={background} />,
  //   <MarketPotentialPage key="market-potential" theme={theme} background={background} />,
  //   <CompetitiveEdgePAge key="competitive-edge" theme={theme} background={background} />,
  //   <GrowthTrajectoryPage key="growth-trajectory" theme={theme} background={background} />,
  //   <ProvenModelPage key="proven-model" theme={theme} background={background} />,
  //   <SeriesAPage key="series-a" theme={theme} background={background} />,
  //   <JoinUsPage key="join-us" theme={theme} background={background} />,
  // ];
  // const [slides, setSlides] = useState(initialSlides);
  const isAnimatingRef = useRef(false);
  

  useEffect(() => {
    setSlides(prevSlides => prevSlides.map(slide => {
      const currentSlideBG = slideBackgrounds[slide.key];
      const currentSlideTheme = slideThemes[slide.key];
      if (slide.type.name === 'UserBGselect') {
        return slide;
      }
      return React.cloneElement(slide, { 
          theme: currentSlideTheme, 
          background: currentSlideBG // Passes the individual background key
      });
    }));
}, [slideThemes, slideBackgrounds]);

  // const handleAddSlide = (LayoutComponent) => {
  //   const newSlide = <LayoutComponent key={Date.now()} id={Date.now()} theme={theme} />;
  //   setSlides(prevSlides => {
  //     const newSlides = [...prevSlides, newSlide];
  //     setCurrentSlideIndex(newSlides.length - 1);
  //     return newSlides;
  //   });
  //   setShowLayoutPicker(false);
  // };

const handleAddSlide = (LayoutComponent) => {
    const newId = Date.now().toString(); // Use string ID
    const defaultNewBG = 'original'; // Set a default for new slides
    const defaultNewTheme = 'dark';
    
    // 1. Update the Background state map
    setSlideBackgrounds(prevBGs => ({
        ...prevBGs,
        [newId]: defaultNewBG,
    }));
    
    // 2. Create the new slide element
    const newSlide = <LayoutComponent 
        key={newId} 
        id={newId} 
        theme={defaultNewTheme} 
        background={defaultNewBG} // Pass the initial background
    />;
    
    // 3. Update the slides array
    setSlides(prevSlides => {
      const newSlides = [...prevSlides, newSlide];
      setCurrentSlideIndex(newSlides.length - 1);
      return newSlides;
    });
    
    setShowLayoutPicker(false);
};

const handleThemeChange = (newTheme) => {
    const currentSlideId = slides[currentSlideIndex].key; 
    
    setSlideThemes(prevThemes => ({
        ...prevThemes,
        [currentSlideId]: newTheme,
    }));
    
    // Close the modal
    setShowThemeModal(false);
};

  // const handleThemeChange = (newTheme) => {
  //   setTheme(newTheme);
  //   setShowThemeModal(false);
  // };
  // const handleBGChange = (newBG) => {
  //   setbackground(newBG);
  //   setshowBackgroundModal(false);
  // };

  const handleBGChange = (newBG) => {
    const currentSlideId = slides[currentSlideIndex].key; 
    
    setSlideBackgrounds(prevBGs => ({
        ...prevBGs,
        [currentSlideId]: newBG,
    }));
    
    // Close the modal
    setshowBackgroundModal(false);
};

const currentSlideKey = slides[currentSlideIndex]?.key;
const currentThemeKey = slideThemes[currentSlideKey] || 'dark'; // Fallback to 'dark'
const currentBGKey = slideBackgrounds[currentSlideKey] || 'original'; // Get the current slide's background

const currentTheme = themes[currentThemeKey];
const currentBG = backgrounds[currentBGKey]

  useEffect(() => {
    const handleWheel = (event) => {
      if (isAnimatingRef.current) return;
      
      const deltaY = event.deltaY;
      let newIndex = currentSlideIndex;

      if (deltaY > 0 && currentSlideIndex < slides.length - 1) {
        newIndex = currentSlideIndex + 1;
      } else if (deltaY < 0 && currentSlideIndex > 0) {
        newIndex = currentSlideIndex - 1;
      }

      if (newIndex !== currentSlideIndex) {
        isAnimatingRef.current = true;
        setCurrentSlideIndex(newIndex);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentSlideIndex, slides.length]);

  const transition = {
    duration: 1.1,
    ease: [0.8, 0.08, -0.015, 1.0],
  };

  const containerVariants = {
    initial: { y: 0 },
    animate: { y: `-${currentSlideIndex * 100}vh` },
  };

  return (
    <div className={`App ${backgrounds[currentBGKey].bg} font-sans antialiased h-screen w-screen relative overflow-hidden ${currentTheme.bg} ${currentTheme.text}`}>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        transition={transition}
        onAnimationComplete={() => { isAnimatingRef.current = false; }}
      >
        {slides.map((slide, index) => (
          <div key={slide.key || index} className="h-screen w-screen">
            {slide}
          </div>
        ))}
      </motion.div>

      {/* Slide Navigation Bars */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 flex flex-col space-y-4 z-50">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`
              h-0.5 rounded-full transition-all duration-300 ease-in-out cursor-pointer
              ${index === currentSlideIndex ? 'w-7 bg-gray-400' : 'w-3 bg-gray-500'}
            `}
            onClick={() => setCurrentSlideIndex(index)}
          ></div>
        ))}
      </div>

      {currentSlideIndex > 0 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex z-50">
          <button
            onClick={() => setShowLayoutPicker(true)}
            className={`py-2 px-4 text-base font-[inter] font-semibold cursor-pointer rounded-l-xl border-none bg-gray-700 flex items-center bg-opacity-50 text-white hover:bg-opacity-70 transition-colors`}
          >
            <Plus size={20} className='mr-2'/> Insert
          </button>

          <div className="relative flex">
            <button
              onClick={() => setShowThemeModal(true)}
              className={`px-4 py-3 text-sm cursor-pointer font-[inter] font-semibold border-none bg-gray-700 bg-opacity-50 text-white hover:bg-opacity-70 transition-colors flex items-center`}
            >
              <Palette size={20} className="mr-2" />
              <span>Select Theme</span>
            </button>

            <div className="relative">
            <button
              onClick={() => setshowBackgroundModal(true)}
              className={`px-4 py-3 text-sm cursor-pointer font-[inter] font-semibold border-none bg-gray-700 bg-opacity-50 rounded-r-xl text-white hover:bg-opacity-70 transition-colors flex items-center`}
            >
              <PiSelectionBackground size={20} className='mr-2'/>
              <span>Background</span>
            </button>
          </div>
          </div>
        </div>
      )}

      {showLayoutPicker && <LayoutPicker theme={currentTheme} onSelect={handleAddSlide} onClose={() => setShowLayoutPicker(false)} />}

      {/* Theme Selection Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-70 flex items-center justify-center z-[100]">
          <div className={`bg-gray-400 rounded-lg p-8 shadow-xl flex flex-col items-center`}>
            <h2 className={`text-xl font-semibold mb-6 ${currentTheme.text}`}>Choose a Theme</h2>
            <div className="flex gap-4">
              <button
                onClick={() => handleThemeChange('dark')}
                className="flex flex-col items-center justify-center p-4 rounded-md w-32 h-32 bg-[#021e1d] border-2 border-transparent hover:border-blue-500 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gray-600 mb-2"></div>
                <span className="text-white font-medium">Dark</span>
              </button>
              <button
                onClick={() => handleThemeChange('light')}
                className="flex flex-col items-center justify-center p-4 rounded-md w-32 h-32 bg-gray-100 border-2 border-transparent hover:border-blue-500 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gray-400 mb-2"></div>
                <span className="text-gray-900 font-medium">Light</span>
              </button>
              <button
                onClick={() => handleThemeChange('warm')}
                className="flex flex-col items-center justify-center p-4 rounded-md w-32 h-32 bg-orange-100 border-2 border-transparent hover:border-blue-500 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-orange-300 mb-2"></div>
                <span className="text-gray-900 font-medium">Warm</span>
              </button>
              <button
                onClick={() => handleThemeChange('DeepPurple')}
                className="flex flex-col items-center justify-center p-4 rounded-md w-32 h-32 bg-purple-300 border-2 border-transparent hover:border-blue-500 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-purple-400 mb-2"></div>
                <span className="text-gray-900 font-medium">Deep Purple</span>
              </button>
              <button
                onClick={() => handleThemeChange('DarkBlue')}
                className="flex flex-col items-center justify-center p-4 rounded-md w-32 h-32 bg-blue-400 border-2 border-transparent hover:border-blue-500 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-blue-900 mb-2"></div>
                <span className="text-gray-900 font-medium">Dark Blue</span>
              </button>
              <button
                onClick={() => handleThemeChange('EarthStone')}
                className="flex flex-col items-center justify-center p-4 rounded-md w-32 h-32 bg-stone-400 border-2 border-transparent hover:border-blue-500 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-stone-600 mb-2"></div>
                <span className="text-gray-900 font-medium">Earth Stone</span>
              </button>
            </div>
            <button
              onClick={() => setShowThemeModal(false)}
              className="mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showBackgroundModal && (
    <div className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-70 flex items-center justify-center z-[100]">
    <div className={`bg-stone-900 rounded-lg p-8 shadow-xl flex flex-col items-center max-w-160 w-full mx-4`}>
      <h2 className={`text-xl font-semibold mb-6 ${currentBG.text}`}>Choose a Background</h2>

      {/* Normal Backgrounds Section */}
      <h2 className={`text-lg font-semibold mt-4 mb-3 ${currentBG.text}`}>Normal</h2>
      <div className="flex flex-wrap justify-center gap-2 max-w-130">
        {Object.entries(backgrounds)
          // Select the first 21 backgrounds for the "Normal" section
          .slice(0, 20)
          .map(([key, value], index) => (
            <button
              key={key}
              onClick={() => handleBGChange(key)}
              className="flex flex-col items-center hover:cursor-pointer justify-center border-2 border-transparent transition-colors p-1 hover:border-blue-500 rounded-lg"
            >
              <div
                title={key.replace(/([A-Z])/g, ' $1').trim()} 
                className={`w-8 h-8 rounded-full ${value.card} shadow-inner border border-gray-300`}
              >
              </div>
            </button>
          ))}
      </div>

      {/* Gradient Backgrounds Section */}
      <h2 className={`text-lg font-semibold mt-6 mb-3 ${currentBG.text}`}>Gradient</h2>
      <div className="flex flex-wrap justify-center gap-2 max-w-130">
        {Object.entries(backgrounds)
          // Select the remaining backgrounds for the "Gradient" section
          .slice(20, 42)
          .map(([key, value], index) => (
            <button
              key={key}
              onClick={() => handleBGChange(key)}
              // Rectangular button class for gradients
              className="flex flex-col items-center hover:cursor-pointer justify-center border-2 border-transparent transition-colors p-1 hover:border-blue-500 rounded-lg"
            >
              <div
                title={key.replace(/([A-Z])/g, ' $1').trim()} // Better title formatting
                // Rectangular swatch
                className={`w-14 h-8 rounded-md ${value.card} shadow-inner border border-gray-300`}
              >
              </div>
            </button>
          ))}
      </div>

      <button
        onClick={() => setshowBackgroundModal(false)}
        className="mt-6 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
}