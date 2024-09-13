"use client"

import React, { useEffect, useState } from 'react';
import SuccessModal from "./sucess"; // Assuming success.tsx is in the same folder.
import { createJobId } from '@/utils/helper';

const Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobData, setJobData] = useState<object | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>(''); // To store success/error message from modal

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleModalSubmitSuccess = (message: string) => {
    // This function will be called when the modal form submission is successful
    setStatusMessage(message); // Set the message to display on the parent page
  };
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
        console.error('Error fetching auth URL:', error);
      }
    }
    const jobId = createJobId('facebook', "data.analytics@analyticsliv.com");
    if (jobId) {
      getJobDetail(jobId);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {statusMessage ? (
        <div>{statusMessage}</div> // Display success or error message here
      ) : jobData?.message == "Job not found" ? (
        <button onClick={openModal} className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
          Open Facebook Modal
        </button>
      ) : (
        <div>Connector is already connected!</div>
      )}
      {isModalOpen && (
        <SuccessModal isModalOpen={isModalOpen} closeModal={closeModal} onSubmitSuccess={handleModalSubmitSuccess} // Pass the callback function
        />
      )}
    </div>
  );
};

export default Page;

// "use client";

// import React, { useEffect, useState } from 'react';
// import SuccessModal from "./sucess"; // Assuming success.tsx is in the same folder.
// import { createJobId } from '@/utils/helper';
// import useFbDetails from '@/components/hooks/connectors/useFbDetails';

// const Page: React.FC = () => {

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [jobData, setJobData] = useState<object | null>(null);
//   const { fbDetails, msgStatus } = useFbDetails(); // Destructure fbDetails and status

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

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
//       {msgStatus === "success" ? (
//         <div>Facebook Connector Successful!</div>
//       ) : jobData?.message === "Job not found" ? (
//         <button onClick={openModal} className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
//           Open Facebook Modal
//         </button>
//       ) : (
//         <div>Connector is already connected!</div>
//       )}
//       {isModalOpen && (
//         <SuccessModal isModalOpen={isModalOpen} closeModal={closeModal} />
//       )}
//     </div>
//   );
//   // return (
//   //   <div className="flex items-center justify-center min-h-screen">
//   //     {msgStatus === "success" ? (
//   //       <div>Facebook Connector Successful!</div>
//   //     )
//   //     : jobData?.message == "Job not found" ? (
//   //       <button onClick={openModal} className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">Open Facebook Modal</button>
//   //     ) :
//   //       <div>
//   //         Connector is already connected !
//   //       </div>}
//   //     {isModalOpen && (
//   //       <SuccessModal isModalOpen={isModalOpen} closeModal={closeModal} />
//   //     )}
//   //   </div>
//   // );
// };

// export default Page;