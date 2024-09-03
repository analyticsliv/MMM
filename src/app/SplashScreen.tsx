"use client";
import React, { useState, useEffect } from "react";

const SplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 2000); // Adjust the time as needed
  }, []);

  return (
    <div>
      {showSplash && (
        <div className="fixed z-50 w-full h-full flex justify-center items-center bg-white">
          <div className="flex flex-col items-center">
            <div className="loader"></div>
            <p className="mt-4 text-xl font-semibold text-gray-700">
              Loading...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
