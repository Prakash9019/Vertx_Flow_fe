import React, { useState } from "react";
import Background2 from "../assets/background2.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar2";

function Evaluate_Page() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const [evaluation, setEvaluation] = useState(false);
  const [evaluationError, setEvaluationError] = useState(false);

  const navigate = useNavigate();

  const handleAddNowClick = () => setShowUploader(true);

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes

    if (file && file.type === "application/pdf") {
      if (file.size < maxSize) {
        setPdfFiles([...pdfFiles, file]);
        setShowUploader(false); // Close popup after upload
      } else {
        alert("File size exceeds 10MB. Please upload a smaller file.");
      }
    } else {
      alert("Only PDF files are allowed.");
    }
  };

  const handleEvaluation = async () => {
    setEvaluation(true);
    const formData = new FormData();
    formData.append("file", pdfFiles[0]);
    console.log("hiiiiiii.....")
    try {
      const response = await axios.post(
        "https://pitch-analysis-model-427457295403.us-central1.run.app/analyze/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("data:-", response.data);
      console.log("data of pdf :-", pdfFiles);
      setTimeout(() => {
        setEvaluation(false);
      }, 1000);
      // send to next page
      navigate("/evaluate/report", {
        state: { reportData: response.data, pdfFiles: pdfFiles },
      });
    } catch (error) {
      console.log("Error", error);
      setEvaluationError(true);
      setTimeout(() => {
        setEvaluationError(false);
      }, 2000);
      setEvaluation(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row min-h-screen bg-black text-white">
    
      <div className="md:col-span-3 bg-black text-white">
        <Sidebar />
      </div>

      <div className="w-full flex flex-col md:flex-row min-h-screen bg-black text-white relative">
        <div className="flex-1 ">
          {/* Header */}

          <div className="relative">
            {/* Hero section with exact specifications */}
            <div 
              className="relative rounded-md overflow-hidden flex items-center"
              style={{
                height: '14.75rem',
                marginTop: '6.31rem',
                marginLeft: '0.94rem',
                marginRight: '0.94rem',
                width: 'calc(100% - 1.88rem)'
              }}
            >
              {/* Background image */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${Background2})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              {/* Purple overlay */}
              <div className="absolute inset-0 bg-purple-950 opacity-65 mix-blend-multiply" />

              {/* Heading with exact positioning */}
              <h4 
                className="relative z-10"
                style={{
                  color: '#FFF',
                  fontFamily: 'Inter',
                  fontSize: '2rem',
                  fontWeight: 600,
                  marginLeft: '6rem'
                }}
              >
                Company Pitch Deck Evaluator
              </h4>
            </div>
          </div>

          {/* Content with exact specifications */}
          {!showUploader && pdfFiles.length === 0 && (
            <div 
              className="text-center"
              style={{ marginTop: '4.94rem' }}
            >
              <p 
                style={{
                  color: '#B8B8B8',
                  fontFamily: 'Inter',
                  fontSize: '1rem',
                  fontWeight: 400,
                  marginBottom: '0.81rem'
                }}
              >
                You haven't added any deck yet, add one to evaluate now
              </p>
              <button
                onClick={handleAddNowClick}
                style={{
                  color: '#FFF',
                  fontFamily: 'Inter',
                  fontSize: '1rem',
                  fontWeight: 600,
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.375rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
                className="hover:bg-gray-500 hover:text-white active:bg-gray-500 active:text-white transition duration-300"
              >
                Add now
              </button>
            </div>
          )}

          {/* Centered Upload Popup */}
          {showUploader && (
            <div className="absolute inset-0 flex items-center justify-center z-40">
              <div
                style={{
                  width: '33.75rem',
                  height: '17rem',
                  borderRadius: '0.625rem',
                  border: '3px dashed #592582',
                  background: '#000'
                }}
                className="flex flex-col justify-between items-center "
              >
                {/* Upload Section - Centered */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <label className="cursor-pointer flex flex-col items-center justify-center">
                    {/* SVG Icon */}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="30" 
                      height="30" 
                      viewBox="0 0 30 30" 
                      fill="none"
                      style={{
                        width: '1.875rem',
                        height: '1.875rem'
                      }}
                    >
                      <path 
                        d="M13.75 16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75V16.25Z" 
                        fill="url(#paint0_linear_262_159)"
                      />
                      <defs>
                        <linearGradient 
                          id="paint0_linear_262_159" 
                          x1="15" 
                          y1="6.25" 
                          x2="15" 
                          y2="23.75" 
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#AD6FDE"/>
                          <stop offset="1" stopColor="#0077B7"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* Upload PDF Text */}
                    <p 
                      style={{
                        color: '#FFF',
                        fontFamily: 'Inter',
                        fontSize: '1rem',
                        fontWeight: 600,
                        marginTop: '0.38rem'
                      }}
                    >
                      Upload PDF
                    </p>
                    
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {/* Max file size text - Bottom with 1.31rem gap from container edge */}
                <div 
                  className="text-center"
                  style={{ marginBottom: '1.31rem' }}
                >
                  <span
                    style={{
                      color: '#FFF',
                      fontFamily: 'Inter',
                      fontSize: '0.75rem',
                      fontWeight: 400
                    }}
                  >
                    Max file size:{' '}
                  </span>
                  <span
                    style={{
                      color: '#FFF',
                      fontFamily: 'Inter',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    10MB
                  </span>
                </div>
              </div>
            </div>
          )}

          {pdfFiles.length > 0 && (
            <div 
              className="flex "
              style={{ 
                marginTop: '2.56rem',
                marginLeft: '0.94rem'
              }}
            >
              {/* Upload Box */}
              <div 
                className="border-dashed flex flex-col text-center relative"
                style={{
                  width: '20.625rem',
                  height: '18.75rem',
                  border: '3px dashed #592582',
                  borderRadius: '0.5rem'
                }}
              >
                <label className="cursor-pointer flex flex-col items-center">
                  {/* SVG Icon with 5.63rem gap from top */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="30" 
                    height="30" 
                    viewBox="0 0 30 30" 
                    fill="none"
                    style={{
                      width: '1.875rem',
                      height: '1.875rem',
                      marginTop: '5.63rem'
                    }}
                  >
                    <path 
                      d="M13.75 16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75V16.25Z" 
                      fill="url(#paint0_linear_262_227)"
                    />
                    <defs>
                      <linearGradient 
                        id="paint0_linear_262_227" 
                        x1="15" 
                        y1="7" 
                        x2="15" 
                        y2="35" 
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#AD6FDE"/>
                        <stop offset="1" stopColor="#0077B7"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Upload PDF Text with 0.38rem gap from icon */}
                  <p 
                    style={{
                      color: '#FFF',
                      fontFamily: 'Inter',
                      fontSize: '1rem',
                      fontWeight: 600,
                      marginTop: '0.38rem'
                    }}
                  >
                    Upload PDF
                  </p>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                </label>
                
                {/* Max file size text - 1.75rem gap from bottom of container */}
                <div 
                  className="text-center absolute bottom-0 left-0 right-0"
                  style={{ marginBottom: '1.75rem' }}
                >
                  <span
                    style={{
                      color: '#FFF',
                      fontFamily: 'Inter',
                      fontSize: '0.75rem',
                      fontWeight: 400
                    }}
                  >
                    Max file size: {' '}
                  </span>
                  <span
                    style={{
                      color: '#FFF',
                      fontFamily: 'Inter',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    10MB
                  </span>
                </div>
              </div>

              {/* Uploaded PDF Cards */}
              {pdfFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex flex-col"
                  style={{
                    width: '20.625rem',
                    height: '18.75rem',
                    borderRadius: '0.5rem',
                    border: '2px solid #FFF',
                    background: '#000',
                    padding: '0.94rem',
                    marginLeft: '0.94rem'
                  }}
                >
                  {/* PDF thumbnail */}
                  <div 
                    className="bg-gray-500 rounded mb-4"
                    style={{
                      width: '18.75rem',
                      height: '10.125rem',
                      borderRadius: '0.375rem'
                    }}
                  />

                  <div className="text-left">
                    <p 
                      style={{
                        color: '#FFF',
                        fontFamily: 'Inter',
                        fontSize: '1rem',
                        fontWeight: 600,
                        marginBottom: '0.25rem'
                      }}
                    >
                      {file.name}
                    </p>
                    <p 
                      style={{
                        color: '#FFF',
                        fontFamily: 'Inter',
                        fontSize: '0.75rem',
                        fontWeight: 400,
                        marginBottom: '1rem'
                      }}
                    >
                      {evaluation === true
                        ? "Evaluation will be ready with in a minute."
                        : `${new Date().toLocaleDateString()}`}
                    </p>
                  </div>

                  <button
                    onClick={handleEvaluation}
                    style={{
                      width: '18.625rem',
                      height: '2.75rem',
                      borderRadius: '0.375rem',
                      background: '#FFF',
                      color: '#000',
                      textAlign: 'center',
                      fontFamily: 'Inter',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    className="hover:bg-gray-200 transition duration-200"
                  >
                    {evaluation === true
                      ? "Initializing..."
                      : evaluationError === true
                      ? "Failed to evaluate"
                      : "Evaluate"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Evaluate_Page;