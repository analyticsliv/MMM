"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useAccountSummaries from '@/components/hooks/connectors/ga4AccountList';
import useAccountProperties from '@/components/hooks/connectors/ga4PropertyList';

interface Account {
  name: string;
  displayName: string;
}

interface Property {
  name: string;
  displayName: string;
}

const SuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { accountSummaries, loading: accountsLoading, error: accountsError } = useAccountSummaries(accessToken);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const { properties, loading: propertiesLoading, error: propertiesError } = useAccountProperties(selectedAccount,accountSummaries,accessToken);

  useEffect(() => {
    async function getTokenFromCode(code: string) {
      try {
        const response = await fetch(`/api/auth/ga4-auth?code=${code}`);
        const data = await response.json();
        if (!accessToken) {
          setAccessToken(data?.access_token || null);
        }
      } catch (error) {
        console.error('Error getting tokens:', error);
      }
    }

    if (code && !accessToken) {
      getTokenFromCode(code);
    }
  }, [code, accessToken]);

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(event.target.value);
  };

  return (
    <div>
      <h1 className='pb-2'>Account Summaries</h1>
      {accountsLoading && <p>Loading accounts...</p>}
      {accountsError && <p>Error: {accountsError}</p>}

      {!accountsLoading && !accountsError && (
        <select onChange={handleAccountChange} value={selectedAccount || ''} className='p-2 border border-black rounded-sm'>
          <option value="" disabled>Select an account</option>
          {accountSummaries.map((account: Account, index) => (
            <option key={index} value={account.name}>
              {account.displayName}
            </option>
          ))}
        </select>
      )}

      {selectedAccount && (
        <div className='pt-3'>
          <h2>Properties for {selectedAccount}</h2>
          {propertiesLoading && <p>Loading properties...</p>}
          {propertiesError && <p>Error: {propertiesError}</p>}

          {!propertiesLoading && !propertiesError && (
            <ul>
              {properties?.map((property: Property, index) => (
                <li key={index}>
                  <strong>{property.displayName}</strong> - {property.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SuccessPage;
