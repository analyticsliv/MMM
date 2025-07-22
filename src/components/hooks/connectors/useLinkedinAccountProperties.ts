import { useState, useEffect } from "react"

interface PropertySummary {
    name: string;
    displayName: string;
}

interface PropertySummariesResponse {
    adPropertyData: {
        elements: PropertySummary[];
    };
}

const useLinkedinAccountProperties = (accessToken: string | null, account: string | null) => {
    const [propertySummaries, setPropertySummaries] = useState<PropertySummary[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPropertySummaries = async () => {
            setLoading(true);
            try {
                if (!accessToken || !account) {
                    setLoading(false);
                    return;
                }

                const response = await fetch("/api/linkedin/property-summaries", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ access_token: accessToken, account: account }),
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data: PropertySummariesResponse = await response.json();
                const elements = data?.adPropertyData?.elements || [];

                setPropertySummaries(elements);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPropertySummaries();
    }, [accessToken, account])

    return { propertySummaries, loading, error };
}

export default useLinkedinAccountProperties;