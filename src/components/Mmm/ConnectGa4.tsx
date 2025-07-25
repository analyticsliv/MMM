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
    innerRef?: React.RefObject<HTMLDivElement>;
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
        const startDate = new Date(today.setDate(today.getDate() - 725));

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
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
            reports_list: ["GA_MMM_data"],
            jobId: jobId,
            email: user?.email,
            unique_ada_id: createGa4UniqueId
        };

        try {
            setLoadingGa4(true);
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

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <ToastContainer />
            <div 
                ref={innerRef} 
                id="ga4-connector" 
                className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 m-4 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-2xl">GA</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">
                                Connect Google Analytics 4
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Link your GA4 account for enhanced analytics insights
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={closeModal}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Connection Steps Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-4">
                        <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                selectedAccount ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                            }`}>
                                {selectedAccount ? '✓' : '1'}
                            </div>
                            <span className="ml-2 text-sm font-medium">Select Account</span>
                        </div>
                        <div className={`w-8 h-0.5 ${selectedAccount ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                selectedProperty ? 'bg-green-500 text-white' : selectedAccount ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
                            }`}>
                                {selectedProperty ? '✓' : '2'}
                            </div>
                            <span className="ml-2 text-sm font-medium">Select Property</span>
                        </div>
                        <div className={`w-8 h-0.5 ${selectedProperty ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                selectedProperty ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
                            }`}>
                                3
                            </div>
                            <span className="ml-2 text-sm font-medium">Connect</span>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="space-y-6">
                    {/* Account Selection */}
                    <div className="space-y-3">
                        <label className="block text-lg font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                            Select Your GA4 Account
                        </label>
                        <div className="relative">
                            <select
                                onChange={handleAccountChange}
                                value={selectedAccount || ""}
                                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl bg-white hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none cursor-pointer"
                                disabled={accountsLoading}
                                required
                            >
                                {accountsLoading ? (
                                    <option>🔄 Loading accounts...</option>
                                ) : (
                                    <>
                                        <option value="" disabled>
                                            📊 Choose your GA4 account
                                        </option>
                                        {accountSummaries.map((account, index) => (
                                            <option key={index} value={account.name}>
                                                🏢 {account.displayName}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {accountsError && (
                            <p className="text-red-600 text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Error loading accounts
                            </p>
                        )}
                    </div>

                    {/* Property Selection */}
                    <div className="space-y-3">
                        <label className="block text-lg font-semibold text-gray-700 flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                                selectedAccount ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                            }`}>2</span>
                            Select Your Property
                        </label>
                        <div className="relative">
                            <select
                                onChange={handlePropertyChange}
                                value={selectedProperty || ""}
                                className={`w-full p-4 text-lg border-2 rounded-xl bg-white transition-all duration-200 appearance-none ${
                                    !selectedAccount 
                                        ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                                        : 'border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 cursor-pointer'
                                }`}
                                disabled={!selectedAccount}
                                required
                            >
                                <option value="" disabled>
                                    {!selectedAccount ? '⚠️ Select an account first' : '🏠 Choose your property'}
                                </option>
                                {properties.map((property, index) => (
                                    <option key={property.property} value={propertyIds[index]}>
                                        📈 {property.displayName}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                {propertiesLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                ) : (
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        {propertiesError && (
                            <p className="text-red-600 text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Error loading properties
                            </p>
                        )}
                    </div>

                    {/* Report Type (Fixed) */}
                    <div className="space-y-3">
                        <label className="block text-lg font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-6 h-6 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">📊</span>
                            Report Type
                            <span className="text-sm text-gray-500 font-normal">(Pre-configured)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value="📈 GA_MMM_data"
                                disabled
                                className="w-full p-4 text-lg text-gray-600 bg-gray-50 border-2 border-gray-200 rounded-xl cursor-not-allowed"
                                title="This report type is fixed for Marketing Mix Modeling"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            This report type is optimized for Marketing Mix Modeling analysis
                        </p>
                    </div>

                    {/* Data Range Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-blue-800 mb-1">Data Collection Period</h4>
                                <p className="text-blue-700 text-sm">
                                    We'll collect data from the last 2 years (725 days) ending 2 days ago to ensure complete data availability.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button 
                            type="submit" 
                            onClick={handleSubmit}
                            disabled={!selectedAccount || !selectedProperty || loadingGa4}
                            className={`w-full py-4 text-xl font-bold rounded-xl transition-all duration-300 transform ${
                                loadingGa4
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                    : !selectedAccount || !selectedProperty
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                            }`}
                        >
                            {loadingGa4 ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                                    Connecting to GA4...
                                </div>
                            ) : !selectedAccount || !selectedProperty ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    Complete Selection Required
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Connect GA4 Account
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Help Section */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-1">Need Help?</h4>
                                <p className="text-gray-600 text-sm">
                                    Make sure you have the appropriate permissions for the GA4 account and property you're trying to connect.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConnectGa4;