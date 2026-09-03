import {
  FaCheckCircle,
  FaCrown,
  FaArrowLeft,
  FaRocket,
} from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function Subscription() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setError("");

      const userEmail =
        localStorage.getItem("userEmail") ||
        localStorage.getItem("email");

      const userId =
        localStorage.getItem("userId") || "";

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
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email: userEmail,
            userId,
            plan: "monthly",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
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

        <div className="mx-auto mt-12 max-w-lg">

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
                  : "Subscribe & Unlock"}
              </button>

              <p className="mt-4 text-center text-xs text-slate-500">
                Secure subscription • Cancel anytime
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Subscription;