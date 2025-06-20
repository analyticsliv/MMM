'use client'

import useDv360Advertisers from '@/components/hooks/connectors/dv360Advertiser';
import useUserSession from '@/components/hooks/useUserSession';
import { useMMMStore } from '@/store/useMMMStore';
import { getDv360AccessTokenFromRefreshToken } from '@/utils/getAccessToken';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page: React.FC = () => {

    const { user } = useUserSession();

    const searchParams = useSearchParams();
    const [selectedAdvertiser, setSelectedAdvertiser] = useState<string | null>(null);

    const [accessToken, setAccessToken] = useState<string | null>(null);

    const {
        dv360RefreshToken
    } = useMMMStore()

    useEffect(() => {
        const fetchAccessToken = async () => {
            if (dv360RefreshToken && user && !accessToken) {
                const response = await getDv360AccessTokenFromRefreshToken(dv360RefreshToken);
                if (response) {
                    console.log("respop-", response);
                    setAccessToken(response);
                }
            }
        };
        if (dv360RefreshToken && user && !accessToken) {
            fetchAccessToken();
        }
    }, [dv360RefreshToken, user, accessToken]);

    useEffect(() => {
        console.log("🌀 useEffect triggered");
        console.log("🔑 dv360RefreshToken:", dv360RefreshToken);
        console.log("👤 user:", user);
        console.log("🔒 accessToken:", accessToken);
    }, [dv360RefreshToken, user, accessToken])

    const {
        advertisers,
        loading: advertiserLoading,
        error: advertiserError,
    } = useDv360Advertisers(accessToken);

    console.log("advertisers", advertisers)

    const handleAdvertiserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAdvertiserId = event.target.value;
        setSelectedAdvertiser(selectedAdvertiserId);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            advertiser_id: selectedAdvertiser,
            email: user?.email
        };
        console.log("data submit", data)
    }

    return (
        <div>
            <div className='flex flex-col gap-3'>
                <select
                    onChange={handleAdvertiserChange}
                    value={selectedAdvertiser || ""}
                    className="p-2 h-14 text-xl font-semibold cursor-pointer text-black bg-white border border-black px-4 w-[300px] rounded-[5px]"
                    disabled={advertiserLoading}
                    required
                >
                    {advertiserLoading ? (
                        <option>Loading...</option>
                    ) : (
                        <>
                            <option value="" disabled>Select Advertiser</option>
                            {advertisers?.map((advertiser, index) => (
                                <option key={index} className="bg-white" value={advertiser?.advertiserId}>
                                    {advertiser?.displayName}
                                </option>
                            ))}
                        </>
                    )}
                </select>
                <button type="submit" onClick={handleSubmit} className="bg-primary hover:bg-[#253955] text-white w-[150px] h-14 text-xl rounded-[10px] font-bold border-[#B5B5B5]">SUBMIT</button>
            </div>
        </div>
    )
}

export default Page
