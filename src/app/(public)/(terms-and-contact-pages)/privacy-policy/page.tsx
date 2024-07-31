import React from "react";

const page = () => {
  return (
    <div className="text-start p-16 items-center justify-center gap-6">
      <h1 className="text-gray-default text-2xl font-medium">Privacy Policy</h1>
      <div className="text-gray-600 text-lg m-4">
        <strong>Last Updated: October,13 2023</strong>
      </div>
      <div className=" text-start mb-6">
        <p className=" text-gray-600 text-lg ">
          Welcome to Kreomart (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;).
          We are committed to protecting your privacy and ensuring the security
          of your personal information. This Privacy Policy explains how we
          collect, use, and disclose your information when you use our website,
          products, and services.
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl"> Information We Collect</h2>
        <p className=" flex flex-col text-gray-600 text-lg">
          <strong> Personal Information:</strong> We may collect personal
          information, such as your name, email address, and contact
          information, when you voluntarily provide it to us. This may occur
          when you:
          <span>Register for an account</span>
          <span>Contact us for support or inquiries</span>
          <span>Subscribe to our newsletter</span>
          <span>Participate in surveys or contests</span>
          <span>Make a purchase</span>
        </p>
      </div>
      <div className="text-start mb-6">
        <p className=" text-gray-600 text-lg">
          {" "}
          <strong>Automatically Collected Information:</strong> We may
          automatically collect certain information when you visit our website,
          including your IP address, browser type, device information, and usage
          data. This information helps us understand how you use our services
          and improve your experience.
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl">
          {" "}
          How We Use Your Information
        </h2>
        <p className="flex flex-col text-gray-600 text-lg">
          We use your information for various purposes, including:
          <span>Providing and maintaining our services</span>
          <span>Personalizing your experience</span>
          <span>Processing transactions</span>
          <span>Sending you updates and newsletters</span>
          <span>Analyzing usage to improve our services</span>
          <span>Complying with legal requirements</span>
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl">
          How We Share Your Information
        </h2>
        <p className="flex flex-col text-gray-600 text-lg">
          We may share your information with third parties in the following
          circumstances:
          <span>With your consent</span>
          <span>
            To service providers who assist us in delivering our services
          </span>
          <span>To comply with legal obligations</span>
          <span>To protect our rights, privacy, safety, or property</span>
          <span>In the event of a business transfer or merger</span>
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl"> Your Rights and Choices</h2>
        <p className="flex flex-col text-gray-600 text-lg">
          {" "}
          You have the right to:
          <span>Access, correct, or delete your personal information</span>
          <span>Opt-out of marketing communications</span>
          <span>Object to the processing of your information</span>
          <span>Request data portability</span>
          <span>
            {" "}
            To exercise these rights, please contact us at{" "}
            <strong>+91 8976723743</strong>
          </span>
          .
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl"> Data Security</h2>
        <p className=" text-gray-600 text-lg">
          We implement security measures to protect your information. However,
          no data transmission or storage is 100% secure. We cannot guarantee
          the security of your information.
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl">Changes to This Policy</h2>
        <p className=" text-gray-600 text-lg">
          We may update this Privacy Policy from time to time. The updated
          version will be posted on our website with the &quot;Last
          Updated&quot; date.
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl">Contact Us</h2>
        <p className=" text-gray-600 text-lg">
          {" "}
          If you have questions or concerns about this Privacy Policy, please
          contact us at <strong>+91 8976723743</strong>.
        </p>
      </div>
    </div>
  );
};

export default page;
