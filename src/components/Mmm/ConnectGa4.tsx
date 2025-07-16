"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import useAccountSummaries from "@/components/hooks/connectors/ga4AccountList";
import useAccountProperties from "@/components/hooks/connectors/ga4PropertyList";
import useToast from "@/components/hooks/toast";
import { ToastContainer } from "react-toastify";
import useGa4Connector from "@/components/hooks/connectors/useGa4Connector";
import { createJobId, generateUniqueId } from "@/utils/helper";
import useUserSession from "../hooks/useUserSession";
import { useMMMStore } from "@/store/useMMMStore";

interface ConnectGa4Props {
    isModalOpen: boolean;
    closeModal: () => void;
    onSubmitSuccess: () => void;
    accessToken: string | null;
    refreshToken: string | null;
    innerRef?: React.RefObject<HTMLDivElement>; // ✅ Add this line
}

const ConnectGa4: React.FC<ConnectGa4Props> = ({
    isModalOpen,
    closeModal,
    onSubmitSuccess,
    accessToken,
    refreshToken,
    innerRef
}) => {
    const { ga4uniqueId, setGa4UniqueId } = useMMMStore();
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
    const [selectedReport, setSelectedReport] = React.useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [loadingGa4, setLoadingGa4] = useState(false);

    const dropdownRef = useRef(null);
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const { ga4Connector } = useGa4Connector();
    // const user = JSON.parse(localStorage.getItem('userSession') || '{}')?.user;
    const { user, setUser } = useUserSession();
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

    const {
        properties,
        propertyIds,
        loading: propertiesLoading,
        error: propertiesError,
    } = useAccountProperties(selectedAccount, accountSummaries, accessToken);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const today = new Date();
        const formatDate = (d) => d.toISOString().split("T")[0];
        const endDate = new Date(today.setDate(today.getDate() - 2));
        const startDate = new Date(today.setDate(today.getDate() - 730));

        if (!selectedAccount) {
            notify('Please select an account first!', 'error');
            return;
        }
        if (!selectedProperty) {
            notify('Please select a property first!', 'error');
            return;
        }
        const createGa4UniqueId = generateUniqueId(
            "GA4_MMM",
            `${user?.email}`,
            selectedProperty,
            "googleAds"
        );
        setGa4UniqueId(createGa4UniqueId);
        const data = {
            refresh_token: refreshToken || "N/A",
            property_id: selectedProperty,
            project_id: "dx-api-project",
            dataset_name: "GA4_Connector_Data",
            //   start_date: formattedStartDate,
            //   end_date: formattedEndDate,
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
            reports_list: ["GA_MMM_data"],
            jobId: jobId,
            email: user?.email,
            unique_ada_id: createGa4UniqueId
        };

        try {
            setLoadingGa4(true);

            console.log("ga4 uniq id",ga4uniqueId)

            const response = await ga4Connector(data);

            setSelectedProperty(null);
            setSelectedAccount(null);
            setSelectedReport([]);
            if (response.success) {
                onSubmitSuccess();
                closeModal();

            } else {
                onSubmitSuccess();
                closeModal();

            }
        } catch (error) {
            onSubmitSuccess();

        } finally {
            setLoadingGa4(false);
        }
    };

    return (
        <div className="">
            <ToastContainer />
            <div className="flex text-black z-50 items-center justify-center">
                {isModalOpen && (
                    <div ref={innerRef} id="ga4-connector" className="bg-white text-black z-50 shadow-lg rounded-xl p-6 mt-10">
                        <div className="text-center text-3xl font-bold">
                            Connect your ga4 account
                        </div>
                        <div className={` inset-0 flex items-center justify-center p-5 ${isModalOpen ? '' : 'hidden'}`}>
                            <div className="bg-white p-6 flex  flex-col justify-between w-[650px] h-[240px] 2xl:w-[700px] 2xl:h-[240px]">
                                <div className="flex items-center">
                                    <div className=" flex justify-center items-center  gap-4 top-[-32px] left-[44%] rounded-[10px] shadow-xl text-2xl text-[#010101] bg-white font-bold text-center px-8 py-6 mb-4 mx-auto">
                                        <img src="/assets/GA4_Logo.png" alt="dv360" /> <div>GA4</div>
                                    </div>
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

                                        <div className="w-1/3">
                                            {/* <label className="block text-lg font-medium text-gray-700 mb-2">
                                                    Report <span className="text-sm text-gray-500">(fixed)</span>
                                                </label> */}
                                            <input
                                                type="text"
                                                value="GA_MMM_data"
                                                disabled
                                                className="w-full h-14 px-4 text-xl font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-[5px] cursor-not-allowed"
                                                title="This report is fixed to GA_MMM_data"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <button type="submit" onClick={handleSubmit} 
                                        className={` text-white w-full h-14 text-xl rounded-[10px] font-bold border-[#B5B5B5]
                                        ${loadingGa4 ? 'cursor-not-allowed bg-gray-600' : 'cursor-pointer bg-primary hover:bg-[#253955]'}`}>
                                            {loadingGa4 ? 'Connecting...' : "SUBMIT"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)}
            </div >
        </div >
    );
};

export default ConnectGa4;