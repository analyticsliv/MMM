// /feature/[subpage]/page.tsx
"use client";

import SearchBar from "@/components/searchbar/search";
import User from "@/components/User/user";
import Link from "next/link";
import React from "react";
// import { generateAuthUrl } from '@/lib/ga4Auth';

const Connectors = () => {
  //  const authUrl = generateAuthUrl();
  const connectors = [
    { label: "Google Analytics 4", path: "/feature/connectors/ga4Connector", img: "/assets/GA4_Logo.png" },
    { label: "Google Ads", path: "/feature/connectors/googleAdsConnector", img: "/assets/Google Ads logo.png" },
    { label: "Facebook Ads", path: "/feature/connectors/facebookConnector", img: "/assets/meta_logo.png" },
    { label: "Display & Video 360", path: "/feature/connectors/dv360Connector", img: "/assets/dv360_logo (2).png" },
    { label: "LinkedIn Ads", path: "/feature/connectors/linkedInConnector", img: "/assets/linkedin_Logo.png" },
    { label: "Custom Connector", path: "/feature/connectors/CustomConnector", img: "/assets/custom_connector.png" },
  ];
  return (
    <>
      <div className="w-full flex items-center pl-8 xl:pl-12 h-[50px] xl:h-[70px] bg-[#F6F8FE]">
        <SearchBar />
      </div>
      <div className="flex justify-between items-center max-w-[97%] xl:w-[97%] 2xl:w-[97%]">
        <User />
        <div>
          <a href="/feature/connectors/previousConnector" className="px-5 py-3 bg-gray-800 hover:bg-white hover:text-gray-800 transition-all duration-300 border border-gray-900 text-lg font-semibold text-white rounded-[10px]">Previous Connectors</a>
        </div>
      </div>
      <div className="flex flex-col justify-around h-[220px] xl:h-[250px] ml-8 pl-8 xl:ml-12 xl:pl-10 py-5 rounded-[15px] max-w-[95%] xl:w-[94.6%] 2xl:w-[97%] bg-homeGray gap-2 text-gray-700 ">
        <SearchBar />
        <div className="text-[#000000] text-2xl font-bold">
          Connectors Available
        </div>
        <div className="flex justify-between gap-4 pr-10 items-center">
          {connectors?.map((connector, index) => {
            const isDisabled = index > 3;

            return (
              <Link key={index}
                className={`max-w-[125px] 2xl:max-w-[135px] px-5 rounded-[10px] h-32 py-8 overflow-hidden gap-5 flex justify-center items-center p-4 2xl:p-5 text-center bg-white hover:text-gray-950 ${isDisabled ? "cursor-not-allowed opacity-50" : ""
                  }`}
                href={isDisabled ? "#" : connector.path}
              >
                <img src={connector?.img} alt={connector.img} />
                <div className="text-left text-base 2xl:text-xl font-semibold text-[#010101]">{connector.label}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Connectors;