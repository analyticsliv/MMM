import { useEffect, useState } from "react";

interface AccountSummary {
  name: string;
  displayName: string;
}
interface AccountIds {
  id: string;
}

interface AccountSummariesResponse {
  accountSummaries: AccountSummary[];
}
interface AccountIdsResponse {
  accountIds: AccountIds[];
}

const useLinkedinSummaries = (accessToken: string | null) => {
  const [accountSummaries, setAccountSummaries] = useState<AccountSummary[]>([]);
  const [accountIds, setAccountIds] = useState<AccountIdsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountSummaries = async () => {
      try {
        if (!accessToken) {
          setLoading(false);
          return;
        }

        const response = await fetch("/api/linkedin/account-summaries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ access_token: accessToken }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: AccountSummariesResponse = await response.json();
        setAccountSummaries(data?.accountSummaries || []);
        setAccountIds(data?.adAccountId || []);
        console.log("objectdatadatadata----",data, accountIds)
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountSummaries();
  }, [accessToken]);

  return { accountSummaries, accountIds, loading, error };
};

export default useLinkedinSummaries;
