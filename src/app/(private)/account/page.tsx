import PhoneSideBar from "@/components/OrderHistory/PhoneSideBar";
import Breadcrumbs from "@/components/shared/Breadcrumb/Breadcrumb";
import React from "react";

const page = ({}: any) => {
  return (
    <div className="md:hidden">
      <div className="flex flex-row items-center justify-center my-8 text-lg font-medium">
        <Breadcrumbs paths={[{ label: "Home" }, { label: "My Account" }]} />
      </div>
      <PhoneSideBar activeTab={"Profile"} />
    </div>
  );
};

export default page;
