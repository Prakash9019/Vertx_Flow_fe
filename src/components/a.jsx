import Sidebar from './Sidebar';
import Bg from '../assets/FlashBG.png'
import { useState } from 'react';
import { BiDockLeft, BiDockRight } from 'react-icons/bi';
import { ArrowLeft } from 'lucide-react';
import logo from '../assets/logo.svg';
import U1 from '../assets/U1.jpg';
import U2 from '../assets/U2.jpg';
import { useNavigate } from 'react-router-dom';
import Flashbar from './Flashbar';



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
//   if (collapsed) {
//     return(<Flashbar/>);
//   }
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
        <div  className="min-h-screen bg-black text-white flex relative overflow-hidden">    
        <div className="bg-black text-white">
                <Flashbar />
        </div>
        <div className="relative m-0 md:m-4 lg:m-8 w-full">
                  <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center mb-0 lg:mb-8 space-y-2 lg:space-y-0">
                    <div
                      style={{ fontFamily: "'Crimson Text', serif" }}
                      className="flex items-center text-sm sm:text-base mt-3 sm:mt-0 justify-center mx-auto "
                    >
                      <span className="text-gray-400">FLASH BY</span>
                      <img className="w-4 h-4 mx-2" src={logo} alt="" />
                      <span className="text-white font-bold ml-1">VERTX</span>
                    </div>
                    <div className=""></div>
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

            </div>
        // <div className="min-h-screen bg-black text-white flex flex-col p-2 lg:p-8 space-y-2 lg:space-y-8">
        //   <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center mb-0 lg:mb-8 space-y-2 lg:space-y-0">
        //     <div className="flex gap-1">
        //       {!collapsed && (
        //         <>
        //           <div className="flex bg-[#232323AB] p-2 rounded-md items-center justify-between">
        //             <div className="flex font-[inter]">
        //               <button className="px-4 font-medium py-2 text-xs sm:text-sm text-white rounded-md hover:bg-gray-700">
        //                 New
        //               </button>
        //               <button className="px-4 font-medium py-2 text-xs sm:text-sm text-white rounded-md border-l border-gray-700 hover:bg-gray-700">
        //                 History
        //               </button>
        //               <button className="px-4 py-2 text-xs sm:text-sm bg-[#A55EEB] rounded-md text-black font-bold border-l border-gray-700 hover:bg-[#B393DF]">
        //                 EXIT
        //               </button>
        //               <button
        //                 onClick={handleCollapsed}
        //                 className="px-4 font-medium py-2 text-lg sm:text-xl text-white border-l border-gray-700 rounded-md hover:bg-gray-700"
        //               >
        //                 <BiDockRight />
        //               </button>
        //             </div>
        //           </div>
        //           <button
        //             onClick={() => setClicked(false)}
        //             className="flex items-center space-x-2 font-medium font-[inter] px-4 py-2 text-xs sm:text-sm bg-[#232323AB] text-white rounded-md"
        //           >
        //             <ArrowLeft />
        //             <span>Back</span>
        //           </button>
        //         </>
        //       )}
        //       {collapsed && (
        //         <div className="flex gap-2 font-medium font-[inter] w-full lg:min-w-90">
        //           <button
        //             onClick={handleNCollapsed}
        //             className="px-4 hover:bg-gray-700 py-2 text-xl bg-[#232323AB] text-white rounded-md"
        //           >
        //             <BiDockRight className="" />
        //           </button>
        //           <button
        //             onClick={() => setClicked(false)}
        //             className="flex items-center space-x-2 gap-2 px-4 py-2 text-sm bg-[#232323AB] text-white rounded-md"
        //           >
        //             <ArrowLeft className="" />
        //             <span>Back</span>
        //           </button>
        //         </div>
        //       )}
        //     </div>
        //     <div
        //       style={{ fontFamily: "'Crimson Text', serif" }}
        //       className="flex items-center text-sm sm:text-base mt-3 sm:mt-0 justify-center mx-auto -mb-8 sm:mb-0"
        //     >
        //       <span className="text-gray-400">FLASH BY</span>
        //       <img className="w-4 h-4 mx-2" src={logo} alt="" />
        //       <span className="text-white font-bold ml-1">VERTX</span>
        //     </div>
        //     <div className="min-w-90"></div>
        //   </div>

        //   <div className="flex flex-col flex-1 items-center justify-center">
        //     <div className="flex flex-col  items-center text-center space-y-2 sm:space-y-4 mb-4 sm:mb-8">
        //       <h1 className="text-[28px] sm:text-[32px] font-[inter] font-semibold">
        //         Create a new deck
        //       </h1>
        //       <p className="text-[#D9D9D9AD]/68 text-sm sm:text-base font-[inter] font-medium">
        //         Describe your startup in a short description to create your pitch
        //         deck.
        //       </p>
        //     </div>

        //     <div className="flex flex-col items-center space-y-2 sm:space-y-4 mb-6 sm:mb-8 w-full max-w-2xl mx-auto">
        //       <input
        //         type="text"
        //         placeholder="What would you like to create today?"
        //         className="w-full h-20 p-4 font-[inter] font-medium bg-[#232323]/67 text-white border placeholder:text-sm placeholder:sm:text-base border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600"
        //       />
        //       <div className="flex space-x-4 justify-start w-full">
        //         <button className="px-4 py-2 text-xs font-medium font-[inter] bg-[#101010] text-white rounded-md ">
        //           Pre-Seed Pitch Deck
        //         </button>
        //         <button className="px-4 py-2 bg-[#101010] text-xs font-medium font-[inter] text-white rounded-md ">
        //           Series A Pitch Deck
        //         </button>
        //       </div>
        //     </div>

        //     <div className="flex flex-col items-start space-y-4 w-full max-w-sm md:max-w-2xl mx-auto">
        //       <p className="text-gray-400 text-sm font-medium font-[inter] ">
        //         Try these...
        //       </p>
        //       <div className="flex space-x-8">
        //         <div className="flex flex-col items-center space-y-2">
        //           <div className="w-40 md:w-80 md:h-40 h-30 rounded-md overflow-hidden">
        //             <img
        //               src={U1}
        //               alt="Create from Scratch"
        //               className="object-cover brightness-50 w-full h-full"
        //             />
        //           </div>
        //           <p className="text-xs font-medium font-[inter]">
        //             Create from Scratch
        //           </p>
        //         </div>
        //         <div className="flex flex-col items-center space-y-2">
        //           <div className="w-40 md:w-80 md:h-40 h-30 rounded-md overflow-hidden">
        //             <img
        //               src={U2}
        //               alt="Checkout Templates"
        //               className="object-cover brightness-50 w-full h-full"
        //             />
        //           </div>
        //           <p className="text-xs font-medium font-[inter]">
        //             Checkout Templates
        //           </p>
        //         </div>
        //       </div>
        //     </div>
        //   </div>

        //   <div className="flex justify-between items-center mt-0 sm:mt-6 w-full max-w-sm sm:max-w-2xl mx-auto p-4 bg-[#232323]/67 gap-5 rounded-md">
        //     <div className="flex space-x-1 sm:space-x-4">
        //       <select className="bg-[#232323]/67 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md focus:outline-none">
        //         <option className="sm:text-xs text-[9px] font-medium font-[inter]">
        //           No. of Slides
        //         </option>
        //       </select>
        //       <select className="bg-[#232323]/67 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md focus:outline-none">
        //         <option className="sm:text-xs text-[9px] font-[inter]">
        //           Content Style
        //         </option>
        //       </select>
        //     </div>
        //     <button className="px-2 py-1 sm:px-6 sm:py-2 sm:text-sm text-[11px] font-medium font-[inter] bg-white text-black rounded-md">
        //       Continue
        //     </button>
        //   </div>
        // </div>



        // import React, { useState } from 'react';
// import A1 from "./1.jpg";
// import A2 from "./2.jpg";
// import A3 from "./3.jpg";
// import A4 from "./4.jpg";
// import A5 from "./5.jpg";
// import A6 from "./6.jpg";
// import A7 from "./7.jpg";
// import A8 from "./8.jpg";
// import A9 from "./9.jpg";
// import A10 from "./10.jpg";
// import A11 from "./11.jpg";
// import A12 from "./12.jpg";
// import A13 from "./13.jpg";
// import A14 from "./14.jpg";
// import A15 from "./15.jpg";
// import A16 from "./16.jpg";
// import A17 from "./17.jpg";
// import { ImageIcon } from 'lucide-react';

// const images = [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14, A15, A16, A17];

// const UserBGselect = () => {
//   const [backgroundImage, setBackgroundImage] = useState(images[0]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [textPosition, setTextPosition] = useState('center');
//   const [glowEffect, setGlowEffect] = useState(false);
//   const [isNoCover, setIsNoCover] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState('Original');

//   const handleImageClick = (image) => {
//     setBackgroundImage(image);
//     setIsModalOpen(false);
//     setIsNoCover(false);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };
  
//   const handleOptionClick = (option) => {
//     setSelectedOption(option);
//     switch (option) {
//       case 'Original':
//         setTextPosition('center');
//         setGlowEffect(false);
//         setIsNoCover(false);
//         break;
//       case 'Center Glow':
//         setTextPosition('center');
//         setGlowEffect(true);
//         setIsNoCover(false);
//         break;
//       case 'Top':
//         setTextPosition('top-left');
//         setGlowEffect(false);
//         setIsNoCover(false);
//         break;
//       case 'No Cover':
//         setIsNoCover(true);
//         setTextPosition('center');
//         setGlowEffect(false);
//         break;
//       default:
//         break;
//     }
//     setIsMenuOpen(false);
//   };

//   return (
//     <div
//       className={`h-screen w-screen bg-center transition-all duration-500 relative ${isNoCover ? 'bg-black' : 'bg-cover'}`}
//       style={{ backgroundImage: isNoCover ? 'none' : `url(${backgroundImage})` }}
//     >
//       <div 
//         className={`text-white text-center p-4 transition-all duration-500 relative
//           ${textPosition === 'top-left' ? 'absolute top-10 left-10' : 'flex flex-col justify-center items-center h-full w-full'}`}
//       >
//         <h2 className={`text-5xl font-inter font-bold`}>
//           Lorem ipsum dolor sit amet consectetur, adipisicing elit
//         </h2>
//         {glowEffect && (
//           <div className="w-full absolute bottom-0 left-0 glowing-text-bottom"></div>
//         )}
//       </div>

//       <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-4">
//         <button 
//           onClick={() => setIsModalOpen(true)}
//           className="py-2 px-4 text-base cursor-pointer rounded-full border-none bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-colors"
//         >
//           <ImageIcon size={24} />
//         </button>

//         <div className="relative">
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="py-2 px-4 text-sm cursor-pointer rounded-md border-none bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-colors"
//           >
//             {selectedOption}
//           </button>
          
//           {isMenuOpen && (
//             <div className="absolute bottom-full mb-2 w-40 bg-black bg-opacity-75 text-white rounded-lg shadow-lg overflow-hidden">
//               <button
//                 onClick={() => handleOptionClick('Original')}
//                 className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
//               >
//                 Original
//               </button>
//               <button
//                 onClick={() => handleOptionClick('Center Glow')}
//                 className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
//               >
//                 Center Glow
//               </button>
//               <button
//                 onClick={() => handleOptionClick('Top')}
//                 className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
//               >
//                 Top
//               </button>
//               <button
//                 onClick={() => handleOptionClick('No Cover')}
//                 className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
//               >
//                 No Cover
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {isModalOpen && (
//         <div 
//           className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-75 z-50"
//           onClick={closeModal}
//         >
//           <div 
//             className="bg-black p-6 rounded-lg shadow-2xl max-w-4xl max-h-[80vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-center">
//               {images.map((img, index) => (
//                 <img
//                   key={index}
//                   src={img}
//                   alt={`Background option ${index + 1}`}
//                   onClick={() => handleImageClick(img)}
//                   className={`aspect-square object-cover cursor-pointer rounded-md border-4 transition-all duration-300
//                     ${backgroundImage === img ? 'border-blue-500 scale-105' : 'border-transparent hover:border-gray-300'}`}
//                 />
//               ))}
//             </div>
//             <button 
//               onClick={closeModal}
//               className="mt-4 py-2 px-4 text-sm cursor-pointer rounded-md border-none bg-red-500 text-white float-right hover:bg-red-600 transition-colors"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserBGselect;
















// import React, { useState } from 'react';
// import A1 from "./1.jpg";
// import A2 from "./2.jpg";
// import A3 from "./3.jpg";
// import A4 from "./4.jpg";
// import A5 from "./5.jpg";
// import A6 from "./6.jpg";
// import A7 from "./7.jpg";
// import A8 from "./8.jpg";
// import A9 from "./9.jpg";
// import A10 from "./10.jpg";
// import A11 from "./11.jpg";
// import A12 from "./12.jpg";
// import A13 from "./13.jpg";
// import A14 from "./14.jpg";
// import A15 from "./15.jpg";
// import A16 from "./16.jpg";
// import A17 from "./17.jpg";
// import A18 from "./18.jpg";
// import A19 from "./19.jpg";
// import A20 from "./20.jpg";
// import A21 from "./21.jpg";
// import A22 from "./22.jpg";
// import A23 from "./23.jpg";

// const images = [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14, A15, A16, A17, A18, A19, A20, A21, A22, A23];

// const UserBGselect = () => {
//   const [backgroundImage, setBackgroundImage] = useState(images[0]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleImageClick = (image) => {
//     setBackgroundImage(image);
//     setIsModalOpen(false);
//   };

//   return (
//     <div style={{
//       backgroundImage: `url(${backgroundImage})`,
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//       height: '100vh',
//       transition: 'background-image 0.5s ease',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       color: 'white',
//       textShadow: '2px 2px 4px #000000',
//       position: 'relative'
//     }}>
//       <button 
//         onClick={() => setIsModalOpen(true)}
//         style={{
//           padding: '10px 20px',
//           fontSize: '16px',
//           cursor: 'pointer',
//           borderRadius: '5px',
//           border: 'none',
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           color: 'white'
//         }}
//       >
//         Change Background
//       </button>

//       {isModalOpen && (
//         <div style={{
//           position: 'fixed',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           backgroundColor: 'rgba(255, 255, 255, 0.95)',
//           padding: '20px',
//           zIndex: 100,
//           width: '80vw',
//           maxWidth: '900px',
//           maxHeight: '80vh',
//           overflowY: 'auto',
//           borderRadius: '10px',
//           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
//         }}>
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
//             gap: '10px',
//             justifyContent: 'center'
//           }}>
//             {images.map((img, index) => (
//               <img
//                 key={index}
//                 src={img}
//                 alt={`Background option ${index + 1}`}
//                 onClick={() => handleImageClick(img)}
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   aspectRatio: '1 / 1',
//                   objectFit: 'cover',
//                   cursor: 'pointer',
//                   borderRadius: '5px',
//                   border: backgroundImage === img ? '3px solid dodgerblue' : '3px solid transparent',
//                   transition: 'border 0.3s ease'
//                 }}
//               />
//             ))}
//           </div>
//           <button 
//             onClick={() => setIsModalOpen(false)}
//             style={{
//               marginTop: '20px',
//               padding: '10px 20px',
//               fontSize: '14px',
//               cursor: 'pointer',
//               borderRadius: '5px',
//               border: 'none',
//               backgroundColor: '#dc3545',
//               color: 'white',
//               float: 'right'
//             }}
//           >
//             Close
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserBGselect;


















// import React, { useEffect, useState, useMemo } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import Toolbar from './Toolbar';
// import SlideSidebar from './SlideSidebar';
// import SlideCanvas from './SlideCanvas';
// import Preview from './Preview';
// import AddSlide from './AddSlide';

// function newId(prefix = 'id') {
//   return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
// }

// const LAYOUTS = {
//   title: () => ({
//     id: newId('s'),
//     layout: 'title',
//     blocks: [
//       { id: newId('b'), type: 'text', style: 'heading', content: 'Slide title' },
//       { id: newId('b'), type: 'text', style: 'paragraph', content: 'Subtitle or description' },
//     ],
//   }),
//   titleContent: () => ({
//     id: newId('s'),
//     layout: 'titleContent',
//     blocks: [
//       { id: newId('b'), type: 'text', style: 'heading', content: 'Section title' },
//       { id: newId('b'), type: 'text', style: 'paragraph', content: 'Body content here...' },
//     ],
//   }),
//   splitImageText: () => ({
//     id: newId('s'),
//     layout: 'splitImageText',
//     blocks: [
//       { id: newId('b'), type: 'image', src: '', alt: 'Placeholder' },
//       { id: newId('b'), type: 'text', style: 'paragraph', content: 'Describe the visual' },
//     ],
//   }),
//   video: () => ({
//     id: newId('s'),
//     layout: 'video',
//     blocks: [
//       { id: newId('b'), type: 'video', src: '', alt: 'Demo' },
//       { id: newId('b'), type: 'text', style: 'heading', content: 'Demo' },
//     ],
//   }),
// };

// export default function EditorPage() {
//   const { id } = useParams();
//   const [deck, setDeck] = useState(null);
//   const [slides, setSlides] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [showPreview, setShowPreview] = useState(false);
//   const [showAdd, setShowAdd] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/decks/${id}`);
//         setDeck(res.data);
//         setSlides(res.data.slides || []);
//         setCurrent(0);
//       } catch (err) {
//         alert('Failed to load deck. Returning to list.');
//         // navigate('/');
//       }
//     }
//     load();
//   }, [id, navigate]);

//   function updateCurrentSlide(newSlide) {
//     const newSlides = slides.map((s, i) => (i === current ? newSlide : s));
//     setSlides(newSlides);
//   }

//   async function handleSave() {
//     const payload = {
//       ...(deck || {}),
//       slides,
//     };
//     try {
//       await axios.put(`http://localhost:5000/api/decks/${id}`, payload);
//       alert('Deck saved successfully!');
//     } catch (err) {
//       alert('Failed to save deck.');
//     }
//   }

//   async function handleSaveAs() {
//     const newId = `deck-${Date.now()}`;
//     const payload = {
//       ...deck,
//       id: newId,
//       title: (deck?.title || 'Untitled') + ' (Copy)',
//       createdAt: new Date().toISOString(),
//       slides,
//     };
//     try {
//       await axios.post(`http://localhost:5000/api/decks`, payload);
//       navigate(`/editor/${newId}`);
//     } catch (err) {
//       alert('Failed to save a new copy.');
//     }
//   }

//   function handleAddSlide(layoutKey) {
//     const newSlide = LAYOUTS[layoutKey]();
//     setSlides([...slides, newSlide]);
//     setCurrent(slides.length);
//   }

//   function handleDeleteSlide() {
//     if (slides.length <= 1) return;
//     const newSlides = slides.filter((_, i) => i !== current);
//     setSlides(newSlides);
//     setCurrent(Math.max(0, current - 1));
//   }
 
//   const currentSlide = useMemo(() => slides[current] || null, [slides, current]);

//   function handlePrevSlide() {
//     setCurrent((c) => Math.max(0, c - 1));
//   }

//   function handleNextSlide() {
//     setCurrent((c) => Math.min(slides.length - 1, c + 1));
//   }

//   return (
//     <section className='bg-black text-white min-h-full'>
//     <div className="p-6 max-w-7xl mx-auto">
//       <Toolbar
//         onSave={handleSave}
//         onSaveAs={handleSaveAs}
//         onAddSlide={() => setShowAdd(true)}
//         onPreview={() => setShowPreview(true)}
//       />
//       <div className="grid grid-cols-4 mt-4 h-full gap-4">
//         <div className="col-span-1 h-screen max-h-[100vh] overflow-y-scroll">
//           <SlideSidebar
//             slides={slides}
//             setSlides={setSlides}
//             currentIndex={current}
//             setCurrentIndex={setCurrent}
//           />
//         </div>
//         <div className="col-span-3">
//           <SlideCanvas slide={currentSlide} onUpdate={updateCurrentSlide} />
//         </div>
//       </div>
//       <div className="mt-4 flex justify-end">
//         <button className="btn-ghost" onClick={handleDeleteSlide}>Delete Slide</button>
//       </div>
//       <Preview
//         open={showPreview}
//         slide={currentSlide}
//         onClose={() => setShowPreview(false)}
//         onPrev={handlePrevSlide}
//         onNext={handleNextSlide}
//       />
//       <AddSlide
//         open={showAdd}
//         onClose={() => setShowAdd(false)}
//         onAddSlide={handleAddSlide}
//       />
//     </div>
//     </section>
//   );
// }

 













      )}

    </>
  )
}

export default Flash