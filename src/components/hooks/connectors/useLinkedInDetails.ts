import axios from 'axios';
import { useState } from 'react';

const useLinkedInDetails = () => {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const url = 'https://us-central1-dx-api-project.cloudfunctions.net/function-post-linkedIn';
    const linkedInDetails = async (data: Object) => {
        setLoading(true);
        setError(null);
        try {
            try {
                const response = await axios.post('/api/proxy', { url, body: data });

                if (response.status === 200) {
                    console.log("API response:", response.data);
                    console.log("status linkedIn", response?.data?.success)
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
        linkedInDetails,
        loading,
        error,
    };
};

export default useLinkedInDetails;