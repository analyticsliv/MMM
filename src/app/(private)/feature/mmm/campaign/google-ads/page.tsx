'use client';
import React, { useEffect, useState } from 'react';
import useCustomerSummaries from '@/components/hooks/connectors/googleAdsCustomerList';
import useGooglAdsConnector from '@/components/hooks/connectors/useGooglAdsConnector';
import useUserSession from '@/components/hooks/useUserSession';
import GoogleAdsTable from '@/components/Mmm/googleAdsTable';
import MMMOptionsSection from '@/components/Mmm/MMMOptionsSection';
import { useMMMStore } from '@/store/useMMMStore';
import { checkJobStatus } from '@/utils/checkJobStatus';
import { getGaAccessTokenFromRefreshToken } from '@/utils/getAccessToken';
import { GetCampaignData } from '@/utils/getCampaignData';
import { generateUniqueId } from '@/utils/helper';

const Page: React.FC = () => {
    const { user } = useUserSession();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [jobStatusMsg, setJobStatusMsg] = useState('');
    const [showRetryConnector, setShowRetryConnector] = useState(false);
    const { googleAdsConnector } = useGooglAdsConnector();
    const { isSubmittingCustomerBtn, setIsSubmittingCustomerBtn, googleAdsRefreshToken, selectedCustomer, setSelectedCustomer, setCampaigns, uniqueId, setUniqueId } = useMMMStore();

    useEffect(() => {
        if (googleAdsRefreshToken && user && !accessToken) {
            getGaAccessTokenFromRefreshToken(googleAdsRefreshToken).then((res) => {
                if (res) setAccessToken(res);
            });
        }
    }, [googleAdsRefreshToken, user, accessToken]);

    const { customerSummaries, loading: customerLoading } = useCustomerSummaries(accessToken);

    const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCustomer(e.target.value);

    const handleMmmJob = async (mmmJobId: string,client_id: string) => {
      const MmmJobCheck = await checkJobStatus(mmmJobId);

      const mmmStatus = MmmJobCheck?.job?.status;

      if (mmmStatus === "success") {
      } else if (mmmStatus === "inProgress") {
        setTimeout(() => handleMmmJob(mmmJobId, client_id), 60000);
      } else {
        const data = {
          client_id: client_id,
          connector_type: "ga",
        };
        const response = await GetCampaignData(data);
        if (response) {
          setCampaigns(response || []);
          setSubmitted(true);
          setCurrentStep(2);
          setJobStatusMsg("");
          setShowRetryConnector(false);
        }
        setIsSubmittingCustomerBtn(false);
      }
    };

    const pollJobStatus = async (client_id: string, data: any) => {
        const jobCheck = await checkJobStatus(client_id);

        if (jobCheck?.message === 'Job not found') {
            setJobStatusMsg('🔌 You are not yet connected. Please connect to proceed.');
            setShowRetryConnector(true);
            setIsSubmittingCustomerBtn(false);
            return;
        }

        const status = jobCheck?.job?.status;

        if (status === 'success') {

             const mmmJobId = generateUniqueId(
               "mmm_modal",
               `${user?.email}`,
               selectedCustomer,
               "googleAds"
             );
             handleMmmJob(mmmJobId, client_id);
 
        } else if (status === 'failed') {
            setJobStatusMsg('⚠️ Previous connection failed. Would you like to reconnect?');
            setShowRetryConnector(true);
            setIsSubmittingCustomerBtn(false);
        } else if (status === 'inProgress') {
            setJobStatusMsg('⏳ Connector is working. Will retry shortly...');
            setTimeout(() => pollJobStatus(client_id, data), 45000); // retry in 45 seconds
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCustomer) return;

        setIsSubmittingCustomerBtn(true);
        setJobStatusMsg('');
        setShowRetryConnector(false);

        const client_id = generateUniqueId('mmm_campaign_typeee', `${user?.email}`, selectedCustomer, 'googleAds');
        setUniqueId(client_id);
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() - 2);
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 740);
        const formatDate = (d: Date) => d.toISOString().split('T')[0];

        const data = {
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
            refresh_token: googleAdsRefreshToken || 'N/A',
            report_name: 'campaign_mmm_report_for_ads',
            login_customer_id: selectedCustomer,
            jobId: client_id,
            email: user?.email,
            client_id,
        };

        await pollJobStatus(client_id, data);
    };

    const handleRetryConnector = async () => {
        setIsSubmittingCustomerBtn(true);
        const client_id = generateUniqueId('mmm_campaign_typeee', `${user?.email}`, selectedCustomer, 'googleAds');
        setUniqueId(client_id);
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() - 2);
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 740);
        const formatDate = (d: Date) => d.toISOString().split('T')[0];
        const data = {
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
            refresh_token: googleAdsRefreshToken || 'N/A',
            report_name: 'campaign_mmm_report_for_ads',
            login_customer_id: selectedCustomer,
            jobId: client_id,
            email: user?.email,
            client_id,
        };

        const connectorRes = await googleAdsConnector(data);
        console.log("responseConnector--", connectorRes)

        if (connectorRes) {
            const data = {
                client_id, connector_type: 'ga'
            }
            const response = await GetCampaignData(data);
            if (response) setCampaigns(response || []);
            setSubmitted(true);
            setCurrentStep(2);

            setJobStatusMsg('');
            setShowRetryConnector(false);
        }
        setIsSubmittingCustomerBtn(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6 flex justify-center items-start">
            <div className="w-full">
                {currentStep === 1 && (
                    <div className='shadow-lg rounded-xl p-8 space-y-6 bg-white max-w-4xl mx-auto'>
                        <h2 className="text-2xl font-bold text-gray-800">Select a Google Ads Customer</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="customer" className="block text-lg font-semibold text-gray-700 mb-2">
                                    Customers
                                </label>
                                <select
                                    id="customer"
                                    onChange={handleCustomerChange}
                                    value={selectedCustomer || ''}
                                    className={`${isSubmittingCustomerBtn ? 'cursor-not-allowed' : 'cursor-pointer'} w-full border border-gray-300 rounded-lg px-4 py-3 text-lg`}
                                    disabled={customerLoading || isSubmittingCustomerBtn}
                                    required
                                >
                                    {customerLoading ? (
                                        <option>Loading...</option>
                                    ) : (
                                        <>
                                            <option value="" disabled>
                                                Select a customer
                                            </option>
                                            {customerSummaries?.map((customer, index) => (
                                                <option key={index} value={customer?.id}>
                                                    {customer?.name}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className={`w-full text-white font-semibold py-3 text-lg rounded-lg transition-all ${isSubmittingCustomerBtn ? 'cursor-not-allowed bg-gray-500' : 'cursor-pointer bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {isSubmittingCustomerBtn ? 'Submitting...' : 'Submit & Next'}
                            </button>
                        </form>

                        {jobStatusMsg && <p className="text-sm text-center text-yellow-600 mt-4 font-medium">{jobStatusMsg}</p>}

                        {showRetryConnector && (
                            <div className="mt-4 text-center">
                                <button
                                    onClick={handleRetryConnector}
                                    className={`text-white px-4 py-2 rounded-lg font-medium ${isSubmittingCustomerBtn ? 'cursor-not-allowed bg-gray-500' : 'cursor-pointer bg-green-600 hover:bg-green-700'}`}
                                >
                                    {isSubmittingCustomerBtn ? 'Connecting...' : 'Yes, Connect'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {currentStep === 2 && (
                    <GoogleAdsTable
                        handleBack={() => setCurrentStep(1)}
                        onTableSubmit={() => setCurrentStep(3)}
                    />)}

                {currentStep === 3 && (
                    <MMMOptionsSection handleBack={() => setCurrentStep(2)} />
                )}
            </div>
        </div>
    );
};

export default Page;








// 'use client';
// import React, { useEffect, useState } from 'react';
// import useCustomerSummaries from '@/components/hooks/connectors/googleAdsCustomerList';
// import useGooglAdsConnector from '@/components/hooks/connectors/useGooglAdsConnector';
// import useUserSession from '@/components/hooks/useUserSession';
// import GoogleAdsTable from '@/components/Mmm/googleAdsTable';
// import MMMOptionsSection from '@/components/Mmm/MMMOptionsSection';
// import { useMMMStore } from '@/store/useMMMStore';
// import { checkJobStatus } from '@/utils/checkJobStatus';
// import { getGaAccessTokenFromRefreshToken } from '@/utils/getAccessToken';
// import { GetCampaignData } from '@/utils/getCampaignData';
// import { generateUniqueId } from '@/utils/helper';

// const Page: React.FC = () => {
//     const { user } = useUserSession();
//     const [accessToken, setAccessToken] = useState<string | null>(null);
//     const [submitted, setSubmitted] = useState(false);
//     const [currentStep, setCurrentStep] = useState(1);
//     const [jobStatusMsg, setJobStatusMsg] = useState('');
//     const [showRetryConnector, setShowRetryConnector] = useState(false);
//     const { googleAdsConnector } = useGooglAdsConnector();
//     const { isSubmittingCustomerBtn, setIsSubmittingCustomerBtn, googleAdsRefreshToken, selectedCustomer, setSelectedCustomer, setCampaigns } = useMMMStore();

//     useEffect(() => {
//         if (googleAdsRefreshToken && user && !accessToken) {
//             getGaAccessTokenFromRefreshToken(googleAdsRefreshToken).then((res) => {
//                 if (res) setAccessToken(res);
//             });
//         }
//     }, [googleAdsRefreshToken, user, accessToken]);

//     const { customerSummaries, loading: customerLoading } = useCustomerSummaries(accessToken);

//     const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCustomer(e.target.value);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!selectedCustomer) return;
//         setIsSubmittingCustomerBtn(true);
//         setJobStatusMsg('');
//         setShowRetryConnector(false);

//         const client_id = generateUniqueId('mmm_campaign_typeee', `${user?.email}`, selectedCustomer, 'googleAds');
//         const today = new Date();
//         const endDate = new Date(today);
//         endDate.setDate(today.getDate() - 2);
//         const startDate = new Date(today);
//         startDate.setDate(today.getDate() - 740);

//         const formatDate = (d: Date) => d.toISOString().split('T')[0];
//         const data = {
//             start_date: formatDate(startDate),
//             end_date: formatDate(endDate),
//             refresh_token: googleAdsRefreshToken || 'N/A',
//             report_name: 'campaign_mmm_report_for_ads',
//             login_customer_id: selectedCustomer,
//             jobId: client_id,
//             email: user?.email,
//             client_id,
//         };

//         const jobCheck = await checkJobStatus(client_id);
//         console.log("jobCheckResponse -->", jobCheck);

//         if (jobCheck?.message === 'Job not found') {
//             setJobStatusMsg('🔌 You are not yet connected. Please connect to proceed.');
//             setShowRetryConnector(true);
//         } else {
//             const status = jobCheck?.job?.status;

//             if (status === 'success') {
//                 const response = await GetCampaignData(client_id);
//                 if (response?.campaigns) setCampaigns(response.campaigns);
//                 setSubmitted(true);
//                 setCurrentStep(2);
//             } else if (status === 'inProgress') {
//                 setJobStatusMsg('⏳ Your Connector is working. Please wait...');
//             } else if (status === 'failed') {
//                 setJobStatusMsg('⚠️ Previous connection failed. Would you like to reconnect?');
//                 setShowRetryConnector(true);
//             }
//         }

//         if (status === 'success') {
//             const response = await GetCampaignData(client_id);
//             if (response?.campaigns) setCampaigns(response.campaigns);
//             setSubmitted(true);
//             setCurrentStep(2);
//         } else if (status === 'inProgress') {
//             setJobStatusMsg('⏳ Your Connector is working. Please wait...');
//         } else if (status === 'failed') {
//             setJobStatusMsg('⚠️ Previous connection failed. Would you like to reconnect?');
//             setShowRetryConnector(true);
//         } else {
//             const connectorRes = await googleAdsConnector(data);
//             if (connectorRes) {
//                 const response = await GetCampaignData(client_id);
//                 if (response?.campaigns) setCampaigns(response.campaigns);
//                 setSubmitted(true);
//                 setCurrentStep(2);
//             }
//         }

//         setIsSubmittingCustomerBtn(false);
//     };

//     const handleRetryConnector = async () => {
//         setIsSubmittingCustomerBtn(true);
//         const client_id = generateUniqueId('mmm_campaign_typeee', `${user?.email}`, selectedCustomer, 'googleAds');
//         const today = new Date();
//         const endDate = new Date(today);
//         endDate.setDate(today.getDate() - 2);
//         const startDate = new Date(today);
//         startDate.setDate(today.getDate() - 740);
//         const formatDate = (d: Date) => d.toISOString().split('T')[0];
//         const data = {
//             start_date: formatDate(startDate),
//             end_date: formatDate(endDate),
//             refresh_token: googleAdsRefreshToken || 'N/A',
//             report_name: 'campaign_mmm_report_for_ads',
//             login_customer_id: selectedCustomer,
//             jobId: client_id,
//             email: user?.email,
//             client_id,
//         };

//         const connectorRes = await googleAdsConnector(data);
//         console.log("responseConnector--", connectorRes)

//         if (connectorRes) {
//             const response = await GetCampaignData(client_id);
//             if (response?.campaigns) setCampaigns(response.campaigns);
//             setSubmitted(true);
//             setCurrentStep(2);
//         }

//         setIsSubmittingCustomerBtn(false);
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 py-10 px-6 flex justify-center items-start">
//             <div className="w-full">
//                 {currentStep === 1 && (
//                     <div className='shadow-lg rounded-xl p-8 space-y-6 bg-white max-w-4xl mx-auto'>
//                         <h2 className="text-2xl font-bold text-gray-800">Select a Google Ads Customer</h2>
//                         <form onSubmit={handleSubmit} className="space-y-6">
//                             <div>
//                                 <label htmlFor="customer" className="block text-lg font-semibold text-gray-700 mb-2">
//                                     Customers
//                                 </label>
//                                 <select
//                                     id="customer"
//                                     onChange={handleCustomerChange}
//                                     value={selectedCustomer || ''}
//                                     className={`${isSubmittingCustomerBtn ? 'cursor-not-allowed' : 'cursor-pointer'} w-full border border-gray-300 rounded-lg px-4 py-3 text-lg`}
//                                     disabled={customerLoading || isSubmittingCustomerBtn}
//                                     required
//                                 >
//                                     {customerLoading ? (
//                                         <option>Loading...</option>
//                                     ) : (
//                                         <>
//                                             <option value="" disabled>
//                                                 Select a customer
//                                             </option>
//                                             {customerSummaries?.map((customer, index) => (
//                                                 <option key={index} value={customer?.id}>
//                                                     {customer?.name}
//                                                 </option>
//                                             ))}
//                                         </>
//                                     )}
//                                 </select>
//                             </div>
//                             <button
//                                 type="submit"
//                                 className={`w-full text-white font-semibold py-3 text-lg rounded-lg transition-all ${isSubmittingCustomerBtn ? 'cursor-not-allowed bg-gray-500' : 'cursor-pointer bg-blue-600 hover:bg-blue-700'}`}
//                             >
//                                 {isSubmittingCustomerBtn ? 'Submitting...' : 'Submit & Next'}
//                             </button>
//                         </form>

//                         {jobStatusMsg && <p className="text-sm text-center text-yellow-600 mt-4 font-medium">{jobStatusMsg}</p>}

//                         {showRetryConnector && (
//                             <div className="mt-4 text-center">
//                                 <button
//                                     onClick={handleRetryConnector}
//                                     className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
//                                 >
//                                     Yes, Connect
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {currentStep === 2 && (
//                     <GoogleAdsTable
//                         handleBack={() => setCurrentStep(1)}
//                         onTableSubmit={() => setCurrentStep(3)}
//                     />)}

//                 {currentStep === 3 && (
//                     <MMMOptionsSection handleBack={() => setCurrentStep(2)} />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Page;










// 'use client'

// import useCustomerSummaries from '@/components/hooks/connectors/googleAdsCustomerList';
// import useGooglAdsConnector from '@/components/hooks/connectors/useGooglAdsConnector';
// import useUserSession from '@/components/hooks/useUserSession';
// import GoogleAdsTable from '@/components/Mmm/googleAdsTable';
// import MMMOptionsSection from '@/components/Mmm/MMMOptionsSection';
// import { useMMMStore } from '@/store/useMMMStore';
// import { checkJobStatus } from '@/utils/checkJobStatus';
// import { getGaAccessTokenFromRefreshToken } from '@/utils/getAccessToken';
// import { GetCampaignData } from '@/utils/getCampaignData';
// import { generateUniqueId } from '@/utils/helper';
// import { useSearchParams } from 'next/navigation';
// import React, { useEffect, useState } from 'react'

// const Page: React.FC = () => {

//     const { user } = useUserSession();

//     // const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
//     const [accessToken, setAccessToken] = useState<string | null>(null);
//     const [submitted, setSubmitted] = useState(false);
//     const [currentStep, setCurrentStep] = useState(1);
//     const { googleAdsConnector } = useGooglAdsConnector();

//     const { isSubmittingCustomerBtn, setIsSubmittingCustomerBtn, googleAdsRefreshToken, selectedCustomer, setSelectedCustomer, setCampaigns } = useMMMStore()

//     useEffect(() => {
//         const fetchAccessToken = async () => {
//             if (googleAdsRefreshToken && user && !accessToken) {
//                 const response = await getGaAccessTokenFromRefreshToken(googleAdsRefreshToken);
//                 if (response) {
//                     setAccessToken(response);
//                 }
//             }
//         };

//         // Only call when all required dependencies are non-null
//         if (googleAdsRefreshToken && user && !accessToken) {
//             fetchAccessToken();
//         }
//     }, [googleAdsRefreshToken, user, accessToken]);

//     const {
//         customerSummaries,
//         loading: customerLoading,
//         error: customerError,
//     } = useCustomerSummaries(accessToken);

//     const handleCustomerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedCustomerId = event.target.value;
//         setSelectedCustomer(selectedCustomerId);
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         if (!selectedCustomer) return;
//         setIsSubmittingCustomerBtn(true);

//         const client_id = generateUniqueId('mmm_campaign_typeee', `${user?.email}`, selectedCustomer, 'googleAds');
//         console.log("responseresponse---genrate-", client_id, typeof client_id);

//         const today = new Date();

//         // End date: today - 2 days
//         const endDate = new Date(today);
//         endDate.setDate(today.getDate() - 2);

//         // Start date: today - 740 days
//         const startDate = new Date(today);
//         startDate.setDate(today.getDate() - 740);

//         // Format as YYYY-MM-DD
//         const formatDate = (date: Date): string =>
//             date.toISOString().split('T')[0];

//         const formattedStartDate = formatDate(startDate);
//         const formattedEndDate = formatDate(endDate);

//         // Final data object
//         const data = {
//             start_date: formattedStartDate,
//             end_date: formattedEndDate,
//             refresh_token: googleAdsRefreshToken || "N/A",
//             report_name: 'campaign_mmm_report_for_ads',
//             login_customer_id: selectedCustomer,
//             jobId: client_id,
//             email: user?.email,
//             client_id: client_id
//         };

//         const jobCheckResponse = await checkJobStatus(client_id);
//         console.log("jobCheckResponse -->", jobCheckResponse);


//         const responseConnector = await googleAdsConnector(data);
//         console.log("responseConnector--", responseConnector)
//         const response = await GetCampaignData(client_id);

//         if (response?.campaigns && response?.camp_names) {
//             setCampaigns(response?.campaigns);
//         }

//         setTimeout(() => {
//             setIsSubmittingCustomerBtn(false);
//             setSubmitted(true);
//             setCurrentStep(2);
//         }, 1200);
//     }

//     return (
//         <div className="min-h-screen bg-gray-100 py-10 px-6 flex justify-center items-start">
//             <div className="w-full">
//                 {currentStep === 1 && (
//                     <div className='shadow-lg rounded-xl p-8 space-y-6 bg-white max-w-4xl mx-auto'>
//                         <h2 className="text-2xl font-bold text-gray-800">Select a Google Ads Customer</h2>
//                         <form onSubmit={handleSubmit} className="space-y-6">
//                             <div>
//                                 <label htmlFor="customer" className="block text-lg font-semibold text-gray-700 mb-2">
//                                     Customers
//                                 </label>
//                                 <select
//                                     id="customer"
//                                     onChange={handleCustomerChange}
//                                     value={selectedCustomer || ''}
//                                     className={`${isSubmittingCustomerBtn ? 'cursor-not-allowed' : 'cursor-pointer'} w-full border border-gray-300 rounded-lg px-4 py-3 text-lg`}
//                                     disabled={customerLoading || isSubmittingCustomerBtn}
//                                     required
//                                 >
//                                     {customerLoading ? (
//                                         <option>Loading...</option>
//                                     ) : (
//                                         <>
//                                             <option value="" disabled>
//                                                 Select a customer
//                                             </option>
//                                             {customerSummaries?.map((customer, index) => (
//                                                 <option key={index} value={customer?.id}>
//                                                     {customer?.name}
//                                                 </option>
//                                             ))}
//                                         </>
//                                     )}
//                                 </select>
//                             </div>
//                             <button
//                                 type="submit"
//                                 className={`w-full text-white font-semibold py-3 text-lg rounded-lg transition-all
//                                     ${isSubmittingCustomerBtn ? 'cursor-not-allowed bg-gray-500' : 'cursor-pointer bg-blue-600 hover:bg-blue-700'}`}
//                             >
//                                 {isSubmittingCustomerBtn ? 'Submitting...' : 'Submit & Next'}
//                             </button>
//                         </form>
//                     </div>
//                 )}

//                 {currentStep === 2 && (
//                     <GoogleAdsTable
//                         handleBack={() => setCurrentStep(1)}
//                         onTableSubmit={() => setCurrentStep(3)} // move to next step
//                     />)}

//                 {currentStep === 3 && (
//                     <MMMOptionsSection handleBack={() => setCurrentStep(2)} />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Page











//   start_date: formattedStartDate,
//   end_date: formattedEndDate,
//   refresh_token: refreshToken || "N/A",
//   report_name: selectedLevel,
//   jobId: jobId,

// useEffect(() => {
//     const fetchAccessToken = async () => {
//         if (googleAdsRefreshToken && !accessToken && user) {
//             const response = await getAccessTokenFromRefreshToken(googleAdsRefreshToken);
//             if (response) {
//                 setAccessToken(response);
//             }
//         }
//     };

//     fetchAccessToken();
// }, [googleAdsRefreshToken, accessToken, user]);


// const handleBack = () => {
//     setSubmitted(false);
//     setSelectedCustomer(null);
// };