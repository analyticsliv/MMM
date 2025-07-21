"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import useConnector from '@/components/hooks/connectors/useConnectors';
import useUserSession from '@/components/hooks/useUserSession';
import { useMMMStore } from "@/store/useMMMStore";

const MMMSelectionPage = () => {
    const { getConnectorData, error } = useConnector();
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

            if (authStatus && authStatus.refreshToken) {
                if (platform === 'google-ads') {
                    setGoogleAdsRefreshToken(authStatus.refreshToken);
                } else if (platform === 'dv360') {
                    setDv360RefreshToken(authStatus.refreshToken);
                }
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

    const isFormValid = platform && reportLevel;

    return (
        <div className="max-h-[100dvh] min-h-[100dvh] overflow-y-scroll flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 max-w-4xl 2xl:max-w-5xl w-full space-y-6 2xl:space-y-8">

                {/* Header Section */}
                <div className="text-center space-y-1 2xl:space-y-2">
                    <div className="w-14 2xl:w-20 h-14 2xl:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                        <span className="text-white font-bold text-2xl">📊</span>
                    </div>
                    <h1 className="text-2xl 2xl:text-4xl font-bold leading-[45px] bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Marketing Mix Modeling
                    </h1>
                    <p className="text-gray-600 text-sm 2xl:text-lg max-w-md mx-auto">
                        Analyze your marketing performance with advanced attribution modeling
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center space-x-4 mb-8">
                    <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${reportLevel ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                            }`}>
                            {reportLevel ? '✓' : '1'}
                        </div>
                        <span className="ml-2 text-sm font-medium">Report Level</span>
                    </div>
                    <div className={`w-8 h-0.5 transition-all duration-300 ${reportLevel ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${platform ? 'bg-green-500 text-white' : reportLevel ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
                            }`}>
                            {platform ? '✓' : '2'}
                        </div>
                        <span className="ml-2 text-sm font-medium">Platform</span>
                    </div>
                    <div className={`w-8 h-0.5 transition-all duration-300 ${platform ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${isFormValid ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
                            }`}>
                            3
                        </div>
                        <span className="ml-2 text-sm font-medium">Connect</span>
                    </div>
                </div>

                {/* Report Level Selection */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-lg">📋</span>
                        </div>
                        <div>
                            <h2 className="text-xl 2xl:text-2xl font-bold text-gray-800">Select Report Level</h2>
                            <p className="text-gray-600 text-sm 2xl:text-base">Choose the granularity of your analysis</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {['campaign', 'channel'].map((level) => {
                            const isDisabled = level === 'channel';
                            const isSelected = reportLevel === level && !isDisabled;

                            return (
                                <label
                                    key={level}
                                    className={`relative border-2 rounded-xl px-6 py-4 2xl:py-6 text-center transition-all duration-300 transform hover:scale-105 cursor-pointer group ${isSelected
                                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                                        : isDisabled
                                            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed hover:scale-100'
                                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                                        }`}
                                    title={isDisabled ? 'Coming soon - Channel level analysis' : `Analyze at ${level} level`}
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
                                    <div className="space-y-2 2xl:space-y-3">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto transition-all duration-300 ${isSelected
                                            ? 'bg-blue-300 text-white'
                                            : isDisabled
                                                ? 'bg-gray-200 text-gray-400'
                                                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                                            }`}>
                                            {level === 'campaign' ? '🎯' : '📊'}
                                        </div>
                                        <div>
                                            <h3 className={`text-base 2xl:text-lg font-semibold capitalize ${isSelected ? 'text-blue-700' : isDisabled ? 'text-gray-700' : 'text-black'
                                                }`}>
                                                {level} Level
                                            </h3>
                                            <p className={`text-xs 2xl:text-sm ${isDisabled ? 'text-gray-700' : 'text-black'
                                                }`}>
                                                {level === 'campaign' ? 'Individual campaign analysis' : 'Channel-wide insights'}
                                            </p>
                                        </div>
                                        {isDisabled && (
                                            <div className="absolute top-2 right-2">
                                                <span className="bg-amber-100 text-amber-600 text-xs px-2 py-1 rounded-full font-medium">
                                                    Soon
                                                </span>
                                            </div>
                                        )}
                                        {isSelected && (
                                            <div className="absolute top-2 right-2">
                                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Platform Selection */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600 font-bold text-lg">🔗</span>
                        </div>
                        <div>
                            <h2 className="text-xl 2xl:text-2xl font-bold text-gray-800">Select Platform</h2>
                            <p className="text-gray-600 text-sm 2xl:text-base">Choose your advertising platform</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Google Ads */}
                        <div
                            onClick={() => setPlatform('google-ads')}
                            className={`relative border-2 rounded-xl px-6 py-4 2xl:py-6 flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105 cursor-pointer group ${platform === 'google-ads'
                                ? 'border-blue-500 bg-blue-50 shadow-lg'
                                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                                }`}
                        >
                            <div className="space-y-2 2xl:space-y-3 text-center">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto transition-all duration-300 ${platform === 'google-ads'
                                    ? 'bg-blue-200 shadow-lg'
                                    : 'bg-gray-100 group-hover:bg-blue-100'
                                    }`}>
                                    <Image
                                        src="/assets/Google Ads logo.png"
                                        alt="Google Ads"
                                        width={20}
                                        height={20}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className={`text-base 2xl:text-lg font-semibold ${platform === 'google-ads' ? 'text-blue-700' : 'text-gray-700'
                                        }`}>
                                        Google Ads
                                    </h3>
                                    <p className="text-xs 2xl:text-sm text-gray-600">
                                        Search, Display & Shopping campaigns
                                    </p>
                                </div>
                            </div>
                            {platform === 'google-ads' && (
                                <div className="absolute top-3 right-3">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* DV360 */}
                        <div
                            onClick={() => setPlatform('dv360')}
                            className={`relative border-2 rounded-xl px-6 py-4 2xl:py-6 flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105 cursor-pointer group ${platform === 'dv360'
                                ? 'border-purple-500 bg-purple-50 shadow-lg'
                                : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                                }`}
                        >
                            <div className="space-y-2 2xl:space-y-3 text-center">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto transition-all duration-300 ${platform === 'dv360'
                                    ? 'bg-purple-200 shadow-lg'
                                    : 'bg-gray-100 group-hover:bg-purple-100'
                                    }`}>
                                    <Image
                                        src="/assets/dv360_logo (2).png"
                                        alt="DV360"
                                        width={20}
                                        height={20}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className={`text-base 2xl:text-lg font-semibold ${platform === 'dv360' ? 'text-purple-700' : 'text-gray-700'
                                        }`}>
                                        Display & Video 360
                                    </h3>
                                    <p className="text-xs 2xl:text-sm text-gray-600">
                                        Programmatic display & video ads
                                    </p>
                                </div>
                            </div>
                            {platform === 'dv360' && (
                                <div className="absolute top-3 right-3">
                                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Features Overview */}
                {isFormValid && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                </svg>
                            </span>
                            What you'll get
                        </h3>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span className="text-gray-700">Attribution analysis</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span className="text-gray-700">ROI optimization</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span className="text-gray-700">Media mix insights</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span className="text-gray-700">Budget recommendations</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Continue Button */}
                <div className="">
                    <button
                        onClick={handleContinue}
                        disabled={!isFormValid || loading}
                        className={`w-full py-4 text-lg font-bold rounded-xl transition-all duration-300 transform ${loading
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : isFormValid
                                ? platform === 'google-ads'
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105'
                                    : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl hover:scale-105'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                                Checking Authorization...
                            </div>
                        ) : !isFormValid ? (
                            <div className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Complete Selection
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                                Continue to {platform === 'google-ads' ? 'Google Ads' : 'DV360'}
                            </div>
                        )}
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-red-800">Connection Error</h4>
                                <p className="text-red-700 text-sm">
                                    {error || 'Something went wrong. Please try again.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MMMSelectionPage;