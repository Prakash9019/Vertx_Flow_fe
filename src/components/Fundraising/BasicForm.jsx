// components/forms/BasicInfoForm.jsx
import React, { useState } from 'react';

const businessCategories = ['B2C', 'B2B', 'B2B2C', 'Other'];
const companyTypes = ['Ecommerce', 'Marketplace', 'SaaS', 'Social Network', 'Hardware', 'Other'];
const sectorsList = [
  'Advertising', 'AgTech', 'AI', 'Analytics', 'AR/VR', 'AudioTech', 'AutoTech', 'BioTech', 'Chemicals',
  'ClimateTech/CleanTech', 'Cloud Infrastructure', 'ConstructionTech', 'Consumer Health', 'Consumer Internet',
  'Cosemetics', 'Creator/Passion Economy', 'Cybersecurity', 'Data Services', 'DeepTech', 'DefenseTech',
  'DeveloperTools', 'Diagnostics', 'Digital Health', 'DTC', 'Drug Delivery', 'E-Commerce', 'Education',
  'EnergyTech', 'Enterprise', 'Enterprise Applications', 'Enterprise Infrastructure', 'Entertainment & Sports',
  'Fashion', 'FinTech', 'Food and Beverage', 'Future of Work', 'Games', 'Gaming/ESports', 'General Tech',
  'GenTech/AI', 'Gig Economy', 'GovTech', 'Hardware', 'Health & Hospital Services', 'Health IT',
  'Human Capital/HRTech', 'Impact', 'Insurance', 'IoT', 'LegalTech', 'Local Services', 'Lodging/Hospitality',
  'Logistics', 'Manufacturing', 'MarketingTech', 'Marketplaces', 'Material Science', 'Media/Content',
  'Medical Devices', 'Messaging', 'Parenting/Families', 'Payments', 'Pharmaceuticals', 'Real Estate/PropTech',
  'Retail', 'Robotics', 'SaaS', 'Sales & CRM', 'Security', 'Semiconductors', 'Smart Cities/UrbanTech',
  'SMB Software', 'Social Commerce', 'Social Networks', 'Space', 'Supply Chain Tech', 'Therapeutics',
  'TransportationTech', 'Travel', 'Web3/Blockchain', 'Web3/Crypto', 'Wellness & Fitness'
];

export default function BasicInfoForm({ formData, setFormData }) {
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMultiSelect = (key, value) => {
    const current = formData[key] || [];
    if (current.includes(value)) {
      setFormData({ ...formData, [key]: current.filter(item => item !== value) });
    } else if (key === 'sectors' && current.length >= 3) {
      return; // limit to 3
    } else {
      setFormData({ ...formData, [key]: [...current, value] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white">Founded (DD-MM-YYYY)</label>
        <input
          type="date"
          name="founded"
          value={formData.founded || ''}
          onChange={handleInput}
          className="w-full px-3 py-2 rounded bg-neutral-800 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white">Company Website</label>
        <input
          type="url"
          name="website"
          value={formData.website || ''}
          onChange={handleInput}
          className="w-full px-3 py-2 rounded bg-neutral-800 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white">Business Category</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {businessCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleMultiSelect('category', cat)}
              className={`px-4 py-1 rounded-full text-sm border ${
                formData.category?.includes(cat) ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-white'
              }`}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white">Sectors (max 3)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 h-40 overflow-y-scroll">
          {sectorsList.map(sector => (
            <label key={sector} className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={formData.sectors?.includes(sector) || false}
                onChange={() => toggleMultiSelect('sectors', sector)}
              />
              <span>{sector}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white">Current Stage</label>
        <div className="flex gap-4 mt-2 text-white">
          {['Pre-Product', 'Pre-Revenue', 'Post-Revenue'].map(stage => (
            <label key={stage} className="flex items-center space-x-2">
              <input
                type="radio"
                name="stage"
                value={stage}
                checked={formData.stage === stage}
                onChange={handleInput}
              />
              <span>{stage}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white">Business Type</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {companyTypes.map(type => (
            <button
              key={type}
              onClick={() => toggleMultiSelect('businessTypes', type)}
              className={`px-4 py-1 rounded-full text-sm border ${
                formData.businessTypes?.includes(type) ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-white'
              }`}
              type="button"
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
