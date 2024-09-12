"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useConnector from '@/components/hooks/connectors/useConnectors';
import { useSession } from 'next-auth/react';
import { Dialog } from '@headlessui/react';
import CustomDatepicker from '@/components/DatePicker/Datepicker';
import { format } from 'date-fns';
import useToast from '@/components/hooks/toast';
import { ToastContainer } from 'react-toastify';
import { createJobId } from '@/utils/helper';
import JobDetail from '@/Models/JobDetail';

const SuccessPage = () => {
  const { data: session, status } = useSession();
  const { updateOrCreateConnector, getConnectorData, error, loading } = useConnector()
  const searchParams = useSearchParams();
  const accessToken = searchParams.get('accessToken');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobData, setJobData] = useState<object | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const notify = useToast();

  useEffect(() => {
    async function getJobDetail(jobId: string) {

      try {
        const response = await fetch('/api/connectors/jobCheck', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jobId }), // Sending jobId in the body
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setJobData(data); // Store jobId in state
        console.log("API response:", data);

      } catch (error) {
        console.error('Error fetching auth URL:', error);
      }
    }
    const jobId = createJobId('facebook', "data.analytics@analyticsliv.com");
    if (jobId) {
      getJobDetail(jobId);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchUserAccounts(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      const connectorData = {
        accessToken: accessToken,
        expire: Date.now() + 60 * 24 * 60 * 60 * 1000
      };

      updateOrCreateConnector("data.analytics@analyticsliv.com", 'facebook', connectorData);
    }
  }, [accessToken, session, status])


  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });
  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    setDateRange({ startDate, endDate });
    console.log("object", setDateRange)
  };

  const fetchUserAccounts = async (accessToken: string) => {
    try {
      const response = await fetch(`https://graph.facebook.com/v11.0/me/adaccounts?fields=id,name&access_token=${accessToken}`);
      const data = await response.json();
      setAccounts(data.data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleAccountSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const accountId = event.target.value;
    setSelectedAccount(accountId);
    console.log("ghjkl", accountId)
  };

  const handleLevelSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const Level = event.target.value;
    setSelectedLevel(Level);
    console.log("ghjkl", Level)
  };

  const handleSubmit = async () => {

    const formattedStartDate = dateRange.startDate ? format(dateRange.startDate, 'yyyy-MM-dd') : null;
    const formattedEndDate = dateRange.endDate ? format(dateRange.endDate, 'yyyy-MM-dd') : null;
    if (!formattedStartDate || !formattedEndDate) {
      notify('Please select Date Range!', 'error');
      return;
    }
    if (!selectedAccount) {
      notify('Please select an Account first!', 'error');
      return;
    }
    if (!selectedLevel) {
      notify('Please select a Level first!', 'error');
      return;
    }
    const data = {
      access_token: accessToken,
      start_date: formattedStartDate, // Use formatted start date
      end_date: formattedEndDate, // Use formatted end date
      level: selectedLevel,
      table_name: "Facebook_Data.sss1",
    }
    console.log("data object", data)
    closeModal();
    setSelectedLevel(null);
    setSelectedAccount(null);
  }
  return (
    <div>
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen">

        {jobData?.message == "Job not found" ? (
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            Open Facebook Modal
          </button>) : <div>
          Connector is already connected !
        </div>}
        <Dialog open={isModalOpen} onClose={closeModal} className="bg-gray-600 bg-opacity-50"
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
            // opacity: 0.95,
          }}
        >
          <div className="fixed inset-0 flex items-center justify-center p-5">
            <div className="bg-white p-6 flex flex-col justify-between rounded-lg shadow-lg w-[650px] h-[300px] 2xl:w-[700px]">
              <div className="flex items-center">
                <Dialog.Title className="text-2xl font-bold text-white text-center w-32 py-3 rounded-md mb-4 bg-custom-gradient mx-auto">
                  Facebook
                </Dialog.Title>
                <button onClick={closeModal} className="mb-10">
                  <img src="/assets/close_icon.png" alt="Close" className="h-8 w-8 rounded-full"
                    onMouseOver={(e) => (e.currentTarget.src = '/assets/cross_hover.png')}
                    onMouseOut={(e) => (e.currentTarget.src = '/assets/close_icon.png')}
                  />
                </button>
              </div>
              {/* <select
                    onChange={handleAccountChange}
                    value={selectedAccount || ""}
                    className="p-2 h-14 text-xl font-semibold rounded-sm bg-homeGray w-1/2"
                    required
                  ></select> */}

              <CustomDatepicker onDateRangeChange={handleDateRangeChange} />

              <div className="flex gap-4 mt-6 justify-evenly max-h-56 ">
                <select onChange={handleAccountSelect} value={selectedAccount || ""} className="p-2 h-14  max-h-56 text-xl font-semibold rounded-sm bg-homeGray w-1/2">
                  <option value="">Select Account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id} className="bg-white">
                      {account.name}
                    </option>
                  ))}
                </select>
                <select onChange={handleLevelSelect} value={selectedLevel || ""} className="p-2 h-14 text-xl font-semibold rounded-sm bg-homeGray w-1/2">
                  <option className="bg-white" value="">Select Level</option>
                  <option className="bg-white" value="ad">Ad</option>
                  <option className="bg-white" value="campaign">Campaign</option>
                  <option className="bg-white" value="ad_set">Ad set</option>
                </select>
              </div>
              <div>
                <button type="submit" onClick={handleSubmit} className="bg-homeGray w-40 h-14 text-lg font-semibold mx-[43%] border-[#B5B5B5]">Submit</button>
              </div>
            </div></div>
        </Dialog>
      </div>
    </div>
  );
};

export default SuccessPage;
// {
//   "start_date": "2024-08-01",
//   "end_date": "2024-08-07",
//   "access_token": "EAAM6NwrhHZCkBOxnKpw08VdIj03rec8825jNNwgdpCiYbWn3EDDhA4EWTXj8ZA5suXaqgMNXfj1S4fUZCRHJCUXfubMMHsXW7oCWmNZA82ws4n20lJaR4aezZCvhFYSvBX5NpKUQHoD9BxDJSvw25ZAZAXdWAZBdxZAI29rtJRrxwx1qxPMPiSZAkL9fdhWjWM47IS9jTysCwyKkUdfQhEMfMmjQt0qugxZAI8dm1EGsTbs3E0ZAwTOwmspZB",
//   "ad_account_id": "act_10202988080401134",
//   "level": "ad",
//   "table_name": "Facebook_Data.sss1"
// }