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
import useFbDetails from '@/components/hooks/connectors/useFbDetails';
import { createJobId } from '@/utils/helper';
import { useUser } from '@/app/context/UserContext';
import useUserSession from '@/components/hooks/useUserSession';

interface SuccessModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    onSubmitSuccess: (message: string) => void;
    setLoadingScreen: (loading: boolean) => void;

}
const Page: React.FC<SuccessModalProps> = ({ isModalOpen, closeModal, onSubmitSuccess, setLoadingScreen }) => {
    const { data: session, status } = useSession();
    const { fbDetails } = useFbDetails();
    const { updateOrCreateConnector, getConnectorData, error, loading } = useConnector()
    const searchParams = useSearchParams();
    const accessToken = searchParams.get('accessToken');
    const [accounts, setAccounts] = useState<any[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

    const notify = useToast();

    const { user, setUser } = useUserSession();
    const [jobId, setJobId] = useState(String)


    useEffect(() => {
        if (user) {
            setJobId(createJobId('facebook', user?.email));
        }
    }, [user])

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

            updateOrCreateConnector(user?.email, 'facebook', connectorData);
        }
    }, [accessToken, session, status])


    const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
        startDate: null,
        endDate: null
    });
    const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
        setDateRange({ startDate, endDate });
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
    };

    const handleLevelSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const Level = event.target.value;
        setSelectedLevel(Level);
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
            ad_account_id: selectedAccount,
            jobId: jobId
        }

        try {
            setLoadingScreen(true);
            closeModal();

            const response = await fbDetails(data);

            setSelectedLevel(null);
            setSelectedAccount(null);
            if (response.success) {
                onSubmitSuccess('Facebook Connector Successful!');
            } else {
                onSubmitSuccess('Facebook Connector Failed!');
            }
        } catch (error) {
            onSubmitSuccess('An error occurred!');
        } finally {
            setLoadingScreen(false);
        }
    }
    return (
        <div>
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
                            <button type="submit" onClick={handleSubmit} className="bg-homeGray hover:bg-gray-500 w-40 h-14 text-xl font-bold mx-[43%] border-[#B5B5B5]">Submit</button>
                            {/* <button type="submit" onClick={handleSubmit} className="bg-homeGray hover:bg-gray-500 w-40 h-14 text-xl font-bold mx-[43%] border-[#B5B5B5]">
                                {submitLoading ? (<div className="flex justify-center items-center">
                                    <div className="w-6 h-6 border-4 border-t-transparent border-red-400 rounded-full animate-spin"></div>
                                </div>) : (<span>Submit</span>)}
                            </button> */}
                        </div></div>
                </Dialog>
            </div>
        </div>
    );
};

export default Page;


//     try {
//         const response = await fbDetails(data);  // Get fbDetails API response

//         // Assuming fbDetails returns an object with a success message or status
//         if (response?.status) {
//             onSubmitSuccess('Facebook Connector Successful!'); // Pass success message to parent
//         } else {
//             onSubmitSuccess('Facebook Connector Failed!'); // Pass error message to parent
//         }
//     } catch (error) {
//         onSubmitSuccess('An error occurred!');  // Handle API error
//     }
//     await fbDetails(data)
//     closeModal();
//     setSubmitLoading(false);
//     setSelectedLevel(null);
//     setSelectedAccount(null);