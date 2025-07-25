
import axios from 'axios';
import { useState } from 'react';

const useFbConnector = () => {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const url = 'https://us-central1-dx-api-project.cloudfunctions.net/facebook-api';
    const fbConnector = async (data: Object) => {
        setLoading(true);
        setError(null);
        try {
            try {
                const response = await axios.post('/api/proxy', { url, body: data,connectorType: 'facebook' });

                if (response.status === 200) {
                    console.log("API response:", response.data);
                    console.log("status fb", response?.data?.success)
                    return { success: true, data: response.data };

                } else {
                    console.error("Error:", response.statusText);
                    return { success: false, message: 'Fetching Facebook details failed' };
                }
            } catch (error) {
                console.error("Error:", error);
                return { success: false, message: 'An error occurred while fetching Facebook details' };
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        fbConnector,
        loading,
        error,
    };
};

export default useFbConnector;
