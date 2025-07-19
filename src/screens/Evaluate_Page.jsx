import React, { useState, useEffect } from "react";
import Background2 from "../assets/background2.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useStartupProfile } from "../context/StartupProfileContext";
import { usePermissions } from "../hooks/usePermissions";
import API_KEY from "../../key";
import satsifactory from "./satsifactory.jpg";
import UpgradeSubscriptionPopup from "../components/UpgradeSubscriptionPopup";

function Evaluate_Page() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [pdfThumbnails, setPdfThumbnails] = useState({}); // Store thumbnails by file name
  const [showUploader, setShowUploader] = useState(false);
  const [evaluation, setEvaluation] = useState(false);
  const [evaluationError, setEvaluationError] = useState(false);
  const [evaluationComplete, setEvaluationComplete] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [analysisData, setAnalysisData] = useState([]);  const [score,setScore]=useState(0);
  const [evaluationStatus, setEvaluationStatus] = useState({}); // key: file.name, value: { evaluating, complete, error, score }
  const [loading, setLoading] = useState(true);
  const [showNoAccessToast, setShowNoAccessToast] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const {profileData, user_id, startupId } = useStartupProfile();
  const { hasFullAccess, canEvaluate, canUpload, userRole, subscriptionPlan, canUsePdfEvaluation, loading: permissionsLoading } = usePermissions();
  const navigate = useNavigate();

  const handleAddNowClick = () => {
    if (!canUpload) {
      setShowNoAccessToast(true);
      setTimeout(() => setShowNoAccessToast(false), 3000);
      return;
    }
    
    // Check if user has appropriate subscription
    if (!canUsePdfEvaluation) {
      setShowUpgradePopup(true);
      return;
    }
    
    // User has appropriate permissions and subscription
    setShowUploader(true);
  };
   
  useEffect(() => {
    if (!startupId) {
      setLoading(false);
      setAnalysisData([]);
      return;
    }
    
    const fetchAnalysis = async () => {    
      try {
        // Make sure startupId is valid before making the request
        if (!startupId || startupId === 'undefined' || startupId === 'null') {
          setAnalysisData([]);
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`${API_KEY}/api/pitch/analysis/${startupId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        setAnalysisData(response.data);
        console.log('Analysis data:', response.data);
        
        // ✅ If previous analysis exists, show uploader directly
        if (response.data.length > 0) {
          setShowUploader(false); // hide popup
          setEvaluationComplete(true);
          setReportData(response.data[0]); // preload report
        }
      } catch (err) {
        console.error('Error fetching analysis:', err);
        
        // Handle errors gracefully - just means no analysis exists yet
        // or there might be an issue with the API
        setAnalysisData([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAnalysis();
  }, [startupId]);

  
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
    console.log(startupId)
    const file = e.target.files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    setShowUploader(false);
    if (file && file.type === "application/pdf") {
      if (file.size < maxSize) {
        // Reset all evaluation states when new file is uploaded
        setEvaluation(false);
        setEvaluationComplete(false);
        setEvaluationError(false);
        setScore(0);
        setReportData(null);
        setEvaluationStatus(prev => ({
          ...prev,
          [file.name]: { evaluating: false, complete: false, error: false, score: 0 }
        }));
        
        // Add the new file
        setPdfFiles([...pdfFiles, file]);
        
        // Generate thumbnail for the uploaded PDF
        try {
          const thumbnail = await generatePdfThumbnail(file);
          if (thumbnail) {
            setPdfThumbnails(prev => ({
              ...prev,
              [file.name]: thumbnail
            }));
          }
          // const status = evaluationStatus[file.name] || {};
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

  // const handleEvaluation = async () => {
  //   setEvaluation(true);
  //   setEvaluationComplete(false); // Reset completion state
  //   setEvaluationError(false); // Reset error state
  //   setScore(0); // Reset score
    
  //   const formData = new FormData();
  //   formData.append("file", pdfFiles[pdfFiles.length - 1]); // Get the most recently uploaded file
    
  //   try {
  //     const response = await axios.post(
  //       `https://pitch-analysis-model-427457295403.us-central1.run.app/analyze/?user_id=${user_id}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     console.log("data:-", response.data);
  //     setScore((response.data.breakdown.score/ 800) * 100);
  //     console.log("data of pdf :-", pdfFiles);
      
  //     setTimeout(() => {
  //       setEvaluation(false);
  //       setEvaluationComplete(true);
  //       setReportData(response.data);
  //     }, 1000);
  //   } catch (error) {
  //     console.log("Error", error);
  //     setEvaluationError(true);
  //     setTimeout(() => {
  //       setEvaluationError(false);
  //     }, 2000);
  //     setEvaluation(false);
  //   }
  // };
  const handleEvaluation = async (file) => {
    if (!canEvaluate) {
      alert('You don\'t have access from founder.');
      return;
    }
    
    // Check if user has appropriate subscription
    if (!canUsePdfEvaluation) {
      setShowUpgradePopup(true);
      return;
    }
    
    const fileName = file.name;
    setEvaluationStatus(prev => ({
      ...prev,
      [fileName]: { evaluating: true, complete: false, error: false, score: 0 }
    }));
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post(
        `https://pitch-analysis-model-427457295403.us-central1.run.app/analyze/?startupId=${startupId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      const newScore = (response.data.breakdown.score.value / 800) * 100;
      setEvaluationStatus(prev => ({
        ...prev,
        [fileName]: {
          evaluating: false,
          complete: true,
          error: false,
          score: newScore,
          data: response.data,
        }
      }));
      console.log(evaluationStatus);
    } catch (err) {
      // Check if error is due to subscription restrictions
      if (err.response && err.response.status === 403 && err.response.data.upgradeRequired) {
        setShowUpgradePopup(true);
      }
      
      setEvaluationStatus(prev => ({
        ...prev,
        [fileName]: { evaluating: false, complete: false, error: true, score: 0 }
      }));
    }
  };
  const handleAccessReport = (status) => {
    if (!canEvaluate) {
      alert('You don\'t have access from founder.');
      return;
    }
    
    navigate("/evaluate/report#analysis", {
      state: { reportData: status.data, pdfFiles: pdfFiles[0]?.name },    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-black text-white flex relative overflow-hidden">
      {/* Add CSS for scanning effect */}
    

{/* Sidebar */}
<div className="bg-black text-white">
        <Sidebar />
      </div>

      <div className="w-full flex flex-col md:flex-row min-h-screen bg-black text-white relative">
        <div className="flex-1">
          {/* Header */}
          <div className="relative">
            {/* Hero section with responsive specifications */}
            <div className="relative rounded-md overflow-hidden flex items-center mt-16 sm:mt-20 md:mt-24 lg:mt-28 xl:mt-[6.31rem] mx-3 sm:mx-4 md:mx-[0.94rem] h-48 sm:h-52 md:h-56 lg:h-60 xl:h-[14.75rem]">
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

              {/* Heading with responsive positioning */}
              <h4 className="relative z-10 text-white font-inter text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[2rem] font-semibold ml-4 sm:ml-8 md:ml-12 lg:ml-16 xl:ml-[6rem] px-2">
             {  profileData ? profileData.companyName+ " Pitch Deck Evaluator": "Company Pitch Deck Evaluator" }
              </h4>
            </div>
          </div>

          {/* Content with responsive specifications */}
          {!loading && !showUploader && pdfFiles.length === 0 && analysisData.length === 0 && (
            <div className="text-center mt-12 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-[4.94rem] px-4">
              <p className="text-[#B8B8B8] font-inter text-sm sm:text-base font-normal mb-3 xl:mb-[0.81rem]">
                You haven't added any deck yet, add one to evaluate now
              </p>
              <button
                onClick={handleAddNowClick}
                className="text-white font-inter text-sm sm:text-base font-semibold py-2 px-4 sm:px-5 rounded-md bg-transparent border-none cursor-pointer active:bg-gray-500 active:text-white transition duration-300"

              >
                Add now
              </button>
            </div>
          )}

          {/* Centered Upload Popup */}
          {showUploader && (
            <div className="absolute inset-0 flex items-center justify-center z-40 px-4">
              <div
                className="w-full max-w-lg sm:max-w-xl xl:w-[33.75rem] h-60 sm:h-64 md:h-68 xl:h-[17rem] rounded-lg xl:rounded-[0.625rem] bg-black flex flex-col justify-between items-center"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg width='540' height='272' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3clinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25' gradientTransform='rotate(224.28)'%3e%3cstop offset='18.6%25' style='stop-color:%23592582'/%3e%3cstop offset='81.4%25' style='stop-color:%236965ED'/%3e%3c/linearGradient%3e%3c/defs%3e%3crect x='1.5' y='1.5' width='537' height='269' rx='10' fill='none' stroke='url(%23grad)' stroke-width='3' stroke-dasharray='8,4'/%3e%3c/svg%3e")`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat'
                }}
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
                      className="w-6 h-6 sm:w-7 sm:h-7 xl:w-[1.875rem] xl:h-[1.875rem]"
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
                    {/* Styles Unverified as Evaluate page was not loading */}
                    <p
                      className="font-inter text-sm sm:text-base xl:text-[1rem] font-semibold mt-1 sm:mt-2 xl:mt-[0.38rem] bg-[linear-gradient(180deg,#AD6FDE_34.21%,#0077B7_126.32%)] bg-clip-text text-transparent"
                      // style={{
                      //   background: 'linear-gradient(180deg, #AD6FDE 34.21%, #0077B7 126.32%)',
                      //   WebkitBackgroundClip: 'text',
                      //   WebkitTextFillColor: 'transparent',
                      // }}
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
                
                {/* Max file size text - Bottom with responsive gap from container edge */}
                <div className="text-center mb-4 sm:mb-5 xl:mb-[1.31rem]">
                  <span className="text-white font-inter text-xs font-normal">
                    Max file size:{' '}
                  </span>
                  <span className="text-white font-inter text-xs font-semibold">
                    10MB
                  </span>
                </div>
              </div>
            </div>
          )}

{(analysisData.length > 0 || pdfFiles.length > 0) && (
            <div className="flex flex-col mt-8 sm:mt-10 xl:mt-[2.56rem] mx-3 sm:mx-4 xl:mx-[0.94rem] mb-32">
              {/* Cards Container with Upload Box included */}
              <div
  className={`scrollbar-hidden ${
    analysisData.length === 0 && pdfFiles.length === 0
      ? "flex justify-center"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
  } max-h-[calc(100vh-300px)] overflow-y-auto pr-2 pb-32`}
>


         {/* Upload Box as first card */}
                {!showUploader && (
                  <div className="border-dashed flex flex-col text-center relative w-full h-64 sm:h-68 md:h-76 xl:h-[18.75rem] border-3 border-[#592582] rounded-lg">
                    <label className="cursor-pointer flex flex-col items-center h-full">
                      {/* SVG Icon with responsive gap from top */}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="30" 
                        height="30" 
                        viewBox="0 0 30 30" 
                        fill="none"
                        className="w-6 h-6 sm:w-7 sm:h-7 xl:w-[1.875rem] xl:h-[1.875rem] mt-16 sm:mt-20 md:mt-24 xl:mt-[5.63rem]"
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
                      
                      {/* Upload PDF Text with responsive gap from icon */}
                      <p
                        className="font-inter text-sm sm:text-base xl:text-[1rem] font-semibold mt-1 sm:mt-2 xl:mt-[0.38rem] bg-[linear-gradient(180deg,#AD6FDE_34.21%,#0077B7_126.32%)] bg-clip-text text-transparent"
                        // style={{
                        //   background: 'linear-gradient(180deg, #AD6FDE 34.21%, #0077B7 126.32%)',
                        //   WebkitBackgroundClip: 'text',
                        //   WebkitTextFillColor: 'transparent',
                        // }}
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
                    
                    {/* Max file size text - responsive gap from bottom of container */}
                    <div className="text-center absolute bottom-0 left-0 right-0 mb-6 sm:mb-7 xl:mb-[1.75rem]">
                      <span className="text-white font-inter text-xs font-normal">
                        Max file size: {' '}
                      </span>
                      <span className="text-white font-inter text-xs font-semibold">
                        10MB
                      </span>
                    </div>
                  </div>
                )}

                {/* Previous History Cards */}
                {analysisData && analysisData.map((item, idx) => (
               <div key={`old-${idx}`} className="flex flex-col w-full h-76 rounded-lg border-2 border-white bg-black p-4">
               <div
                 className="relative h-40 w-full rounded mb-4 flex flex-col items-center justify-center overflow-hidden bg-no-repeat bg-center bg-contain"
                 style={{ backgroundImage: `url(${satsifactory})` }}
               >
                 {/* 🖤 Transparent black overlay JUST on image */}
                 <div className="absolute inset-0 bg-black/50 z-0" />
             
                 {/* ✅ Content on top of overlay */}
                 <div className="relative z-10 flex flex-col items-center">
                   <span className="text-white font-light text-lg">SATISFACTORY</span>
                   <span className="text-white font-bold text-2xl">
                     {((item.result.breakdown[0].score.value / 800) * 100).toFixed(0)}
                   </span>
                 </div>
               </div>
             
               <div className="text-left">
                 <p className="text-white font-semibold text-base mb-1">{item.file_name}</p>
                 <p className="text-white text-sm mb-3">
                   Evaluated on: {new Date(item.analysis_date).toLocaleDateString()}
                 </p>
                 {item.uploadedBy && (
                   <p className="text-gray-400 text-xs mb-2">
                     Uploaded by: {item.uploadedBy.name || item.uploadedBy.email} ({item.uploaderRole})
                   </p>
                 )}
               </div>
             
               <button
                 onClick={() => {
                   if (!item.canAccess) {
                     alert("You don't have access from founder.");
                     return;
                   }
                   if (!canUsePdfEvaluation) {
                     setShowUpgradePopup(true);
                     return;
                   }
                   navigate("/evaluate/report#analysis", {
                     state: { reportData: item.result, pdfFiles: [item.file_name] },
                   });
                 }}
                 className={`mt-auto w-full py-2 rounded text-sm font-medium ${
                   !item.canAccess
                     ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                     : !canUsePdfEvaluation
                       ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600"
                       : "bg-white text-black hover:bg-gray-200"
                 }`}
                 disabled={!item.canAccess}
               >
                 {!item.canAccess 
                   ? "Access Restricted" 
                   : !canUsePdfEvaluation 
                     ? "Upgrade to Access" 
                     : "Access Report"}
               </button>
             </div>
             
                ))}

                {/* Uploaded PDF Cards - Only show when a file is selected */}
                {pdfFiles && pdfFiles.length > 0 && pdfFiles.map((file, index) => {
  const status = evaluationStatus[file.name] || {}; // ✅ Place this line here
 console.log(status);
  return (
                  
                  <div
                    key={index}
                    // className="flex flex-col w-full h-64 sm:h-72 md:h-80 xl:h-[18.75rem] rounded-lg border-2 border-white bg-black p-3 sm:p-4 xl:p-[0.94rem]"
                    className="flex flex-col w-full h-76 rounded-lg border-2 border-white bg-black p-4"
                  >
                    {/* PDF thumbnail */}                    <div 
                      className="relative h-40 w-full rounded mb-4 p-2 flex bg-black/50 flex-col items-center justify-center bg-no-repeat bg-center bg-contain"
                      style={{
                        backgroundColor: pdfThumbnails[file.name] ? 'transparent' : `url(${satsifactory})`
                      }}
                    >
                      {pdfThumbnails[file.name] ? (
                        <img 
                          src={pdfThumbnails[file.name]} 
                          alt={`${file.name} preview`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-white text-sm">
                          Loading preview...
                        </div>
                      )}
                      
                      {/* Loading Scanning Effect */}
                      { status.evaluating && !status.complete && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="scanning-line"></div>
                        </div>
                      )}
                      
                      {/* Evaluation Complete Overlay */}
                      {status.complete && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                          <div className="text-white font-inter text-lg sm:text-xl md:text-2xl xl:text-[1.75rem] font-light mb-[-0.5rem] mt-2 sm:mt-4 xl:mt-[1rem]">
                            SATISFACTORY
                          </div>
                          <div className="text-white font-inter text-2xl sm:text-3xl md:text-4xl xl:text-[2.5rem] font-semibold">
                            {status.score}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-left">
                      <p className="text-white font-semibold text-base mb-1">{file.name}</p>
                      <p className="text-white text-sm mb-3">
                        {status.complete  
                          ? "Evaluation report is ready and you can access now."
                          : `${new Date().toLocaleDateString()}`}
                      </p>
                    </div>                    <button
                     onClick={
                       !canEvaluate 
                         ? () => alert('You don\'t have access from founder.')
                         : !canUsePdfEvaluation
                           ? () => setShowUpgradePopup(true)
                           : status.complete 
                             ? () => handleAccessReport(status) 
                             : () => handleEvaluation(file)
                     }
                      className={`w-full py-2 rounded text-sm font-medium cursor-pointer transition duration-200 ${
                        !canEvaluate
                          ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                          : !canUsePdfEvaluation
                            ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600'
                            : status.evaluating 
                              ? 'bg-gray-500 text-white' 
                              : 'bg-white text-black hover:bg-gray-200'
                      }`}
                      disabled={!canEvaluate && !status.complete}
                    >
                       {!canEvaluate
                         ? "Access Restricted"
                         : !canUsePdfEvaluation
                           ? "Upgrade to Access"
                           : status.evaluating
                             ? "Initializing..."
                             : status.error
                               ? "Failed to evaluate"
                               : status.complete
                                 ? "Access Report"
                                 : "Evaluate"}
                    </button>
                  </div>
                );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* No Access Toast Notification */}
<div
  className={`fixed top-4 right-4 z-[100] transition-all duration-600 ease-in-out ${
    showNoAccessToast ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
  }`}
>
  <div className="max-w-xs sm:max-w-sm md:max-w-md whitespace-nowrap rounded-md border border-[#18152D] bg-black flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 shadow-lg">
    <span className="text-white font-inter text-sm sm:text-base font-medium">
      You don't have access from founder.
    </span>
  </div>
</div>

{/* Subscription Upgrade Popup */}
<UpgradeSubscriptionPopup 
  isOpen={showUpgradePopup} 
  onClose={() => setShowUpgradePopup(false)} 
  requiredPlans={['Launch', 'Scale']} 
/>
    </div>
  );
}

export default Evaluate_Page;