// src/components/FacebookAuthButton.tsx

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

  const handleAuth = () => {
    if (authUrl) {
      const popup = window.open(authUrl, 'authPopup', 'width=600,height=600');
      if (popup) {
        popup.focus();
      }
    }
  };

  return (
    <button onClick={handleAuth} style={styles.authButton}>
      Authorize with Facebook
    </button>
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
