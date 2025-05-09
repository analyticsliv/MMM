import axios from 'axios';
import { useState } from 'react';

const useLinkedInConnector = () => {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const url = 'https://linkedin-135392845747.us-central1.run.app';
    const linkedInConnector = async (data: Object) => {
        setLoading(true);
        setError(null);
        try {
            try {
                const response = await axios.post('/api/proxy', { url, body: data, connectorType: 'linkedIn' });

                if (response.status === 200) {
                    return { success: true, data: response.data };
                } else {
                    console.error("Error:", response.statusText);
                    return { success: false, message: 'Fetching linkedIn details failed' };
                }
            } catch (error) {
                console.error("Error:", error);
                return { success: false, message: 'An error occurred while fetching linkedIn details' };
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        linkedInConnector,
        loading,
        error,
    };
};

export default useLinkedInConnector;