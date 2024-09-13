"use client";
import React, { useEffect, useState } from "react";
import SuccessModal from "./success";
import { createJobId } from '@/utils/helper';

const Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobData, setJobData] = useState<object | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [loadingScreen, setLoadingScreen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    async function getJobDetail(jobId: string) {
      try {
        const response = await fetch('/api/connectors/jobCheck', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jobId }), // Sending jobId in the body
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setJobData(data); // Store jobId in state
        console.log("API response:", data);

      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    }

    const jobId = createJobId('facebook', "data.analytics@analyticsliv.com");
    if (jobId) {
      getJobDetail(jobId);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loadingScreen ? (
        <div className="flex flex-col justify-center items-center space-y-4">
          <div className="flex items-center">
            <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
          <span className="text-lg font-semibold text-gray-700">Loading...</span>
        </div>
      ) : statusMessage ? (
        <div>{statusMessage}</div>
      ) : jobData?.message === "Job not found" ? (
        <button onClick={openModal} className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
          Open GA4 Modal
        </button>
      ) : (
        <div>
          Connector is already connected!
        </div>
      )}

      {isModalOpen && (
        <SuccessModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          onSubmitSuccess={(message: string) => {
            setStatusMessage(message);
            setIsModalOpen(false);
            setLoadingScreen(true);
          }}
          setLoadingScreen={setLoadingScreen}
        />
      )}
    </div>
  );
};

export default Page;


// 'use client';
// import React, { useEffect } from "react";
// import { useState } from "react";
// import SuccessModal from "./success";
// import { createJobId } from '@/utils/helper';

// const Page: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [jobData, setJobData] = useState<object | null>(null);
//   const [statusMessage, setStatusMessage] = useState<string>('');
//   const [loadingScreen, setLoadingScreen] = useState(false); // Loader state
  
//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);
//   // const handleModalSubmitSuccess = (message: string) => {
//   //   setStatusMessage(message);
//   // };
//   // const handleSuccess = (message: string) => {
//   //   console.log(message); // Handle success message
//   //   setLoading(false); // Stop the loader once submission is done
//   // };
//   useEffect(() => {
//     async function getJobDetail(jobId: string) {

//       try {
//         const response = await fetch('/api/connectors/jobCheck', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ jobId }), // Sending jobId in the body
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         setJobData(data); // Store jobId in state
//         console.log("API response:", data);

//       } catch (error) {
//         console.error('Error fetching auth URL:', error);
//       }
//     }
//     const jobId = createJobId('facebook', "data.analytics@analyticsliv.com");
//     if (jobId) {
//       getJobDetail(jobId);
//     }
//   }, []);

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       {/* {statusMessage ? (
//         <div>{statusMessage}</div>
//       ) : 
//        */}
//       { loadingScreen ? (
//         <div className="flex justify-center items-center">
//           {/* Loader */}
//           <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
//           <span className="ml-2">Submitting...</span>
//         </div>
//       ) : statusMessage ? (
//         <div>{statusMessage}</div>
//       )  : (jobData?.message == "Job not found" ? (
//         <button onClick={openModal} className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">Open Success Modal</button>) :
//         <div>
//           Connector is already connected !
//         </div>)}

//       {isModalOpen && (
//         <SuccessModal isModalOpen={isModalOpen} closeModal={closeModal}
//           onSubmitSuccess={(message: string) => {
//             // handleSuccess(message);
//             setIsModalOpen(false); // Close the modal after form submission
//             setLoadingScreen(true); // Start the loader after closing the modal
//           }} />
//         // onSubmitSuccess={handleModalSubmitSuccess} />
//       )}
//     </div>
//   );
// };

// export default Page;