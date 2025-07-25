"use client";
import React, { useEffect, useState } from "react";
import useCustomerSummaries from "@/components/hooks/connectors/googleAdsCustomerList";
import useUserSession from "@/components/hooks/useUserSession";
import GoogleAdsTable from "@/components/Mmm/googleAdsTable";
import MMMOptionsSection from "@/components/Mmm/MMMOptionsSection";
import { useMMMStore } from "@/store/useMMMStore";
import { checkJobStatus } from "@/utils/checkJobStatus";
import {
  getGaAccessTokenFromRefreshToken,
  getDv360AccessTokenFromRefreshToken,
} from "@/utils/getAccessToken";
import { GetCampaignData } from "@/utils/getCampaignData";
import { generateUniqueId } from "@/utils/helper";
import { usePlatformConnectors } from "../hooks/connectors/usePlatformConnectors";
import useDv360Advertisers from "@/components/hooks/connectors/dv360Advertiser";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MMMPlatformPage = ({ platformName }) => {
  const { user } = useUserSession();
  const [accessToken, setAccessToken] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [jobStatusMsg, setJobStatusMsg] = useState("");
  const [showRetryConnector, setShowRetryConnector] = useState(false);
  const [mmmFileContent, setMmmFileContent] = useState("");
  const [showMmmIframe, setShowMmmIframe] = useState(false);
  const [metaLoading, setMetaLoading] = useState(false);
  const [mmmStatus, setMmmStatus] = useState("");

  const {
    googleAdsConnector,
    dv360Connector,
  } = usePlatformConnectors();

  const store = useMMMStore();
  const isGoogle = platformName === "googleAds";
  const isDv360 = platformName === "dv360Ads";
  const isMeta = platformName === "meta";

  const {
    selectedGoogleCustomer,
    setSelectedGoogleCustomer,
    selectedGoogleAdvertiser,
    setSelectedGoogleAdvertiser,
    selectedDv360Advertiser,
    setSelectedDv360Advertiser,
    selectedMetaAccount,
    setSelectedMetaAccount,
    googleAdsRefreshToken,
    dv360RefreshToken,
    metaAccessToken,
    isSubmittingGoogle,
    isSubmittingDv360,
    setIsSubmittingGoogle,
    setIsSubmittingDv360,
    setCampaigns,
    setUniqueId,
    mmmJobId,
    setMmmJobId,
    platform
  } = store;

  const metaAccounts = useMMMStore((state) => state.metaAccounts);
  const setMetaAccounts = useMMMStore((state) => state.setMetaAccounts);


  const selectedId = isGoogle ? selectedGoogleAdvertiser : isDv360 ? selectedDv360Advertiser : isMeta ? selectedMetaAccount : '';
  const setSelectedId = isGoogle ? setSelectedGoogleAdvertiser : isDv360 ? setSelectedDv360Advertiser : isMeta ? setSelectedMetaAccount : '';
  const selectedCustomerId = isGoogle ? selectedGoogleCustomer : selectedDv360Advertiser;
  const setSelectedCustomerId = isGoogle ? setSelectedGoogleCustomer : setSelectedDv360Advertiser;
  const isSubmitting = isGoogle ? isSubmittingGoogle : isSubmittingDv360;
  const setIsSubmitting = isGoogle ? setIsSubmittingGoogle : setIsSubmittingDv360;
  const refreshToken = isGoogle ? googleAdsRefreshToken : dv360RefreshToken;

  const router = useRouter();

  useEffect(() => {
    if (refreshToken && user && !accessToken) {
      const fetchToken = isGoogle ? getGaAccessTokenFromRefreshToken : getDv360AccessTokenFromRefreshToken;
      fetchToken(refreshToken).then((res) => {
        if (res) setAccessToken(res);
      });
    }
  }, [refreshToken, user, accessToken, isGoogle]);

  useEffect(() => {
    if (!platform) {
      router.push('/feature/mmm')
    }
  })

  const { customerSummaries, loading: dropdownLoading } = useCustomerSummaries(accessToken);
  const { advertisers, loading: advertiserLoading } = useDv360Advertisers(accessToken);

  useEffect(() => {
    if (platform === 'meta' && metaAccessToken) {
      fetchUserAccounts(metaAccessToken);
    }
  }, [metaAccessToken]);

  const fetchUserAccounts = async (accessToken: string) => {
    setMetaLoading(true);
    try {
      const response = await fetch(`https://graph.facebook.com/v11.0/me/adaccounts?fields=id,name&access_token=${accessToken}`);
      const data = await response.json();
      console.log("doing work",data)
      if (data?.data) {
        setMetaAccounts(data.data); // Zustand async state
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setMetaLoading(false);
    }
  };
useEffect(() => {
  console.log("✅ Zustand metaAccounts updated:", metaAccounts);
}, [metaAccounts]);

  const options = isGoogle ? customerSummaries : advertisers;
  const isLoading = isGoogle ? dropdownLoading : advertiserLoading;

  const handleMmmJob = async (mmmJobId, unique_ada_id) => {
    const res = await checkJobStatus(mmmJobId);
    const status = res?.job?.status;
    setMmmJobId(mmmJobId);

    if (status === "success") {
      setMmmStatus("success");
      setMmmFileContent(res?.job?.fileContent);
      const wantsToSee = window.confirm("MMM report already exists. Do you want to view it?");
      if (wantsToSee) {
        setJobStatusMsg("");
        setShowMmmIframe(true);
      }
      setIsSubmitting(false);
    } else if (status === "inProgress") {
      setMmmStatus("inProgress");
      setJobStatusMsg("⏳ Your Report is being generated. Please wait...");
      setTimeout(() => handleMmmJob(mmmJobId, unique_ada_id), 60000);
    } else {
      const response = await GetCampaignData({ unique_ada_id: unique_ada_id, connector_type: isGoogle ? "googleAds" : "dv360", jobId: mmmJobId });
      // const response = await GetCampaignData({ unique_ada_id: '123rtyihgfg', connector_type: isGoogle ? "googleAds" : "dv360", jobId: 'wertyuiuyt' });
      if (response) {
        setCampaigns(response);
        setSubmitted(true);
        setCurrentStep(2);
        setJobStatusMsg("");
        setShowRetryConnector(false);
      }
      setIsSubmitting(false);
    }
  };

  const pollJobStatus = async (unique_ada_id, data) => {
    const job = await checkJobStatus(unique_ada_id);
    if (job?.message === "Job not found") {
      setJobStatusMsg("🔌 You are not yet connected. Please connect to proceed.");
      setShowRetryConnector(true);
      setIsSubmitting(false);
      return;
    }
    const status = job?.job?.status;
    if (status === "success") {
      const createMmmJobId = generateUniqueId("mmm_campaign_report", user?.email, selectedCustomerId, isGoogle ? "googleAds" : "dv360");
      setMmmJobId(createMmmJobId);
      handleMmmJob(createMmmJobId, unique_ada_id);
    } else if (status === "failed") {
      setJobStatusMsg("⚠️ Previous connection failed. Would you like to reconnect?");
      setShowRetryConnector(true);
      setIsSubmitting(false);
    } else if (status === "inProgress") {
      setJobStatusMsg("⏳ Connector is working. Will retry shortly...");
      setTimeout(() => pollJobStatus(unique_ada_id, data), 45000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId) return;

    setIsSubmitting(true);
    setJobStatusMsg("");
    setShowRetryConnector(false);

    const jobType = isGoogle ? "googleAds" : "dv360";
    const unique_ada_id = generateUniqueId("mmm_campaign_type", user?.email, selectedCustomerId, jobType);
    setUniqueId(unique_ada_id);
    const today = new Date();
    const endDate = new Date(today.setDate(today.getDate() - 2));
    const startDate = new Date(today.setDate(today.getDate() - 715));
    const formatDate = (d) => d.toISOString().split("T")[0];

    const data = {
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      refresh_token: refreshToken || "N/A",
      report_name: isGoogle ? "campaign_mmm_report_for_ads" : "MMM_Data",
      customer_id: selectedCustomerId,
      login_customer_id: selectedId,
      jobId: unique_ada_id,
      email: user?.email,
      unique_ada_id,
    };
    // const data = {
    //   "unique_ada_id": "123rtyihgfg",
    //   "start_date": "2025-01-06",
    //   "end_date": "2025-01-09",
    //   "advertiser_id": "6629990832",
    //   "report_type": "MMM_Data",
    //   "jobId": "123",
    //   "email": "data.analytics@analyticsliv.com"
    // }
    await pollJobStatus(unique_ada_id, data);
  };

  const handleRetryConnector = async () => {
    setIsSubmitting(true);
    setShowRetryConnector(false);
    setJobStatusMsg(false);
    const jobType = isGoogle ? "googleAds" : "dv360";
    const unique_ada_id = generateUniqueId("mmm_campaign_type", user?.email, selectedCustomerId, jobType);
    setUniqueId(unique_ada_id);

    const today = new Date();
    const endDate = new Date(today.setDate(today.getDate() - 2));
    const startDate = new Date(today.setDate(today.getDate() - 715));
    const formatDate = (d) => d.toISOString().split("T")[0];

    const data = {
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      refresh_token: refreshToken || "N/A",
      report_name: isGoogle ? "campaign_mmm_report_for_ads" : "MMM_Data",
      report_type: "MMM_Data",
      customer_id: selectedCustomerId,
      advertiser_id: selectedId,
      login_customer_id: selectedId,
      jobId: unique_ada_id,
      email: user?.email,
      unique_ada_id,
    };

    // const data = {
    //   "unique_ada_id": "123rtyihgfg",
    //   "start_date": "2025-01-06",
    //   "end_date": "2025-01-09",
    //   "advertiser_id": "6629990832",
    //   "report_type": "MMM_Data",
    //   "jobId": "123",
    //   "email": "data.analytics@analyticsliv.com"
    // }

    const connectorFunc = isGoogle ? googleAdsConnector : dv360Connector;
    const connectorRes = await connectorFunc(data);

    if (connectorRes) {
      const createMmmJobId = generateUniqueId("mmm_campaign_report", user?.email, selectedCustomerId, isGoogle ? "googleAds" : "dv360");
      const response = await GetCampaignData({ unique_ada_id: unique_ada_id, connector_type: isGoogle ? "googleAds" : "dv360", jobId: createMmmJobId });
      // const response = await GetCampaignData({ unique_ada_id: '123rtyihgfg', connector_type: isGoogle ? "googleAds" : "dv360", jobId: '123' });
      if (response) {
        setMmmJobId(createMmmJobId);
        setCampaigns(response);
        setSubmitted(true);
        setCurrentStep(2);
        setJobStatusMsg("");
        setShowRetryConnector(false);
      }
    }
    setIsSubmitting(false);
  };

  const StepIndicator = ({ currentStep }) => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${step === currentStep
              ? 'bg-blue-500 text-white shadow-lg'
              : step < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
              }`}>
              {step < currentStep ? '✓' : step}
            </div>
            {step < 3 && (
              <div className={`w-12 h-0.5 mx-2 transition-all duration-300 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const PlatformIcon = ({ platformName }) => {
    if (platformName === "googleAds") {
      return (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-white font-bold text-xl shadow-lg">
          <Image
            src="/assets/Google Ads logo.png"
            alt="Google Ads"
            width={20}
            height={20}
            className="object-contain"
          />
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center text-white font-bold text-xl shadow-lg">
        <Image
          src="/assets/dv360_logo (2).png"
          alt="DV360"
          width={20}
          height={20}
          className="object-contain"
        />
      </div>
    );
  };

  const StatusMessage = ({ message, type = "info" }) => {
    const baseClasses = "px-4 py-3 rounded-lg text-sm font-medium transition-all duration-1000";
    const typeClasses = {
      info: "bg-blue-50 text-blue-700 border border-blue-200",
      warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
      error: "bg-red-50 text-red-700 border border-red-200",
      success: "bg-green-50 text-green-700 border border-green-200"
    };

    return (
      <div className={`${baseClasses} ${typeClasses[type]} animate-pulse`}>
        {message}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6 px-4">
      <div className="max-w-[80%] mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <PlatformIcon platformName={platformName} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isGoogle ? "Google Ads" : "DV360"} MMM Integration
          </h1>
          <p className="text-gray-600">
            Connect your {isGoogle ? "Google Ads" : "DV360"} account to generate Marketing Mix Modeling reports
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step 1: Platform Selection */}
        {currentStep === 1 && (
          <div className="overflow-y-auto bg-white rounded-2xl shadow-xl p-8 max-w-6xl mx-auto border border-gray-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Select {isGoogle ? "Google Ads Customer" : "DV360 Advertiser"}
              </h2>
              <p className="text-gray-600">
                Choose the account you want to analyze for marketing mix modeling
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Google Ads Flow */}
              {isGoogle ? (
                <div className="space-y-4">
                  {/* Primary Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Advertiser Account
                    </label>
                    <select
                      onChange={(e) => {
                        const selectedVal = e.target.value;
                        setSelectedId(selectedVal);
                        const selectedCustomer = customerSummaries?.find(opt => opt.id === selectedVal);

                        if (!selectedCustomer?.isManager || !selectedCustomer?.clients?.length) {
                          setSelectedCustomerId(selectedVal);
                        } else {
                          setSelectedCustomerId("");
                        }

                        setMmmFileContent("");
                        setShowMmmIframe(false);
                        setMmmStatus("");
                      }}
                      value={selectedId || ""}
                      className={`w-full border-2 border-gray-200 px-4 py-3 text-lg rounded-xl transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${isSubmitting || isLoading ? "cursor-not-allowed bg-gray-50" : "cursor-pointer hover:border-blue-300"
                        }`}
                      disabled={isLoading || isSubmitting}
                      required
                    >
                      <option value="" disabled>
                        {isLoading ? '🔄 Loading accounts...' : '📊 Select an advertiser'}
                      </option>
                      {customerSummaries?.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Secondary Selection for Manager Accounts */}
                  {(() => {
                    const selectedCustomer = customerSummaries?.find(opt => opt.id === selectedId);
                    if (!selectedCustomer?.isManager || !selectedCustomer?.clients?.length) return null;

                    return (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Select Customer Account
                        </label>
                        <select
                          onChange={(e) => {
                            setSelectedCustomerId(e.target.value);
                            setMmmFileContent("");
                            setShowMmmIframe(false);
                            setMmmStatus("");
                          }}
                          value={selectedCustomerId || ""}
                          disabled={isLoading || isSubmitting}
                          className={`w-full border-2 border-gray-200 px-4 py-3 text-lg rounded-xl transition-all duration-300
                          ${isSubmitting || isLoading ? "cursor-not-allowed bg-gray-50" : "cursor-pointer hover:border-blue-300  focus:ring-2 focus:ring-blue-200 focus:border-blue-500"}`}
                          required
                        >
                          <option value="" disabled>👥 Select a customer</option>
                          <option value={selectedCustomer.id}>
                            {selectedCustomer.name}
                          </option>
                          {selectedCustomer?.clients?.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })()}
                </div>
              ) : isDv360 ? (
                // DV360 Flow
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select DV360 Advertiser
                  </label>
                  <select
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      setSelectedDv360Advertiser(selectedVal);
                      setSelectedId(selectedVal);
                      setSelectedCustomerId(selectedVal);
                      setMmmFileContent("");
                      setShowMmmIframe(false);
                      setMmmStatus("");
                    }}
                    value={selectedId || ""}
                    disabled={isLoading || isSubmitting}
                    className={`w-full border-2 border-gray-200 px-4 py-3 text-lg rounded-xl transition-all duration-300
                    ${isSubmitting || isLoading ? 'cursor-not-allowed bg-gray-50' : 'focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-purple-300'}`}
                    required
                  >
                    <option value="" disabled>
                      {isLoading ? '🔄 Loading advertisers...' : '📺 Select a DV360 Advertiser'}
                    </option>
                    {advertisers?.map((adv) => (
                      <option key={adv?.advertiserId} value={adv?.advertiserId}>
                        {adv?.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              ) : isMeta ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Meta Account
                  </label>
                  <select
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      setSelectedMetaAccount(selectedVal);
                      setSelectedId(selectedVal);
                      setSelectedCustomerId(selectedVal);
                      setMmmFileContent("");
                      setShowMmmIframe(false);
                      setMmmStatus("");
                    }}
                    value={selectedId || ""}
                    disabled={metaLoading || isSubmitting}
                    className={`w-full border-2 border-gray-200 px-4 py-3 text-lg rounded-xl transition-all duration-300
                    ${isSubmitting || metaLoading ? 'cursor-not-allowed bg-gray-50' : 'focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-purple-300'}`}
                    required
                  >
                    <option value="" disabled>
                      {metaLoading ? '🔄 Loading Accounts...' : '📺 Select a Meta Account'}
                    </option>
                    {metaAccounts?.map((acc) => (
                      <option key={acc?.id} value={acc?.id}>
                        {acc?.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : <></>}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedCustomerId}
                  className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform ${isSubmitting || !selectedCustomerId
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : isGoogle
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                      : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                    }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "🚀 Connect & Continue"
                  )}
                </button>
              </div>
            </form>

            {/* Status Messages */}
            {jobStatusMsg && (
              <div className="mt-6">
                <StatusMessage
                  message={jobStatusMsg}
                  type={jobStatusMsg.includes("failed") ? "error" : jobStatusMsg.includes("⚠️") ? "warning" : "info"}
                />
              </div>
            )}

            {/* Retry Connector */}
            {showRetryConnector && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Connection issue detected. Let's try reconnecting.</p>
                  <button
                    onClick={handleRetryConnector}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Connect
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Campaign Table */}
        {currentStep === 2 && (
          <div className="min-h-screen">
            <GoogleAdsTable
              handleBack={() => setCurrentStep(1)}
              onTableSubmit={() => setCurrentStep(3)}
            />
          </div>
        )}

        {/* Step 3: MMM Options */}
        {currentStep === 3 && (
          // <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="min-h-screen">
            <MMMOptionsSection handleBack={() => setCurrentStep(2)} />
          </div>
        )}

        {/* MMM Report Iframe */}
        {showMmmIframe && mmmFileContent && (
          <div className="h-screen mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">📊 MMM Report</h3>
              <p className="text-gray-600">Your Marketing Mix Modeling report is ready</p>
            </div>
            <iframe
              srcDoc={mmmFileContent}
              className="w-full h-[90%] border border-gray-200 rounded-xl shadow-inner"
              title="MMM Report"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default MMMPlatformPage;


// dv proxy--
// {

//     "unique_ada_id": "123",
//     "start_date": "2025-01-06",
//     "end_date": "2025-01-09",
//     "advertiser_id":"6629990832",
//     "report_type":"MMM_Data",
//     "jobId":"wertyuiuyt",
//     "email":"data.analytics@analyticsliv.com"

// }
// const handleChange = (e) => {
//   setSelectedId(e.target.value);
//   // setMmmFileContent("");
//   // setShowMmmIframe(false);
//   // setMmmStatus("");
// };
// const handleCustomerChange = (e) => {
//   setSelectedCustomerId(e.target.value);
//   setMmmFileContent("");
//   setShowMmmIframe(false);
//   setMmmStatus("");
// };