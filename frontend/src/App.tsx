import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import type { ReactNode } from "react";

/* =========================================================
   MAIN PAGES
========================================================= */

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Demo from "./pages/Demo";

/* =========================================================
   DASHBOARD / CAREER PAGES
========================================================= */

import Profile from "./pages/Profile";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import AIInterview from "./pages/AIInterview";
import CareerRoadmap from "./pages/CareerRoadmap";
import OpportunityFinder from "./pages/OpportunityFinder";
import LinkedInOptimizer from "./pages/LinkedInOptimizer";
import Subscription from "./pages/Subscription";

/* =========================================================
   OTHER PAGES
========================================================= */

import Features from "./pages/Features";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Community from "./pages/Community";
import Contact from "./pages/Contact";
import Documentation from "./pages/Documentation";
import Privacy from "./pages/Privacy";
import Settings from "./pages/Settings";

/* =========================================================
   PAGE HOME BUTTON
   Shows ONLY one Home button on non-home pages.
========================================================= */

function PageHomeButton() {
  const location = useLocation();

  // Home page par Home button show nahi hoga
  if (location.pathname === "/") {
    return null;
  }

  return (
    <Link
      to="/"
      aria-label="Go to Home"
      className="
        fixed
        top-6
        left-6
        z-50
        flex
        items-center
        gap-2
        rounded-xl
        border
        border-white/10
        bg-slate-900/80
        px-5
        py-2.5
        text-sm
        font-semibold
        text-white
        shadow-lg
        backdrop-blur-md
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-blue-400/40
        hover:bg-blue-600
        hover:shadow-blue-500/20
      "
    >
      <span className="text-lg" aria-hidden="true">
        ←
      </span>

      <span>Home</span>
    </Link>
  );
}

/* =========================================================
   PAGE LAYOUT
   Keeps the single global Home button.
========================================================= */

function PageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageHomeButton />
      {children}
    </>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =================================================
            HOME
        ================================================= */}

        <Route path="/" element={<Home />} />

        {/* =================================================
            AUTHENTICATION
        ================================================= */}

        <Route
          path="/login"
          element={
            <PageLayout>
              <Login />
            </PageLayout>
          }
        />

        <Route
          path="/register"
          element={
            <PageLayout>
              <Register />
            </PageLayout>
          }
        />

        {/* =================================================
            DEMO
        ================================================= */}

        <Route
          path="/demo"
          element={
            <PageLayout>
              <Demo />
            </PageLayout>
          }
        />

        {/* =================================================
            DASHBOARD
        ================================================= */}

        <Route
          path="/dashboard"
          element={
            <PageLayout>
              <Dashboard />
            </PageLayout>
          }
        />

        {/* =================================================
            PROFILE
        ================================================= */}

        <Route
          path="/profile"
          element={
            <PageLayout>
              <Profile />
            </PageLayout>
          }
        />

        {/* =================================================
            CAREER FEATURES
        ================================================= */}

        <Route
          path="/resume-analyzer"
          element={
            <PageLayout>
              <ResumeAnalyzer />
            </PageLayout>
          }
        />

        <Route
          path="/internship-finder"
          element={
            <PageLayout>
              <OpportunityFinder />
            </PageLayout>
          }
        />

        <Route
          path="/career-roadmap"
          element={
            <PageLayout>
              <CareerRoadmap />
            </PageLayout>
          }
        />

        {/* =================================================
            AI INTERVIEW
        ================================================= */}

        <Route
          path="/ai-interview"
          element={
            <PageLayout>
              <AIInterview />
            </PageLayout>
          }
        />

        {/* Old route kept for compatibility */}
        <Route
          path="/ai-interviews"
          element={<Navigate to="/ai-interview" replace />}
        />

        {/* =================================================
            LINKEDIN OPTIMIZER
        ================================================= */}

        <Route
          path="/linkedin-optimizer"
          element={
            <PageLayout>
              <LinkedInOptimizer />
            </PageLayout>
          }
        />

        {/* =================================================
            SETTINGS
        ================================================= */}

        <Route
          path="/settings"
          element={
            <PageLayout>
              <Settings />
            </PageLayout>
          }
        />

        {/* =================================================
            SUBSCRIPTION
        ================================================= */}

        <Route
          path="/subscription"
          element={
            <PageLayout>
              <Subscription />
            </PageLayout>
          }
        />

        {/* =================================================
            GENERAL PAGES
        ================================================= */}

        <Route
          path="/features"
          element={
            <PageLayout>
              <Features />
            </PageLayout>
          }
        />

        <Route
          path="/about"
          element={
            <PageLayout>
              <About />
            </PageLayout>
          }
        />

        <Route
          path="/blog"
          element={
            <PageLayout>
              <Blog />
            </PageLayout>
          }
        />

        <Route
          path="/community"
          element={
            <PageLayout>
              <Community />
            </PageLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <PageLayout>
              <Contact />
            </PageLayout>
          }
        />

        <Route
          path="/documentation"
          element={
            <PageLayout>
              <Documentation />
            </PageLayout>
          }
        />

        

        <Route
          path="/privacy"
          element={
            <PageLayout>
              <Privacy />
            </PageLayout>
          }
        />

        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;