import { FaRobot, FaUserTie, FaRoad } from "react-icons/fa";

const features = [
  {
    icon: <FaRobot />,
    title: "AI Resume Analyzer",
    description:
      "Analyze your resume, identify weaknesses, improve ATS compatibility, and receive actionable career suggestions.",
  },
  {
    icon: <FaUserTie />,
    title: "AI Mock Interviews",
    description:
      "Practice technical and HR interviews with AI-generated questions and receive instant performance feedback.",
  },
  {
    icon: <FaRoad />,
    title: "Personalized Career Roadmap",
    description:
      "Discover the skills, technologies, and learning path you need to reach your target career.",
  },
];

export default function Features() {
  return (
    <section className="mt-32 px-6 md:px-10 pb-20">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-400 font-semibold">
          Powerful Career Tools
        </p>

        <h2 className="text-4xl md:text-5xl font-bold mt-4">
          Everything You Need to{" "}
          <span className="text-blue-400">Build Your Career</span>
        </h2>

        <p className="text-gray-400 mt-5 text-lg leading-8">
          CareerPilot AI combines intelligent career guidance, resume
          intelligence, interview preparation, and personalized learning
          recommendations in one platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 max-w-6xl mx-auto">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-blue-400/40 hover:bg-white/[0.1] hover:shadow-2xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110">
              {feature.icon}
            </div>

            <h3 className="text-2xl font-bold mt-6">
              {feature.title}
            </h3>

            <p className="text-gray-400 mt-4 leading-7">
              {feature.description}
            </p>

            <button
              type="button"
              className="mt-6 text-blue-400 font-semibold hover:text-blue-300 transition"
            >
              Explore Feature →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}