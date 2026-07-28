import { FaRobot, FaUserTie, FaRoad } from "react-icons/fa";

function Features() {
  return (
    <section className="mt-32 px-10">
      <h2 className="text-4xl font-bold text-center">
        Features
      </h2>

      <div className="grid md:grid-cols-3 gap-8 mt-12">

        {/* Card 1 */}
        <div className="bg-white/10 p-8 rounded-2xl hover:scale-105 transition duration-300 shadow-lg">
          <FaRobot size={40} />

          <h3 className="text-2xl font-bold mt-4">
            AI Resume Analyzer
          </h3>

          <p className="mt-4 text-gray-300">
            Analyse resumes, improve ATS scores, and receive
            intelligent suggestions to stand out.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white/10 p-8 rounded-2xl hover:scale-105 transition duration-300 shadow-lg">
          <FaUserTie size={40} />

          <h3 className="text-2xl font-bold mt-4">
            Mock Interviews
          </h3>

          <p className="mt-4 text-gray-300">
            Practice HR and technical interviews with AI-driven
            feedback and performance insights.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white/10 p-8 rounded-2xl hover:scale-105 transition duration-300 shadow-lg">
          <FaRoad size={40} />

          <h3 className="text-2xl font-bold mt-4">
            Career Roadmaps
          </h3>

          <p className="mt-4 text-gray-300">
            Get personalized career recommendations and skill
            roadmaps tailored to your goals.
          </p>
        </div>

      </div>
    </section>
  );
}

export default Features;