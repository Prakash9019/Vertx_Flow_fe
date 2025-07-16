import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStartupProfile } from "../context/StartupProfileContext";
import Header from "../components/Header";
import ProfileProgressBar from "../components/ProfileProgressBar";
import { GoogleGenerativeAI } from '@google/generative-ai';

const InvestorsPitch = () => {
  const navigate = useNavigate();
  const {
    startupData, updateStartupField, submitStartupProfile,
    isSubmitting, error, setError, successMessage, loadingData,
  } = useStartupProfile();
  const [currentPitch, setCurrentPitch] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    setCurrentPitch(startupData.pitch || "");
  }, [startupData.pitch]);

  const handlePitchChange = (e) => {
    const newPitch = e.target.value;
    setCurrentPitch(newPitch);
    updateStartupField('pitch', newPitch);
    setError(null);
  };

  const handleFinish = async () => {
    if (!currentPitch.trim()) {
      setError("Please provide a pitch for your startup.");
      return;
    }
    setError(null);
    const success = await submitStartupProfile();
    if (success) {
      setTimeout(() => navigate("/usage"), 1500);
    }
  };

  const handleBack = () => {
    navigate("/profile/industry");
  };

  const enhancePitchWithGemini = async () => {
    if (!currentPitch.trim()) {
      setError("Please write a pitch first before enhancing it.");
      return;
    }

    // Check if API key is available
    if (!import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY === 'your_gemini_api_key_here') {
      setError("Gemini API key is not configured. Please add your API key to the .env file.");
      return;
    }

    setIsEnhancing(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-06-17" });

      const prompt = `You are a professional pitch writer. Rewrite this startup pitch to make it more compelling and investor-ready. Return ONLY the improved pitch text, nothing else.

Original pitch: "${currentPitch}"

Rewrite it to be:
- write between 250-350 characters
- Professional and confident
- Clear about the problem and solution
- Compelling for investors
- Concise but impactful

Return only the enhanced pitch text without any explanations, options, or additional commentary.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const enhancedText = response.text();

      // Clean up the response (remove quotes, asterisks, and extra formatting)
      let cleanedText = enhancedText
        .replace(/^["']|["']$/g, '') // Remove quotes
        .replace(/^\*\*.*?\*\*:?\s*/gm, '') // Remove bold headers like **Option 1:**
        .replace(/^\*.*?\*:?\s*/gm, '') // Remove italic headers
        .replace(/^#+\s*/gm, '') // Remove markdown headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
        .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
        .trim();
      
      // If the response contains multiple options, take only the first paragraph
      const firstParagraph = cleanedText.split('\n\n')[0];
      const finalText = firstParagraph || cleanedText;
      
      // Directly replace the current pitch with enhanced text
      setCurrentPitch(finalText);
      updateStartupField('pitch', finalText);
    } catch (error) {
      console.error('Error enhancing pitch:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        stack: error.stack
      });
      
      // More specific error messages
      if (error.message?.includes('API_KEY') || error.status === 400) {
        setError("Invalid API key. Please check your Gemini API key in the .env file.");
      } else if (error.message?.includes('quota') || error.status === 429) {
        setError("API quota exceeded. Please check your Gemini API usage limits.");
      } else if (error.message?.includes('blocked') || error.status === 403) {
        setError("Content was blocked. Please try rephrasing your pitch.");
      } else if (error.status === 404) {
        setError("Model not found. The API model might have changed.");
      } else {
        setError(`Failed to enhance pitch: ${error.message || 'Unknown error'}. Please try again.`);
      }
    } finally {
      setIsEnhancing(false);
    }
  };

  if (loadingData && !startupData.stage) {
    return <div className="w-screen h-screen flex justify-center items-center bg-black text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-white bg-[#150718] bg-cover bg-top bg-no-repeat p-4 sm:p-6 md:p-9">
      <div className="absolute inset-0  bg-gradient-to-b from-black to-purple-950 opacity-65 z-0"></div>
      <div className="relative z-10">
        <Header />

        <div className="flex justify-center mt-12">
          <div className="relative" style={{ width: '80rem', height: 'auto' }}>
            <div style={{ width: '35.75rem', color: '#FFFFFF', marginBottom: '1.25rem', marginLeft: '19rem', marginRight: 'auto' }}>
              <h2 className="font-inter font-semibold" style={{ fontSize: '1.25rem', lineHeight: '1.5rem', marginBottom: '0.75rem', width: '17.4375rem', height: '1.4375rem' }}>Tell us about your startup</h2>
              <p className="font-inter font-normal" style={{ fontSize: '0.875rem', lineHeight: '1.0625rem', width: '35.75rem', height: '1.125rem' }}>We'll use this information to match you with the right investors for your specific needs.</p>
            </div>

            <div
              className="relative w-full max-w-2xl min-h-[22.625rem] mt-8 sm:mt-12 mx-auto"
              style={{
                position: 'relative',
                background: 'linear-gradient(224.28deg, #592582 18.6%, #6965ED 81.4%)',
                borderRadius: '0.625rem',
                padding: '0.125rem',
                width: '45rem',
                height: '22.625rem'
              }}
            >
              <div 
                className="w-full h-full flex flex-col" 
                style={{
                  background: 'black',
                  borderRadius: '0.625rem',
                  height: 'calc(100%)',
                  padding: '2rem',
                  paddingTop: '2.5rem'
                }}
              >
                <div style={{ boxSizing: 'border-box', width: '100%' }}>
                  <ProfileProgressBar currentStep={5} />
                </div>

                <div style={{ color: '#FFFFFF' }}>
                  <label className="block font-inter font-semibold" style={{ fontSize: '0.875rem', lineHeight: '1.0625rem', marginBottom: '0.5rem' }}>
                    Your startup's elevator pitch
                  </label>
                  <p className="font-inter font-normal text-xs" style={{ fontSize: '0.75rem', lineHeight: '0.9375rem', marginBottom: '1.25rem' }}>
                    Give investors a concise overview of your value proposition. You can enhance it.
                  </p>
                  <div style={{ width: '100%', position: 'relative' }}>
                    <textarea
                      id="pitch-textarea"
                      rows="6"
                      value={currentPitch}
                      onChange={handlePitchChange}
                      placeholder="Write here..."
                      className="w-full p-3"
                      disabled={isEnhancing}
                      style={{ 
                        width: '100%', 
                        height: '5.75rem', 
                        borderRadius: '0.3125rem', 
                        border: '1px solid rgba(184, 184, 184, 0.13)', 
                        background: isEnhancing ? '#1a1a1a' : '#0F0E16',
                        color: isEnhancing ? '#888' : '#FFFFFF',
                        fontSize: '0.75rem',
                        fontWeight: 400,
                        fontFamily: 'Inter',
                        padding: '0.625rem 0.9375rem',
                        resize: 'vertical',
                        overflowY: 'auto',
                        '::placeholder': { color: '#656565' },
                        opacity: isEnhancing ? 0.7 : 1
                      }}
                    />
                    
                    {/* Loading spinner overlay */}
                    {isEnhancing && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <div style={{
                          width: '2rem',
                          height: '2rem',
                          border: '3px solid rgba(173, 111, 222, 0.3)',
                          borderTop: '3px solid #AD6FDE',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        <span style={{
                          color: '#AD6FDE',
                          fontSize: '0.75rem',
                          fontFamily: 'Inter'
                        }}>
                          Enhancing...
                        </span>
                      </div>
                    )}
                    <button 
                      onClick={enhancePitchWithGemini}
                      disabled={isEnhancing || isSubmitting}
                      style={{ 
                        position: 'absolute', 
                        bottom: '0.625rem', 
                        right: '0.625rem',
                        width: '1.25rem',
                        height: '1.25rem',
                        borderRadius: '50%',
                        backgroundColor: '#000',
                        border: '0.5px solid #AD6FDE',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '0.3rem',
                        cursor: (isEnhancing || isSubmitting) ? 'not-allowed' : 'pointer',
                        opacity: (isEnhancing || isSubmitting) ? 0.5 : 1,
                        transition: 'opacity 0.2s ease'
                      }}
                      title="Enhance pitch with AI"
                    >
                      <svg
  width="16"
  height="15"
  viewBox="0 0 16 15"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  style={{
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    marginLeft: '0.1rem'
  }}
>
  <g id="Group 381">
    <path
      id="Star 1"
      d="M9.09108 3.38946C8.97554 2.7269 8.02446 2.72689 7.90892 3.38946L7.45877 5.97077C7.4153 6.22007 7.22007 6.4153 6.97077 6.45877L4.38946 6.90892C3.7269 7.02446 3.72689 7.97554 4.38946 8.09108L6.97077 8.54123C7.22007 8.5847 7.4153 8.77993 7.45877 9.02923L7.90892 11.6105C8.02446 12.2731 8.97554 12.2731 9.09108 11.6105L9.54123 9.02923C9.5847 8.77993 9.77993 8.5847 10.0292 8.54123L12.6105 8.09108C13.2731 7.97554 13.2731 7.02446 12.6105 6.90892L10.0292 6.45877C9.77993 6.4153 9.5847 6.22007 9.54123 5.97077L9.09108 3.38946Z"
      fill="url(#paint0_linear_350_1297)"
    />
    <path
      id="Star 2"
      d="M4.39405 9.25964C4.31702 8.81793 3.68298 8.81793 3.60595 9.25964L3.45434 10.129C3.42536 10.2952 3.29521 10.4254 3.129 10.4543L2.25964 10.6059C1.81793 10.683 1.81793 11.317 2.25964 11.3941L3.129 11.5457C3.29521 11.5746 3.42536 11.7048 3.45434 11.871L3.60595 12.7404C3.68298 13.1821 4.31702 13.1821 4.39405 12.7404L4.54566 11.871C4.57464 11.7048 4.70479 11.5746 4.871 11.5457L5.74036 11.3941C6.18207 11.317 6.18207 10.683 5.74036 10.6059L4.871 10.4543C4.70479 10.4254 4.57464 10.2952 4.54566 10.129L4.39405 9.25964Z"
      fill="url(#paint1_linear_350_1297)"
    />
    <path
      id="Star 3"
      d="M5.74628 3.41227C5.69814 3.13621 5.30186 3.13621 5.25372 3.41227L5.15896 3.95563C5.14085 4.0595 5.0595 4.14085 4.95563 4.15896L4.41227 4.25372C4.13621 4.30186 4.13621 4.69814 4.41227 4.74628L4.95563 4.84104C5.0595 4.85915 5.14085 4.9405 5.15896 5.04437L5.25372 5.58773C5.30186 5.86379 5.69814 5.86379 5.74628 5.58773L5.84104 5.04437C5.85915 4.9405 5.9405 4.85915 6.04437 4.84104L6.58773 4.74628C6.86379 4.69814 6.86379 4.30186 6.58773 4.25372L6.04437 4.15896C5.9405 4.14085 5.85915 4.0595 5.84104 3.95563L5.74628 3.41227Z"
      fill="url(#paint2_linear_350_1297)"
    />
  </g>
  <defs>
    <linearGradient
      id="paint0_linear_350_1297"
      x1="8.5"
      y1="13.5"
      x2="8.5"
      y2="2.5"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#592582" />
      <stop offset="1" stopColor="#6965ED" />
    </linearGradient>
    <linearGradient
      id="paint1_linear_350_1297"
      x1="4"
      y1="14.2"
      x2="4"
      y2="8.33333"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#592582" />
      <stop offset="1" stopColor="#6965ED" />
    </linearGradient>
    <linearGradient
      id="paint2_linear_350_1297"
      x1="5.5"
      y1="6.5"
      x2="5.5"
      y2="2.83333"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#592582" />
      <stop offset="1" stopColor="#6965ED" />
    </linearGradient>
  </defs>
</svg>
                    </button>
                    <div style={{ 
                      position: 'absolute', 
                      width: '100%', 
                      textAlign: 'center', 
                      top: 'calc(100% + 0.5rem)'
                    }}>
                      {error && <p className="text-red-500" style={{ fontSize: '0.7rem' }}>{error}</p>}
                      {successMessage && <p className="text-green-500" style={{ fontSize: '0.7rem' }}>{successMessage}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center w-full" style={{ color: '#FFFFFF', marginTop: 'auto', paddingTop: '1rem', paddingBottom: '1.25rem' }}>
                  <button 
                    className="font-inter font-normal" 
                    onClick={handleBack}
                    disabled={isSubmitting} 
                    style={{ 
                      fontSize: '0.875rem', 
                      lineHeight: '1.0625rem', 
                      color: isSubmitting ? '#888' : '#FFF',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.6 : 1
                    }}
                  >
                    Back
                  </button>
                  <button 
                    className="font-inter font-medium"
                    onClick={handleFinish}
                    disabled={isSubmitting || !!successMessage}
                    style={{ 
                      display: 'inline-flex',
                      padding: '0.53125rem 1.21875rem 0.65625rem 1.21875rem',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '0.25rem',
                      background: isSubmitting ? '#ccc' : '#FFFFFF', 
                      color: '#000', 
                      fontSize: '0.875rem', 
                      fontWeight: 500,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      width: '6.4375rem',
                      height: '2.1875rem'
                    }}
                  >
                    {isSubmitting ? (
                      <div 
                        style={{
                          width: '1rem',
                          height: '1rem',
                          border: '2px solid #666',
                          borderTop: '2px solid #000',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}
                      />
                    ) : successMessage ? "Saved!" : "Continue"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default InvestorsPitch;