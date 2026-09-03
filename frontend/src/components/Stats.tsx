function Stats() {
  const stats = [
    {
      value: "10K+",
      title: "Students Supported",
      description: "Career-focused learners",
      color: "text-blue-400",
      glow: "group-hover:shadow-blue-500/20",
    },
    {
      value: "500+",
      title: "Career Opportunities",
      description: "Jobs & internships",
      color: "text-purple-400",
      glow: "group-hover:shadow-purple-500/20",
    },
    {
      value: "95%",
      title: "User Satisfaction",
      description: "Positive experience",
      color: "text-cyan-400",
      glow: "group-hover:shadow-cyan-500/20",
    },
    {
      value: "24/7",
      title: "AI Assistance",
      description: "Career guidance anytime",
      color: "text-green-400",
      glow: "group-hover:shadow-green-500/20",
    },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((item) => (
          <div
            key={item.title}
            className={`group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 sm:p-6 text-center backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 ${item.glow}`}
          >
            {/* Top gradient line */}
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${item.color}`}
            >
              {item.value}
            </h2>

            <p className="mt-3 text-sm sm:text-base font-semibold text-white">
              {item.title}
            </p>

            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;