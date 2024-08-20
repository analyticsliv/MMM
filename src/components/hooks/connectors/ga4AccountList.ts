import { useState, useEffect } from 'react';

interface AccountSummary {
    name: string;
    displayName: string;
    // Add any other properties you expect from the API response
}

interface AccountSummariesResponse {
    accountSummaries: AccountSummary[];
}

const useAccountSummaries = (accessToken: string | null) => {
    const [accountSummaries, setAccountSummaries] = useState<AccountSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccountSummaries = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch("https://analyticsadmin.googleapis.com/v1alpha/accountSummaries?pageSize=200", {
                    headers: { "Authorization": `Bearer ${accessToken}` }
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data: AccountSummariesResponse = await response.json();
                setAccountSummaries(data.accountSummaries || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchAccountSummaries();
        } else {
            setLoading(false);
        }

    }, [accessToken]);

    return { accountSummaries, loading, error };
};

export default useAccountSummaries;
