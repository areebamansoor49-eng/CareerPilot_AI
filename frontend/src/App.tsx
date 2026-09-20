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
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import PremiumRoute from "./components/PremiumRoute";

/* =========================================================
   HOME BUTTON
========================================================= */

function PageHomeButton() {
  const location = useLocation();

  if (location.pathname === "/") {
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
   PREMIUM PAGE
   Login + active subscription required
========================================================= */

function PremiumPage({
  children,
  featureName,
}: {
  children: ReactNode;
  featureName: string;
}) {
  return (
    <ProtectedRoute>
      <PremiumRoute featureName={featureName}>
        <PageLayout>
          {children}
        </PageLayout>
      </PremiumRoute>
    </ProtectedRoute>
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
            Keep for backward compatibility
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

            The existing ResumeAnalyzer page handles
            its one-free-use/subscription logic.
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
            PREMIUM FEATURES
            Login + ACTIVE SUBSCRIPTION REQUIRED
        ================================================= */}

        <Route
          path="/career-roadmap"
          element={
            <PremiumPage featureName="Career Roadmap">
              <CareerRoadmap />
            </PremiumPage>
          }
        />

        <Route
          path="/ai-interview"
          element={
            <PremiumPage featureName="AI Interview">
              <AIInterview />
            </PremiumPage>
          }
        />

        <Route
          path="/linkedin-optimizer"
          element={
            <PremiumPage featureName="LinkedIn Optimizer">
              <LinkedInOptimizer />
            </PremiumPage>
          }
        />

        {/* =================================================
            LEGACY AI INTERVIEW URL
            Keep for backward compatibility
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