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
} from "lucide-react"

// Import the new CallReportPage component
import CallReportPage from "./callReportPage"
import { useStartupProfile } from "../context/StartupProfileContext"

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
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [hasMediaPermissions, setHasMediaPermissions] = useState(false)

  // Request media permissions when component mounts
  useEffect(() => {
    if (showFullInterface) {
      requestMediaPermissions()
    }
  }, [showFullInterface])

  // Function to request media permissions
  const requestMediaPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
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
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0, 0, 0, 0.9)",
      }}
    >
      <div className="w-full h-full flex">
        <div className="flex-1 flex items-center justify-center relative">
          <div
            className="relative transition-all duration-500 ease-in-out"
            style={{
              width: "40rem",
              height: "22.5rem",
              borderRadius: "0.625rem",
              overflow: "hidden",
              background: "linear-gradient(180deg, #1C60CE 0%, #0F0F0F 100%)",
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={investor?.image || "/api/placeholder/150/150"}
                alt={investor?.name || "Investor"}
                className="rounded-full object-cover"
                style={{
                  width: "9.375rem",
                  height: "9.375rem",
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
                  height: "9.375rem",
                }}
              >
                {"P"}
              </div>
            </div>            <div
              className="absolute top-4 left-4 px-3 py-1"
              style={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              {profileData?.accountName && profileData?.companyName 
                ? `${profileData.accountName} | ${profileData.companyName}`
                : "User | Company"}
            </div>

            <div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2"
              style={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "1rem",
                fontWeight: 500,
              }}
            >
              Calling...
            </div>

            <div className="absolute bottom-4 left-4 flex gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="flex items-center justify-center rounded-full hover:opacity-80 transition-opacity border"
                style={{
                  width: "3.125rem",
                  height: "3.125rem",
                  background: "transparent",
                  borderWidth: "1px",
                  borderColor: "#FFF",
                }}
              >
                {isMuted ? (
                  <img
                    src={MicOffIcon}
                    alt="Mic Off"
                    style={{ width: "1.5rem", height: "1.5rem" }}
                  />
                ) : (
                  <img
                    src={MicIcon}
                    alt="Mic On"
                    style={{ width: "1.5rem", height: "1.5rem" }}
                  />
                )}
              </button>

            </div>

            <div className="absolute bottom-4 right-4">
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className="flex items-center justify-center rounded-full hover:opacity-80 transition-opacity border"
                style={{
                  width: "3.125rem",
                  height: "3.125rem",
                  background: "transparent",
                  borderWidth: "1px",
                  borderColor: "#FFF",
                }}
              >
                {isVideoOff ? (
                  <img
                    src={VideoOffIcon}
                    alt="Video Off"
                    style={{ width: "1.5rem", height: "1.5rem" }}
                  />
                ) : (
                  <img
                    src={VideoIcon}
                    alt="Video On"
                    style={{ width: "1.5rem", height: "1.5rem" }}
                  />
                )}
              </button>

            </div>
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-center transition-all duration-500 ease-in-out"
          style={{
            width: "33rem",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.8)",
            padding: "2rem 1rem",
          }}
        >
          <div className="text-center mb-8">
            <h2
              className="mb-4"
              style={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "1.5rem",
                fontWeight: 500,
              }}
            >
              Ready to join?
            </h2>

            <div className="flex justify-center mb-4">
              <div
                className="rounded-full overflow-hidden bg-gray-600"
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
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
                fontWeight: 500,
              }}
            >
              {investor?.name || "Persona One"} is in this call
            </p>

            <div className="space-y-3 w-full flex flex-col items-center">
              <button
                onClick={onJoinCall}
                className="hover:opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                style={{
                  width: "15rem",
                  height: "3.25rem",
                  borderRadius: "0.1875rem",
                  background: "#FFF",
                  color: "#000",
                  fontFamily: "Inter",
                  fontSize: "1rem",
                  fontWeight: 600,
                  border: "none",
                }}
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
                className="hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                style={{
                  width: "15rem",
                  height: "3.25rem",
                  borderRadius: "0.1875rem",
                  background: "#0F0E16",
                  color: "#FFF",
                  fontFamily: "Inter",
                  fontSize: "1rem",
                  fontWeight: 500,
                  border: "1px solid #D9D9D9",
                }}
              >
                Invite Co-founder
              </button>
            </div>
          </div>
        </div>
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

function VideoCallInterface({ investor, onEndCall, isTransitioning = false, sessionId, setSessionId, profileData }) {
  const [callDuration, setCallDuration] = useState(0)
  const [showCaptions, setShowCaptions] = useState(false)
  const [captionLines, setCaptionLines] = useState(["", ""])
  const [currentQuestion, setCurrentQuestion] = useState("What are you building exactly?")
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [transcript, setTranscript] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const socketRef = useRef(null)
  const silenceTimerRef = useRef(null)
  const questionIndexRef = useRef(0)
  const [currentAudio, setCurrentAudio] = useState(null)
  const videoRef = useRef(null)
  const cameraStreamRef = useRef(null) // <-- Add this ref

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

        if (recognition) recognition.stop()
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
        // Generate a unique session ID
        const uniqueSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Step 1: Start session via backend
        const res = await fetch('https://ai-mock-pitching-427457295403.europe-west1.run.app/api/pitch/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            persona: 'skeptical',
            system: 'workflow',
            session_id: uniqueSessionId
          })
        });

        const data = await res.json();
        // Use our unique session ID instead of the one from the API
        setSessionId(uniqueSessionId); // ✅ Save valid sessionId
        console.log('✅ Session started with ID:', uniqueSessionId);

        // Step 2: Connect to WebSocket
        socket = io('https://ai-mock-pitching-427457295403.europe-west1.run.app/', {
          transports: ['websocket', 'polling'],
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 20000
        });
        socketRef.current = socket;

        socket.on('connect', () => {
          console.log('✅ Connected to AI server');
          socket.emit('session_started', {
            session_id: uniqueSessionId,
            persona: 'skeptical',
            system: 'workflow'
          });
          console.log('🚀 Emitted session_started with ID:', uniqueSessionId);
        });

        socket.on('response', (data) => {
          console.log('🧠 AI response:', data);

          if (recognition) {
            try {
              recognition.stop();
            } catch (_) { }
          }

          if (data.audio_url) {
            const fullAudioUrl = data.audio_url.startsWith('http')
              ? data.audio_url
              : `https://ai-mock-pitching-427457295403.europe-west1.run.app${data.audio_url.startsWith('/') ? '' : '/'}${data.audio_url}`;

            console.log('🔊 Playing audio:', fullAudioUrl);
            playAudio(fullAudioUrl);
          } else {
            console.warn('⚠️ No audio URL in response');
            setIsLoading(false);
          }

          if (data.message && showCaptions) {
            updateCaptionLines(data.message);
          }
        });

        socket.on('session_started', (data) => {
          console.log('🟢 Server confirmed session:', data.session_id);
        });

        socket.on('connect_error', (err) => {
          console.error('❌ Socket connect error:', err);
          setIsLoading(false);
        });

        socket.on('connect_timeout', () => {
          console.error('⏰ Socket timeout');
          setIsLoading(false);
        });

        socket.on('error', (err) => {
          console.error('🔥 Socket error:', err);
          setIsLoading(false);
          if (socket && !socket.connected) {
            socket.connect();
          }
        });

        const timer = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);

        // Cleanup
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
  }, []);


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
      setRecognition(recognitionInstance)
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
    if (!text.trim() || !sessionId || !socketRef.current) {
      console.error('Cannot send message: missing text, sessionId, or socket connection')
      return
    }

    // Don't send if we're already waiting for a response
    if (isLoading) {
      console.log('Already waiting for a response, ignoring new message')
      return
    }

    setIsLoading(true) // Show loading indicator while waiting for response
    setIsListening(false) // Stop listening mode

    // Stop speech recognition while sending message
    if (recognition) {
      recognition.stop()
    }

    const messageData = {
      text: text.trim(),
      persona: 'skeptical', // Use a specific persona ID that exists on the server
      session_id: sessionId,
      system: 'workflow'
    }

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
      console.error('No audio URL provided')
      setIsLoading(false)
      return
    }

    console.log('Attempting to play audio from URL:', audioUrl)

    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
    }

    // Create new audio element
    const audio = new Audio()

    // Add event listeners
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e)
      console.error('Audio error code:', e.target.error ? e.target.error.code : 'unknown')
      setIsLoading(false)

      // Try with a direct fetch to check if the URL is accessible
      fetch(audioUrl)
        .then(response => {
          console.log('Audio URL fetch response:', response.status)
          if (!response.ok) {
            console.error('Audio URL not accessible:', response.status)
          }
        })
        .catch(err => console.error('Error fetching audio URL:', err))
    })

    audio.addEventListener('canplaythrough', () => {
      console.log('Audio ready to play')
    })

    audio.addEventListener('playing', () => {
      console.log('Audio is now playing')
    })

    // Add cache busting parameter
    const finalUrl = audioUrl + (audioUrl.includes('?') ? '&' : '?') + `t=${Date.now()}`
    console.log('Final audio URL with cache busting:', finalUrl)
    audio.src = finalUrl
    audio.crossOrigin = 'anonymous' // Try with CORS enabled

    setCurrentAudio(audio)

    // Play the audio
    const playPromise = audio.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Audio playback started successfully')
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Error playing audio:', error)
          setIsLoading(false)

          // Try an alternative approach - create an audio element in the DOM
          const audioElement = document.createElement('audio')
          audioElement.src = finalUrl
          audioElement.controls = false
          audioElement.style.display = 'none'
          document.body.appendChild(audioElement)

          audioElement.onended = () => {
            document.body.removeChild(audioElement)
            setIsLoading(false) // Don't set loading to true here
          }

          audioElement.play().catch(e => console.error('Alternative audio playback failed:', e))
        })
    }

    audio.onended = () => {
      console.log('Audio playback finished')
      setIsLoading(false) // Set loading to false when audio finishes

      // Don't automatically restart speech recognition
      // Let the user control when to start listening again
    }
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
      className={`fixed inset-0 z-50 transition-all duration-700 ease-in-out ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
      style={{
        background: "#000000",
        paddingLeft: "4rem",
        paddingRight: "4rem",
        paddingTop: topPadding,
        paddingBottom: "12rem",
        transition: "padding-top 0.3s ease, opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {showCaptions && (
        <div
          className="absolute top-0 left-0 w-full flex justify-center z-10 transition-all duration-300 ease-in-out"
          style={{ paddingTop: "2rem" }}
        >
          <div className="flex items-center gap-2 px-4 py-2">
            <div
              className="rounded-full overflow-hidden"
              style={{
                width: "1.875rem",
                height: "1.875rem",
              }}
            >
              <img src="/api/placeholder/30/30" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <span
              style={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              {currentQuestion}
            </span>
          </div>
        </div>
      )}

      {showCaptions && (captionLines[0] || captionLines[1]) && (
        <div
          className="absolute top-0 left-0 w-full flex justify-center z-10 transition-all duration-300 ease-in-out"
          style={{ paddingTop: "6rem" }}
        >
          <div className="px-6 py-3 max-w-4xl text-center">
            <div
              style={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Inter",
                fontSize: "2rem",
                fontWeight: 300,
                lineHeight: "1.5",
              }}
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
        <div className="absolute top-0 right-8 z-10 flex items-center gap-2" style={{ paddingTop: "2rem" }}>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span
            style={{
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "0.75rem",
              fontWeight: 400,
            }}
          >
            Listening...
          </span>
        </div>
      )}

      <div className="w-full h-full flex gap-8">
        {/* LEFT CARD: Show camera feed and profile info */}
        <div
          className="flex-1 relative transition-all duration-700 ease-in-out"
          style={{
            borderRadius: "0.625rem",
            overflow: "hidden",
            background: "linear-gradient(180deg, #1C60CE 0%, #0F0F0F 100%)",
          }}
        >
          {/* Name and company above camera */}
          <div
            className="absolute top-6 left-6 px-4 py-2"
            style={{
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "0.875rem",
              fontWeight: 500,
              zIndex: 2,
            }}
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
              style={{
                width: "80%",
                height: "80%",
                borderRadius: "1rem",
                objectFit: "cover",
                background: "#222",
                backgroundColor: isVideoOff ? "#222" : undefined,
                display: isVideoOff ? "none" : "block",
              }}
            />
            {isVideoOff && (
              <div
                style={{
                  width: "80%",
                  height: "80%",
                  borderRadius: "1rem",
                  background: "#222",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "2rem",
                  fontWeight: 500,
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              >
                Camera Off
              </div>
            )}
          </div>
          {/* Video toggle button */}
          <div className="absolute bottom-4 right-4">
            <button
              onClick={() => setIsVideoOff(v => !v)}
              className="flex items-center justify-center rounded-full hover:opacity-80 transition-all duration-300 transform hover:scale-110 border"
              style={{
                width: "3.5rem",
                height: "3.5rem",
                background: "transparent",
                borderWidth: "1px",
                borderColor: "#FFF",
              }}
              aria-label={isVideoOff ? "Turn camera on" : "Turn camera off"}
            >
              {isVideoOff ? (
                <img
                  src={VideoOffIcon}
                  alt="Video Off"
                  style={{ width: "1.5rem", height: "1.5rem" }}
                />
              ) : (
                <img
                  src={VideoIcon}
                  alt="Video On"
                  style={{ width: "1.5rem", height: "1.5rem" }}
                />
              )}
            </button>
          </div>

          <div className="absolute bottom-4 left-4 flex gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center justify-center rounded-full hover:opacity-80 transition-opacity border"
              style={{
                width: "3.125rem",
                height: "3.125rem",
                background: "transparent",
                borderWidth: "1px",
                borderColor: "#FFF",
              }}
            >
              {isMuted ? (
                <img
                  src={MicOffIcon}
                  alt="Mic Off"
                  style={{ width: "1.5rem", height: "1.5rem" }}
                />
              ) : (
                <img
                  src={MicIcon}
                  alt="Mic On"
                  style={{ width: "1.5rem", height: "1.5rem" }}
                />
              )}
            </button>

          </div>
        </div>

        <div
          className="flex-1 relative transition-all duration-700 ease-in-out flex flex-col"
          style={{
            borderRadius: "0.625rem",
            overflow: "hidden",
            background: "linear-gradient(180deg, #9F67FF 0%, #0F0F0F 100%), #C4C4C4",
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

          <div className="w-full h-full flex items-center justify-center flex-col">
            <div
              className="flex items-center justify-center rounded-full border-[10px] border-purple-400 mb-8"
              style={{
                width: "10.625rem",
                height: "10.625rem",
              }}
            >
              <div
                className="rounded-full overflow-hidden bg-gray-600"
                style={{
                  width: "9.375rem",
                  height: "9.375rem",
                }}
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
                <div
                  className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-4xl font-bold"
                  style={{ display: "none" }}
                >
                  {investor?.name?.charAt(0) || "P"}
                </div>
              </div>
            </div>

            <div className="text-center py-4 px-8 bg-gray-800 bg-opacity-50 rounded-lg mb-6">
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                  <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              ) : null}
              <p className="text-white mb-4">
                {isLoading ? "AI is responding..." :
                  isListening ? "Listening... Click Stop when done" :
                    "Click speak to start speaking"}
              </p>

              <div className="flex justify-center gap-4">
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
                  className="px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: isListening ? "#E10004" : "#1C60CE",
                    color: "white",
                    fontWeight: "500",
                    opacity: isLoading ? "0.5" : "1",
                  }}
                >
                  {isListening ? "Stop" : "speak"}
                </button>

                <button
                  onClick={() => {
                    if (transcript) {
                      sendMessage(transcript)
                    }
                  }}
                  disabled={!transcript || isLoading}
                  className="px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: "#AD6FDE",
                    color: "white",
                    fontWeight: "500",
                    opacity: (!transcript || isLoading) ? "0.5" : "1",
                  }}
                >
                  Send
                </button>
              </div>

              {transcript && (
                <div className="mt-4 p-3 bg-gray-700 bg-opacity-50 rounded-md max-h-32 overflow-y-auto">
                  <p className="text-white text-sm">{transcript}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="fixed left-0 w-full flex justify-between items-center px-8"
        style={{
          bottom: "2rem",
        }}
      >
        <div
          style={{
            color: "#FFF",
            fontFamily: "Inter",
            fontSize: "1.25rem",
            fontWeight: 400,
          }}
        >
          {formatTime(callDuration)} | Mock Pitching
        </div>

        <div className="flex gap-4">
          <button className="text-white hover:opacity-80 transition-all duration-300 transform hover:scale-110">
            <img
              src={PresentationIcon}
              alt="Presentation Icon"
              style={{ width: "1.25rem", height: "1.25rem" }}
            />
          </button>


          <button
            onClick={toggleCaptions}
            className="hover:opacity-80 flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-110"
            style={{
              width: showCaptions ? "2.5rem" : "auto",
              height: showCaptions ? "2.5rem" : "auto",
              background: showCaptions ? "#1C60CE" : "transparent",
            }}
          >
            <img
              src={CaptionIcon}
              alt="Captions"
              style={{
                width: "1.25rem",
                height: "1.25rem",
              }}
            />
          </button>

        </div>
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
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-black text-white" style={{ background: "#000000" }}>
      {isCallActive && (        <CallingPage
          investor={callingInvestor}
          onEndCall={handleEndCall}
          onJoinCall={handleJoinCall}
          showFullInterface={showFullCallInterface}
          profileData={profileData}
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
            transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
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
                className="w-full pl-12 pr-16 py-4 rounded focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500"
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
                className={`flex items-${selectedInvestor ? "start" : "center"} justify-between p-6 cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]`}
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
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        className="hover:opacity-80 transition-all duration-300 transform hover:scale-105"
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
                        className="hover:opacity-80 transition-all duration-300 transform hover:scale-105"
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
                        className="flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 transform hover:scale-105"
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
                            fontWeight: "500",
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
                            className="hover:opacity-80 transition-all duration-300 transform hover:scale-105"
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
                            className="hover:opacity-80 transition-all duration-300 transform hover:scale-105"
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
                          className="flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 transform hover:scale-105"
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
              transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "fixed",
              top: "2.75rem",
              right: "1.88rem",
              height: "100vh",
              overflowY: "auto",
              transform: "translateX(0)",
              opacity: 1,
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
                          src={CallIcon || "/placeholder.svg"}
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
                      src={StarIcon || "/placeholder.svg"}
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
                    <div className="flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300">
                      <img
                        src={PlayIcon || "/placeholder.svg"}
                        alt="Play"
                        style={{ width: "1.25rem", height: "1.25rem" }}
                      />
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
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCallInvestor(selectedInvestor)
                  }}
                  className="flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 transform hover:scale-105"
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
                  <img
                    src={CallIcon2 || "/placeholder.svg"}
                    alt="Call"
                    style={{ width: "0.875rem", height: "0.875rem" }}
                  />
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
            className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-110"
            style={{
              width: "2.375rem",
              height: "2.375rem",
              borderRadius: "0.25rem",
              background: "#000",
            }}
          >
            <img
              src={logo || "/placeholder.svg"}
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
            className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-110"
            style={{
              width: "2.5rem",
              height: "2.25rem",
              borderRadius: "0.25rem",
              background: "#AD6FDE",
            }}
          >
            <img
              src={ContactsIcon || "/placeholder.svg"}
              alt="Contacts"
              style={{ width: "1.2rem", height: "1.2rem" }}
            />
          </button>

          <button className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-110 text-gray-600">
            <img
              src={AddIcon || "/placeholder.svg"}
              alt="Add"
              style={{ width: "1.5rem", height: "1.5rem", filter: "invert(100%)" }}
            />
          </button>

          <button className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-110 text-gray-600">
            <img
              src={SpeedometerIcon || "/placeholder.svg"}
              alt="Speedometer"
              style={{ width: "1.5rem", height: "1.5rem" }}
            />
          </button>

          <button className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-110 text-gray-600">
            <img src={TuneIcon || "/placeholder.svg"} alt="Tune" style={{ width: "1.5rem", height: "1.5rem" }} />
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
            className="flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-105 text-xs font-medium"
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