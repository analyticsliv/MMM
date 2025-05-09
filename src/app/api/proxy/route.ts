import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    }
    async function getStatusDetail(jobId: string, status: string, email: string, connectorType: string) {
        try {
            const response = await fetch(`${process.env.BASE_API_URL}api/connectors/jobStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobId, status, email, connectorType }), // Sending jobId in the body
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

    const { url, body, headers, connectorType } = await req.json(); // Parse the JSON body to get the URL, body, and headers
    try {
        if (!url || !body) {
            return NextResponse.json({ message: 'URL and body are required' }, { status: 400 });
        }

        if (body?.jobId) {
            getStatusDetail(body?.jobId, "inProgress", body?.email, connectorType);
        }

        // Forward the request to the provided external API
        const externalResponse = await axios.post(url, body, {
            headers: headers || { 'Content-Type': 'application/json' }, // Use provided headers or default
        });

        getStatusDetail(body?.jobId, "success", body?.email, connectorType);

        // Send the external API response back to the client
        return NextResponse.json(externalResponse.data, { status: 200 });
    } catch (error) {
        getStatusDetail(body?.jobId, "failed", body?.email, connectorType);
        console.error('Error forwarding request:', error);
        return NextResponse.json({ message: 'Error communicating with external API', error: error.message }, { status: 500 });
    }
}
