import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    }

    try {
        const { url, body, headers } = await req.json(); // Parse the JSON body to get the URL, body, and headers

        if (!url || !body) {
            return NextResponse.json({ message: 'URL and body are required' }, { status: 400 });
        }

        // Forward the request to the provided external API
        const externalResponse = await axios.post(url, body, {
            headers: headers || { 'Content-Type': 'application/json' }, // Use provided headers or default
        });

        // Send the external API response back to the client
        return NextResponse.json(externalResponse.data, { status: 200 });
    } catch (error) {
        console.error('Error forwarding request:', error);
        return NextResponse.json({ message: 'Error communicating with external API', error: error.message }, { status: 500 });
    }
}
