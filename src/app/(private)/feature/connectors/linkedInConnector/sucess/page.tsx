"use client";
import React, { useEffect, useState } from "react";
import SuccessModal from "./sucess";
import { createJobId } from '@/utils/helper';
import { useUser } from "@/app/context/UserContext";
import useUserSession from "@/components/hooks/useUserSession";
import { updateOrCreateConnector } from "@/lib/userService";
import { useSearchParams } from "next/navigation";
import useConnector from "@/components/hooks/connectors/useConnectors";

const Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobData, setJobData] = useState<object | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [statusCheck, setStatusCheck] = useState<string>('');
  const { user, setUser } = useUserSession();
  // const user = JSON.parse(localStorage.getItem('userSession') || '{}')?.user;

  const [jobId, setJobId] = useState(String)

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const refreshTokenParam = searchParams.get("refresh_token");
  const accessTokenParam = searchParams.get("access_token");
  const { updateOrCreateConnector, getConnectorData, error, loading } = useConnector();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  useEffect(() => {
    async function getJobDetail(jobId: string) {
      try {
        setLoadingScreen(true);
        const response = await fetch('/api/connectors/jobCheck', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jobId }), // Sending jobId in the body
        });

        if (!response.ok) {
          setLoadingScreen(false);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setLoadingScreen(false);
        setJobData(data); // Store jobId in state
        console.log("API response:", data);

      } catch (error) {
        setLoadingScreen(false);
        console.error('Error fetching job details:', error);
      }
    }

    if (user && !jobId) {
      setJobId(createJobId('linkedIn', user?.email))
    }
    else if (jobId) {
      getJobDetail(jobId);
    }
  }, [jobId, user]);


  useEffect(() => {
    // this function is responsible to genrate acesstoken if user comes first time...
    async function getTokenFromCode(code: string) {
      try {
        const response = await fetch(`/api/auth/linkedIn-auth?code=${code}`);
        const data = await response.json();

        setAccessToken(data?.access_token || null);
        setRefreshToken(data?.refresh_token);
        // const user = JSON.parse(localStorage.getItem('userSession'))?.user;
        const connectorData = {
          accessToken: data?.access_token,
          expriyTime: data?.expiry_date,
          refreshToken: data?.refresh_token,
        }

        updateOrCreateConnector(user?.email, 'linkedIn', connectorData);
      } catch (error) {
        console.error("Error getting tokens:", error);
      }
    }

    // this functuon is responsible to genrate acesstoken using refresh token recvived from db
    async function getTokenFromRefreshToken(refreshToken: string) {
      try {
        const response = await fetch(`/api/auth/linkedIn-refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        const data = await response.json();
        setAccessToken(data?.access_token || null);
      } catch (error) {
        console.error("Error getting access token using refresh token:", error);
      }
    }
    if (accessTokenParam) {
      setAccessToken(accessTokenParam);
    }
    else if (code && !accessToken && user) {
      getTokenFromCode(code);
    }
    else if (refreshTokenParam && !accessToken && user) {
      getTokenFromRefreshToken(refreshTokenParam);
      setRefreshToken(refreshTokenParam);
    }
  }, [code, refreshTokenParam, user]);


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
        <div>{statusMessage}</div>
      ) : statusCheck === "inProgress" ? (
        <div>in progress</div>
      ) : jobData?.message === "Job not found" ? (
        <button onClick={openModal} className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
          Open LinkedIn Modal
        </button>
      )
        : (
          <div>
            Connector is already connected!
          </div>
        )}

      {isModalOpen && (
        <SuccessModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          onSubmitSuccess={(message: string) => {
            setStatusMessage(message);
            setStatusCheck(message);
            setIsModalOpen(false);
            setLoadingScreen(true);

          }}
          accessToken={accessToken}
          refreshToken={refreshToken}
          setLoadingScreen={setLoadingScreen}
        />
      )}
    </div>
  );
};

export default Page;