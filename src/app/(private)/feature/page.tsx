"use client";
import { useCheckAuth } from "@/components/hooks/useCheckAuth";
import SearchBar from "@/components/searchbar/search";
import React from "react";

const page = ({ }: any) => {
  const { loading, session } = useCheckAuth()
  return (
    <>
      <div>
        <div className="w-full flex items-center pl-20 h-[70px] bg-[#F6F8FE]">
          <SearchBar />
        </div>
      </div>
    </>
  );
};

export default page;
