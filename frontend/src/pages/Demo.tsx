import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaPlay,
  FaRocket,
} from "react-icons/fa";

function Demo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-blue-950 text-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <FaRocket className="text-blue-400" />

            <span className="font-bold">
              CareerPilot AI
            </span>
          </div>

          {/* Get Started */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-violet-600
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:from-blue-500
              hover:to-violet-500
            "
          >
            Get Started
            <FaArrowRight className="text-xs" />
          </button>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main>
        {/* =================================================
            HERO + VIDEO
        ================================================= */}

        <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20">
          {/* Background Glow */}

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="absolute right-[-8rem] top-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />

            <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-5xl text-center">
            {/* Badge */}

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
              <FaPlay className="text-xs" />
              CareerPilot AI Demo
            </div>

            {/* Heading */}

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              See CareerPilot AI

              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
                in action.
              </span>
            </h1>

            {/* Description */}

            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              Explore CareerPilot AI and see how the platform helps
              students and fresh graduates navigate their career journey
              with intelligent tools and personalized guidance.
            </p>
          </div>

          {/* =================================================
              VIDEO
          ================================================= */}

          <div className="relative mx-auto mt-14 max-w-5xl">
            {/* Glow */}

            <div className="absolute -inset-4 rounded-[2rem] bg-blue-500/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50">
              {/* Video Header */}

              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />

                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />

                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>

                <p className="text-xs font-medium text-slate-500 sm:text-sm">
                  CareerPilot AI — Product Demo
                </p>

                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  Demo Video
                </div>
              </div>

              {/* Video Player */}

             <div className="relative bg-black">
  <video
    className="block h-auto max-h-[700px] w-full object-contain"
    controls
    playsInline
    preload="metadata"
    width="1920"
  >
    <source
      src="/careerpilot-demo.mp4"
      type="video/mp4"
    />

    Your browser does not support the video tag.
  </video>
</div>
            </div>
          </div>

          {/* Video Description */}

          <div className="relative mx-auto mt-8 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-400">
              <FaPlay className="text-blue-400" />
              Watch the complete CareerPilot AI walkthrough
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
              See the platform from start to finish and discover the
              CareerPilot AI experience in one place.
            </p>
          </div>
        </section>

        {/* =================================================
            CTA
        ================================================= */}

        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-blue-600/10 via-slate-900 to-violet-600/10 p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <FaCheckCircle className="text-2xl" />
            </div>

            <h2 className="mt-6 text-3xl font-bold sm:text-4xl">
              Ready to build your career?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Create your CareerPilot profile and start your journey
              toward better career opportunities.
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
                mt-8
                inline-flex
                items-center
                gap-3
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-violet-600
                px-7
                py-3.5
                font-semibold
                text-white
                shadow-lg
                shadow-blue-950/30
                transition
                hover:-translate-y-0.5
                hover:from-blue-500
                hover:to-violet-500
              "
            >
              Get Started with CareerPilot
              <FaArrowRight />
            </button>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-slate-800 px-5 py-8 text-center sm:px-8">
        <div className="flex items-center justify-center gap-2">
          <FaRocket className="text-blue-400" />

          <span className="font-bold">
            CareerPilot AI
          </span>
        </div>

        <p className="mt-2 text-sm text-slate-600">
          Your intelligent career companion.
        </p>
      </footer>
    </div>
  );
}

export default Demo;