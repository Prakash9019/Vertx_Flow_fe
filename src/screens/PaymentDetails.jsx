import React from 'react';
import PaymentGradient3 from '../assets/PaymentGradient3.png';

const featuresData = [
  {
    category: "Fundraising Experience",
    features: [
      { name: "Dashboard", starter: "Yes", launch: "Analytics included", scale: "Analytics included" },
      { name: "Investor database", starter: "Yes", launch: "Yes", scale: "Match score (included)" },
      { name: "Manage and track progress", starter: "Yes", launch: "+2 extra rounds", scale: "Unlimited rounds" },
      { name: "Create target lists", starter: "Yes", launch: "Shareable", scale: "Shareable" },
      { name: "Customized one pager", starter: "Yes", launch: "Analytics with tips", scale: "Analytics with tips" },
    ],
  },
  {
    category: "Flash",
    features: [
      { name: "Usage limits", starter: "No", launch: "High", scale: "Highest" },
      { name: "SuperFlash", starter: "No", launch: "No", scale: "Yes" },
      { name: "Early access to new features", starter: "No", launch: "No", scale: "Yes" },
    ],
  },
  {
    category: "Investor Outreach",
    features: [
      { name: "Outreach", starter: "No", launch: "Manual", scale: "Smarter + Analytics" },
      { name: "Compliments & feedback", starter: "View only", launch: "Manual Reply", scale: "Enhanced + Schedule call" },
      { name: "Automated outreach", starter: "No", launch: "No", scale: "Yes" },
    ],
  },
  {
    category: "Evaluate",
    features: [
      { name: "Pitch Deck Evaluation", starter: "No", launch: "Yes", scale: "Downloadable + Insights" },
      { name: "Suggestions", starter: "No", launch: "Basic", scale: "Advanced" },
    ],
  },
  {
    category: "Playground",
    features: [
      { name: "Mock Pitching", starter: "No", launch: "No", scale: "Unlimited calls + Custom" },
      { name: "Pitch Deck Generator", starter: "No", launch: "2 per month", scale: "Unlimited + Easy modify" },
    ],
  },
  {
    category: "Other",
    features: [
      { name: "Support", starter: "Standard", launch: "Priority", scale: "1:1 Expert Support" },
    ],
  },
];

const FeatureTable = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-950 text-white min-h-screen">
      {/* Title Alignment */}
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left">Compare tiers and features</h1>

      <div className="flex flex-col gap-4">
        {featuresData.map((categoryGroup, index) => (
          <div
            key={index}
            className="bg-[url('/src/assets/PaymentGradient3.png')] bg-cover bg-center bg-no-repeat rounded-lg shadow-lg overflow-hidden border border-gray-800"
          >
            {/* Added a wrapper div with overflow-x-auto for small screens */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead>
                  <tr className="backdrop-blur-sm">
                    {/* Category Name Column */}
                    <th className="py-4 px-4 text-left text-xs sm:text-lg font-bold text-white uppercase tracking-wider min-w-[150px] sm:min-w-0">
                      {categoryGroup.category}
                      <div className="h-px bg-gray-800 mt-2"></div>
                    </th>
                    {/* Tier Headers */}
                    <th className="py-4 px-4 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-400 w-1/4 min-w-[80px] sm:min-w-0">Starter</th>
                    <th className="py-4 px-4 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-400 w-1/4 min-w-[80px] sm:min-w-0">Launch</th>
                    <th className="py-4 px-4 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-400 w-1/4 min-w-[80px] sm:min-w-0">Scale</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Features */}
                  {categoryGroup.features.map((feature, featureIndex) => (
                    <tr key={featureIndex} className="border-b border-gray-800 last:border-b-0 hover:bg-gray-800/30 transition duration-150 ease-in-out">
                      <td className="py-3 px-4 text-xs sm:text-sm font-medium text-gray-300 min-w-[150px] sm:min-w-0">{feature.name}</td>
                      <td className="py-3 px-4 text-center text-xs sm:text-sm min-w-[80px] sm:min-w-0">
                        <FeatureValue value={feature.starter} />
                      </td>
                      <td className="py-3 px-4 text-center text-xs sm:text-sm min-w-[80px] sm:min-w-0">
                        <FeatureValue value={feature.launch} />
                      </td>
                      <td className="py-3 px-4 text-center text-xs sm:text-sm min-w-[80px] sm:min-w-0">
                        <FeatureValue value={feature.scale} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper component to render "Yes", "No", or other text with appropriate colors
const FeatureValue = ({ value }) => {
  if (value === 'Yes') {
    return <span className="text-green-400">Yes</span>;
  }
  if (value === 'No') {
    return <span className="text-red-400">No</span>;
  }
  return <span className="text-gray-300">{value}</span>;
};

export default FeatureTable;