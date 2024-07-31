import Link from "next/link";
import React from "react";
import Pages from "@/routes";

const page = () => {
  return (
    <div className="gap-10 p-28 items-center justify-center  text-start">
      <h1 className="text-4xl text-gray-default font-bold text-start">
        Terms and Condition
      </h1>
      <div className="mb-6">
        <h1 className=" text-gray-default text-xl">Acceptance of terms </h1>
        <p className="text-gray-600 text-lg">
          By accessing or using the Kreomart Online Marketplace website
          (hereinafter referred to as &quot;the Website&quot;) or any services
          provided by Kreomart (hereinafter referred to as &quot;the
          Company&quot;), you agree to comply with and be bound by these Terms
          and Conditions (hereinafter referred to as &quot;Terms&quot;). If you
          do not agree with these Terms, please do not use our services.
        </p>
      </div>
      <div className="mb-6">
        <h1 className="text-gray-default text-xl">General information </h1>
        <p className=" text-gray-600 text-lg">
          Kreomart is an online marketplace hosted in India that offers a wide
          range of products for men, women, and home accessories. Users of any
          age can purchase products from the Website. Users can create an
          account on the Website using their email id . Kreomart accepts online
          payments through various online payment platforms. Users have the
          option to return purchased products, subject to our Return Policy.
          Users can submit product reviews after receiving their purchased
          items. The Website is linked to Kreomart&apos;s social media handles.
        </p>
      </div>
      <div className="mb-6">
        <h1 className="text-gray-default text-xl">User Eligibility</h1>
        <p className="text-gray-600 text-lg">
          To use our services, you must be at least 18 years old or the legal
          age in your jurisdiction to enter into a contract. You are responsible
          for ensuring that the information you provide during registration or
          while using our services is accurate and up-to-date.
        </p>
      </div>
      <div className="mb-6">
        <h1 className="text-gray-default text-xl">Privacy Policy </h1>
        <p className="text-gray-600 text-lg">
          Your use of the Website and services is also governed by our Privacy
          Policy, which can be found{" "}
          <Link href={Pages.PrivacyPolicy} className="font-bold underline">
            here
          </Link>
          . Please review the Privacy Policy to understand how we collect, use,
          and protect your personal information.
        </p>
      </div>
      <div className="mb-6">
        <h1 className="text-gray-default text-xl">Product Information </h1>
        <p className="text-gray-600 text-lg">
          Kreomart strives to provide accurate product information, including
          descriptions, images, and pricing. However, we do not guarantee the
          accuracy, completeness, or reliability of any product information on
          our Website. Product availability and pricing may change without prior
          notice.
        </p>
      </div>
      <div className="mb-6">
        <h1 className="text-gray-default text-xl">Return and Refunds</h1>
        <p className="text-gray-600 text-lg">
          Users can return purchased products according to the terms outlined in
          our Return Policy.
        </p>
      </div>
      <div className="mb-6">
        <h1 className="text-gray-default text-xl">User Reviews</h1>
        <p className="text-gray-600 text-lg">
          Users may submit reviews of products they have purchased. These
          reviews should be based on their genuine experiences with the product.
          Kreomart reserves the right to moderate and remove reviews that
          violate our review guidelines.
        </p>
      </div>
    </div>
  );
};

export default page;
