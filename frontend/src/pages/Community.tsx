function Community() {
  const discussions = [
    {
      title: "How to prepare for a frontend developer interview?",
      category: "Interview Preparation",
      replies: "24 replies",
    },
    {
      title: "Best roadmap to learn Artificial Intelligence?",
      category: "Learning Path",
      replies: "18 replies",
    },
    {
      title: "How to improve my resume for internships?",
      category: "Career Advice",
      replies: "31 replies",
    },
  ];

  return (
    <div className="min-h-screen px-6 py-20">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold">
          CareerPilot Community
        </h1>

        <p className="mt-5 text-slate-400 max-w-3xl">
          Connect with students, share experiences, ask career
          questions, and learn from others on their professional journey.
        </p>


        <button
          className="
          mt-8
          px-6
          py-3
          rounded-xl
          bg-blue-600
          hover:bg-blue-500
          transition
          "
        >
          Create Discussion
        </button>


        <div className="mt-12 space-y-6">

          {discussions.map((discussion) => (
            <div
              key={discussion.title}
              className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900/60
              p-6
              hover:border-blue-500
              transition
              "
            >

              <div className="flex justify-between items-start gap-4">

                <div>

                  <h2 className="text-xl font-bold">
                    {discussion.title}
                  </h2>


                  <p className="mt-3 text-blue-400">
                    {discussion.category}
                  </p>

                </div>


                <span className="text-slate-400 text-sm">
                  {discussion.replies}
                </span>

              </div>


              <button
                className="
                mt-5
                text-blue-400
                hover:text-blue-300
                "
              >
                View Discussion →
              </button>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Community;