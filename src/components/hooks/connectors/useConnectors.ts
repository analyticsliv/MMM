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
            const response = await fetch(`/api/connectors/connectorCheck?email=${encodeURIComponent(email)}&connectorName=${encodeURIComponent(connectorName)}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Connector fetch failed:", errorText);
                throw new Error('Failed to fetch connector data');
            }

            const result = await response.json();

            if (result && result.data) {
                return result.data;
            } else {
                console.warn("⚠️ No connector data found (empty or null).");
                return false;
            }
        } catch (err: any) {
            console.error("❌ Error in getConnectorData:", err.message || err);
            setError(err.message || 'Unknown error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { updateOrCreateConnector, getConnectorData, error, loading };
};

export default useConnector;
