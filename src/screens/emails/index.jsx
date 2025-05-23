import "./style.css"; // Keeping this import in case there are other styles not covered
import Navigation from "../../components/navigation/component";
import templates from "./templates.json";
import { useRef, useState, useEffect } from "react";
import Button from "../../components/button/component";
import { useNavigate } from "react-router";
// import Sidebar from "../../components/Sidebar"; // Importing the Sidebar component instead of FlowNav
import Sidebar2 from "../../components/Sidebar2";

export default function GenerateEmail() {
  const [template, setTemplate] = useState();
  const [type, setType] = useState("BUSSINESS");
  const navigate = useNavigate();
  const editRef = useRef();
  const [maxTemplateHeight, setMaxTemplateHeight] = useState(0);
  const templateRefs = useRef([]);

  const styleText = (style) => {
    console.log(style);
    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (editRef.current.contains(range.commonAncestorContainer)) {
          const span = document.createElement("span");
          style == "bold"
            ? (span.style.fontWeight = "bold")
            : style == "underline"
            ? (span.style.textDecoration = "underline")
            : (span.style.fontStyle = "italic");

          range.surroundContents(span);
        }
      }
    }
  };

  useEffect(() => {
    console.log(template);
    editRef.current.innerText = template?.body || "";
  }, [template]);

  // Set up refs for each template container
  useEffect(() => {
    templateRefs.current = templateRefs.current.slice(0, templates.length);
  }, [templates]);

  // Calculate max height after component mounts and when window resizes
  useEffect(() => {
    const calculateMaxHeight = () => {
      let maxHeight = 0;
      templateRefs.current.forEach((ref) => {
        if (ref && ref.offsetHeight > maxHeight) {
          maxHeight = ref.offsetHeight;
        }
      });
      setMaxTemplateHeight(maxHeight);
    };

    // Initial calculation
    setTimeout(calculateMaxHeight, 100); // Small delay to ensure content is rendered

    // Recalculate on window resize
    window.addEventListener('resize', calculateMaxHeight);
    
    return () => {
      window.removeEventListener('resize', calculateMaxHeight);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black flex overflow-hidden">
      <Sidebar2 />
      
      <div className="w-full h-full flex flex-col text-white font-['Manrope'] overflow-y-auto">
        {/* Templates section with horizontal scrolling */}
        <div className="w-full p-5 bg-[#090909]">
          <p className="mb-4 font-bold">Select your template</p>
          <div className="flex overflow-x-auto gap-4 ">
            {templates?.map((temp, i) => (
              <div key={i} className="min-w-[350px] max-w-[350px] flex-shrink-0">
                <div className="text-xs font-bold text-[#e0e0e0] w-max h-max border border-[#2b2b2b] border-b-0 uppercase py-2 px-3 rounded-t-[20px]">
                  {temp.varient}
                </div>
                <div 
                  ref={el => templateRefs.current[i] = el}
                  className="w-full rounded-[10px] bg-[#101010] flex flex-col text-left p-5 gap-2.5 border border-[#2b2b2b] relative overflow-hidden"
                  style={{ height: maxTemplateHeight > 0 ? `${maxTemplateHeight}px` : 'auto' }}
                >
                  <p className="text-sm text-[#bdbdbd]">
                    <span className="text-gray-500">Subject:</span> {temp.subject}
                  </p>
                  <div className="text-xs w-full bg-[#181818] p-2.5 rounded-md mt-1.5 text-[#bdbdbd]">
                    I hope this email finds you well. I wanted to reach out to
                    introduce you to TechStartup Inc., an AI infrastructure
                    company that I founded and lead as CEO...
                  </div>
                  <div className="w-full h-full bg-[#00000067] absolute top-0 left-0 flex justify-center items-center backdrop-blur-[9px] opacity-0 hover:opacity-100 transition-all duration-300">
                    <button 
                      className="w-max h-max border border-white font-['Manrope'] text-xs text-white py-2 px-5 bg-[#ffffff2a] rounded-[30px] cursor-pointer font-bold"
                      onClick={() => setTemplate(temp)}
                    >
                      Use this Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Horizontal border line with proper spacing */}
          <div className="w-full border-b border-[#222222] mt-4"></div>
        </div>
        
        {/* Editor section with vertical scrolling - added 1px gap with mt-[1px] */}
        <div className="flex-1 p-5 -mt-5 w-full max-w-[1000px] mx-auto ">
          <div className="w-full border border-[#222222] rounded-[15px] overflow-hidden bg-[#090909]">
            <div className="w-full h-[50px] border-b border-[#171717] bg-[#121212] flex justify-between items-center px-5 pr-0">
              <p className="text-white">{template?.varient}</p>
              <button className="w-[50px] h-[50px] border-none border-l border-[#222222] flex justify-center items-center text-white bg-[#222] text-[27px] text-[#9a9a9a] cursor-pointer">
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>
            <div className="w-full p-5 border-none bg-transparent text-white overflow-y-visible font-['Manrope'] outline-none text-sm grid grid-rows-[40px_40px_1fr] gap-1.5">
              <input
                type="text"
                className="w-full h-[40px] border border-[#36363652] rounded-md px-4 text-white font-['Manrope'] outline-none bg-[#121212]"
                placeholder="From: test@test.com"
              />
              <input
                type="text"
                className="w-full h-[40px] border border-[#36363652] rounded-md px-4 text-white font-['Manrope'] outline-none bg-[#121212]"
                placeholder="To: test@test.com"
              />
              <div className="w-full h-[400px] relative">
                <div className="w-max h-[30px] flex gap-1.5 absolute top-2.5 left-2.5 z-[3]">
                  <button 
                    className="w-[30px] flex justify-center items-center border border-[#36363652] bg-[#1a1a1a] text-[#c2c2c2] font-['Manrope'] rounded-md cursor-pointer font-bold"
                    onClick={() => styleText("bold")}
                  >
                    B
                  </button>
                  <button
                    className="w-[30px] flex justify-center items-center border border-[#36363652] bg-[#1a1a1a] text-[#c2c2c2] font-['Manrope'] rounded-md cursor-pointer italic font-['Kode_Mono']"
                    onClick={() => styleText("italic")}
                  >
                    I
                  </button>
                  <button
                    className="w-[30px] flex justify-center items-center border border-[#36363652] bg-[#1a1a1a] text-[#c2c2c2] font-['Manrope'] rounded-md cursor-pointer underline"
                    onClick={() => styleText("underline")}
                  >
                    U
                  </button>
                  <button className="w-[30px] flex justify-center items-center border border-[#36363652] bg-[#1a1a1a] text-[#c2c2c2] font-['Manrope'] rounded-md cursor-pointer">
                    <ion-icon name="link-outline"></ion-icon>
                  </button>
                </div>
                <div 
                  className="w-full h-full border border-[#36363652] rounded-md text-white font-['Manrope'] outline-none text-sm p-4 relative pt-[60px] bg-[#121212] leading-[150%]"
                  ref={editRef} 
                  contentEditable
                ></div>
                <div className="w-max fixed bottom-5 right-5">
                  <Button
                    context={"Verify & Submit"}
                    theme={"light"}
                    callback={() => {
                      navigate("/flow/pipeline");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}