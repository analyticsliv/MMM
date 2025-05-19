"use client";
import React, { useEffect, useState } from "react";
import SuccessModal from "./success";
import { createJobId } from '@/utils/helper';
import useUserSession from "@/components/hooks/useUserSession";
import { useSearchParams } from "next/navigation";
import useConnector from "@/components/hooks/connectors/useConnectors";
import IntegrationCard from "@/components/IntegrationCard";
import { BarChart3 } from "lucide-react";

const Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobData, setJobData] = useState<object | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [statusCheck, setStatusCheck] = useState<string>('');
  const { user, setUser } = useUserSession();

  const [jobId, setJobId] = useState(String);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const refreshTokenParam = searchParams.get("refresh_token");
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
      setJobId(createJobId('googleAds', user?.email))
    }
    else if (jobId) {
      getJobDetail(jobId);
    }
  }, [jobId, user]);


  useEffect(() => {
    // this function is responsible to genrate acesstoken if user comes first time...
    async function getTokenFromCode(code: string) {
      try {
        const response = await fetch(`/api/auth/googleAds-auth?code=${code}`);
        const data = await response.json();
        setAccessToken(data?.access_token || null);
        setRefreshToken(data?.refresh_token);
        const connectorData = {
          refreshToken: data?.refresh_token,
          expriyTime: data?.expiry_date
        }
        console.log("connector data object", connectorData)
        updateOrCreateConnector(user?.email, 'googleAds', connectorData);
      } catch (error) {
        console.error("Error getting tokens:", error);
      }
    }

    // this functuon is responsible to genrate acesstoken using refresh token recvived from db
    async function getTokenFromRefreshToken(refreshToken: string) {
      try {
        const response = await fetch(`/api/auth/googleAds-refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        const data = await response.json();
        console.log("access token ", data?.access_token)
        setAccessToken(data?.access_token || null);
      } catch (error) {
        console.error("Error getting access token using refresh token:", error);
      }
    }

    if (code && !accessToken && user) {
      getTokenFromCode(code);
    }
    else if (refreshTokenParam && !accessToken && user) {
      getTokenFromRefreshToken(refreshTokenParam);
      setRefreshToken(refreshTokenParam);
    }
  }, [code, refreshTokenParam, user]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f4f7fd] px-4 relative overflow-hidden">
      {loadingScreen ? (
        <div className="fixed z-50 h-full w-[85%] flex justify-center items-center bg-white">
          <div className="flex flex-col justify-center items-center">
            <div className="loader"></div>
            <p className="mt-4 text-xl font-semibold text-gray-700">
              Loading...
            </p>
          </div>
        </div>
      ) : statusMessage ? (
        <div>{statusMessage}</div>
      ) : statusCheck === "inProgress" ? (
        <div>in progress</div>
      ) : jobData?.message === "Job not found" ? (
        <IntegrationCard
          icon={<BarChart3 className="w-16 h-16" />}
          title="Google Ads Integration"
          description="Easily connect your Google Ads account to manage ad performance across search and display networks."
          onClick={openModal}
          primaryColor="bg-[#4285F4]" // Google Blue
          textColor="text-white"
          bgColor="bg-[#1a1a2e]"
          borderColor="border border-white/20"
          glowColor="rgba(66,133,244,0.6)"
          buttonText="💡 Connect Google Ads"
        />

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
          refreshToken={refreshToken}
          accessToken={accessToken}
          setLoadingScreen={setLoadingScreen}
        />
      )}
    </div>
  );
};

export default Page;