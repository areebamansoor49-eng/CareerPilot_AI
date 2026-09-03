import {
  FaBrain,
  FaBullseye,
  FaGraduationCap,
  FaRocket,
} from "react-icons/fa";

function About() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* Hero */}
      <section className="px-6 md:px-10 pt-20 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-blue-400 uppercase tracking-[0.3em] text-sm font-semibold">
            About CareerPilot AI
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mt-5 leading-tight">
            Your AI-Powered
            <span className="text-blue-400"> Career Companion</span>
          </h1>

          <p className="max-w-3xl mx-auto mt-6 text-lg md:text-xl text-gray-400 leading-8">
            CareerPilot AI is a smart career platform designed to help
            students and fresh graduates move from education to employment
            with greater confidence, clarity, and preparation.
          </p>

          {/* Founder */}
          <div className="mt-8 inline-flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-4">
            <span className="text-sm uppercase tracking-[0.2em] text-gray-500">
              CareerPilot AI
            </span>

            <span className="mt-1 text-base font-semibold text-gray-200">
              Founded & Created by Areeba Mansoor
            </span>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 md:px-10 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Mission */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10">
            <FaBullseye className="text-blue-400 text-4xl mb-6" />

            <h2 className="text-3xl font-bold mb-5">
              Our Mission
            </h2>

            <p className="text-gray-400 leading-8">
              Our mission is to make modern career guidance more accessible
              to students and early-career professionals. CareerPilot AI
              brings resume analysis, ATS optimization, interview practice,
              career roadmaps, and job discovery into one intelligent
              platform.
            </p>
          </div>

          {/* Vision */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10">
            <FaRocket className="text-blue-400 text-4xl mb-6" />

            <h2 className="text-3xl font-bold mb-5">
              Our Vision
            </h2>

            <p className="text-gray-400 leading-8">
              We envision a future where every student can understand their
              strengths, identify skill gaps, prepare for real-world
              opportunities, and confidently navigate their career journey
              using intelligent technology.
            </p>
          </div>
        </div>
      </section>

      {/* What We Provide */}
      <section className="px-6 md:px-10 py-16 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-400 uppercase tracking-[0.25em] text-sm font-semibold">
              What We Provide
            </p>

            <h2 className="text-4xl font-bold mt-4">
              Built Around Your Career Journey
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaBrain />,
                title: "AI Resume Analysis",
                text: "Understand resume strengths, weaknesses, and improvement opportunities.",
              },
              {
                icon: <FaGraduationCap />,
                title: "Career Preparation",
                text: "Prepare for internships, interviews, and your first professional opportunities.",
              },
              {
                icon: <FaRocket />,
                title: "Skill Development",
                text: "Identify important skills and build a practical learning roadmap.",
              },
              {
                icon: <FaBullseye />,
                title: "Career Direction",
                text: "Make better career decisions based on your goals and interests.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  p-7
                  hover:-translate-y-1
                  hover:border-blue-400/30
                  transition
                "
              >
                <div className="text-blue-400 text-3xl mb-5">
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold mb-3">
                  {item.title}
                </h3>

                <p className="text-gray-400 leading-7">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;