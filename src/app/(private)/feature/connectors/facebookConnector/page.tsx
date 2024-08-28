// src/components/FacebookAuthButton.tsx
"use client";
import React, { useEffect, useState } from 'react';

const FacebookAuthButton = () => {
  const [authUrl, setAuthUrl] = useState('');

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


  return (
    // <button style={styles.authButton}>
    <a href={authUrl} style={styles.authButton}>Authorize with Facebook</a>
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
