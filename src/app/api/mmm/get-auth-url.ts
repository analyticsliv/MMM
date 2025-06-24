import { NextApiRequest, NextApiResponse } from 'next';
import { getGoogleAdsAuthUrl, getDV360AuthUrl } from '@/utils/authUtils'; // or wherever you manage OAuth logic

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { platform } = req.query;

  if (!platform) {
    return res.status(400).json({ error: 'Platform is required' });
  }

  try {
    let authUrl = '';

    if (platform === 'google-ads') {
      authUrl = await getGoogleAdsAuthUrl();
    } else if (platform === 'dv360') {
      authUrl = await getDV360AuthUrl();
    } else {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    return res.status(200).json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
