// src/app/feature/connectors/linkedInConnector/page.tsx
"use client";
import { useUser } from '@/app/context/UserContext';
import useConnector from '@/components/hooks/connectors/useConnectors';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserSession from '@/components/hooks/useUserSession';
import FullScreenLoader from '@/components/FullScreenLoader';

const LinkedInConnectorPage = () => {
  const { getConnectorData, error, loading } = useConnector();
  const [isAuthrozie, setIsAuthorize] = useState(null);
  const { user, setUser } = useUserSession();
  const router = useRouter();
  const [authUrl, setAuthUrl] = useState<string>('');

  useEffect(() => {
    async function fetchAuthUrl() {
      try {
        const response = await fetch('/api/linkedIn-auth-url');
        const data = await response.json();
        setAuthUrl(data.authUrl);
      } catch (error) {
        console.error('Error fetching auth URL:', error);
      }
    }

    fetchAuthUrl();
  }, []);

  useEffect(() => {
    async function toTestAuth() {
      const data = await getConnectorData('linkedIn', user?.email);
      setIsAuthorize(data);
    }
    if (user?.email) {
      toTestAuth();
    }
  }, [user])

  useEffect(() => {
    if (isAuthrozie && isAuthrozie.refreshToken) {
      // Redirect the user with the refresh_token in the URL
      const redirectUrl = `/feature/connectors/linkedInConnector/sucess?access_token=${encodeURIComponent(isAuthrozie.accessToken)}`;
      router.push(redirectUrl); // Next.js navigation
    }
  }, [isAuthrozie, router]);

  if (loading) {
    return (
      <FullScreenLoader message="Checking authorization..." />
    )
    //  <h1>Its loading </h1>
  }
  else if (isAuthrozie) {
    return (
      <FullScreenLoader message="Checking authorization..." />
    )
    // <h1>Altredy authenticated</h1>
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#F6F8FE] to-[#E8EAF6]">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center mx-auto">
        <h1 className="pb-5 text-3xl font-semibold text-gray-800">Authorize LinkedIn Analytics</h1>
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

export default LinkedInConnectorPage;