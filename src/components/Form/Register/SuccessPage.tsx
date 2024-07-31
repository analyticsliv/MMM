import React, { useState } from "react";

interface SuccessPageProps {
  email: string;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ email }) => {
  const [resendLinkSuccess, setResendLinkSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const resendActivationLink = async (email: any) => {
    try {
      setIsResending(true);

      const response = await fetch(
        "https://api.kreomart.com/api/accounts/get/acctivation/token/",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        console.error("Error resending activation link:", data);
        // Handle errors as needed
      } else {
        console.log("Activation link resent successfully!");
        setResendLinkSuccess(true);
      }
    } catch (error) {
      console.error("Error resending activation link:", error);
      // Handle errors as needed
    }
    setIsResending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="p-4 mx-auto rounded-2xl max-w-md md:max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-primary text-center pb-4">
          Registration Successful!!
        </h1>
        <p className="text-gray-600 text-center text-lg">
          Thank you for registering with Kreomart. Your account has been
          successfully created.
        </p>
        <p className="text-gray-600 text-lg text-center">
          Please check your email and verify your account to get started.
        </p>

        {resendLinkSuccess ? (
          <p className="text-secondary text-lg items-center text-center  mr-1">
            Activation link resent successfully!
          </p>
        ) : (
          <button
            onClick={() => resendActivationLink(email)}
            // className="w-full bg-primary hover:bg-blue-400 focus:bg-blue-400 text-base text-white font-semibold px-4 py-3 mt-6"
            disabled={isResending}
            className={`w-full bg-primary hover:bg-primary-700 focus:bg-primary-400 text-base text-white font-semibold px-4 py-3 mt-6 ${
              isResending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Resend Link
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
