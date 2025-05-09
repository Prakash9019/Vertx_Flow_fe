import React, { useState } from "react";
import Header from "../components/Header";
import { FaPlus } from "react-icons/fa";

function AddCofounder_Page() {
  const [cofounders, setCofounders] = useState([""]); // Start with one input
  const [inviteAlert, setInviteAlert] = useState(false);

  // Handle individual cofounder email input change
  const handleCofounderChange = (index, value) => {
    const updated = [...cofounders];
    updated[index] = value;
    setCofounders(updated);
  };

  // Add a new cofounder input field
  const handleAddCofounder = () => {
    setCofounders((prev) => [...prev, ""]);
  };

  const handleInvite = () => {
    setInviteAlert(true);
    setTimeout(() => {
      setInviteAlert(false);
    }, 1000);
    console.log(cofounders);
    setCofounders([""]);
  };

  return (
    <div className="min-h-screen text-white bg-black bg-cover bg-top bg-no-repeat p-4 sm:p-6 md:p-9">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950 opacity-65 z-0"></div>
      <div className="relative z-10">
        <Header />
        {/* body  */}
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="w-full sm:w-3/5 lg:w-3/6 xl:w-3/10 flex flex-col gap-8 justify-center px-4 sm:px-0 text-white">
            {inviteAlert && (
              <div className="bg-green-600 text-white px-4 py-2 rounded-md border border-green-800 shadow-md transition duration-300">
                Invite sent successfully!
              </div>
            )}
            <div>
              <h5 className="text-xl sm:text-2xl font-semibold mb-2">
                One last thing! Invite your co-founder
              </h5>
              <p className="text-sm sm:text">
                Get a lot more done with Visible by inviting your team
              </p>
            </div>

            <div className="space-y-2">
              {cofounders.map((email, index) => (
                <input
                  key={index}
                  type="email"
                  value={email}
                  onChange={(e) => handleCofounderChange(index, e.target.value)}
                  placeholder={`Enter cofounder email`}
                  className="w-full py-1 rounded-md px-2 border border-gray-700 text-white"
                />
              ))}

              <button
                onClick={handleAddCofounder}
                className="bg-black px-4 py-2 mt-2 flex items-center gap-2 rounded-md border-2 border-black hover:border-gray-700 active:border-gray-700"
              >
                <FaPlus /> Add Co-founder
              </button>
            </div>

            <div>
              <button
                onClick={handleInvite}
                className="bg-white text-black px-5 py-2 rounded-md font-semibold border-3 hover:border-purple-500 active:border-purple-500"
              >
                Invite
              </button>
              <span className="mx-3">or</span>
              <button className="bg-black px-5 py-2 rounded-md font-semibold border-2 border-black hover:border-gray-700 active:border-gray-700">
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCofounder_Page;
