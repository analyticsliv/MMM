'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import useUserSession from '@/components/hooks/useUserSession';
import { useSearchParams } from 'next/navigation';

interface Connector {
  connectorName: string;
  status: string;
  dateTime: string;
}

const PreviousConnectors = () => {
  const { user, setUser } = useUserSession();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);


  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const refreshTokenParam = searchParams.get("refresh_token");

  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Ensure the session is loaded and the user is logged in
    // if (status === 'loading' || !session) {
    //   return;
    // }

    const fetchConnectors = async () => {
      try {
        setLoading(true);
        const userInfo = { email: session.user.email };
        const response = await axios.post('/api/connectors/prev-connector', userInfo);
        setEmail(response.data.email);
        setConnectors(response.data.connectors);
      } catch (error) {
        console.error('Error fetching connectors:', error);
        alert('Error fetching connectors. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchConnectors();
  }, [refreshTokenParam]);


  return (
    <div>
      <h2>Connected Accounts for {email}</h2>
      {loading ? (
        <p>Loading connectors...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Connector Name</th>
              <th>Status</th>
              <th>Date-Time</th>
            </tr>
          </thead>
          <tbody>
            {connectors.length === 0 ? (
              <tr>
                <td colSpan={3}>No connectors found for this user.</td>
              </tr>
            ) : (
              connectors.map((connector, index) => (
                <tr key={index}>
                  <td>{connector.connectorName}</td>
                  <td>{connector.status}</td>
                  <td>{new Date(connector.dateTime).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PreviousConnectors;



// "use client";

// import SearchBar from "@/components/searchbar/search";
// import User from "@/components/User/user";
// import Link from "next/link";
// import React from "react";

// const PreviousConnector = () => {
//     const connectors = [
//         { label: "GA4", path: "/feature/connectors/ga4Connector" },
//         { label: "Facebook", path: "/feature/connectors/facebookConnector" },
//         { label: "DV360", path: "/feature/connectors/dv360Connector" },
//         { label: "Google Ads", path: "/feature/connectors/googleAdsConnector" },
//         { label: "LinkedIn", path: "/feature/connectors/linkedInConnector" },
//         { label: "Custom", path: "/feature/connectors/Custom" },
//     ];
//     return (
//         <>
//             <div className="text-3xl font-bold text-center py-10">Pevious Connectors</div>
//             <div className="w-full flex items-center pl-8 xl:pl-20 h-[50px] xl:h-[70px] bg-[#F6F8FE]">
//                 <SearchBar />
//             </div>
//             <User />

//         </>
//     );
// };

// export default PreviousConnector;