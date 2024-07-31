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
          `http://127.0.0.1:8000/api/accounts/user/password/reset/confirm/${uid}/${token}/`
        );

        if (response.status === 200) {
          console.log(response);
          router.push("/reset-password");
        } else {
          console.log("Error");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchActivation(params);
  }, [params, router]);

  return <></>;
}
