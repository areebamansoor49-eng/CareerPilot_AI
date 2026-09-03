import {
  FaBuilding,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function TrustedBy() {
  const navigate = useNavigate();

  const companies = [
    {
      name: "Google",
      description: "Technology & AI",
    },
    {
      name: "Microsoft",
      description: "Cloud & Software",
    },
    {
      name: "Amazon",
      description: "Technology & E-Commerce",
    },
    {
      name: "Systems Limited",
      description: "Technology & Consulting",
    },
    {
      name: "Arbisoft",
      description: "Software & AI",
    },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-20 lg:py-24">
      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
          <FaBuilding className="text-xs" />
          Industry-Focused Career Preparation
        </div>

        <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          Prepare for{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Top Tech Careers
          </span>
        </h2>

        <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
          Develop the skills, experience, portfolio, and professional
          confidence needed to compete for opportunities at leading
          technology companies.
        </p>
      </div>

      {/* =====================================================
          COMPANY CARDS
      ===================================================== */}

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {companies.map((company) => (
          <div
            key={company.name}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-slate-900"
          >
            {/* Top line */}
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Company Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-slate-400 transition group-hover:text-blue-400">
              <FaBuilding />
            </div>

            {/* Company Name */}
            <h3 className="mt-4 text-base font-bold text-slate-200 transition group-hover:text-white">
              {company.name}
            </h3>

            {/* Industry */}
            <p className="mt-1 text-xs text-slate-500">
              {company.description}
            </p>
          </div>
        ))}
      </div>

      {/* =====================================================
          DISCLAIMER / CONTEXT
      ===================================================== */}

      <div className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <FaCheckCircle className="mt-0.5 shrink-0 text-blue-400" />

        <p className="text-sm leading-6 text-slate-500">
          CareerPilot AI uses industry-relevant career requirements and
          professional development principles to help users prepare for
          competitive roles. The companies shown above are examples of
          leading employers and do not represent formal partnerships or
          endorsements.
        </p>
      </div>

      {/* =====================================================
          CTA
      ===================================================== */}

      <div className="mt-10 text-center">
        <button
          type="button"
          onClick={() => navigate("/features")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
        >
          Explore CareerPilot Tools
          <FaArrowRight className="text-xs" />
        </button>
      </div>
    </section>
  );
}

export default TrustedBy;