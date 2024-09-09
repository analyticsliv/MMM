"use client";

import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import CustomDatepicker from "@/components/DatePicker/Datepicker";
import { useUser } from "@/app/context/UserContext";
import { useSearchParams } from "next/navigation";
import useConnector from "@/components/hooks/connectors/useConnectors";
import useAccountSummaries from "@/components/hooks/connectors/ga4AccountList";
import useAccountProperties from "@/components/hooks/connectors/ga4PropertyList";

const SuccessPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const { user } = useUser();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const refreshTokenParam = searchParams.get("refresh_token");
  const { updateOrCreateConnector, getConnectorData, error, loading } = useConnector();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const {
    accountSummaries,
    loading: accountsLoading,
    error: accountsError,
  } = useAccountSummaries(accessToken);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const {
    properties,
    loading: propertiesLoading,
    error: propertiesError,
  } = useAccountProperties(selectedAccount, accountSummaries, accessToken);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedAccount(event.target.value);
  // };

  const handlePropertyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProperty(event.target.value);
  };


  useEffect(() => {
    // this function is responsible to genrate acesstoken if user comes first time...
    async function getTokenFromCode(code: string) {
      try {
        const response = await fetch(`/api/auth/ga4-auth?code=${code}`);
        const data = await response.json();
        setAccessToken(data?.access_token || null);
        const user = JSON.parse(localStorage.getItem('userSession'))?.user;
        const connectorData = {
          refreshToken: data?.refresh_token,
          expriyTime: data?.expiry_date
        }

        updateOrCreateConnector(user?.email, 'ga4', connectorData);
      } catch (error) {
        console.error("Error getting tokens:", error);
      }
    }

    // this functuon is responsible to genrate acesstoken using refresh token recvived from db
    async function getTokenFromRefreshToken(refreshToken: string) {
      try {
        const response = await fetch(`/api/auth/ga4-refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        const data = await response.json();
        setAccessToken(data?.access_token || null);
      } catch (error) {
        console.error("Error getting access token using refresh token:", error);
      }
    }

    if (code && !accessToken) {
      getTokenFromCode(code);
    }
    else if (refreshTokenParam && !accessToken) {
      getTokenFromRefreshToken(refreshTokenParam);
    }
  }, [code, refreshTokenParam]);

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(event.target.value);
  };
  return (
    <div className="flex justify-around">
      <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          Open SuccessPage Modal
        </button>

        <Dialog open={isModalOpen} onClose={closeModal} className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto relative">
            <Dialog.Title className="text-2xl mb-4">GA4 Date Picker</Dialog.Title>

            <CustomDatepicker />

            <div className="flex gap-4 mt-6">
              <div>
                <h1 className="pb-2">Account Summaries</h1>
                {accountsLoading && <p>Loading accounts...</p>}
                {accountsError && <p>Error: {accountsError}</p>}

                {!accountsLoading && !accountsError && (
                  <select
                    onChange={handleAccountChange}
                    value={selectedAccount || ""}
                    className="p-2 border border-black rounded-sm"
                  >
                    <option value="" disabled>
                      Select an account
                    </option>
                    {accountSummaries.map((account: Account, index) => (
                      <option key={index} value={account.name}>
                        {account.displayName}
                      </option>
                    ))}
                  </select>
                )}

                {selectedAccount && (
                  <div className="pt-3">
                    <h2>Properties for {selectedAccount}</h2>
                    {propertiesLoading && <p>Loading properties...</p>}
                    {propertiesError && <p>Error: {propertiesError}</p>}

                    {!propertiesLoading && !propertiesError && (
                      <ul>
                        {properties?.map((property: Property, index) => (
                          <li key={index}>
                            <strong>{property.displayName}</strong> - {property.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              {/* <select
              onChange={handleAccountChange}
              value={selectedAccount || ""}
              className="w-[225px] h-[51px] border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select an account</option>
              <option value="account1">Account 1</option>
              <option value="account2">Account 2</option>
            </select> */}
              <select
                onChange={handlePropertyChange}
                value={selectedProperty || ""}
                className="w-[225px] h-[51px] border border-gray-300 rounded-md"
              >
                <option value="" disabled>Select a property</option>
                {/* Replace with actual property options */}
                <option value="property1">Property 1</option>
                <option value="property2">Property 2</option>
              </select>
            </div>

            <button
              onClick={closeModal}
              className="bg-red-600 text-white px-4 py-2 rounded-full absolute top-4 right-4"
            >
              Close
            </button>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default SuccessPage;

// "use client";

// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import useAccountSummaries from "@/components/hooks/connectors/ga4AccountList";
// import useAccountProperties from "@/components/hooks/connectors/ga4PropertyList";
// import { Dialog } from "@headlessui/react";
// import { DateRangePicker, RangeKeyDict } from "react-date-range"; // Ensure react-date-range is installed
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";
// import { useSession, signOut } from "next-auth/react";
// import useConnector from "@/components/hooks/connectors/useConnectors";
// import { useUser } from "@/app/context/UserContext";
// import CustomDatepicker from "@/components/DatePicker/Datepicker";
// interface Account {
//   name: string;
//   displayName: string;
// }

// interface Property {
//   name: string;
//   displayName: string;
// }

// const SuccessPage: React.FC = () => {
//   // const { data: session, status } = useSession();
//   const { user } = useUser();
//   const searchParams = useSearchParams();
//   const code = searchParams.get("code");
//   const refreshTokenParam = searchParams.get("refresh_token");
//   const { updateOrCreateConnector, getConnectorData, error, loading } = useConnector();
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const {
//     accountSummaries,
//     loading: accountsLoading,
//     error: accountsError,
//   } = useAccountSummaries(accessToken);
//   const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
//   const {
//     properties,
//     loading: propertiesLoading,
//     error: propertiesError,
//   } = useAccountProperties(selectedAccount, accountSummaries, accessToken);


//   useEffect(() => {
//     // this function is responsible to genrate acesstoken if user comes first time...
//     async function getTokenFromCode(code: string) {
//       try {
//         const response = await fetch(`/api/auth/ga4-auth?code=${code}`);
//         const data = await response.json();
//         setAccessToken(data?.access_token || null);
//         const user = JSON.parse(localStorage.getItem('userSession'))?.user;
//         const connectorData = {
//           refreshToken: data?.refresh_token,
//           expriyTime: data?.expiry_date
//         }

//         updateOrCreateConnector(user?.email, 'ga4', connectorData);
//       } catch (error) {
//         console.error("Error getting tokens:", error);
//       }
//     }

//     // this functuon is responsible to genrate acesstoken using refresh token recvived from db
//     async function getTokenFromRefreshToken(refreshToken: string) {
//       try {
//         const response = await fetch(`/api/auth/ga4-refresh-token`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ refresh_token: refreshToken }),
//         });

//         const data = await response.json();
//         setAccessToken(data?.access_token || null);
//       } catch (error) {
//         console.error("Error getting access token using refresh token:", error);
//       }
//     }

//     if (code && !accessToken) {
//       getTokenFromCode(code);
//     }
//     else if (refreshTokenParam && !accessToken) {
//       getTokenFromRefreshToken(refreshTokenParam);
//     }
//   }, [code, refreshTokenParam]);

//   const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedAccount(event.target.value);
//   };
//   return (
//     <div className="flex justify-around">
//       <div>
//         <h1 className="pb-2">Account Summaries</h1>
//         {accountsLoading && <p>Loading accounts...</p>}
//         {accountsError && <p>Error: {accountsError}</p>}

//         {!accountsLoading && !accountsError && (
//           <select
//             onChange={handleAccountChange}
//             value={selectedAccount || ""}
//             className="p-2 border border-black rounded-sm"
//           >
//             <option value="" disabled>
//               Select an account
//             </option>
//             {accountSummaries.map((account: Account, index) => (
//               <option key={index} value={account.name}>
//                 {account.displayName}
//               </option>
//             ))}
//           </select>
//         )}

//         {selectedAccount && (
//           <div className="pt-3">
//             <h2>Properties for {selectedAccount}</h2>
//             {propertiesLoading && <p>Loading properties...</p>}
//             {propertiesError && <p>Error: {propertiesError}</p>}

//             {!propertiesLoading && !propertiesError && (
//               <ul>
//                 {properties?.map((property: Property, index) => (
//                   <li key={index}>
//                     <strong>{property.displayName}</strong> - {property.name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}
//       </div>
//       <CustomDatepicker />
//     </div>
//   );
// };

// export default SuccessPage;




// const openModal = () => setIsModalOpen(true);
// const closeModal = () => setIsModalOpen(false);

// const handleDateChange = (ranges: RangeKeyDict) => {
//   const { selection } = ranges;
//   const startDate = selection.startDate;
//   const endDate = selection.endDate;

//   if (startDate && endDate) {
//     const diffInDays =
//       (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

//     if (diffInDays > 30) {
//       alert("The date range cannot be more than 30 days.");
//       return;
//     }
//   }

//   setDateRange({ startDate, endDate });
// };

// const clearDates = () => setDateRange({ startDate: null, endDate: null });

// // Calculate min and max dates based on the selected date range
// const minDate = new Date(); // Allow selection of dates before today
// const maxDate = dateRange.startDate
//   ? new Date(dateRange.startDate.getTime() + 30 * 24 * 60 * 60 * 1000)
//   : undefined;
// const minDateForEndDate = dateRange.endDate
//   ? new Date(dateRange.endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
//   : undefined;




// {/* <div>
//         <button
//           onClick={openModal}
//           className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-full"
//         >
//           Open GA4 Date Picker
//         </button>

//         {dateRange.startDate && dateRange.endDate && (
//           <p className="mt-4">
//             Selected Date Range: {dateRange.startDate.toDateString()} -{" "}
//             {dateRange.endDate.toDateString()}
//           </p>
//         )}

//         <Dialog
//           open={isModalOpen}
//           onClose={closeModal}
//           className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
//         >
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <Dialog.Title className="text-2xl mb-4">
//               Select Date Range
//             </Dialog.Title>
//             <DateRangePicker
//               ranges={[
//                 {
//                   startDate: dateRange.startDate || null,
//                   endDate: dateRange.endDate || null,
//                   key: "selection",
//                 },
//               ]}
//               onChange={handleDateChange}
//               minDate={
//                 dateRange.endDate
//                   ? new Date(
//                     dateRange.endDate.getTime() - 30 * 24 * 60 * 60 * 1000
//                   )
//                   : minDate
//               }
//               maxDate={
//                 dateRange.startDate
//                   ? new Date(
//                     dateRange.startDate.getTime() + 30 * 24 * 60 * 60 * 1000
//                   )
//                   : undefined
//               }
//             />
//             <div className="mt-4 flex justify-between">
//               <button
//                 onClick={clearDates}
//                 className="bg-red-600 text-white px-4 py-2 rounded-full"
//               >
//                 Clear Dates
//               </button>
//               <button
//                 onClick={closeModal}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-full"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </Dialog>
//       </div> */}