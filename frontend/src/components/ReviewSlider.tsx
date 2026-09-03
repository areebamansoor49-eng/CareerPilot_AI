import {
  useEffect,
  useState,
} from "react";

import {
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

interface Review {
  _id: string;
  rating: number;
  comment?: string;
  featureUsed?: string;
  userName?: string;
  createdAt?: string;
}

function ReviewSlider() {
  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [current, setCurrent] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  // ======================================================
  // LOAD APPROVED REVIEWS
  // ======================================================

  const loadReviews = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/reviews",
        {
          method: "GET",
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      const data =
        await response.json();

      if (
        response.ok &&
        data.success &&
        Array.isArray(data.reviews)
      ) {
        setReviews(data.reviews);

        setCurrent((previous) => {
          if (data.reviews.length === 0) {
            return 0;
          }

          return Math.min(
            previous,
            data.reviews.length - 1
          );
        });
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error(
        "Failed to load reviews:",
        error
      );

      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    loadReviews();
  }, []);

  // ======================================================
  // REFRESH AFTER NEW REVIEW
  // ======================================================

  useEffect(() => {
    const handleReviewSubmitted = () => {
      loadReviews();
    };

    window.addEventListener(
      "reviewSubmitted",
      handleReviewSubmitted
    );

    return () => {
      window.removeEventListener(
        "reviewSubmitted",
        handleReviewSubmitted
      );
    };
  }, []);

  // ======================================================
  // AUTOMATIC SLIDESHOW
  // ======================================================

  useEffect(() => {
    if (reviews.length <= 1) {
      return;
    }

    const interval =
      setInterval(() => {
        setCurrent(
          (previous) =>
            (previous + 1) %
            reviews.length
        );
      }, 5000);

    return () =>
      clearInterval(interval);
  }, [reviews.length]);

  // ======================================================
  // PREVIOUS REVIEW
  // ======================================================

  const previousReview = () => {
    setCurrent((previous) =>
      previous === 0
        ? reviews.length - 1
        : previous - 1
    );
  };

  // ======================================================
  // NEXT REVIEW
  // ======================================================

  const nextReview = () => {
    setCurrent(
      (previous) =>
        (previous + 1) %
        reviews.length
    );
  };

  // ======================================================
  // LOADING / EMPTY
  // ======================================================

  if (loading || reviews.length === 0) {
    return null;
  }

  const review = reviews[current];

  // ======================================================
  // FEATURE NAME
  // ======================================================

  const featureNames: Record<
    string,
    string
  > = {
    resume: "Resume Analyzer",
    jobs: "Internship / Jobs",
    linkedin: "LinkedIn Optimizer",
    "career-roadmap":
      "Career Roadmap",
    other: "CareerPilot AI",
  };

  const featureName =
    featureNames[
      review.featureUsed || "other"
    ] || "CareerPilot AI";

  // ======================================================
  // UI
  // ======================================================

  return (
    <section className="mx-auto max-w-5xl px-5 py-20">

      {/* ==================================================
          SECTION HEADER
      ================================================== */}

      <div className="mb-10 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
          What Our Users Say
        </p>

        <h2 className="text-3xl font-bold text-white md:text-4xl">
          Loved by CareerPilot Users
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          See what users are saying about
          their experience with CareerPilot AI.
        </p>
      </div>

      {/* ==================================================
          REVIEW CARD
      ================================================== */}

      <div className="relative rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center shadow-2xl backdrop-blur md:p-12">

        {/* ==================================================
            LEFT ARROW
        ================================================== */}

        {reviews.length > 1 && (
          <button
            type="button"
            onClick={previousReview}
            aria-label="Previous review"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-slate-400 transition hover:border-blue-500 hover:text-white md:left-5"
          >
            <FaChevronLeft />
          </button>
        )}

        {/* ==================================================
            RIGHT ARROW
        ================================================== */}

        {reviews.length > 1 && (
          <button
            type="button"
            onClick={nextReview}
            aria-label="Next review"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-slate-400 transition hover:border-blue-500 hover:text-white md:right-5"
          >
            <FaChevronRight />
          </button>
        )}

        {/* ==================================================
            STARS
        ================================================== */}

        <div className="flex justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map(
            (star) => (
              <FaStar
                key={star}
                className={
                  star <= review.rating
                    ? "text-yellow-400"
                    : "text-slate-700"
                }
              />
            )
          )}
        </div>

        {/* ==================================================
            COMMENT
        ================================================== */}

        <blockquote className="mx-auto mt-7 max-w-3xl text-lg font-medium leading-8 text-slate-200 md:text-xl">
          “{review.comment}”
        </blockquote>

        {/* ==================================================
            USER
        ================================================== */}

        <div className="mt-7">
          <p className="text-lg font-bold text-white">
            {review.userName ||
              "CareerPilot User"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {featureName}
          </p>
        </div>

        {/* ==================================================
            SLIDE INDICATOR
        ================================================== */}

        {reviews.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {reviews.map(
              (item, index) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() =>
                    setCurrent(index)
                  }
                  aria-label={`Show review ${
                    index + 1
                  }`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === current
                      ? "w-7 bg-blue-500"
                      : "w-2 bg-slate-700 hover:bg-slate-500"
                  }`}
                />
              )
            )}
          </div>
        )}

        {/* ==================================================
            REVIEW COUNT
        ================================================== */}

        {reviews.length > 1 && (
          <p className="mt-4 text-xs text-slate-600">
            {current + 1} /{" "}
            {reviews.length}
          </p>
        )}
      </div>
    </section>
  );
}

export default ReviewSlider;