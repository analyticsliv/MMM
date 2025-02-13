"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import CustomDatepicker from "@/components/DatePicker/Datepicker";
import { useUser } from "@/app/context/UserContext";
import { useSearchParams } from "next/navigation";
import useToast from "@/components/hooks/toast";
import { ToastContainer } from "react-toastify";
import { format } from 'date-fns';
import { reportOptions } from "@/utils/const";
import useDv360Advertisers from "@/components/hooks/connectors/dv360Advertiser";
import { createJobId } from "@/utils/helper";
import useDv360Connector from "@/components/hooks/connectors/useDv360Connector";

interface SuccessModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    onSubmitSuccess: (message: string) => void;
    setLoadingScreen: (loading: boolean) => void;
    setStatusCheck: (loading: boolean) => void;
    accessToken: string | null;
    refreshToken : string | null
}

const Page: React.FC<SuccessModalProps> = ({ isModalOpen, closeModal, onSubmitSuccess, setLoadingScreen, setStatusCheck, accessToken,refreshToken }) => {
    const [selectedAdvertiser, setSelectedAdvertiser] = useState<string | null>(null);
    const [selectedReport, setSelectedReport] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const searchParams = useSearchParams();
    const { dv360Connector } = useDv360Connector();
    
    const user = JSON.parse(localStorage.getItem('userSession') || '{}')?.user;
    const jobId = createJobId('dv360', user?.email);

    const handleOutsideClick = (event:any) => {
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
        advertisers,
        loading: advertiserLoading,
        error: advertiserError,
    } = useDv360Advertisers(accessToken);

    const handleAdvertiserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAdvertiser(event.target.value);
    };


    const handleReportChange = (event) => {
        const { value, checked } = event.target;
        setSelectedReport(prevSelectedReports =>
            checked
                ? [...prevSelectedReports, value]
                : prevSelectedReports.filter(report => report !== value)
        );
    };

   
    const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
        startDate: null,
        endDate: null
    });
    const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
        setDateRange({ startDate, endDate });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formattedStartDate = dateRange.startDate ? format(dateRange.startDate, 'yyyy-MM-dd') : null;
        const formattedEndDate = dateRange.endDate ? format(dateRange.endDate, 'yyyy-MM-dd') : null;

        if (!formattedStartDate || !formattedEndDate) {
            notify('Please select Date Range!', 'error');
            return;
        }
        if (!selectedAdvertiser) {
            notify('Please select an Advertiser first!', 'error');
            return;
        }
       
        if (selectedReport?.length === 0) {
            notify('Please select at least one report!', 'error');
            return;
        }
        const data = {
            refresh_token: refreshToken || "N/A",
            project_id: "dx-api-project",
            dataset_name: "trial_data",
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            reports_list: selectedReport,
            jobId: jobId,
            email: user?.email
        };

        try {
            setLoadingScreen(true);
            closeModal();

            const response = await dv360Connector(data);

            setSelectedAdvertiser(null);
            setSelectedReport([]);
            if (response.success) {
                onSubmitSuccess('DV360 Connector Successful!');
            } else {
                onSubmitSuccess('DV360 Connector Failed!');
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
                                <Dialog.Title className=" flex justify-center items-center absolute gap-4 top-[-37px] left-[40%] rounded-[10px] shadow-xl text-2xl text-[#010101] bg-white font-bold text-center px-8 py-3 mb-4 mx-auto">
                                    <img src="/assets/dv360_logo (1).png" alt="dv360" />
                                    <div>Display &<br></br>Video 360 </div>
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
                                        onChange={handleAdvertiserChange}
                                        value={selectedAdvertiser || ""}
                                        className="p-2 h-14 text-xl font-semibold cursor-pointer text-black bg-white border border-black px-4 w-[50%] rounded-[5px]"
                                        disabled={advertiserLoading}
                                        required
                                    >
                                        {advertiserLoading ? (
                                            <option>Loading...</option>
                                        ) : (
                                            <>
                                                <option value="" disabled>Select an Advertiser</option>
                                                {advertisers?.map((advertiser, index) => (
                                                    <option key={index} className="bg-white" value={advertiser?.id}>
                                                        {advertiser?.displayName}
                                                    </option>
                                                ))}
                                            </>
                                        )}
                                    </select>

                                    <div className="relative w-[50%]" ref={dropdownRef}>
                                        <button
                                            onClick={() => setDropdownVisible(!dropdownVisible)}
                                            className={`p-2 h-14 text-xl font-semibold cursor-pointer flex items-center justify-between text-black bg-white border border-black px-4 rounded-[5px] w-full ${selectedReport?.length > 0}`}
                                        >
                                            Select Reports
                                            <span className="relative ml-2">
                                                {selectedReport?.length > 0 && (
                                                    <span className="bg-primary text-white px-2 py-1 rounded-full absolute left-0 transform translate-y-[-50%]">
                                                        {selectedReport?.length}
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
                                                            checked={selectedReport?.includes(key)}
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
                                    <img src="/assets/dv360_man.png" alt="dv360_man" className="h-full" />
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