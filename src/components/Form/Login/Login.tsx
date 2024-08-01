"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { signIn, getCsrfToken, useSession } from "next-auth/react";
import { CtxOrReq } from "next-auth/client/_utils";
import Link from "next/link";
import route from "@/routes";
// import { useToast } from "@/components/ui/use-toast";
// import Spinner from "@/components/shared/Spinner/Spinner";
// import { postApis } from "@/api/client";
// import { UserData } from "@/store/userData";
// import { useStore } from "zustand";

const Login = () => {
  const searchParams = useSearchParams();
  // const { setIsLoggedIn } = useStore(UserData);

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
  // const { toast } = useToast();

  console.log(session, "Google Session:");

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
      setLoading(false);
    }
  }, [session.status, router]);

  const handleKeepSignedInChange = () => {
    setKeepSignedIn(!keepSignedIn);
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const customApiLogin = async () => {
    try {
      const response = await fetch(
        "https://api.kreomart.com/api/accounts/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      if (response.ok) {
        setLoading(false);
        const data = await response.json();

        window?.localStorage?.setItem("access_token", data.tokens.access_token);

        // setIsLoggedIn(true);
        if (typeof window !== "undefined") {
          if (keepSignedIn) {
            window?.localStorage?.setItem(
              "userSession",
              JSON.stringify(session)
            );
          } else {
            window?.localStorage?.removeItem("userSession");
          }
        }
        router.push(callBack || "");
      } else {
        const errorData = await response.json();
        console.error("Login error:", response.statusText, errorData);
        setinvalidCredentialError(
          errorData?.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);

    // const signInResponse = signIn("credentials", {
    //   email,
    //   password,
    //   redirect: false,
    // });

    const signInResponse = await signIn('google', { redirect: false });

    if (
      (signInResponse && signInResponse.error === null) ||
      signInResponse?.error === undefined
    ) {
      setLoading(false);
      await customApiLogin();
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
    <div className="flex items-center max-md:p-5 justify-center min-h-screen bg-gray-100">
      <div className="w-full md:w-[50%] lg:w-[30%] max-md:p-5 p-10 bg-white rounded-lg shadow-lg border border-gray-300">
        <div className="flex flex-col text-center justify-center items-center mb-6">
          <Image
            className="mb-4"
            src="./assets/logo-mobo.svg"
            alt="Logo"
            width={100}
            height={100}
          />
          <h2 className="text-3xl font-bold text-gray-800">Sign In User</h2>
        </div>
        <form className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mt-2 text-lg border border-primary-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 mt-2 text-lg border border-primary-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={handlePasswordToggle}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
              >
                {/* {showPassword ? (
                  <Image src="/assets/Eye Open.png" alt="Show password" width={20} height={20} />
                ) : (
                  <Image src="/assets/Eye cross.png" alt="Hide password" width={20} height={20} />
                )} */}
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
              <label htmlFor="keepSignedIn" className="text-lg text-gray-700">Keep me signed in</label>
            </div>
            <Link href={route.ForgetPassword} className="text-sm font-semibold text-primary-600 hover:text-primary-800">
              Forgot Password?
            </Link>

          </div>
          <p className="text-gray-600 text-base">
            By checking this box, you won’t have to sign in as often on this device. For your security, we recommend only checking this box on your personal devices.
          </p>
          <button
            onClick={() => handleLogin()}
            disabled={loading} // Disable only when loading
            className={`w-full bg-primary-600 text-base hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 text-white font-semibold px-4 py-3 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleGoogleLogin()}
            disabled={loading} // Disable only when loading
            className={`w-full bg-[#4285F4] text-base hover:bg-[#357ae8] text-white font-semibold px-4 py-2.5 rounded-md flex items-center justify-center space-x-2`}
          >
            <Image src="/assets/google-logo.png" className="bg-white p-1 mr-1" alt="Google" width={22} height={22} />
            <span>Sign In with Google</span>
          </button>
          {/* <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full bg-secondary-500 text-base hover:bg-secondary-600 focus:ring-2 focus:ring-secondary-400 text-white font-semibold px-4 py-3 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Sign In with Google
          </button> */}
          <Link href={route.Register} className="block w-full text-base mt-3 text-center border border-gray-600 text-gray-700 font-semibold py-2.5 rounded-md hover:bg-gray-100">
            Create my account
          </Link>
        </form>
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

  
// "use client";
// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Image from "next/image";
// import { signIn, getCsrfToken, useSession } from "next-auth/react";
// import { CtxOrReq } from "next-auth/client/_utils";
// import Link from "next/link";
// import route from "@/routes";
// // import { useToast } from "@/components/ui/use-toast";
// // import Spinner from "@/components/shared/Spinner/Spinner";
// // import { postApis } from "@/api/client";
// // import { UserData } from "@/store/userData";
// // import { useStore } from "zustand";

// const Login = () => {
//   const searchParams = useSearchParams();
//   // const { setIsLoggedIn } = useStore(UserData);

//   const router = useRouter();

//   const callBack = searchParams.get("callback");

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [keepSignedIn, setKeepSignedIn] = useState(false);
//   const [invalidCredentialError, setinvalidCredentialError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const session = useSession();
//   // const { toast } = useToast();

//   console.log(session, "Google Session:");

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedSessionJSON = window?.localStorage?.getItem("userSession");

//       if (storedSessionJSON) {
//         const storedSession = JSON.parse(storedSessionJSON);
//         console.log("User session found:", storedSession);
//         signIn("credentials", {
//           email: storedSession?.user?.email,
//           token: storedSession?.accessToken,
//           redirect: false,
//         });
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (session.status === "authenticated") {
//       // toast({
//       //   title: "Successfully Logged In",
//       //   description: "Welcome to kreomart",
//       // });
//       router.push(callBack || "/");
//       setLoading(false);
//     }
//   }, [session.status, router, ]);

//   const handleKeepSignedInChange = () => {
//     setKeepSignedIn(!keepSignedIn);
//   };

//   const handlePasswordToggle = () => {
//     setShowPassword(!showPassword);
//   };

//   const customApiLogin = async () => {
//     try {
//       const response = await fetch(
//         "https://api.kreomart.com/api/accounts/login/",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password }),
//         }
//       );
//       if (response.ok) {
//         setLoading(false);
//         const data = await response.json();

//         window?.localStorage?.setItem("access_token", data.tokens.access_token);

//         // setIsLoggedIn(true);
//         if (typeof window !== "undefined") {
//           if (keepSignedIn) {
//             window?.localStorage?.setItem(
//               "userSession",
//               JSON.stringify(session)
//             );
//           } else {
//             window?.localStorage?.removeItem("userSession");
//           }
//         }
//         router.push(callBack || "");
//       } else {
//         const errorData = await response.json();
//         console.error("Login error:", response.statusText, errorData);
//         setinvalidCredentialError(
//           errorData?.message || "Login failed. Please check your credentials."
//         );
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogin = async () => {
//     setLoading(true);

//     // const signInResponse = signIn("credentials", {
//     //   email,
//     //   password,
//     //   redirect: false,
//     // });

//     const signInResponse = await signIn('google')

//     if (
//       (signInResponse && signInResponse.error === null) ||
//       signInResponse?.error === undefined
//     ) {
//       setLoading(false);
//       await customApiLogin();
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setLoading(true);

//     const signInResponse = await signIn('google')
   

//     if (
//       (signInResponse && signInResponse.error === null) ||
//       signInResponse?.error === undefined
//     ) {
//       setLoading(false);
//       router.push(callBack || "");
//       // await customApiLogin();
//     }
//   };

//   return (
//     <div className=" flex items-center justify-center p-4">
//       <div className="p-4 mx-auto rounded-2xl  max-w-md md:max-w-3xl w-full">
//         <div className="items-center text-sm md:text-md">
//           <div>
//             <div className="text-center justify-center">
//               <Image
//                 className="mx-auto p-2 "
//                 src="./assets/logo-mobo.svg"
//                 alt="Logo"
//                 width={40}
//                 height={40}
//               />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-default text-center ">
//               Sign in User
//             </h2>
//           </div>
//           <form className="w-full">
//             <div>
//               <label className="block w-full text-lg text-gray-600">
//                 email
//               </label>
//               <input
//                 autoComplete={email}
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-3 text-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
//               />
//             </div>
//             <div>
//               <label className="  w-full text-lg text-gray-600">Password</label>
//             </div>
//             <div className="relative">
//               <input
//                 autoComplete="password"
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-3  text-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
//               />
//               <button
//                 type="button"
//                 onClick={handlePasswordToggle}
//                 className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-600 cursor-pointer"
//               >
//                 {showPassword ? (
//                   <Image
//                     src="/assets/Eye Open.png"
//                     className="items-center pt-2"
//                     alt={""}
//                     width={20}
//                     height={20}
//                   />
//                 ) : (
//                   <Image
//                     src="/assets/Eye cross.png"
//                     className=" items-center pt-2"
//                     alt={""}
//                     width={20}
//                     height={20}
//                   />
//                 )}
//               </button>
//             </div>

//             {invalidCredentialError && (
//               <div className="text-red-default text-sm">
//                 {invalidCredentialError}
//               </div>
//             )}

//             <div className="text-right mt-2">
//               <Link
//                 href={route.ForgetPassword}
//                 className="text-sm font-semibold hover:text-primary-800 focus:text-blue-700 underline  underline-offset-8"
//               >
//                 Forgot Password?
//               </Link>
//             </div>
//             <div className="mt-4 flex items-center">
//               <input
//                 type="checkbox"
//                 id="keepSignedIn"
//                 className="mr-2 w-7 h-7 rounded-none  border-none shadow-gray-600 accent-secondary-900"
//                 onChange={handleKeepSignedInChange}
//               />

//               <label htmlFor="keepSignedIn" className="text-lg">
//                 Keep me signed in
//               </label>
//             </div>
//             <p className="ml-10 text-gray-600 text-base ">
//               By checking this box you won&apos;t have to sign in as often on
//               this device. For your security, we recommend only checking this
//               box on your personal devices.
//             </p>

//             <button
//               onClick={() => handleLogin()}
//               disabled={loading} // Disable only when loading
//               className={`w-full bg-primary hover:bg-primary-700 focus:bg-primary-400 text-base text-white font-semibold px-4 py-3 mt-6 ${
//                 loading ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               Sign In
//             </button>
//             <button
//               onClick={() => handleGoogleLogin()}
//               disabled={loading} // Disable only when loading
//               className={`w-full bg-primary hover:bg-primary-700 focus:bg-primary-400 text-base text-white font-semibold px-4 py-3 mt-6 ${
//                 loading ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               Sign In with google
//             </button>
//             <Link href={route.Register}>
//               <button className="w-full border text-base border-black font-semibold py-3 mt-3 ">
//                 Create my account
//               </button>
//             </Link>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };
// export async function getServerSideProps(context: CtxOrReq | undefined) {
//   return {
//     props: {
//       csrfToken: await getCsrfToken(context),
//     },
//   };
// }

// export default Login;
// function postLogin(arg0: { email: string; password: string }) {
//   throw new Error("Function not implemented.");
// }
