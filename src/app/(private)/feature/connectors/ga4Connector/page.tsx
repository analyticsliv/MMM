// src/app/feature/connectors/ga4Connector/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal'; // Adjust path as needed

const GA4ConnectorPage = () => {
  const [authUrl, setAuthUrl] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAuthUrl() {
      try {
        const response = await fetch('/api/ga4-auth-url');
        const data = await response.json();
        console.log('auth urllll',data.authUrl)
        setAuthUrl(data.authUrl);
      } catch (error) {
        console.error('Error fetching auth URL:', error);
      }
    }

    fetchAuthUrl();
  }, []);

  const handleAuth = () => {
    if (authUrl) {
      const popup = window.open(authUrl, 'authPopup', 'width=600,height=600');
      if (popup) {
        popup.focus();
      }
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <h1>Authorize Google Analytics Access</h1>
      <button onClick={handleAuth}>Authorize</button>
      {/* <Modal isOpen={isModalOpen} onClose={closeModal} authUrl={authUrl} /> */}
    </div>
  );
};

export default GA4ConnectorPage;
