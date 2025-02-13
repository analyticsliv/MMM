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

  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [prevJobs, setPrevJobs] = useState<Connector[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchConnectors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/connectors/prevConnectors?email=${user?.email}`);
        console.log("responseee---",response);
        // const data = await response.
        setPrevJobs(response?.data);
      } catch (error) {
        console.error('Error fetching prevJobs:', error);
        alert('Error fetching prevJobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if(user && !prevJobs?.length){
      fetchConnectors();
    }
  }, [user]);

  console.log("Prevjobsss-->>",prevJobs)

  return (
    <div>
      <h2>Connected Accounts for {user?.email}</h2>
      {loading ? (
        <p>Loading Previous Jobs...</p>
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
            {prevJobs?.length === 0 ? (
              <tr>
                <td colSpan={3}>No prevJobs found for this user.</td>
              </tr>
            ) : (
              prevJobs?.map((connector, index) => (
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