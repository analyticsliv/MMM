import axios from 'axios';
import { useState } from 'react';

const useDv360Connector = () => {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const url = 'https://us-central1-dx-api-project.cloudfunctions.net/function-post-ga4';
    const dv360Connector = async (data: Object) => {
        setLoading(true);
        setError(null);
        try {
            try {
                const response = await axios.post('/api/proxy', { url, body: data, connectorType: 'dv360' });

                if (response.status === 200) {
                    console.log("API response:", response.data);
                    console.log("status ga4", response?.data?.success)
                    return { success: true, data: response.data };
                } else {
                    console.error("Error:", response.statusText);
                    return { success: false, message: 'Fetching GA4 details failed' };
                }
            } catch (error) {
                console.error("Error:", error);
                return { success: false, message: 'An error occurred while fetching GA4 details' };
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        dv360Connector,
        loading,
        error,
    };
};

export default useDv360Connector;