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
import { reportOptions } from "@/utils/const";
import useGa4Details from "@/components/hooks/connectors/useGa4Details";

interface SuccessModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  onSubmitSuccess: (message: string) => void;
  setLoadingScreen: (loading: boolean) => void;

}

const Page: React.FC<SuccessModalProps> = ({ isModalOpen, closeModal, onSubmitSuccess, setLoadingScreen }) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = React.useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const dropdownRef = useRef(null);
  const { user } = useUser();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const refreshTokenParam = searchParams.get("refresh_token");
  const { updateOrCreateConnector, getConnectorData, error, loading } = useConnector();
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const { ga4Details } = useGa4Details();

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

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(event.target.value);
    setSelectedProperty(null);
  };

  const handlePropertyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPropertyId = event.target.value;
    setSelectedProperty(selectedPropertyId);
  };

  const handleReportChange = (event) => {
    const { value, checked } = event.target;
    setSelectedReport(prevSelectedReports =>
      checked
        ? [...prevSelectedReports, value]
        : prevSelectedReports.filter(report => report !== value)
    );
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

  useEffect(() => {
    // this function is responsible to genrate acesstoken if user comes first time...
    async function getTokenFromCode(code: string) {
      try {
        const response = await fetch(`/api/auth/ga4-auth?code=${code}`);
        const data = await response.json();
        setAccessToken(data?.access_token || null);
        setRefreshToken(data?.refresh_token);
        const user = JSON.parse(localStorage.getItem('userSession'))?.user;
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

    if (code && !accessToken) {
      getTokenFromCode(code);
    }
    else if (refreshTokenParam && !accessToken) {
      getTokenFromRefreshToken(refreshTokenParam);
      setRefreshToken(refreshTokenParam);
    }
  }, [code, refreshTokenParam]);

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
    if (selectedReport.length === 0) {
      notify('Please select at least one report!', 'error');
      return;
    }
    const data = {
      refresh_token: refreshToken || "N/A",
      property_id: selectedProperty,
      project_id: "dx-api-project",
      dataset_name: "trial_data",
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      reports_list: selectedReport,
    };
    console.log(data);

    try {
      setLoadingScreen(true);
      closeModal();

      const response = await ga4Details(data);

      setSelectedProperty(null);
      setSelectedAccount(null);
      setSelectedReport([]);
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
                    <option value="" disabled>Select an account</option>
                    {accountSummaries.map((account, index) => (
                      <option key={index} className="bg-white" value={account.name}>
                        {account.displayName}
                      </option>
                    ))}
                  </select>

                  {/* Property Select */}
                  <select
                    onChange={handlePropertyChange}
                    value={selectedProperty || ""}
                    className="p-2 h-14 text-xl font-semibold rounded-sm bg-homeGray w-1/3"
                    disabled={!selectedAccount} // Disable if no account is selected
                    required
                  >
                    <option value="" disabled>Select a property</option>
                    {properties.map((property, index) => (
                      <option key={property.property} className="bg-white" value={propertyIds[index]}>
                        {property.displayName}
                      </option>
                    ))}
                  </select>

                  <div className="relative w-1/3" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownVisible(!dropdownVisible)}
                      className={`p-2 h-14 w-full text-xl font-semibold rounded-sm bg-homeGray flex items-center justify-between ${selectedReport.length > 0}`}
                    >
                      Select Reports
                      <span className="relative ml-2">
                        {selectedReport.length > 0 && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full absolute left-0 transform translate-y-[-50%]">
                            {selectedReport.length}
                          </span>
                        )}
                      </span>
                      <img className="ml-2 max-h-5 max-w-5 "
                        src="/assets/dropdown1.webp"
                      />
                    </button>
                    {dropdownVisible && (
                      <div className="absolute bg-white border shadow-lg mt-2 z-10 max-h-80 overflow-y-scroll">
                        {Object.entries(reportOptions).map(([key, label]) => (
                          <div key={key} className="flex items-center p-2 ">
                            <input
                              type="checkbox"
                              id={key}
                              value={key}
                              checked={selectedReport.includes(key)}
                              onChange={handleReportChange}
                              className="mr-2"
                              required
                            />
                            <label htmlFor={key} className="text-lg">
                              {label}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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