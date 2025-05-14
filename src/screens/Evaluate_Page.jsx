import React, { useState } from "react";
import Background2 from "../assets/background2.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

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
      {/* w-full md:w-1/5 bg-gray-800 p-4 text-center text-2xl */}
      <div className="">
        <Sidebar />
      </div>

      <div className="flex-1 px-4 py-8">
        {/* Header */}

        <div className="relative">
          {/* Hero section */}
          <div className="relative h-80 flex justify-center items-center rounded-md overflow-hidden">
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

            {/* Heading */}
            <h4 className="relative text-3xl font-semibold text-white text-center font-sans z-10">
              Company Pitch Deck Evaluator
            </h4>
          </div>

          {/* Uploader (partially overlapping bottom of hero section) */}
          {showUploader && pdfFiles.length === 0 && (
            <div className="absolute left-1/2 bottom-[-9.9rem] transform -translate-x-1/2 w-[90%] sm:w-1/2 h-60 border-4 border-dotted border-purple-500 text-center p-6 rounded-xl flex flex-col justify-center items-center z-20 bg-black bg-opacity-70">
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <p className="text-4xl text-purple-500 border-black border-2 pb-1 px-2 rounded-md hover:border-purple-500 active:border-purple-500">
                  +
                </p>
                <p className="text-purple-500 font-semibold mt-2 text-lg">
                  Upload PDF
                </p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
              </label>
              <p className="text-gray-400 text-sm mt-2">
                Max file size:{" "}
                <span className="font-semibold text-white">10MB</span>
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        {!showUploader && (
          <div className="text-center mt-8">
            <p className="text-gray-400 mb-4">
              You haven’t added any deck yet, add one to evaluate now.
            </p>
            <button
              onClick={handleAddNowClick}
              className="px-5 py-2 rounded-md border border-gray-500 text-gray-500 hover:bg-gray-500 active:bg-gray-500  hover:text-white active:text-white   transition duration-300 font-semibold"
            >
              Add Now
            </button>
          </div>
        )}
        {/* 
        {showUploader && pdfFiles.length === 0 ? (
          <div className="mt-[-5rem] mx-auto w-1/2 h-60 border-4 border-dotted border-purple-500 text-center p-6 rounded-xl flex flex-col justify-center items-center">
            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
              <p className="text-4xl text-purple-500 mb-2">+</p>
              <p className="text-purple-500 font-semibold text-lg">
                Upload PDF
              </p>
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                className="hidden"
              />
            </label>
            <p className="text-gray-400 text-sm mt-2">
              Max file size:{" "}
              <span className="font-semibold text-white">10MB</span>
            </p>
          </div>
        ) : (
          ""
        )} */}

        {pdfFiles.length > 0 && (
          <div className="flex flex-wrap gap-6 justify-start mt-6">
            {/* Upload Box */}
            <div className="w-full sm:w-70 h-60 border-4 border-dotted border-purple-500 text-center p-6 rounded-xl flex flex-col justify-center items-center">
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <p className="text-4xl text-purple-500 mb-2">+</p>
                <p className="text-purple-500 font-semibold text-lg">
                  Upload PDF
                </p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
              </label>
              <p className="text-gray-400 text-sm mt-2">
                Max file size:{" "}
                <span className="font-semibold text-white">10MB</span>
              </p>
            </div>

            {/* Uploaded PDF Cards */}
            {pdfFiles.map((file, index) => (
              <div
                key={index}
                className="w-full sm:w-70 bg-black  rounded-xl p-2 shadow-md flex flex-col items-center border border-white"
              >
                {/* You can replace this with an actual PDF thumbnail if needed */}
                <div className="h-32 w-full bg-gray-500 rounded mb-2" />

                <p className="font-semibold">{file.name}</p>
                <p className="text-sm text-gray-300">
                  {evaluation === true
                    ? "Evaluation will be ready with in a minute."
                    : `${new Date().toLocaleDateString()}`}
                </p>
                <button
                  onClick={handleEvaluation}
                  className="mt-2 bg-white text-black w-full py-1 rounded-md hover:bg-gray-500 hover:text-white"
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
  );
}

export default Evaluate_Page;
