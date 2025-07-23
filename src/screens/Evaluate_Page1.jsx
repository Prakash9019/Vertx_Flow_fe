import React, { useState, useEffect } from "react";
import Background2 from "../assets/background2.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar2";
import API_KEY from "../../key";

function Evaluate_Page() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const [evaluation, setEvaluation] = useState(false);
  const [evaluationError, setEvaluationError] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [canUpload, setCanUpload] = useState(false);

  const navigate = useNavigate();

  // Check user permissions on component mount
  useEffect(() => {
    const checkUserPermissions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (token) {
          const response = await axios.get(`${API_KEY}/api/auth/founder`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          setUserRole(response.data.role);
          
          // Determine if user can upload
          const hasUploadPermission = response.data.role === 'founder' || 
            (response.data.role === 'cofounder' && response.data.permissions && response.data.permissions.fullAccess);
          
          setCanUpload(hasUploadPermission);
        }
      } catch (error) {
        console.error('Error checking user permissions:', error);
      }
    };

    checkUserPermissions();
  }, []);

  const handleAddNowClick = () => {
    if (!canUpload) {
      alert('You don\'t have access from founder.');
      return;
    }
    setShowUploader(true);
  };
  const handlePdfUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
      }

      // Create FormData to send the file
      const formData = new FormData();
      formData.append('pdfFile', file);

      const token = localStorage.getItem('authToken');
      const uploadResponse = await fetch(`${API_KEY}/api/pitch-analysis/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload PDF');
      }

      const uploadResult = await uploadResponse.json();
      
      // Set the PDF files state with the new file info
      setPdfFiles([{
        name: file.name,
        path: uploadResult.filePath,
        uploadDate: new Date().toISOString()
      }]);
      
      setShowUploader(false);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload PDF. Please try again.');
    }
  };
  const handleEvaluation = async () => {
    setEvaluation(true);
    const formData = new FormData();
    formData.append("file", pdfFiles[0]);
    // console.log("hiiiiiii.....")
    
    try {
      // First get the analysis from the ML model
      const analysisResponse = await axios.post(
        "https://pitch-analysis-model-427457295403.us-central1.run.app/analyze/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Save the analysis and the PDF to our backend
      const token = localStorage.getItem('authToken');
      const saveResponse = await axios.post(
        `${API_KEY}/api/pitch-analysis/save-analysis`,
        {
          fileName: pdfFiles[0].name,
          analysisData: analysisResponse.data
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const analysisId = saveResponse.data.analysis._id;
      
      // console.log("Analysis saved successfully");
      setTimeout(() => {
        setEvaluation(false);
      }, 1000);
      
      // Navigate to report page with the analysis data and ID
      navigate("/evaluate/report#analysis", {
        state: { 
          reportData: analysisResponse.data, 
          pdfFiles: pdfFiles[0].name,
          analysisId: analysisId 
        }
      });
    } catch (error) {
      // console.log("Error", error);
      setEvaluationError(true);
      setTimeout(() => {
        setEvaluationError(false);
      }, 2000);
      setEvaluation(false);
    }  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 bg-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero section */}
          <div 
            className="relative rounded-md overflow-hidden flex items-center mb-8 bg-gradient-to-r from-[#150D29] to-[#150629]"
            style={{
              height: '14.75rem'
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
                }}              >
                Company Pitch Deck Evaluator
              </h4>
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
              </p>              <button
                onClick={handleAddNowClick}
                disabled={!canUpload}
                style={{
                  color: canUpload ? '#FFF' : '#666',
                  fontFamily: 'Inter',
                  fontSize: '1rem',
                  fontWeight: 600,
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.375rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: canUpload ? 'pointer' : 'not-allowed',
                  opacity: canUpload ? 1 : 0.5
                }}
                className={canUpload ? "hover:bg-gray-500 hover:text-white active:bg-gray-500 active:text-white transition duration-300" : ""}
                title={!canUpload ? "You don't have access from founder" : ""}
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
                  <label 
                    className={`flex flex-col items-center justify-center ${canUpload ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    style={{ 
                      opacity: canUpload ? 1 : 0.5,
                      pointerEvents: canUpload ? 'auto' : 'none'
                    }}
                  >
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
                <label 
                  className={`flex flex-col items-center ${canUpload ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  style={{ 
                    opacity: canUpload ? 1 : 0.5,
                    pointerEvents: canUpload ? 'auto' : 'none'
                  }}
                >
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