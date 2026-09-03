import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBriefcase,
  FaCheckCircle,
  FaChartLine,
  FaPlay,
  FaRoad,
  FaRocket,
  FaStar,
} from "react-icons/fa";

function Hero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  const handleExploreDemo = () => {
    navigate("/demo");
  };

  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-20 lg:py-28">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute right-[-8rem] top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

          {/* LEFT CONTENT */}
          <div className="max-w-3xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
              <FaRocket className="text-xs" />
              AI-Powered Career Platform
            </div>

            {/* Heading */}
            <h1 className="mt-7 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Build the career
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                you actually want.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              CareerPilot brings your resume, career roadmap, interview
              preparation, LinkedIn profile and internship search into one
              intelligent platform designed to help you move from{" "}
              <span className="font-medium text-slate-300">
                where you are
              </span>{" "}
              to{" "}
              <span className="font-medium text-slate-300">
                where you want to be.
              </span>
            </p>

            {/* CTA BUTTONS */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              {/* GET STARTED */}
              <button
                type="button"
                onClick={handleGetStarted}
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-950/40 transition duration-200 hover:-translate-y-0.5 hover:from-blue-500 hover:to-cyan-400"
              >
                Get Started

                <FaArrowRight className="text-sm transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* EXPLORE DEMO */}
              <button
                type="button"
                onClick={handleExploreDemo}
                className="inline-flex items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-900/70 px-6 py-3.5 font-semibold text-slate-200 backdrop-blur transition duration-200 hover:border-blue-500/50 hover:bg-slate-800"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10">
                  <FaPlay className="ml-0.5 text-[10px] text-blue-400" />
                </span>

                Explore Demo
              </button>
            </div>

            {/* BENEFITS */}
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">

              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-400" />
                Personalized career guidance
              </div>

              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-400" />
                AI-powered tools
              </div>

              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-400" />
                One career workspace
              </div>
            </div>

            {/* Rating */}
            <div className="mt-8 flex items-center gap-3 border-t border-slate-800 pt-7">

              <div className="flex items-center gap-1 text-yellow-400">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>

              <span className="text-sm text-slate-500">
                Built for students, graduates and career professionals
              </span>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative mx-auto w-full max-w-xl">

            {/* Glow */}
            <div className="absolute -inset-4 rounded-[2rem] bg-blue-500/10 blur-2xl" />

            {/* Dashboard Card */}
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-700/80 bg-slate-950/95 shadow-2xl shadow-black/50">

              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-5 py-4">

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                </div>

                <div className="text-xs font-medium text-slate-500">
                  CareerPilot AI
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  AI Active
                </div>
              </div>

              {/* Dashboard */}
              <div className="p-5 sm:p-6">

                {/* Intro */}
                <div className="mb-6 flex items-center justify-between gap-4">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Career Overview
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                      Your Career Progress
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                    <FaChartLine className="text-blue-400" />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">

                  {/* Resume */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500">
                        Resume Score
                      </p>

                      <span className="text-xs text-emerald-400">
                        +12%
                      </span>
                    </div>

                    <div className="mt-3 flex items-end gap-1">
                      <span className="text-3xl font-bold text-blue-400">
                        82
                      </span>

                      <span className="mb-1 text-sm text-slate-500">
                        /100
                      </span>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                    </div>
                  </div>

                  {/* Opportunities */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500">
                        Opportunities
                      </p>

                      <FaBriefcase className="text-emerald-400" />
                    </div>

                    <div className="mt-3 text-3xl font-bold text-emerald-400">
                      12
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Relevant matches
                    </p>
                  </div>

                  {/* Interview */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500">
                        Interview Readiness
                      </p>

                      <FaCheckCircle className="text-purple-400" />
                    </div>

                    <div className="mt-3 text-3xl font-bold text-purple-400">
                      76%
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Keep practicing
                    </p>
                  </div>

                  {/* Roadmap */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500">
                        Career Roadmap
                      </p>

                      <FaRoad className="text-cyan-400" />
                    </div>

                    <div className="mt-3 text-3xl font-bold text-cyan-400">
                      68%
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Progress completed
                    </p>
                  </div>
                </div>

                {/* Career Development */}
                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs text-slate-500">
                        Career Development
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-200">
                        Building toward your target role
                      </p>
                    </div>

                    <span className="text-sm font-bold text-blue-400">
                      68%
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400" />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Skills & preparation
                    </span>

                    <span className="text-slate-400">
                      Next: Portfolio projects
                    </span>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="mt-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">

                  <div className="flex gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                      <FaRocket className="text-sm text-blue-400" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        AI Recommendation
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Strengthen your technical skills and add two
                        portfolio projects to improve your career readiness.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Career Card */}
            <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-xl sm:block">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <FaCheckCircle className="text-emerald-400" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Next Milestone
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-white">
                    Build Portfolio
                  </p>
                </div>
              </div>
            </div>

            {/* Floating AI Card */}
            <div className="absolute -right-4 -top-5 hidden rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-xl sm:block">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                  <FaChartLine className="text-blue-400" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    AI Insight
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-white">
                    Career growth ↑
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Strip */}
        <div className="mt-16 grid grid-cols-1 divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

          <div className="flex items-center gap-3 px-5 py-5 sm:px-6">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <FaChartLine className="text-blue-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Analyze
              </p>

              <p className="text-xs text-slate-500">
                Understand your career profile
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-5 sm:px-6">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
              <FaRoad className="text-purple-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Plan
              </p>

              <p className="text-xs text-slate-500">
                Follow a personalized roadmap
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-5 sm:px-6">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
              <FaBriefcase className="text-emerald-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Grow
              </p>

              <p className="text-xs text-slate-500">
                Prepare for real opportunities
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;