"use client"

import { useState, useEffect, useRef } from "react"
import io from "socket.io-client"
import CallIcon from "../assets/CallIcon.svg"
import CallIcon2 from "../assets/CallIcon2.svg"
import StarIcon from "../assets/StarIcon.svg"
import logo from "../assets/logo.svg"
import ContactsIcon from "../assets/ContactsIcon.svg"
import AddIcon from "../assets/AddIcon.svg"
import SpeedometerIcon from "../assets/SpeedometerIcon.svg"
import TuneIcon from "../assets/TuneIcon.svg"
import PlayIcon from "../assets/PlayIcon.svg"
import EndCallIcon from "../assets/EndCall.svg";
import VideoIcon from "../assets/VideoIcon.svg";
import VideoOffIcon from "../assets/VideoOffIcon.svg";
import MicIcon from "../assets/MicIcon.svg";
import MicOffIcon from "../assets/MicOffIcon.svg";
import PresentationIcon from "../assets/PresentationIcon.svg";
import CaptionIcon from "../assets/CaptionIcon.svg";
import { UseVideoAnalysis } from "./UseVideoAnalysis.jsx"; // Adjust path as needed



import {
  Search,
  Filter,
  Phone,
  MessageSquare,
  Star,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Captions,
  Play,
  Plus,
  Gauge,
  SlidersHorizontal,
  ArrowLeft,
} from "lucide-react"

// Import the new CallReportPage component
import CallReportPage from "./callReportPage"
import { useStartupProfile } from "../context/StartupProfileContext"
import { useNavigate } from "react-router-dom"

function CallEndedScreen({ onReturnHome, onViewReport }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "#000000",
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
              border: "none",
            }}
          >
            View report
          </button>
        </div>
      </div>
    </div>
  )
}

function CallingPage({ investor, onEndCall, onJoinCall, showFullInterface = false, profileData }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(true)
  const [hasMediaPermissions, setHasMediaPermissions] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  // Request media permissions when component mounts
  useEffect(() => {
    if (showFullInterface) {
      requestMediaPermissions()
    }
  }, [showFullInterface])

  // Handle camera stream
  useEffect(() => {
    if (!isVideoOff && showFullInterface) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          streamRef.current = stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch(err => console.error('Camera access denied:', err))
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [isVideoOff, showFullInterface])

  // Function to request media permissions
  const requestMediaPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      setHasMediaPermissions(true)
      // Stop the stream since we're just checking permissions
      stream.getTracks().forEach(track => track.stop())
    } catch (error) {
      console.error('Error requesting media permissions:', error)
      setHasMediaPermissions(false)
    }
  }

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
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-60">
          <button
            onClick={onEndCall}
            className="flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            style={{
              width: "12.5rem",
              height: "2.5rem",
              borderRadius: "0.125rem",
              background: "#E10004",
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            <img
              src={EndCallIcon}
              alt="End Call Icon"
              style={{ width: "0.875rem", height: "0.875rem" }}
            />
            End Call
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
    >
      <div className="w-full h-full flex flex-col lg:flex-row">
        <div className="flex-1 flex items-center justify-center relative p-4 sm:p-8">
          <div
            className="relative transition-all duration-500 ease-in-out w-full max-w-[40rem] h-auto aspect-video sm:w-[40rem] sm:h-[22.5rem] rounded-xl overflow-hidden bg-gradient-to-b from-[#1C60CE] to-[#0F0F0F]"
          >
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={investor?.image || "/api/placeholder/150/150"}
                alt={investor?.name || "Investor"}
                className="rounded-full object-cover w-24 h-24 sm:w-[9.375rem] sm:h-[9.375rem]"
                onError={(e) => {
                  e.target.style.display = "none"
                  e.target.nextSibling.style.display = "flex"
                }}
              />
              <div
                className="rounded-full bg-gray-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold w-24 h-24 sm:w-[9.375rem] sm:h-[9.375rem] hidden"
              >
                {"P"}
              </div>
            </div>
            <div
              className="absolute top-4 left-4 px-3 py-1 text-white font-inter text-sm font-medium"
            >
              {profileData?.accountName && profileData?.companyName
                ? `${profileData.accountName} | ${profileData.companyName}`
                : "User | Company"}
            </div>

            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 text-white font-inter text-base font-medium"
            >
              Calling...
            </div>

            <div className="absolute bottom-4 left-4 flex gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="flex items-center justify-center rounded-full hover:opacity-80 transition-opacity border w-10 h-10 sm:w-[3.125rem] sm:h-[3.125rem] bg-transparent border-white"
              >
                {isMuted ? (
                  <img
                    src={MicOffIcon}
                    alt="Mic Off"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                ) : (
                  <img
                    src={MicIcon}
                    alt="Mic On"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                )}
              </button>
            </div>

            <div className="absolute bottom-4 right-4" style={{ zIndex: 4 }}>
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className="flex items-center justify-center rounded-full hover:opacity-80 transition-opacity border w-10 h-10 sm:w-[3.125rem] sm:h-[3.125rem] bg-transparent border-white"
              >
                {isVideoOff ? (
                  <img
                    src={VideoOffIcon}
                    alt="Video Off"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                ) : (
                  <img
                    src={VideoIcon}
                    alt="Video On"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        <div
          className="w-full lg:w-[33rem] h-auto lg:h-screen flex flex-col items-center justify-center transition-all duration-500 ease-in-out bg-black bg-opacity-80 p-4 sm:p-8"
        >
          <div className="text-center mb-4 sm:mb-8 ">
            <h2
              className="mb-2 sm:mb-4 text-white font-inter text-xl sm:text-2xl font-medium"
            >
              Ready to join?
            </h2>

            <div className="flex justify-center mb-4">
              <div
                className="rounded-full overflow-hidden bg-gray-600 w-8 h-8 sm:w-10 sm:h-10"
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
                  className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-base font-bold hidden"
                >
                  {investor?.name?.charAt(0) || "P"}
                </div>
              </div>
            </div>

            <p
              className="mb-4 sm:mb-8 text-white font-inter text-sm sm:text-base font-medium"
            >
              {investor?.name || "Persona One"} is in this call
            </p>

            <div className="space-y-3 w-full flex flex-col items-center">
              <button
                onClick={onJoinCall}
                className="hover:opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full max-w-[15rem] h-12 sm:h-[3.25rem] rounded-[0.1875rem] bg-white text-black font-inter text-base font-semibold border-none"
              >
                {hasMediaPermissions ? (
                  <>
                    Join now
                  </>
                ) : (
                  <>
                    Allow microphone access
                  </>
                )}
              </button>

              <button
                className="hover:opacity-90 transition-all duration-300 transform hover:scale-105 w-full max-w-[15rem] h-12 sm:h-[3.25rem] rounded-[0.1875rem] bg-[#0F0E16] text-white font-inter text-base font-medium border border-gray-300"
              >
                Invite Co-founder
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* END CALL BUTTON - Simplified for consistent centering */}
      <div className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-60">
        <button
          onClick={onEndCall}
          className="flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 transform hover:scale-105 w-[12.5rem] h-10 sm:h-[2.5rem] rounded-[0.125rem] bg-[#E10004] text-white font-inter text-xs font-semibold"
        >
          <img
            src={EndCallIcon}
            alt="End Call Icon"
            className="w-3.5 h-3.5"
          />
          End Call
        </button>
      </div>
    </div>
  )
}

function VideoCallInterface({ investor, onEndCall, isTransitioning = false, sessionId, setSessionId,sessionIdRef, profileData, personaKey }) {
  const [callDuration, setCallDuration] = useState(0)
  const [showCaptions, setShowCaptions] = useState(false)
  const [captionLines, setCaptionLines] = useState(["", ""])
  const [currentQuestion, setCurrentQuestion] = useState("What are you building exactly?")
  const [isListening, setIsListening] = useState(false)
  // const [recognition, setRecognition] = useState(null)
const recognitionRef = useRef(null);  // replace useState for recognition

  const [transcript, setTranscript] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false) // Add state to track if user is speaking
  const socketRef = useRef(null)
  const silenceTimerRef = useRef(null)
  const questionIndexRef = useRef(0)
  const [currentAudio, setCurrentAudio] = useState(null)
  const videoRef = useRef(null)
  const cameraStreamRef = useRef(null) // <-- Add this ref
  const { videoRef: analysisVideoRef, canvasRef } = UseVideoAnalysis(socketRef, sessionId);

  
//  const handleStartSession = (sid = sessionId) => {
//   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   if (!SpeechRecognition) {
//     alert("Speech recognition is not supported in this browser.");
//     return;
//   }

//   const newRecognition = new SpeechRecognition();
//   newRecognition.continuous = true;
//   newRecognition.interimResults = true;
//   newRecognition.lang = "en-US";

//   newRecognition.onresult = (event) => {
//     let fullText = "";
//     for (let i = event.resultIndex; i < event.results.length; i++) {
//       fullText += event.results[i][0].transcript;
//     }

//     setTranscript(fullText.trim());
//     setIsSpeaking(true); // User is speaking

//     if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

//       silenceTimerRef.current = setTimeout(() => {
//         if (sessionId && socketRef.current) {
//           sendMessage(fullText.trim());
//         } else {
//           console.warn("Delaying message — session or socket not ready");
//           setTimeout(() => {
//             if (sessionId && socketRef.current) {
//               sendMessage(fullText.trim());
//             } else {
//               console.error("Message skipped — still no session/socket");
//             }
//           }, 1000);
//         }
//         setTranscript("");
//         setIsSpeaking(false);
//       }, 3000);
//  // Reduced to 3s for quicker flow
//   };

//   newRecognition.onerror = (e) => {
//     // console.error("Speech recognition error:", e.error);
//     // setIsListening(false);
//     // setIsSpeaking(false);
//      if (e.error === "aborted") {
//         console.log("🎤 Speech recognition aborted (expected)");
//     } else {
//         console.error("Speech recognition error:", e.error);
//     }
//     setIsListening(false);
//     setIsSpeaking(false);
//   };

//   newRecognition.onend = () => {
//     console.log("Recognition ended");
//     setIsSpeaking(false);
//     if (isListening) {
//       setTimeout(() => {
//         try {
//           newRecognition.start();
//         } catch (err) {
//           console.error("Error restarting recognition:", err);
//         }
//       }, 300);
//     }
//   };

//   try {
//     newRecognition.start();
//     setRecognition(newRecognition);
//     setIsListening(true);
//   } catch (e) {
//     console.error("Error starting recognition:", e);
//   }

//   // 🔷 Emit AI greeting when session starts
//   if (socketRef.current && sid) {
//     socketRef.current.emit('text_message', {
//       text: 'start conversation',
//       persona: personaKey || 'skeptical',
//       session_id: sid,
//       system: 'workflow'
//     });
//     console.log('🤖 Sent initial message to AI to start conversation');
//   }
// };
const handleStartSession = (sid) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition is not supported in this browser.");
    return;
  }

  const newRecognition = new SpeechRecognition();
  newRecognition.continuous = true;
  newRecognition.interimResults = true;
  newRecognition.lang = "en-US";

  newRecognition.onresult = (event) => {
    let fullText = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      fullText += event.results[i][0].transcript;
    }

    const cleaned = fullText.trim();
    setTranscript(cleaned);
    setIsSpeaking(true);

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    silenceTimerRef.current = setTimeout(() => {
      if (cleaned && sid && socketRef.current) {
        sendMessage(cleaned);
      } else {
        console.warn("Delaying message — session or socket not ready");
        setTimeout(() => {
          if (cleaned && sid && socketRef.current) {
            sendMessage(cleaned);
          } else {
            console.error("Message skipped — still no session/socket");
          }
        }, 1000);
      }
      setTranscript("");
      setIsSpeaking(false);
    }, 3000);
  };

  newRecognition.onerror = (e) => {
    if (e.error === "aborted") {
      console.log("🎤 Speech recognition aborted (expected)");
    } else {
      console.error("Speech recognition error:", e.error);
    }
    setIsListening(false);
    setIsSpeaking(false);
  };

  newRecognition.onend = () => {
    console.log("Recognition ended");
    setIsSpeaking(false);
    if (isListening) {
      setTimeout(() => {
        try {
          if (recognitionRef.current && !isSpeaking) {
        recognitionRef.current.start();
        console.log("🔁 Recognition restarted after end");
        }
        } catch (err) {
          console.error("Error restarting recognition:", err);
        }
      }, 300);
    }
  };

  // setRecognition(newRecognition);
recognitionRef.current = newRecognition;
  setIsListening(false); // We'll start after AI speaks
  console.log("✅ handleStartSession called with SID:", sid);

  if (socketRef.current && sid) {
    socketRef.current.emit("text_message", {
      text: "start conversation",
      persona: personaKey || "skeptical",
      session_id: sid,
      system: "workflow",
    });
    console.log("🤖 Sent initial message to AI to start conversation");
  }
};

const handleEndSession = () => {
  setIsListening(false);
  setIsSpeaking(false);
  if (recognitionRef.current) {
    try {
      // recognition.stop();
       recognitionRef.current.stop();
    } catch (e) {
      console.warn("Failed to stop recognition:", e);
    }
  }

  if (silenceTimerRef.current) {
    clearTimeout(silenceTimerRef.current);
  }

  setTranscript("");
  setCaptionLines(["", ""]);
};

// useEffect(() => {
//   const timeout = setTimeout(() => {
//     handleStartSession();
//   }, 500); // Let socket/session initialize

//   return () => clearTimeout(timeout);
// }, []);



  

  // Start/stop camera stream based on isVideoOff
  useEffect(() => {
    if (!isVideoOff) {
      // Turn ON camera
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          cameraStreamRef.current = stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => {
          console.error("Camera access denied:", err)
        })
    } else {
      // Turn OFF camera
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(track => track.stop())
        cameraStreamRef.current = null
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
    // Cleanup on unmount
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(track => track.stop())
        cameraStreamRef.current = null
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [isVideoOff])

  useEffect(() => {
    return () => {
      try {
        setIsListening(false)
        setTranscript('')
        setIsLoading(false)

        // if (recognition) recognition.stop()
        if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

        if (currentAudio) {
          currentAudio.pause()
          currentAudio.currentTime = 0
        }
        if (window.audioStream) {
          window.audioStream.getTracks().forEach(track => track.stop())
          window.audioStream = null
        }
        if (sessionId) {
          fetch(`https://ai-mock-pitching-427457295403.europe-west1.run.app/api/pitch/end/${sessionId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: 'user_ended' })
          }).catch(console.error)
        }
        if (socketRef.current) socketRef.current.disconnect()
      } catch (e) {
        console.error("Cleanup failed:", e)
      }
    }
  }, [])

useEffect(() => {
  if (!socketRef.current) return;

  socketRef.current.on("video_analysis_update", (data) => {
    console.log("📊 Live metrics:", data);
    // You can save to state and show in UI
  });

  socketRef.current.on("video_insights", (data) => {
    console.log("🧠 Final video insights:", data);
    // You can show this in Call Report
  });

  return () => {
    socketRef.current.off("video_analysis_update");
    socketRef.current.off("video_insights");
  };
}, [socketRef.current]);





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
    "What's your go-to-market strategy?",
  ]

  // Initialize WebSocket connection and session
  // useEffect(() => {
  //   // Generate unique session ID
  //   const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  //   setSessionId(newSessionId)

  //   // Connect to WebSocket server with proper error handling
  //   let socket
  //   try {
  //     socket = io('https://ai-mock-pitching-427457295403.europe-west1.run.app/', {
  //       transports: ['websocket', 'polling'],
  //       reconnectionAttempts: 5,
  //       reconnectionDelay: 1000,
  //       timeout: 20000
  //     })
  //     socketRef.current = socket
  //   } catch (error) {
  //     console.error('Error connecting to socket server:', error)
  //     return
  //   }

  //   // Connection events
  //   socket.on('connect', () => {
  //     console.log('Connected to AI server')

  //     // Start a session with the server
  //     const sessionData = {
  //       session_id: newSessionId,
  //       persona: 'skeptical', // Use a specific persona ID that exists on the server
  //       system: 'workflow'
  //     }

  //     console.log('Starting session with data:', sessionData)

  //     // First emit session_started event
  //     socket.emit('session_started', sessionData)

  //     // Don't automatically send initial message
  //     // Let the user control the conversation flow
  //   })

  //   // Connection error handling
  //   socket.on('connect_error', (error) => {
  //     console.error('Socket connection error:', error)
  //     setIsLoading(false)
  //   })

  //   socket.on('connect_timeout', () => {
  //     console.error('Socket connection timeout')
  //     setIsLoading(false)
  //   })

  //   // Listen for AI responses
  //   socket.on('response', (data) => {
  //     console.log('Received response from AI:', data)

  //     // Stop speech recognition while playing audio
  //     if (recognition) {
  //       try {
  //         recognition.stop()
  //       } catch (e) {
  //         // Ignore errors
  //       }
  //     }

  //     // Play audio if available
  //     if (data.audio_url) {
  //       // Construct the full audio URL
  //       let fullAudioUrl;
  //       if (data.audio_url.startsWith('http')) {
  //         fullAudioUrl = data.audio_url;
  //       } else if (data.audio_url.startsWith('/')) {
  //         fullAudioUrl = `https://ai-mock-pitching-427457295403.europe-west1.run.app${data.audio_url}`;
  //       } else {
  //         fullAudioUrl = `https://ai-mock-pitching-427457295403.europe-west1.run.app/${data.audio_url}`;
  //       }

  //       console.log('Playing audio from URL:', fullAudioUrl)

  //       // Try to play the audio
  //       playAudio(fullAudioUrl)
  //     } else {
  //       console.warn('No audio URL in response')
  //       setIsLoading(false)
  //     }

  //     // Update captions with AI response
  //     if (data.message && showCaptions) {
  //       updateCaptionLines(data.message)
  //     }
  //   })

  //   // Listen for session started
  //   socket.on('session_started', (data) => {
  //     console.log('Session started confirmation:', data.session_id)
  //   })

  //   // Listen for errors
  //   socket.on('error', (error) => {
  //     console.error('Socket error:', error)
  //     setIsLoading(false)

  //     // Try to reconnect on error
  //     if (socket && !socket.connected) {
  //       socket.connect()
  //     }
  //   })

  //   // Timer for call duration
  //   const timer = setInterval(() => {
  //     setCallDuration((prev) => prev + 1)
  //   }, 1000)

  //   return () => {
  //     clearInterval(timer)
  //     if (socketRef.current) {
  //       socketRef.current.disconnect()
  //     }
  //     stopSpeechRecognition()
  //   }
  // }, [])


    
 useEffect(() => {
  const initSession = async () => {
    let socket;

    try {
      const uniqueSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const res = await fetch('https://ai-mock-pitching-427457295403.europe-west1.run.app/api/pitch/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: personaKey || 'skeptical',
          system: 'workflow',
          session_id: uniqueSessionId
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to start session");

      setSessionId(uniqueSessionId);
      sessionIdRef.current = uniqueSessionId; 
      console.log("✅ sessionIdRef set to", sessionIdRef.current);
      console.log('✅ Session started with ID:', uniqueSessionId);

      socket = io('https://ai-mock-pitching-427457295403.europe-west1.run.app/', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('✅ Connected to AI server');

        // Emit session_started
        socket.emit('session_started', {
          session_id: uniqueSessionId,
          persona: personaKey || 'skeptical',
          system: 'workflow'
        });
        console.log('🚀 Emitted session_started with ID:', uniqueSessionId);

        // ✅ Directly start the session on client-side
        handleStartSession(uniqueSessionId);

        // Emit video analysis
        socket.emit('start_video_analysis', { session_id: uniqueSessionId });
        console.log('📸 Emitted start_video_analysis');
      });

      // Re-emit session_started on reconnect
      socket.on('reconnect', () => {
        socket.emit('session_started', {
          session_id: uniqueSessionId,
          persona: personaKey || 'skeptical',
          system: 'workflow'
        });
        console.log('🔁 Re-emitted session_started on reconnect');
      });

      // AI response handler
      socket.off('response');
      socket.on('response', (data) => {
        console.log('🧠 AI response:', data);
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (_) { }
        }

        if (data.audio_url) {
          const fullAudioUrl = data.audio_url.startsWith('http')
            ? data.audio_url
            : `https://ai-mock-pitching-427457295403.europe-west1.run.app${data.audio_url.startsWith('/') ? '' : '/'}${data.audio_url}`;
          playAudio(fullAudioUrl);
        } else {
          console.warn('⚠️ No audio URL in response');
          setIsLoading(false);
        }

        if (data.message && showCaptions) {
          updateCaptionLines(data.message);
        }
      });

      // Disconnection handling
      socket.off('disconnect');
      socket.on('disconnect', (reason) => {
        console.warn('❌ Socket disconnected:', reason);

        if (reason === 'io server disconnect') {
          console.log('🔄 Attempting reconnect (server disconnect)');
          socket.connect();
        } else if (reason === 'transport close' || reason === 'ping timeout') {
          console.log('📡 Reconnecting due to network interruption');
          socket.connect();
        } else if (reason === 'io client disconnect') {
          console.log('✅ Socket cleanly disconnected by client');
        } else {
          console.log('ℹ️ Disconnected for unknown reason. Not reconnecting.');
        }
      });

      socket.off('connect_error');
      socket.on('connect_error', (err) => {
        console.error('❌ Socket connect error:', err);
        setIsLoading(false);
      });

      socket.off('connect_timeout');
      socket.on('connect_timeout', () => {
        console.error('⏰ Socket timeout');
        setIsLoading(false);
      });

      socket.off('error');
      socket.on('error', (err) => {
        console.error('🔥 Socket error:', err);
        setIsLoading(false);
        if (!socket.connected) socket.connect();
      });

      // Call timer to track call duration
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // Cleanup on unmount
      return () => {
        clearInterval(timer);
        if (socketRef.current) socketRef.current.disconnect();
        stopSpeechRecognition();
      };
    } catch (err) {
      console.error('❌ Error in initSession:', err);
      setIsLoading(false);
    }
  };

  initSession();
}, [personaKey]);




  // Start speech recognition - no longer used
  const startSpeechRecognition = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
      return
    }

    // Stop any existing recognition first
    if (recognition) {
      recognition.stop()
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognitionInstance = new SpeechRecognition()

    recognitionInstance.continuous = true
    recognitionInstance.interimResults = true
    recognitionInstance.lang = 'en-US'

    recognitionInstance.onresult = (event) => {
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
          setTranscript(prev => prev ? prev + ' ' + finalTranscript.trim() : finalTranscript.trim())
        }
      }
    }

    recognitionInstance.onstart = () => {
      setIsListening(true)
    }

    recognitionInstance.onend = () => {
      if (isListening) {
        setTimeout(() => recognitionInstance.start(), 100)
      }
    }

    recognitionInstance.onerror = () => {
      setIsListening(false)
    }

    try {
      recognitionInstance.start()
      recognitionRef.current=recognitionInstance;
    } catch (error) {
      setIsListening(false)
    }
  }

  // Stop speech recognition - no longer used
  const stopSpeechRecognition = () => {
    setIsListening(false)
    if (recognition) {
      recognition.stop()
    }
  }

  // Function to send message to AI
  const sendMessage = (text) => {
    const sid = sessionIdRef.current;
const socket = socketRef.current;

if (!text.trim()) {
  console.error("Cannot send: text is empty");
  return;
}
if (!sid) {
  console.error("Cannot send: sessionId is missing");
  return;
}
if (!socket || !socket.connected) {
  console.error("Cannot send: socket is not connected");
  return;
}


    // Don't send if we're already waiting for a response
    if (isLoading) {
      console.log('Already waiting for a response, ignoring new message')
      return
    }

    setIsLoading(true) // Show loading indicator while waiting for response
    setIsListening(false) // Stop listening mode

    // Stop speech recognition while sending message
    if (recognitionRef.current) {
  recognitionRef.current.stop();
}

    const messageData = {
      text: text.trim(),
      persona: personaKey || 'skeptical',
      session_id: sid,
      system: 'workflow'
    };

    console.log('Sending message to AI:', messageData)

    // Send to backend
    socketRef.current.emit('text_message', messageData)

    // Clear transcript after sending
    setTranscript('')
  }

  const updateCaptionLines = (newText) => {
    const words = newText.split(" ")
    const maxWordsPerLine = 8

    if (words.length <= maxWordsPerLine) {
      setCaptionLines([newText, ""])
    } else if (words.length <= maxWordsPerLine * 2) {
      const firstLine = words.slice(0, maxWordsPerLine).join(" ")
      const secondLine = words.slice(maxWordsPerLine).join(" ")
      setCaptionLines([firstLine, secondLine])
    } else {
      const totalWords = words.length
      const firstLine = words.slice(totalWords - maxWordsPerLine * 2, totalWords - maxWordsPerLine).join(" ")
      const secondLine = words.slice(totalWords - maxWordsPerLine).join(" ")
      setCaptionLines([firstLine, secondLine])
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event) => {
        let interimTranscript = ""
        let finalTranscript = ""

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
        console.error("Speech recognition error:", event.error)
        // setIsListening(false)
        if (e.error !== "aborted") {
            setTimeout(() => {
              try {
                recognitionRef.current.start();
                console.log("🔁 Restarted recognition after error");
              } catch (err) {
                console.error("Error restarting recognition after error:", err);
              }
            }, 300);
          }
      }

      recognitionInstance.onend = () => {
        if (isListening && showCaptions) {
          setTimeout(() => {
            recognitionInstance.start()
          }, 100)
        }
      }

      recognitionRef.current=recognitionInstance;
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
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Just clean up resources without ending the call
  const handleEndCallButton = () => {
    // Stop speech recognition
    setIsListening(false)
    if (recognition) {
      try {
        recognition.stop()
      } catch (e) { }
    }

    // Stop any playing audio
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
    }

    // Clear transcript
    setTranscript('')

    console.log('End call button clicked - resources cleaned up')
  }



  // Play audio from URL
 const playAudio = (audioUrl) => {
  if (!audioUrl) {
    console.error('No audio URL provided');
    setIsLoading(false);
    return;
  }

  console.log('Attempting to play audio from URL:', audioUrl);

  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const audio = new Audio();
  const finalUrl = audioUrl + (audioUrl.includes('?') ? '&' : '?') + `t=${Date.now()}`;

  audio.src = finalUrl;
  audio.crossOrigin = 'anonymous';
  // currentAudio.current = audio;
  setCurrentAudio(audio);

  audio.addEventListener('canplaythrough', () => {
    console.log('Audio ready to play');
  });

  audio.addEventListener('playing', () => {
    console.log('Audio is now playing');
  });

  audio.onerror = (e) => {
    console.error('Audio error:', e);
    setIsLoading(false);

    // Try direct fetch to debug CORS or availability issues
    fetch(audioUrl)
      .then(response => {
        console.log('Audio URL fetch response:', response.status);
        if (!response.ok) {
          console.error('Audio URL not accessible:', response.status);
        }
      })
      .catch(err => console.error('Error fetching audio URL:', err));
  };

  audio.onended = () => {
    console.log('🔊 Audio playback finished');
    setIsLoading(false);

    // if (!isListening) {
    //     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    //     if (!SpeechRecognition) {
    //         console.error("Speech recognition not supported");
    //         return;
    //     }

    //     const newRecognition = new SpeechRecognition();
    //     newRecognition.continuous = true;
    //     newRecognition.interimResults = true;
    //     newRecognition.lang = "en-US";

    //     newRecognition.onresult = (event) => {
    //         let fullText = "";
    //         for (let i = event.resultIndex; i < event.results.length; i++) {
    //             fullText += event.results[i][0].transcript;
    //         }

    //         const cleaned = fullText.trim();
    //         setTranscript(cleaned);
    //         setIsSpeaking(true);

    //         if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    //         silenceTimerRef.current = setTimeout(() => {
    //             if (cleaned && sessionId && socketRef.current) {
    //                 sendMessage(cleaned);
    //             } else {
    //                 console.warn("Delaying message — session or socket not ready");
    //             }
    //             setTranscript("");
    //             setIsSpeaking(false);
    //         }, 3000);
    //     };

    //     newRecognition.onerror = (e) => {
    //         if (e.error === "aborted") {
    //             console.log("🎤 Speech recognition aborted (expected)");
    //         } else {
    //             console.error("Speech recognition error:", e.error);
    //         }
    //         setIsListening(false);
    //         setIsSpeaking(false);
    //     };

    //     newRecognition.onend = () => {
    //         console.log("Recognition ended");
    //         setIsSpeaking(false);
    //         if (isListening) {
    //             setTimeout(() => {
    //                 try {
    //                     newRecognition.start();
    //                     console.log("🎤 Restarted recognition after end");
    //                 } catch (err) {
    //                     console.error("Error restarting recognition:", err);
    //                 }
    //             }, 300);
    //         }
    //     };

    //     try {
    //         newRecognition.start();
    //         // setRecognition(newRecognition);
    //         recognitionRef.current.start();
    //         setIsListening(true);
    //         console.log("🎤 New speech recognition started after AI finished.");
    //     } catch (e) {
    //         console.error("Failed to start recognition:", e);
    //     }
    // }
    if (!isListening) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.error("Speech recognition not supported");
        return;
    }

    const newRecognition = new SpeechRecognition();
    newRecognition.continuous = true;
    newRecognition.interimResults = true;
    newRecognition.lang = "en-US";

    newRecognition.onresult = (event) => {
        let fullText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            fullText += event.results[i][0].transcript;
        }

        const cleaned = fullText.trim();
        setTranscript(cleaned);
        setIsSpeaking(true);

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        silenceTimerRef.current = setTimeout(() => {
            if (cleaned && sessionIdRef.current && socketRef.current) {
                sendMessage(cleaned);
            } else {
                console.warn("Delaying message — session or socket not ready");
            }
            setTranscript("");
            setIsSpeaking(false);
        }, 3000);
    };

    newRecognition.onerror = (e) => {
        if (e.error === "aborted") {
            console.log("🎤 Speech recognition aborted (expected)");
        } else {
            console.error("Speech recognition error:", e.error);
        }
        setIsListening(false);
        setIsSpeaking(false);
    };

    newRecognition.onend = () => {
        console.log("Recognition ended");
        setIsSpeaking(false);
        if (isListening) {
            setTimeout(() => {
                try {
                    recognitionRef.current.start();
                    console.log("🎤 Restarted recognition after end");
                } catch (err) {
                    console.error("Error restarting recognition:", err);
                }
            }, 300);
        }
    };

    recognitionRef.current = newRecognition;

    try {
        recognitionRef.current.start();
        setIsListening(true);
        console.log("🎤 New speech recognition started after AI finished.");
    } catch (e) {
        console.error("Failed to start recognition:", e);
    }
}

};


  // audio.onended = () => {
  //   console.log('🔊 Audio playback finished');
  //   setIsLoading(false);

  //   // ✅ Now start recognition
  //   if (recognition && !isListening) {
  //     try {
  //       recognition.start();
  //       setIsListening(true);
  //       console.log("🎤 Speech recognition restarted after AI finished speaking.");
  //     } catch (e) {
  //       console.error("Failed to restart recognition:", e);
  //     }
  //   }
  // };

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log('Audio playback started successfully');
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error playing audio:', error);
        setIsLoading(false);

        // Fallback: try DOM audio element
        const audioElement = document.createElement('audio');
        audioElement.src = finalUrl;
        audioElement.controls = false;
        audioElement.style.display = 'none';
        document.body.appendChild(audioElement);

        audioElement.onended = () => {
          document.body.removeChild(audioElement);
          setIsLoading(false);
        };

        audioElement.play().catch(e => {
          console.error('Alternative audio playback failed:', e);
        });
      });
  }
};


  const toggleCaptions = () => {
    setShowCaptions(!showCaptions)

    if (!showCaptions) {
      setCaptionLines(["", ""])
      setIsListening(true)
      if (recognition) {
        try {
          recognition.start()
        } catch (error) {
          console.error("Error starting recognition:", error)
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
  className={`fixed inset-0 z-50 transition-all duration-700 ease-in-out ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}
      bg-black px-4 sm:px-8 md:px-16 pb-24 sm:pb-32 md:pb-48
      ${topPadding}
      transition-all duration-300 ease-in opacity-700 ease-transform-700`}
>
  {showCaptions && (
    <div
      className="absolute top-0 left-0 w-full flex justify-center z-10 transition-all duration-300 ease-in-out pt-4 sm:pt-8"
    >
      <div className="flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2">
        <div
          className="rounded-full overflow-hidden w-6 h-6 sm:w-7.5 sm:h-7.5"
        >
          <img src="/api/placeholder/30/30" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <span
          className="text-white font-inter text-xs sm:text-sm font-medium"
        >
          {currentQuestion}
        </span>
      </div>
    </div>
  )}

  {showCaptions && (captionLines[0] || captionLines[1]) && (
    <div
      className="absolute top-0 left-0 w-full flex justify-center z-10 transition-all duration-300 ease-in-out pt-12 sm:pt-16 md:pt-24"
    >
      <div className="px-3 py-2 sm:px-6 sm:py-3 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-4xl text-center">
        <div
          className="text-white text-center font-inter text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light leading-normal"
        >
          {captionLines[0] && (
            <div style={{ marginBottom: captionLines[1] ? "0.5rem" : "0" }}>{captionLines[0]}</div>
          )}
          {captionLines[1] && <div>{captionLines[1]}</div>}
        </div>
      </div>
    </div>
  )}

  {showCaptions && isListening && (
    <div className="absolute top-0 right-4 sm:right-8 z-10 flex items-center gap-1 sm:gap-2 pt-4 sm:pt-8">
      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse" />
      <span
        className="text-white font-inter text-xxs sm:text-xs font-normal"
      >
        Listening...
      </span>
    </div>
  )}

    <div className="w-full h-full flex flex-col md:flex-row gap-4 md:gap-8">
    {/* LEFT CARD: Show camera feed and profile info */}
    <div
      className="flex-1 relative transition-all duration-700 ease-in-out rounded-[0.625rem] overflow-hidden bg-gradient-to-b from-[#1C60CE] to-[#0F0F0F]"
    >
      {/* Name and company above camera */}
      <div
        className="absolute top-4 left-4 px-2 py-1 sm:px-4 sm:py-2 text-white font-inter text-xs sm:text-sm font-medium z-[2]"
      >
        {profileData?.accountName && profileData?.companyName
          ? `${profileData.accountName} | ${profileData.companyName}`
          : "User | Company"}
      </div>
      {/* Camera feed */}
      <div className="w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-4/5 h-4/5 rounded-xl sm:rounded-2xl object-cover bg-[#222] ${isVideoOff ? "hidden" : "block"}`}
        />
        {isVideoOff && (
          <div
            className="w-4/5 h-4/5 rounded-xl sm:rounded-2xl bg-[#222] flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl absolute"
          >
            Camera Off
          </div>
        )}
      </div>
      {/* Video toggle button */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => setIsVideoOff(v => !v)}
          className="flex items-center justify-center rounded-full hover:opacity-80 transition-all duration-300 transform hover:scale-110 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-transparent border-[1px] border-white"
          aria-label={isVideoOff ? "Turn camera on" : "Turn camera off"}
        >
          {isVideoOff ? (
            <img className="w-5 h-5 sm:w-6 h-6"
              src={VideoOffIcon}
              alt="Video Off"
            />
          ) : (
            <img
              src={VideoIcon}
              alt="Video On"
              className="w-5 h-5 sm:w-6 h-6"
            />
          )}
        </button>
      </div>

      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex items-center justify-center rounded-full hover:opacity-80 transition-opacity w-10 h-10 sm:w-[3.125rem] sm:h-[3.125rem] bg-transparent border-[1px] border-white"
        >
          {isMuted ? (
            <img
              src={MicOffIcon}
              alt="Mic Off"
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          ) : (
            <img
              src={MicIcon}
              alt="Mic On"
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          )}
        </button>

      </div>
    </div>

    <div
      className="flex-1 relative transition-all duration-700 ease-in-out flex flex-col rounded-[0.625rem] overflow-hidden bg-gradient-to-b from-[#9F67FF] to-[#0F0F0F] bg-[#C4C4C4]"
    >
      <div className="absolute top-4 left-4 px-2 py-1 sm:px-4 sm:py-2 text-white font-inter text-xs sm:text-sm font-medium">
        Persona One | Example Capital
      </div>

      <div className="w-full h-full flex items-center justify-center flex-col">
        <div className="flex items-center justify-center rounded-full border-[6px] sm:border-[10px] border-purple-400 mb-4 sm:mb-8 w-[8rem] h-[8rem] sm:w-[10.625rem] sm:h-[10.625rem]">
          <div
            className="rounded-full overflow-hidden w-[7.5rem] h-[7.5rem] sm:w-[9.375rem] sm:h-[9.375rem] bg-gray-600"
          >
            <img
              src={investor?.image || "/api/placeholder/150/150"}
              alt={investor?.name || "Persona One"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none"
                e.target.nextSibling.style.display = "flex"
              }}
            />
            <div className="w-full h-full bg-gray-600 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold hidden">
              {investor?.name?.charAt(0) || "P"}
            </div>
          </div>
        </div>

        <div className="text-center py-2 px-4 sm:py-4 sm:px-8 bg-gray-800 bg-opacity-50 rounded-lg mb-4 sm:mb-6 mx-4 sm:mx-0">
          {isLoading ? (
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-500 animate-pulse"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          ) : null}
          <p className="text-white text-sm sm:text-base mb-2 sm:mb-4">
            {isLoading ? "AI is responding..." :
              isListening ? "Listening... Click Stop when done" :
                "Click speak to start speaking"}
          </p>

          <div className="flex justify-center gap-2 sm:gap-4">
            <button
              onClick={() => {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
                if (!SpeechRecognition) {
                  alert('Speech recognition not supported in this browser')
                  return
                }

                if (isListening) {
                  // Stop listening
                  if (recognition) {
                    try {
                      recognition.abort()
                      recognition.stop()
                    } catch (e) { }
                  }
                  setIsListening(false)
                } else {
                  // Start listening with a new instance
                  if (recognition) {
                    try {
                      recognition.abort()
                      recognition.stop()
                    } catch (e) { }
                  }

                  setTimeout(() => {
                    try {
                      const recognitionInstance = new SpeechRecognition()
                      recognitionInstance.continuous = true
                      recognitionInstance.interimResults = false
                      recognitionInstance.lang = 'en-US'

                      recognitionInstance.onresult = (event) => {
                        const last = event.results.length - 1
                        const transcript = event.results[last][0].transcript
                        setTranscript(prev => prev ? prev + ' ' + transcript.trim() : transcript.trim())
                      }

                      recognitionInstance.onend = () => {
                        if (isListening) {
                          try {
                            recognitionInstance.start()
                          } catch (e) { }
                        }
                      }

                      recognitionInstance.start()
                      setRecognition(recognitionInstance)
                      setIsListening(true)
                    } catch (e) {
                      console.error('Failed to start recognition:', e)
                    }
                  }, 100)
                }
              }}
              disabled={isLoading}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              style={{
                background: isListening ? "#E10004" : "#1C60CE",
                color: "white",
                fontWeight: "500",
                opacity: isLoading ? "0.5" : "1",
              }}
            >
              {isListening ? "Stop" : "Speak"}
            </button>

            <button
              onClick={() => {
                if (transcript) {
                  sendMessage(transcript)
                }
              }}
              disabled={!transcript || isLoading}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-all duration-300 transform hover:scale-105 bg-[#AD6FDE] text-white font-medium text-sm sm:text-base ${(!transcript || isLoading) ? "opacity-50" : "opacity-100"}`}
            >
              Send
            </button>
          </div>

          {transcript && (
            <div className="mt-3 p-2 sm:p-3 bg-gray-700 bg-opacity-50 rounded-md max-h-24 sm:max-h-32 overflow-y-auto text-left">
              <p className="text-white text-xs sm:text-sm">{transcript}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

  <div
    className="fixed left-0 w-full flex justify-between items-center px-4 sm:px-8 bottom-4 sm:bottom-8"
  >
    <div className="text-white font-inter text-sm sm:text-base md:text-xl font-normal">
      {formatTime(callDuration)} | Mock Pitching
    </div>

    <div className="flex gap-2 sm:gap-4">
      <button className="text-white hover:opacity-80 transition-all duration-300 transform hover:scale-110">
        <img
          src={PresentationIcon}
          alt="Presentation Icon"
          className="w-4 h-4 sm:w-5 h-5"
        />
      </button>

      <button
        onClick={toggleCaptions}
        className={`hover:opacity-80 flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-110 ${showCaptions ? "w-8 h-8 sm:w-10 h-10 bg-[#1C60CE]" : "w-auto h-auto bg-transparent"}`}
      >
        <img
          src={CaptionIcon}
          alt="Captions"
          className="w-4 h-4 sm:w-5 h-5"
        />
      </button>

    </div>
  </div>

  <div className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-60 w-full px-4 sm:px-0">
    <button
      onClick={onEndCall}
      className="flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 transform hover:scale-105 w-full max-w-xs sm:w-50 h-10 rounded-[0.125rem] bg-[#E10004] text-white font-inter text-xs sm:text-sm font-semibold mx-auto"
    >
      <img
        src={EndCallIcon}
        alt="End Call Icon"
        className="w-3 h-3 sm:w-3.5 h-3.5"
      />
      End Call
    </button>
  </div>
</div>
  )
}

function MockPitching({ onBack, loading  }) {
  const { profileData } = useStartupProfile()
  const socketRef = useRef(null);
  const [investors, setInvestors] = useState([])
  const [investorsLoading, setInvestorsLoading] = useState(true)
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
  const sessionIdRef = useRef(null);
  const [analysis, setAnalysis] = useState(null);
  const navigate = useNavigate();

  const filteredInvestors = investors.filter(investor =>
  investor.name.toLowerCase().includes(searchQuery.toLowerCase())
);


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
    setInvestorsLoading(true)
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
      .finally(() => {
        setInvestorsLoading(false)
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

        // setTimeout(() => {
        //   const evt = new Event('startSessionTrigger');
        //   window.dispatchEvent(evt);
        // }, 100);

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

       const previous = JSON.parse(localStorage.getItem("pitch_reports") || "[]");
        const newReport = {
          timestamp: Date.now(),
          score: result.analysis.overall_score,
          result: result.analysis.overall_rating,
          report: result.analysis,
          investorName: callingInvestor?.name || "Persona One",
          investorImage: callingInvestor?.image || null,
          duration: Math.floor(result.analysis.session_duration_minutes * 60),
        };
        localStorage.setItem("pitch_reports", JSON.stringify([newReport, ...previous]));

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
    navigate("/playground/mockpitching/report");
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
      sessionIdRef={sessionIdRef} 
      profileData={profileData}
      personaKey={getPersonaKey(callingInvestor)}
    />
  }

  if (loading || investorsLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-white font-inter text-sm font-medium">
            {loading ? "Loading..." : "Loading available investors..."}
          </p>
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

          <div className=" mb-12 pb-12">
            {filteredInvestors.map((investor) => (
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
                              style={ {
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

// Helper to extract personaKey from investor object
function getPersonaKey(investor) {
  if (!investor || !investor.tags) return "skeptical";
  const tag = investor.tags.find(t => t.type === "brown");
  return tag ? tag.text : "skeptical";
}

export default MockPitching