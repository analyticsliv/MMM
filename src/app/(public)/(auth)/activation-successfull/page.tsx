"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-white p-8 rounded-md justify-center items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Great news! Your account activation is complete.
        </h1>
        <p className="text-gray-600 mb-6 text-center text-lg">
          Welcome to MMM
        </p>
        <p className="text-gray-600 mb-6 text-center text-lg">
          Ready, set, shop!{" "}
        </p>

        <button
          onClick={() => {
            localStorage.removeItem('userSession');
            router.push("/login");
          }}
          className="w-full  bg-primary hover:bg-primary-700 focus:bg-blue-400 text-lg text-white font-semibold  px-4 py-3 mt-6"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Page;
