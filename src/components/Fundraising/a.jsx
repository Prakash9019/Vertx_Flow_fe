<div className="min-h-screen bg-black text-white flex flex-col p-4 sm:p-8 space-y-4 sm:space-y-8">
            <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mb-4 sm:mb-8 space-y-4 sm:space-y-0">

                <div className='flex flex-col sm:flex-row gap-2 sm:gap-1 w-full sm:w-auto'>
                    {!collapsed &&
                        (
                            <>
                                {/* Buttons for New, History, EXIT, and BiDockRight */}
                                {/* flex-wrap ensures buttons don't overflow on very small 'sm' screens */}
                                <div className='flex flex-wrap bg-[#232323AB] p-2 rounded-md items-center justify-between w-full sm:w-auto'>
                                    <div className="flex font-[inter] w-full sm:w-auto">
                                        {/* flex-1 makes buttons take equal width on small screens */}
                                        <button className="flex-1 sm:flex-none px-2 sm:px-4 font-medium py-2 text-sm text-white rounded-md hover:bg-gray-700">New</button>
                                        <button className="flex-1 sm:flex-none px-2 sm:px-4 font-medium py-2 text-sm text-white rounded-md border-l border-gray-700 hover:bg-gray-700">History</button>
                                        <button className="flex-1 sm:flex-none px-2 sm:px-4 py-2 text-sm bg-[#A55EEB] rounded-md text-black font-bold border-l border-gray-700 hover:bg-[#B393DF]">EXIT</button>
                                        <button className="flex-1 sm:flex-none px-2 sm:px-4 font-medium py-2 text-xl text-white border-l border-gray-700 rounded-md hover:bg-gray-700">
                                            <BiDockRight />
                                        </button>
                                    </div>
                                </div>
                                {/* Back button when menu is not collapsed */}
                                <button onClick={handleCollapsed} className="flex items-center justify-center sm:justify-start space-x-2 font-medium font-[inter] px-4 py-2 text-sm bg-[#232323AB] text-white rounded-md w-full sm:w-auto">
                                    <ArrowLeft />
                                    <span>Back</span>
                                </button>
                            </>
                        )
                    }
                    {/* Collapsed state buttons */}
                    {collapsed && (
                        <div className='flex gap-2 font-medium font-[inter] w-full sm:w-auto'>
                            <button className="flex-1 sm:flex-none px-4 py-2 text-xl bg-[#232323AB] text-white rounded-md">
                                <BiDockRight className='' />
                            </button>
                            <button onClick={handleNCollapsed} className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 text-sm bg-[#232323AB] text-white rounded-md flex-1 sm:flex-none">
                                <ArrowLeft />
                                <span>Back</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Center Section: "FLASH BY VERTX" logo and text */}
                {/* Always centered horizontally, takes full width on sm to ensure centering */}
                <div style={{ fontFamily: "'Crimson Text', serif" }} className="flex items-center justify-center w-full sm:w-auto">
                    <span className="text-gray-400 text-sm sm:text-base">FLASH BY</span>
                    <img className='w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2' src={logo} alt="Vertx logo" />
                    <span className="text-white font-bold ml-0.5 sm:ml-1 text-sm sm:text-base">VERTX</span>
                </div>

                {/* Right Section: Placeholder div */}
                {/* Hidden on sm, md, and only block on lg and xl */}
                <div className='hidden lg:block lg:min-w-90'></div>
            </div>

            {/* "Create a new deck" section */}
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-4 mb-4 sm:mb-8">
                <h1 className="text-2xl sm:text-[32px] font-[inter] font-semibold">Create a new deck</h1>
                <p className="text-[#D9D9D9AD]/68 font-[inter] font-medium text-sm sm:text-base px-2">Describe your startup in a short description to create your pitch deck.</p>
            </div>

            {/* Input field and "Pre-Seed/Series A" buttons */}
            <div className="flex flex-col items-center space-y-4 mb-4 sm:mb-8 w-full max-w-xl lg:max-w-2xl mx-auto px-2">
                <input
                    type="text"
                    placeholder="What would you like to create today?"
                    className="w-full h-16 sm:h-20 p-4 font-[inter] font-medium text-sm sm:text-[15px] bg-[#232323]/67 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
                {/* Buttons wrap on smaller screens and align to center */}
                <div className="flex flex-wrap gap-2 sm:space-x-4 justify-center sm:justify-start w-full">
                    <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-medium font-[inter] bg-[#101010] text-white rounded-md whitespace-nowrap">Pre-Seed Pitch Deck</button>
                    <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#101010] text-xs font-medium font-[inter] text-white rounded-md whitespace-nowrap">Series A Pitch Deck</button>
                </div>
            </div>

            {/* "Try these..." section with image cards */}
            <div className="flex flex-col items-start space-y-4 w-full max-w-xl lg:max-w-2xl mx-auto px-2">
                <p className="text-gray-400 text-sm font-medium font-[inter]">Try these...</p>
                {/* Image cards stack on small screens and align to center */}
                <div className="flex flex-col sm:flex-row gap-4 sm:space-x-8 w-full justify-center sm:justify-start">
                    <div className="flex flex-col items-center space-y-2 w-full sm:w-auto">
                        {/* Image container takes full width on small screens */}
                        <div className="w-full sm:w-80 h-32 sm:h-40 rounded-md overflow-hidden">
                            <img src={U1} alt="Create from Scratch" className="object-cover brightness-50 w-full h-full" />
                        </div>
                        <p className='text-xs font-medium font-[inter]'>Create from Scratch</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2 w-full sm:w-auto">
                        {/* Image container takes full width on small screens */}
                        <div className="w-full sm:w-80 h-32 sm:h-40 rounded-md overflow-hidden">
                            <img src={U2} alt="Checkout Templates" className="object-cover brightness-50 w-full h-full" />
                        </div>
                        <p className='text-xs font-medium font-[inter]'>Checkout Templates</p>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Select dropdowns and Continue button */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 w-full max-w-xl lg:max-w-2xl mx-auto p-3 sm:p-4 bg-[#232323]/67 rounded-md space-y-3 sm:space-y-0">
                {/* Select dropdowns stack on small screens */}
                <div className="flex flex-col sm:flex-row gap-2 sm:space-x-4 w-full sm:w-auto">
                    <select className="bg-[#232323]/67 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md focus:outline-none text-xs sm:text-sm w-full">
                        <option className='text-xs font-medium font-[inter]'>No. of Slides</option>
                    </select>
                    <select className="bg-[#232323]/67 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md focus:outline-none text-xs sm:text-sm w-full">
                        <option className='text-xs font-medium font-[inter]'>Content Style</option>
                    </select>
                </div>
                {/* Continue button takes full width on small screens */}
                <button className="px-5 py-1.5 sm:px-6 sm:py-2 text-sm font-medium font-[inter] bg-white text-black rounded-md w-full sm:w-auto">Continue</button>
            </div>
        </div>