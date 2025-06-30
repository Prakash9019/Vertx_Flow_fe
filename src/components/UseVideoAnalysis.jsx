import { useEffect, useRef } from "react";

/**
 * Sends video frames from the user's webcam over WebSocket
 * for real-time AI video analysis (emotion, gesture, posture).
 *
 * @param {React.MutableRefObject} socketRef - WebSocket ref (must be connected)
 * @param {string} sessionId - Unique session ID for analysis session
 * @returns { videoRef, canvasRef } - Refs to attach to hidden <video> and <canvas> elements
 */
export function UseVideoAnalysis(socketRef, sessionId) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 🔹 Step 1: Start the user's webcam when component mounts
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log("🎥 Webcam stream started.");
        }
      } catch (err) {
        console.error("❌ Webcam error:", err);
      }
    };

    startWebcam();
  }, []);

  // 🔹 Step 2: Start sending frames every 500ms once socket & session ID are available
  useEffect(() => {
    if (!socketRef.current || !sessionId) return;

    // Emit start signal
    socketRef.current.emit("start_video_analysis", { session_id: sessionId });
    console.log("📡 Emitted start_video_analysis:", sessionId);

    // Interval to send frames every 500ms
    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) return;

      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      const frameData = canvas.toDataURL("image/jpeg");
      console.log("📤 Frame sent:", frameData.slice(0, 50));  // ✅ Debug log
``

      socketRef.current.emit("video_frame", {
        session_id: sessionId,
        frame_data: frameData,
      });

      console.log("📤 Frame sent:", frameData.slice(0, 50));
    }, 500);

    // Cleanup
    return () => {
      clearInterval(interval);
      socketRef.current.emit("stop_video_analysis", { session_id: sessionId });
      console.log("🛑 Emitted stop_video_analysis:", sessionId);
    };
  }, [socketRef, sessionId]);

  // Return refs to be attached to hidden elements
  return { videoRef, canvasRef };
}
