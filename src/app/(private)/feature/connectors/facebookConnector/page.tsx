// /feature/[subpage]/page.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
// import { generateAuthUrl } from '@/lib/ga4Auth';

const Subpage2 = () => {
    //  const authUrl = generateAuthUrl();
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
        <>
            <div>
            <div>
      {/* <h1>Authorize Google Analytics Access</h1>
      <button onClick={handleAuth}>Authorize</button> */}
      <h1 className='pb-5 text-base'>Authorize Google Analytics Access using Facebook</h1>
      <a href={authUrl} className='border border-indigo-900 p-2 cursor-pointer hover:bg-blue-950 hover:text-white font-medium'> &gt; Authorize</a>
    </div>
            </div>
        </>
    );
};

export default Subpage2;