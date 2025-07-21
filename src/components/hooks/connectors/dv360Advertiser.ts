import { useMMMStore } from '@/store/useMMMStore';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Partner {
  partnerId: string;
  displayName: string;
}

interface Advertiser {
  advertiserId: string;
  displayName: string;
}

const useDv360Advertisers = (accessToken: string | null) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const advertisers = useMMMStore((state) => state.advertisers);
  const setAdvertisers = useMMMStore((state) => state.setAdvertisers);

  useEffect(() => {
    const fetchDV360Data = async () => {

      if (!accessToken) {
        console.log("❌ No accessToken available");
        setLoading(false); // Already in store or no token
        return;
      }
      if (advertisers.length > 0) {
        console.log("✅ advertisers already set");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Step 1: Fetch Partners
        const partnersResponse = await axios.get('https://displayvideo.googleapis.com/v3/partners', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const partnersData = partnersResponse.data.partners || [];
        setPartners(partnersData);

        // Step 2: Fetch Advertisers for the first Partner ID (if available)
        if (partnersData.length > 0) {
          const partnerId = partnersData[1].partnerId; // Use the first partner's ID
          const advertisersResponse = await axios.get(`https://displayvideo.googleapis.com/v3/advertisers?partnerId=${partnerId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          const advertisersData = advertisersResponse.data.advertisers || [];
          setAdvertisers(advertisersData);
        } else {
          console.log('No partners found.');
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching data:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDV360Data();
  }, [accessToken]);

  return { partners, advertisers, loading, error };
};
export default useDv360Advertisers;
