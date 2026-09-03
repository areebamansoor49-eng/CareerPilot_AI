import {
  FaHome,
  FaFileAlt,
  FaBriefcase,
  FaRoute,
  FaRobot,
  FaLinkedin,
  FaCog,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

const menuItems = [
  {
    name: "Dashboard",
    icon: <FaHome />,
    path: "/dashboard",
  },
  {
    name: "Resume Analyzer",
    icon: <FaFileAlt />,
    path: "/resume-analyzer",
  },
  {
    name: "Internship Finder",
    icon: <FaBriefcase />,
    path: "/internship-finder",
  },
  {
    name: "Career Roadmap",
    icon: <FaRoute />,
    path: "/career-roadmap",
  },
  {
    name: "AI Interview",
    icon: <FaRobot />,
    path: "/ai-interview",
  },
  {
    name: "LinkedIn Optimizer",
    icon: <FaLinkedin />,
    path: "/linkedin-optimizer",
  },
  {
    name: "Settings",
    icon: <FaCog />,
    path: "/settings",
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function Sidebar({
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [showLogoutPopup, setShowLogoutPopup] =
    useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    onMobileClose?.();
  };

  const confirmLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    sessionStorage.clear();

    setShowLogoutPopup(false);

    onMobileClose?.();

    navigate("/", {
      replace: true,
    });
  };

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {mobileOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/60
            backdrop-blur-sm
            lg:hidden
          "
          onClick={onMobileClose}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed
          lg:static
          inset-y-0
          left-0
          z-50
          w-72
          bg-slate-950
          border-r
          border-slate-800
          flex
          flex-col
          transition-transform
          duration-300
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* =================================================
            LOGO
        ================================================= */}

        <div className="px-6 py-7 border-b border-slate-800">
          <div className="flex items-center justify-between">

            <div>
              <Link
                to="/dashboard"
                onClick={onMobileClose}
                className="
                  text-2xl
                  font-bold
                  bg-gradient-to-r
                  from-blue-400
                  to-purple-500
                  bg-clip-text
                  text-transparent
                "
              >
                CareerPilot AI
              </Link>

              <p className="text-xs text-slate-500 mt-1">
                AI Career Platform
              </p>
            </div>

            {/* MOBILE CLOSE */}

            <button
              type="button"
              onClick={onMobileClose}
              className="
                lg:hidden
                w-10
                h-10
                rounded-xl
                bg-slate-900
                flex
                items-center
                justify-center
                text-slate-400
                hover:text-white
                hover:bg-slate-800
                transition
                cursor-pointer
              "
              aria-label="Close menu"
            >
              <FaTimes />
            </button>

          </div>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="flex-1 px-5 py-8 overflow-y-auto">

          <ul className="space-y-2">

            {menuItems.map((item) => {
              const active =
                location.pathname === item.path ||
                (
                  item.path === "/ai-interview" &&
                  location.pathname === "/ai-interviews"
                );

              return (
                <li key={item.name}>

                  <button
                    type="button"
                    onClick={() =>
                      handleNavigation(item.path)
                    }
                    className={`
                      group
                      w-full
                      flex
                      items-center
                      gap-4
                      rounded-2xl
                      px-5
                      py-4
                      transition-all
                      duration-300
                      cursor-pointer
                      text-left
                      ${
                        active
                          ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-900/30"
                          : "text-slate-400 hover:bg-slate-900 hover:text-white"
                      }
                    `}
                  >
                    <span
                      className={`
                        text-lg
                        transition-colors
                        ${
                          active
                            ? "text-white"
                            : "text-slate-400 group-hover:text-blue-400"
                        }
                      `}
                    >
                      {item.icon}
                    </span>

                    <span className="font-medium">
                      {item.name}
                    </span>
                  </button>

                </li>
              );
            })}

          </ul>

        </nav>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <div className="p-5 border-t border-slate-800">

          <button
            type="button"
            onClick={() =>
              setShowLogoutPopup(true)
            }
            className="
              w-full
              flex
              items-center
              justify-center
              gap-3
              rounded-2xl
              py-4
              bg-red-600
              hover:bg-red-700
              text-white
              transition-all
              duration-300
              font-semibold
              hover:shadow-lg
              hover:shadow-red-900/30
              cursor-pointer
            "
          >
            <FaSignOutAlt />

            <span>
              Logout
            </span>
          </button>

        </div>
      </aside>

      {/* =====================================================
          LOGOUT POPUP
      ===================================================== */}

      {showLogoutPopup && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/70
            backdrop-blur-sm
            px-5
          "
        >
          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              border
              border-slate-800
              bg-slate-900
              p-8
              shadow-2xl
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-red-500/10
                  flex
                  items-center
                  justify-center
                "
              >
                <FaSignOutAlt className="text-red-400 text-xl" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  Logout
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Are you sure you want to logout?
                </p>
              </div>

            </div>

            <div className="flex gap-3 mt-8">

              <button
                type="button"
                onClick={() =>
                  setShowLogoutPopup(false)
                }
                className="
                  flex-1
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-800
                  py-3
                  text-white
                  font-semibold
                  hover:bg-slate-700
                  transition
                  cursor-pointer
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmLogout}
                className="
                  flex-1
                  rounded-xl
                  bg-red-600
                  py-3
                  text-white
                  font-semibold
                  hover:bg-red-700
                  transition
                  cursor-pointer
                "
              >
                Logout
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;