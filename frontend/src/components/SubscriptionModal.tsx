import { useState } from "react";
import { FaCheckCircle, FaCrown, FaTimes, FaRocket } from "react-icons/fa";
import { getCurrentUserEmail } from "../utils/subscription";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

type Plan = "monthly" | "yearly";

interface SubscriptionModalProps {
  featureName?: string;
  onClose: () => void;
}

function SubscriptionModal({
  featureName = "this premium feature",
  onClose,
}: SubscriptionModalProps) {
  const [plan, setPlan] = useState<Plan>("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setError("");

      const user = localStorage.getItem("user");
      const userId = localStorage.getItem("userId") || "";
      const email = getCurrentUserEmail();

      if (!user || !email) {
        setError("Please log in before subscribing.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/payment/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          userId,
          plan,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to create subscription checkout."
        );
      }

      if (!data.checkoutUrl) {
        throw new Error("Paddle checkout URL was not returned.");
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error("Subscription checkout error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to start subscription."
      );

      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscription-modal-title"
    >
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-purple-500/30 bg-slate-950 p-6 shadow-2xl shadow-purple-950/40 sm:p-8">

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-slate-700 hover:text-white"
          aria-label="Close subscription window"
        >
          <FaTimes />
        </button>

        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10">
            <FaCrown className="text-3xl text-purple-400" />
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-purple-400">
            CareerPilot Premium
          </p>

          <h2
            id="subscription-modal-title"
            className="mt-2 text-2xl font-extrabold text-white sm:text-3xl"
          >
            Unlock {featureName}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            This feature requires an active CareerPilot subscription. Choose a
            plan below to unlock all premium career tools.
          </p>

        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">

          <button
            type="button"
            onClick={() => setPlan("monthly")}
            className={`rounded-2xl border p-5 text-left transition ${
              plan === "monthly"
                ? "border-blue-500 bg-blue-500/10"
                : "border-slate-800 bg-slate-900 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-bold text-white">
                Monthly
              </span>

              {plan === "monthly" && (
                <FaCheckCircle className="text-blue-400" />
              )}
            </div>

            <p className="mt-3 text-3xl font-extrabold text-white">
              $5
            </p>

            <p className="text-sm text-slate-500">
              per month
            </p>
          </button>

          <button
            type="button"
            onClick={() => setPlan("yearly")}
            className={`rounded-2xl border p-5 text-left transition ${
              plan === "yearly"
                ? "border-purple-500 bg-purple-500/10"
                : "border-slate-800 bg-slate-900 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-bold text-white">
                Yearly
              </span>

              {plan === "yearly" && (
                <FaCheckCircle className="text-purple-400" />
              )}
            </div>

            <p className="mt-3 text-3xl font-extrabold text-white">
              $50
            </p>

            <p className="text-sm text-slate-500">
              per year
            </p>
          </button>

        </div>

        <div className="mt-7 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          {[
            "Unlimited Resume Analyzer after the free attempt",
            "Unlimited Career Roadmap",
            "Unlimited AI Interview Practice",
            "LinkedIn Optimizer",
            "All future premium features",
          ].map((feature) => (
            <div
              key={feature}
              className="flex items-start gap-3 text-sm text-slate-300"
            >
              <FaCheckCircle className="mt-0.5 shrink-0 text-green-400" />

              <span>{feature}</span>
            </div>
          ))}

        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubscribe}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 py-4 font-bold text-white shadow-lg shadow-blue-950/30 transition hover:from-blue-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaRocket />

          {loading
            ? "Opening Secure Checkout..."
            : `Subscribe ${
                plan === "monthly"
                  ? "Monthly"
                  : "Yearly"
              }`}
        </button>

        <p className="mt-3 text-center text-xs text-slate-500">
          Secure payment through Paddle • Cancel anytime
        </p>

      </div>
    </div>
  );
}

export default SubscriptionModal;