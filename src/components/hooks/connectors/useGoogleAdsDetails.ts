import axios from 'axios';
import { useState } from 'react';

const useGoogleAdsDetails = () => {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const url = 'https://us-central1-dx-api-project.cloudfunctions.net/google-ads-connector';
    const googleAdsDetails = async (data: Object) => {
        setLoading(true);
        setError(null);
        try {
            try {
                const response = await axios.post('/api/proxy', { url, body: data });

                if (response?.status === 200) {
                    console.log("API response:", response?.data);
                    console.log("status Google Ads", response?.data?.success)
                    return { success: true, data: response.data };
                } else {
                    console.error("Error google ads:", response.statusText);
                    return { success: false, message: 'Fetching Google Ads details failed' };
                }
            } catch (error) {
                console.error("Error of google ads:", error);
                return { success: false, message: 'An error occurred while fetching Google Ads details' };
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        googleAdsDetails,
        loading,
        error,
    };
};

export default useGoogleAdsDetails;
