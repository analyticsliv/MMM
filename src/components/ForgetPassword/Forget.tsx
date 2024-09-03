"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ForgetResponse from "./ForgetResponse";

const Forget = () => {
  const [email, setEmail] = useState("");
  const [forgetresponse, setForgetResponse] = useState(false);

  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://api.kreomart.com/api/accounts/user/reset/password/",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log({ data });
        setForgetResponse(true);
        // router.push("/")
      } else {
        const errorData = await response.json();
        if (response.status === 400) {
          console.error(
            "Bad request. Please check your email and try again.",
            errorData
          );
        } else if (response.status === 404) {
          console.error(
            "User not found. Please check the provided email address.",
            errorData
          );
        } else {
          console.error(
            "Reset password error:",
            response.statusText,
            errorData
          );
        }
      }
    } catch (error) {
      console.error("Error during reset password:", error);
    }
  };

  return forgetresponse ? (
    <ForgetResponse />
  ) : (
    <div className="flex lg:h-[100dvh] justify-center items-center bg-white min-h-screen">
      <div className="h-[72%] 2xl:h-[70%] md:w-[50%] rounded-[20px] max-md:p-5 px-[8%] flex flex-col justify-center gap-10 bg-background shadow-lg border border-gray-300">
        <div>
          <img
            className="mb-4"
            src="./assets/AnalyticsLiv_Logo_Perfact_Space.png"
            alt="Logo"
            height={180}
            width={180}
          />
        </div>
        <form
          className="space-y-6 flex flex-col md:gap-2 xl:gap-1 2xl:gap-6"
          onSubmit={handleSubmit}
          action="#"
          method="POST"
        >
          <div>
            <h2 className="text-2xl font-bold text-textcolor text-center mb-10">
              Forgot password
            </h2>
          </div>
          <div className="text-center mb-5 text-xl text-textcolor">
            In order to change your password, we need to verify your identity.
            Enter the email address or mobile phone number associated with your
            MMM account.
          </div>
          <div>
            <label className="block text-2xl font-medium text-textcolor">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email Address"
              className="w-full h-16 py-5 px-7 mt-2 bg-transparent text-xl font-medium text-textcolor placeholder-[#BEBEBE] 
            border border-[#C2C2C2] border-primary-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary xl:h-16 md:h-12 text-2xl rounded-lg font-medium text-white"
          >
            Continue
          </button>
        </form>
      </div>
      <div className="relative flex flex-col w-[50%] py-6 bg-primary rounded-[20px] mx-auto h-[72%] 2xl:h-[70%]">
        <div className="flex flex-col text-center z-10">
          <div className="text-[25px] xl:text-[45px] text-white font-semibold text-left px-20">
            Welcome Back to
          </div>
          <div className="flex text-[25px] xl:text-[45px] text-white font-semibold text-left px-20">
            AnalyticsLiv
            <img
              alt="AnalyticsLiv"
              className="p-0 h-[40px] xl:h-[60px]"
              src="assets/AnalyticsLiv_Logo_Short_Right (1).png"
            />
          </div>
        </div>
        <img
          className="absolute right-0 bottom-[5%] 2xl:bottm-[15%]"
          src="/assets/LOGO_BG_BLUR_RIGHT (1).png"
          alt="Blur"
        />
        <img
          className="absolute h-[100px] xl:h-[120px] top-[45%] 2xl:top-[50%] left-[20%] 2xl:left-[22%]"
          src="/assets/Vector (1).png"
          alt="Vector"
        />
        <img
          className="absolute bottom-0 h-[350px] 2xl:h-[450px] left-[25%]"
          src="/assets/Gentleman (1).png"
          alt="gentleman"
        />
      </div>
    </div>
  );
};
export default Forget;
