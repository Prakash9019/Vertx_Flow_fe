<div className="min-h-screen bg-black text-white">
      {isCallActive && (        <CallingPage
          investor={callingInvestor}
          onEndCall={handleEndCall}
          onJoinCall={handleJoinCall}
          showFullInterface={showFullCallInterface}
          profileData={profileData}
        />
      )}

      <div
        className="pl-[1.88rem] pr-[1.88rem] pt-[2.75rem] flex gap-6 relative"
      >
        <div
        className={`transition-width duration-500 ease-in-out overflow-y-auto h-screen ${
          selectedInvestor ? "w-[37%]" : "w-full"
        }`}
      >
          <div className="relative mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search investors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-16 py-4 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500 h-[3.25rem] rounded-md bg-[#0F0E16] text-[#B8B8B8] font-['Inter'] text-sm font-normal border-none"
              />
              <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            </div>
          </div>

          <div className="mb-8">
            <p
              className="text-white font-['Inter'] text-sm font-medium"
            >
              Meet the most capable AI investors. Choose an AI persona to deliver your first pitch and get instant
              feedback.
            </p>
          </div>

          <div className="space-y-6">
            {investors.map((investor) => (
              <div
                key={investor.id}
                onClick={() => handleInvestorClick(investor)}
                className={`flex items-${selectedInvestor ? "start" : "center"} justify-between p-6 cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] w-full h-[11.25rem] rounded-[0.3125rem] bg-[#0F0E16]`}
              >
                {!selectedInvestor ? (
                  <>
                    <div className="flex items-center gap-6">
                      <div
                        className="bg-gray-600 overflow-hidden flex items-center justify-center w-[9.375rem] h-[9.375rem] rounded-[0.3125rem]"
                      >
                        <img
                          src={investor.image || "/placeholder.svg"}
                          alt={investor.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none"
                            e.target.nextSibling.style.display = "flex"
                          }}
                        />
                        <div
                          className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400 text-4xl font-bold hidden"
                        >
                          {investor.name.charAt(0)}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3
                          className="mb-2 text-white font-['Inter'] text-2xl font-medium"
                        >
                          {investor.name}
                        </h3>
                        <div className="mb-4">
                          <span
                          className="text-[#656565] font-['Inter'] text-lg font-normal"
                        >
                            {investor.role}{" "}
                          </span>
                          <span
                          className="text-white font-['Inter'] text-lg font-medium"
                        >
                            {investor.company}
                          </span>
                        </div>

                        <div className="flex gap-2 items-center flex-wrap">
                          {investor.tags.map((tag, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1"
                              style={{
                                width: tag.type === "purple" ? "7rem" : "2.5rem",
                                height: "1.0625rem",
                                borderRadius: tag.type === "purple" ? "0.5rem" : "0.625rem",
                                background: tag.type === "purple" ? "#AD6FDE" : "#621D04",
                                padding: "0 0.5rem",
                                justifyContent: "center",
                              }}
                            >
                              {tag.type === "purple" && <Phone style={{ width: "0.625rem", height: "0.625rem" }} />}
                              <span
                              className="text-white font-['Inter'] text-[0.5rem] font-medium"
                            >
                                {tag.text}
                              </span>
                            </div>
                          ))}

                          <div
                          className="flex items-center gap-1 w-10 h-[1.0625rem] rounded-xl bg-gradient-to-b from-[#CC9C00] to-[#5D4100] px-2 justify-center"
                        >
                            <Star className="w-[0.625rem] h-[0.625rem]" />
                            <span
                            className="text-white font-['Inter'] text-[0.5rem] font-medium"
                          >
                              {investor.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        className="hover:opacity-80 transition-all duration-300 transform hover:scale-105 w-[15rem] h-[1.95rem] rounded-[0.1875rem] border border-white/[0.04] bg-white/[0.08] text-[#D9D9D9] font-['Inter'] text-[0.625rem] font-medium"
                      >
                       View Profile
                      </button>
                      <button
                        className="hover:opacity-80 transition-all duration-300 transform hover:scale-105 w-[15rem] h-[1.95rem] rounded-[0.1875rem] border border-white/[0.04] bg-white/[0.08] text-[#D9D9D9] font-['Inter'] text-[0.625rem] font-medium"
                      >
                        Save Profile
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCallInvestor(investor)
                        }}
                        className="flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 transform hover:scale-105 w-[15rem] h-[1.95rem] rounded-[0.125rem] bg-white text-black font-['Inter'] text-[0.625rem] font-medium border-none"
                      >
                        <Phone style={{ width: "0.9rem", height: "0.9rem" }} />
                        Call Investor
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-6 w-full">
                    <div
                      className="bg-gray-600 overflow-hidden flex items-center justify-center w-[9.375rem] h-[9.375rem] rounded-[0.3125rem]"
                    >
                      <img
                        src={investor.image || "/placeholder.svg"}
                        alt={investor.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none"
                          e.target.nextSibling.style.display = "flex"
                        }}
                      />
                      <div
                        className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400 text-4xl font-bold hidden"
                      >
                        {investor.name.charAt(0)}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div>
                        <h3 className="text-white font-['Inter'] text-base font-medium mb-0">
                          {investor.name}
                        </h3>

                        <div className="mb-2">
                          <span
                            className="text-[#656565] font-['Inter'] text-[0.625rem] font-normal"
                          >
                            {investor.role}{" "}
                          </span>
                          <span
                            className="text-white font-['Inter'] text-[0.625rem] font-medium"
                          >
                            {investor.company}
                          </span>
                        </div>

                        <div className="flex gap-2 items-center mb-2">
                          {investor.tags.map((tag, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1"
                              style={{
                                width: tag.type === "purple" ? "7rem" : "2.5rem",
                                height: "1.0625rem",
                                borderRadius: tag.type === "purple" ? "0.5rem" : "0.625rem",
                                background: tag.type === "purple" ? "#AD6FDE" : "#621D04",
                                padding: "0 0.5rem",
                                justifyContent: "center",
                              }}
                            >
                              {tag.type === "purple" && <Phone style={{ width: "0.625rem", height: "0.625rem" }} />}
                              <span className="text-white font-['Inter'] text-[0.5rem] font-medium">
                                {tag.text}
                              </span>
                            </div>
                          ))}

                          <div
                            className="flex items-center gap-1 w-10 h-[1.0625rem] rounded-xl bg-gradient-to-b from-[#CC9C00] to-[#5D4100] px-2 justify-center"
                          >
                            <Star className="w-[0.625rem] h-[0.625rem]" />
                            <span className="text-white font-['Inter'] text-[0.5rem] font-medium">
                              {investor.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          <button
                            className="hover:opacity-80 transition-all duration-300 transform hover:scale-105 w-[6.125rem] h-[1.625rem] rounded-[0.1875rem] border border-white/[0.04] bg-white/[0.08] text-[#D9D9D9] font-['Inter'] text-[0.5rem] font-medium"
                          >
                            View Profile
                          </button>
                          <button
                            className="hover:opacity-80 transition-all duration-300 transform hover:scale-105 w-[6.125rem] h-[1.625rem] rounded-[0.1875rem] border border-white/[0.04] bg-white/[0.08] text-[#D9D9D9] font-['Inter'] text-[0.5rem] font-medium"
                          >
                            Save Profile
                          </button>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCallInvestor(investor)
                          }}
                          className="flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 transform hover:scale-105 w-[12.5rem] h-[1.625rem] rounded-[0.125rem] bg-white text-black font-['Inter'] text-[0.5rem] font-medium border-none"
                        >
                          <Phone style={{ width: "0.9rem", height: "0.9rem" }} />
                          Call Investor
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedInvestor && (
          <div
            className="w-[59%] p-6 px-8 bg-[#0F0E16] rounded-[0.3125rem] transition duration-500 ease-in-out fixed top-[2.75rem] right-[1.88rem] h-screen overflow-y-auto translate-x-0 opacity-100"
          >
            <div className="flex gap-6 mb-8 mt-15">
              <div
                className="bg-gray-600 overflow-hidden flex items-center justify-center w-[15.625rem] h-[15.625rem] rounded-[0.3125rem]"
              >
                <img
                  src={selectedInvestor.image || "/placeholder.svg"}
                  alt={selectedInvestor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none"
                    e.target.nextSibling.style.display = "flex"
                  }}
                />
                <div
                  className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400 font-bold hidden text-[4rem]"
                >
                  {selectedInvestor.name.charAt(0)}
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <h3 className="text-white font-['Inter'] text-2xl font-semibold mb-2">
                  {selectedInvestor.name}
                </h3>

                <div className="mb-1">
                <span
                  className="text-[#656565] font-['Inter'] text-sm font-normal"
                >
                    Venture Capitalist
                  </span>
                </div>
                <div className="mb-4">
                  <span
                    className="text-white font-['Inter'] text-sm font-medium"
                  >
                    {selectedInvestor.company}
                  </span>
                </div>

                <div className="flex gap-2 mb-4 justify-center">
                  {selectedInvestor.tags.map((tag, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-1 h-[1.0625rem] px-2 justify-center ${
                        tag.type === "purple" ? "rounded-lg bg-[#AD6FDE]" : "rounded-xl bg-[#621D04]"
                      }`}
                    >
                      {tag.type === "purple" && (
                        <img
                          src={CallIcon || "/placeholder.svg"}
                          alt="Call"
                          className="w-[0.625rem] h-[0.625rem]"
                        />
                      )}
                      <span
                      className="text-white font-['Inter'] text-[0.5rem] font-medium"
                    >
                        {tag.text}
                      </span>
                    </div>
                  ))}

                  <div
                    className="flex items-center gap-1 h-[1.0625rem] rounded-xl bg-gradient-to-b from-[#CC9C00] to-[#5D4100] px-2 justify-center"
                  >
                    <img
                      src={StarIcon || "/placeholder.svg"}
                      alt="Star"
                      className="w-[0.625rem] h-[0.625rem]"
                    />
                    <span
                      className="text-white font-['Inter'] text-[0.5rem] font-medium"
                    >
                      {selectedInvestor.rating}
                    </span>
                  </div>
                </div>

                <div className="mb-4 flex flex-col items-center w-[75%] px-4">
                  <div
                    className="flex items-center gap-2 mb-2 w-full max-w-[16rem] relative"
                  >
                    <div className="flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300">
                      <img
                      src={PlayIcon || "/placeholder.svg"}
                      alt="Play"
                      className="w-5 h-5"
                    />
                    </div>

                    <div
                    className="flex-1 h-1 bg-gray-700 rounded-[0.125rem] relative overflow-hidden"
                  >
                      <div   className="w-[40%] h-full bg-white rounded-[0.125rem] absolute top-0 left-0"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCallInvestor(selectedInvestor)
                  }}
                  className="flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 transform hover:scale-105 w-[12.5rem] h-9 rounded-[0.125rem] bg-white text-black font-['Inter'] text-sm font-medium border-none"
                >
                  <img
                    src={CallIcon2 || "/placeholder.svg"}
                    alt="Call"
                    className="w-[0.875rem] h-[0.875rem]"
                  />
                  Call Investor
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h4
                className="mb-3 text-white font-['Inter'] text-xl font-semibold"
              >
                Objective
              </h4>
              <p
                className="text-white font-['Inter'] text-sm font-normal leading-relaxed"
              >
                {selectedInvestor.description}
              </p>
            </div>

            <div className="mb-6">
              <h4
                className="mb-3 text-white font-['Inter'] text-xl font-semibold"
              >
                Instruction
              </h4>
              <p
                className="text-white font-['Inter'] text-sm font-normal leading-relaxed"
              >
                {selectedInvestor.instruction}
              </p>
            </div>
          </div>
        )}
      </div>

      <div
        className="fixed bottom-2 left-0 w-full flex items-center justify-center h-[4.375rem] bg-black/[0.90]"
      >
        <div
        className="flex items-center w-[20.75rem] h-[3.125rem] rounded-lg bg-white/[0.94] px-4 gap-4"
      >
          <button
            className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-110 w-[2.375rem] h-[2.375rem] rounded-md bg-black"
          >
            <img
            src={logo || "/placeholder.svg"}
            alt="logo"
            className="w-[1.2rem] h-[1.2rem]"
          />
          </button>

          <div
            className="w-[0.0625rem] h-[3.125rem] bg-[#B8B8B8]/[0.40]"
          />
          <button
            className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-110 w-10 h-9 rounded-md bg-[#AD6FDE]"
          >
            <img
              src={ContactsIcon || "/placeholder.svg"}
              alt="Contacts"
              className="w-[1.2rem] h-[1.2rem]"
            />
          </button>

          <button className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-110 text-gray-600">
            <img
            src={AddIcon || "/placeholder.svg"}
            alt="Add"
            className="w-6 h-6 invert"
          />
          </button>

          <button className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-110 text-gray-600">
          <img
            src={SpeedometerIcon || "/placeholder.svg"}
            alt="Speedometer"
            className="w-6 h-6"
          />
        </button>

          <button className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-110 text-gray-600">
            <img src={TuneIcon || "/placeholder.svg"} alt="Tune" className="w-6 h-6" />
          </button>

          <div
          className="w-[0.0625rem] h-[3.125rem] bg-[#B8B8B8]/[0.40]"
        />
          <button
            onClick={onBack}
            className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-105 text-xs font-medium w-10 h-[1.875rem] rounded-[0.1875rem] bg-[#33005C] text-[#AD6FDE]"
          >
            EXIT
          </button>
        </div>
      </div>
    </div>