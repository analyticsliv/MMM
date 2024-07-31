"use client";
import { getApis } from "@/api/client";
import SingleProduct_details from "@/components/BestSeller/SingleProduct_details";
import React, { useEffect, useState } from "react";

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [data, setData] = useState<any>();
  const [update, setUpdate] = useState<any>();
  useEffect(() => {
    (async () => {
      const k = await getApis.getProductDetail(params.slug);
      setData(k);
    })();
  }, [update]);

  return (
    <div>
      {data && (
        <SingleProduct_details
          detail={data}
          update={update}
          setUpdate={setUpdate}
        />
      )}
    </div>
  );
}
