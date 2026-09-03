import {
  FaFileAlt,
  FaBriefcase,
  FaChartLine,
  FaPaperPlane,
  FaArrowRight,
  FaRobot,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaPlay,
} from "react-icons/fa";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import ReviewPopup from "../components/ReviewPopup";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import ProfileCard from "../components/dashboard/ProfileCard";

import {
  getUserProfile,
  type UserProfile,
} from "../utils/userProfile";

/* =========================================================
   TYPES
========================================================= */

interface ResumeData {
  fileName?: string;
  uploaded?: boolean;
  score?: number;
  atsScore?: number;
  skills?: string[];
  email?: string;
  userEmail?: string;
}

interface UserData {
  name?: string;
  email?: string;
  picture?: string;
}

interface ApplicationData {
  id?: string;
  company?: string;
  jobTitle?: string;
  status?: string;
  email?: string;
  userEmail?: string;
}

interface OpportunityData {
  id?: string;
  company?: string;
  title?: string;
  email?: string;
  userEmail?: string;
}

interface ActivityItem {
  id: string;
  title: string;
  status: string;
  type: "success" | "waiting";
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const navigate = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [resumeData, setResumeData] =
    useState<ResumeData | null>(null);

  const [userData, setUserData] =
    useState<UserData | null>(null);

  const [profileData, setProfileData] =
    useState<UserProfile | null>(null);

  const [applications, setApplications] =
    useState<ApplicationData[]>([]);

  const [opportunities, setOpportunities] =
    useState<OpportunityData[]>([]);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const [showReviewPopup, setShowReviewPopup] =
    useState(false);

  /* =======================================================
     LOAD USER DATA
  ======================================================= */

  const loadUserData = useCallback(() => {
    try {
      const savedUser =
        localStorage.getItem("user");

      if (!savedUser) {
        setUserData(null);
        return;
      }

      const parsedUser: UserData =
        JSON.parse(savedUser);

      setUserData(parsedUser);
    } catch (error) {
      console.error(
        "Failed to load user data:",
        error
      );

      setUserData(null);
    }
  }, []);

  /* =======================================================
     LOAD PROFILE DATA
  ======================================================= */

  const loadProfileData = useCallback(() => {
    try {
      const savedUser =
        localStorage.getItem("user");

      if (!savedUser) {
        setProfileData(null);
        return;
      }

      const currentUser: UserData =
        JSON.parse(savedUser);

      const profile =
        getUserProfile();

      const hasRealProfileData = Boolean(
        profile &&
          (
            profile.name ||
            profile.education ||
            profile.targetCareer ||
            profile.location ||
            profile.careerGoal ||
            profile.experienceLevel ||
            profile.jobType ||
            profile.workPreference ||
            (
              Array.isArray(profile.skills) &&
              profile.skills.length > 0
            )
          )
      );

      if (!hasRealProfileData) {
        setProfileData(null);
        return;
      }

      const profileWithEmail =
        profile as UserProfile & {
          email?: string;
          userEmail?: string;
        };

      const storedProfileEmail =
        profileWithEmail.email ||
        profileWithEmail.userEmail ||
        "";

      if (
        storedProfileEmail &&
        currentUser.email &&
        storedProfileEmail.toLowerCase() !==
          currentUser.email.toLowerCase()
      ) {
        setProfileData(null);
        return;
      }

      setProfileData(profile);
    } catch (error) {
      console.error(
        "Failed to load profile data:",
        error
      );

      setProfileData(null);
    }
  }, []);

  /* =======================================================
     LOAD RESUME DATA
  ======================================================= */

  const loadResumeData = useCallback(() => {
    try {
      const savedUser =
        localStorage.getItem("user");

      const savedResume =
        localStorage.getItem("resumeData");

      if (!savedUser || !savedResume) {
        setResumeData(null);
        return;
      }

      const currentUser: UserData =
        JSON.parse(savedUser);

      const parsedResume: ResumeData =
        JSON.parse(savedResume);

      if (
        !parsedResume ||
        parsedResume.uploaded !== true
      ) {
        setResumeData(null);
        return;
      }

      const resumeOwner =
        parsedResume.email ||
        parsedResume.userEmail ||
        "";

      if (
        resumeOwner &&
        currentUser.email &&
        resumeOwner.toLowerCase() !==
          currentUser.email.toLowerCase()
      ) {
        setResumeData(null);
        return;
      }

      setResumeData(parsedResume);
    } catch (error) {
      console.error(
        "Failed to load resume data:",
        error
      );

      setResumeData(null);
    }
  }, []);

  /* =======================================================
     LOAD APPLICATIONS
  ======================================================= */

  const loadApplications = useCallback(() => {
    try {
      const savedUser =
        localStorage.getItem("user");

      const savedApplications =
        localStorage.getItem("applications");

      if (!savedUser || !savedApplications) {
        setApplications([]);
        return;
      }

      const currentUser: UserData =
        JSON.parse(savedUser);

      const parsedApplications =
        JSON.parse(savedApplications);

      if (!Array.isArray(parsedApplications)) {
        setApplications([]);
        return;
      }

      const filteredApplications =
        parsedApplications.filter(
          (application: ApplicationData) => {
            const owner =
              application.email ||
              application.userEmail;

            if (!owner) {
              return true;
            }

            return (
              !currentUser.email ||
              owner.toLowerCase() ===
                currentUser.email.toLowerCase()
            );
          }
        );

      setApplications(filteredApplications);
    } catch (error) {
      console.error(
        "Failed to load applications:",
        error
      );

      setApplications([]);
    }
  }, []);

  /* =======================================================
     LOAD OPPORTUNITIES
  ======================================================= */

  const loadOpportunities = useCallback(() => {
    try {
      const savedUser =
        localStorage.getItem("user");

      if (!savedUser) {
        setOpportunities([]);
        return;
      }

      const currentUser: UserData =
        JSON.parse(savedUser);

      const possibleKeys = [
        "internships",
        "internshipData",
        "savedInternships",
      ];

      let foundData:
        | OpportunityData[]
        | null = null;

      for (const key of possibleKeys) {
        const stored =
          localStorage.getItem(key);

        if (!stored) continue;

        try {
          const parsed =
            JSON.parse(stored);

          if (Array.isArray(parsed)) {
            foundData = parsed;
            break;
          }
        } catch {
          // Continue checking other keys
        }
      }

      if (!foundData) {
        setOpportunities([]);
        return;
      }

      const filteredOpportunities =
        foundData.filter(
          (opportunity) => {
            const owner =
              opportunity.email ||
              opportunity.userEmail;

            if (!owner) {
              return true;
            }

            return (
              !currentUser.email ||
              owner.toLowerCase() ===
                currentUser.email.toLowerCase()
            );
          }
        );

      setOpportunities(filteredOpportunities);
    } catch (error) {
      console.error(
        "Failed to load opportunities:",
        error
      );

      setOpportunities([]);
    }
  }, []);

  /* =======================================================
     LOAD EVERYTHING
  ======================================================= */

  const loadDashboardData = useCallback(() => {
    loadUserData();
    loadProfileData();
    loadResumeData();
    loadApplications();
    loadOpportunities();
  }, [
    loadUserData,
    loadProfileData,
    loadResumeData,
    loadApplications,
    loadOpportunities,
  ]);

  /* =======================================================
     INITIAL LOAD + EVENTS
  ======================================================= */

  useEffect(() => {
    loadDashboardData();

    const handleProfileUpdate = () => {
      loadProfileData();
      loadUserData();
    };

    const handleResumeUpdate = () => {
      loadResumeData();
    };

    const handleApplicationsUpdate = () => {
      loadApplications();
    };

    const handleOpportunityUpdate = () => {
      loadOpportunities();
    };

    const handleStorageChange = (
      event: StorageEvent
    ) => {
      if (
        event.key === "user" ||
        event.key === "profile"
      ) {
        loadUserData();
        loadProfileData();
        loadResumeData();
        loadApplications();
        loadOpportunities();
      }

      if (event.key === "resumeData") {
        loadResumeData();
      }

      if (event.key === "applications") {
        loadApplications();
      }

      if (
        event.key === "internships" ||
        event.key === "internshipData" ||
        event.key === "savedInternships"
      ) {
        loadOpportunities();
      }
    };

    window.addEventListener(
      "careerProfileUpdated",
      handleProfileUpdate
    );

    window.addEventListener(
      "profileUpdated",
      handleProfileUpdate
    );

    window.addEventListener(
      "userDataUpdated",
      handleProfileUpdate
    );

    window.addEventListener(
      "resumeDataUpdated",
      handleResumeUpdate
    );

    window.addEventListener(
      "applicationsUpdated",
      handleApplicationsUpdate
    );

    window.addEventListener(
      "internshipsUpdated",
      handleOpportunityUpdate
    );

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "careerProfileUpdated",
        handleProfileUpdate
      );

      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdate
      );

      window.removeEventListener(
        "userDataUpdated",
        handleProfileUpdate
      );

      window.removeEventListener(
        "resumeDataUpdated",
        handleResumeUpdate
      );

      window.removeEventListener(
        "applicationsUpdated",
        handleApplicationsUpdate
      );

      window.removeEventListener(
        "internshipsUpdated",
        handleOpportunityUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, [
    loadDashboardData,
    loadProfileData,
    loadUserData,
    loadResumeData,
    loadApplications,
    loadOpportunities,
  ]);

  /* =======================================================
     REVIEW POPUP
  ======================================================= */

  useEffect(() => {
    const user =
      localStorage.getItem("user");

    const alreadyReviewed =
      localStorage.getItem(
        "reviewSubmitted"
      );

    if (
      user &&
      !alreadyReviewed
    ) {
      const timer = setTimeout(() => {
        setShowReviewPopup(true);
      }, 3000);

      return () =>
        clearTimeout(timer);
    }
  }, []);

  /* =======================================================
     MOBILE SIDEBAR
  ======================================================= */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  /* =======================================================
     LOGIN CHECK
  ======================================================= */

  useEffect(() => {
    const user =
      localStorage.getItem("user");

    if (!user) {
      navigate("/login", {
        replace: true,
      });
    }
  }, [navigate]);

  /* =======================================================
     USER INFORMATION
  ======================================================= */

  const displayName =
    userData?.name ||
    profileData?.name ||
    "Career Explorer";

  const displayEmail =
    userData?.email ||
    profileData?.email ||
    "";

  const firstLetter =
    displayName
      .trim()
      .charAt(0)
      .toUpperCase() || "C";

  /* =======================================================
     RESUME
  ======================================================= */

  const hasResume =
    resumeData?.uploaded === true;

  const resumeScore = hasResume
    ? typeof resumeData?.atsScore === "number"
      ? Math.round(resumeData.atsScore)
      : typeof resumeData?.score === "number"
      ? Math.round(resumeData.score)
      : 0
    : 0;

  /* =======================================================
     SKILLS
  ======================================================= */

  const resumeSkills =
    hasResume &&
    Array.isArray(resumeData?.skills)
      ? resumeData.skills
      : [];

  const profileSkills =
    Array.isArray(profileData?.skills)
      ? profileData.skills
      : [];

  const combinedSkills =
    resumeSkills.length > 0
      ? resumeSkills
      : profileSkills;

  const skillsCount =
    combinedSkills.length;

  const skillProgress =
    skillsCount > 0
      ? Math.min(
          100,
          skillsCount * 10
        )
      : 0;

  /* =======================================================
     PROFILE COMPLETION
  ======================================================= */

  const profileCompletion =
    useMemo(() => {
      if (!profileData) {
        return 0;
      }

      const fields = [
        profileData.name,
        profileData.education,
        profileData.targetCareer,
        profileData.location,
        profileData.careerGoal,
        profileData.experienceLevel,
        profileData.jobType,
        profileData.workPreference,
      ];

      const completed =
        fields.filter(
          (value) =>
            typeof value === "string" &&
            value.trim() !== ""
        ).length;

      const skillsBonus =
        profileSkills.length > 0
          ? 10
          : 0;

      return Math.min(
        100,
        completed * 10 +
          skillsBonus
      );
    }, [
      profileData,
      profileSkills.length,
    ]);

  /* =======================================================
     CAREER PROGRESS
  ======================================================= */

  const careerProgress =
    useMemo(() => {
      const values = [
        profileCompletion,
        skillProgress,
        resumeScore,
      ];

      return Math.round(
        Math.max(...values)
      );
    }, [
      profileCompletion,
      skillProgress,
      resumeScore,
    ]);

  /* =======================================================
     CHECK WHETHER USER HAS STARTED PROFILE
  ======================================================= */

  const hasCareerProfile =
    Boolean(
      profileData &&
        (
          profileData.targetCareer ||
          profileData.education ||
          profileData.location ||
          profileData.careerGoal ||
          profileData.experienceLevel ||
          profileData.jobType ||
          profileData.workPreference ||
          profileSkills.length > 0
        )
    );

  const hasDashboardData =
    hasCareerProfile ||
    hasResume ||
    applications.length > 0 ||
    opportunities.length > 0;

  /* =======================================================
     ACTIVITY
  ======================================================= */

  const recentActivity =
    useMemo<ActivityItem[]>(() => {
      const activity: ActivityItem[] = [];

      if (hasResume) {
        activity.push({
          id: "resume",
          title: "Resume Uploaded",
          status: "Completed",
          type: "success",
        });

        activity.push({
          id: "analysis",
          title: "AI Resume Analysis",
          status: "Completed",
          type: "success",
        });
      }

      if (hasCareerProfile) {
        activity.push({
          id: "profile",
          title: "Career Profile",
          status: "Updated",
          type: "success",
        });
      }

      if (opportunities.length > 0) {
        activity.push({
          id: "opportunities",
          title: "Opportunity Matching",
          status: "Available",
          type: "success",
        });
      }

      if (applications.length > 0) {
        activity.push({
          id: "applications",
          title: "Job Applications",
          status: `${applications.length} Tracked`,
          type: "success",
        });
      }

      return activity;
    }, [
      hasResume,
      hasCareerProfile,
      opportunities.length,
      applications.length,
    ]);

  /* =======================================================
     OPEN PROFILE
  ======================================================= */

  const openProfile = () => {
    setMobileSidebarOpen(false);
    navigate("/profile");
  };

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const openResumeAnalyzer = () => {
    setMobileSidebarOpen(false);
    navigate("/resume-analyzer");
  };

  const openOpportunityFinder = () => {
    setMobileSidebarOpen(false);
    navigate("/internship-finder");
  };

  const openCareerRoadmap = () => {
    setMobileSidebarOpen(false);
    navigate("/career-roadmap");
  };

  const openAIInterview = () => {
    setMobileSidebarOpen(false);
    navigate("/ai-interview");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() =>
          setMobileSidebarOpen(false)
        }
      />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="flex min-w-0 flex-1 flex-col">

        {/* ===================================================
            TOPBAR
        =================================================== */}

        <Topbar
          onMenuClick={() =>
            setMobileSidebarOpen(true)
          }
        />

        {/* ===================================================
            CONTENT
        =================================================== */}

        <main className="flex-1 overflow-y-auto">

          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">

            {/* =================================================
                WELCOME
            ================================================= */}

            <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-5">

                <button
                  type="button"
                  onClick={openProfile}
                  title="Open Profile"
                  aria-label="Open Profile"
                  className="shrink-0 rounded-2xl outline-none transition hover:scale-105 focus:ring-2 focus:ring-blue-500"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-2xl font-bold">
                    {firstLetter}
                  </div>
                </button>

                <div>

                  <h1 className="text-3xl font-bold text-white sm:text-4xl">
                    Welcome Back,{" "}
                    {displayName.split(" ")[0]} 👋
                  </h1>

                  <p className="mt-2 text-base text-slate-400 sm:text-lg">
                    {hasResume
                      ? "Your AI-powered career insights are ready."
                      : "Welcome to CareerPilot AI. Start building your career profile."}
                  </p>

                  {displayEmail && (
                    <p className="mt-1 text-sm text-slate-500">
                      {displayEmail}
                    </p>
                  )}

                </div>

              </div>

              {/* =================================================
                  CAREER PROGRESS
              ================================================= */}

              {hasDashboardData && (
                <div className="min-w-[230px] rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-5">

                  <p className="text-blue-100">
                    Career Progress
                  </p>

                  <h2 className="mt-1 text-4xl font-bold">
                    {careerProgress}%
                  </h2>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-950/50">

                    <div
                      className="h-full rounded-full bg-white transition-all duration-500"
                      style={{
                        width: `${careerProgress}%`,
                      }}
                    />

                  </div>

                  <p className="mt-2 text-sm text-blue-100">
                    {careerProgress >= 80
                      ? "Excellent progress! Keep going."
                      : "Keep improving your career profile."}
                  </p>

                </div>
              )}

            </div>

            {/* =================================================
                NEW USER WELCOME CARD
            ================================================= */}

            {!hasDashboardData && (
              <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-8">

                <div className="max-w-3xl">

                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10">
                    <FaUser className="text-2xl text-blue-400" />
                  </div>

                  <h2 className="text-2xl font-bold text-white">
                    Start Your Career Journey
                  </h2>

                  <p className="mt-2 leading-relaxed text-slate-400">
                    Your dashboard is ready. Complete your
                    career profile or upload your resume to
                    unlock personalized AI-powered career
                    insights.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">

                    <button
                      type="button"
                      onClick={openProfile}
                      className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
                    >
                      Complete Profile
                    </button>

                    <button
                      type="button"
                      onClick={openResumeAnalyzer}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-semibold text-white transition hover:border-blue-500"
                    >
                      Upload Resume
                    </button>

                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                DASHBOARD CONTENT
            ================================================= */}

            {hasDashboardData && (
              <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">

                {/* =================================================
                    PROFILE CARD
                ================================================= */}

                <div
                  onClick={openProfile}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      openProfile();
                    }
                  }}
                >
                  <ProfileCard />
                </div>

                {/* =================================================
                    RIGHT CONTENT
                ================================================= */}

                <div className="space-y-8 xl:col-span-2">

                  {/* =================================================
                      STATISTICS
                  ================================================= */}

                  <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">

                    {/* RESUME */}

                    <button
                      type="button"
                      onClick={openResumeAnalyzer}
                      className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-blue-500"
                    >
                      <FaFileAlt className="mb-5 text-2xl text-blue-400" />

                      <p className="text-sm text-slate-400">
                        Resume Score
                      </p>

                      <h2 className="mt-2 text-4xl font-bold">
                        {hasResume
                          ? resumeScore
                          : "--"}
                      </h2>

                      <p className="mt-2 text-xs text-slate-500">
                        {hasResume
                          ? "ATS performance"
                          : "Upload resume"}
                      </p>
                    </button>

                    {/* OPPORTUNITIES */}

                    <button
                      type="button"
                      onClick={openOpportunityFinder}
                      className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-green-500"
                    >
                      <FaBriefcase className="mb-5 text-2xl text-green-400" />

                      <p className="text-sm text-slate-400">
                        Opportunities
                      </p>

                      <h2 className="mt-2 text-4xl font-bold">
                        {opportunities.length}
                      </h2>

                      <p className="mt-2 text-xs text-slate-500">
                        Explore opportunities
                      </p>
                    </button>

                    {/* SKILLS */}

                    <button
                      type="button"
                      onClick={openProfile}
                      className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-purple-500"
                    >
                      <FaChartLine className="mb-5 text-2xl text-purple-400" />

                      <p className="text-sm text-slate-400">
                        Skill Progress
                      </p>

                      <h2 className="mt-2 text-4xl font-bold">
                        {skillProgress}%
                      </h2>

                      <p className="mt-2 text-xs text-slate-500">
                        {skillsCount}{" "}
                        {skillsCount === 1
                          ? "skill"
                          : "skills"}
                      </p>
                    </button>

                    {/* APPLICATIONS */}

                    <button
                      type="button"
                      onClick={openOpportunityFinder}
                      className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-yellow-500"
                    >
                      <FaPaperPlane className="mb-5 text-2xl text-yellow-400" />

                      <p className="text-sm text-slate-400">
                        Applications
                      </p>

                      <h2 className="mt-2 text-4xl font-bold">
                        {applications.length}
                      </h2>

                      <p className="mt-2 text-xs text-slate-500">
                        Track your applications
                      </p>
                    </button>

                  </div>

                  {/* =================================================
                      CAREERPILOT DEMO VIDEO
                  ================================================= */}

                  <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">

                    <div className="flex items-center gap-4 p-7">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
                        <FaPlay className="ml-0.5 text-blue-400" />
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          See How CareerPilot AI Works
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          Take a quick look at your AI-powered career workspace.
                        </p>
                      </div>

                    </div>

                    <div className="px-5 pb-7 sm:px-7">

                      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-black shadow-2xl shadow-black/30">

                        <video
                          className="block aspect-video w-full object-cover"
                          controls
                          preload="metadata"
                          playsInline
                        >
                          <source
                            src="/careerpilot-demo.mp4"
                            type="video/mp4"
                          />

                          Your browser does not support the video tag.
                        </video>

                      </div>

                      <div className="mt-5 rounded-2xl border border-blue-500/10 bg-blue-500/5 p-5">

                        <div className="flex gap-4">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                            <FaRobot className="text-blue-400" />
                          </div>

                          <div>

                            <h3 className="font-semibold text-white">
                              Your Career, Powered by AI
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-slate-400">
                              CareerPilot AI helps you analyze your
                              resume, improve your skills, prepare
                              for interviews, discover opportunities
                              and build a personalized career roadmap
                              — all from one workspace.
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      CAREER PROFILE
                  ================================================= */}

                  {hasCareerProfile && profileData && (
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7">

                      <div className="flex items-center justify-between gap-4">

                        <div>
                          <h2 className="text-2xl font-bold">
                            Career Profile
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            Your current career information
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={openProfile}
                          title="Edit Profile"
                          aria-label="Edit Profile"
                          className="rounded-xl p-2 transition hover:bg-slate-800"
                        >
                          <FaUser className="text-2xl text-blue-400" />
                        </button>

                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">

                        <div className="rounded-2xl bg-slate-950 p-5">
                          <p className="text-xs uppercase tracking-wider text-slate-500">
                            Target Career
                          </p>

                          <p className="mt-2 font-semibold text-white">
                            {profileData.targetCareer ||
                              "Not set"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-950 p-5">
                          <p className="text-xs uppercase tracking-wider text-slate-500">
                            Location
                          </p>

                          <p className="mt-2 font-semibold text-white">
                            {profileData.location ||
                              "Not set"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-950 p-5">
                          <p className="text-xs uppercase tracking-wider text-slate-500">
                            Education
                          </p>

                          <p className="mt-2 font-semibold text-white">
                            {profileData.education ||
                              "Not set"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-950 p-5">
                          <p className="text-xs uppercase tracking-wider text-slate-500">
                            Experience
                          </p>

                          <p className="mt-2 font-semibold text-white">
                            {profileData.experienceLevel ||
                              "Student"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-950 p-5 sm:col-span-2">
                          <p className="text-xs uppercase tracking-wider text-slate-500">
                            Resume
                          </p>

                          <p className="mt-2 font-semibold text-white">
                            {hasResume
                              ? resumeData?.fileName ||
                                "Resume Uploaded"
                              : "Not uploaded"}
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* =================================================
                      CAREER TOOLS
                  ================================================= */}

                  <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

                    <h2 className="mb-6 text-2xl font-bold">
                      Career Tools
                    </h2>

                    <div className="grid gap-5 md:grid-cols-2">

                      {/* RESUME */}

                      <button
                        type="button"
                        onClick={openResumeAnalyzer}
                        className="rounded-2xl border border-slate-700 bg-slate-800 p-6 text-left transition hover:border-blue-500 hover:bg-slate-800/80"
                      >
                        <div className="flex items-center justify-between">

                          <h3 className="text-lg font-semibold">
                            Resume Analyzer
                          </h3>

                          <FaFileAlt className="text-blue-400" />

                        </div>

                        <p className="mt-2 text-slate-400">
                          Analyze your resume and improve your ATS score.
                        </p>

                        <FaArrowRight className="mt-5 text-blue-400" />
                      </button>

                      {/* OPPORTUNITY FINDER */}

                      <button
                        type="button"
                        onClick={openOpportunityFinder}
                        className="rounded-2xl border border-slate-700 bg-slate-800 p-6 text-left transition hover:border-green-500 hover:bg-slate-800/80"
                      >
                        <div className="flex items-center justify-between">

                          <h3 className="text-lg font-semibold">
                            Opportunity Finder
                          </h3>

                          <FaBriefcase className="text-green-400" />

                        </div>

                        <p className="mt-2 text-slate-400">
                          Discover relevant opportunities and career openings.
                        </p>

                        <FaArrowRight className="mt-5 text-green-400" />
                      </button>

                      {/* ROADMAP */}

                      <button
                        type="button"
                        onClick={openCareerRoadmap}
                        className="rounded-2xl border border-slate-700 bg-slate-800 p-6 text-left transition hover:border-purple-500 hover:bg-slate-800/80"
                      >
                        <div className="flex items-center justify-between">

                          <h3 className="text-lg font-semibold">
                            Career Roadmap
                          </h3>

                          <FaChartLine className="text-purple-400" />

                        </div>

                        <p className="mt-2 text-slate-400">
                          Build a personalized path toward your target career.
                        </p>

                        <FaArrowRight className="mt-5 text-purple-400" />
                      </button>

                      {/* AI INTERVIEW */}

                      <button
                        type="button"
                        onClick={openAIInterview}
                        className="rounded-2xl border border-slate-700 bg-slate-800 p-6 text-left transition hover:border-orange-500 hover:bg-slate-800/80"
                      >
                        <div className="flex items-center justify-between">

                          <h3 className="text-lg font-semibold">
                            AI Interview
                          </h3>

                          <FaRobot className="text-orange-400" />

                        </div>

                        <p className="mt-2 text-slate-400">
                          Practice role-specific mock interviews with AI.
                        </p>

                        <FaArrowRight className="mt-5 text-orange-400" />
                      </button>

                    </div>

                  </div>

                  {/* =================================================
                      RECENT ACTIVITY
                  ================================================= */}

                  {recentActivity.length > 0 && (
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

                      <div className="flex items-center justify-between">

                        <div>
                          <h2 className="text-2xl font-bold">
                            Recent Activity
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            Your latest CareerPilot progress
                          </p>
                        </div>

                        <FaChartLine className="text-blue-400" />

                      </div>

                      <div className="mt-6 space-y-5">

                        {recentActivity.map(
                          (activity) => (
                            <div
                              key={activity.id}
                              className="flex items-center justify-between border-b border-slate-800 pb-4 last:border-0 last:pb-0"
                            >

                              <div className="flex items-center gap-3">

                                {activity.type ===
                                "success" ? (
                                  <FaCheckCircle className="text-green-400" />
                                ) : (
                                  <FaClock className="text-slate-500" />
                                )}

                                <span className="text-slate-300">
                                  {activity.title}
                                </span>

                              </div>

                              <span
                                className={`font-semibold ${
                                  activity.type ===
                                  "success"
                                    ? "text-green-400"
                                    : "text-slate-500"
                                }`}
                              >
                                {activity.status}
                              </span>

                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

                </div>
              </div>
            )}

          </div>

        </main>
      </div>

      {/* =====================================================
          REVIEW POPUP
      ===================================================== */}

      {showReviewPopup && (
        <ReviewPopup
          onClose={() =>
            setShowReviewPopup(false)
          }
        />
      )}

    </div>
  );
}

export default Dashboard;