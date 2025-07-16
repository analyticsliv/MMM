import { useMMMStore } from "@/store/useMMMStore";
import axios from "axios";
import { useEffect, useState } from "react";

interface CustomerSummary {
    id: string;
    name: string;
    isManager?: boolean;
    clients?: CustomerSummary[];
    // Add any other properties you expect from the API response
}

interface CustomerSummariesResponse {
    customerSummaries: CustomerSummary[];
}

const useCustomerSummaries = (accessToken: string | null) => {
    // Developer token
    const devToken = 'GADvxdtoU2fCzjFRGNpleg';

    // Google Ads API endpoint
    const listAccessibleCustomersUrl = 'https://googleads.googleapis.com/v18/customers:listAccessibleCustomers';
    const searchGoogleAdsQueryUrl = 'https://googleads.googleapis.com/v18/customers/{customerId}/googleAds:search'; // Template URL for querying details

    // Token endpoint for refreshing the access token
    const tokenUrl = 'https://oauth2.googleapis.com/token';

    // GAQL query to fetch customer ID and name (for individual accounts)
    const gaqlQuery = `
        SELECT
            customer.id,
            customer.descriptive_name,
            customer.manager
        FROM
            customer
    `;

    // GAQL query to fetch all clients under a manager account
    const clientsGaqlQuery = `
        SELECT 
            customer_client.id,
            customer_client.descriptive_name,
            customer_client.client_customer,
            customer_client.status,
            customer_client.currency_code,
            customer_client.time_zone,
            customer_client.manager,
            customer_client.level,
            customer_client.hidden,
            customer_client.test_account
        FROM customer_client
        WHERE customer_client.status = 'ENABLED'
        ORDER BY customer_client.level, customer_client.descriptive_name
    `;

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const customerSummaries = useMMMStore((state) => state.googleAdvertiser);
    const setCustomerSummaries = useMMMStore((state) => state.setGoogleAdvertiser);

    // Helper function to make API requests with proper error handling
    const makeApiRequest = async (url: string, data?: any, customerId?: string) => {
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'developer-token': devToken,
            'Content-Type': 'application/json',
            ...(customerId && { 'login-customer-id': customerId.replace(/-/g, '') })
        };

        if (data) {
            return await axios.post(url, data, { headers });
        } else {
            return await axios.get(url, { headers });
        }
    };

    // Helper function to fetch clients for a manager account
    const fetchClientsForManager = async (managerId: string): Promise<CustomerSummary[]> => {
        try {
            const formattedUrl = searchGoogleAdsQueryUrl.replace('{customerId}', managerId);
            const clientsResponse = await makeApiRequest(
                formattedUrl,
                { query: clientsGaqlQuery },
                managerId
            );

            const clients: CustomerSummary[] = [];
            const results = clientsResponse?.data?.results || [];

            results.forEach((item: any) => {
                const clientData = item?.customerClient;
                if (clientData && clientData.id !== managerId) { // Exclude self
                    clients.push({
                        id: clientData.id,
                        name: clientData.descriptiveName || `Account ${clientData.id}`,
                        isManager: clientData.manager || false
                    });
                }
            });

            return clients;
        } catch (err: any) {
            console.error(`Error fetching clients for manager ${managerId}:`, err.response?.data || err.message);
            return [];
        }
    };

    useEffect(() => {
        const getGoogleAdsCustomers = async () => {
            if (!accessToken) {
                console.log("❌ No accessToken available");
                setLoading(false);
                return;
            }

            if (customerSummaries?.length > 0) {
                console.log("✅ customerSummaries already set");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Step 1: Fetch the list of accessible customer IDs
                const listResponse = await makeApiRequest(listAccessibleCustomersUrl);

                const customerIds = listResponse?.data?.resourceNames?.map((name: string) => name.split('/')[1]);

                if (!customerIds?.length) {
                    console.log('No accessible customer IDs found.');
                    setLoading(false);
                    return;
                }

                const customerDetails: CustomerSummary[] = [];

                // Step 2: Fetch basic customer details for each customer ID
                for (const customerId of customerIds) {
                    try {
                        const formattedUrl = searchGoogleAdsQueryUrl.replace('{customerId}', customerId);
                        const customerResponse = await makeApiRequest(
                            formattedUrl,
                            { query: gaqlQuery }
                        );

                        const results = customerResponse?.data?.results || [];

                        for (const item of results) {
                            const customerData = item?.customer;
                            if (customerData) {
                                const customer: CustomerSummary = {
                                    id: customerData.id,
                                    name: customerData.descriptiveName || `Account ${customerData.id}`,
                                    isManager: customerData.manager || false
                                };

                                // Step 3: If this is a manager account, fetch its clients
                                if (customer.isManager) {
                                    const clients = await fetchClientsForManager(customer.id);
                                    customer.clients = clients;
                                }

                                customerDetails.push(customer);
                            }
                        }
                    } catch (err: any) {
                        // Continue with other customers instead of breaking
                        if (err.response?.status === 403) {
                            console.warn(`⚠️  Access denied for customer ${customerId}, skipping...`);
                        }
                    }
                }

                // Log summary
                const managerCount = customerDetails.filter(c => c.isManager)?.length;
                const clientCount = customerDetails.reduce((sum, c) => sum + (c.clients?.length || 0), 0);
                console.log(`📈 Summary: ${managerCount} manager accounts, ${clientCount} total clients`);

                setCustomerSummaries(customerDetails);

            } catch (err: any) {
                console.error('❌ Error in getGoogleAdsCustomers:', err.response?.data || err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getGoogleAdsCustomers();
    }, [accessToken, customerSummaries?.length, setCustomerSummaries]);

    return { customerSummaries, loading, error };
};

export default useCustomerSummaries;