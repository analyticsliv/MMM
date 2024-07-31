"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div>
      {/*Header*/}
      {/* <div className=" w-full flex p-6 justify-between bg-[#faf9f8] ">
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
      </div> */}
      {/*Banner*/}
      <div>
        <Skeleton className="w-full h-[300px] mt-6" />
      </div>
      {/*Seperator*/}
      <div className=" flex justify-center item-center">
        <Skeleton className="w-[271px] h-[18px] mt-6 " />
      </div>
      {/* Filter*/}
      <div className="flex m-4 p-4 justify-betweeen gap-4 bg-[#faf9f8] ">
        <div className="w-1/4 ">
          <div className="  flex-item mb-4 ">
            <Skeleton className="h-[20px] w-[121px]  " />
          </div>
          <div className="flex-item space-y-2 mt-4  ">
            <Skeleton className="w-[110px] h-[18px]" />
            <Skeleton className="w-[212px] h-[18px]" />
            <Skeleton className="w-[212px] h-[18px]" />
            <Skeleton className="w-[212px] h-[18px]" />
          </div>
          <div className="flex-item space-y-2 mt-4 ">
            <Skeleton className="w-[110px] h-[18px]" />
            <Skeleton className="w-[212px] h-[18px]" />
            <Skeleton className="w-[212px] h-[18px]" />
            <Skeleton className="w-[212px] h-[18px]" />
          </div>
          <div className="flex-item space-y-2 mt-4  ">
            <Skeleton className="w-[110px] h-[18px]" />
            <Skeleton className="w-[212px] h-[18px]" />
            <Skeleton className="w-[212px] h-[18px]" />
            <Skeleton className="w-[212px] h-[18px]" />
          </div>
          <div className="flex-item space-y-2 mt-4 ">
            <Skeleton className="w-[110px] h-[18px]" />
            <Skeleton className="w-[212px] h-[18px]" />
            <Skeleton className="w-[212px] h-[18px]" />
            <Skeleton className="w-[212px] h-[18px]" />
          </div>
          <div className=" flex-item space-y-2  mt-4 ">
            <Skeleton className="w-[142px] h-[50px]" />
          </div>
        </div>
        {/*Product*/}
        <div className="">
          <div className=" justify-items-center grid grid-cols-2 sm:grid-cols-2   md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="flex-item space-y-2 ">
              <Skeleton className="w-[262px] h-[339px]" />
              <Skeleton className="w-[262px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
            </div>
            <div className="flex-item space-y-2">
              <Skeleton className="w-[262px] h-[339px]" />
              <Skeleton className="w-[262px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
            </div>
            <div className="flex-item space-y-2">
              <Skeleton className="w-[262px] h-[339px]" />
              <Skeleton className="w-[262px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
            </div>
            <div className="flex-item space-y-2">
              <Skeleton className="w-[262px] h-[339px]" />
              <Skeleton className="w-[262px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
            </div>
            <div className="flex-item space-y-2 ">
              <Skeleton className="w-[262px] h-[339px]" />
              <Skeleton className="w-[262px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
            </div>
            <div className="flex-item space-y-2">
              <Skeleton className="w-[262px] h-[339px]" />
              <Skeleton className="w-[262px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
            </div>
            <div className="flex-item space-y-2">
              <Skeleton className="w-[262px] h-[339px]" />
              <Skeleton className="w-[262px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
            </div>
            <div className="flex-item space-y-2">
              <Skeleton className="w-[262px] h-[339px]" />
              <Skeleton className="w-[262px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
            </div>
            <div className="flex-item space-y-2 ">
              <Skeleton className="w-[262px] h-[339px]" />
              <Skeleton className="w-[262px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
            </div>
            <div className="flex-item space-y-2">
              <Skeleton className="w-[262px] h-[339px]" />
              <Skeleton className="w-[262px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
            </div>
            <div className="flex-item space-y-2">
              <Skeleton className="w-[262px] h-[339px]" />
              <Skeleton className="w-[262px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
            </div>
            <div className="flex-item space-y-2">
              <Skeleton className="w-[262px] h-[339px]" />
              <Skeleton className="w-[262px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
              <Skeleton className="w-[130px] h-[18px]" />
            </div>
          </div>
        </div>

        {/*  Footer */}
        {/* <div className="flex-col flex-item mt-20 p-12 justify-between bg-[#faf9f8] w-full">
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
        </div> */}
      </div>
    </div>
  );
};

export default loading;
