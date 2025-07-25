'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMMMStore } from '@/store/useMMMStore';
import ConnectGa4 from './ConnectGa4';
import { useSearchParams } from 'next/navigation';
import useUserSession from '../hooks/useUserSession';
import useConnector from '@/components/hooks/connectors/useConnectors';

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
  const { campaigns, selectedCampaigns, setSelectedCampaigns, ga4Linked, setGa4Linked, selectedCountry, setSelectedCountry,
    kpi, setKpi
   } = useMMMStore();
  const [selectAll, setSelectAll] = useState(false);
  const [connectorData, setConnectorData] = useState(false);
  const [showGa4Auth, setShowGa4Auth] = useState(false);
  const [isAuthrozie, setIsAuthorize] = useState(null);
  const [showGa4Modal, setShowGa4Modal] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState<string>('');
  const [isAuthorised, setIsAuthorised] = useState<any>(null);

  const { user, setUser } = useUserSession();
  const { getConnectorData } = useConnector();

  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const refreshTokenParam = searchParams.get("refresh_token");
  const connectGa4Ref = useRef<HTMLDivElement>(null);

  const getTokenFromCode = async (code: string) => {
    try {
      const res = await fetch(`/api/auth/ga4-auth?code=${code}`);
      const data = await res.json();
      setAccessToken(data.access_token || null);
      setRefreshToken(data.refresh_token || null);
    } catch (err) {
      console.error("❌ Error getting token from code:", err);
    }
  };

  const getTokenFromRefreshToken = async (rt: string) => {
    try {
      const res = await fetch('/api/auth/ga4-refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: rt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data);
      setAccessToken(data.access_token || null);
    } catch (err) {
      console.error("❌ Error refreshing token:", err);
    }
  };

  useEffect(() => {
    if (isAuthorised?.refreshToken && !accessToken) {
      getTokenFromRefreshToken(isAuthorised.refreshToken);
    }
  }, [isAuthorised]);

  useEffect(() => {
    if (code && !accessToken) {
      getTokenFromCode(code);
    }
  }, [code]);

  useEffect(() => {
    const fetchAll = async () => {
      if (!user?.email) {
        console.log("❌ No user email available.");
        return;
      }
      try {
        // Step 1: Fetch GA4 Connector status
        const data = await getConnectorData('ga4', user.email);
        setIsAuthorised(data);

        // Step 2: Handle connector found
        if (data?.refreshToken) {
          setRefreshToken(data.refreshToken);
          await getTokenFromRefreshToken(data.refreshToken);
        } 
        else {
          const res = await fetch('/api/ga4-auth-url');
          const authData = await res.json();

          if (authData?.authUrl) {
            setAuthUrl(authData.authUrl);
                  if (!accessToken) {
        if (authUrl) {
          setShowGa4Auth(true);
          // window.location.href = authUrl;
          return;
        } else {
          console.error("❌ Auth URL not ready.");
          return;
        }
      }
          } else {
            console.error("❌ Failed to get GA4 auth URL.");
          }
        }
      } catch (err) {
        console.error("❌ Error in getConnectorData or authURL fetch:", err);
      }
    };

    fetchAll();
  }, [user?.email]);

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
      setSelectedCampaigns(campaigns?.campaigns?.map((c) => c?.Campaign_Name));
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = () => {
    const kpiData = campaigns?.kpi
    setKpi(kpiData)
    if (ga4Linked) {
      if (!accessToken) {
        if (authUrl) {
          setShowGa4Auth(true);
          return;
        } else {
          console.error("❌ Auth URL not ready.");
          return;
        }
      }
      setShowGa4Modal(true);
      setTimeout(() => {
        connectGa4Ref.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      onTableSubmit();
    }
  };

  useEffect(() => {
    if (selectedCampaigns?.length < 2) setSelectAll(false);
  }, [selectedCampaigns]);

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to get selection count info
  const getSelectionInfo = () => {
    const total = campaigns?.campaigns?.length || 0;
    const selected = selectedCampaigns?.length || 0;
    return { total, selected, percentage: total > 0 ? (selected / total * 100).toFixed(0) : 0 };
  };

  const selectionInfo = getSelectionInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white to-blue-50 shadow-2xl rounded-3xl p-8 border border-gray-100"
    >
      <div className='space-y-8'>
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-6">
          <div>
            <motion.h2
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-extrabold text-gray-800 mb-2"
            >
              📊 Campaign Selection
            </motion.h2>
            <p className="text-gray-600">
              Select campaigns for Marketing Mix Modeling analysis
            </p>
          </div>
          <button 
            onClick={handleBack} 
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium border border-blue-200"
          >
            ← Change Customer
          </button>
        </div>

        {/* Campaign Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
            <div className="text-sm font-medium opacity-90">Total Campaigns</div>
            <div className="text-2xl font-bold">{selectionInfo.total}</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
            <div className="text-sm font-medium opacity-90">Selected</div>
            <div className="text-2xl font-bold">{selectionInfo.selected}</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl text-white">
            <div className="text-sm font-medium opacity-90">Selection Rate</div>
            <div className="text-2xl font-bold">{selectionInfo.percentage}%</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-xl text-white">
            <div className="text-sm font-medium opacity-90">Total Spend</div>
            <div className="text-2xl font-bold">
              {formatCurrency(campaigns?.campaigns?.reduce((sum, c) => sum + c?.Total_Spend, 0) || 0)}
            </div>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Table Header with Select All */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-lg font-semibold text-gray-800">
                    Select All Campaigns
                  </span>
                </label>
              </div>
              <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                {selectedCampaigns?.length || 0} of {campaigns?.campaigns?.length || 0} selected
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Select</th>
                  <th className="p-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Campaign Name</th>
                  <th className="p-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Active Weeks</th>
                  <th className="p-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Start Week</th>
                  <th className="p-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">End Week</th>
                  <th className="p-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Total Spend</th>
                  <th className="p-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Spend %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {campaigns?.campaigns?.map((c, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`hover:bg-blue-50 transition-all duration-200 cursor-pointer ${
                      selectedCampaigns?.includes(c?.Campaign_Name) 
                        ? 'bg-blue-50 border-l-4 border-blue-500' 
                        : 'hover:shadow-sm'
                    }`}
                    onClick={() => handleSelect(c?.Campaign_Name)}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedCampaigns.includes(c?.Campaign_Name)}
                        onChange={() => handleSelect(c?.Campaign_Name)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{c?.Campaign_Name}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {c?.Active_Weeks} weeks
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{c?.Start_Week}</td>
                    <td className="p-4 text-gray-600">{c?.End_Week}</td>
                    <td className="p-4">
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(c?.Total_Spend)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min(c?.Spend_Pct, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {c?.Spend_Pct.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Note:</span> Please select at least 2 campaigns for analysis
              </p>
              {selectedCampaigns?.length < 2 && (
                <div className="flex items-center gap-2 text-amber-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">
                    Select {2 - (selectedCampaigns?.length || 0)} more campaign(s)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GA4 + Country Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* GA4 Integration Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">GA</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Google Analytics 4</h3>
                  <p className="text-sm text-gray-600">Enhanced measurement & insights</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-lg font-semibold text-gray-700">
                  Do you have GA4 linked with this account?
                </p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 transition-all hover:shadow-md">
                    <input
                      type="radio"
                      name="ga4"
                      value="true"
                      checked={ga4Linked === true}
                      onChange={() => setGa4Linked(true)}
                      className="w-4 h-4 text-green-600"
                    />
                    <span className="text-lg font-medium">
                      ✅ Yes, I have GA4 linked
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 transition-all hover:shadow-md">
                    <input
                      type="radio"
                      name="ga4"
                      value="false"
                      checked={ga4Linked === false}
                      onChange={() => setGa4Linked(false)}
                      className="w-4 h-4 text-red-600"
                    />
                    <span className="text-lg font-medium">
                      ❌ No, not linked
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Country Selection Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🌍</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Target Market</h3>
                  <p className="text-sm text-gray-600">Where you run your advertisements</p>
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="country" className="text-lg font-semibold text-gray-700">
                  Primary advertising region:
                </label>
                <select
                  id="country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="USA">🇺🇸 United States</option>
                  <option value="INDIA">🇮🇳 India</option>
                  <option value="UAE">🇦🇪 United Arab Emirates</option>
                  <option value="NEWZEALAND">🇳🇿 New Zealand</option>
                  <option value="EUROPE">🇪🇺 Europe</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={selectedCampaigns?.length < 2 || ga4Linked === null}
            className={`px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 transform shadow-lg ${
              selectedCampaigns?.length < 2 || ga4Linked === null
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl"
            }`}
          >
            {selectedCampaigns?.length < 2 || ga4Linked === null ? (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Complete Requirements
              </div>
            ) : (
              <div className="flex items-center gap-2">
                🚀 Continue to Next Step
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* GA4 Authorization Section */}
      {showGa4Auth && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">GA</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            🔐 Authorization Required
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            To continue with GA4 integration, please authorize access to your Google Analytics account
          </p>
          <a
            href={authUrl}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-lg font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
            Authorize Google Analytics
          </a>
        </motion.div>
      )}

      <ConnectGa4
        isModalOpen={showGa4Modal}
        closeModal={() => setShowGa4Modal(false)}
        onSubmitSuccess={() => {
          setShowGa4Modal(false);
          onTableSubmit();
        }}
        accessToken={accessToken}
        refreshToken={refreshToken}
        innerRef={connectGa4Ref}
      />
    </motion.div>
  );
};

export default GoogleAdsTable;