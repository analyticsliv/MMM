"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const accessToken = searchParams.get('accessToken');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');

  useEffect(() => {
    if (accessToken) {
      console.log('Access Token:', accessToken);
      fetchUserAccounts(accessToken);
    }
  }, [accessToken]);

  const fetchUserAccounts = async (accessToken:string) => {
    try {
      const response = await fetch(`https://graph.facebook.com/v11.0/me/accounts?access_token=${accessToken}`);
      const data = await response.json();
      setAccounts(data.data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleAccountSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const accountId = event.target.value;
    setSelectedAccount(accountId);
    console.log("ghjkl",accountId)
  };

  return (
    <div>
      <h1>Authentication Successful</h1>
      {/* <p>Access Token: {accessToken}</p> */}

      <h2>Select an Account</h2>
      <select onChange={handleAccountSelect} value={selectedAccount}>
        <option value="">Select Account</option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>

    </div>
  );
};

export default SuccessPage;
