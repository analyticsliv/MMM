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

const MMMPlatformPage = ({ platform }) => {
  const { user } = useUserSession();
  const [accessToken, setAccessToken] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [jobStatusMsg, setJobStatusMsg] = useState("");
  const [showRetryConnector, setShowRetryConnector] = useState(false);
  const [mmmFileContent, setMmmFileContent] = useState("");
  const [showMmmIframe, setShowMmmIframe] = useState(false);
  const [mmmStatus, setMmmStatus] = useState("");

  const {
    googleAdsConnector,
    dv360Connector,
  } = usePlatformConnectors();

  const store = useMMMStore();
  const isGoogle = platform === "googleAds";

  const {
    selectedGoogleCustomer,
    setSelectedGoogleCustomer,
    selectedGoogleAdvertiser,
    setSelectedGoogleAdvertiser,
    selectedDv360Advertiser,
    setSelectedDv360Advertiser,
    googleAdsRefreshToken,
    dv360RefreshToken,
    isSubmittingGoogle,
    isSubmittingDv360,
    setIsSubmittingGoogle,
    setIsSubmittingDv360,
    setCampaigns,
    setUniqueId,
    mmmJobId,
    setMmmJobId
  } = store;

  const selectedId = isGoogle ? selectedGoogleAdvertiser : selectedDv360Advertiser;
  const setSelectedId = isGoogle ? setSelectedGoogleAdvertiser : setSelectedDv360Advertiser;
  const selectedCustomerId = isGoogle ? selectedGoogleCustomer : selectedDv360Advertiser;
  const setSelectedCustomerId = isGoogle ? setSelectedGoogleCustomer : setSelectedDv360Advertiser;
  const isSubmitting = isGoogle ? isSubmittingGoogle : isSubmittingDv360;
  const setIsSubmitting = isGoogle ? setIsSubmittingGoogle : setIsSubmittingDv360;
  const refreshToken = isGoogle ? googleAdsRefreshToken : dv360RefreshToken;

  useEffect(() => {
    if (refreshToken && user && !accessToken) {
      const fetchToken = isGoogle ? getGaAccessTokenFromRefreshToken : getDv360AccessTokenFromRefreshToken;
      fetchToken(refreshToken).then((res) => {
        if (res) setAccessToken(res);
      });
    }
  }, [refreshToken, user, accessToken, isGoogle]);

  const { customerSummaries, loading: dropdownLoading } = useCustomerSummaries(accessToken);
  const { advertisers, loading: advertiserLoading } = useDv360Advertisers(accessToken);
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
    const startDate = new Date(today.setDate(today.getDate() - 730));
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

    await pollJobStatus(unique_ada_id, data);
  };

  const handleRetryConnector = async () => {
    setIsSubmitting(true);
    setShowRetryConnector(false);
    const jobType = isGoogle ? "googleAds" : "dv360";
    const unique_ada_id = generateUniqueId("mmm_campaign_type", user?.email, selectedCustomerId, jobType);
    setUniqueId(unique_ada_id);

    const today = new Date();
    const endDate = new Date(today.setDate(today.getDate() - 2));
    const startDate = new Date(today.setDate(today.getDate() - 730));
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

    const connectorFunc = isGoogle ? googleAdsConnector : dv360Connector;
    const connectorRes = await connectorFunc(data);

    if (connectorRes) {
      const createMmmJobId = generateUniqueId("mmm_campaign_report", user?.email, selectedCustomerId, isGoogle ? "googleAds" : "dv360");
      // const response = await GetCampaignData({ unique_ada_id, connector_type: isGoogle ? "google_ads" : "dv360" });
      const response = await GetCampaignData({ unique_ada_id: unique_ada_id, connector_type: isGoogle ? "googleAds" : "dv360", jobId: createMmmJobId });
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

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 flex justify-center items-start">
      <div className="w-full">
        {currentStep === 1 && (
          <div className="shadow-lg rounded-xl p-8 space-y-6 bg-white max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800">
              Select a {isGoogle ? "Google Ads Customer" : "DV360 Advertiser"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Google Ads Flow (2 dropdowns if manager) */}
              {isGoogle ? (
                <>
                  {/* First Dropdown: Manager/Customer or Individual */}
                  <select
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      setSelectedId(selectedVal);
                      const selectedCustomer = customerSummaries?.find(opt => opt.id === selectedVal);

                      if (!selectedCustomer?.isManager || !selectedCustomer?.clients?.length) {
                        setSelectedCustomerId(selectedVal);
                      } else {
                        setSelectedCustomerId(""); // Wait for second dropdown
                      }

                      setMmmFileContent("");
                      setShowMmmIframe(false);
                      setMmmStatus("");
                    }}
                    value={selectedId || ""}
                    className={`w-full border px-4 py-3 text-lg rounded-lg ${isSubmitting || isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
                    disabled={isLoading || isSubmitting}
                    required
                  >
                    <option value="" disabled>
                      {isLoading ? 'Loading...' : 'Select an advertiser'}
                    </option>
                    {customerSummaries?.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
                      </option>
                    ))}
                  </select>

                  {/* Second Dropdown: Clients under selected manager */}
                  {(() => {
                    const selectedCustomer = customerSummaries?.find(opt => opt.id === selectedId);
                    if (!selectedCustomer?.isManager || !selectedCustomer?.clients?.length) return null;

                    return (
                      <select
                        onChange={(e) => {
                          setSelectedCustomerId(e.target.value);
                          setMmmFileContent("");
                          setShowMmmIframe(false);
                          setMmmStatus("");
                        }}
                        value={selectedCustomerId || ""}
                        className="w-full border px-4 py-3 text-lg rounded-lg mt-2"
                        required
                      >
                        <option value="" disabled>Select a customer</option>
                        <option value={selectedCustomer.id}>{selectedCustomer.name}</option>
                        {selectedCustomer?.clients?.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    );
                  })()}
                </>
              ) : (
                // DV360: One flat dropdown
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
                  className="w-full border px-4 py-3 text-lg rounded-lg"
                  required
                >
                  <option value="" disabled>
                    {isLoading ? 'Loading...' : 'Select a DV360 Advertiser'}
                  </option>
                  {advertisers?.map((adv) => (
                    <option key={adv?.advertiserId} value={adv?.advertiserId}>
                      {adv?.displayName}
                    </option>
                  ))}
                </select>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 text-lg rounded-lg font-semibold text-white ${isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {isSubmitting ? "Submitting..." : "Submit & Next"}
              </button>
            </form>
            {jobStatusMsg && <p className="text-sm text-yellow-600 mt-4 text-center">{jobStatusMsg}</p>}
            {showRetryConnector && (
              <div className="text-center mt-4">
                <button onClick={handleRetryConnector} className="bg-green-600 text-white px-4 py-2 rounded-lg">
                  Connect
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <GoogleAdsTable
            handleBack={() => setCurrentStep(1)}
            onTableSubmit={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <MMMOptionsSection handleBack={() => setCurrentStep(2)} />
        )}

        {showMmmIframe && mmmFileContent && (
          <iframe
            srcDoc={mmmFileContent}
            className="w-full h-[450px] my-8 border rounded-lg shadow"
            title="MMM Report"
            sandbox="allow-scripts allow-same-origin"
          />
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