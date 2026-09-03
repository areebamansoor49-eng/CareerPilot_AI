function Documentation() {
  const docs = [
    {
      title: "Getting Started",
      description:
        "Create your account, complete your profile, and start your AI-powered career journey.",
      steps: [
        "Register your account",
        "Complete your student profile",
        "Set your career goals",
      ],
    },
    {
      title: "AI Resume Analyzer",
      description:
        "Learn how CareerPilot AI analyses resumes and provides improvement suggestions.",
      steps: [
        "Upload your resume PDF",
        "AI analyses skills and experience",
        "Review improvement recommendations",
      ],
    },
    {
      title: "AI Interview Preparation",
      description:
        "Practice technical and HR interviews with personalised AI feedback.",
      steps: [
        "Select your target job role",
        "Start an AI interview session",
        "Review feedback and improve",
      ],
    },
    {
      title: "Career Roadmap",
      description:
        "Generate a personalised roadmap based on your skills and career goals.",
      steps: [
        "Choose your career path",
        "Follow recommended learning steps",
        "Track your progress",
      ],
    },
  ];

  return (
    <div className="min-h-screen px-6 py-20">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold">
          Documentation
        </h1>

        <p className="mt-5 text-slate-400 max-w-3xl">
          Learn how to use CareerPilot AI features and get the
          best experience from our career intelligence platform.
        </p>


        <div className="mt-12 grid md:grid-cols-2 gap-8">

          {docs.map((doc) => (
            <div
              key={doc.title}
              className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900/60
              p-8
              hover:border-blue-500
              transition
              "
            >

              <h2 className="text-2xl font-bold">
                {doc.title}
              </h2>


              <p className="mt-4 text-slate-300">
                {doc.description}
              </p>


              <ul className="mt-5 space-y-3">

                {doc.steps.map((step) => (
                  <li
                    key={step}
                    className="text-slate-400 flex gap-3"
                  >
                    <span className="text-blue-400">
                      ✓
                    </span>

                    {step}
                  </li>
                ))}

              </ul>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Documentation;