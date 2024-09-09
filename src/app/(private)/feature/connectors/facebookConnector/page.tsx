// src/components/FacebookAuthButton.tsx
"use client";
import { useUser } from '@/app/context/UserContext';
import useConnector from '@/components/hooks/connectors/useConnectors';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const FacebookAuthButton = () => {
  const { getConnectorData, error, loading } = useConnector();
  const [isAuthrozie, setIsAuthorize] = useState(null);
  const [authUrl, setAuthUrl] = useState('');
  const {user} = useUser();


  useEffect(() => {
    if (isAuthrozie?.accessToken) {
      const accessTokenParam = encodeURIComponent(isAuthrozie?.accessToken);
      const successUrl = `http://127.0.0.1:3000/feature/connectors/facebookConnector/sucess?accessToken=${accessTokenParam}`;
      
      // Redirect to the success page with the access token
      window.location.href = successUrl;
    }
  }, [isAuthrozie]);
  
  useEffect(() => {
    async function fetchAuthUrl() {
      try {
        const response = await fetch('/api/facebook-auth-url');
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
      const data = await getConnectorData('facebook', user?.email);
      setIsAuthorize(data)
    }
    if(user){
      toTestAuth();
    }
  }, [user])

  if (loading) {
    return <h1>Its loading </h1>
  }
  else if (isAuthrozie){
    console.log("isAuthrozieisAuthrozie",isAuthrozie)
    return <h1>Allready authenticated</h1>
  }


  return (
    // <button style={styles.authButton}>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center mx-auto">
        <h1 className="pb-4 text-2xl font-semibold text-gray-800">Connect Your Facebook Account</h1>
        <p className="pb-6 text-gray-600">Get started by authorizing your Facebook account to access insights and analytics.</p>
        <a 
          href={authUrl} 
          className="bg-primary text-white py-3 px-6 rounded-full shadow-md transition-all duration-200 ease-in-out transform hover:bg-gray-700 hover:scale-105 flex items-center justify-center gap-2"
        >
          <span className="facebook-icon"></span> Authorize with Facebook
        </a>
      </div>
    </div>
    // <a href={authUrl} style={styles.authButton}>Authorize with Facebook</a>
    // </button>
  );
};

const styles = {
  authButton: {
    padding: '10px 20px',
    border: 'none',
    backgroundColor: '#4267B2', // Facebook blue
    color: 'white',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};

export default FacebookAuthButton;
