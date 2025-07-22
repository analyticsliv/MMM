"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import CustomDatepicker from "@/components/DatePicker/Datepicker";
import { useUser } from "@/app/context/UserContext";
import { useSearchParams } from "next/navigation";
import useConnector from "@/components/hooks/connectors/useConnectors";
import useAccountProperties from "@/components/hooks/connectors/ga4PropertyList";
import useToast from "@/components/hooks/toast";
import { ToastContainer } from "react-toastify";
import { format } from 'date-fns';
import { reportOptionsLinkedin } from "@/utils/const";
import { createJobId, generateUniqueId } from "@/utils/helper";
import useLinkedInConnector from "@/components/hooks/connectors/useLinkedInConnector";
import useLinkedinSummaries from "@/components/hooks/connectors/linkedinAccountList";
import useLinkedinAccountProperties from "@/components/hooks/connectors/useLinkedinAccountProperties";

interface SuccessModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  onSubmitSuccess: (message: string) => void;
  setLoadingScreen: (loading: boolean) => void;
  setStatusCheck: (loading: boolean) => void;
  accessToken: string | null;
  refreshToken: string | null;
}

const Page: React.FC<SuccessModalProps> = ({ isModalOpen, closeModal, onSubmitSuccess, setLoadingScreen, setStatusCheck, accessToken, refreshToken }) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = React.useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  // const [accessToken, setAccessToken] = useState<string | null>(null);
  // const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const dropdownRef = useRef(null);
  // const { user } = useUser();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  // const refreshTokenParam = searchParams.get("refresh_token");
  // const { updateOrCreateConnector, getConnectorData, error, loading } = useConnector();
  const { linkedInConnector } = useLinkedInConnector();
  const user = JSON.parse(localStorage.getItem('userSession') || '{}')?.user;
  const jobId = createJobId('linkedIn', user?.email);

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  const notify = useToast();

  useEffect(() => {
    if (dropdownVisible) {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [dropdownVisible]);

  const {
    accountSummaries,
    loading: accountsLoading,
    error: accountsError,
  } = useLinkedinSummaries(accessToken);

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(event.target.value);
    setSelectedCampaign(null);
  };

  const handlePropertyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCampaignId = event.target.value;
    setSelectedCampaign(selectedCampaignId);
  };

  const handleReportChange = (event: any) => {
    setSelectedReport(event.target.value);
  };

  const {
    propertySummaries,
    loading: propertiesLoading,
    error: propertiesError,
  } = useLinkedinAccountProperties(accessToken, selectedAccount);

  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });
  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    setDateRange({ startDate, endDate });
  };

  const [jobData, setJobData] = useState<object | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null); // State to hold the status

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedStartDate = dateRange.startDate ? format(dateRange.startDate, 'yyyy-MM-dd') : null;
    const formattedEndDate = dateRange.endDate ? format(dateRange.endDate, 'yyyy-MM-dd') : null;

    if (!formattedStartDate || !formattedEndDate) {
      notify('Please select Date Range!', 'error');
      return;
    }
    if (!selectedAccount) {
      notify('Please select an account first!', 'error');
      return;
    }

    if (selectedReport == 'campaign_analytics') {
      if (!selectedCampaign) {
        notify('Please select campaign!', 'error');
        return;
      }
    }

    if (!selectedReport) {
      notify('Please select the report!', 'error');
      return;
    }
    const createLinkedInUniqueId = generateUniqueId(
      "connector",
      `${user?.email}`,
      selectedAccount,
      "likedIn"
    );
    const data = {
      access_token: accessToken || "N/A",
      account_id: selectedAccount,
      // account_id: selectedAccount,
      campaign_id: selectedReport == 'campaign_analytics' ? selectedCampaign : 'None',
      report_name: selectedReport,
      // campaign_id: selectedCampaign,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      jobId: jobId,
      email: user?.email,
      unique_ada_id: createLinkedInUniqueId
    };

    try {
      setLoadingScreen(true);
      closeModal();

      const response = await linkedInConnector(data);
      setSelectedCampaign(null);
      setSelectedAccount(null);
      setSelectedReport('');
      if (response.success) {
        onSubmitSuccess('linkedIn Connector Successful!');
      } else {
        onSubmitSuccess('linkedIn Connector Failed!');
      }
    } catch (error) {
      onSubmitSuccess('An error occurred!');
    } finally {
      setLoadingScreen(false);
    }
  };

  return (

    <div className="">
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen">
        <Dialog open={isModalOpen} onClose={closeModal} className="bg-gray-800 bg-opacity-75"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            px: 10,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            zIndex: '50'
          }}>

          <div className={`fixed inset-0 flex items-center justify-center p-5 ${isModalOpen ? '' : 'hidden'}`}>
            <div className="bg-white p-6 flex relative flex-col justify-between rounded-lg shadow-lg w-[650px] h-[340px] 2xl:w-[700px] 2xl:h-[340px]">

              <div className="flex items-center">
                <Dialog.Title className=" flex justify-center items-center absolute gap-4 top-[-32px] left-[40%] rounded-[10px] shadow-xl text-2xl text-[#010101] bg-white font-bold text-center px-8 py-6 mb-4 mx-auto">
                  <img src="/assets/linkedin_Logo.png" alt="linkedin" /> <div>LinkedIn</div>
                </Dialog.Title>

                <button onClick={closeModal} className="mb-10">
                  <img src="/assets/close_icon.png" alt="Close" className="h-8 w-8 absolute right-10 rounded-full"
                    onMouseOver={(e) => (e.currentTarget.src = '/assets/cross_hover.png')}
                    onMouseOut={(e) => (e.currentTarget.src = '/assets/close_icon.png')}
                  />
                </button>
              </div>
              <div className="flex flex-col h-full gap-14 py-10">
                {/* Account Summaries and Property Select */}
                <div className="flex gap-4 justify-between">
                  <select
                    onChange={handleAccountChange}
                    value={selectedAccount || ""}
                    className="p-2 h-14 text-xl font-semibold cursor-pointer text-black bg-white border border-black px-4 rounded-[5px] w-1/3"
                    disabled={accountsLoading}
                    required
                  >
                    {accountsLoading ? (
                      <option>Loading...</option>
                    ) : (
                      <>
                        <option value="" disabled>Select an account</option>
                        {accountSummaries?.map((account, index) => (
                          <option key={index} className="bg-white" value={account?.id}>
                            {account?.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>

                  <select
                    onChange={handleReportChange}
                    value={selectedReport || ""}
                    className="p-2 h-14 text-xl font-semibold cursor-pointer text-black bg-white border border-black px-4 rounded-[5px] w-1/3"
                    required
                  >
                    <>
                      <option value="" disabled>Select Reports</option>
                      {reportOptionsLinkedin?.map((report, index) => (
                        <option key={index} className="bg-white" value={report}>
                          {report}
                        </option>
                      ))}
                    </>
                  </select>

                  {/* Property Select */}
                  <div className="w-1/3">
                    {selectedReport == 'campaign_analytics' &&
                      <select
                        onChange={handlePropertyChange}
                        value={selectedCampaign || ""}
                        className="p-2 h-14 text-xl font-semibold cursor-pointer text-black bg-white border border-black px-4 rounded-[5px] w-full"
                        disabled={!selectedAccount || propertiesLoading}
                        required
                      >
                        {propertiesLoading ? (
                          <option>Loading...</option>
                        ) : (
                          <>
                            <option value="" disabled>Select a property</option>
                            {propertySummaries?.map((property, index) => (
                              <option key={property?.id} className="bg-white" value={property?.id}>
                                {property?.name}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    }
                  </div>
                </div>
                <div className="flex justify-between pb-10 2xl:pb-0">
                  <div className="flex flex-col pt-16 pb-2 justify-between w-[60%]">
                    <CustomDatepicker onDateRangeChange={handleDateRangeChange} />
                    <div>
                      <button type="submit" onClick={handleSubmit} className="bg-primary hover:bg-[#253955] text-white w-full h-14 text-xl rounded-[10px] font-bold border-[#B5B5B5]">SUBMIT</button>
                    </div>
                  </div>
                  <img src="/assets/Image_for_LinkedIn.png" alt="LinkedIn_man" className="h-full" />
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </div >
    </div >
  );
};

export default Page;