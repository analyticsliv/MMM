// /app/hooks/useAccountProperties.ts
import { useEffect, useState } from 'react';

interface Property {
    name: string;
    displayName: string;
    parent: string;
    property: string;
    propertyType: string;
}

interface Account {
    name: string;
    propertySummaries: Array<Property>;
}

const useAccountProperties = (
    accountId: string | null,
    accountSummaries: Array<Account> | null,
    accessToken: string | null
) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [propertyIds, setPropertyIds] = useState<string[]>([]); // Store extracted property IDs

    useEffect(() => {
        const fetchProperties = async () => {
            if (!accountId) return;
            // const account = trimAfterLastSlash(accountId)
            setLoading(true);
            setProperties([]);
            setError(null);

            try {
                const properties = accountSummaries?.find((account) => account?.name === accountId);

                if (properties) {
                    setProperties(properties?.propertySummaries || []);

                    const ids = properties?.propertySummaries.map(property => {
                        return property?.property.split('/')[1];
                    });

                    setPropertyIds(ids);
                } else {
                    throw new Error("Account not found.");
                }
            } catch (error: any) {
                setError(error.message || 'Failed to load properties');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [accountId, accountSummaries]);

    return { properties, propertyIds, loading, error };
};

export default useAccountProperties;



// // /app/hooks/useAccountProperties.ts
// import { useEffect, useState } from 'react';

// interface Property {
//     name: string;
//     displayName: string;
//     parent: string;
//     property: string
//     propertyType: string
// }

// interface account {
//     name: string;
//     propertySummaries: Array<object>
// }

// const useAccountProperties = (accountId: string | null, accountSummaries: Array<account> | null, accessToken: string | null) => {
//     const [properties, setProperties] = useState<Property[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);
//     const [propertyIds, setPropertyIds] = useState<string[]>([]); // Store extracted property IDs

//     useEffect(() => {
//         const fetchProperties = async () => {
//             if (!accountId) return;
//             // const account = trimAfterLastSlash(accountId)
//             setLoading(true);
//             setProperties([]);
//             setError(null);

//             try {
//                 const properties = accountSummaries?.find((item) => {
//                     if (item?.name === accountId) {
//                         return item?.propertySummaries
//                     }
//                 })
//                 setProperties(properties?.propertySummaries || []);
//             } catch (error) {
//                 setError('Failed to set properties');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProperties();
//     }, [accountId]);

//     return { properties, loading, error };
// };

// export default useAccountProperties;
