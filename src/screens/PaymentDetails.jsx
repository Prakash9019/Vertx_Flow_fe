import React from 'react';
import PaymentGradient3 from '../assets/PaymentGradient3.png';

const featuresData = [
  {
    category: "Fundraising & features",
    features: [
      { name: "Dashboard", starter: "Yes", launch: "Yes", scale: "Yes" },
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
      { name: "Suggestions", starter: "Basic", launch: "Advanced", scale: "Advanced" },
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
    <div className="container font-[inter] mx-auto p-4 md:p-8 bg-gray-950 text-white min-h-screen">
      {/* Title Alignment */}
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left">Compare tiers and features</h1>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-800">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-800/50 backdrop-blur-sm">
              <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-400 w-1/4 rounded-tl-lg"></th>
              <th className="py-4 px-4 text-center text-sm font-semibold uppercase tracking-wider text-gray-400 w-1/4">Starter</th>
              <th className="py-4 px-4 text-center text-sm font-semibold uppercase tracking-wider text-gray-400 w-1/4">Launch</th>
              <th className="py-4 px-4 text-center text-sm font-semibold uppercase tracking-wider text-gray-400 w-1/4 rounded-tr-lg">Scale</th>
            </tr>
          </thead>
          <tbody>
            {featuresData.map((categoryGroup, index) => (
              <React.Fragment key={index}>
                {/* Each Category Block (Header + Features) gets the PaymentGradient3 background */}
                <tr className="bg-[url('/src/assets/PaymentGradient3.png')] bg-cover bg-center bg-no-repeat">
                  {/* Category Header (now part of the row with the background) */}
                  <td colSpan="4" className="py-4 px-4 text-lg font-bold text-white uppercase tracking-wider">
                    {categoryGroup.category}
                    {/* Subtle border *below* the category header text within the same background block */}
                    <div className="h-px bg-gray-800 mt-2"></div> {/* Added margin-top */}
                  </td>
                </tr>
                {/* Features within Category (also share the same background via the parent tr) */}
                {categoryGroup.features.map((feature, featureIndex) => (
                  <tr key={featureIndex} className="border-b border-gray-800 last:border-b-0 hover:bg-gray-800/30 transition duration-150 ease-in-out">
                    <td className="py-3 px-4 text-sm font-medium text-gray-300">{feature.name}</td>
                    <td className="py-3 px-4 text-center text-sm">
                      <FeatureValue value={feature.starter} />
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      <FeatureValue value={feature.launch} />
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      <FeatureValue value={feature.scale} />
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
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