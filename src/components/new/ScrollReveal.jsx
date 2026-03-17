
// SCROLL REVEAL ANIMATION WRAPPER
const ScrollReveal = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.6 
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [inView, controls]);

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      scale: direction === 'zoom' ? 0.95 : 1,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration, delay, ease: 'easeOut' },
    },
  };

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={variants}>
      {children}
    </motion.div>
  );
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

    // Initialize AOS on component mount
useEffect(() => {
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-in-out',
  });
  return () => {
    AOS.refresh();
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
                   <ScrollReveal animation="fade-up" duration={800}>
                <h2  
                    contentEditable 
                    suppressContentEditableWarning 
                    className={`xl:text-7xl max-w-5xl lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-[inter] font-semibold`}
                >
                    Vertx: Pioneering Deeptech Innovation
                </h2>
                </ScrollReveal>
                </div>
                <div ref={subtitleRef} >
                    <ScrollReveal animation="fade-up" duration={1000} delay={100}>
                <h2 
                    contentEditable 
                    suppressContentEditableWarning 
                    className={`xl:text-xl max-w-5xl lg:text-[19px] md:text-lg sm:text-base text-sm  mt-10 font-[inter]`}
                >
                    Transforming The Future Through Breakthrough Technology
                </h2>
                </ScrollReveal>
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

const TheChallangePage = ({ theme = 'dark', background = 'original' }) => {
  const editorRef = useRef(null);
  const currentTheme = themes[theme] || themes.dark;
  const currentBG = backgrounds[background] || backgrounds.original;

  // ✅ Initialize AOS First (Separate useEffect)
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: 'ease-in-out',
    });

    return () => {
      AOS.refresh();
    };
  }, []);

  // ✅ Initialize Froala Editor (Separate useEffect)
  useEffect(() => {
    // Load Froala CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
    document.head.appendChild(link);

    // Load Froala JS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';
    script.async = true;

    const initializeEditor = () => {
      if (editorRef.current && window.FroalaEditor) {
        try {
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
        } catch (error) {
          console.error('Froala Editor initialization error:', error);
        }
      }
    };

    script.onload = () => {
      setTimeout(initializeEditor, 100);
    };

    script.onerror = () => {
      console.error('Failed to load Froala Editor script');
    };

    document.body.appendChild(script);

    // ✅ Cleanup
    return () => {
      try {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        if (editorRef.current?.editor) {
          editorRef.current.editor.destroy();
        }
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    };
  }, []);

  // ✅ Return JSX with ScrollReveal wrappers
  return (
    <div className={`p-10 font-[inter] min-h-screen max-h-screen overflow-hidden ${currentTheme.bg} ${currentBG.text}`}>
      {/* Main card with fade-up animation */}
      <ScrollReveal animation="fade-up" duration={800}>
        <div className={`max-w-5xl shadow-2xl rounded-md ${currentBG.card} p-5 mx-auto flex flex-col justify-center text-center items-center`}>
          
          {/* Inner border with zoom-in animation */}
          <ScrollReveal animation="zoom-in" duration={1000} delay={100}>
            <div className='border-[2.5px] w-full min-h-[150px] p-5 border-gray-500'>
              
              {/* Editor content with fade-up animation */}
              <ScrollReveal animation="fade-up" duration={1000} delay={200}>
                <div
                  ref={editorRef}
                  className="prose max-w-xl mx-auto focus:outline-none"
                >
                  <h1 className="text-4xl font-semibold my-15">
                    The Challenge
                  </h1>
                  <h2 className="text-lg font-medium">
                    Welcome to the Editable Page. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat beatae magni perspiciatis ex earum consequatur, commodi a laudantium incidunt ad.
                  </h2>
                  <p className="text-base">
                    Feel free to experiment with the different editing options.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </div>
      </ScrollReveal>
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
             <ScrollReveal animation="fade-up" duration={1000} delay={100}> 
            <h1 className="text-4xl font-semibold my-8">
              Our solution
            </h1>
            <h2 className='mb-4'>
              Vertx delivers breakthrough technology that bridges innovation gaps, reducing implementation time by 80%.
            </h2>
            </ScrollReveal>
            {/* The Canvas environment cannot access local files. Please use a public URL for your image. */}
            <img src={B1} alt="Two people silhouetted against a colorful background" className='my-8 w-full rounded-md' />
          </div>
        </div>
      </div>
    </div>
  );
};
