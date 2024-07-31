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
    <div className=" flex items-center justify-center">
      <div className=" max-h-screen rounded-2xl items-center max-w-lg md:max-w-4xl justify-center mb-20">
        <div className="items-center  text-sm md:text-md">
          <form
            className="mt-6 mx-20 "
            onSubmit={handleSubmit}
            action="#"
            method="POST"
          >
            <div>
              <div className="text-center justify-center">
                <Image
                  className="mx-auto p-2 "
                  src="/assets/logo-mobo.svg"
                  alt="Logo"
                  width={40}
                  height={40}
                />
              </div>
              <h2 className="text-2xl font-bold text-[#030822] text-center mb-10">
                Forgot password
              </h2>
            </div>
            <div className=" text-center mb-5">
              In order to change your password, we need to verify your identity.
              Enter the email address or mobile phone number associated with
              your Kreomart account.
            </div>
            <div>
              <label className="block w-full text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email Address"
                className="w-full px-4 py-3 bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full  bg-[#020044] hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold  px-4 py-3 mt-6"
            >
              continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Forget;
