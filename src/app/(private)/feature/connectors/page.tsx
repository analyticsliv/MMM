// /feature/[subpage]/page.tsx
"use client";

import Link from "next/link";
import React from "react";
// import { generateAuthUrl } from '@/lib/ga4Auth';

const Subpage1 = () => {
  //  const authUrl = generateAuthUrl();

  return (
    <>
      <div className="flex flex-col gap-2 text-gray-700 ">
        <Link href={'/feature/connectors/ga4Connector'} className="hover:text-gray-950">
          Ga4 connector
        </Link>
        <Link href={'/feature/connectors/facebookConnector'} className="hover:text-gray-950">
          Facebook connector
        </Link>
      </div>
    </>
  );
};

export default Subpage1;
