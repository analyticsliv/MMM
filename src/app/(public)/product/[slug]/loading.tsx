"use client";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <div className="px-16 mx-auto max-w-screen-3xl">

      {/*  ProductDispaly  */}

      <div className="flex flex-item  space-x-4 p-10 w-full">
        <div className="space-y-2">
          <Skeleton className=" w-[72px] h-[85px]" />
          <Skeleton className=" w-[72px] h-[85px]" />
          <Skeleton className=" w-[72px] h-[85px]" />
          <Skeleton className=" w-[72px] h-[85px]" />
          <Skeleton className=" w-[72px] h-[85px]" />
        </div>
        <div>
          <Skeleton className=" w-[490px] h-[610px]" />
        </div>
        <div className="space-y-10  px-4">
          <div className="space-y-2">
            <Skeleton className=" w-[110px] h-[18px]" />
            <Skeleton className=" w-[434px] h-[18px]" />
            <Skeleton className=" w-[434px] h-[18px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className=" w-[110px] h-[18px]" />
            <Skeleton className=" w-[434px] h-[18px]" />
            <Skeleton className=" w-[434px] h-[18px]" />
          </div>
          <div className=" flex flex-item justify-between">
            <Skeleton className=" w-[169px] h-[52px]" />
            <Skeleton className=" w-[169px] h-[52px]" />
          </div>
        </div>
      </div>

      {/*  ProductDitails  */}

      <div className="space-y-8 p-10 ">
        <div className="flex flex-item gap-[80px]">
          <Skeleton className="rounded mt-6 w-[110px] h-[18px]" />
          <Skeleton className="rounded mt-6 w-[110px] h-[18px]" />
          <Skeleton className="rounded mt-6 w-[110px] h-[18px]" />
        </div>
        <div className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="rounded  w-[157px] h-[18px]" />
            <Skeleton className="rounded w-[110px] h-[18px]" />
            <Skeleton className="rounded w-full  h-[18px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="rounded  w-[157px] h-[18px]" />
            <Skeleton className="rounded w-[110px] h-[18px]" />
            <Skeleton className="rounded w-full  h-[18px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="rounded  w-[157px] h-[18px]" />
            <Skeleton className="rounded w-[110px] h-[18px]" />
            <Skeleton className="rounded w-full  h-[18px]" />
          </div>
          <div className="flex flex-item justify-center ">
            <Skeleton className=" w-[169px] h-[52px]" />
          </div>
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

      
    </div>
  );
};

export default Loading;
