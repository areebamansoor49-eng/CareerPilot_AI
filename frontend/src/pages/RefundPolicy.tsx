import { Link } from "react-router-dom";

function RefundPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          to="/"
          className="mb-8 inline-flex text-sm text-blue-400 hover:text-blue-300"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold">
          Refund & Cancellation Policy
        </h1>

        <p className="mt-3 text-sm text-slate-400">
          Last updated: September 19, 2026
        </p>

        <div className="mt-10 space-y-8 text-slate-300 leading-7">
          <section>
            <h2 className="text-2xl font-semibold text-white">
              1. Subscription Plans
            </h2>

            <p className="mt-3">
              CareerPilot AI may offer monthly and yearly
              subscription plans. The currently advertised
              plans are $5 per month and $50 per year.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              2. Cancellation
            </h2>

            <p className="mt-3">
              You may cancel your subscription using the
              subscription management options provided
              through the payment system.
            </p>

            <p className="mt-3">
              After cancellation, access to paid features
              may continue until the end of the applicable
              billing period unless otherwise stated during
              cancellation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              3. Refund Requests
            </h2>

            <p className="mt-3">
              Refund requests may be considered when there
              has been an accidental duplicate charge, a
              technical issue that prevented reasonable use
              of a paid service, or another circumstance
              where a refund is required by applicable law.
            </p>

            <p className="mt-3">
              Refund requests are reviewed individually.
              Submitting a request does not automatically
              guarantee that a refund will be issued.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              4. Non-Refundable Circumstances
            </h2>

            <p className="mt-3">
              Refunds may not be available solely because
              you did not use the service after purchasing a
              subscription, except where applicable law
              provides otherwise.
            </p>

            <p className="mt-3">
              Refund eligibility may also depend on the
              circumstances of the transaction and the
              applicable terms of the payment provider.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              5. How to Request a Refund
            </h2>

            <p className="mt-3">
              To request a refund or report a billing issue,
              please contact CareerPilot AI through the
              Contact page and provide the email address
              associated with your subscription and relevant
              transaction details.
            </p>

            <p className="mt-3">
              Please do not send payment card numbers,
              passwords, or other sensitive payment
              credentials through the contact form.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              6. Payment Processing
            </h2>

            <p className="mt-3">
              Payments and subscription billing are
              processed through Paddle. Payment-related
              requests may also be subject to Paddle's
              applicable policies and procedures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              7. Changes to This Policy
            </h2>

            <p className="mt-3">
              CareerPilot AI may update this Refund &
              Cancellation Policy from time to time.
              Changes will be published on this page with a
              revised update date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              8. Contact
            </h2>

            <p className="mt-3">
              If you have questions about cancellation,
              billing, or refunds, please contact CareerPilot
              AI through the Contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default RefundPolicy;