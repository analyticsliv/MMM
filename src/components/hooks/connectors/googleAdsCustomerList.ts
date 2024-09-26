import axios from "axios";
import { useEffect, useState } from "react";



interface CustomerSummary {
    name: string;
    displayName: string;
    // Add any other properties you expect from the API response
}

interface CustomerSummariesResponse {
    customerSummaries: CustomerSummary[];
}

const useCustomerSummaries = (accessToken: string | null) => {
    // Developer token
    const devToken = 'GADvxdtoU2fCzjFRGNpleg';

    // Google Ads API endpoint
    const listAccessibleCustomersUrl = 'https://googleads.googleapis.com/v17/customers:listAccessibleCustomers';
    const searchGoogleAdsQueryUrl = 'https://googleads.googleapis.com/v17/customers/{customerId}/googleAds:search'; // Template URL for querying details

    // Token endpoint for refreshing the access token
    const tokenUrl = 'https://oauth2.googleapis.com/token';

    // GAQL query to fetch customer ID and name
    const gaqlQuery = `
  SELECT
    customer.id,
    customer.descriptive_name
  FROM
    customer
`;
    const [customerSummaries, setCustomerSummaries] = useState<CustomerSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {

        const getGoogleAdsCustomers = async () => {
            setLoading(true);
            setError(null);
            try {
                // accessToken = "ya29.a0AcM612xjdS_2Qizud4cXp2u4n15gwgbidooE3vqJl6dHdBZn7nV8xDlLEF4jDZD72C5KS9RMhC03-xynvYiNNhc9ZgRK7t00v_-3J0H6W09C67Jc1b8_HP9TYvHWC97MKiFk-Io4fVR4XQVQmrpCpJMJroMhhwYzVKMe3rxSaCgYKAWQSARASFQHGX2MihqTXKqVItIG2QfopyFfeNw0175"
                // Step 1: Fetch the list of accessible customer IDs
                // const accessToken = 'ya29.a0AcM612yZgVOdK_DjwWdrw0KxxAQrvYEvqcy2NnotxImbFlDzc605IRiX8OIor95pYOKSsQiLlfznZKUNpv8SPGm3QWdGANWop9GE8caWElKN1QkZB46xtH-XmCmsQJRqstJvoXBg2eWXHedFq01I-6bZV7vvV2V2EhrLXdeqBBIaCgYKAf8SARASFQHGX2Mi2VrdbU0n71gCHTuVLOaqSg0178'
                //         // await getNewAccessToken();
                const listResponse = await axios.get(listAccessibleCustomersUrl, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // OAuth access token
                        'developer-token': devToken,              // Developer token
                        'Content-Type': 'application/json',
                    },
                });

                const customerIds = listResponse?.data?.resourceNames?.map(name => name.split('/')[1]);

                if (!customerIds || customerIds.length === 0) {
                    console.log('No accessible customer IDs found.');
                    return {};
                }

                // Step 2: Fetch customer details for each customer ID
                const customerDetails: Array<[]> = [];
                for (const customerId of customerIds) {

                    try {
                        const formattedUrl = searchGoogleAdsQueryUrl.replace('{customerId}', customerId);
                        const customerResponse = await axios.post(formattedUrl, { query: gaqlQuery }, {
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'developer-token': devToken,
                                'Content-Type': 'application/json',
                            },
                        });

                        const accounts = customerResponse.data.results;
                        accounts.forEach(account => {
                            customerDetails.push({
                                'id': account.customer.id,
                                'name': account.customer.descriptiveName
                            })
                        });

                    } catch (err: any) {
                        setError(err.message);
                        console.error(`Error fetching details for customer ID ${customerId}:`, err.response?.data || err.message);
                    }
                }
                setCustomerSummaries(customerDetails);
                console.log("customer object", customerDetails)
                return { customerDetails, loading, error };

            } catch (error) {
                console.error('Error fetching accounts:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };
        if (accessToken) {
            getGoogleAdsCustomers();
        } else {
            setLoading(false);
        }
    }, [accessToken]);

    return { customerSummaries, loading, error };
};


export default useCustomerSummaries