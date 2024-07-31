"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2 className="text-lg text-center justify-center text-gray-default">
        Something went wrong!
      </h2>
      <button
        className="text-center justify-center text-gray-default"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}

// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// const Error = ({
//   error,
//   reset,
// }: {
//   error: Error & { digest?: string };
//   reset: () => void;
// }) => {
//   const router = useRouter();

//   useEffect(() => {
//     // Log the error to an error reporting service
//     console.error(error);
//   }, [error]);

//   const handleTryAgain = () => {
//     reset(); // Call the reset function to retry
//     router.reload(); // Reload the page
//   };

//   return (
//     <div className="empty-orders flex flex-col items-center justify-center mt-5">
//       <div className="rounded-md mx-auto w-full md:w-3/4 lg:w-[800px] h-[400px] bg-gradient-to-r from-primary-500 to-secondary-500 shadow-md p-8 text-center space-y-4 md:space-y-14 ">
//         <div className="text-4xl font-bold mb-8 text-white">
//           Oops! Something went wrong.
//         </div>
//         <div className="text-lg md:text-2xl font-medium text-gray-100 mb-8">
//           We apologize for the inconvenience. Please try again later.
//         </div>
//         <button
//           className="px-8 py-3 bg-white hover:bg-gray-100 text-lg text-primary-800 rounded-md focus:outline-none"
//           onClick={handleTryAgain}
//         >
//           Try Again
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Error;
