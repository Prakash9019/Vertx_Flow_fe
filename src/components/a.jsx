

function MockPitching({ onBack, loading  }) {
  const { profileData } = useStartupProfile()
  const socketRef = useRef(null);
  const [investors, setInvestors] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInvestor, setSelectedInvestor] = useState(null)
  const [isCallActive, setIsCallActive] = useState(false)
  const [callingInvestor, setCallingInvestor] = useState(null)
  const [showFullCallInterface, setShowFullCallInterface] = useState(false)
  const [isInVideoCall, setIsInVideoCall] = useState(false)
  const [showCallEndedScreen, setShowCallEndedScreen] = useState(false)
  const [showReportPage, setShowReportPage] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [analysis, setAnalysis] = useState(null);

  // const [isListening, setIsListening] = useState(false)


  //   useEffect(() => {
  //   return () => {
  //     setIsListening(false)
  //     setTranscript('')
  //     setIsLoading(false)

  //     if (recognition) recognition.stop()
  //     if (currentAudio) {
  //       currentAudio.pause()
  //       currentAudio.currentTime = 0
  //     }
  //     if (window.audioStream) {
  //       window.audioStream.getTracks().forEach(track => track.stop())
  //       window.audioStream = null
  //     }
  //     if (sessionId) {
  //       fetch(`https://ai-mock-pitching-427457295403.europe-west1.run.app/api/pitch/end/${sessionId}`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ reason: 'user_ended' })
  //       }).catch(console.error)
  //     }
  //     if (socketRef.current) socketRef.current.disconnect()
  //   }
  // }, [])


  useEffect(() => {
    fetch("https://ai-mock-pitching-427457295403.europe-west1.run.app/api/personas")
      .then((res) => res.json())
      .then((data) => {
        if (data.success === true && data.personas) {
          const formatted = Object.entries(data.personas).map(([key, persona], index) => ({
            id: index + 1,
            name: persona.name || "Unknown",
            role: persona.title || "Investor",
            company: "", // Not in API, leave empty or customize
            image: "/api/placeholder/150/150",
            tags: [
              { text: persona.personality?.split(",")[0] || "Investor", type: "purple" },
              { text: key, type: "brown" },
            ],
            rating: "4/5",
            description: persona.personality || "No description available",
            instruction: persona.approach || "No instruction available",
          }))
          setInvestors(formatted)
        } else {
          console.error("Unexpected API structure:", data)
        }
      })
      .catch((err) => {
        console.error("Failed to fetch investors:", err)
      })
  }, [])


  const handleInvestorClick = (investor) => {
    setSelectedInvestor(investor)
  }

  const handleCallInvestor = (investor) => {
    setCallingInvestor(investor)
    setIsCallActive(true)
    setShowFullCallInterface(false)

    setTimeout(() => {
      setShowFullCallInterface(true)
    }, 3000)
  }

  const handleJoinCall = async () => {
    try {
      console.log('Requesting microphone and camera permission...')
      // Request both audio and video permissions
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      console.log('Microphone and camera permission granted')
      // Keep the stream active for better audio/video performance
      window.audioStream = stream

      setIsTransitioning(true)

      // Start transition after a brief delay
      setTimeout(() => {
        setIsInVideoCall(true)
        setIsCallActive(false)
        setShowFullCallInterface(false)

        // Complete transition
        setTimeout(() => {
          setIsTransitioning(false)
        }, 100)
      }, 300)
    } catch (error) {
      console.error('Error requesting media permissions:', error)
      alert('Please allow microphone and camera access to join the call')
    }
  }

  // const handleEndCall = () => {
  //   setIsListening(false)
  //   if (recognition) {
  //     try {
  //       recognition.stop()
  //     } catch (e) {}
  //   }

  //   // Stop any playing audio
  //   if (currentAudio) {
  //     currentAudio.pause()
  //     currentAudio.currentTime = 0
  //   }

  //   // Stop audio stream if it exists
  //   if (window.audioStream) {
  //     window.audioStream.getTracks().forEach(track => track.stop())
  //     window.audioStream = null
  //   }

  //   // End the pitch session via API if we have a session ID
  //   if (sessionId) {
  //     console.log('Ending session with ID:', sessionId)
  //     fetch(`https://ai-mock-pitching-427457295403.europe-west1.run.app/api/pitch/end/${sessionId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ reason: 'user_ended' })
  //     })
  //     .catch(err => console.error('Error ending session:', err))

  //     // Also disconnect socket
  //     if (socketRef.current) {
  //       socketRef.current.disconnect()
  //     }
  //   }

  //   // Clear transcript
  //   setTranscript('')
  //   setIsListening(false)
  //   setIsLoading(false)

  //   // Update UI state
  //   setIsCallActive(false)
  //   setCallingInvestor(null)
  //   setShowFullCallInterface(false)
  //   setIsInVideoCall(false)
  //   setShowCallEndedScreen(true)
  //   setIsTransitioning(false)
  // }

  //   const handleEndCall = () => {
  //   setIsCallActive(false)
  //   setCallingInvestor(null)
  //   setShowFullCallInterface(false)
  //   setIsInVideoCall(false)
  //   setShowCallEndedScreen(true)
  //   setIsTransitioning(false)
  // }
  // const handleEndCall = async () => {
  //   try {
  //     if (window.audioStream) {
  //       window.audioStream.getTracks().forEach(track => track.stop());
  //       window.audioStream = null;
  //     }

  //     if (sessionId) {
  //       console.log('Ending session with ID:', sessionId)
  //       const response = await fetch(`https://ai-mock-pitching-427457295403.europe-west1.run.app/api/pitch/end/${sessionId}`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({ reason: 'user_ended' })
  //       });

  //       if (!response.ok) {
  //         throw new Error(`Failed to end session. Status: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       console.log("Session ended. Analysis received:", data.analysis || data);
  //       setAnalysis(data.analysis || data);

  //       // Optionally store the analysis here for report view
  //       // setAnalysis(data.analysis); if you track it somewhere
  //     }
  //   } catch (error) {
  //     console.error("Error while ending session:", error);
  //   } finally {
  //     // Reset UI state regardless of success/failure
  //     setIsCallActive(false);
  //     setCallingInvestor(null);
  //     setShowFullCallInterface(false);
  //     setIsInVideoCall(false);
  //     setShowCallEndedScreen(true);
  //     setIsTransitioning(false);
  //   }
  // };
  // const handleEndCall = async () => {
  //   try {
  //     console.log('🛑 Ending session with ID:', sessionId);

  //     if (window.audioStream) {
  //       window.audioStream.getTracks().forEach(track => track.stop());
  //       window.audioStream = null;
  //     }

  //     if (sessionId) {
  //       const res = await fetch(`https://ai-mock-pitching-427457295403.europe-west1.run.app/api/pitch/end/${sessionId}`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ reason: 'user_ended' })
  //       });

  //       if (!res.ok) {
  //         throw new Error(`Failed to end session. Status: ${res.status}`);
  //       }

  //       const result = await res.json();
  //       console.log('📊 Session ended. Analysis received:', result.analysis || result);

  //       // Optional: setAnalysis(result.analysis);
  //     }
  //   } catch (error) {
  //     console.error('❌ Error while ending session:', error);
  //   } finally {
  //     setIsCallActive(false);
  //     setCallingInvestor(null);
  //     setShowFullCallInterface(false);
  //     setIsInVideoCall(false);
  //     setShowCallEndedScreen(true);
  //     setIsTransitioning(false);
  //   }
  // };
  const handleEndCall = async () => {
    try {
      console.log("🛑 Ending session with ID:", sessionId);
      if (!sessionId) return;

      // Stop audio
      if (window.audioStream) {
        window.audioStream.getTracks().forEach((track) => track.stop());
        window.audioStream = null;
      }

      // Call API to end session
      const res = await fetch(`https://ai-mock-pitching-427457295403.europe-west1.run.app/api/pitch/end/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'user_ended' }),
      });

      if (!res.ok) throw new Error(`Failed to end session. Status: ${res.status}`);
      const result = await res.json();
      console.log("✅ Session ended:", result);
      if(result.analysis){
        console.log("📊 Analysis data:", result.analysis);
        setAnalysis(result.analysis || result); 
        // Optional: show analysis or report
        setShowReportPage(true);

      }

    } catch (err) {
      console.error("❌ Error while ending session:", err);
    } finally {
      // Cleanup UI state
      if (socketRef.current) socketRef.current.disconnect();
      // stopSpeechRecognition();
      setIsCallActive(false);
      setCallingInvestor(null);
      setShowFullCallInterface(false);
      setIsInVideoCall(false);
      setShowCallEndedScreen(true);
    }
  };



  // Stop speech recognition

  const handleReturnHome = () => {
    setShowCallEndedScreen(false)
    onBack()
  }

  const handleViewReport = () => {
    setShowCallEndedScreen(false)
    setShowReportPage(true)
  }

  // Show report page if triggered
  if (showReportPage && analysis) {
    return <CallReportPage investor={callingInvestor} onBack={onBack} analysis={analysis} />
  }

  // Show call ended screen
  if (showCallEndedScreen) {
    return <CallEndedScreen onReturnHome={handleReturnHome} onViewReport={handleViewReport} />
  }
  // Show video call interface when in video call
  if (isInVideoCall) {
    return <VideoCallInterface
      investor={callingInvestor}
      onEndCall={handleEndCall}
      isTransitioning={isTransitioning}
      sessionId={sessionId}
      setSessionId={setSessionId}
      profileData={profileData}
    />
  }

  if (loading) {
  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-sm text-white">Loading AI investors</p>
      </div>
    </div>

  );
}


  return (
    <div className="min-h-screen bg-black text-white font-['Inter']">
      {isCallActive && (
        <CallingPage
          investor={callingInvestor}
          onEndCall={handleEndCall}
          onJoinCall={handleJoinCall}
          showFullInterface={showFullCallInterface}
          profileData={profileData}
        />
      )}

      <div
        className="px-4 pt-8 flex flex-col lg:flex-row lg:gap-6 relative lg:px-[1.88rem] lg:pt-[2.75rem]"
      >
        <div
          className={`transition-all duration-500 ease-in-out overflow-y-auto h-auto lg:h-screen w-full ${
            selectedInvestor ? "lg:w-[37%]" : "lg:w-full"
          } mb-8 lg:mb-0`} 
        >
          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search investors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-16 py-4 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500 h-13 rounded-md bg-[#0F0E16] text-[#B8B8B8] text-sm font-normal border-none"
              />
              <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            </div>
          </div>
          <div className="mb-8">
            <p className="text-white text-sm font-medium">
              Meet the most capable AI investors. Choose an AI persona to deliver your first pitch and get instant
              feedback.
            </p>
          </div>

          <div className="space-y-6">
            {investors.map((investor) => (
              <div
                key={investor.id}
                onClick={() => handleInvestorClick(investor)}
                className={`flex items-${selectedInvestor ? "start" : "center"} flex-col sm:flex-row items-center sm:items-start justify-between p-4 sm:p-6 cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] w-full h-auto sm:h-[11.25rem] rounded-[0.3125rem] bg-[#0F0E16]`}
              >
                {!selectedInvestor ? (
                  <>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full sm:w-auto">
                      {/* Investor Image */}
                      <div
                        className="bg-gray-600 overflow-hidden flex items-center justify-center w-24 h-24 sm:w-[9.375rem] sm:h-[9.375rem] rounded-[0.3125rem] flex-shrink-0"
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

                      {/* Investor Details */}
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="mb-2 text-white text-xl sm:text-2xl font-medium">
                          {investor.name}
                        </h3>
                        <div className="mb-4">
                          <span className="text-[#656565] text-base sm:text-lg font-normal">
                            {investor.role}{" "}
                          </span>
                          <span className="text-white text-base sm:text-lg font-medium">
                            {investor.company}
                          </span>
                        </div>

                        <div className="flex gap-2 items-center flex-wrap justify-center sm:justify-start">
                          {investor.tags.map((tag, index) => (
                            <div
                              key={index}
                              className={`flex items-center gap-1 h-[1.0625rem] px-2 justify-center text-[0.5rem] font-medium ${
                                tag.type === "purple" ? "rounded-lg bg-[#AD6FDE] w-28" : "rounded-xl bg-[#621D04] w-10"
                              }`}
                            >
                              {tag.type === "purple" && <Phone className="w-[0.625rem] h-[0.625rem]" />}
                              <span className="text-white">
                                {tag.text}
                              </span>
                            </div>
                          ))}

                          <div
                            className="flex items-center gap-1 w-10 h-[1.0625rem] rounded-xl bg-gradient-to-b from-[#CC9C00] to-[#5D4100] px-2 justify-center text-[0.5rem] font-medium"
                          >
                            <Star className="w-[0.625rem] h-[0.625rem]" />
                            <span className="text-white">
                              {investor.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons for unselected investor */}
                    <div className="flex flex-col gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                      <button
                        className="hover:opacity-80 transition-all duration-300 transform hover:scale-105 w-full sm:w-[15rem] h-[1.95rem] rounded-[0.1875rem] border border-white/[0.04] bg-white/[0.08] text-[#D9D9D9] text-[0.625rem] font-medium"
                      >
                        View Profile
                      </button>
                      <button
                        className="hover:opacity-80 transition-all duration-300 transform hover:scale-105 w-full sm:w-[15rem] h-[1.95rem] rounded-[0.1875rem] border border-white/[0.04] bg-white/[0.08] text-[#D9D9D9] text-[0.625rem] font-medium"
                      >
                        Save Profile
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCallInvestor(investor)
                        }}
                        className="flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 transform hover:scale-105 w-full sm:w-[15rem] h-[1.95rem] rounded-[0.125rem] bg-white text-black text-[0.625rem] font-medium border-none"
                      >
                        <Phone className="w-[0.9rem] h-[0.9rem]" />
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
  className="md:w-[59%] w-full p-6 px-4 bg-[#0F0E16] rounded-[0.3125rem] transition duration-500 ease-in-out fixed top-[2.75rem] right-0 md:right-[1.88rem] h-screen overflow-y-auto translate-x-0 opacity-100 pt-8"
>
  {/* Added pt-8 to main container for more top padding */}
  <div className="flex flex-col items-center gap-6 mb-8 mt-0 md:mt-15 md:flex-row">
    {/* Removed mt-6 and set to mt-0 here, as pt-8 on parent handles top spacing */}
    <div
      className="bg-gray-600 overflow-hidden flex items-center justify-center w-[12rem] h-[12rem] md:w-[15.625rem] md:h-[15.625rem] rounded-[0.3125rem] flex-shrink-0"
    >
      <img
        src={selectedInvestor.image || "/placeholder.svg"}
        alt={selectedInvestor.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
      <div
        className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400 font-bold hidden text-[3rem] md:text-[4rem]"
      >
        {selectedInvestor.name.charAt(0)}
      </div>
    </div>

    <div className="flex-1 flex flex-col justify-center items-center text-center md:items-start md:text-left">
      <h3 className="text-white font-['Inter'] text-xl md:text-2xl font-semibold mb-2">
        {selectedInvestor.name}
      </h3>

      <div className="mb-1">
        <span className="text-[#656565] font-['Inter'] text-sm font-normal">
          Venture Capitalist
        </span>
      </div>
      <div className="mb-4">
        <span className="text-white font-['Inter'] text-sm font-medium">
          {selectedInvestor.company}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
        {selectedInvestor.tags.map((tag, index) => (
          <div
            key={index}
            className={`flex items-center gap-1 h-[1.0625rem] px-2 justify-center ${
              tag.type === "purple"
                ? "rounded-lg bg-[#AD6FDE]"
                : "rounded-xl bg-[#621D04]"
            }`}
          >
            {tag.type === "purple" && (
              <img
                src={CallIcon || "/placeholder.svg"}
                alt="Call"
                className="w-[0.625rem] h-[0.625rem]"
              />
            )}
            <span className="text-white font-['Inter'] text-[0.5rem] font-medium">
              {tag.text}
            </span>
          </div>
        ))}

        <div className="flex items-center gap-1 h-[1.0625rem] rounded-xl bg-gradient-to-b from-[#CC9C00] to-[#5D4100] px-2 justify-center">
          <img
            src={StarIcon || "/placeholder.svg"}
            alt="Star"
            className="w-[0.625rem] h-[0.625rem]"
          />
          <span className="text-white font-['Inter'] text-[0.5rem] font-medium">
            {selectedInvestor.rating}
          </span>
        </div>
      </div>

      <div className="mb-4 flex flex-col items-center w-full px-4 md:w-[75%] md:px-0 md:items-start">
        <div className="flex items-center gap-2 mb-2 w-full max-w-[16rem] relative">
          <div className="flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300">
            <img
              src={PlayIcon || "/placeholder.svg"}
              alt="Play"
              className="w-5 h-5"
            />
          </div>

          <div className="flex-1 h-1 bg-gray-700 rounded-[0.125rem] relative overflow-hidden">
            <div className="w-[40%] h-full bg-white rounded-[0.125rem] absolute top-0 left-0" />
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleCallInvestor(selectedInvestor);
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

  <div className="mb-6 px-4 md:px-0">
    <h4 className="mb-3 text-white font-['Inter'] text-lg md:text-xl font-semibold">
      Objective
    </h4>
    <p className="text-white font-['Inter'] text-sm font-normal leading-relaxed">
      {selectedInvestor.description}
    </p>
  </div>

  <div className="mb-6 px-4 md:px-0">
    <h4 className="mb-3 text-white font-['Inter'] text-lg md:text-xl font-semibold">
      Instruction
    </h4>
    <p className="text-white font-['Inter'] text-sm font-normal leading-relaxed">
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
  )
}

export default MockPitching
