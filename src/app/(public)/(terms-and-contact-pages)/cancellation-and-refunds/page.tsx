import React from "react";

const page = () => {
  return (
    <div className="text-center p-16 items-center justify-center gap-6">
      <h1 className="text-2xl text-[#030822] text-start mb-6">
        Cancellation and Refund Policy
      </h1>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl">1.Cancellation Policy</h2>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl"></h2>
        <p className="text-gray-600 text-base flex flex-col">
          <strong>1.1 Cancellation of Orders</strong>
          You may cancel your order with Kreomart under the following
          conditions:
          <span>
            You must request the cancellation within 2 days of placing the
            order.
          </span>
          <span>
            Cancellations will not be accepted after the specified period, as
            our products may have already been prepared or shipped.
          </span>
          <strong> 1.2 How to Request Cancellation</strong>
          To request a cancellation, please contact our customer support team at{" "}
          <strong>
            Email:support@kreomart.in <span>Contact No:+91 8976723743 </span>
          </strong>
          .Please include your order number and the reason for the cancellation
          request.
          <strong>1.3 Refunds for Cancellations</strong>
          If your order is eligible for cancellation as per this policy and you
          have made a payment, we will refund the full amount paid to the
          original payment method used during the order placement.
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl">2. Refunds Policy</h2>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl">Refund Eligibility</h2>
        <p className="text-gray-600 text-base flex flex-col">
          {" "}
          <strong>
            1.1. Product Refunds: Refunds for physical products are eligible in
            the following situations:
          </strong>
          <span>Product defects or damage upon delivery.</span>
          <span>
            Orders canceled before shipment, subject to our cancellation policy.
          </span>
          <span>
            Orders returned within 10 days of purchase in their original
            condition, subject to restocking fees, if applicable.
          </span>
          <strong>
            1.2. Service Refunds: Refunds for services are eligible under the
            following circumstances:
          </strong>
          <span>
            Non-performance or failure to meet agreed-upon service terms.
          </span>
          <span>
            Services canceled before the commencement date, subject to our
            cancellation policy.
          </span>
          <span>
            Any other situation explicitly mentioned in the service agreement.
          </span>
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl">Refund Process</h2>
        <p className="text-gray-600 text-base flex flex-col">
          {" "}
          <strong>
            2.1 Requesting a Refund: To request a refund, customers must follow
            these steps:
          </strong>
          <span>
            Contact our customer support team at{" "}
            <strong>support@kreomart.in</strong> or{" "}
            <strong> +91 8976723743</strong>
            to initiate the refund process.
          </span>
          <span>
            Provide your full name, order or service reference number, and a
            detailed explanation of the reason for the refund request.
          </span>
          <strong>2.2 Refund Approval: </strong>
          Refund requests will be evaluated, and approval is subject to the
          eligibility criteria mentioned in section 1 of this policy.
          <strong>2.3 Refund Timeframe:</strong>
          Approved refunds will be processed within 2 days after confirmation of
          the refund request.
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl"> Contact Us</h2>
        <p className="text-gray-600 text-base">
          If you have questions or concerns about our refund policy, please
          contact us at <strong>support@kreomart.in</strong> or{" "}
          <strong> +91 8976723743</strong>.{" "}
        </p>
      </div>
      <div className="text-start mb-6">
        <h2 className="text-gray-default text-xl">Changes to This Policy</h2>
        <p className="text-gray-600 text-base">
          We may update this Refund Policy from time to time. The updated
          version will be posted on our website with the &quot;Last Updated&quot; date.
        </p>
      </div>
    </div>
  );
};

export default page;
