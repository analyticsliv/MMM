import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    }
    async function getStatusDetail(jobId: string, status: string) {
        try {
            const response = await fetch('/api/connectors/jobStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobId, status }), // Sending jobId in the body
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // const data = await response.json();
            // setJobData(data); // Store jobId in state
            // console.log("API response:", data);
            console.log("API response status:", status); // Log the status for debugging
        } catch (error) {
            console.error('Error fetching auth URL:', error);
        }
    }

    const { url, body, headers } = await req.json(); // Parse the JSON body to get the URL, body, and headers
    try {

        if (!url || !body) {
            return NextResponse.json({ message: 'URL and body are required' }, { status: 400 });
        }

        if (body?.jobId) {
            getStatusDetail(body?.jobId, "inProgress");
        }

        // Forward the request to the provided external API
        const externalResponse = await axios.post(url, body, {
            headers: headers || { 'Content-Type': 'application/json' }, // Use provided headers or default
        });

        getStatusDetail(body?.jobId, "completed");

        // Send the external API response back to the client
        return NextResponse.json(externalResponse.data, { status: 200 });
    } catch (error) {
        getStatusDetail(body?.jobId, "failed");
        console.error('Error forwarding request:', error);
        return NextResponse.json({ message: 'Error communicating with external API', error: error.message }, { status: 500 });
    }
}
