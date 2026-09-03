import { useState } from "react";
import {
  FaBrain,
  FaChevronDown,
  FaFileAlt,
  FaMicrophone,
  FaRoad,
  FaSearch,
  FaLinkedin,
  FaTachometerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface FeatureItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

function Navbar() {
  const navigate = useNavigate();

  const [featuresOpen, setFeaturesOpen] = useState(false);

  const features: FeatureItem[] = [
    {
      title: "Resume Analyzer",
      path: "/resume-analyzer",
      icon: <FaFileAlt />,
    },
    {
      title: "AI Mock Interview",
      path: "/ai-interviews",
      icon: <FaMicrophone />,
    },
    {
      title: "Career Roadmap",
      path: "/career-roadmap",
      icon: <FaRoad />,
    },
    {
      title: "Internship Finder",
      path: "/internship-finder",
      icon: <FaSearch />,
    },
    {
      title: "LinkedIn Optimizer",
      path: "/linkedin-optimizer",
      icon: <FaLinkedin />,
    },
  ];

  // ==========================================
  // CHECK LOGIN
  // ==========================================

  const isLoggedIn = Boolean(
    localStorage.getItem("user")
  );

  // ==========================================
  // LOGIN / DASHBOARD LOGIC
  // ==========================================

  const handleProtectedNavigation = (
    path: string
  ) => {
    setFeaturesOpen(false);

    const user = localStorage.getItem("user");

    if (user) {
      navigate(path);
    } else {
      navigate("/login", {
        state: {
          redirectTo: path,
        },
      });
    }
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  // ==========================================
  // GET STARTED
  // ==========================================

  const handleGetStarted = () => {
    const user = localStorage.getItem("user");

    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  // ==========================================
  // DASHBOARD
  // ==========================================

  const handleDashboard = () => {
    const user = localStorage.getItem("user");

    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login", {
        state: {
          redirectTo: "/dashboard",
        },
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* ======================================
            LOGO
        ====================================== */}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-900/30">
            <FaBrain className="text-lg text-white" />
          </div>

          <div className="text-left">
            <h1 className="text-lg font-bold text-white">
              CareerPilot AI
            </h1>

            <p className="hidden text-xs text-slate-500 sm:block">
              AI-powered career platform
            </p>
          </div>
        </button>

        {/* ======================================
            DESKTOP NAVIGATION
        ====================================== */}

        <nav className="hidden items-center gap-3 md:flex">

          {/* FEATURES DROPDOWN */}

          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setFeaturesOpen((previous) => !previous)
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-semibold
                text-slate-300
                transition
                hover:bg-slate-800
                hover:text-white
              "
            >
              Features

              <FaChevronDown
                className={`text-xs transition-transform duration-200 ${
                  featuresOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* DROPDOWN */}

            {featuresOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  mt-3
                  w-72
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-700
                  bg-slate-900
                  p-2
                  shadow-2xl
                  shadow-black/40
                "
              >

                <div className="px-3 pb-2 pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Career Tools
                  </p>
                </div>

                {features.map((feature) => (
                  <button
                    key={feature.path}
                    type="button"
                    onClick={() =>
                      handleProtectedNavigation(
                        feature.path
                      )
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-3
                      text-left
                      text-sm
                      font-medium
                      text-slate-300
                      transition
                      hover:bg-slate-800
                      hover:text-white
                    "
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                      {feature.icon}
                    </span>

                    <span>
                      {feature.title}
                    </span>
                  </button>
                ))}

              </div>
            )}

          </div>

          {/* LOGIN */}

          <button
            type="button"
            onClick={handleLogin}
            className="
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              px-5
              py-2.5
              text-sm
              font-semibold
              text-slate-200
              transition
              hover:border-blue-500/50
              hover:bg-slate-800
              hover:text-white
            "
          >
            Login
          </button>

          {/* GET STARTED */}

          <button
            type="button"
            onClick={handleGetStarted}
            className="
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              px-5
              py-2.5
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-blue-900/30
              transition
              hover:scale-[1.02]
            "
          >
            Get Started
          </button>

          {/* STUDENT DASHBOARD */}

          <button
            type="button"
            onClick={handleDashboard}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-blue-500/30
              bg-blue-500/10
              px-5
              py-2.5
              text-sm
              font-semibold
              text-blue-300
              transition
              hover:border-blue-400
              hover:bg-blue-500/20
              hover:text-white
            "
          >
            <FaTachometerAlt />
            Student Dashboard
          </button>

        </nav>

        {/* ======================================
            MOBILE MENU
        ====================================== */}

        <div className="flex items-center gap-2 md:hidden">

          <button
            type="button"
            onClick={handleDashboard}
            className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-blue-400"
            aria-label="Student Dashboard"
          >
            <FaTachometerAlt />
          </button>

          <button
            type="button"
            onClick={handleGetStarted}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-bold text-white"
          >
            Get Started
          </button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;