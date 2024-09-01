// src/pages/api/auth/facebook-callback.js
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code not provided' }, { status: 400 });
  }

  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
  const redirectUri = 'https://127.0.0.1:3000/api/facebook-callback';

  try {
    const response = await fetch(
      `https://graph.facebook.com/v11.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error.message);
    }

    const { access_token: accessToken } = data;
    
    const successUrl = `http://127.0.0.1:3000/feature/connectors/facebookConnector/sucess?accessToken=${encodeURIComponent(accessToken)}`;
    return NextResponse.redirect(successUrl);


    // return NextResponse.json({ accessToken }, { status: 200 });
  } catch (error) {
    console.error('Error getting Facebook access token:',error);
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
  }
}

