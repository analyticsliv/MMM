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
    accessToken: string | null;
}
const Page: React.FC<SuccessModalProps> = ({ isModalOpen, closeModal, onSubmitSuccess, setLoadingScreen, accessToken }) => {
    const { data: session, status } = useSession();
    const { fbDetails } = useFbDetails();
    // const { updateOrCreateConnector, getConnectorData, error, loading } = useConnector()
    // const searchParams = useSearchParams();
    // const accessToken = searchParams.get('accessToken');
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
                        <div className="bg-white p-6 flex relative flex-col justify-between rounded-lg shadow-lg w-[650px] h-[340px] 2xl:w-[700px] 2xl:h-[340px]">
                            <div className="flex items-center">
                                <Dialog.Title className=" flex justify-center items-center absolute gap-4 top-[-37px] left-[40%] rounded-[10px] shadow-xl text-2xl text-[#010101] bg-white font-bold text-center px-8 py-3 mb-4 mx-auto">
                                    <img src="/assets/meta_logo.png" alt="Facebook" />
                                    <div>Facebook </div>
                                </Dialog.Title>
                                <button onClick={closeModal} className="mb-10">
                                    <img src="/assets/close_icon.png" alt="Close" className="h-8 w-8 absolute right-10 rounded-full"
                                        onMouseOver={(e) => (e.currentTarget.src = '/assets/cross_hover.png')}
                                        onMouseOut={(e) => (e.currentTarget.src = '/assets/close_icon.png')}
                                    />
                                </button>
                            </div>
                            <div className="flex flex-col h-full gap-14 py-10">
                                <div className="flex gap-4 justify-between">
                                    <select onChange={handleAccountSelect} value={selectedAccount || ""} className="p-2 h-14 text-xl font-semibold cursor-pointer text-black bg-white border border-black px-4 w-[50%] rounded-[5px]">
                                        <option value="">Select Account</option>
                                        {accounts?.map((account) => (
                                            <option key={account.id} value={account.id} className="bg-white">
                                                {account.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select onChange={handleLevelSelect} value={selectedLevel || ""} className="p-2 h-14 text-xl font-semibold cursor-pointer text-black bg-white border border-black px-4 w-[50%] rounded-[5px]">
                                        <option className="bg-white" value="">Select Level</option>
                                        <option className="bg-white" value="ad">Ad</option>
                                        <option className="bg-white" value="campaign">Campaign</option>
                                        <option className="bg-white" value="ad_set">Ad set</option>
                                    </select>
                                </div>
                                <div className="flex justify-between pb-10 2xl:pb-0">
                                    <div className="flex flex-col pt-16 pb-2 justify-between w-[60%]">
                                        <CustomDatepicker onDateRangeChange={handleDateRangeChange} />
                                        <div>
                                            <button type="submit" onClick={handleSubmit} className="bg-primary hover:bg-[#253955] text-white w-full h-14 text-xl rounded-[10px] font-bold border-[#B5B5B5]">SUBMIT</button>
                                        </div>
                                    </div>
                                    <img src="/assets/Image_for_Meta.png" alt="meta_man" className="h-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default Page;