"use client";
import { useCheckAuth } from "@/components/hooks/useCheckAuth";
import React from "react";

const page = ({ }: any) => {
  const { loading, session } = useCheckAuth()
  return (
    <>
      <h1>In feature screen if user is logedin</h1>

      <div className="md:hidden">
        <div className="flex flex-row items-center justify-center my-8 text-lg font-medium">
          {/* <Breadcrumbs paths={[{ label: "Home" }, { label: "My Account" }]} /> */}
          <h1>In feature screen if user is logedin </h1>
        </div>
        {/* <PhoneSideBar activeTab={"Profile"} /> */}
      </div>
    </>
  );
};

export default page;
