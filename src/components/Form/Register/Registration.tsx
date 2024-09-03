"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import route from "@/routes";
import useToast from '../../hooks/toast';
import { toast, ToastContainer } from "react-toastify";

const Registration = () => {
  const [phone, setPhone] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const notify = useToast();
  const session = useSession();

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };
  const router = useRouter();

  const validateFirstname = (value: string) => {
    if (value.trim() === "") {
      return "First name is required.";
    }
    return "";
  };

  // Custom validation function for lastname
  const validateLastname = (value: string) => {
    if (value.trim() === "") {
      return "Last name is required.";
    }
    return "";
  };

  // Event handlers for input fields
  const handleFirstnameChange = (e: any) => {
    const value = e.target.value;
    setFirstname(value);
    setError(validateFirstname(value));
  };

  const handleLastnameChange = (e: any) => {
    const value = e.target.value;
    setLastname(value);
    setError(validateLastname(value));
  };

  const validatePhone = (value: string): string => {
    let phoneNumber = value.replace(/\D/g, "");
    console.log("In validator --", phoneNumber, value);
    if (phoneNumber.length === 10) {
      phoneNumber.startsWith("91")
        ? setPhone(`+91 ${phoneNumber}`)
        : setPhone(`${phoneNumber}`);
      return "";
    }
    if (phoneNumber.startsWith("91") && phoneNumber.length > 10) {
      setPhone(`+ ${phoneNumber}`);
      return "";
    }
    if (phoneNumber === "") {
      setPhone(``);
      return "";
    }
    return "Please enter a valid 10-digit phone number.";
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    console.log("Phonnnnn", value);
    setPhone(value);
    const phoneError = validatePhone(value);
    setError(phoneError);
  };

  // Custom validation function for email
  const validateEmail = (value: string) => {
    if (!value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  // Custom validation function for password
  const validatePassword = (value: string) => {
    const isLengthValid = value.length >= 8 && value.length <= 20;

    const hasLowercase = /[a-z]/.test(value);
    const hasUppercase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialCharacter = /[!@#$%^&*]/.test(value);

    const meetsCriteria =
      isLengthValid &&
      hasLowercase &&
      hasUppercase &&
      hasNumber &&
      hasSpecialCharacter;

    const requirements = [
      `${isLengthValid ? "✔" : ""} 8-20 characters`,
      `${hasLowercase ? "✔" : ""} At least one lowercase letter`,
      `${hasUppercase ? "✔" : ""} At least one uppercase letter`,
      `${hasNumber ? "✔" : ""} At least one number`,
      `${hasSpecialCharacter ? "✔" : ""} At least one special character `,
    ];

    const errorMessage = (
      <div>
        <div>Must contain:</div>
        <ul className="flex flex-wrap">
          <li className="flex">{requirements?.[0]}, &nbsp;</li>
          <li className="flex">{requirements?.[1]}, &nbsp;</li>
          <li className="flex">{requirements?.[2]}, &nbsp;</li>
          <li className="flex">{requirements?.[3]}, &nbsp;</li>
          <li className="flex">{requirements?.[4]}, &nbsp;</li>
        </ul>
      </div>
    );

    return (
      <div>
        {meetsCriteria ? (
          <div className="text-primary-600 flex items-center mr-1">
            {/* <Image src="/assets/Success.png" alt="Success" width={16} height={16} /> */}
            😎 Your password is ready to go!
          </div>
        ) : (
          <>
            <div className="text-red-600">Password is too weak </div>
            <div>{errorMessage}</div>
          </>
        )}
      </div>
    );
  };

  const handleEmailChange = (e: any) => {
    const value = e.target.value;
    setEmail(value);
    setError(validateEmail(value));
  };

  const handlePasswordChange = (e: any) => {
    const value = e.target.value;
    setPassword(value);
    setError(validatePassword(value));
  };

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/");
    }
  }, [session.status, router]);

  const BASE_API_URL = process.env.BASE_API_URL

  const handleRegistration = async (e: any) => {
    e.preventDefault();
    setIsRegistering(true);

    try {
      const userData = {
        name: `${firstname} ${lastname}`,
        email: email,
        mobile: phone,
        password: password
      };


      const response = await fetch('api/auth/signup', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const data = await response.json();

        console.log("response data:", data?.message);
        if (data) {
          notify(data?.message, 'error');
          setError(data?.message);
        } else {
          // Handle other error cases based on backend response
          handleApiErrors(data);
        }
      } else {
        notify("You have been registered sucessfully.", 'sucess'); // Show sign-out toast
        router.push("/");
      }
    } catch (error: any) {
      console.error("Registration error:", error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleApiErrors = (data: any) => {
    if (data) {
      setError(data.first_name || "");
      setError(data.last_name || "");
      setError(data.phone_number || "");
      setError(data.email || "");
      setError(data.password || "");
    }
    // Add additional error handling logic as needed
  };

  return <>
    <ToastContainer />
    <div className="flex lg:h-[100dvh] justify-center items-center bg-white min-h-screen relative">
      <div className="h-[85%] 2xl:h-[78%] md:w-[50%] rounded-[20px] max-md:p-5 px-[8%] flex flex-col justify-center gap-10 bg-background shadow-lg border border-gray-300">
        <div className="text-center">
          <img
            className="mb-4"
            src="./assets/AnalyticsLiv_Logo_Perfact_Space.png"
            alt="Logo"
            height={180}
            width={180}
          />
        </div>
        {/* <button
            type="button"
            onClick={() => handleSocialAuth("google")}
            className="w-full flex h-16 my-2 justify-center text-center items-center border border-black"
          >
            <Image
              className="mr-2"
              src="./assets/Google.svg"
              alt="google"
              width={12}
              height={12}
            />
            Continue with Google
          </button>
          <button className="w-full flex h-16 my-2 justify-center text-center items-center border border-black">
            <Image
              className="mr-2"
              src="./assets/Facebook.svg"
              alt="google"
              width={12}
              height={12}
            />
            Continue with FaceBook
          </button>
          <div className=" text-center my-6">OR</div> */}
        <form
          className="space-y-2 flex flex-col gap-1"
          onSubmit={handleRegistration}
          method="POST"
        >
          <div>
            <label className="block text-2xl font-medium text-textcolor">
              First Name
            </label>
            <input
              required
              type="text"
              value={firstname}
              placeholder="John"
              onChange={handleFirstnameChange}
              className="w-full h-12 py-5 px-7 mt-2 bg-transparent text-xl font-medium text-textcolor placeholder-[#BEBEBE] 
          border border-[#C2C2C2] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-2xl font-medium text-textcolor">
              Last Name
            </label>
            <input
              required
              type="text"
              value={lastname}
              placeholder="Doe"
              onChange={handleLastnameChange}
              className="w-full h-14 py-5 px-7 mt-2 bg-transparent text-xl font-medium text-textcolor placeholder-[#BEBEBE] 
          border border-[#C2C2C2] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-2xl font-medium text-textcolor">
              Phone Number
            </label>
            <input
              required
              type="tel"
              value={phone}
              placeholder="Phone Number"
              onChange={handlePhoneChange}
              className="w-full h-14 py-5 px-7 mt-2 bg-transparent text-xl font-medium text-textcolor placeholder-[#BEBEBE] 
          border border-[#C2C2C2] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-2xl font-medium text-textcolor">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              placeholder="example@gmail.com"
              onChange={handleEmailChange}
              className="w-full h-14 py-5 px-7 mt-2 bg-transparent text-xl font-medium text-textcolor placeholder-[#BEBEBE] 
          border border-[#C2C2C2] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="relative">
            <label className="block text-2xl font-medium text-textcolor">
              Password
            </label>
            <input
              required
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Enter Password"
              onChange={handlePasswordChange}
              className="w-full h-14 py-5 px-7 mt-2 bg-transparent text-xl font-medium text-textcolor placeholder-[#BEBEBE] 
          border border-[#C2C2C2] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              onClick={handlePasswordToggle}
              className="absolute inset-y-0 right-0 flex items-center mt-9 px-7 text-gray-500"
            >
              {showPassword ? (
                <img
                  src="/assets/Eye Open.png"
                  alt="Show password"
                  width={20}
                  height={20}
                />
              ) : (
                <img
                  src="/assets/Eye cross.png"
                  alt="Hide password"
                  width={20}
                  height={20}
                />
              )}
            </button>
          </div>
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          <p className="text-gray-600 mt-4 text-sm">
            By creating an account, you’re agreeing to the MMM{" "}
            <Link
              href={route.TermsAndConditions}
              className="text-secondary-500"
            >
              terms & conditions
            </Link>{" "}
            and MMM{" "}
            <Link href={route.PrivacyPolicy} className="text-secondary-500">
              privacy policy
            </Link>
          </p>
          <button
            type="submit"
            disabled={isRegistering}
            className={`w-full bg-primary xl:h-14 md:h-12 text-2xl rounded-lg font-medium text-white ${isRegistering ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isRegistering ? "Registering..." : "Register"}
          </button>
          <Link
            href={route.Login}
            className="block w-full text-base mt-3 text-center border border-gray-600 text-gray-700 font-semibold py-2.5 rounded-md hover:bg-gray-100"
          >
            Already have an account? Sign In
          </Link>
        </form>
      </div>
      <div className="h-[85%] 2xl:h-[78%] md:w-[50%] relative flex flex-col w-[50%] py-6 bg-primary rounded-[20px] mx-auto">
        <div className="flex flex-col text-center z-10">
          <div className="text-[25px] xl:text-[45px] text-white font-semibold text-left px-20">
            Welcome Back to
          </div>
          <div className="flex text-[25px] xl:text-[45px] text-white font-semibold text-left px-20">
            AnalyticsLiv
            <img
              alt="AnalyticsLiv"
              className="p-0 h-[40px] xl:h-[60px]"
              src="assets/AnalyticsLiv_Logo_Short_Right (1).png"
            />
          </div>
        </div>
        <img
          className="absolute right-0 bottom-[5%] 2xl:bottom-[15%]"
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
          alt="Gentleman"
        />
      </div>
    </div>
  </>
};

export default Registration;
