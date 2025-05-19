"use client";
import React, { useEffect, useState } from "react";
import SuccessModal from "./sucess";
import { createJobId } from '@/utils/helper';
import { useUser } from "@/app/context/UserContext";
import useUserSession from "@/components/hooks/useUserSession";
import { useSearchParams } from "next/navigation";
import useConnector from "@/components/hooks/connectors/useConnectors";
import IntegrationCard from "@/components/IntegrationCard";
import { BarChart3 } from "lucide-react";
import FullScreenLoader from "@/components/FullScreenLoader";

const Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobData, setJobData] = useState<object | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [statusCheck, setStatusCheck] = useState<string>('');
  const { user, setUser } = useUserSession();
  const [jobId, setJobId] = useState(String)

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
      } catch (error) {
        setLoadingScreen(false);
        console.error('Error fetching job details:', error);
      }
    }

    if (user && !jobId) {
      setJobId(createJobId('dv360', user?.email))
    }
    else if (jobId) {
      getJobDetail(jobId);
    }
  }, [jobId, user]);


  useEffect(() => {
    // this function is responsible to genrate acesstoken if user comes first time...
    async function getTokenFromCode(code: string) {
      try {
        const response = await fetch(`/api/auth/dv360-auth?code=${code}`);
        const data = await response.json();
        setAccessToken(data?.access_token || null);
        setRefreshToken(data?.refresh_token);
        // const user = JSON.parse(localStorage.getItem('userSession'))?.user;
        const connectorData = {
          refreshToken: data?.refresh_token,
          expriyTime: data?.expiry_date
        }

        updateOrCreateConnector(user?.email, 'dv360', connectorData);
      } catch (error) {
        console.error("Error getting tokens:", error);
      }
    }

    // this functuon is responsible to genrate acesstoken using refresh token recvived from db
    async function getTokenFromRefreshToken(refreshToken: string) {
      try {
        const response = await fetch(`/api/auth/dv360-refresh-token`, {
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
        <FullScreenLoader message="Verifying connector job..." />
      ) : statusMessage ? (
        <div>{statusMessage}</div>
      ) : statusCheck === "inProgress" ? (
        <div>in progress</div>
      ) : jobData?.message === "Job not found" ? (
        <IntegrationCard
          icon={<BarChart3 className="w-16 h-16" />}
          title="DV360 Integration"
          description="Connect your DV360 account to manage campaigns and measure performance across the web."
          onClick={openModal}
          primaryColor="bg-[#10b981]"
          textColor="text-[#e0f2f1]"
          bgColor="bg-[#0f2c2c]"
          borderColor="border border-[#2e4a4a]"
          glowColor="rgba(16,185,129,0.6)"
          buttonText="🔗 Connect DV360"
        />
      ) : jobData?.job?.status === 'failed' ?
        <div className="flex flex-col items-center gap-2">
          <p>Connector was failed !</p>
          <p>Try again !</p>
          <IntegrationCard
            icon={<BarChart3 className="w-16 h-16" />}
            title="DV360 Integration"
            description="Connect your DV360 account to manage campaigns and measure performance across the web."
            onClick={openModal}
            primaryColor="bg-[#10b981]"
            textColor="text-[#e0f2f1]"
            bgColor="bg-[#0f2c2c]"
            borderColor="border border-[#2e4a4a]"
            glowColor="rgba(16,185,129,0.6)"
            buttonText="🔗 Connect DV360"
          />
        </div>
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
          setLoadingScreen={setLoadingScreen}
          refreshToken={refreshToken}
        />
      )}
    </div>
  );
};

export default Page;