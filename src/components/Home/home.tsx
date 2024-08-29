"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import useToast from "../hooks/toast";
import { toast, ToastContainer } from "react-toastify";

const HomePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const notify = useToast();

  useEffect(() => {
    console.log("object", session)

    if (status === "loading") {
      // Wait for session status to load
      return;
    }

    if (status === "unauthenticated") {
      // Redirect to login if unauthenticated
      router.push("/login");
      // notify('You have been redirected to the login page', 'info');

    } else if (status === "authenticated") {
      setLoading(false);
      notify(`Welcome back, ${session?.user?.name}! You're all set to explore new horizons with our agency`, 'success'); // Show welcome toast

    }
  }, [status]);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ redirect: false });
    notify("You have been signed out.", 'info'); // Show sign-out toast
    router.push("/login");
  };

  const handleFeature = async () => {
    // setLoading(true);
    router.push("/feature");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-10 bg-white rounded-lg shadow-lg border border-gray-300">
          <p className="text-lg font-semibold text-gray-800">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <ToastContainer />
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full md:w-[50%] lg:w-[40%] p-10 bg-white rounded-lg shadow-lg border border-gray-300">
        <div className="flex flex-col text-center justify-center items-center mb-6">
          <Image
            className="mb-4"
            src="/assets/logo-mobo.svg"
            alt="Logo"
            width={100}
            height={100}
          />
          <h2 className="text-3xl font-bold text-gray-800">Welcome, {session?.user?.name}</h2>
        </div>
        <div className="flex flex-col gap-5">
          <button
            onClick={handleFeature}
            className="w-full bg-gray-700 text-base hover:bg-gray-900 focus:ring-2 focus:ring-primary-500 text-white font-semibold px-4 py-1.5 rounded-md"
          >
            Feature
          </button>
          <button
            onClick={handleSignOut}
            className="w-full bg-gray-700 text-base hover:bg-gray-900 focus:ring-2 focus:ring-primary-500 text-white font-semibold px-4 py-1.5 rounded-md"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default HomePage;
