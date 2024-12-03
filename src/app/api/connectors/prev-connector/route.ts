import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Connector from '@/models/Connector';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();

      const { email } = req.body;
      if (!email) return res.status(400).json({ message: 'Email is required' });

      const user = await User.findOne({ email }).populate('connectors');
      if (!user) return res.status(404).json({ message: 'User not found' });

      const connectors = user.connectors.map((connector) => ({
        connectorName: connector.googleAds ? 'Google Ads' :
          connector.ga4 ? 'GA4' :
            connector.facebook ? 'Facebook' :
              connector.dv360 ? 'DV360' :
                connector.linkedIn ? 'LinkedIn' : 'Unknown',
        status: 'Connected',
        dateTime: connector.createdAt,
      }));

      res.status(200).json({
        email: user.email,
        connectors,
      });
    } catch (error) {
      console.error('Error fetching user connectors:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}