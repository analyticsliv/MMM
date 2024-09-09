// /feature/[subpage]/page.tsx
"use client";

import SearchBar from "@/components/searchbar/search";
import User from "@/components/User/user";
import Link from "next/link";
import React from "react";
// import { generateAuthUrl } from '@/lib/ga4Auth';

const Subpage1 = () => {
  //  const authUrl = generateAuthUrl();
  const connectors = [
    { label: "GA4", path: "/feature/connectors/ga4Connector" },
    { label: "Facebook", path: "/feature/connectors/facebookConnector" },
    { label: "Google Ads", path: "/feature/connectors/GoogleAds" },
    { label: "LinkedIn", path: "/feature/connectors/LinkedIn" },
    { label: "DV360", path: "/feature/connectors/dv360" },
    { label: "Custom", path: "/feature/connectors/Custom" },
  ];
  return (
    <>
      <div className="w-full flex items-center pl-8 xl:pl-20 h-[50px] xl:h-[70px] bg-[#F6F8FE]">
        <SearchBar />
      </div>
      <User />
      <div className="flex flex-col justify-around h-[220px] xl:h-[250px] ml-8 pl-8 xl:ml-20 xl:pl-20 py-5 rounded-[15px] max-w-[95%] xl:w-[70%] bg-homeGray gap-2 text-gray-700 ">
        <SearchBar />
        <div className="text-[#000000] text-2xl font-bold">
          Connectors Available
        </div>
        <div className="grid grid-cols-3 gap-6 xl:gap-12 items-center">
          {connectors.map((connector, index) => {
            const isDisabled = index > 1;

            return (
              <Link
                className={`w-64 p-5 text-center text-lg font-semibold text-[#010101] bg-white hover:text-gray-950 ${
                  isDisabled ? "pointer-events-none opacity-50" : ""
                }`}
                // className="w-64 p-5 text-center text-lg font-semibold text-[#010101] bg-white hover:text-gray-950"
                href={isDisabled ? "#" : connector.path}
              >
                {connector.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Subpage1;
// {/* <Link href={'/feature/connectors/ga4Connector'} className="hover:text-gray-950">
//   Ga4 connector
// </Link>
// <Link href={'/feature/connectors/facebookConnector'} className="hover:text-gray-950">
//   Facebook connector
// </Link> */}