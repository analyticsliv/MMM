"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Props {
  params: {
    uid: string;
    token: string;
  };
}

export default function Page({ params }: Props) {
  const router = useRouter();
  console.log(params.uid, params.token);
  useEffect(() => {
    const fetchActivation = async ({
      uid,
      token,
    }: {
      uid: string;
      token: string;
    }) => {
      try {
        const response = await axios.post(
          `https://api.kreomart.com/api/accounts/verify/token/${uid}/${token}/`
        );

        if (response.status === 200) {
          console.log(response);
          router.push("/activation-successfull");
        } else {
          console.log("Error");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchActivation(params);
  }, []);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="p-4 mx-auto rounded-2xl max-w-md md:max-w-2xl w-full">
          <h1 className="text-2xl font-bold text-primary text-center pb-4">
            Verifying your account...
          </h1>

          <p className="text-gray-600 text-center text-lg">Please wait...</p>
        </div>
      </div>
    </>
  );
}
