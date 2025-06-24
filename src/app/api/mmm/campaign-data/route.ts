import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const EXTERNAL_API_URL = 'https://meridian-mmm-ga-135392845747.us-central1.run.app/campaign-data';

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json(); // ✅ get the JSON body

        const clientId = payload?.client_id;

        if (!clientId) {
            return NextResponse.json({ error: 'Missing client_id' }, { status: 400 });
        }

        const response = await axios.post(EXTERNAL_API_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error: any) {
        console.error('Campaign fetch error:', error?.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
