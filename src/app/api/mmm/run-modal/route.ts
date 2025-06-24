// src/app/api/mmm/run-modal/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const EXTERNAL_API_URL = 'https://meridian-mmm-ga-135392845747.us-central1.run.app/run-model'; // update if different

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("Incoming body from frontend:", body); // ✅ LOG INPUT

        const response = await axios.post(EXTERNAL_API_URL, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error: any) {
        console.error('API /run-modal Error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });

        return NextResponse.json(
            {
                error: 'Failed to run modal',
                details: error.message,
                response: error.response?.data,
            },
            { status: 500 }
        );
    }
}



// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();

//         const response = await axios.post(EXTERNAL_API_URL, body, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         return NextResponse.json(response.data, { status: 200 });
//     } catch (error: any) {
//         console.error('API /run-modal Error:', error.message, error.response?.data || '');
//         return NextResponse.json(
//             { error: 'Failed to run modal', details: error.message },
//             { status: 500 }
//         );
//     }
// }
