"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div>
      {/*Header*/}
      {/* <div className=" w-full flex p-6 justify-between ">
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
      {/*    Promotional bar    */}
      {/* <div className="flex justify-center items-center">
        <Skeleton className="rounded mt-2 w-full h-[49px]" />
      </div> */}
      {/*    HeroSection    */}
      <div className="  flex  items-center justify-between m-4  w-[1336px] h-[680px] ">
        <div className="flex flex-col  justify-center gap-2  mr-16  w-[454px] h-[172px] space-y-2">
          <Skeleton className=" rounded h-7 w-full" />

          <Skeleton className="h-5 w-[300px]" />

          <Skeleton className="h-[46px] w-[138px]" />
        </div>
        <div className="">
          <Skeleton className="h-[600px] w-[600px] rounded-full " />
        </div>
      </div>
      {/*    CatgorySection    */}
      <div className="">
        <div className="flex flex-item justify-between">
          <Skeleton className="rounded mt-2 w-[138px] h-[38px]" />
          <Skeleton className="rounded mt-2 w-[138px] h-[38px]" />
        </div>
        <div className="flex flex-item justify-evenly">
          <Skeleton className="rounded mt-2 w-[357px] h-[420px]" />
          <Skeleton className="rounded mt-2 w-[357px] h-[420px]" />
          <Skeleton className="rounded mt-2 w-[357px] h-[420px]" />
          <Skeleton className="rounded mt-2 w-[357px] h-[420px]" />
        </div>
      </div>
      {/*    Banner1    */}
      <div className="  flex  items-center justify-between m-4  w-[1336px] h-[680px] ">
        <div className="flex flex-col  justify-center gap-2  mr-16  w-[454px] h-[172px] space-y-2">
          <Skeleton className=" rounded h-7 w-full" />

          <Skeleton className="h-5 w-[300px]" />

          <Skeleton className="h-[46px] w-[138px]" />
        </div>
        <div className="">
          <Skeleton className="h-[333px] w-[333px] rounded-full " />
        </div>
      </div>

      {/*    BestArrival/NewArrival    */}
      <div className=" ">
        <div className="flex flex-item justify-center space-x-4 mb-8">
          <Skeleton className="rounded mt-2 w-[138px] h-[37px]" />
          <Skeleton className="rounded mt-2 w-[138px] h-[37px]" />
        </div>
        <div className="justify-items-center grid grid-cols-2 sm:grid-cols-2   md:grid-cols-3 lg:grid-cols-4 gap-8">
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
        <div className="flex flex-item justify-center mt-8 ">
          <Skeleton className="rounded mt-2 w-[138px] h-[50px] space-y-4" />
        </div>
      </div>

      {/*    Banner2   */}

      <div className="  flex  items-center justify-between m-8 p-10 bg-[#faf9f8]">
        <div className="flex flex-col  justify-center gap-2  mr-16  w-[454px] h-[172px] space-y-2">
          <Skeleton className="  h-[49px] w-full" />
          <Skeleton className="  h-[49px] w-full" />

          <div className="flex flex-item  a=item-center space-x-1">
            <Skeleton className="h-[41px] w-[396px]" />
            <Skeleton className="h-[47px] w-[128px]" />
          </div>

          <Skeleton className="h-[18px] w-[396px]" />
        </div>
        <div className="">
          <Skeleton className="h-[333px] w-[333px] rounded-full " />
        </div>
      </div>

      {/*  OfferSection   */}

      <div className="  flex  items-center justify-between   p-10 bg-[#faf9f8] ">
        <div className="">
          <Skeleton className="h-[400px] w-[400px] rounded-full " />
        </div>
        <div className="flex flex-col  justify-center gap-2  mr-16  w-[454px] h-[172px] space-y-2">
          <Skeleton className="h-[21px] w-[106px]" />
          <Skeleton className="h-[26px] w-[267px]" />
          <Skeleton className="h-[16px] w-[467px]" />
          <Skeleton className="h-[16px] w-[137px]" />
          <Skeleton className="h-[52px] w-[137px]" />
          <Skeleton className="h-[70px] w-[460px]" />
          <Skeleton className="h-[72px] w-[137px]" />
        </div>
      </div>

      {/*  FeatureSection  */}

      <div className=" flex flex-item p-6">
        <div className="flex flex-item relative w-full h-[47px] p-6 ">
          <div className="p-4">
            <Skeleton className="h-6 w-6 " />
          </div>
          <div className="flex-col flex-item space-y-4">
            <Skeleton className="w-[138px] h-[23px]" />
            <Skeleton className="w-[138px] h-[18px]" />
          </div>
        </div>
        <div className="flex flex-item relative w-full h-[47px] p-6">
          <div className="p-4">
            <Skeleton className="h-6 w-6 " />
          </div>
          <div className="flex-col flex-item space-y-4">
            <Skeleton className="w-[138px] h-[23px]" />
            <Skeleton className="w-[138px] h-[18px]" />
          </div>
        </div>
        <div className="flex flex-item relative w-full h-[47px] p-6">
          <div className="p-4">
            <Skeleton className="h-6 w-6 " />
          </div>
          <div className="flex-col flex-item space-y-4">
            <Skeleton className="w-[138px] h-[23px]" />
            <Skeleton className="w-[138px] h-[18px]" />
          </div>
        </div>
        <div className="flex flex-item relative w-full h-[47px] p-6">
          <div className="p-4">
            <Skeleton className="h-6 w-6 " />
          </div>
          <div className="flex-col flex-item space-y-4">
            <Skeleton className="w-[138px] h-[23px]" />
            <Skeleton className="w-[138px] h-[18px]" />
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
  );
};

export default loading;
