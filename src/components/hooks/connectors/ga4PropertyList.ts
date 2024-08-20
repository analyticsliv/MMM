// /app/hooks/useAccountProperties.ts
import { useEffect, useState } from 'react';

interface Property {
    name: string;
    displayName: string;
    parent: string;
    property: string
    propertyType: string
}

interface account {
    name: string;
    propertySummaries: Array<object>
}

const useAccountProperties = (accountId: string | null, accountSummaries: Array<account> | null, accessToken: string | null) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperties = async () => {
            if (!accountId) return;
            // const account = trimAfterLastSlash(accountId)
            setLoading(true);
            setProperties([]);
            setError(null);

            try {
                const properties = accountSummaries?.find((item) => {
                    if (item?.name === accountId) {
                        return item?.propertySummaries
                    }
                })
                setProperties(properties?.propertySummaries || []);
            } catch (error) {
                setError('Failed to set properties');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [accountId]);

    return { properties, loading, error };
};

export default useAccountProperties;
