"use client"

import React, { useEffect, useState } from 'react';
import SuccessModal from "./sucess";
import { createJobId } from '@/utils/helper';
import { useUser } from '@/app/context/UserContext';
import { useSearchParams } from 'next/navigation';
import { updateOrCreateConnector } from '@/lib/userService';
import useUserSession from '@/components/hooks/useUserSession';

const Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobData, setJobData] = useState<object | null>({});
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [loadingScreen, setLoadingScreen] = useState(false);
  const { user, setUser } = useUserSession();
  const [jobId, setJobId] = useState(String)

  const searchParams = useSearchParams();
  const accessToken = searchParams.get('accessToken');


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    async function getJobDetail(jobId: string) {
      try {
        const response = await fetch('/api/connectors/jobCheck', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jobId }), // Sending jobId in the body
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setJobData(data); // Store jobId in state
        console.log("API response:", data);

      } catch (error) {
        console.error('Error fetching auth URL:', error);
      }
    }

    if (user && !jobId) {
      setJobId(createJobId('facebook', user?.email));
    }
    else if(jobId) {
      getJobDetail(jobId);
    }
  }, [user, jobId]);
 

  useEffect(() => {
    if (accessToken) {
        const connectorData = {
            accessToken: accessToken,
            expire: Date.now() + 60 * 24 * 60 * 60 * 1000
        };

        updateOrCreateConnector(user?.email, 'facebook', connectorData);
    }
}, [accessToken, session, status])


  return (
    <div className="flex items-center justify-center min-h-screen">
      {loadingScreen ? (
        <div className="flex flex-col justify-center items-center space-y-4">
          <div className="flex items-center">
            <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
          <span className="text-lg font-semibold text-gray-700">Loading...</span>
        </div>
      ) : statusMessage ? (
        <div>{statusMessage}</div> // Display success or error message here
      ) : jobData?.message == "Job not found" ? (
        <button onClick={openModal} className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
          Open Facebook Modal
        </button>
      ) : (
        <div>Connector is already connected!</div>
      )}
      {isModalOpen && (
        <SuccessModal isModalOpen={isModalOpen} closeModal={closeModal} onSubmitSuccess={(message: string) => {
          setStatusMessage(message);
          setIsModalOpen(false);
          setLoadingScreen(true);
        }}
        accessToken={accessToken}
          setLoadingScreen={setLoadingScreen}// Pass the callback function
        />
      )}
    </div>
  );
};

export default Page;
