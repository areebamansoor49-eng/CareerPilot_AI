function Hero() {
  return (
    <section className="text-center mt-24 px-5">
      <h1 className="text-6xl font-bold">
        AI-Powered Career Guidance
      </h1>

      <p className="mt-6 text-xl max-w-3xl mx-auto">
        CareerPilot AI helps students discover internships,
        analyse resumes, prepare for interviews, and build
        personalised career roadmaps using Artificial Intelligence.
      </p>

      <div className="mt-10 flex gap-4 justify-center">
        <button className="px-6 py-3 rounded-xl bg-white text-black">
          Get Started
        </button>

        <button className="px-6 py-3 rounded-xl border">
          Watch Demo
        </button>
      </div>
    </section>
  );
}

export default Hero;