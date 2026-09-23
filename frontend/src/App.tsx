import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import type { ReactNode } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Demo from "./pages/Demo";

import Profile from "./pages/Profile";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import AIInterview from "./pages/AIInterview";
import CareerRoadmap from "./pages/CareerRoadmap";
import OpportunityFinder from "./pages/OpportunityFinder";
import LinkedInOptimizer from "./pages/LinkedInOptimizer";
import Subscription from "./pages/Subscription";

import Features from "./pages/Features";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Community from "./pages/Community";
import Contact from "./pages/Contact";
import Documentation from "./pages/Documentation";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/RefundPolicy";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";

/* =========================================================
   HOME BUTTON
========================================================= */

function PageHomeButton() {
  const location = useLocation();

  const dashboardPaths = [
    "/dashboard",
    "/resume-analyzer",
    "/opportunity-finder",
    "/career-roadmap",
    "/ai-interview",
    "/linkedin-optimizer",
    "/settings",
    "/subscription",
  ];

  const isDashboardPage = dashboardPaths.some(
    (path) =>
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
  );

  if (location.pathname === "/" || isDashboardPage) {
    return null;
  }

  return (
    <Link
      to="/"
      aria-label="Go to Home"
      className="fixed left-6 top-6 z-50 flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-5 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/40 hover:bg-blue-600 hover:shadow-blue-500/20"
    >
      <span
        className="text-lg"
        aria-hidden="true"
      >
        ←
      </span>

      <span>Home</span>
    </Link>
  );
}

/* =========================================================
   PAGE LAYOUT
========================================================= */

function PageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <PageHomeButton />
      {children}
    </>
  );
}

/* =========================================================
   PROTECTED PAGE
   Login required
========================================================= */

function ProtectedPage({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageLayout>
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </PageLayout>
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
            PUBLIC ROUTES
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

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

        <Route
          path="/demo"
          element={
            <PageLayout>
              <Demo />
            </PageLayout>
          }
        />

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

        <Route
          path="/terms"
          element={
            <PageLayout>
              <Terms />
            </PageLayout>
          }
        />

        <Route
          path="/refund-policy"
          element={
            <PageLayout>
              <RefundPolicy />
            </PageLayout>
          }
        />

        {/* =================================================
            AUTHENTICATED ROUTES
            Login required
        ================================================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedPage>
              <Dashboard />
            </ProtectedPage>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedPage>
              <Profile />
            </ProtectedPage>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedPage>
              <Settings />
            </ProtectedPage>
          }
        />

        {/* =================================================
            OPPORTUNITY FINDER
            FREE + LOGIN REQUIRED
        ================================================= */}

        <Route
          path="/opportunity-finder"
          element={
            <ProtectedPage>
              <OpportunityFinder />
            </ProtectedPage>
          }
        />

        {/* =================================================
            LEGACY INTERNSHIP FINDER URL
        ================================================= */}

        <Route
          path="/internship-finder"
          element={
            <Navigate
              to="/opportunity-finder"
              replace
            />
          }
        />

        {/* =================================================
            RESUME ANALYZER
            Login required.
            Own free-use/subscription logic remains inside.
        ================================================= */}

        <Route
          path="/resume-analyzer"
          element={
            <ProtectedPage>
              <ResumeAnalyzer />
            </ProtectedPage>
          }
        />

        {/* =================================================
            CAREER ROADMAP
            Login required.
            Premium preview/access logic remains inside.
        ================================================= */}

        <Route
          path="/career-roadmap"
          element={
            <ProtectedPage>
              <CareerRoadmap />
            </ProtectedPage>
          }
        />

        {/* =================================================
            AI INTERVIEW
            Login required.
            Premium/free-use logic remains inside.
        ================================================= */}

        <Route
          path="/ai-interview"
          element={
            <ProtectedPage>
              <AIInterview />
            </ProtectedPage>
          }
        />

        {/* =================================================
            LINKEDIN OPTIMIZER
            Login required.
            Premium preview/access logic remains inside.
        ================================================= */}

        <Route
          path="/linkedin-optimizer"
          element={
            <ProtectedPage>
              <LinkedInOptimizer />
            </ProtectedPage>
          }
        />

        {/* =================================================
            LEGACY AI INTERVIEW URL
        ================================================= */}

        <Route
          path="/ai-interviews"
          element={
            <Navigate
              to="/ai-interview"
              replace
            />
          }
        />

        {/* =================================================
            SUBSCRIPTION
            Login required
        ================================================= */}

        <Route
          path="/subscription"
          element={
            <ProtectedPage>
              <Subscription />
            </ProtectedPage>
          }
        />

        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;