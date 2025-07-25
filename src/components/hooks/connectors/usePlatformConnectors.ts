import { useState } from 'react';
import axios from 'axios';

export const usePlatformConnectors = () => {
  // State for Google Ads
  const [googleAdsLoading, setGoogleAdsLoading] = useState(false);
  const [googleAdsError, setGoogleAdsError] = useState(null);

  // State for DV360
  const [dv360Loading, setDv360Loading] = useState(false);
  const [dv360Error, setDv360Error] = useState(null);

  const googleAdsUrl =
    'https://us-central1-dx-api-project.cloudfunctions.net/google-ads-connector';
  const dv360Url =
    'https://us-central1-dx-api-project.cloudfunctions.net/function-test-dv360';

  const googleAdsConnector = async (data: object) => {
    setGoogleAdsLoading(true);
    setGoogleAdsError(null);
    try {
      const response = await axios.post('/api/proxy', {
        url: googleAdsUrl,
        body: data,
        connectorType: 'googleAds',
      });

      if (response.status === 200) {
        console.log('Google Ads response:', response.data);
        return { success: true, data: response.data };
      } else {
        console.error('Google Ads error:', response.statusText);
        return { success: false, message: 'Google Ads request failed' };
      }
    } catch (err) {
      console.error('Google Ads catch error:', err);
      return { success: false, message: 'Google Ads fetch failed' };
    } finally {
      setGoogleAdsLoading(false);
    }
  };

  const dv360Connector = async (data: object) => {
    setDv360Loading(true);
    setDv360Error(null);
    try {
      const response = await axios.post('/api/proxy', {
        url: dv360Url,
        body: data,
        connectorType: 'dv360',
      });

      if (response.status === 200) {
        console.log('DV360 response:', response.data);
        return { success: true, data: response.data };
      } else {
        console.error('DV360 error:', response.statusText);
        return { success: false, message: 'DV360 request failed' };
      }
    } catch (err) {
      console.error('DV360 catch error:', err);
      return { success: false, message: 'DV360 fetch failed' };
    } finally {
      setDv360Loading(false);
    }
  };

  return {
    googleAdsConnector,
    googleAdsLoading,
    googleAdsError,

    dv360Connector,
    dv360Loading,
    dv360Error,
  };
};
