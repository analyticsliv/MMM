// /feature/[subpage]/page.tsx
"use client";

import Link from "next/link";
import React from "react";
// import { generateAuthUrl } from '@/lib/ga4Auth';

const Subpage2 = () => {
    //  const authUrl = generateAuthUrl();

    return (
        <>
            <div>
                <Link href={'/feature/connectors/ga4Connector'}>
                    Facebook connector
                </Link>
            </div>
        </>
    );
};

export default Subpage2;