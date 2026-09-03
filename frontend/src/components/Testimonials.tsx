import {
  FaQuoteLeft,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function Testimonials() {
  const navigate = useNavigate();

  const testimonials = [
    {
      text:
        "Get a clearer understanding of your current skills, identify areas for improvement, and create a focused direction for your career development.",
      title: "Clear Career Direction",
      category: "Career Planning",
    },
    {
      text:
        "Practice common technical and HR interview scenarios, review your performance, and understand which areas need more preparation.",
      title: "Better Interview Preparation",
      category: "AI Interview Practice",
    },
    {
      text:
        "Bring resume analysis, career planning, internships, and professional development tools together in one structured platform.",
      title: "One Career Platform",
      category: "Career Development",
    },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-24 lg:py-28">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute left-1/3 top-20 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute right-1/4 bottom-10 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
          <FaCheckCircle className="text-xs" />
          Designed Around Your Career Journey
        </div>

        <h2 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Turn Career Goals Into{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Action
          </span>
        </h2>

        <p className="mt-5 text-base leading-8 text-slate-400 sm:text-lg">
          CareerPilot AI gives you practical tools to understand your
          strengths, improve your professional profile, prepare for
          opportunities, and plan your next career steps.
        </p>
      </div>

      {/* =====================================================
          CARDS
      ===================================================== */}

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {testimonials.map((item) => (
          <article
            key={item.title}
            className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-7 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/40"
          >
            {/* Top line */}
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Quote icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <FaQuoteLeft />
            </div>

            {/* Category */}
            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-blue-400">
              {item.category}
            </p>

            {/* Title */}
            <h3 className="mt-3 text-xl font-bold text-white">
              {item.title}
            </h3>

            {/* Description */}
            <p className="mt-4 text-sm leading-7 text-slate-400">
              {item.text}
            </p>

            {/* Bottom indicator */}
            <div className="mt-7 flex items-center gap-2 text-sm font-medium text-slate-500">
              <FaCheckCircle className="text-green-400" />
              CareerPilot AI feature
            </div>
          </article>
        ))}
      </div>

      {/* =====================================================
          REAL TESTIMONIALS NOTE
      ===================================================== */}

      <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-center">
        <p className="text-sm leading-6 text-slate-500">
          Real user reviews and success stories can be added here as
          CareerPilot AI collects verified feedback from students,
          graduates, and professionals.
        </p>
      </div>

      {/* =====================================================
          CTA
      ===================================================== */}

      <div className="mt-10 text-center">
        <button
          type="button"
          onClick={() => navigate("/demo")}
          className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:scale-[1.02]"
        >
          Explore CareerPilot
          <FaArrowRight />
        </button>
      </div>
    </section>
  );
}

export default Testimonials;