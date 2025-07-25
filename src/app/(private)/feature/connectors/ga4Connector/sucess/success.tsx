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
import useGa4Connector from "@/components/hooks/connectors/useGa4Connector";
import { createJobId, generateUniqueId } from "@/utils/helper";
import useUserSession from "@/components/hooks/useUserSession";

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
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = React.useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  // const [accessToken, setAccessToken] = useState<string | null>(null);
  // const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const dropdownRef = useRef(null);
  // const { user } = useUser();
  const { user, setUser } = useUserSession();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  // const refreshTokenParam = searchParams.get("refresh_token");
  // const { updateOrCreateConnector, getConnectorData, error, loading } = useConnector();
  const { ga4Connector } = useGa4Connector();
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
    if (!selectedProperty) {
      notify('Please select a property first!', 'error');
      return;
    }
    if (selectedReport.length === 0) {
      notify('Please select at least one report!', 'error');
      return;
    }
    const createGa4UniqueId = generateUniqueId(
      "connector",
      `${user?.email}`,
      selectedProperty,
      "ga4"
    );
    const data = {
      refresh_token: refreshToken || "N/A",
      property_id: selectedProperty,
      project_id: "dx-api-project",
      dataset_name: "trial_data",
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      reports_list: selectedReport,
      jobId: jobId,
      email: user?.email,
      unique_ada_id: createGa4UniqueId
    };

    try {
      setLoadingScreen(true);
      closeModal();

      const response = await ga4Connector(data);

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
            zIndex:'50'
          }}>

          <div className={`fixed inset-0 flex items-center justify-center p-5 ${isModalOpen ? '' : 'hidden'}`}>
            <div className="bg-white p-6 flex relative flex-col justify-between rounded-lg shadow-lg w-[650px] h-[340px] 2xl:w-[700px] 2xl:h-[340px]">

              <div className="flex items-center">
                <Dialog.Title className=" flex justify-center items-center absolute gap-4 top-[-32px] left-[44%] rounded-[10px] shadow-xl text-2xl text-[#010101] bg-white font-bold text-center px-8 py-6 mb-4 mx-auto">
                  <img src="/assets/GA4_Logo.png" alt="dv360" /> <div>GA4</div>
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
                        {accountSummaries.map((account, index) => (
                          <option key={index} className="bg-white" value={account.name}>
                            {account.displayName}
                          </option>
                        ))}
                      </>
                    )}
                  </select>

                  {/* Property Select */}
                  <select
                    onChange={handlePropertyChange}
                    value={selectedProperty || ""}
                    className="p-2 h-14 text-xl font-semibold cursor-pointer text-black bg-white border border-black px-4 rounded-[5px] w-1/3"
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
                      className={`p-2 h-14 w-full text-xl font-semibold text-black bg-white border border-black px-4 rounded-[5px] flex items-center justify-between ${selectedReport.length > 0}`}
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
                <div className="flex justify-between pb-10 2xl:pb-0">
                  <div className="flex flex-col pt-16 pb-2 justify-between w-[60%]">
                    <CustomDatepicker onDateRangeChange={handleDateRangeChange} />
                    <div>
                      <button type="submit" onClick={handleSubmit} className="bg-primary hover:bg-[#253955] text-white w-full h-14 text-xl rounded-[10px] font-bold border-[#B5B5B5]">SUBMIT</button>
                    </div>
                  </div>
                  <img src="/assets/Image_for_Ga4.png" alt="ga4_man" className="h-full" />
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
