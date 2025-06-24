"use client";
import React, { useEffect, useState } from "react";
import SuccessModal from "./success";
import { createJobId } from '@/utils/helper';
import { useUser } from "@/app/context/UserContext";
import useUserSession from "@/components/hooks/useUserSession";
import { updateOrCreateConnector } from "@/lib/userService";
import { useSearchParams } from "next/navigation";
import useConnector from "@/components/hooks/connectors/useConnectors";
import { BarChart3 } from "lucide-react";
import IntegrationCard from "@/components/IntegrationCard";
import FullScreenLoader from "@/components/FullScreenLoader";
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
      setJobId(createJobId('ga4', user?.email))
    }
    else if (jobId) {
      getJobDetail(jobId);
    }
  }, [jobId, user]);


  useEffect(() => {
    // this function is responsible to genrate acesstoken if user comes first time...
    async function getTokenFromCode(code: string) {
      try {
        const response = await fetch(`/api/auth/ga4-auth?code=${code}`);
        const data = await response.json();
        setAccessToken(data?.access_token || null);
        setRefreshToken(data?.refresh_token);
        // const user = JSON.parse(localStorage.getItem('userSession'))?.user;
        const connectorData = {
          refreshToken: data?.refresh_token,
          expriyTime: data?.expiry_date
        }

        updateOrCreateConnector(user?.email, 'ga4', connectorData);
      } catch (error) {
        console.error("Error getting tokens:", error);
      }
    }

    // this functuon is responsible to genrate acesstoken using refresh token recvived from db
    async function getTokenFromRefreshToken(refreshToken: string) {
      try {
        const response = await fetch(`/api/auth/ga4-refresh-token`, {
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
          title="Google Analytics 4 Integration"
          description="Seamlessly connect your GA4 account and start tracking your metrics in real-time."
          onClick={openModal}
          primaryColor="bg-blue-600"
          textColor="text-white"
          bgColor="bg-[#1e293b]"
          borderColor="border border-white/20"
          glowColor="rgba(59,130,246,0.6)"
          buttonText="🚀 Connect GA4"
        />
      ) : (
        <div className="flex items-start gap-20 text-center">
          {/* <div className="flex flex-col items-center justify-center p-8 bg-[#1e293b] text-white rounded-2xl shadow-xl border border-white/20 animate-fadeIn max-w-md mx-auto">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-1">Google Analytics 4 Connected</h2>
            <p className="text-sm text-white/80 text-center">
              You’ve already connected the <span className="font-semibold text-blue-400">Google Analytics 4</span> connector.
            </p>
          </div> */}
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xl border border-green-100 animate-fadeIn">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 text-green-700 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Connector Active</h2>
            <p className="text-gray-600">You're all set! The connector is already linked and working.</p>
          </div>
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