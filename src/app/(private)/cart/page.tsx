import ProgressBar from "@/components/CartOption/ProgressBar";
import React from "react";
import { getServerSession } from "next-auth";
import { POST } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Random_products from "@/components/BestSeller/RandomProducts";

const CartPage = async () => {
  const session = await getServerSession(POST);
  if (!session) {
    redirect("/login");
    return null;
  }

  return (
    <div className="bg-[#FAF9F8]">
      <ProgressBar />
      <Random_products />
    </div>
  );
};

export default CartPage;
