import {
  useEffect,
  useState,
} from "react";

import {
  FaStar,
  FaTimes,
} from "react-icons/fa";

interface ReviewPopupProps {
  onClose?: () => void;
}

interface UserData {
  name?: string;
  email?: string;
}

function ReviewPopup({
  onClose,
}: ReviewPopupProps) {
  const [rating, setRating] =
    useState(0);

  const [comment, setComment] =
    useState("");

  const [featureUsed, setFeatureUsed] =
    useState("other");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<"success" | "error">(
      "success"
    );

  const [visible, setVisible] =
    useState(false);

  // ======================================================
  // SHOW POPUP
  // ======================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  // ======================================================
  // CLOSE POPUP
  // ======================================================

  const closePopup = () => {
    setVisible(false);

    setTimeout(() => {
      onClose?.();
    }, 200);
  };

  // ======================================================
  // SUBMIT REVIEW
  // ======================================================

  const submitReview = async () => {
    try {
      // ==================================================
      // GET LOGGED-IN USER
      // ==================================================

      const savedUser =
        localStorage.getItem("user");

      if (!savedUser) {
        setMessageType("error");
        setMessage(
          "Please login before submitting a review."
        );
        return;
      }

      let user: UserData;

      try {
        user = JSON.parse(savedUser);
      } catch {
        setMessageType("error");
        setMessage(
          "User information is invalid. Please login again."
        );
        return;
      }

      // ==================================================
      // VALIDATE EMAIL
      // ==================================================

      if (!user.email) {
        setMessageType("error");
        setMessage(
          "User email could not be found."
        );
        return;
      }

      // ==================================================
      // VALIDATE RATING
      // ==================================================

      if (rating === 0) {
        setMessageType("error");
        setMessage(
          "Please select a rating."
        );
        return;
      }

      // ==================================================
      // VALIDATE FEEDBACK
      // ==================================================

      if (!comment.trim()) {
        setMessageType("error");
        setMessage(
          "Please provide your feedback."
        );
        return;
      }

      // ==================================================
      // START LOADING
      // ==================================================

      setLoading(true);
      setMessage("");

      // ==================================================
      // SEND REVIEW TO BACKEND
      // ==================================================

      const response = await fetch(
        "http://localhost:5000/api/reviews",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            userEmail:
              user.email.trim().toLowerCase(),

            userName:
              user.name?.trim() ||
              "CareerPilot User",

            rating,

            comment:
              comment.trim(),

            featureUsed,
          }),
        }
      );

      // ==================================================
      // PARSE RESPONSE
      // ==================================================

      const data = await response.json();

      // ==================================================
      // HANDLE ERROR
      // ==================================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit review."
        );
      }

      // ==================================================
      // SUCCESS MESSAGE
      // ==================================================

      setMessageType("success");

      setMessage(
        data.message ||
          "Thank you! Your review has been submitted successfully."
      );

      // ==================================================
      // MARK REVIEW AS SUBMITTED
      // ==================================================

      localStorage.setItem(
        "reviewSubmitted",
        "true"
      );

      // ==================================================
      // NOTIFY OTHER COMPONENTS
      // ==================================================

      window.dispatchEvent(
        new Event("reviewSubmitted")
      );

      // ==================================================
      // CLOSE POPUP
      // ==================================================

      setTimeout(() => {
        closePopup();
      }, 1800);
    } catch (error) {
      console.error(
        "Review submission error:",
        error
      );

      setMessageType("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to submit review."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // HIDDEN
  // ======================================================

  if (!visible) {
    return null;
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-7 shadow-2xl">

        {/* ==================================================
            CLOSE BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={closePopup}
          disabled={loading}
          className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close review popup"
        >
          <FaTimes />
        </button>

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="pr-8">
          <h2 className="text-2xl font-bold text-white">
            How is CareerPilot AI going?
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            We'd love to hear your feedback.
            Your review helps us improve
            CareerPilot AI.
          </p>
        </div>

        {/* ==================================================
            RATING
        ================================================== */}

        <div className="mt-7">
          <p className="mb-3 text-sm font-semibold text-slate-300">
            Your Rating
          </p>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(
              (star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setRating(star)
                  }
                  disabled={loading}
                  aria-label={`${star} stars`}
                  className="text-3xl transition hover:scale-110 disabled:cursor-not-allowed"
                >
                  <FaStar
                    className={
                      star <= rating
                        ? "text-yellow-400"
                        : "text-slate-700"
                    }
                  />
                </button>
              )
            )}
          </div>

          {rating > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              {rating} out of 5 stars
            </p>
          )}
        </div>

        {/* ==================================================
            FEATURE
        ================================================== */}

        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold text-slate-300">
            Feature Used
          </label>

          <select
            value={featureUsed}
            onChange={(event) =>
              setFeatureUsed(
                event.target.value
              )
            }
            disabled={loading}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="other">
              General Experience
            </option>

            <option value="resume">
              Resume Analyzer
            </option>

            <option value="jobs">
              Internship / Jobs
            </option>

            <option value="linkedin">
              LinkedIn Optimizer
            </option>

            <option value="career-roadmap">
              Career Roadmap
            </option>
          </select>
        </div>

        {/* ==================================================
            COMMENT
        ================================================== */}

        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold text-slate-300">
            Your Feedback
          </label>

          <textarea
            value={comment}
            onChange={(event) =>
              setComment(
                event.target.value
              )
            }
            maxLength={1000}
            rows={4}
            disabled={loading}
            placeholder="Tell us what you think..."
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <p className="mt-1 text-right text-xs text-slate-600">
            {comment.length}/1000
          </p>
        </div>

        {/* ==================================================
            MESSAGE
        ================================================== */}

        {message && (
          <div
            className={`mt-4 rounded-xl border p-3 text-sm ${
              messageType === "error"
                ? "border-red-500/20 bg-red-500/10 text-red-300"
                : "border-green-500/20 bg-green-500/10 text-green-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* ==================================================
            SUBMIT BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={submitReview}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 font-semibold text-white transition hover:from-blue-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Submitting..."
            : "Submit Review"}
        </button>
      </div>
    </div>
  );
}

export default ReviewPopup;