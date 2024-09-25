import { useState } from "react";

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


const getGoogleAdsAccounts = async () => {
    try {
        // Step 1: Fetch the list of accessible customer IDs
        const accessToken = 'ya29.a0AcM612yZgVOdK_DjwWdrw0KxxAQrvYEvqcy2NnotxImbFlDzc605IRiX8OIor95pYOKSsQiLlfznZKUNpv8SPGm3QWdGANWop9GE8caWElKN1QkZB46xtH-XmCmsQJRqstJvoXBg2eWXHedFq01I-6bZV7vvV2V2EhrLXdeqBBIaCgYKAf8SARASFQHGX2Mi2VrdbU0n71gCHTuVLOaqSg0178'
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
        const customerDetails = [];
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
                console.log("customer object", accounts)
                accounts.forEach(account => {
                    customerDetails.push({
                        'id': account.customer.id,
                        'name': account.customer.descriptiveName
                    })
                });

            } catch (err) {
                console.error(`Error fetching details for customer ID ${customerId}:`, err.response?.data || err.message);
            }
        }

        console.log('Customer Details:', customerDetails);
        return {customerDetails, loading, error };

    } catch (error) {
        console.error('Error fetching accounts:', error.response?.data || error.message);
        return {};
    }
};

export default getGoogleAdsAccounts