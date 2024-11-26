"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import CustomDatepicker from "@/components/DatePicker/Datepicker";
import { useSearchParams } from "next/navigation";
import useCustomerSummaries from "@/components/hooks/connectors/googleAdsCustomerList";
import useToast from "@/components/hooks/toast";
import { ToastContainer } from "react-toastify";
import { format } from 'date-fns';
import useGoogleAdsDetails from "@/components/hooks/connectors/useGoogleAdsDetails";
import { createJobId } from "@/utils/helper";

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
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const dropdownRef = useRef(null);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { googleAdsDetails } = useGoogleAdsDetails();
  const user = JSON.parse(localStorage.getItem('userSession') || '{}')?.user;
  const jobId = createJobId('googleAds', user?.email);

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
    customerSummaries,
    loading: customerLoading,
    error: customerError,
  } = useCustomerSummaries(accessToken);


  const handleCustomerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCustomerId = event.target.value;
    setSelectedCustomer(selectedCustomerId);
  };


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
    if (!selectedCustomer) {
      notify('Please select a Customer first!', 'error');
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
      report_name: selectedLevel,
      login_customer_id: selectedCustomer,
      jobId: jobId
    };

    try {
      setLoadingScreen(true);
      closeModal();

      const response = await googleAdsDetails(data);

      setSelectedCustomer(null);
      setSelectedLevel(null);
      if (response.success) {
        onSubmitSuccess('Google Ads Connector Successful!');
      } else {
        onSubmitSuccess('Google Ads Connector Failed!');
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
            <div className="bg-white p-6 flex relative flex-col justify-between rounded-lg shadow-lg w-[650px] h-[340px] 2xl:w-[700px] 2xl:h-[340px]">

              <div className="flex items-center">
                <Dialog.Title className=" flex justify-center items-center absolute gap-4 top-[-32px] left-[40%] rounded-[10px] shadow-xl text-2xl text-[#010101] bg-white font-bold text-center px-8 py-6 mb-4 mx-auto">
                  <img src="/assets/Google Ads logo.png" alt="dv360" /> <div>Google Ads</div>
                </Dialog.Title>
                <button onClick={closeModal} className="mb-10">
                  <img src="/assets/close_icon.png" alt="Close" className="h-8 w-8 absolute right-10 rounded-full"
                    onMouseOver={(e) => (e.currentTarget.src = '/assets/cross_hover.png')}
                    onMouseOut={(e) => (e.currentTarget.src = '/assets/close_icon.png')}
                  />
                </button>
              </div>
              <div className="flex flex-col h-full gap-14 py-10">

                {/* Customer Summaries and level Select */}
                <div className="flex gap-4 justify-between">
                  <select
                    onChange={handleCustomerChange}
                    value={selectedCustomer || ""}
                    className="p-2 h-14 text-xl font-semibold cursor-pointer text-black bg-white border border-black px-4 w-[50%] rounded-[5px]"
                    disabled={customerLoading}
                    required
                  >
                    {customerLoading ? (
                      <option>Loading...</option>
                    ) : (
                      <>
                        <option value="" disabled>Select a customer</option>
                        {customerSummaries?.map((customer, index) => (
                          <option key={index} className="bg-white" value={customer?.id}>
                            {customer?.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  <select onChange={handleLevelSelect} value={selectedLevel || ""} className="p-2 h-14 text-xl font-semibold cursor-pointer text-black bg-white border border-black px-4 w-[50%] rounded-[5px]">
                    <option className="bg-white" value="">Select Level</option>
                    <option className="bg-white" value="ad_performance">Ad Performance</option>
                    <option className="bg-white" value="campaign">Campaign</option>
                    <option className="bg-white" value="ad_group">Ad Group</option>
                    <option className="bg-white" value="keyword">Keyword</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between pb-10 2xl:pb-0">
                <div className="flex flex-col pt-16 pb-2 justify-between w-[60%]">
                  <CustomDatepicker onDateRangeChange={handleDateRangeChange} />
                  <div>
                    <button type="submit" onClick={handleSubmit} className="bg-primary hover:bg-[#253955] text-white w-full h-14 text-xl rounded-[10px] font-bold border-[#B5B5B5]">SUBMIT</button>
                  </div>
                </div>
                <img src="/assets/dv360_man.png" alt="googleAds_man" className="h-full" />
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Page;