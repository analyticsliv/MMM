import axios from 'axios';
import { useState } from 'react';

const useDv360Connector = () => {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const url = 'https://us-central1-dx-api-project.cloudfunctions.net/function-test-dv360'; //dummyy......
    const dv360Connector = async (data: Object) => {
        setLoading(true);
        setError(null);
        try {
            try {
                const response = await axios.post('/api/proxy', { url, body: data, connectorType: 'dv360' });

                if (response.status === 200) {
                    return { success: true, data: response.data };
                } else {
                    console.error("Error:", response.statusText);
                    return { success: false, message: 'Fetching dv360 details failed' };
                }
            } catch (error) {
                console.error("Error:", error);
                return { success: false, message: 'An error occurred while fetching dv360 details' };
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