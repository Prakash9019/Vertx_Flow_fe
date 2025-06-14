"use client"

import { useState, useEffect, useRef } from "react"

import SearchIcon from "../assets/SearchIcon.svg";
import FilterIcon from "../assets/FilterIcon.svg";
import CallIcon from "../assets/CallIcon.svg";
import CallIcon2 from "../assets/CallIcon2.svg";
import StarIcon from "../assets/StarIcon.svg";
import logo from "../assets/logo.svg";
import ContactsIcon from "../assets/ContactsIcon.svg";
import AddIcon from "../assets/AddIcon.svg";
import SpeedometerIcon from "../assets/SpeedometerIcon.svg";
import TuneIcon from "../assets/TuneIcon.svg";
import PlayIcon from "../assets/PlayIcon.svg";

import { Search, Filter, Phone, Eye, Bookmark, MessageSquare, Settings, X, Star, PhoneOff, Mic, MicOff, Video, VideoOff, Captions } from "lucide-react"

// Import the new CallReportPage component
import CallReportPage from './callReportPage'

function CallEndedScreen({ onReturnHome, onViewReport }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ 
        background: "#000000"
      }}
    >
      <div className="text-center">
        <h2 
          className="mb-8"
          style={{
            color: "#FFF",
            fontFamily: "Inter",
            fontSize: "1.5rem",
            fontWeight: 400,
          }}
        >
          Call has been ended
        </h2>

        <div className="flex gap-4">
          <button
            onClick={onReturnHome}
            className="hover:opacity-80 transition-opacity"
            style={{
              width: "7.1875rem",
              height: "2.6875rem",
              color: "#AD6FDE",
              fontFamily: "Inter",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Return home
          </button>

          <button
            onClick={onViewReport}
            className="hover:opacity-90 transition-opacity"
            style={{
              width: "7.1875rem",
              height: "2.6875rem",
              borderRadius: "0.1875rem",
              background: "#AD6FDE",
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "0.875rem",
              fontWeight: 500,
              border: "none"
            }}
          >
            View report
          </button>
        </div>
      </div>
    </div>
  )
}

function CallingPage({ investor, onEndCall, onJoinCall, showFullInterface = false }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  if (!showFullInterface) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ 
          background: "rgba(0, 0, 0, 0.9)",

        }}
      >
        <div 
          className="text-center"
          style={{
            color: "#FFF",
            fontFamily: "Inter",
            fontSize: "1.75rem",
            fontWeight: 500,
          }}
        >
          Calling...
        </div>
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ 
        background: "rgba(0, 0, 0, 0.9)",
      }}
    >
      <div className="w-full h-full flex">
        <div className="flex-1 flex items-center justify-center relative">
          <div 
            className="relative"
            style={{
              width: "40rem",
              height: "22.5rem",
              borderRadius: "0.625rem",
              overflow: "hidden",
              background: "linear-gradient(180deg, #1C60CE 0%, #0F0F0F 100%)"
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={investor?.image || "/api/placeholder/150/150"}
                alt={investor?.name || "Investor"}
                className="rounded-full object-cover"
                style={{
                  width: "9.375rem",
                  height: "9.375rem"
                }}
                onError={(e) => {
                  e.target.style.display = "none"
                  e.target.nextSibling.style.display = "flex"
                }}
              />
              <div
                className="rounded-full bg-gray-600 flex items-center justify-center text-white text-4xl font-bold"
                style={{ 
                  display: "none",
                  width: "9.375rem",
                  height: "9.375rem"
                }}
              >
                {"P"}
              </div>
            </div>

            <div 
              className="absolute top-4 left-4 px-3 py-1"
              style={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "0.875rem",
                fontWeight: 500
              }}
            >
              {"Praneth Kumar"}
            </div>

            <div 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2"
              style={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "1rem",
                fontWeight: 500
              }}
            >
              Calling...
            </div>

            <div className="absolute bottom-4 left-4 flex gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="flex items-center justify-center rounded-full hover:opacity-80 transition-opacity"
                style={{
                  width: "3.125rem",
                  height: "3.125rem",
                  background: isMuted ? "#dc2626" : "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)", 
                  strokeWidth: "1px",
                  stroke: "#FFF"
                }}
              > 
                {isMuted ? (
                  <MicOff style={{ width: "1.5rem", height: "1.5rem" }} className="text-white" />
                ) : (
                  <Mic style={{ width: "1.5rem", height: "1.5rem" }} className="text-white" />
                )}
              </button>
            </div>

            <div className="absolute bottom-4 right-4">
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className="flex items-center justify-center rounded-full hover:opacity-80 transition-opacity"
                style={{
                  width: "3.125rem",
                  height: "3.125rem",
                  background: isVideoOff ? "#dc2626" : "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  strokeWidth: "1px",
                  stroke: "#FFF"
                }}
              >
                {isVideoOff ? (
                  <VideoOff style={{ width: "1.5rem", height: "1.5rem" }} className="text-white" />
                ) : (
                  <Video style={{ width: "1.5rem", height: "1.5rem" }} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div 
          className="flex flex-col items-center justify-center"
          style={{
            width: "33rem",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.8)",

            padding: "2rem 1rem"
          }}
        >
          <div className="text-center mb-8">
            <h2 
              className="mb-4"
              style={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "1.5rem",
                fontWeight: 500
              }}
            >
              Ready to join?
            </h2>

            <div className="flex justify-center mb-4">
              <div 
                className="rounded-full overflow-hidden bg-gray-600"
                style={{
                  width: "2.5rem",
                  height: "2.5rem"
                }}
              >
                <img
                  src={investor?.image || "/api/placeholder/40/40"}
                  alt={investor?.name || "Investor"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none"
                    e.target.nextSibling.style.display = "flex"
                  }}
                />
                <div
                  className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-sm font-bold"
                  style={{ display: "none" }}
                >
                  {investor?.name?.charAt(0) || "P"}
                </div>
              </div>
            </div>

            <p 
              className="mb-8"
              style={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "1rem",
                fontWeight: 500
              }}
            >
              {investor?.name || "Persona One"} is in this call
            </p>

            <div className="space-y-3 w-full flex flex-col items-center">
              <button
                onClick={onJoinCall}
                className="hover:opacity-90 transition-opacity"
                style={{
                  width: "15rem",
                  height: "3.25rem",
                  borderRadius: "0.1875rem",
                  background: "#FFF",
                  color: "#000",
                  fontFamily: "Inter",
                  fontSize: "1rem",
                  fontWeight: 600,
                  border: "none"
                }}
              >
                Join now
              </button>

              <button
                className="hover:opacity-90 transition-opacity"
                style={{
                  width: "15rem",
                  height: "3.25rem",
                  borderRadius: "0.1875rem",
                  background: "#0F0E16",
                  color: "#FFF",
                  fontFamily: "Inter",
                  fontSize: "1rem",
                  fontWeight: 500,
                  border: "1px solid #D9D9D9"
                }}
              >
                Invite Co-founder
              </button>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <button
          onClick={onEndCall}
          className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          style={{
            width: "12.5rem",
            height: "2.5rem",
            borderRadius: "0.125rem",
            background: "#E10004",
            color: "#FFF",
            fontFamily: "Inter",
            fontSize: "0.75rem",
            fontWeight: 600
          }}
        >
          <PhoneOff style={{ width: "0.875rem", height: "0.875rem" }} />
          End Call
        </button>
      </div>
    </div>
  )
}

function VideoCallInterface({ investor, onEndCall }) {
  const [callDuration, setCallDuration] = useState(0)
  const [showCaptions, setShowCaptions] = useState(false)
  const [captionLines, setCaptionLines] = useState(["", ""])
  const [currentQuestion, setCurrentQuestion] = useState("What are you building exactly?")
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [transcript, setTranscript] = useState("")
  const silenceTimerRef = useRef(null)
  const questionIndexRef = useRef(0)

  const questions = [
    "What are you building exactly?",
    "That sounds interesting. What's your target market?",
    "How do you plan to monetize this?",
    "What's your competitive advantage?",
    "You have a good structure in your marketing plan",
    "What's your funding requirement?",
    "How do you see the market evolving?",
    "What are your key metrics so far?",
    "Tell me about your team background",
    "What's your go-to-market strategy?"
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const updateCaptionLines = (newText) => {
    const words = newText.split(' ')
    const maxWordsPerLine = 8
    
    if (words.length <= maxWordsPerLine) {
      setCaptionLines([newText, ""])
    } else if (words.length <= maxWordsPerLine * 2) {
      const firstLine = words.slice(0, maxWordsPerLine).join(' ')
      const secondLine = words.slice(maxWordsPerLine).join(' ')
      setCaptionLines([firstLine, secondLine])
    } else {
      const totalWords = words.length
      const firstLine = words.slice(totalWords - maxWordsPerLine * 2, totalWords - maxWordsPerLine).join(' ')
      const secondLine = words.slice(totalWords - maxWordsPerLine).join(' ')
      setCaptionLines([firstLine, secondLine])
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'en-US'
      
      recognitionInstance.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        
        const fullText = transcript + finalTranscript + interimTranscript
        updateCaptionLines(fullText.trim())
        
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }
        
        silenceTimerRef.current = setTimeout(() => {
          questionIndexRef.current = (questionIndexRef.current + 1) % questions.length
          setCurrentQuestion(questions[questionIndexRef.current])
          setTranscript(fullText)
          setCaptionLines(["", ""])
        }, 5000)
      }
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      
      recognitionInstance.onend = () => {
        if (isListening && showCaptions) {
          setTimeout(() => {
            recognitionInstance.start()
          }, 100)
        }
      }
      
      setRecognition(recognitionInstance)
    }
    
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
    }
  }, [isListening, showCaptions, transcript])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleCaptions = () => {
    setShowCaptions(!showCaptions)
    
    if (!showCaptions) {
      setCaptionLines(["", ""])
      setIsListening(true)
      if (recognition) {
        try {
          recognition.start()
        } catch (error) {
          console.error('Error starting recognition:', error)
        }
      }
    } else {
      setIsListening(false)
      setCaptionLines(["", ""])
      if (recognition) {
        recognition.stop()
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
    }
  }

  const topPadding = showCaptions ? "16rem" : "8rem"

  return (
    <div 
      className="fixed inset-0 z-50"
      style={{ 
        background: "#000000",
        paddingLeft: "4rem",
        paddingRight: "4rem",
        paddingTop: topPadding,
        paddingBottom: "12rem",
        transition: "padding-top 0.3s ease"
      }}
    >
      {showCaptions && (
        <div 
          className="absolute top-0 left-0 w-full flex justify-center z-10"
          style={{ paddingTop: "2rem" }}
        >
          <div 
            className="flex items-center gap-2 px-4 py-2"
          >
            <div 
              className="rounded-full overflow-hidden"
              style={{
                width: "1.875rem",
                height: "1.875rem"
              }}
            >
              <img
                src="/api/placeholder/30/30"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span
              style={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "0.875rem",
                fontWeight: 500
              }}
            >
              {currentQuestion}
            </span>
          </div>
        </div>
      )}

      {showCaptions && (captionLines[0] || captionLines[1]) && (
        <div 
          className="absolute top-0 left-0 w-full flex justify-center z-10"
          style={{ paddingTop: "6rem" }}
        >
          <div 
            className="px-6 py-3 max-w-4xl text-center"
          >
            <div
              style={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Inter",
                fontSize: "2rem",
                fontWeight: 300,
                lineHeight: "1.5"
              }}
            >
              {captionLines[0] && (
                <div style={{ marginBottom: captionLines[1] ? "0.5rem" : "0" }}>
                  {captionLines[0]}
                </div>
              )}
              {captionLines[1] && (
                <div>
                  {captionLines[1]}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCaptions && isListening && (
        <div 
          className="absolute top-0 right-8 z-10 flex items-center gap-2"
          style={{ paddingTop: "2rem" }}
        >
          <div 
            className="w-3 h-3 bg-red-500 rounded-full animate-pulse"
          />
          <span
            style={{
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "0.75rem",
              fontWeight: 400
            }}
          >
            Listening...
          </span>
        </div>
      )}

      <div 
        className="w-full h-full flex gap-8"
      >
        <div 
          className="flex-1 relative"
          style={{
            borderRadius: "0.625rem",
            overflow: "hidden",
            background: "linear-gradient(180deg, #1C60CE 0%, #0F0F0F 100%)"
          }}
        >
          <div 
            className="absolute top-6 left-6 px-4 py-2"
            style={{
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Praneeth Kumar | Vertxlabs
          </div>

          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="rounded-full overflow-hidden bg-gray-600"
              style={{
                width: "9.375rem",
                height: "9.375rem"
              }}
            >
              <img
                src="/api/placeholder/150/150"
                alt="Praneeth Kumar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none"
                  e.target.nextSibling.style.display = "flex"
                }}
              />
              <div
                className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-4xl font-bold"
                style={{ display: "none" }}
              >
                P
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 flex gap-4">
            <button
              className="flex items-center justify-center rounded-full hover:opacity-80 transition-opacity"
              style={{
                width: "3.5rem",
                height: "3.5rem",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)"
              }}
            >
              <Mic style={{ width: "1.5rem", height: "1.5rem" }} className="text-white" />
            </button>
          </div>

          <div className="absolute bottom-6 right-6">
            <button
              className="flex items-center justify-center rounded-full hover:opacity-80 transition-opacity"
              style={{
                width: "3.5rem",
                height: "3.5rem",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)"
              }}
            >
              <Video style={{ width: "1.5rem", height: "1.5rem" }} className="text-white" />
            </button>
          </div>
        </div>

        <div 
          className="flex-1 relative"
          style={{
            borderRadius: "0.625rem",
            overflow: "hidden",
            background: "linear-gradient(180deg, #9F67FF 0%, #0F0F0F 100%), #C4C4C4"
          }}
        >
          <div 
            className="absolute top-6 left-6 px-4 py-2"
            style={{
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Persona One | Example Capital
          </div>

          <div className="w-full h-full flex items-center justify-center">
            <div
              className="flex items-center justify-center rounded-full border-[10px] border-purple-400"
              style={{
                width: "10.625rem",
                height: "10.625rem"
              }}
            >
              <div
                className="rounded-full overflow-hidden bg-gray-600"
                style={{
                  width: "9.375rem",
                  height: "9.375rem"
                }}
              >
                <img
                  src={investor?.image || "/api/placeholder/150/150"}
                  alt={investor?.name || "Persona One"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-4xl font-bold"
                  style={{ display: "none" }}
                >
                  {investor?.name?.charAt(0) || "P"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="fixed left-0 w-full flex justify-between items-center px-8"
        style={{
          bottom: "2rem"
        }}
      >
        <div 
          style={{
            color: "#FFF",
            fontFamily: "Inter",
            fontSize: "1.25rem",
            fontWeight: 400
          }}
        >
          {formatTime(callDuration)} | Mock Pitching
        </div>

        <button
          onClick={onEndCall}
          className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          style={{
            width: "12.5rem",
            height: "2.5rem",
            borderRadius: "0.125rem",
            background: "#E10004",
            color: "#FFF",
            fontFamily: "Inter",
            fontSize: "0.75rem",
            fontWeight: 600
          }}
        >
          <PhoneOff style={{ width: "0.875rem", height: "0.875rem" }} />
          End Call
        </button>

        <div className="flex gap-4">
          <button className="text-white hover:opacity-80">
            <MessageSquare style={{ width: "1.25rem", height: "1.25rem" }} />
          </button>
          <button 
            onClick={toggleCaptions}
            className="hover:opacity-80 flex items-center justify-center rounded-full"
            style={{
              width: showCaptions ? "2.5rem" : "auto",
              height: showCaptions ? "2.5rem" : "auto",
              background: showCaptions ? "#1C60CE" : "transparent"
            }}
          >
            <Captions 
              style={{ 
                width: "1.25rem", 
                height: "1.25rem",
                color: "#FFF"
              }} 
            />
          </button>
        </div>
      </div>
    </div>
  )
}

function MockPitching({ onBack }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInvestor, setSelectedInvestor] = useState(null)
  const [isCallActive, setIsCallActive] = useState(false)
  const [callingInvestor, setCallingInvestor] = useState(null)
  const [showFullCallInterface, setShowFullCallInterface] = useState(false)
  const [isInVideoCall, setIsInVideoCall] = useState(false)
  const [showCallEndedScreen, setShowCallEndedScreen] = useState(false)
  const [showReportPage, setShowReportPage] = useState(false) // New state for report page

  const investors = [
    {
      id: 1,
      name: "Persona One",
      role: "Venture Capitalist at",
      company: "Example Capital",
      image: "/api/placeholder/150/150",
      tags: [
        { text: "Expressive and Polite", type: "purple" },
        { text: "Hard", type: "brown" },
      ],
      rating: "4/5",
      description:
        "You are pitching your startup idea to Persona One, a strategic, principle-driven investor at Example Capital, known for investing in early-to-growth-stage startups with global, scalable business models.",
      instruction:
        "Persona One values visionary entrepreneurs who demonstrate clear product-market fit, disciplined execution, and a compelling global vision. Clearly present the core problem you're solving, your unique and differentiated solution, evidence of strong product-market fit, and your strategy for achieving global scalability.",
    }, 
  ]

  const handleInvestorClick = (investor) => {
    setSelectedInvestor(investor)
  }

  const handleCloseDetails = () => {
    setSelectedInvestor(null)
  }

  const handleCallInvestor = (investor) => {
    setCallingInvestor(investor)
    setIsCallActive(true)
    setShowFullCallInterface(false)
    
    setTimeout(() => {
      setShowFullCallInterface(true)
    }, 3000)
  }

  const handleJoinCall = () => {
    setIsInVideoCall(true)
    setIsCallActive(false)
    setShowFullCallInterface(false)
  }

  const handleEndCall = () => {
    setIsCallActive(false)
    setCallingInvestor(null)
    setShowFullCallInterface(false)
    setIsInVideoCall(false)
    setShowCallEndedScreen(true)
  }

  const handleReturnHome = () => {
    setShowCallEndedScreen(false)
    onBack()
  }

  const handleViewReport = () => {
    setShowCallEndedScreen(false)
    setShowReportPage(true) // Show the report page
  }

  // Show report page if triggered
  if (showReportPage) {
    return <CallReportPage investor={callingInvestor} onBack={onBack} />;
  }

  // Show call ended screen
  if (showCallEndedScreen) {
    return <CallEndedScreen onReturnHome={handleReturnHome} onViewReport={handleViewReport} />
  }

  // Show video call interface when in video call
  if (isInVideoCall) {
    return <VideoCallInterface investor={callingInvestor} onEndCall={handleEndCall} />
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ background: "#000000" }}>
      {isCallActive && (
        <CallingPage 
          investor={callingInvestor} 
          onEndCall={handleEndCall}
          onJoinCall={handleJoinCall}
          showFullInterface={showFullCallInterface}
        />
      )}

      <div
        style={{
          paddingLeft: "1.88rem",
          paddingRight: "1.88rem",
          paddingTop: "2.75rem",
          display: "flex",
          gap: "1.5rem",
          position: "relative",
        }}
      >
        <div
          style={{
            width: selectedInvestor ? "37%" : "100%",
            transition: "width 0.3s ease",
            overflowY: "auto",
            height: "100vh",
          }}
        >
          <div className="relative mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search investors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-16 py-4 rounded focus:outline-none"
                style={{
                  height: "3.25rem",
                  borderRadius: "0.25rem",
                  background: "#0F0E16",
                  color: "#B8B8B8",
                  fontFamily: "Inter",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  border: "none",
                }}
              />
              <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            </div>
          </div>

          <div className="mb-8">
            <p
              style={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              Meet the most capable AI investors. Choose an AI persona to deliver your first pitch and get instant
              feedback.
            </p>
          </div>

          <div className="space-y-6">
            {investors.map((investor) => (
              <div
                key={investor.id}
                className={`flex items-${selectedInvestor ? "start" : "center"} justify-between p-6 cursor-pointer hover:opacity-90 transition-opacity`}
                style={{
                  width: "100%",
                  height: "11.25rem",
                  borderRadius: "0.3125rem",
                  background: "#0F0E16",
                }}
                onClick={() => handleInvestorClick(investor)}
              >
                {!selectedInvestor ? (
                  <>
                    <div className="flex items-center gap-6">
                      <div
                        className="bg-gray-600 overflow-hidden flex items-center justify-center"
                        style={{
                          width: "9.375rem",
                          height: "9.375rem",
                          borderRadius: "0.3125rem",
                        }}
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
                          className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400 text-4xl font-bold"
                          style={{ display: "none" }}
                        >
                          {investor.name.charAt(0)}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3
                          className="mb-2"
                          style={{
                            color: "#FFF",
                            fontFamily: "Inter",
                            fontSize: "1.5rem",
                            fontWeight: 500,
                          }}
                        >
                          {investor.name}
                        </h3>
                        <div className="mb-4">
                          <span
                            style={{
                              color: "#656565",
                              fontFamily: "Inter",
                              fontSize: "1.125rem",
                              fontWeight: 400,
                            }}
                          >
                            {investor.role}{" "}
                          </span>
                          <span
                            style={{
                              color: "#FFF",
                              fontFamily: "Inter",
                              fontSize: "1.125rem",
                              fontWeight: 500,
                            }}
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
                              {tag.type === "purple" && (
                                <Phone style={{ width: "0.625rem", height: "0.625rem" }} />
                              )}
                              <span
                                style={{
                                  color: "#FFF",
                                  fontFamily: "Inter",
                                  fontSize: "0.5rem",
                                  fontWeight: 500,
                                }}
                              >
                                {tag.text}
                              </span>
                            </div>
                          ))}

                          <div
                            className="flex items-center gap-1"
                            style={{
                              width: "2.5rem",
                              height: "1.0625rem",
                              borderRadius: "0.625rem",
                              background: "linear-gradient(180deg, #CC9C00 0%, #5D4100 100%)",
                              padding: "0 0.5rem",
                              justifyContent: "center",
                            }}
                          >
                            <Star style={{ width: "0.625rem", height: "0.625rem" }} />
                            <span
                              style={{
                                color: "#FFF",
                                fontFamily: "Inter",
                                fontSize: "0.5rem",
                                fontWeight: 500,
                              }}
                            >
                              {investor.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        className="hover:opacity-80 transition-opacity"
                        style={{
                          width: "15rem",
                          height: "1.95rem",
                          borderRadius: "0.1875rem",
                          border: "1px solid rgba(255, 255, 255, 0.04)",
                          background: "rgba(255, 255, 255, 0.08)",
                          color: "#D9D9D9",
                          fontFamily: "Inter",
                          fontSize: "0.625rem",
                          fontWeight: 500,
                        }}
                      >
                        View Profile
                      </button>
                      <button
                        className="hover:opacity-80 transition-opacity"
                        style={{
                          width: "15rem",
                          height: "1.95rem",
                          borderRadius: "0.1875rem",
                          border: "1px solid rgba(255, 255, 255, 0.04)",
                          background: "rgba(255, 255, 255, 0.08)",
                          color: "#D9D9D9",
                          fontFamily: "Inter",
                          fontSize: "0.625rem",
                          fontWeight: 500,
                        }}
                      >
                        Save Profile
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCallInvestor(investor)
                        }}
                        className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        style={{
                          width: "15rem",
                          height: "1.95rem",
                          borderRadius: "0.125rem",
                          background: "#FFF",
                          color: "#000",
                          fontFamily: "Inter",
                          fontSize: "0.625rem",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        <Phone style={{ width: "0.9rem", height: "0.9rem" }} />
                        Call Investor
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-6 w-full">
                    <div
                      className="bg-gray-600 overflow-hidden flex items-center justify-center"
                      style={{
                        width: "9.375rem",
                        height: "9.375rem",
                        borderRadius: "0.3125rem",
                      }}
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
                        className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400 text-4xl font-bold"
                        style={{ display: "none" }}
                      >
                        {investor.name.charAt(0)}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div>
                        <h3
                          style={{
                            color: "#FFF",
                            fontFamily: "Inter",
                            fontSize: "1rem",
                            fontWeight: 500,
                            marginBottom: "0rem",
                          }}
                        >
                          {investor.name}
                        </h3>

                        <div style={{ marginBottom: "0.5rem" }}>
                          <span
                            style={{
                              color: "#656565",
                              fontFamily: "Inter",
                              fontSize: "0.625rem",
                              fontWeight: 400,
                            }}
                          >
                            {investor.role}{" "}
                          </span>
                          <span
                            style={{
                              color: "#FFF",
                              fontFamily: "Inter",
                              fontSize: "0.625rem",
                              fontWeight: 500,
                            }}
                          >
                            {investor.company}
                          </span>
                        </div>

                        <div className="flex gap-2 items-center" style={{ marginBottom: "0.5rem" }}>
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
                                style={{
                                  color: "#FFF",
                                  fontFamily: "Inter",
                                  fontSize: "0.5rem",
                                  fontWeight: 500,
                                }}
                              >
                                {tag.text}
                              </span>
                            </div>
                          ))}

                          <div
                            className="flex items-center gap-1"
                            style={{
                              width: "2.5rem",
                              height: "1.0625rem",
                              borderRadius: "0.625rem",
                              background: "linear-gradient(180deg, #CC9C00 0%, #5D4100 100%)",
                              padding: "0 0.5rem",
                              justifyContent: "center",
                            }}
                          >
                            <Star style={{ width: "0.625rem", height: "0.625rem" }} />
                            <span
                              style={{
                                color: "#FFF",
                                fontFamily: "Inter",
                                fontSize: "0.5rem",
                                fontWeight: 500,
                              }}
                            >
                              {investor.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col" style={{ gap: "0.25rem" }}>
                        <div className="flex gap-2">
                          <button
                            className="hover:opacity-80 transition-opacity"
                            style={{
                              width: "6.125rem",
                              height: "1.625rem",
                              borderRadius: "0.1875rem",
                              border: "1px solid rgba(255, 255, 255, 0.04)",
                              background: "rgba(255, 255, 255, 0.08)",
                              color: "#D9D9D9",
                              fontFamily: "Inter",
                              fontSize: "0.5rem",
                              fontWeight: 500,
                            }}
                          >
                            View Profile
                          </button>
                          <button
                            className="hover:opacity-80 transition-opacity"
                            style={{
                              width: "6.125rem",
                              height: "1.625rem",
                              borderRadius: "0.1875rem",
                              border: "1px solid rgba(255, 255, 255, 0.04)",
                              background: "rgba(255, 255, 255, 0.08)",
                              color: "#D9D9D9",
                              fontFamily: "Inter",
                              fontSize: "0.5rem",
                              fontWeight: 500,
                            }}
                          >
                            Save Profile
                          </button>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCallInvestor(investor)
                          }}
                          className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                          style={{
                            width: "12.5rem",
                            height: "1.625rem",
                            borderRadius: "0.125rem",
                            background: "#FFF",
                            color: "#000",
                            fontFamily: "Inter",
                            fontSize: "0.5rem",
                            fontWeight: 500,
                            border: "none",
                          }}
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
            style={{
              width: "59%",
              padding: "1.5rem 2rem",
              background: "#0F0E16",
              borderRadius: "0.3125rem",
              transition: "opacity 0.3s ease",
              position: "fixed",
              top: "2.75rem",
              right: "1.88rem",
              height: "100vh",
              overflowY: "auto",
            }}
          >
            <div className="flex gap-6 mb-8 mt-15">
              <div
                className="bg-gray-600 overflow-hidden flex items-center justify-center"
                style={{
                  width: "15.625rem",
                  height: "15.625rem",
                  borderRadius: "0.3125rem",
                }}
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
                  className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400 font-bold"
                  style={{ display: "none", fontSize: "4rem" }}
                >
                  {selectedInvestor.name.charAt(0)}
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <h3
                  style={{
                    color: "#FFF",
                    fontFamily: "Inter",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                  }}
                >
                  {selectedInvestor.name}
                </h3>

                <div style={{ marginBottom: "0.25rem" }}>
                  <span
                    style={{
                      color: "#656565",
                      fontFamily: "Inter",
                      fontSize: "0.875rem",
                      fontWeight: 400,
                    }}
                  >
                    Venture Capitalist
                  </span>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <span
                    style={{
                      color: "#FFF",
                      fontFamily: "Inter",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    {selectedInvestor.company}
                  </span>
                </div>

                <div className="flex gap-2 mb-4 justify-center">
                  {selectedInvestor.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1"
                      style={{
                        height: "1.0625rem",
                        borderRadius: tag.type === "purple" ? "0.5rem" : "0.625rem",
                        background: tag.type === "purple" ? "#AD6FDE" : "#621D04",
                        padding: "0 0.5rem",
                        justifyContent: "center",
                      }}
                    >
                      {tag.type === "purple" && (
                        <img
                          src={CallIcon}
                          alt="Call"
                          style={{ width: "0.625rem", height: "0.625rem" }}
                        />
                      )}
                      <span
                        style={{
                          color: "#FFF",
                          fontFamily: "Inter",
                          fontSize: "0.5rem",
                          fontWeight: 500,
                        }}
                      >
                        {tag.text}
                      </span>
                    </div>
                  ))}

                  <div
                    className="flex items-center gap-1"
                    style={{
                      height: "1.0625rem",
                      borderRadius: "0.625rem",
                      background: "linear-gradient(180deg, #CC9C00 0%, #5D4100 100%)",
                      padding: "0 0.5rem",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={StarIcon}
                      alt="Star"
                      style={{ width: "0.625rem", height: "0.625rem" }}
                    />
                    <span
                      style={{
                        color: "#FFF",
                        fontFamily: "Inter",
                        fontSize: "0.5rem",
                        fontWeight: 500,
                      }}
                    >
                      {selectedInvestor.rating}
                    </span>
                  </div>
                </div>

                <div className="mb-4 flex flex-col items-center w-[75%] px-4">
                  <div
                    className="flex items-center gap-2 mb-2 w-full max-w-[16rem]"
                    style={{
                      position: "relative",
                    }}
                  >
                    <div className="flex items-center justify-center cursor-pointer">
                      <img src={PlayIcon} alt="Play" style={{ width: "1.25rem", height: "1.25rem" }} />
                    </div>

                    <div
                      style={{
                        flex: 1,
                        height: "0.25rem",
                        background: "#333",
                        borderRadius: "0.125rem",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "40%",
                          height: "100%",
                          background: "#FFF",
                          borderRadius: "0.125rem",
                          position: "absolute",
                          top: 0,
                          left: 0,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  style={{
                    width: "12.5rem",
                    height: "2.25rem",
                    borderRadius: "0.125rem",
                    background: "#FFF",
                    color: "#000",
                    fontFamily: "Inter",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    border: "none",
                  }}
                >
                  <img src={CallIcon2} alt="Call" style={{ width: "0.875rem", height: "0.875rem" }} />
                  Call Investor
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h4
                className="mb-3"
                style={{
                  color: "#FFF",
                  fontFamily: "Inter",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                }}
              >
                Objective
              </h4>
              <p
                style={{
                  color: "#FFF",
                  fontFamily: "Inter",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  lineHeight: "1.6",
                }}
              >
                {selectedInvestor.description}
              </p>
            </div>

            <div className="mb-6">
              <h4
                className="mb-3"
                style={{
                  color: "#FFF",
                  fontFamily: "Inter",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                }}
              >
                Instruction
              </h4>
              <p
                style={{
                  color: "#FFF",
                  fontFamily: "Inter",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  lineHeight: "1.6",
                }}
              >
                {selectedInvestor.instruction}
              </p>
            </div>
          </div>
        )}
      </div>

      <div
        className="fixed bottom-2 left-0 w-full flex items-center justify-center"
        style={{ height: "4.375rem", background: "rgba(0, 0, 0, 0.90)" }}
      >
        <div
          className="flex items-center"
          style={{
            width: "20.75rem",
            height: "3.125rem",
            borderRadius: "0.5rem",
            background: "rgba(255, 255, 255, 0.94)",
            padding: "0 1rem",
            gap: "1rem",
          }}
        >
          <button
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{
              width: "2.375rem",
              height: "2.375rem",
              borderRadius: "0.25rem",
              background: "#000",
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{
                width: "1.2rem",
                height: "1.2rem",
              }}
            />
          </button>

          <div
            style={{
              width: "0.0625rem",
              height: "3.125rem",
              background: "rgba(184, 184, 184, 0.40)",
            }}
          />

          <button
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{
              width: "2.5rem",
              height: "2.25rem",
              borderRadius: "0.25rem",
              background: "#AD6FDE",
            }}
          >
            <img
              src={ContactsIcon}
              alt="Contacts"
              style={{ width: "1.2rem", height: "1.2rem" }}
            />
          </button>

          <button className="flex items-center justify-center hover:opacity-80 transition-opacity text-gray-600">
            <img
              src={AddIcon}
              alt="Add"
              style={{ width: "1.5rem", height: "1.5rem", filter: "invert(100%)" }}
            />
          </button>

          <button className="flex items-center justify-center hover:opacity-80 transition-opacity text-gray-600">
            <img
              src={SpeedometerIcon}
              alt="Speedometer"
              style={{ width: "1.5rem", height: "1.5rem" }}
            />
          </button>

          <button className="flex items-center justify-center hover:opacity-80 transition-opacity text-gray-600">
            <img
              src={TuneIcon}
              alt="Tune"
              style={{ width: "1.5rem", height: "1.5rem" }}
            />
          </button>

          <div
            style={{
              width: "0.0625rem",
              height: "3.125rem",
              background: "rgba(184, 184, 184, 0.40)",
            }}
          />

          <button
            onClick={onBack}
            className="flex items-center justify-center hover:opacity-80 transition-opacity text-xs font-medium"
            style={{
              width: "2.5rem",
              height: "1.875rem",
              borderRadius: "0.1875rem",
              background: "#33005C",
              color: "#AD6FDE",
            }}
          >
            EXIT
          </button>
        </div>
      </div>
    </div>
  )
}

export default MockPitching