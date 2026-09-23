import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaCrown,
  FaTimes,
  FaRocket,
} from "react-icons/fa";
import { initializePaddle } from "@paddle/paddle-js";
import { getCurrentUserEmail } from "../utils/subscription";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://career-pilot-backend-kappa.vercel.app";

const PADDLE_CLIENT_TOKEN =
  import.meta.env.VITE_PADDLE_CLIENT_TOKEN;

const PADDLE_ENVIRONMENT =
  import.meta.env.VITE_PADDLE_ENVIRONMENT ||
  "sandbox";

type Plan = "monthly" | "yearly";

interface SubscriptionModalProps {
  featureName?: string;
  onClose: () => void;
}

function SubscriptionModal({
  featureName = "this premium feature",
  onClose,
}: SubscriptionModalProps) {
  const [plan, setPlan] =
    useState<Plan>("monthly");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const setupPaddle = async () => {
      try {
        if (!PADDLE_CLIENT_TOKEN) {
          console.error(
            "VITE_PADDLE_CLIENT_TOKEN is missing."
          );

          return;
        }

        await initializePaddle({
          environment:
            PADDLE_ENVIRONMENT === "production"
              ? "production"
              : "sandbox",

          token: PADDLE_CLIENT_TOKEN,
        });
      } catch (err) {
        console.error(
          "Paddle initialization error:",
          err
        );
      }
    };

    setupPaddle();
  }, []);

  const handleStartTrial = async () => {
    try {
      setLoading(true);
      setError("");

      const rawUser =
        localStorage.getItem("user");

      const userId =
        localStorage.getItem("userId") || "";

      const email =
        getCurrentUserEmail();

      if (!rawUser || !email) {
        setError(
          "Please log in before starting your free trial."
        );

        setLoading(false);
        return;
      }

      if (!PADDLE_CLIENT_TOKEN) {
        throw new Error(
          "Paddle checkout is not configured."
        );
      }

      /*
       * Ask the CareerPilot backend to create
       * the Paddle transaction.
       *
       * The backend selects the correct recurring
       * Paddle Price:
       *
       * Monthly:
       * $5/month + 7-day free trial
       *
       * Yearly:
       * $50/year + 7-day free trial
       */

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
            email,
            userId,
            plan,
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
            "Unable to create your trial checkout."
        );
      }

      if (!data.transactionId) {
        throw new Error(
          "Paddle transaction was not returned."
        );
      }

      /*
       * Load Paddle.js and open the exact
       * transaction created by our backend.
       *
       * This is important because the Paddle
       * Price attached to that transaction
       * contains the 7-day trial configuration.
       */

      const paddle =
        await initializePaddle({
          environment:
            PADDLE_ENVIRONMENT === "production"
              ? "production"
              : "sandbox",

          token: PADDLE_CLIENT_TOKEN,
        });

      if (!paddle) {
        throw new Error(
          "Unable to initialize Paddle Checkout."
        );
      }

      paddle.Checkout.open({
        transactionId:
          data.transactionId,

        settings: {
          displayMode: "overlay",
          theme: "dark",
          locale: "en",
        },
      });

      setLoading(false);
    } catch (err) {
      console.error(
        "Free trial checkout error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to start your free trial."
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
            Start your 7-day free trial and
            unlock all CareerPilot premium
            career tools.
          </p>

        </div>

        <div className="mt-7 rounded-2xl border border-green-500/20 bg-green-500/5 p-5 text-center">

          <p className="text-lg font-extrabold text-white">
            7 Days Free
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            No charge during your 7-day
            trial. A payment method is
            required to start the trial.
            After the trial, Paddle will
            automatically bill the selected
            recurring plan unless cancelled.
          </p>

        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">

          <button
            type="button"
            onClick={() =>
              setPlan("monthly")
            }
            disabled={loading}
            className={`rounded-2xl border p-5 text-left transition ${
              plan === "monthly"
                ? "border-blue-500 bg-blue-500/10"
                : "border-slate-800 bg-slate-900 hover:border-slate-700"
            } disabled:cursor-not-allowed disabled:opacity-60`}
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
              after 7-day free trial
            </p>

          </button>

          <button
            type="button"
            onClick={() =>
              setPlan("yearly")
            }
            disabled={loading}
            className={`rounded-2xl border p-5 text-left transition ${
              plan === "yearly"
                ? "border-purple-500 bg-purple-500/10"
                : "border-slate-800 bg-slate-900 hover:border-slate-700"
            } disabled:cursor-not-allowed disabled:opacity-60`}
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
              after 7-day free trial
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

              <span>
                {feature}
              </span>
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
          onClick={handleStartTrial}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 py-4 font-bold text-white shadow-lg shadow-blue-950/30 transition hover:from-blue-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaRocket />

          {loading
            ? "Opening Secure Paddle Checkout..."
            : `Start 7-Day Free Trial — ${
                plan === "monthly"
                  ? "$5/month"
                  : "$50/year"
              }`}
        </button>

        <p className="mt-3 text-center text-xs leading-5 text-slate-500">
          Secure payment through Paddle •
          Payment method required • No charge
          during the 7-day trial • Automatically
          renews after trial unless cancelled
        </p>

      </div>
    </div>
  );
}

export default SubscriptionModal;
