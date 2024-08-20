"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import FormInput from "./FormInput";
import SuccessPage from "./SuccessPage";
// import Icon from "@/components/shared/Icon";
import Link from "next/link";
import route from "@/routes";
// import { toast } from "@/components/ui/use-toast";

const Registration = () => {
  const [phone, setPhone] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState<ReactNode>(<></>);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const session = useSession();

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };
  const router = useRouter();
  const handleClick = () => {
    router.push("/login");
  };
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
    setFirstnameError(validateFirstname(value));
  };

  const handleLastnameChange = (e: any) => {
    const value = e.target.value;
    setLastname(value);
    setLastnameError(validateLastname(value));
  };

  const validatePhone = (value: string): string => {
    let phoneNumber = value.replace(/\D/g, "");
    console.log("In validator --",phoneNumber,value)
    if (phoneNumber.length === 10) {
      phoneNumber.startsWith("91") ? setPhone(`+91 ${phoneNumber}`) : setPhone(`${phoneNumber}`);
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
    console.log("Phonnnnn",value)
    setPhone(value);
    const phoneError = validatePhone(value);
    setPhoneError(phoneError);
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
        <ul>
          <li>{requirements?.[0]}</li>
          <li>{requirements?.[1]}</li>
          <li>{requirements?.[2]}</li>
          <li>{requirements?.[3]}</li>
          <li>{requirements?.[4]}</li>
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
            <div className="text-red-600">Password too weak </div>
            <div>{errorMessage}</div>
          </>
        )}
      </div>
    );
  };

  const handleEmailChange = (e: any) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e: any) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  // const handleSocialAuth = async (provider: string) => {
  //   try {
  //     await signIn(provider);
  //   } catch (error) {
  //     console.error(`Social authentication error for ${provider}:`, error);
  //   }
  // };

  useEffect(() => {
    if (session.status === "authenticated") {
      // toast({
      //   title: " You Are Successfully registerd , You're logged In",
      //   description: "Welcome to kreomart",
      // });
      console.log("Toast message:", "Successfully Logged In");
      router.push("/");
    }
  }, [session.status, router]);

  const BASE_API_URL = "https://api.kreomart.com/api/accounts/";
  // const BASE_API_URL = "http://127.0.0.1:8000/api/accounts/";

  const handleRegistration = async (e: any) => {
    e.preventDefault();

    try {
      const userData = {
        first_name: firstname,
        last_name: lastname,
        email: email,
        phone_number: phone,
        password: password,
      };

      console.log("Registration data:", userData);

      const response = await fetch(`${BASE_API_URL}registeration/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const data = await response.json();

        if (
          data &&
          data.email &&
          data.email[0] === "user with this email already exists."
        ) {
          setEmailError("User with this email already exists.");
          setEmail("");
        } else {
          // Handle other error cases based on backend response
          handleApiErrors(data);
        }
      } else {
        setRegistrationSuccess(true);
      }
    } catch (error: any) {
      console.error("Registration error:", error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleApiErrors = (data: any) => {
    if (data) {
      setFirstnameError(data.first_name || "");
      setLastnameError(data.last_name || "");
      setPhoneError(data.phone_number || "");
      setEmailError(data.email || "");
      setPasswordError(data.password || "");
    }
    // Add additional error handling logic as needed
  };

  return registrationSuccess ? (
    <SuccessPage email={email} />
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="w-full md:w-[50%] lg:w-[30%] p-8 bg-white rounded-lg shadow-lg border border-gray-300">
        <div className="flex flex-col text-center justify-center items-center mb-3">
          <Image
            className="mb-4"
            src="./assets/logo-mobo.svg"
            alt="Logo"
            width={100}
            height={100}
          />
          <h2 className="text-xl font-bold text-gray-800">
            Create your MMM account
          </h2>
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
        <form className="space-y-6" onSubmit={handleRegistration} method="POST">
          <div>
            <FormInput
              label="First Name"
              type="text"
              value={firstname}
              onChange={handleFirstnameChange}
              placeholder="John"
              error={firstnameError}
            />
            <FormInput
              label="Last Name"
              type="text"
              value={lastname}
              onChange={handleLastnameChange}
              placeholder="Doe"
              error={lastnameError}
            />
            <FormInput
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Phone Number"
              error={phoneError}
            />
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="example@gmail.com"
              error={emailError}
            />
            <div className="relative">
              <FormInput
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter Password"
              />
              <button
                type="button"
                onClick={handlePasswordToggle}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
              >
                {showPassword ? (
                  <Image src="/assets/Eye Open.png" className="items-center pt-11" alt="Show password" width={20} height={20} />
                ) : (
                  <Image src="/assets/Eye cross.png" className="items-center pt-11" alt="Hide password" width={20} height={20} />
                )}
              </button>
            </div>
            {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>}
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
          </div>
          <button
            type="submit"
            disabled={isRegistering}
            className={`w-full bg-primary-600 text-base hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 text-white font-semibold px-4 py-3 rounded-md ${isRegistering ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isRegistering ? "Registering..." : "Register"}
          </button>
          <Link href={route.Login} className="block w-full text-base mt-3 text-center border border-gray-600 text-gray-700 font-semibold py-2.5 rounded-md hover:bg-gray-100">
            Already have an account? Sign In
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Registration;
