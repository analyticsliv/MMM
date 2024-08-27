// src/pages/api/facebook-auth-url.js

import { generateFacebookAuthUrl } from '@/lib/facebookAuth';

export default function handler(req, res) {
  const authUrl = generateFacebookAuthUrl();
  res.status(200).json({ authUrl });
}
