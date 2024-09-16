import React from "react";
// import Reset from "@/components/ResetPassword/Reset";

interface Props {
  params: {
    uid: string;
    token: string;
  };
}

const page = ({ params }: Props) => {
  return (
    <div>
      {/* <Reset
        params={{
          uid: params.uid,
          token: params.token,
        }}
      /> */}
    </div>
  );
};

export default page;
