"use client";
import { useCheckAuth } from "@/components/hooks/useCheckAuth";
import SearchBar from "@/components/searchbar/search";
import User from "@/components/User/user";
import React, { useEffect } from "react";

const page = ({ }: any) => {
  const { loading, session } = useCheckAuth();
  const handleFeatureVisit = async (email: any) => {
    const response = await fetch('/api/feature-visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log(data.message);
  };

  useEffect(() => {
    if (!loading && session?.user?.email) {
      handleFeatureVisit(session?.user?.email);
    }
  }, [loading, session]);

  return (
    <>
      <div>
        <div className="w-full flex items-center pl-20 h-[70px] bg-[#F6F8FE]">
          <SearchBar />
        </div>
        <User />
      </div>
    </>
  );
};

export default page;
