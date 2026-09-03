import {
  FaBell,
  FaBars,
  FaSearch,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaTachometerAlt,
} from "react-icons/fa";

import { useEffect, useState } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

interface GoogleUser {
  name?: string;
  email?: string;
  picture?: string;
}

interface TopbarProps {
  onMenuClick?: () => void;
}

/* =========================================================
   PAGE TITLES
========================================================= */

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/resume-analyzer": "Resume Analyzer",
  "/internship-finder": "Internship Finder",
  "/career-roadmap": "Career Roadmap",
  "/ai-interview": "AI Interview",
  "/ai-interviews": "AI Interview",
  "/linkedin-optimizer": "LinkedIn Optimizer",
  "/profile": "My Profile",
  "/settings": "Settings",
  "/subscription": "Subscription",
};

/* =========================================================
   TOPBAR
========================================================= */

function Topbar({
  onMenuClick,
}: TopbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showProfile, setShowProfile] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [user, setUser] =
    useState<GoogleUser | null>(null);

  /* =======================================================
     LOAD LOGGED-IN USER
  ======================================================= */

  const loadUser = () => {
    try {
      const savedUser =
        localStorage.getItem("user");

      if (!savedUser) {
        setUser(null);
        return;
      }

      const parsedUser: GoogleUser =
        JSON.parse(savedUser);

      setUser(parsedUser);
    } catch (error) {
      console.error(
        "Failed to load user:",
        error
      );

      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    const handleUserUpdate = () => {
      loadUser();
    };

    window.addEventListener(
      "userDataUpdated",
      handleUserUpdate
    );

    window.addEventListener(
      "profileUpdated",
      handleUserUpdate
    );

    window.addEventListener(
      "careerProfileUpdated",
      handleUserUpdate
    );

    return () => {
      window.removeEventListener(
        "userDataUpdated",
        handleUserUpdate
      );

      window.removeEventListener(
        "profileUpdated",
        handleUserUpdate
      );

      window.removeEventListener(
        "careerProfileUpdated",
        handleUserUpdate
      );
    };
  }, [location.pathname]);

  /* =======================================================
     PAGE TITLE
  ======================================================= */

  const currentTitle =
    pageTitles[location.pathname] ||
    "CareerPilot AI";

  /* =======================================================
     DASHBOARD CHECK
  ======================================================= */

  const isDashboard =
    location.pathname === "/dashboard";

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const goTo = (path: string) => {
    setShowNotifications(false);
    setShowProfile(false);
    setSearch("");

    navigate(path);
  };

  /* =======================================================
     SEARCH
  ======================================================= */

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const query =
      search.trim().toLowerCase();

    if (!query) return;

    if (
      query.includes("resume") ||
      query.includes("cv") ||
      query.includes("ats")
    ) {
      goTo("/resume-analyzer");
      return;
    }

    if (
      query.includes("internship") ||
      query.includes("job") ||
      query.includes("opportunity")
    ) {
      goTo("/internship-finder");
      return;
    }

    if (
      query.includes("roadmap") ||
      query.includes("career path")
    ) {
      goTo("/career-roadmap");
      return;
    }

    if (
      query.includes("interview")
    ) {
      goTo("/ai-interview");
      return;
    }

    if (
      query.includes("linkedin")
    ) {
      goTo("/linkedin-optimizer");
      return;
    }

    if (
      query.includes("profile")
    ) {
      goTo("/profile");
      return;
    }

    if (
      query.includes("settings") ||
      query.includes("setting")
    ) {
      goTo("/settings");
      return;
    }

    if (
      query.includes("dashboard")
    ) {
      goTo("/dashboard");
      return;
    }

    alert(
      `No feature found for "${search}".`
    );

    setSearch("");
  };

  /* =======================================================
     LOGOUT
     
     IMPORTANT:
     Clear ALL user-specific localStorage data so the
     next logged-in user starts with an empty dashboard.
  ======================================================= */

  const logout = () => {
    /* Remove logged-in user */
    localStorage.removeItem("user");

    /* Remove profile information */
    localStorage.removeItem("profile");

    /* Remove resume information */
    localStorage.removeItem("resumeData");

    /* Remove application information */
    localStorage.removeItem("applications");

    /* Remove internship information */
    localStorage.removeItem("internships");
    localStorage.removeItem("internshipData");
    localStorage.removeItem("savedInternships");

    /* Remove any temporary session information */
    sessionStorage.clear();

    /* Clear Topbar state immediately */
    setUser(null);
    setShowProfile(false);
    setShowNotifications(false);
    setSearch("");

    /* Notify other components */
    window.dispatchEvent(
      new Event("userDataUpdated")
    );

    window.dispatchEvent(
      new Event("profileUpdated")
    );

    window.dispatchEvent(
      new Event("careerProfileUpdated")
    );

    window.dispatchEvent(
      new Event("resumeDataUpdated")
    );

    window.dispatchEvent(
      new Event("applicationsUpdated")
    );

    window.dispatchEvent(
      new Event("internshipsUpdated")
    );

    /* Go to Home */
    navigate("/", {
      replace: true,
    });
  };

  /* =======================================================
     CLOSE POPUPS ON PAGE CHANGE
  ======================================================= */

  useEffect(() => {
    setShowNotifications(false);
    setShowProfile(false);
  }, [location.pathname]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <header
      className="
        sticky
        top-0
        z-40
        h-20
        border-b
        border-slate-800
        bg-slate-950/90
        backdrop-blur-xl
      "
    >
      <div
        className="
          h-full
          px-4
          sm:px-5
          lg:px-10
          flex
          items-center
          justify-between
          gap-4
        "
      >

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="flex items-center gap-3 sm:gap-4">

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={onMenuClick}
            className="
              lg:hidden
              w-11
              h-11
              rounded-xl
              bg-slate-900
              border
              border-slate-800
              flex
              items-center
              justify-center
              text-white
              hover:bg-slate-800
              hover:border-blue-500
              transition
              cursor-pointer
            "
            aria-label="Open menu"
          >
            <FaBars />
          </button>

          {/* TITLE */}

          <div className="min-w-0">

            <h1
              className="
                text-xl
                sm:text-2xl
                font-bold
                text-white
                truncate
              "
            >
              {currentTitle}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400">
              {isDashboard
                ? "Welcome back 👋"
                : "CareerPilot AI"}
            </p>

          </div>

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div
          className="
            hidden
            md:flex
            flex-1
            justify-center
            px-4
            lg:px-8
          "
        >

          <form
            onSubmit={handleSearch}
            className="
              w-full
              max-w-xl
              relative
            "
          >

            <FaSearch
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-500
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search career tools..."
              className="
                w-full
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                py-3
                pl-11
                pr-4
                outline-none
                text-white
                placeholder:text-slate-600
                focus:border-blue-500
                transition
              "
            />

          </form>

        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="flex items-center gap-2 sm:gap-3">

          {/* =================================================
              HOME BUTTON
              
              HOME BUTTON:
              Visible on Dashboard and all inner pages.
          ================================================= */}

          <button
            type="button"
            onClick={() => goTo("/")}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              px-3
              sm:px-4
              py-2.5
              bg-slate-900
              border
              border-slate-800
              text-slate-300
              hover:bg-slate-800
              hover:border-blue-500
              hover:text-white
              transition
              cursor-pointer
            "
            title="Home"
            aria-label="Go to Home"
          >

            <FaHome />

            <span className="hidden lg:inline">
              Home
            </span>

          </button>

          {/* =================================================
              DASHBOARD BUTTON
              
              IMPORTANT:
              Only appears on NON-DASHBOARD pages.
              
              So Dashboard will NOT have:
              - Dashboard button in Topbar
              - Dashboard button in profile dropdown
          ================================================= */}

          {!isDashboard && (
            <button
              type="button"
              onClick={() =>
                goTo("/dashboard")
              }
              className="
                flex
                items-center
                gap-2
                rounded-xl
                px-3
                sm:px-4
                py-2.5
                bg-blue-600
                border
                border-blue-500
                text-white
                hover:bg-blue-700
                transition
                cursor-pointer
                shadow-lg
                shadow-blue-900/20
              "
              title="Dashboard"
              aria-label="Go to Dashboard"
            >

              <FaTachometerAlt />

              <span className="hidden lg:inline">
                Dashboard
              </span>

            </button>
          )}

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div className="relative">

            <button
              type="button"
              onClick={() => {
                setShowNotifications(
                  (previous) => !previous
                );

                setShowProfile(false);
              }}
              className="
                relative
                w-11
                h-11
                rounded-xl
                bg-slate-900
                border
                border-slate-800
                flex
                items-center
                justify-center
                hover:bg-slate-800
                hover:border-blue-500
                transition
                cursor-pointer
              "
              aria-label="Notifications"
            >

              <FaBell className="text-white" />

              <span
                className="
                  absolute
                  top-2
                  right-2
                  w-2
                  h-2
                  rounded-full
                  bg-red-500
                "
              />

            </button>

            {/* NOTIFICATION DROPDOWN */}

            {showNotifications && (
              <div
                className="
                  absolute
                  right-0
                  mt-3
                  w-80
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-900
                  shadow-2xl
                  overflow-hidden
                "
              >

                <div
                  className="
                    p-5
                    border-b
                    border-slate-800
                    flex
                    items-center
                    justify-between
                  "
                >

                  <h3 className="font-semibold text-white">
                    Notifications
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      setShowNotifications(false)
                    }
                    className="
                      text-slate-500
                      hover:text-white
                      cursor-pointer
                    "
                    aria-label="Close notifications"
                  >
                    <FaTimes />
                  </button>

                </div>

                <div className="p-5 space-y-3">

                  <button
                    type="button"
                    onClick={() =>
                      goTo("/resume-analyzer")
                    }
                    className="
                      w-full
                      text-left
                      rounded-xl
                      bg-slate-800/70
                      p-4
                      hover:bg-slate-800
                      transition
                      cursor-pointer
                    "
                  >

                    <p className="text-white font-medium">
                      Welcome to CareerPilot AI
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      Start by uploading your resume.
                    </p>

                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      goTo("/internship-finder")
                    }
                    className="
                      w-full
                      text-left
                      rounded-xl
                      bg-slate-800/70
                      p-4
                      hover:bg-slate-800
                      transition
                      cursor-pointer
                    "
                  >

                    <p className="text-white font-medium">
                      AI Features Available
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      Explore your career opportunities.
                    </p>

                  </button>

                </div>

              </div>
            )}

          </div>

          {/* =================================================
              PROFILE
              
              Only logged-in user is shown.
          ================================================= */}

          {user && (
            <div className="relative">

              <button
                type="button"
                onClick={() => {
                  setShowProfile(
                    (previous) => !previous
                  );

                  setShowNotifications(false);
                }}
                className="
                  bg-slate-900
                  border
                  border-slate-800
                  rounded-2xl
                  px-2
                  sm:px-3
                  py-2
                  flex
                  items-center
                  gap-3
                  hover:border-blue-500
                  transition
                  cursor-pointer
                "
                aria-label="Profile menu"
              >

                {/* PROFILE IMAGE OR INITIAL */}

                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || "User"}
                    className="
                      w-10
                      h-10
                      sm:w-11
                      sm:h-11
                      rounded-full
                      object-cover
                      border-2
                      border-blue-500
                    "
                  />
                ) : (
                  <div
                    className="
                      w-10
                      h-10
                      sm:w-11
                      sm:h-11
                      rounded-full
                      bg-gradient-to-br
                      from-blue-600
                      to-purple-600
                      flex
                      items-center
                      justify-center
                      font-bold
                      text-white
                    "
                  >
                    {(user.name || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div className="hidden md:block text-left">

                  <h2 className="text-white font-semibold">
                    {user.name || "User"}
                  </h2>

                  <p className="text-xs text-slate-400">
                    {user.email || ""}
                  </p>

                </div>

              </button>

              {/* =================================================
                  PROFILE DROPDOWN

                  ONLY:
                  - My Profile
                  - Logout

                  NO Dashboard
                  NO Home
              ================================================= */}

              {showProfile && (
                <div
                  className="
                    absolute
                    right-0
                    mt-3
                    w-72
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900
                    shadow-2xl
                    overflow-hidden
                  "
                >

                  {/* USER INFORMATION */}

                  <div className="p-5 border-b border-slate-800">

                    <div className="flex items-center gap-3">

                      {user.picture ? (
                        <img
                          src={user.picture}
                          alt={user.name || "User"}
                          className="
                            w-12
                            h-12
                            rounded-full
                            object-cover
                            border-2
                            border-blue-500
                          "
                        />
                      ) : (
                        <div
                          className="
                            w-12
                            h-12
                            rounded-full
                            bg-gradient-to-br
                            from-blue-600
                            to-purple-600
                            flex
                            items-center
                            justify-center
                            font-bold
                            text-white
                          "
                        >
                          {(user.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">

                        <p className="font-semibold text-white truncate">
                          {user.name || "User"}
                        </p>

                        <p className="text-xs text-slate-400 truncate">
                          {user.email || ""}
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="p-3">

                    {/* MY PROFILE */}

                    <button
                      type="button"
                      onClick={() =>
                        goTo("/profile")
                      }
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-slate-300
                        hover:bg-slate-800
                        hover:text-white
                        transition
                        text-left
                        cursor-pointer
                      "
                    >

                      <FaUser className="text-blue-400" />

                      <span>
                        My Profile
                      </span>

                    </button>

                    {/* LOGOUT */}

                    <button
                      type="button"
                      onClick={logout}
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-red-400
                        hover:bg-red-500/10
                        transition
                        text-left
                        cursor-pointer
                      "
                    >

                      <FaSignOutAlt />

                      <span>
                        Logout
                      </span>

                    </button>

                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </header>
  );
}

export default Topbar;