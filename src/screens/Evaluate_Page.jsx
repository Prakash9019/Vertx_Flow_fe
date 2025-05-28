import React, { useState, useEffect } from "react";
import Background2 from "../assets/background2.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useStartupProfile } from "../context/StartupProfileContext";

function Evaluate_Page() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [pdfThumbnails, setPdfThumbnails] = useState({}); // Store thumbnails by file name
  const [showUploader, setShowUploader] = useState(false);
  const [evaluation, setEvaluation] = useState(false);
  const [evaluationError, setEvaluationError] = useState(false);
  const [evaluationComplete, setEvaluationComplete] = useState(false);
  const [reportData, setReportData] = useState(null);
  const {userId } =useStartupProfile();
  const navigate = useNavigate();

  const handleAddNowClick = () => setShowUploader(true);

  // Function to generate PDF thumbnail
  const generatePdfThumbnail = async (file) => {
    try {
      // Dynamically import pdfjs-dist
      const pdfjsLib = await import('pdfjs-dist');
      
      // Set worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

      const fileReader = new FileReader();
      
      return new Promise((resolve, reject) => {
        fileReader.onload = async function() {
          try {
            const typedarray = new Uint8Array(this.result);
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            const page = await pdf.getPage(1); // Get first page
            
            const scale = 1.5;
            const viewport = page.getViewport({ scale });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            
            await page.render(renderContext).promise;
            const imageDataUrl = canvas.toDataURL();
            resolve(imageDataUrl);
          } catch (error) {
            console.error('Error rendering PDF:', error);
            reject(error);
          }
        };
        
        fileReader.onerror = reject;
        fileReader.readAsArrayBuffer(file);
      });
    } catch (error) {
      console.error('Error loading PDF.js:', error);
      return null;
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes

    if (file && file.type === "application/pdf") {
      if (file.size < maxSize) {
        setPdfFiles([...pdfFiles, file]);
        setShowUploader(false); // Close popup after upload
        
        // Generate thumbnail for the uploaded PDF
        try {
          const thumbnail = await generatePdfThumbnail(file);
          if (thumbnail) {
            setPdfThumbnails(prev => ({
              ...prev,
              [file.name]: thumbnail
            }));
          }
        } catch (error) {
          console.error('Failed to generate thumbnail:', error);
        }
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
    formData.append("userId",userId);
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
        setEvaluationComplete(true);
        setReportData(response.data);
      }, 1000);
    } catch (error) {
      console.log("Error", error);
      setEvaluationError(true);
      setTimeout(() => {
        setEvaluationError(false);
      }, 2000);
      setEvaluation(false);
    }
  };

  const handleAccessReport = () => {
    navigate("/evaluate/report", {
      state: { reportData: reportData, pdfFiles: pdfFiles },
    });
  };

  return (
    <div className="w-full flex flex-col md:flex-row min-h-screen bg-black text-white">
      {/* Add CSS for scanning effect */}
      <style jsx>{`
        .scanning-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, transparent, #AD6FDE, transparent);
          animation: scan 2s linear infinite;
        }
        
        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(10.125rem);
          }
        }
      `}</style>
    
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
    background: '#000',
    backgroundImage: `url("data:image/svg+xml,%3csvg width='540' height='272' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3clinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25' gradientTransform='rotate(224.28)'%3e%3cstop offset='18.6%25' style='stop-color:%23592582'/%3e%3cstop offset='81.4%25' style='stop-color:%236965ED'/%3e%3c/linearGradient%3e%3c/defs%3e%3crect x='1.5' y='1.5' width='537' height='269' rx='10' fill='none' stroke='url(%23grad)' stroke-width='3' stroke-dasharray='8,4'/%3e%3c/svg%3e")`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat'
  }}
  className="flex flex-col justify-between items-center"
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
    background: 'linear-gradient(180deg, #AD6FDE 34.21%, #0077B7 126.32%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
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
    background: 'linear-gradient(180deg, #AD6FDE 34.21%, #0077B7 126.32%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
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
                    className="rounded mb-4 overflow-hidden relative"
                    style={{
                      width: '18.75rem',
                      height: '10.125rem',
                      borderRadius: '0.375rem',
                      backgroundColor: pdfThumbnails[file.name] ? 'transparent' : '#6B7280'
                    }}
                  >
                    {pdfThumbnails[file.name] ? (
                      <img 
                        src={pdfThumbnails[file.name]} 
                        alt={`${file.name} preview`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div 
                        className="flex items-center justify-center h-full"
                        style={{
                          color: '#FFF',
                          fontSize: '0.875rem'
                        }}
                      >
                        Loading preview...
                      </div>
                    )}
                    
                    {/* Evaluation Complete Overlay */}
                    {evaluationComplete && (
                      <div 
                        className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)'
                        }}
                      >
                        <div
                          style={{
                            color: '#FFF',
                            fontFamily: 'Inter',
                            fontSize: '1.75rem',
                            fontWeight: 300,
                            marginBottom: '-0.5rem',
                            marginTop:'1rem'
                          }}
                        >
                          SATISFACTORY
                        </div>
                        <div
                          style={{
                            color: '#FFF',
                            fontFamily: 'Inter',
                            fontSize: '2.5rem',
                            fontWeight: 600
                          }}
                        >
                          73.1
                        </div>
                      </div>
                    )}
                    
                    {/* Loading Scanning Effect */}
                    {evaluation && (
                      <div 
                        className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.6)'
                        }}
                      >
                        <div className="scanning-line"></div>
                      </div>
                    )}
                  </div>

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
                      {evaluationComplete 
                        ? (
                          <span style={{
                            color: '#FFF',
                            textAlign: 'center',
                            fontFamily: 'Inter',
                            fontSize: '0.625rem',
                            fontWeight: 400
                          }}>
                            Evaluation report is ready and you can access now.
                          </span>
                        )
                        : `${new Date().toLocaleDateString()}`}
                    </p>
                  </div>

                  <button
  onClick={evaluationComplete ? handleAccessReport : handleEvaluation}
  style={{
    width: '18.625rem',
    height: '2.75rem',
    borderRadius: '0.375rem',
    background:
      evaluation === true ? '#D1D5DB' : '#FFFFFF', // gray-200 or white
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: '0.875rem',
    fontWeight: 400,
    border: 'none',
    cursor: 'pointer'
  }}
>
  {evaluation === true
    ? "Initializing..."
    : evaluationError === true
    ? "Failed to evaluate"
    : evaluationComplete === true
    ? "Access Report"
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