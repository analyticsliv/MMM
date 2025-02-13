import axios from 'axios';
import { useState } from 'react';

const useGa4Connector = () => {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const url = 'https://us-central1-dx-api-project.cloudfunctions.net/function-post-ga4';
    const ga4Connector = async (data: Object) => {
        setLoading(true);
        setError(null);
        try {
            try {
                const response = await axios.post('/api/proxy', { url, body: data , connectorType: 'ga4'});

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
        ga4Connector,
        loading,
        error,
    };
};

export default useGa4Connector;