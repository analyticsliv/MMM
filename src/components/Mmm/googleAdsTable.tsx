'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMMMStore } from '@/store/useMMMStore';

interface Campaign {
  Campaign_Name: string;
  Active_Weeks: number;
  Total_Spend: number;
  Spend_Pct: number;
}

interface Props {
  handleBack: () => void;
  onTableSubmit: () => void;
}

const GoogleAdsTable: React.FC<Props> = ({ handleBack, onTableSubmit }) => {
  const { campaigns, selectedCampaigns, setSelectedCampaigns, ga4Linked, setGa4Linked, selectedCountry, setSelectedCountry } = useMMMStore();
  const [selectAll, setSelectAll] = useState(false);
  // const [selectedCountry, setSelectedCountry] = useState('usa');

  const handleSelect = (name: string) => {
    const updated = selectedCampaigns.includes(name)
      ? selectedCampaigns.filter((n) => n !== name)
      : [...selectedCampaigns, name];
    setSelectedCampaigns(updated);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(campaigns?.map((c) => c.Campaign_Name));
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = () => {
    console.log('Selected Campaigns:', selectedCampaigns);
    console.log('GA4 Linked:', ga4Linked);
    console.log('Country:', selectedCountry);
    onTableSubmit();
  };

  useEffect(() => {
    if (selectedCampaigns.length < 2) setSelectAll(false);
  }, [selectedCampaigns]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-2xl rounded-3xl p-8 space-y-10"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-gray-800"
        >
          Google Ads Customer Report
        </motion.h2>
        <button onClick={handleBack} className="text-blue-600 hover:underline font-medium">
          ← Change Customer
        </button>
      </div>

      {/* Select All */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
          className="w-5 h-5 text-blue-600"
        />
        <label className="text-lg font-medium">Select All Campaigns</label>
      </div>

      {/* Campaigns Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-base 2xl:text-xl font-semibold border-b">Select</th>
              <th className="p-3 text-left text-base 2xl:text-xl font-semibold border-b">Campaign Name</th>
              <th className="p-3 text-left text-base 2xl:text-xl font-semibold border-b">Active Weeks</th>
              <th className="p-3 text-left text-base 2xl:text-xl font-semibold border-b">Total Spend</th>
              <th className="p-3 text-left text-base 2xl:text-xl font-semibold border-b">Spend %</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {campaigns?.map((c, idx) => (
              <tr
                key={idx}
                className={`hover:bg-blue-50 transition-colors duration-200 ${selectedCampaigns.includes(c?.Campaign_Name) ? 'bg-blue-50' : ''
                  }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedCampaigns.includes(c?.Campaign_Name)}
                    onChange={() => handleSelect(c?.Campaign_Name)}
                    className="w-5 h-5 text-blue-600"
                  />
                </td>
                <td className="p-3">{c?.Campaign_Name}</td>
                <td className="p-3">{c?.Active_Weeks}</td>
                <td className="p-3">{c?.Total_Spend.toLocaleString()}</td>
                <td className="p-3">{c?.Spend_Pct.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-sm text-[#737883] pt-2">(Please select at least 2 campaigns)</p>
      </div>

      {/* GA4 + Country Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-50 p-6 rounded-xl shadow-inner"
      >

        <div className="flex flex-col sm:flex-row justify-start items-start gap-6">
          {/* GA4 Radio */}
          <div className='flex flex-col'>
            <label className="block text-xl font-semibold mb-4">
              Do you have GA4 linked with this account?
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-lg">
                <input
                  type="radio"
                  name="ga4"
                  value="true"
                  checked={ga4Linked === true}
                  onChange={() => setGa4Linked(true)}
                  className="w-4 h-4"
                />
                Yes
              </label>
              <label className="flex items-center gap-2 text-lg">
                <input
                  type="radio"
                  name="ga4"
                  value="false"
                  checked={ga4Linked === false}
                  onChange={() => setGa4Linked(false)}
                  className="w-4 h-4"
                />
                No
              </label>
            </div>
          </div>

          {/* Country Dropdown aligned to right */}
          <div className="flex flex-col gap-2 lg:ml-32">
            <label htmlFor="country" className="text-lg font-medium">
              Country:
            </label>
            <select
              id="country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="border border-gray-300 rounded-[7px] pl-4 pr-12 py-3 text-base focus:ring-2 focus:ring-blue-400"
            >
              <option value="USA">USA</option>
              <option value="India">India</option>
            </select>
          </div>
        </div>
      </motion.div>


      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={selectedCampaigns.length < 2 || ga4Linked === null}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-3 px-6 rounded-xl disabled:opacity-50 transition"
      >
        Submit & Next
      </motion.button>
    </motion.div>
  );
};

export default GoogleAdsTable;
