import { useState } from 'react';

const useConnector = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to update or create a connector
    const updateOrCreateConnector = async (email: string, connectorName: string, data: object) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/connectors/connector-handle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, connectorName, data }),
            });

            if (!response.ok) {
                throw new Error('Failed to update or create connector');
            }

            const result = await response.json();
            return result;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch data for a specific connector
    const getConnectorData = async (connectorName:string, email:string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/connectors/connector-check?email=${encodeURIComponent(email)}&connectorName=${encodeURIComponent(connectorName)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch connector data');
            }

            const result = await response.json();
            return result.data || false;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { updateOrCreateConnector, getConnectorData, error, loading };
};

export default useConnector;
