"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import CustomDatepicker from "@/components/DatePicker/Datepicker";
import { useUser } from "@/app/context/UserContext";
import { useSearchParams } from "next/navigation";
import useConnector from "@/components/hooks/connectors/useConnectors";
import useAccountSummaries from "@/components/hooks/connectors/ga4AccountList";
import useAccountProperties from "@/components/hooks/connectors/ga4PropertyList";
import useToast from "@/components/hooks/toast";
import { ToastContainer } from "react-toastify";
import { format } from 'date-fns';
import useGa4Details from "@/components/hooks/connectors/useGa4Details";
import { createJobId } from "@/utils/helper";
import useCustomerList from "@/components/hooks/connectors/googleAdsCustomerList";

interface SuccessModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  onSubmitSuccess: (message: string) => void;
  setLoadingScreen: (loading: boolean) => void;
  setStatusCheck: (loading: boolean) => void;
  accessToken: string | null;
}

const Page: React.FC<SuccessModalProps> = ({ isModalOpen, closeModal, onSubmitSuccess, setLoadingScreen, setStatusCheck, accessToken }) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const dropdownRef = useRef(null);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const { ga4Details } = useGa4Details();
  const user = JSON.parse(localStorage.getItem('userSession') || '{}')?.user;
  const jobId = createJobId('ga4', user?.email);

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
  } = useAccountSummaries(accessToken);

  const {
    customerDetails,
    // loading: accountsLoading,
    // error: accountsError,
  } = useCustomerList(accessToken);

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(event.target.value);
    setSelectedProperty(null);
  };

  const handlePropertyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPropertyId = event.target.value;
    setSelectedProperty(selectedPropertyId);
  };

  const {
    properties,
    propertyIds,
    loading: propertiesLoading,
    error: propertiesError,
  } = useAccountProperties(selectedAccount, accountSummaries, accessToken);

  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });
  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    setDateRange({ startDate, endDate });
  };

  const [jobData, setJobData] = useState<object | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null); // State to hold the status


  const handleLevelSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const Level = event.target.value;
    setSelectedLevel(Level);
  };

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
    if (!selectedProperty) {
      notify('Please select a property first!', 'error');
      return;
    }
    if (!selectedLevel) {
      notify('Please select a Level first!', 'error');
      return;
    }
    const data = {
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      refresh_token: refreshToken || "N/A",
      level: selectedLevel,
      customer_id: "6661667050",
      //   property_id: selectedProperty,
      //   project_id: "dx-api-project",
      //   dataset_name: "trial_data",
      //   reports_name: selectedReport,
      //   jobId: jobId
    };
    // '{
    //     "start_date": "2024-01-01",
    //     "end_date": "2024-12-31",
    //     "refresh_token": "ya29.a0AfB_byCDZAj0W6ud_v_go_3elfPETlJ-UtgThRI2b8rsioO4nwyNuQvqM5u7nnwTICH8Yk_dunCI9b5am4LaAYXWcDIVC7G6PX_RveVMLwSQQ_grjQVnZAOQqWfb_CIGcpaDm6krIwLcwEZ1BzOGNGYR4BYbPmKt28k1aCgYKASsSARASFQGOcNnCdH2W9RXnADxU4Gn2oY8DGA0171",
    //     "report_name": "campaign",
    //     "customer_id": "6661667050"
    // }'
    try {
      setLoadingScreen(true);
      closeModal();

      const response = await ga4Details(data);

      setSelectedProperty(null);
      setSelectedAccount(null);
      setSelectedLevel(null);
      if (response.success) {
        onSubmitSuccess('GA4 Connector Successful!');
      } else {
        onSubmitSuccess('GA4 Connector Failed!');
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
          }}>

          <div className={`fixed inset-0 flex items-center justify-center p-5 ${isModalOpen ? '' : 'hidden'}`}>
            <div className="bg-white p-6 flex flex-col justify-between rounded-lg shadow-lg w-[650px] h-[300px] 2xl:w-[700px] 2xl:h-[350px]">

              <div className="flex items-center">
                <Dialog.Title className="text-2xl font-bold text-white text-center w-32 py-3 rounded-md mb-4 bg-custom-gradient mx-auto">
                  GA4
                </Dialog.Title>

                <button onClick={closeModal} className="mb-10">
                  <img src="/assets/close_icon.png" alt="Close" className="h-8 w-8 rounded-full"
                    onMouseOver={(e) => (e.currentTarget.src = '/assets/cross_hover.png')}
                    onMouseOut={(e) => (e.currentTarget.src = '/assets/close_icon.png')}
                  />
                </button>
              </div>
              <div className="flex flex-col justify-between h-2/5">

                <CustomDatepicker onDateRangeChange={handleDateRangeChange} />

                {/* Account Summaries and Property Select */}
                <div className="flex gap-4 mt-6 justify-between">
                  <select
                    onChange={handleAccountChange}
                    value={selectedAccount || ""}
                    className="p-2 h-14 text-xl font-semibold rounded-sm bg-homeGray w-1/3"
                    required
                  >
                    <option value="" disabled>Select a customer</option>
                    {customerDetails.map((account, index) => (
                      <option key={index} className="bg-white" value={account.name}>
                        {account.displayName}
                      </option>
                    ))}
                  </select>

                  {/* Property Select */}
                  {/* <select
                    onChange={handlePropertyChange}
                    value={selectedProperty || ""}
                    className="p-2 h-14 text-xl font-semibold rounded-sm bg-homeGray w-1/3"
                    disabled={!selectedAccount} // Disable if no account is selected
                    required
                  >
                    <option value="" disabled>Select a report</option>
                    {properties.map((property, index) => (
                      <option key={property.property} className="bg-white" value={propertyIds[index]}>
                        {property.displayName}
                      </option>
                    ))}
                  </select> */}

                  <select onChange={handleLevelSelect} value={selectedLevel || ""} className="p-2 h-14 text-xl font-semibold rounded-sm bg-homeGray w-1/2">
                    <option className="bg-white" value="">Select Level</option>
                    <option className="bg-white" value="ad">Ad</option>
                    <option className="bg-white" value="campaign">Campaign</option>
                    <option className="bg-white" value="ad_set">Ad set</option>
                  </select>
                </div>
              </div>
              <div>
                <button type="submit" onClick={handleSubmit} className="bg-homeGray hover:bg-gray-500 w-40 h-14 text-xl font-bold mx-[43%] border-[#B5B5B5]">Submit</button>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Page;