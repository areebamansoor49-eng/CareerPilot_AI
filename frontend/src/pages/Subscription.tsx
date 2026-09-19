import {
  FaCheckCircle,
  FaCrown,
  FaArrowLeft,
  FaRocket,
} from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUserEmail,
} from "../utils/subscription";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

type Plan = "monthly" | "yearly";

function Subscription() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [selectedPlan, setSelectedPlan] =
    useState<Plan>("monthly");

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Get the currently logged-in user's
       * email from the same auth source used
       * throughout CareerPilot.
       */
      const userEmail =
        getCurrentUserEmail();

      let userId = "";

      try {
        const rawUser =
          localStorage.getItem("user");

        if (rawUser) {
          const user =
            JSON.parse(rawUser);

          userId =
            user?.id ||
            user?.userId ||
            user?.sub ||
            "";
        }
      } catch (parseError) {
        console.warn(
          "Unable to read user ID:",
          parseError
        );
      }

      if (!userEmail) {
        setError(
          "Please log in before subscribing."
        );

        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/payment/checkout`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email: userEmail,
            userId,
            plan: selectedPlan,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to create checkout."
        );
      }

      if (!data.checkoutUrl) {
        throw new Error(
          "Paddle checkout URL was not returned."
        );
      }

      window.location.href =
        data.checkoutUrl;
    } catch (error) {
      console.error(
        "Subscription checkout error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to start subscription."
      );

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-blue-950 px-5 py-10 text-white">
      <div className="mx-auto w-full max-w-5xl">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-10 inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:border-blue-500 hover:text-white"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-5 py-2 text-sm font-semibold text-purple-400">
            <FaCrown />
            CareerPilot Premium
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Unlock Unlimited Career Tools
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            You have already used your free attempt.
            Subscribe to continue using CareerPilot's
            AI-powered career features.
          </p>

        </div>

        <div className="mx-auto mt-10 max-w-2xl">

          {/* Pricing */}
          <div className="grid gap-5 sm:grid-cols-2">

            <button
              type="button"
              onClick={() =>
                setSelectedPlan("monthly")
              }
              className={`rounded-2xl border p-6 text-left transition ${
                selectedPlan === "monthly"
                  ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-950/20"
                  : "border-slate-800 bg-slate-900 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-semibold text-slate-400">
                    Monthly
                  </p>

                  <div className="mt-2 flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-white">
                      $5
                    </span>

                    <span className="mb-1 text-sm text-slate-400">
                      / month
                    </span>
                  </div>
                </div>

                <div
                  className={`h-5 w-5 rounded-full border-2 ${
                    selectedPlan === "monthly"
                      ? "border-blue-500 bg-blue-500"
                      : "border-slate-600"
                  }`}
                />
              </div>

              <p className="mt-3 text-sm text-slate-400">
                Flexible monthly access to all
                premium career tools.
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                setSelectedPlan("yearly")
              }
              className={`relative rounded-2xl border p-6 text-left transition ${
                selectedPlan === "yearly"
                  ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-950/20"
                  : "border-slate-800 bg-slate-900 hover:border-slate-700"
              }`}
            >
              <div className="absolute -top-3 right-5 rounded-full bg-violet-600 px-3 py-1 text-xs font-bold text-white">
                Best Value
              </div>

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-semibold text-slate-400">
                    Yearly
                  </p>

                  <div className="mt-2 flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-white">
                      $50
                    </span>

                    <span className="mb-1 text-sm text-slate-400">
                      / year
                    </span>
                  </div>
                </div>

                <div
                  className={`h-5 w-5 rounded-full border-2 ${
                    selectedPlan === "yearly"
                      ? "border-violet-500 bg-violet-500"
                      : "border-slate-600"
                  }`}
                />
              </div>

              <p className="mt-3 text-sm text-slate-400">
                Full-year premium access with
                one simple annual payment.
              </p>
            </button>

          </div>

        </div>

        <div className="mx-auto mt-8 max-w-lg">

          <div className="relative overflow-hidden rounded-[2rem] border border-purple-500/30 bg-slate-900 p-8 shadow-2xl shadow-purple-950/30 sm:p-10">

            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-purple-600/10 blur-3xl" />

            <div className="relative">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10">
                <FaCrown className="text-4xl text-purple-400" />
              </div>

              <div className="mt-6 text-center">

                <h2 className="text-3xl font-bold">
                  CareerPilot Premium
                </h2>

                <p className="mt-3 text-slate-400">
                  Unlimited access to CareerPilot
                </p>

              </div>

              <div className="mt-8 space-y-4">

                {[
                  "Unlimited Resume Analyzer",
                  "Unlimited Internship Finder",
                  "Unlimited AI Interview Practice",
                  "Unlimited Career Roadmap",
                  "LinkedIn Optimizer",
                  "AI Career Recommendations",
                  "All future premium features",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3"
                  >
                    <FaCheckCircle className="mt-0.5 flex-shrink-0 text-green-400" />

                    <span className="text-sm text-slate-300 sm:text-base">
                      {feature}
                    </span>
                  </div>
                ))}

              </div>

              {error && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubscribe}
                disabled={loading}
                className="mt-9 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <FaRocket />

                {loading
                  ? "Opening Checkout..."
                  : `Subscribe ${
                      selectedPlan === "monthly"
                        ? "$5/month"
                        : "$50/year"
                    }`}
              </button>

              <p className="mt-4 text-center text-xs text-slate-500">
                Secure subscription • Cancel anytime
              </p>

              <p className="mt-3 text-center text-xs text-slate-500">
                By subscribing, you agree to our{" "}
                <button
                  type="button"
                  onClick={() =>
                    navigate("/terms")
                  }
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() =>
                    navigate("/refund-policy")
                  }
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  Refund Policy
                </button>
                .
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Subscription;