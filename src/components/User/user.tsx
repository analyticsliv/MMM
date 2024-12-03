import React from 'react'
import { useSession } from "next-auth/react";

const User = () => {
    const { data: session, status } = useSession();

    return (
        <div className="flex gap-5 p-5 pl-8 xl:pl-12">
            <div className="border rounded-[5px] p-2 border-[#E5E5E5]">
                <img src="/assets/Analyticsliv_logo_Vertical_100X100_px 1.png" className='h-full w-full' alt="logo" />
            </div>
            <div className="flex flex-col justify-center gap-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Hello, {session?.user?.name}</h2>

                </div>
                <div className="text-sm font-semibold text-[#797979]">
                    AnalyticsLiv Digital LLP
                </div>
            </div>
        </div>
    )
}

export default User;
