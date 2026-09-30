
import {
  Clock3,
  BriefcaseBusiness,
  Map,
  UserRoundCheck,
} from "lucide-react";

function Stats() {
  const stats = [
    {
      icon: Clock3,
      title: "24/7 Career Assistance",
      description:
        "Work on your career development whenever it suits you, day or night.",
      color: "text-blue-400",
      glow: "group-hover:shadow-blue-500/20",
      iconBg: "bg-blue-500/10",
    },
    {
      icon: BriefcaseBusiness,
      title: "Explore Career Opportunities",
      description:
        "Discover available job and internship opportunities through Opportunity Finder.",
      color: "text-purple-400",
      glow: "group-hover:shadow-purple-500/20",
      iconBg: "bg-purple-500/10",
    },
    {
      icon: Map,
      title: "Build Your Career Roadmap",
      description:
        "Plan your career goals, identify next steps, and focus on skill development.",
      color: "text-cyan-400",
      glow: "group-hover:shadow-cyan-500/20",
      iconBg: "bg-cyan-500/10",
    },
    {
      icon: UserRoundCheck,
      title: "Strengthen Your Professional Profile",
      description:
        "Analyze your resume, practice interviews, and improve your professional presence.",
      color: "text-green-400",
      glow: "group-hover:shadow-green-500/20",
      iconBg: "bg-green-500/10",
    },
  ];

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-16 lg:py-20">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 text-center shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl sm:p-6 ${item.glow}`}
            >
              {/* Top gradient line */}
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconBg} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon
                  size={30}
                  strokeWidth={1.8}
                  className={item.color}
                  aria-hidden="true"
                />
              </div>

              <h2
                className={`mt-5 text-lg font-bold leading-snug sm:text-xl ${item.color}`}
              >
                {item.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Stats;