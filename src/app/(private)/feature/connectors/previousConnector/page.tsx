'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import useUserSession from '@/components/hooks/useUserSession';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '@/components/searchbar/search';
import User from '@/components/User/user';

interface Connector {
  connectorType: string;
  status: string;
  updatedAt: string;
}

const PreviousConnectors = () => {
  const { user, setUser } = useUserSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [prevJobs, setPrevJobs] = useState<Connector[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 3;

  useEffect(() => {
    const fetchConnectors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/connectors/prevConnectors?email=${user?.email}`);
        const data = await response?.data.reverse()
        setPrevJobs(data);
      } catch (error) {
        console.error('Error fetching prevJobs:', error);
        alert('Error fetching prevJobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user && !prevJobs?.length) {
      fetchConnectors();
    }
  }, [user]);

  const connectorMapping: any = {
    ga4: { name: "Google Analytics 4", image: "/assets/GA4_Logo.png" },
    googleAds: { name: "Google Ads", image: "/assets/Google Ads logo.png" },
    dv360: { name: "Display & Video 360", image: "/assets/dv360_logo (2).png" },
    linkedIn: { name: "linkedIn", image: "/assets/linkedin_Logo.png" },
  };

  const statusStyles: any = {
    failed: "bg-red-500 text-red-100",
    inProgress: "bg-[#EA5E0080] text-[#904300]",
    success: "bg-[#00EA3780] text-[#009022]",
  };

  const formatDate = (dateString: any) =>
    dateString
      ? new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      })
      : "";

  const totalPages = Math.ceil(prevJobs?.length / rowsPerPage);
  const paginationData = prevJobs?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const handleRedirect = () => {
    router.push('/feature/connectors')
  }

  return (

    <>
      <div className="w-full flex items-center pl-8 xl:pl-12 h-[50px] xl:h-[70px] bg-[#F6F8FE]">
        <SearchBar />
      </div>
      <div className="flex justify-between items-center max-w-[97%] xl:w-[97%] 2xl:w-[97%]">
        <User />
      </div>

      <div className='bg-homeGray mx-[1%] py-3 min-h-[200px]'>
        <div className='flex px-14 items-center justify-between pt-3 pb-6'>
          <input placeholder='Search' className='py-2 w-[40%] px-5 border border-[#D9D9D9] bg-transparent focus:outline-slate-400 placeholder-black' />
          <div className='w-[40%] flex justify-around items-center'>
            <button className='py-2 px-5 border border-[#D9D9D9] bg-transparent rounded-[5px]'>Last 30 days</button>
            <button onClick={handleRedirect} className='bg-primary py-2 px-6 text-base font-normal text-white rounded-[5px] border border-[#D9D9D9] hover:bg-[#253a5a] hover:text-white'>+ Add New</button>
          </div>
        </div>
        {loading ? (
          <div className="fixed z-50 w-[85%] h-[200px] flex justify-center items-center bg-homeGray">
            <div className="flex flex-col justify-center items-center">
              <div className="loader"></div>
              <p className="mt-4 text-xl font-semibold text-gray-700">
                Loading...
              </p>
            </div>
          </div>
        ) : (
          <div className='px-14'>
            <table className='w-full text-center border border-[#D9D9D9]'>
              <thead className='bg-[#D9D9D9] py-3 h-14'>
                <tr className='py-3'>
                  <th className='w-[33%]'>Connector Name</th>
                  <th className='w-[10%]'>Status</th>
                  <th className='w-[33%]'>Date-Time</th>
                </tr>
              </thead>
              <tbody>
                {paginationData ? (
                  paginationData?.map((connector, index) => {
                    const connectorInfo = connectorMapping[connector?.connectorType] || {};
                    return (
                      <tr className="bg-[#FFFFFF] border-b border-[#D9D9D9] h-16" key={index}>
                        <td className="">
                          <div className='flex items-center text-start gap-2 justify-center'>
                            {connectorInfo?.image && (
                              <img src={connectorInfo?.image} alt={connectorInfo?.name} className="w-6 h-6" />
                            )}
                            {connectorInfo?.name || ""}
                          </div>
                        </td>
                        <td>
                          <div className={`py-1 px-2 rounded-[10px] ${statusStyles[connector?.status] || ""}`}>
                            {connector?.status}
                          </div>
                        </td>
                        <td>{formatDate(connector?.updatedAt)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className='bg-[#FFFFFF]'>
                    <td colSpan={3}>No prevJobs found for this user.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )
        }

        {
          totalPages > 1 && (
            <div className='flex justify-center items-center gap-5 mt-14'>
              <button
                className={`px-4 py-2 bg-white border border-[#D9D9D9] rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}

                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}>
                {'<'}
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  className={`px-4 py-2 rounded border border-[#D9D9D9] ${currentPage === i + 1 ? "bg-primary text-white" : "bg-white text-black"
                    }`}
                  key={i} onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              ))}

              <button
                className={`px-4 py-2 bg-white border border-[#D9D9D9] rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}>
                {'>'}
              </button>
            </div>
          )
        }
      </div >
    </>
  );
};

export default PreviousConnectors;