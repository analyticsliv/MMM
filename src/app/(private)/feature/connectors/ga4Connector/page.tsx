// src/app/feature/connectors/ga4Connector/page.tsx
"use client";
import React, { useEffect, useState } from 'react';

const GA4ConnectorPage = () => {
  const [authUrl, setAuthUrl] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAuthUrl() {
      try {
        const response = await fetch('/api/ga4-auth-url');
        const data = await response.json();
        setAuthUrl(data.authUrl);
      } catch (error) {
        console.error('Error fetching auth URL:', error);
      }
    }

    fetchAuthUrl();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#F6F8FE] to-[#E8EAF6]">
    <div className="bg-white shadow-lg rounded-lg p-8 text-center mx-auto">
      <h1 className="pb-5 text-3xl font-semibold text-gray-800">Authorize Google Analytics Access</h1>
      <a 
        href={authUrl} 
        className="inline-block bg-primary text-xl text-white py-3 px-6 rounded-full shadow-md transition-all duration-100 ease-in-out transform hover:bg-gray-700 hover:scale-105"
      >
        Authorize
      </a>
    </div>
  </div>
    // <div>
    //   <h1 className='pb-5 text-base'>Authorize Google Analytics Access</h1>
    //   <a href={authUrl} className='border border-indigo-900 p-2 cursor-pointer hover:bg-blue-950 hover:text-white font-medium'> &gt; Authorize</a>
    // </div>
  );
};

export default GA4ConnectorPage;