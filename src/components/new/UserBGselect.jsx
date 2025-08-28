import React, { useState } from 'react';
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
import { ImageIcon } from 'lucide-react';

const images = [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14, A15, A16, A17, A18, A19, A20, A21, A22, A23];

// const images = [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14, A15, A16, A17];

const UserBGselect = () => {
  const [backgroundImage, setBackgroundImage] = useState(images[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textPosition, setTextPosition] = useState('center');
  const [glowEffect, setGlowEffect] = useState(false);
  const [isNoCover, setIsNoCover] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(['Original']);

  const handleImageClick = (image) => {
    setBackgroundImage(image);
    setIsModalOpen(false);
    setIsNoCover(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const handleOptionClick = (option) => {
    setSelectedOptions(prevSelected => {
      if (prevSelected.includes(option)) {
        const newSelected = prevSelected.filter(item => item !== option);
        return newSelected.length > 0 ? newSelected : ['Original'];
      } else {
        // prevSelected.length < 1 change number for multiple select
        if (prevSelected.length < 1) {
          return [...prevSelected, option];
        }
        return [...prevSelected.slice(1), option];
      }
    });

    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];

    let newTextPosition = 'center';
    let newGlowEffect = false;
    let newIsNoCover = false;

    if (newSelectedOptions.includes('Top')) {
      newTextPosition = 'top-left';
    } else {
      newTextPosition = 'center';
    }

    if (newSelectedOptions.includes('Center Glow')) {
      newGlowEffect = true;
    } else {
      newGlowEffect = false;
    }

    if (newSelectedOptions.includes('No Cover')) {
      newIsNoCover = true;
    } else {
      newIsNoCover = false;
    }

    setTextPosition(newTextPosition);
    setGlowEffect(newGlowEffect);
    setIsNoCover(newIsNoCover);
    setIsMenuOpen(false);
  };

  React.useEffect(() => {
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

  return (
    <div
      className={`h-screen w-screen bg-center transition-all duration-500 relative ${isNoCover ? 'bg-black' : 'bg-cover'}`}
      style={{ backgroundImage: isNoCover ? 'none' : `url(${backgroundImage})` }}
    >
      <div 
        className={`text-white text-center p-4 transition-all duration-500 relative
          ${textPosition === 'top-left' ? 'absolute top-10 left-10' : 'flex flex-col justify-center items-center h-full w-full'}`}
      >
        <h2 className={`text-5xl font-inter font-bold`}>
          Vertx: Pioneering Deeptech Innovation
        </h2>
        {glowEffect && (
          <div className="w-full absolute bottom-0 left-0 glowing-text-bottom"></div>
        )}
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-4">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="py-2 px-4 text-base cursor-pointer rounded-full border-none bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-colors"
        >
          <ImageIcon size={24} />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="py-2 px-4 text-sm cursor-pointer rounded-md border-none bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-colors"
          >
            {selectedOptions.join(' & ')}
          </button>
          
          {isMenuOpen && (
            <div className="absolute bottom-full mb-2 w-40 bg-black bg-opacity-75 text-white rounded-lg shadow-lg overflow-hidden">
              {['Original', 'Center Glow', 'Top', 'No Cover'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                    selectedOptions.includes(option) ? 'bg-gray-600' : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4  bg-opacity-75 z-50"
          onClick={closeModal}
        >
          <div 
            className="bg-black p-6 rounded-lg shadow-2xl max-w-4xl max-h-[80vh] overflow-y-auto"
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
    </div>
  );
};

export default UserBGselect;














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