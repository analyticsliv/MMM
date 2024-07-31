import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div>
      {/*Header*/}
      <div className=" w-full flex p-6 justify-between bg-[#faf9f8] ">
        <div className="flex gap-10 ">
          <div>
            <Skeleton className="w-[103px] h-[18px]" />
          </div>
          <div>
            <Skeleton className="w-[56px] h-[18px]" />
          </div>
          <div>
            <Skeleton className="w-[56px] h-[18px]" />
          </div>
          <div>
            <Skeleton className="w-[56px] h-[18px]" />
          </div>
          <div>
            <Skeleton className="w-[56px] h-[18px]" />
          </div>
        </div>
        <div className="flex gap-4 ">
          <div>
            <Skeleton className="w-[271px] h-[18px]" />
          </div>
          <div>
            <Skeleton className="w-[18px] h-[18px]" />
          </div>
          <div>
            <Skeleton className="w-[18px] h-[18px]" />
          </div>
          <div>
            <Skeleton className="w-[18px] h-[18px]" />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Skeleton className="rounded mt-6 w-[271px] h-[18px]" />
      </div>

      {/*  CartSection  */}

      <div>
        <div className="flex flex-item justify-center">
          <Skeleton className="rounded mt-6 w-[186px] h-[38px]" />
        </div>
        <div className="flex flex-item justify-center space-x-4">
          <Skeleton className="rounded mt-6 w-[116px] h-[21px]" />
          <Skeleton className="rounded mt-6 w-[116px] h-[21px]" />
          <Skeleton className="rounded mt-6 w-[116px] h-[21px]" />
          <Skeleton className="rounded mt-6 w-[116px] h-[21px]" />
        </div>
        <div className="flex flex-item space-x-8 justify-center">
          <Skeleton className="rounded mt-6 w-[594px] h-[618px]" />
          <Skeleton className="rounded mt-6 w-[438px] h-[348px]" />
        </div>
      </div>

      {/* RelatedProduct*/}

      <div className="  justify-center p-10">
        <div className="flex flex-item justify-between  mb-8">
          <Skeleton className="rounded mt-2 w-[138px] h-[37px]" />
          <Skeleton className="rounded mt-2 w-[138px] h-[37px]" />
        </div>
        <div className="justify-items-center grid grid-cols-2 sm:grid-cols-2   md:grid-cols-3 lg:grid-cols-4 ">
          <div className="flex-item space-y-1 ">
            <Skeleton className="w-[262px] h-[339px]" />
            <Skeleton className="w-[262px] h-[26px]" />
            <Skeleton className="w-[130px] h-[15px]" />
            <Skeleton className="w-[130px] h-[15px]" />
          </div>
          <div className="flex-item space-y-1 ">
            <Skeleton className="w-[262px] h-[339px]" />
            <Skeleton className="w-[262px] h-[26px]" />
            <Skeleton className="w-[130px] h-[15px]" />
            <Skeleton className="w-[130px] h-[15px]" />
          </div>
          <div className="flex-item space-y-1 ">
            <Skeleton className="w-[262px] h-[339px]" />
            <Skeleton className="w-[262px] h-[26px]" />
            <Skeleton className="w-[130px] h-[15px]" />
            <Skeleton className="w-[130px] h-[15px]" />
          </div>
          <div className="flex-item space-y-1 ">
            <Skeleton className="w-[262px] h-[339px]" />
            <Skeleton className="w-[262px] h-[26px]" />
            <Skeleton className="w-[130px] h-[15px]" />
            <Skeleton className="w-[130px] h-[15px]" />
          </div>
        </div>
      </div>

      {/*  Footer  */}

      <div className="flex-col flex-item mt-20 p-12 justify-between bg-[#faf9f8] w-full">
        <div className=" flex flex-item  justify-between ">
          <div className=" flex-col space-y-4">
            <div className="space-y-4">
              <Skeleton className="h-[32px] w-[154px]" />
              <Skeleton className="h-[21px] w-[372px]" />
            </div>

            <div className="flex flex-item space-x-4">
              <Skeleton className="h-[24px] w-[24px]" />
              <Skeleton className="h-[24px] w-[24px]" />
              <Skeleton className="h-[24px] w-[24px]" />
              <Skeleton className="h-[24px] w-[24px]" />
            </div>
          </div>
          <div className="flex flex-item justify-evenly w-[631px] h-[138px]">
            <div className="space-y-4">
              <Skeleton className="h-[18px] w-[71px]" />
              <Skeleton className="h-[18px] w-[110px]" />
              <Skeleton className="h-[18px] w-[110px]" />
              <Skeleton className="h-[18px] w-[110px]" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-[18px] w-[71px]" />
              <Skeleton className="h-[18px] w-[110px]" />
              <Skeleton className="h-[18px] w-[110px]" />
              <Skeleton className="h-[18px] w-[110px]" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-[18px] w-[71px]" />
              <Skeleton className="h-[18px] w-[110px]" />
              <Skeleton className="h-[18px] w-[110px]" />
              <Skeleton className="h-[18px] w-[110px]" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-[18px] w-[71px]" />
              <Skeleton className="h-[18px] w-[110px]" />
              <Skeleton className="h-[18px] w-[110px]" />
              <Skeleton className="h-[18px] w-[110px]" />
            </div>
          </div>
        </div>
        <div className="flex flex-item justify-between mt-8 border-t-2 border-inherit ">
          <Skeleton className="h-[18px] w-[111px] mt-2" />
          <Skeleton className="h-[18px] w-[347px] mt-2" />
        </div>
      </div>
    </div>
  );
};

export default loading;
