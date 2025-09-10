import { useState } from "react";
import { Search, ChevronDown, Heart, ExternalLink } from "lucide-react";

const FundraisingMatches = () => {
  const [selectedTab, setSelectedTab] = useState("Matches");
  
  const accelerators = [
    {
      id: 1,
      name: "Y Combinator",
      logo: "Y",
      logoColor: "#FF6B35",
      cheque: "$500K",
      match: "80%",
      fit: "23%"
    },
    {
      id: 2,
      name: "Techstars",
      logo: "techstars",
      logoColor: "#000",
      cheque: "$120K",
      match: "80%",
      fit: "23%"
    },
    {
      id: 3,
      name: "Mass Challenge",
      logo: "MC",
      logoColor: "#0088CC",
      cheque: "$120K",
      match: "80%",
      fit: "23%"
    },
    {
      id: 4,
      name: "Techstars",
      logo: "techstars",
      logoColor: "#000",
      cheque: "$120K",
      match: "80%",
      fit: "23%"
    },
    {
      id: 5,
      name: "Techstars",
      logo: "techstars",
      logoColor: "#000",
      cheque: "$120K",
      match: "80%",
      fit: "23%"
    }
  ];

  const renderLogo = (accelerator) => {
    if (accelerator.name === "Y Combinator") {
      return (
        <div className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center text-2xl font-bold text-white mr-4">
          Y
        </div>
      );
    } else if (accelerator.name === "Mass Challenge") {
      return (
        <div className="w-12 h-12 bg-white rounded flex items-center justify-center mr-4">
          <div className="text-xl font-bold text-blue-500">MC</div>
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 border border-gray-700 rounded flex items-center justify-center mr-4">
          <div className="text-xs text-gray-300">techstars.</div>
        </div>
      );
    }
  };
  
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-6xl mx-auto p-6">
          
          
          
          
          {/* Accelerators Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold border-l-4 border-purple-500 pl-4">Accelerators</h2>
            
            <div className="flex items-center">
              <div className="bg-purple-900 px-4 py-2 rounded-lg flex items-center">
                <span className="mr-2">Accelerators</span>
                <span className="bg-purple-700 px-2 rounded">32</span>
                <ChevronDown size={16} className="ml-2" />
              </div>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex justify-between mb-6">
            <div className="relative flex-1 max-w-lg">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search Investors..." 
                className="w-full bg-gray-800 text-white rounded-lg py-2 pl-10 pr-4"
              />
            </div>
            
            <div className="flex items-center bg-gray-800 text-white rounded-lg px-4 py-2">
              <span className="text-sm mr-2">Highest Match Rate</span>
              <ChevronDown size={16} />
            </div>
          </div>
          
          {/* Table Header */}
          <div className="grid grid-cols-12 text-xs text-gray-400 mb-2 px-4">
            <div className="col-span-4">VENTURE NAME</div>
            <div className="col-span-2">CHEQUE</div>
            <div className="col-span-2">MATCH</div>
            <div className="col-span-2">FIT</div>
            <div className="col-span-2"></div>
          </div>
          
          {/* Accelerator Cards */}
          <div className="space-y-4">
            {accelerators.map(accelerator => (
              <div 
                key={accelerator.id}
                className="bg-gray-900 rounded-lg grid grid-cols-12 items-center px-4 py-6"
              >
                {/* Logo and Name */}
                <div className="col-span-4 flex items-center">
                  {renderLogo(accelerator)}
                  
                  <div>
                    <div className="font-semibold">{accelerator.name}</div>
                    <div className="text-xs text-purple-500 uppercase mt-1">ACCELERATOR</div>
                  </div>
                  
                  <button className="ml-6 text-gray-600">
                    <Heart size={18} />
                  </button>
                </div>
                
                {/* Cheque */}
                <div className="col-span-2">
                  <span className="bg-purple-900 px-3 py-1 rounded text-purple-400">{accelerator.cheque}</span>
                </div>
                
                {/* Match */}
                <div className="col-span-2 text-3xl font-bold">{accelerator.match}</div>
                
                {/* Fit */}
                <div className="col-span-2 text-3xl font-bold">{accelerator.fit}</div>
                
                {/* Apply Button */}
                <div className="col-span-2 text-right">
                  <button className="bg-purple-900 hover:bg-purple-800 px-4 py-2 rounded flex items-center ml-auto">
                    <span className="mr-2">Apply</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundraisingMatches;