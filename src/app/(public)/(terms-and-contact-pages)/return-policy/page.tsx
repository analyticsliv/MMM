import React from "react";

const page = () => {
  return (
    <div className="gap-10 p-28 items-center justify-center  text-start">
      <h1 className="text-4xl text-gray-default font-bold text-start">
        Kreomart Return Policy
      </h1>

      <div className="mb-6">
        <p className="text-lg text-gray-default font-normal mb-4">
          At KreoMart, we are committed to ensuring your satisfaction with every
          purchase made on our platform. We understand that occasionally, issues
          may arise with the products you receive. Rest assured, we have a
          comprehensive Return Policy in place to address such situations,
          particularly when there is damage to the products or for any other
          valid reason.
        </p>
        <span className="text-base font-medium text-gray-600 mb-4">
          Damaged Products or Returns for Other Reasons:
        </span>
        <span className="text-base font-medium text-gray-600 ">
          If you receive a product that is damaged, defective, or if you wish to
          return it for any other valid reason, please follow the guidelines
          below:
        </span>
      </div>

      <div className="mb-6">
        <h1 className="text-gray-default text-xl"> 1. Reporting a Return:</h1>
        <p className="text-gray-600 text-lg">
          {" "}
          Contact our Customer Support Team within 7 days of receiving the
          product. Provide your order number, a detailed description of the
          issue, and photographic evidence if applicable. Our team will assess
          your request and guide you through the return process.
        </p>
      </div>
      <div className="mb-6">
        <h1 className="text-gray-default text-xl">2. Eligibility Criteria:</h1>
        <p className="text-gray-600 text-lg">
          To be eligible for a return, the product must be unused, in the same
          condition as when received, and in its original packaging. Returns are
          subject to approval based on the nature of the issue and compliance
          with our policy.
        </p>
      </div>
      <div className="mb-6">
        <h1 className="text-gray-default text-xl">3. Return Process:</h1>
        <p className="text-gray-600 text-lg">
          Upon approval, we will provide you with a Return Authorization (RA)
          number and instructions on how to return the product. Ensure the
          product is securely packaged to prevent further damage during transit.
          Ship the product back to the address provided, using a reliable
          courier service. Shipping costs for returns will be borne by the
          customer unless the return is due to an error on our part.
        </p>
      </div>
      <div className="mb-6">
        <h1 className="text-gray-default text-xl">
          4. Inspection and Refund/Replacement:
        </h1>
        <p className="text-gray-600 text-lg">
          Once we receive the returned product, it will undergo a thorough
          inspection. If the return is approved, you can choose between a refund
          to the original payment method or a replacement of the same product.
          Refunds will be processed within 15 days of the product&apos;s arrival at
          our facility. Replacement products will be shipped out promptly, and
          you will receive tracking information.
        </p>
      </div>
      <div className="mb-6">
        <h1 className="text-gray-default text-xl">5. Non-Eligible Returns:</h1>
        <p className="text-gray-600 text-lg">
          Products that do not meet our eligibility criteria will not be
          accepted for return. Any item that is damaged due to misuse, neglect,
          or improper handling is not eligible for return.
        </p>
      </div>
      <div className="mb-6">
        <h1 className="text-gray-default text-xl">6. Contact Information:</h1>
        <p className="text-gray-600 text-lg">
          If you have any questions or need assistance with your return, please
          contact our Customer Support Team at support@kreomart.in or contact on
          8976723743.
        </p>
      </div>
      <div className="text-gray-600 text-lg flex mb-6 ">
        <span>Note:</span>
        <span>
          This return policy is subject to change at our discretion. Please
          refer to the most recent version on our website for updates.
        </span>
      </div>
      <div className="text-gray-600 text-lg">
        At KreoMart, we strive to provide a seamless shopping experience, and we
        are dedicated to resolving any issues you may encounter promptly and
        fairly. Your satisfaction is our top priority, and we appreciate your
        trust in us. Thank you for choosing KreoMart for your online shopping
        needs!
      </div>
    </div>
  );
};

export default page;
