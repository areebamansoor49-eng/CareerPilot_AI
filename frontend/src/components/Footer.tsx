import { Link, useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-white/10 bg-[#050816] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="text-3xl font-bold text-blue-400 hover:text-blue-300 transition"
            >
              CareerPilot AI
            </Link>

            <p className="mt-5 text-gray-400 leading-7 max-w-sm">
              AI-powered career guidance helping students and fresh
              graduates build skills, prepare for interviews, improve
              resumes, and discover better career opportunities.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-lg mb-5">
              Product
            </h3>

            <div className="space-y-4 text-gray-400">
              <Link
                to="/demo"
                className="block hover:text-blue-400 transition"
              >
                Resume Analyzer
              </Link>

              <Link
                to="/demo"
                className="block hover:text-blue-400 transition"
              >
                AI Interviews
              </Link>

              <Link
                to="/demo"
                className="block hover:text-blue-400 transition"
              >
                Career Roadmap
              </Link>

              <Link
                to="/demo"
                className="block hover:text-blue-400 transition"
              >
                Opportunity Finder
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-5">
              Company
            </h3>

            <div className="space-y-4 text-gray-400">
              <button
                type="button"
                onClick={handleHomeClick}
                className="block text-left hover:text-blue-400 transition"
              >
                Home
              </button>

              <Link
                to="/about"
                className="block hover:text-blue-400 transition"
              >
                About
              </Link>

              <Link
                to="/contact"
                className="block hover:text-blue-400 transition"
              >
                Contact
              </Link>

              <Link
                to="/privacy"
                className="block hover:text-blue-400 transition"
              >
                Privacy
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-5">
              Resources
            </h3>

            <div className="space-y-4 text-gray-400">
              <Link
                to="/demo"
                className="block hover:text-blue-400 transition"
              >
                Demo
              </Link>

              <Link
                to="/dashboard"
                className="block hover:text-blue-400 transition"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-14 pt-7 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500">
          <p className="text-center md:text-left">
            © 2026 CareerPilot AI. Founded & Created by Areeba Mansoor.
            All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="hover:text-white transition"
            >
              Privacy
            </Link>

            <Link
              to="/contact"
              className="hover:text-white transition"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;