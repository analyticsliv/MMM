"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const HomePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("object", session)

    if (status === "loading") {
      // Wait for session status to load
      return;
    }

    if (status === "unauthenticated") {
      // Redirect to login if unauthenticated
      router.push("/login");
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [status]);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ redirect: false });
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full md:w-[50%] lg:w-[30%] p-10 bg-white rounded-lg shadow-lg border border-gray-300">
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
            className="w-full bg-primary-600 text-base hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 text-white font-semibold px-4 py-3 rounded-md"
          >
            Feature
          </button>
          <button
            onClick={handleSignOut}
            className="w-full bg-primary-600 text-base hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 text-white font-semibold px-4 py-3 rounded-md"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
