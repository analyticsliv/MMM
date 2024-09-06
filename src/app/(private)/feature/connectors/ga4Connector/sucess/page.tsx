"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useAccountSummaries from "@/components/hooks/connectors/ga4AccountList";
import useAccountProperties from "@/components/hooks/connectors/ga4PropertyList";
import { Dialog } from "@headlessui/react";
import { DateRangePicker, RangeKeyDict } from "react-date-range"; // Ensure react-date-range is installed
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useSession, signOut } from "next-auth/react";
import useConnector from "@/components/hooks/connectors/useConnectors";
import { useUser } from "@/app/context/UserContext";

interface Account {
  name: string;
  displayName: string;
}

interface Property {
  name: string;
  displayName: string;
}

const SuccessPage: React.FC = () => {
  // const { data: session, status } = useSession();
  const {user} = useUser();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    async function getTokenFromCode(code: string) {
      try {
        const response = await fetch(`/api/auth/ga4-auth?code=${code}`);
        const data = await response.json();
        if (!accessToken) {
          setAccessToken(data?.access_token || null);
          const connectorData = {
            refreshToken: data?.refresh_token,
            expriyTime: data?.expiry_date
          }

          updateOrCreateConnector(user?.email, 'ga4', connectorData);
        }
      } catch (error) {
        console.error("Error getting tokens:", error);
      }
    }

    if (code && !accessToken) {
      getTokenFromCode(code);
    }
  }, [code, accessToken]);

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(event.target.value);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDateChange = (ranges: RangeKeyDict) => {
    const { selection } = ranges;
    const startDate = selection.startDate;
    const endDate = selection.endDate;

    if (startDate && endDate) {
      const diffInDays =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

      if (diffInDays > 30) {
        alert("The date range cannot be more than 30 days.");
        return;
      }
    }

    setDateRange({ startDate, endDate });
  };

  const clearDates = () => setDateRange({ startDate: null, endDate: null });

  // Calculate min and max dates based on the selected date range
  const minDate = new Date(); // Allow selection of dates before today
  const maxDate = dateRange.startDate
    ? new Date(dateRange.startDate.getTime() + 30 * 24 * 60 * 60 * 1000)
    : undefined;
  const minDateForEndDate = dateRange.endDate
    ? new Date(dateRange.endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
    : undefined;

  return (
    <div className="flex justify-around">
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
      <div>
        <button
          onClick={openModal}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-full"
        >
          Open GA4 Date Picker
        </button>

        {dateRange.startDate && dateRange.endDate && (
          <p className="mt-4">
            Selected Date Range: {dateRange.startDate.toDateString()} -{" "}
            {dateRange.endDate.toDateString()}
          </p>
        )}

        <Dialog
          open={isModalOpen}
          onClose={closeModal}
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Dialog.Title className="text-2xl mb-4">
              Select Date Range
            </Dialog.Title>
            <DateRangePicker
              ranges={[
                {
                  startDate: dateRange.startDate || null,
                  endDate: dateRange.endDate || null,
                  key: "selection",
                },
              ]}
              onChange={handleDateChange}
              minDate={
                dateRange.endDate
                  ? new Date(
                    dateRange.endDate.getTime() - 30 * 24 * 60 * 60 * 1000
                  )
                  : minDate
              }
              maxDate={
                dateRange.startDate
                  ? new Date(
                    dateRange.startDate.getTime() + 30 * 24 * 60 * 60 * 1000
                  )
                  : undefined
              }
            />
            <div className="mt-4 flex justify-between">
              <button
                onClick={clearDates}
                className="bg-red-600 text-white px-4 py-2 rounded-full"
              >
                Clear Dates
              </button>
              <button
                onClick={closeModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-full"
              >
                Save
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default SuccessPage;
