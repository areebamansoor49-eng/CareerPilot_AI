import React from "react";
import {
  FaArrowRight,
  FaBrain,
  FaBullseye,
  FaChartLine,
  FaFileAlt,
  FaGraduationCap,
  FaHome,
  FaLinkedin,
  FaMicrophone,
  FaRoad,
  FaSearch,
  FaUserTie,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  path: string;
  iconBg: string;
  iconColor: string;
}

function Features() {
  const navigate = useNavigate();

  const features: FeatureCard[] = [
    {
      icon: <FaFileAlt />,
      title: "AI Resume Analyzer",
      description:
        "Analyze your resume with AI and discover exactly how to improve your ATS score, skills, experience, and overall presentation.",
      details: [
        "ATS compatibility analysis",
        "Resume score and section analysis",
        "Missing keyword detection",
        "Personalized improvement suggestions",
      ],
      path: "/resume-analyzer",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      icon: <FaMicrophone />,
      title: "AI Mock Interviews",
      description:
        "Practice realistic technical and HR interviews and receive AI-powered feedback on your performance.",
      details: [
        "Technical interview practice",
        "HR interview preparation",
        "AI-generated questions",
        "Performance feedback",
      ],
      path: "/ai-interviews",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
    },
    {
      icon: <FaRoad />,
      title: "Career Roadmap",
      description:
        "Create a personalized career roadmap based on your education, current skills, target role, and long-term goals.",
      details: [
        "Personalized learning path",
        "Skill-gap identification",
        "Projects and certifications",
        "Career milestones",
      ],
      path: "/career-roadmap",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
    },
    {
      icon: <FaSearch />,
      title: "Internship Finder",
      description:
        "Discover relevant internship opportunities based on your skills, career interests, and target industry.",
      details: [
        "Relevant internship opportunities",
        "Multiple job sources",
        "Career-focused filtering",
        "Opportunity discovery",
      ],
      path: "/internship-finder",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
    },
    {
      icon: <FaLinkedin />,
      title: "LinkedIn Optimizer",
      description:
        "Improve your LinkedIn profile and make it more professional, complete, and attractive to recruiters.",
      details: [
        "Profile completeness analysis",
        "Headline improvement",
        "About section suggestions",
        "Skills and experience analysis",
      ],
      path: "/linkedin-optimizer",
      iconBg: "bg-sky-500/10",
      iconColor: "text-sky-400",
    },
    {
      icon: <FaBrain />,
      title: "AI Career Guidance",
      description:
        "Use AI-powered career insights to understand your next steps and make better career decisions.",
      details: [
        "Career direction guidance",
        "Skill development recommendations",
        "Goal-based suggestions",
        "Personalized career insights",
      ],
      path: "/career-roadmap",
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-blue-950 text-white">
      {/* ========================= HEADER ========================= */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* LOGO */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-900/30">
              <FaBrain className="text-lg text-white" />
            </div>

            <div className="text-left">
              <h1 className="text-lg font-bold text-white">
                CareerPilot AI
              </h1>

              <p className="text-xs text-slate-500">
                AI-powered career platform
              </p>
            </div>
          </button>

          {/* HOME BUTTON */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-blue-500/50 hover:bg-slate-800 hover:text-white"
          >
            <FaHome />
            Home
          </button>
        </div>
      </header>

      {/* ========================= MAIN ========================= */}
      <main>
        {/* ========================= HERO ========================= */}
        <section className="mx-auto max-w-7xl px-6 pb-12 pt-16 md:pb-16 md:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
              <FaBrain />
              AI-Powered Career Intelligence
            </div>

            {/* HEADING */}
            <h2 className="mt-7 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
              Everything You Need to
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Build Your Career
              </span>
            </h2>

            {/* DESCRIPTION */}
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-400 md:text-lg">
              CareerPilot AI brings resume analysis, interview preparation,
              career planning, internship discovery, and professional profile
              optimization together in one intelligent platform.
            </p>
          </div>
        </section>

        {/* ========================= FEATURE CARDS ========================= */}
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature: FeatureCard) => (
              <article
                key={feature.title}
                className="group flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900/70 p-7 shadow-xl shadow-black/20 backdrop-blur-sm transition duration-300 hover:-translate-y-2 hover:border-blue-500/50 hover:bg-slate-900"
              >
                {/* ICON */}
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.iconBg} ${feature.iconColor} text-2xl transition duration-300 group-hover:scale-110`}
                >
                  {feature.icon}
                </div>

                {/* TITLE */}
                <h3 className="mt-6 text-2xl font-bold text-white">
                  {feature.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-4 leading-7 text-slate-400">
                  {feature.description}
                </p>

                {/* DETAILS */}
                <ul className="mt-6 space-y-3">
                  {feature.details.map((detail: string) => (
                    <li
                      key={detail}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs text-blue-400">
                        ✓
                      </span>

                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                {/* EXPLORE BUTTON */}
                <div className="mt-auto pt-7">
                  <button
                    type="button"
                    onClick={() => navigate(feature.path)}
                    className="inline-flex items-center gap-2 font-semibold text-blue-400 transition hover:gap-3 hover:text-cyan-400"
                  >
                    Explore Feature
                    <FaArrowRight className="text-sm" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ========================= HOW IT WORKS ========================= */}
        <section className="border-y border-slate-800 bg-slate-950/60">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                Simple Process
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                One Platform. Complete Career Journey.
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                Start with where you are today and use CareerPilot AI to plan
                and improve your next career steps.
              </p>
            </div>

            {/* PROCESS CARDS */}
            <div className="mt-12 grid gap-6 md:grid-cols-4">
              {/* STEP 1 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <FaUserTie className="text-3xl text-blue-400" />

                <h3 className="mt-5 font-bold text-white">
                  01. Assess
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Understand your current skills, resume, profile, and career
                  position.
                </p>
              </div>

              {/* STEP 2 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <FaBullseye className="text-3xl text-purple-400" />

                <h3 className="mt-5 font-bold text-white">
                  02. Identify
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Identify skill gaps, improvement areas, and opportunities.
                </p>
              </div>

              {/* STEP 3 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <FaGraduationCap className="text-3xl text-cyan-400" />

                <h3 className="mt-5 font-bold text-white">
                  03. Improve
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Follow personalized recommendations, projects, and learning
                  resources.
                </p>
              </div>

              {/* STEP 4 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <FaChartLine className="text-3xl text-green-400" />

                <h3 className="mt-5 font-bold text-white">
                  04. Progress
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Track your progress and move toward your target career.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================= CTA ========================= */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-purple-600/10 p-8 text-center md:p-14">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Ready to Build Your Career?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
              Start using CareerPilot AI to improve your resume, prepare for
              interviews, discover opportunities, and build your personalized
              career roadmap.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {/* GET STARTED */}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-blue-900/30 transition hover:scale-[1.02]"
              >
                Get Started
                <FaArrowRight />
              </button>

              {/* BACK HOME */}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-7 py-3.5 font-semibold text-slate-200 transition hover:border-blue-500/50 hover:bg-slate-800"
              >
                <FaHome />
                Back to Home
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ========================= FOOTER ========================= */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-center sm:flex-row sm:text-left">
          {/* FOOTER BRAND */}
          <div>
            <h3 className="font-bold text-white">
              CareerPilot AI
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              AI-powered career intelligence platform.
            </p>
          </div>

          {/* HOME */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-blue-400"
          >
            <FaHome />
            Home
          </button>

          {/* COPYRIGHT */}
          <p className="text-sm text-slate-600">
            © 2026 CareerPilot AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Features;