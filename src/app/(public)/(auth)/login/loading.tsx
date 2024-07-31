"use client";

const loading = () => {
  return (
    // <div className="flex flex-col items-center justify-center">
    //     <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
    // </div>

    <div className="w-8vmax h-8vmax border-4 border-primary rounded-full animate-spinRight">
      <div className="relative w-6vmax h-6vmax animate-spinLeft">
        <div className="absolute w-4vmax h-4vmax top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-primary border-right-0 animate-none"></div>
      </div>
    </div>
  );
};

export default loading;
