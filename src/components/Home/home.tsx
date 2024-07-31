"use client";
import { signOut } from "next-auth/react"
import NextAuthProvider from "@/utils/nextProvider";

const HomePage = () => {

  // console.log(categories, "categories");

  return (
    <>
      {/* <NextAuthProvider> */}
        <button onClick={()=>signOut()}>LOgout</button>
      {/* </NextAuthProvider> */}
    </>
  );
};

export default HomePage;
