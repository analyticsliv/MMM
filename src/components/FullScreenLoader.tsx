// components/FullScreenLoader.tsx
import React from 'react';

const FullScreenLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed z-50 h-full w-[85%] flex justify-center items-center bg-white">
      <div className="flex flex-col justify-center items-center">
        <div className="loader"></div>
        <p className="mt-4 text-xl font-semibold text-gray-700">
          {message}
        </p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
