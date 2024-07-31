import Pages from "@/routes";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="text-start p-16 items-center justify-center gap-6">
      <h1 className="text-gray-700 text-2xl font-medium mb-6">
        Shipping Policy
      </h1>
      <div>
        <h2 className="text-lg text-gray-600 font-normal mb-6 ">
          Effective Date : October 13, 2023
        </h2>
        <p className="text-gray-600 text-lg font-normal mb-6">
          At Kreomart, we are dedicated to ensuring a smooth and efficient
          shipping experience for our valued customers. This Shipping Policy is
          designed to provide you with clear information about our shipping
          methods and procedures.
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl"> 1. Order Processing</h2>
        <p className="text-gray-600 text-base  flex flex-col">
          <span>
            {" "}
            Orders are typically processed within 1-2 business days after
            payment confirmation.
          </span>
          <span>
            {" "}
            Orders received after [specific time] will be processed on the next
            business day.{" "}
          </span>
          <span>
            For customized or made-to-order products, additional processing time
            may be required, and we will communicate this to you.
          </span>
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl">2. Shipping Options </h2>
        <p className="text-gray-600 text-base">
          We offer the following shipping options:
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl">Standard Shipping</h2>
        <p className="text-gray-600 text-base flex flex-col">
          {" "}
          <span>Estimated delivery time: 3-7 business days.</span>
          <span> Shipping fee: 100 Rs. on Standard Shipping.</span>
        </p>
      </div>{" "}
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl"> Express Shipping</h2>
        <p className="text-gray-600 text-base flex flex-col">
          <span>Estimated delivery time: 2-3 business days.</span>
          <span>Shipping fee: 199Rs.</span>
        </p>
      </div>{" "}
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl"> 3. Shipping Fees</h2>
        <p className="text-gray-600 text-base flex flex-col">
          <span>
            {" "}
            Shipping fees are determined by factors such as weight, dimensions,
            destination, and chosen shipping method.
          </span>
          <span>
            We may offer free shipping on orders that meet specific minimum
            purchase requirements, subject to our discretion.
          </span>
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl">4. Order Tracking</h2>
        <p className="text-gray-600 text-base flex flex-col">
          <span>
            {" "}
            Once your order is shipped, you will receive tracking information.
          </span>
          <span>
            You can track your order using the provided tracking number on our
            website or through the selected carrier&apos;s website.
          </span>
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl">5. Shipping Carriers</h2>
        <p className="text-gray-600 text-base flex flex-col">
          <span>
            {" "}
            We collaborate with reputable carriers, including [List of Carrier
            Names], to deliver your shipments.
          </span>
          <span>
            The choice of carrier depends on the shipping method and
            destination.{" "}
          </span>
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl">6. Shipping Restrictions</h2>
        <p className="text-gray-600 text-base flex flex-col">
          <span>
            We do not deliver to P.O. boxes. Please provide a valid street
            address for shipping.
          </span>{" "}
          Certain products may have shipping restrictions or extra charges due
          to their nature or delivery location.{" "}
          <span>These details will be clearly explained during checkout.</span>
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl">8. Shipping Address</h2>
        <p className="text-gray-600 text-base flex flex-col">
          <span>Accurate shipping information is your responsibility.</span>
          <span>
            Any additional charges due to incorrect or incomplete address
            details are borne by the customer.
          </span>
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl">9. Order Delivery</h2>
        <p className="text-gray-600 text-base flex flex-col">
          <span>
            Kreomart is not responsible for delays caused by unforeseen
            circumstances such as extreme weather, natural disasters, or
            carrier-related issues.
          </span>
          <span>
            {" "}
            In case of a delayed delivery, we will collaborate with the carrier
            to resolve the issue promptly.
          </span>
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl">
          10. Lost or Damaged Shipments
        </h2>
        <p className="text-gray-600 text-base flex flex-col">
          <span>
            {" "}
            If your order is lost or damaged during transit, please contact our
            customer support within 3-7 days of the estimated delivery date.
          </span>
          <span>
            {" "}
            will assist you in resolving the issue and arranging a replacement
            or refund, as appropriate.
          </span>
          We
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl"> 11. Returns and Refunds</h2>
        <p className="text-gray-600 text-base">
          {" "}
          For information on our return and refund policy, please refer to our{" "}
          <Link href={Pages.Returns}>Return Policy.</Link>
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl"> 12. Contact Information</h2>
        <p className="text-gray-600 text-base flex flex-col">
          {" "}
          <span>
            If you have any questions or concerns about our Shipping Policy or
            the status of your order,please contact our customer support team:
          </span>
          <span> Email: support@kreomart.in</span>
          <span>Phone: +91 8976723743</span>
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl"> 13. Policy Changes</h2>
        <p className="text-gray-600 text-base flex flex-col">
          <span>
            Kreomart reserves the right to update and modify this Shipping
            Policy as required.
          </span>
          <span>
            {" "}
            We encourage our customers to periodically review this policy to
            stay informed about any changes.
          </span>
          <span>
            {" "}
            By placing an order with Kreomart, you acknowledge that you have
            read, understood, and agreed to our Shipping Policy.
          </span>
        </p>
      </div>
      {/* <div className="text-gray-default text-lg font-medium">Kreomart</div> */}
    </div>
  );
};

export default page;
