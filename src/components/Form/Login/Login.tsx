/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { signIn, getCsrfToken, useSession } from "next-auth/react";
import { CtxOrReq } from "next-auth/client/_utils";
import Link from "next/link";
import route from "@/routes";
import useToast from '../../hooks/toast';
import { toast, ToastContainer } from "react-toastify";


const Login = () => {
  const searchParams = useSearchParams();
  // const { setIsLoggedIn } = useStore(UserData);
  const notify = useToast();

  const router = useRouter();

  const callBack = searchParams.get("callback");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [invalidCredentialError, setinvalidCredentialError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const session = useSession();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSessionJSON = window?.localStorage?.getItem("userSession");

      if (storedSessionJSON) {
        const storedSession = JSON.parse(storedSessionJSON);
        console.log("User session found:", storedSession);
        signIn("credentials", {
          email: storedSession?.user?.email,
          token: storedSession?.accessToken,
          redirect: false,
        });
      }
    }
  }, []);

  useEffect(() => {
    if (session.status === "authenticated") {
      // toast({
      //   title: "Successfully Logged In",
      //   description: "Welcome to kreomart",
      // });
      router.push(callBack || "/");
      localStorage.setItem('userSession', JSON.stringify(session?.data));
      notify("You have been signed out.", 'info'); // Show sign-out toast
      setLoading(false);
    }
  }, [session.status, router]);

  const handleKeepSignedInChange = () => {
    setKeepSignedIn(!keepSignedIn);
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };


  const handleLogin = async () => {
    setLoading(true);

    const signInResponse = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("in cred login.......", signInResponse)
    if (
      (signInResponse && signInResponse.error !== null) ||
      signInResponse?.error !== undefined
    ) {
      // setLoading(false);
      // router.push(callBack || "/");
      setinvalidCredentialError(signInResponse?.error)
      notify("There is some issue in sign in", 'error'); // Show sign-out toast
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    const signInResponse = await signIn('google', { redirect: false });


    if (
      (signInResponse && signInResponse.error === null) ||
      signInResponse?.error === undefined
    ) {
      setLoading(false);
      router.push(callBack || "");
      // await customApiLogin();
    }
  };

  return (
    <div className="flex lg:h-[100dvh] justify-center items-center bg-white min-h-screen ">
      <ToastContainer />
      <div className="h-[72%] 2xl:h-[70%] md:w-[50%] rounded-[20px] max-md:p-5 px-[8%] flex flex-col justify-center gap-10 bg-background shadow-lg border border-gray-300">
        <div className="">
          <img
            className="mb-4"
            src="./assets/AnalyticsLiv_Logo_Perfact_Space.png"
            alt="Logo"
            height={180}
            width={180}
          />
        </div>
        <form className="space-y-6 flex flex-col md:gap-2 xl:gap-1 2xl:gap-6">
          <div>
            <label className="block text-2xl font-medium text-textcolor">Email</label>
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-16 py-5 px-7 mt-2 bg-transparent text-xl font-medium text-textcolor placeholder-[#BEBEBE] 
              border border-[#C2C2C2] border-primary-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-2xl font-medium text-textcolor ">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-16 py-5 px-7 mt-2 bg-transparent text-xl font-medium text-textcolor placeholder-[#BEBEBE] 
                border border-[#C2C2C2] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={handlePasswordToggle}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
              >
                {showPassword ? (
                  <Image src="/assets/Eye Open.png" alt="Show password" width={20} height={20} />
                ) : (
                  <Image src="/assets/Eye cross.png" alt="Hide password" width={20} height={20} />
                )}
              </button>
            </div>
          </div>
          {invalidCredentialError && (
            <div className="text-red-600 text-sm">{invalidCredentialError}</div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="keepSignedIn"
                className="mr-2 rounded-sm border-gray-300 accent-primary-600"
                onChange={handleKeepSignedInChange}
              />
              <label htmlFor="keepSignedIn" className="text-2xl font-medium text-textcolor">Remember me</label>
            </div>
            <Link href={route.ForgetPassword} className="text-xl font-medium text-[#30486A]">
              Forgot Password?
            </Link>

          </div>
          {/* <p className="text-gray-600 text-base">
            By checking this box, you won’t have to sign in as often on this device. For your security, we recommend only checking this box on your personal devices.
          </p> */}
          <button
            onClick={() => handleLogin()}
            disabled={loading} // Disable only when loading
            className={`w-full bg-primary xl:h-16 md:h-12 text-2xl rounded-lg font-medium text-white ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Log In
          </button>
          {/* <Link href={route.Register} className="block w-full text-base mt-3 text-center border border-gray-600 text-gray-700 font-semibold py-2.5 rounded-md hover:bg-gray-100">
            Create my account
          </Link> */}
          <div className="text-2xl font-medium text-textcolor">
            Not registered yet? <Link href={route.Register} className="text-xl font-medium text-primary"> Create account </Link>
          </div>
          <button
            onClick={() => handleGoogleLogin()}
            disabled={loading} // Disable only when loading
            className={`w-full bg-primary text-2xl font-medium  text-white xl:h-16 md:h-12 rounded-lg flex items-center justify-center space-x-2`}
          >
            <Image src="/assets/google-logo.png" className="bg-white p-1 mr-1 rounded-full" alt="Google" width={22} height={22} />
            <span>Log In with Google</span>
          </button>
        </form>
      </div>
      <div className="relative flex flex-col w-[50%] py-6 bg-primary rounded-[20px] mx-auto h-[72%] 2xl:h-[70%]">
        <div className="flex flex-col text-center z-10">
          <div className="text-[25px] xl:text-[45px] text-white font-semibold text-left px-20">Welcome Back to</div>
          <div className="flex text-[25px] xl:text-[45px] text-white font-semibold text-left px-20">
            AnalyticsLiv
            <img alt="AnalyticsLiv" className="p-0 h-[40px] xl:h-[60px]" src="assets/AnalyticsLiv_Logo_Short_Right (1).png" />
          </div>
        </div>
        <img
          className="absolute right-0 bottom-[5%] 2xl:bottm-[15%]"
          src="/assets/LOGO_BG_BLUR_RIGHT (1).png"
          alt="Vector"
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

export async function getServerSideProps(context: CtxOrReq | undefined) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default Login;
function postLogin(arg0: { email: string; password: string }) {
  throw new Error("Function not implemented.");
}
