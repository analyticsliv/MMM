// src/pages/api/auth/facebook-callback.js

import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided' });
  }

  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
  const redirectUri = 'http://localhost:3000/api/auth/facebook-callback';

  try {
    const response = await axios.get('https://graph.facebook.com/v11.0/oauth/access_token', {
      params: {
        client_id: clientId,
        redirect_uri: redirectUri,
        client_secret: clientSecret,
        code,
      },
    });

    const { access_token: accessToken } = response.data;

    // Send the access token to the client or save it in a secure place
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Error getting Facebook access token:', error);
    res.status(500).json({ error: 'Failed to get access token' });
  }
}
