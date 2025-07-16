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

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-2xl rounded-3xl p-8 max-h-[94dvh] overflow-y-scroll"
    >
      <div className='space-y-8'>
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

        {/* Campaigns Table */}
        <div className="overflow-x-auto">
          {/* Select All */}
          <div className="flex items-center gap-3 pb-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="w-5 h-5 text-blue-600"
            />
            <label className="text-lg font-medium">Select All Campaigns</label>
          </div>
          <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-base 2xl:text-xl font-semibold border-b">Select</th>
                <th className="p-3 text-left text-base 2xl:text-xl font-semibold border-b">Campaign Name</th>
                <th className="p-3 text-left text-base 2xl:text-xl font-semibold border-b">Active Weeks</th>
                <th className="p-3 text-left text-base 2xl:text-xl font-semibold border-b">Start Week</th>
                <th className="p-3 text-left text-base 2xl:text-xl font-semibold border-b">End Week</th>
                <th className="p-3 text-left text-base 2xl:text-xl font-semibold border-b">Total Spend</th>
                <th className="p-3 text-left text-base 2xl:text-xl font-semibold border-b">Spend %</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {campaigns?.campaigns?.map((c, idx) => (
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
                  <td className="p-3">{c?.Start_Week}</td>
                  <td className="p-3">{c?.End_Week}</td>
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
                Where do you run your ads?
              </label>
              <select
                id="country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="border border-gray-300 rounded-[7px] pl-4 pr-12 py-3 text-base focus:ring-2 focus:ring-blue-400"
              >
                <option value="USA">USA</option>
                <option value="INDIA">India</option>
                <option value="UAE">UAE</option>
                <option value="NEWZEALAND">Newzealand</option>
                <option value="EUROPE">Europe</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={selectedCampaigns?.length < 2 || ga4Linked === null}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-3 px-6 rounded-xl disabled:opacity-50 transition"
        >
          Submit & Next
        </motion.button>
      </div>

      {showGa4Auth &&
        <div className="p-8 mt-5 text-center mx-auto">
          <h1 className="pb-5 text-3xl font-semibold text-gray-800">Authorize Google Analytics to Continue</h1>
          <a
            href={authUrl}
            className="inline-block bg-primary text-xl text-white py-3 px-6 rounded-full shadow-md transition-all duration-100 ease-in-out transform hover:bg-gray-700 hover:scale-105"
          >
            Authorize
          </a>
        </div>
      }

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
