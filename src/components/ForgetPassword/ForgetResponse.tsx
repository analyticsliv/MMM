import Image from "next/image";

const ForgetResponse = () => {
  return (
    <div className="relative w-full flex flex-col items-center justify-start py-[52px] px-0 box-border gap-[20px] text-left text-5xl text-grey-scale-black-russian font-book-16">
      <div className="flex flex-col items-center justify-start gap-[4px]">
        <Image
          className="relative w-8 h-8 object-cover"
          alt="logo"
          src="/assets/Logo.png"
          height={8}
          width={8}
        />
        <div className="relative leading-[130%]">Forgot password</div>
      </div>
      <div className="self-stretch flex flex-col items-center justify-start gap-[8px] text-center text-lg">
        <div className="self-stretch relative tracking-[-0.4px] leading-[130%] font-medium">
          Reset Password
        </div>
        <div className="self-stretch relative text-base leading-[130%] text-grey-scale-carbon-gray">
          Thank you, an email has been sent to you. Please check your spam and
          junk folders, if no email is received you may not have an account
          registered with this email address.
        </div>
      </div>
    </div>
  );
};

export default ForgetResponse;
