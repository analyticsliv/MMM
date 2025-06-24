"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import useConnector from '@/components/hooks/connectors/useConnectors';
import useUserSession from '@/components/hooks/useUserSession';
import { useMMMStore } from "@/store/useMMMStore";

const MMMSelectionPage = () => {
    const { getConnectorData, error } = useConnector();
    // const [reportLevel, setReportLevel] = useState<'campaign' | 'channel' | null>('campaign');
    // const [platform, setPlatform] = useState<'google-ads' | 'dv360' | null>(null);
    // const [isAuthorize, setIsAuthorize] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user, setUser } = useUserSession();
    const {
        platform,
        setPlatform,
        reportLevel,
        setReportLevel,
        setGoogleAdsRefreshToken,
        setDv360RefreshToken,
    } = useMMMStore()

    const handleContinue = async () => {
        if (!user?.email || !platform || !reportLevel) return;

        setLoading(true);
        const connectorKey = platform === 'google-ads' ? 'googleAds' : 'dv360';
        const authUrlEndpoint = platform === 'google-ads'
            ? '/api/googleAds-auth-url'
            : '/api/dv360-auth-url';

        try {
            const authStatus = await getConnectorData(connectorKey, user?.email);
            // setIsAuthorize(authStatus)

            if (authStatus && authStatus.refreshToken) {
                if (platform === 'google-ads') {
                    setGoogleAdsRefreshToken(authStatus.refreshToken); // ✅ Google Ads token
                } else if (platform === 'dv360') {
                    setDv360RefreshToken(authStatus.refreshToken); // ✅ DV360 token
                } // ✅ store it in Zustand
                router.push(`/feature/mmm/${reportLevel}/${platform}`);
            } else {
                const res = await fetch(authUrlEndpoint);
                const data = await res.json();
                if (data.authUrl) {
                    router.push(data.authUrl);
                }
            }
        } catch (error) {
            console.error('Error during authorization check:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4ff] to-[#e8eaf6] p-6">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full space-y-8">
                <h1 className="text-3xl font-bold text-center text-gray-800">Explore MMM Report</h1>

                {/* Report Level Selection */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Select Report Level</h2>
                    <div className="flex space-x-4">
                        {['campaign', 'channel']?.map((level) => {
                            const isDisabled = level === 'channel';

                            return (
                                <label
                                    key={level}
                                    className={`border rounded-lg px-4 py-3 flex-1 text-center text-lg capitalize transition-all
                                    ${reportLevel === level && !isDisabled ? 'bg-blue-600 text-white' : 'bg-gray-100'}
                                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                    `}
                                    title={isDisabled ? 'Coming soon' : ''}
                                >
                                    <input
                                        type="radio"
                                        name="reportLevel"
                                        value={level}
                                        checked={reportLevel === level}
                                        onChange={() => {
                                            if (!isDisabled) setReportLevel(level as 'campaign' | 'channel');
                                        }}
                                        className="hidden"
                                        disabled={isDisabled}
                                    />
                                    {level}
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Platform Selection */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Select Platform</h2>
                    <div className="flex space-x-6 justify-center mt-4">
                        {/* Google Ads */}
                        <div
                            onClick={() => setPlatform('google-ads')}
                            className={`cursor-pointer min-w-[100px] border-2 rounded-xl px-6 py-5 flex flex-col items-center justify-center transition-transform transform hover:scale-105 shadow-sm 
                        ${platform === 'google-ads' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
                        >
                            <Image
                                src="/assets/Google Ads logo.png"
                                alt="Google Ads"
                                width={20}
                                height={20}
                                className="mb-3"
                            />
                            <span className="text-sm font-medium text-gray-800">Google Ads</span>
                        </div>

                        {/* DV360 */}
                        <div
                            onClick={() => setPlatform('dv360')}
                            className={`cursor-pointer min-w-[100px] border-2 rounded-xl px-6 py-5 flex flex-col items-center justify-center transition-transform transform hover:scale-105 shadow-sm 
                            ${platform === 'dv360' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
                        >
                            <Image
                                src="/assets/dv360_logo (2).png"
                                alt="DV360"
                                width={20}
                                height={20}
                                className="mb-3"
                            />
                            <span className="text-sm font-medium text-gray-800">DV360</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleContinue}
                    disabled={!platform || !reportLevel || loading}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50"
                >
                    {loading ? 'Checking authorization...' : 'Continue'}
                </button>

            </div>
        </div>
    );
};

export default MMMSelectionPage;


// <div className="flex space-x-4">
//     {['campaign', 'channel']?.map((level) => (
//         <label key={level} className={`cursor-pointer border rounded-lg px-4 py-3 flex-1 text-center text-lg capitalize transition-all ${reportLevel === level ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
//             <input
//                 type="radio"
//                 name="reportLevel"
//                 value={level}
//                 checked={reportLevel === level}
//                 onChange={() => setReportLevel(level as 'campaign' | 'channel')}
//                 className="hidden"
//             />
//             {level}
//         </label>
//     ))}
// </div>