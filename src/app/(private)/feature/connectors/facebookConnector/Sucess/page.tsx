// src/pages/success.tsx
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const SuccessPage = () => {
  const router = useRouter();
  const { accessToken } = router.query;

  useEffect(() => {
    if (accessToken) {
      console.log('Access Token:', accessToken);
      // Store the token securely or pass it to your microservice
    }
  }, [accessToken]);

  return (
    <div>
      <h1>Authentication Successful</h1>
      <p>Access Token: {accessToken}</p>
    </div>
  );
};

export default SuccessPage;
