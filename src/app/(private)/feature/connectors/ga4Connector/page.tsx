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
    <div>
      <h1 className='pb-5 text-base'>Authorize Google Analytics Access</h1>
      <a href={authUrl} className='border border-indigo-900 p-2 cursor-pointer hover:bg-blue-950 hover:text-white font-medium'> &gt; Authorize</a>
    </div>
  );
};

export default GA4ConnectorPage;