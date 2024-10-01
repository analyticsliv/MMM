import { NextResponse } from 'next/server';

// The `POST` method is used to handle the request, since you're handling `POST` requests for token refresh
export async function POST(request: Request) {
    try {
        // Read the request body
        const { refresh_token } = await request.json();
console.log("check ref token object",refresh_token)
        if (!refresh_token) {
            return NextResponse.json({ error: 'Refresh token is required' }, { status: 400 });
        }

        // Fetch a new access token using the refresh token
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.DV360_CLIENT_ID || '',
                client_secret: process.env.DV360_CLIENT_SECTRET || '',
                refresh_token: refresh_token,
                grant_type: 'refresh_token',
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to refresh token');
        }

        // Respond with the new access token
        return NextResponse.json({
            access_token: data.access_token,
        });
    } catch (error) {
        console.error('Error refreshing token:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
