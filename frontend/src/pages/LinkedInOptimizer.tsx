import {
  FaLinkedin,
  FaHome,
  FaPlus,
  FaTrash,
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaLightbulb,
  FaUserTie,
  FaExternalLinkAlt,
} from "react-icons/fa";

import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

// ======================================================
// TYPES
// ======================================================

interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Certification {
  name: string;
  issuer: string;
}

interface Project {
  name: string;
  description: string;
  url?: string;
}

interface ProfileData {
  linkedinUrl: string;
  fullName: string;
  headline: string;
  about: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  projects: Project[];
}

interface AnalysisSection {
  score: number;
  suggestions: string[];
}

interface AnalysisCollectionSection {
  score: number;
  count: number;
  suggestions: string[];
}

interface AnalysisResult {
  profileScore: number;
  completenessScore: number;

  sections: {
    headline: AnalysisSection;
    about: AnalysisSection;

    skills: AnalysisCollectionSection;

    experience: AnalysisCollectionSection;

    education: AnalysisCollectionSection;

    certifications: AnalysisCollectionSection;
  };

  suggestions: string[];

  analyzedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  profile?: ProfileData;
  analysis?: AnalysisResult;
}

// ======================================================
// CONSTANTS
// ======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const LINKEDIN_LOGIN_URL =
  `${API_BASE_URL}/api/linkedin/login`;

const LINKEDIN_ANALYZE_URL =
  `${API_BASE_URL}/api/linkedin/analyze`;

// ======================================================
// EMPTY OBJECTS
// ======================================================

const createEmptyExperience = (): Experience => ({
  title: "",
  company: "",
  duration: "",
  description: "",
});

const createEmptyEducation = (): Education => ({
  degree: "",
  institution: "",
  year: "",
});

const createEmptyCertification = (): Certification => ({
  name: "",
  issuer: "",
});

const createEmptyProject = (): Project => ({
  name: "",
  description: "",
  url: "",
});

// ======================================================
// INITIAL PROFILE
// ======================================================

const createInitialProfile = (): ProfileData => ({
  linkedinUrl: "",
  fullName: "",
  headline: "",
  about: "",

  skills: [""],

  experience: [
    createEmptyExperience(),
  ],

  education: [
    createEmptyEducation(),
  ],

  certifications: [
    createEmptyCertification(),
  ],

  projects: [],
});

// ======================================================
// HELPERS
// ======================================================

function isValidLinkedInUrl(
  value: string
): boolean {
  if (!value.trim()) {
    return true;
  }

  try {
    const url = new URL(value.trim());

    return (
      url.protocol === "https:" &&
      (
        url.hostname === "linkedin.com" ||
        url.hostname === "www.linkedin.com"
      ) &&
      /^\/in\/[^/]+\/?$/i.test(
        url.pathname
      )
    );
  } catch {
    return false;
  }
}

function clampScore(
  score: number
): number {
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, Math.round(score))
  );
}

function cleanString(
  value: unknown
): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

// ======================================================
// MAIN COMPONENT
// ======================================================

function LinkedInOptimizer() {
  const navigate = useNavigate();

  // ====================================================
  // STATE
  // ====================================================

  const [profile, setProfile] =
    useState<ProfileData>(
      createInitialProfile()
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [result, setResult] =
    useState<AnalysisResult | null>(null);

  const [
    linkedinConnecting,
    setLinkedinConnecting,
  ] = useState(false);

  const [
    linkedinConnected,
    setLinkedinConnected,
  ] = useState(false);

  // ====================================================
  // HANDLE LINKEDIN OAUTH RESULT
  // ====================================================

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const linkedinStatus =
      params.get("linkedin");

    const linkedinError =
      params.get("linkedinError");

    // -----------------------------------------------
    // SUCCESS
    // -----------------------------------------------

    if (
      linkedinStatus === "success"
    ) {
      setLinkedinConnected(true);

      setLinkedinConnecting(false);

      setError("");

      setSuccess(
        "LinkedIn account connected successfully. Your permitted LinkedIn profile information is now authorized."
      );
    }

    // -----------------------------------------------
    // ERROR
    // -----------------------------------------------

    if (linkedinError) {
      setLinkedinConnected(false);

      setLinkedinConnecting(false);

      setSuccess("");

      setError(
        linkedinError
      );
    }

    // -----------------------------------------------
    // CLEAN URL
    // -----------------------------------------------

    if (
      linkedinStatus ||
      linkedinError
    ) {
      const cleanUrl =
        window.location.pathname;

      window.history.replaceState(
        {},
        document.title,
        cleanUrl
      );
    }
  }, []);

  // ====================================================
  // CONNECT LINKEDIN
  // ====================================================

  const connectLinkedIn = () => {
    setError("");
    setSuccess("");
    setLinkedinConnecting(true);

    /*
      IMPORTANT:

      Backend route is:

      GET /api/linkedin/login

      NOT:

      /api/linkedin/auth
    */

    window.location.assign(
      LINKEDIN_LOGIN_URL
    );
  };

  // ====================================================
  // BASIC FIELD UPDATE
  // ====================================================

  const updateField = (
    field: keyof ProfileData,
    value: string
  ) => {
    setProfile(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );

    // Remove old result when user edits profile
    setResult(null);

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  // ====================================================
  // SKILLS
  // ====================================================

  const updateSkill = (
    index: number,
    value: string
  ) => {
    setProfile(
      (previous) => {
        const skills = [
          ...previous.skills,
        ];

        skills[index] = value;

        return {
          ...previous,
          skills,
        };
      }
    );

    setResult(null);
  };

  const addSkill = () => {
    setProfile(
      (previous) => ({
        ...previous,
        skills: [
          ...previous.skills,
          "",
        ],
      })
    );
  };

  const removeSkill = (
    index: number
  ) => {
    setProfile(
      (previous) => {
        const updatedSkills =
          previous.skills.filter(
            (_, skillIndex) =>
              skillIndex !== index
          );

        return {
          ...previous,

          skills:
            updatedSkills.length > 0
              ? updatedSkills
              : [""],
        };
      }
    );
  };

  // ====================================================
  // EXPERIENCE
  // ====================================================

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    setProfile(
      (previous) => {
        const experience =
          [...previous.experience];

        experience[index] = {
          ...experience[index],
          [field]: value,
        };

        return {
          ...previous,
          experience,
        };
      }
    );

    setResult(null);
  };

  const addExperience = () => {
    setProfile(
      (previous) => ({
        ...previous,

        experience: [
          ...previous.experience,
          createEmptyExperience(),
        ],
      })
    );
  };

  const removeExperience = (
    index: number
  ) => {
    setProfile(
      (previous) => {
        const updated =
          previous.experience.filter(
            (_, experienceIndex) =>
              experienceIndex !== index
          );

        return {
          ...previous,

          experience:
            updated.length > 0
              ? updated
              : [createEmptyExperience()],
        };
      }
    );
  };

  // ====================================================
  // EDUCATION
  // ====================================================

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    setProfile(
      (previous) => {
        const education =
          [...previous.education];

        education[index] = {
          ...education[index],
          [field]: value,
        };

        return {
          ...previous,
          education,
        };
      }
    );

    setResult(null);
  };

  const addEducation = () => {
    setProfile(
      (previous) => ({
        ...previous,

        education: [
          ...previous.education,
          createEmptyEducation(),
        ],
      })
    );
  };

  const removeEducation = (
    index: number
  ) => {
    setProfile(
      (previous) => {
        const updated =
          previous.education.filter(
            (_, educationIndex) =>
              educationIndex !== index
          );

        return {
          ...previous,

          education:
            updated.length > 0
              ? updated
              : [createEmptyEducation()],
        };
      }
    );
  };

  // ====================================================
  // CERTIFICATIONS
  // ====================================================

  const updateCertification = (
    index: number,
    field: keyof Certification,
    value: string
  ) => {
    setProfile(
      (previous) => {
        const certifications =
          [...previous.certifications];

        certifications[index] = {
          ...certifications[index],
          [field]: value,
        };

        return {
          ...previous,
          certifications,
        };
      }
    );

    setResult(null);
  };

  const addCertification = () => {
    setProfile(
      (previous) => ({
        ...previous,

        certifications: [
          ...previous.certifications,
          createEmptyCertification(),
        ],
      })
    );
  };

  const removeCertification = (
    index: number
  ) => {
    setProfile(
      (previous) => ({
        ...previous,

        certifications:
          previous.certifications.filter(
            (_, certificationIndex) =>
              certificationIndex !== index
          ),
      })
    );
  };

  // ====================================================
  // PROJECTS
  // ====================================================

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string
  ) => {
    setProfile(
      (previous) => {
        const projects =
          [...previous.projects];

        projects[index] = {
          ...projects[index],
          [field]: value,
        };

        return {
          ...previous,
          projects,
        };
      }
    );

    setResult(null);
  };

  const addProject = () => {
    setProfile(
      (previous) => ({
        ...previous,

        projects: [
          ...previous.projects,
          createEmptyProject(),
        ],
      })
    );
  };

  const removeProject = (
    index: number
  ) => {
    setProfile(
      (previous) => ({
        ...previous,

        projects:
          previous.projects.filter(
            (_, projectIndex) =>
              projectIndex !== index
          ),
      })
    );
  };

  // ====================================================
  // CLEAN PROFILE
  // ====================================================

  const buildCleanProfile =
    (): ProfileData => {
      const cleaned: ProfileData = {
        linkedinUrl:
          cleanString(
            profile.linkedinUrl
          ),

        fullName:
          cleanString(
            profile.fullName
          ),

        headline:
          cleanString(
            profile.headline
          ),

        about:
          cleanString(
            profile.about
          ),

        skills:
          profile.skills
            .map(cleanString)
            .filter(Boolean),

        experience:
          profile.experience
            .map((item) => ({
              title:
                cleanString(
                  item.title
                ),

              company:
                cleanString(
                  item.company
                ),

              duration:
                cleanString(
                  item.duration
                ),

              description:
                cleanString(
                  item.description
                ),
            }))
            .filter(
              (item) =>
                item.title ||
                item.company ||
                item.duration ||
                item.description
            ),

        education:
          profile.education
            .map((item) => ({
              degree:
                cleanString(
                  item.degree
                ),

              institution:
                cleanString(
                  item.institution
                ),

              year:
                cleanString(
                  item.year
                ),
            }))
            .filter(
              (item) =>
                item.degree ||
                item.institution ||
                item.year
            ),

        certifications:
          profile.certifications
            .map((item) => ({
              name:
                cleanString(
                  item.name
                ),

              issuer:
                cleanString(
                  item.issuer
                ),
            }))
            .filter(
              (item) =>
                item.name ||
                item.issuer
            ),

        projects:
          profile.projects
            .map((item) => ({
              name:
                cleanString(
                  item.name
                ),

              description:
                cleanString(
                  item.description
                ),

              url:
                cleanString(
                  item.url
                ),
            }))
            .filter(
              (item) =>
                item.name ||
                item.description ||
                item.url
            ),
      };

      return cleaned;
    };

  // ====================================================
  // ANALYZE PROFILE
  // ====================================================

  const analyzeProfile =
    async () => {
      setError("");
      setSuccess("");
      setResult(null);

      const cleanedProfile =
        buildCleanProfile();

      // -----------------------------------------------
      // LINKEDIN URL VALIDATION
      // -----------------------------------------------

      if (
        cleanedProfile.linkedinUrl &&
        !isValidLinkedInUrl(
          cleanedProfile.linkedinUrl
        )
      ) {
        setError(
          "Please enter a valid LinkedIn profile URL, for example: https://www.linkedin.com/in/username"
        );

        return;
      }

      // -----------------------------------------------
      // CHECK IF PROFILE HAS ANY DATA
      // -----------------------------------------------

      const hasProfileData =
        Boolean(
          cleanedProfile.linkedinUrl ||
          cleanedProfile.fullName ||
          cleanedProfile.headline ||
          cleanedProfile.about ||
          cleanedProfile.skills.length ||
          cleanedProfile.experience.length ||
          cleanedProfile.education.length ||
          cleanedProfile.certifications.length ||
          cleanedProfile.projects.length
        );

      if (!hasProfileData) {
        setError(
          "Please paste your LinkedIn profile URL or enter at least some profile information before analyzing."
        );

        return;
      }

      try {
        setLoading(true);

        // ---------------------------------------------
        // API REQUEST
        // ---------------------------------------------

        const response =
          await fetch(
            LINKEDIN_ANALYZE_URL,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
                Accept:
                  "application/json",
              },

              credentials:
                "include",

              body:
                JSON.stringify(
                  cleanedProfile
                ),
            }
          );

        // ---------------------------------------------
        // PARSE RESPONSE
        // ---------------------------------------------

        let data: ApiResponse;

        try {
          data =
            await response.json();
        } catch {
          throw new Error(
            "Backend returned an invalid response. Please check that the CareerPilot AI server is running correctly."
          );
        }

        // ---------------------------------------------
        // API ERROR
        // ---------------------------------------------

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              `Profile analysis failed with status ${response.status}.`
          );
        }

        // ---------------------------------------------
        // ANALYSIS CHECK
        // ---------------------------------------------

        if (
          !data.analysis
        ) {
          throw new Error(
            "The backend did not return an analysis result."
          );
        }

        // ---------------------------------------------
        // NORMALIZE ANALYSIS
        // ---------------------------------------------

        const normalizedResult: AnalysisResult =
          {
            profileScore:
              clampScore(
                Number(
                  data.analysis
                    .profileScore
                )
              ),

            completenessScore:
              clampScore(
                Number(
                  data.analysis
                    .completenessScore
                )
              ),

            sections: {
              headline: {
                score:
                  clampScore(
                    Number(
                      data.analysis
                        .sections
                        ?.headline
                        ?.score
                    )
                  ),

                suggestions:
                  Array.isArray(
                    data.analysis
                      .sections
                      ?.headline
                      ?.suggestions
                  )
                    ? data.analysis
                        .sections
                        .headline
                        .suggestions
                    : [],
              },

              about: {
                score:
                  clampScore(
                    Number(
                      data.analysis
                        .sections
                        ?.about
                        ?.score
                    )
                  ),

                suggestions:
                  Array.isArray(
                    data.analysis
                      .sections
                      ?.about
                      ?.suggestions
                  )
                    ? data.analysis
                        .sections
                        .about
                        .suggestions
                    : [],
              },

              skills: {
                score:
                  clampScore(
                    Number(
                      data.analysis
                        .sections
                        ?.skills
                        ?.score
                    )
                  ),

                count:
                  Number(
                    data.analysis
                      .sections
                      ?.skills
                      ?.count || 0
                  ),

                suggestions:
                  Array.isArray(
                    data.analysis
                      .sections
                      ?.skills
                      ?.suggestions
                  )
                    ? data.analysis
                        .sections
                        .skills
                        .suggestions
                    : [],
              },

              experience: {
                score:
                  clampScore(
                    Number(
                      data.analysis
                        .sections
                        ?.experience
                        ?.score
                    )
                  ),

                count:
                  Number(
                    data.analysis
                      .sections
                      ?.experience
                      ?.count || 0
                  ),

                suggestions:
                  Array.isArray(
                    data.analysis
                      .sections
                      ?.experience
                      ?.suggestions
                  )
                    ? data.analysis
                        .sections
                        .experience
                        .suggestions
                    : [],
              },

              education: {
                score:
                  clampScore(
                    Number(
                      data.analysis
                        .sections
                        ?.education
                        ?.score
                    )
                  ),

                count:
                  Number(
                    data.analysis
                      .sections
                      ?.education
                      ?.count || 0
                  ),

                suggestions:
                  Array.isArray(
                    data.analysis
                      .sections
                      ?.education
                      ?.suggestions
                  )
                    ? data.analysis
                        .sections
                        .education
                        .suggestions
                    : [],
              },

              certifications: {
                score:
                  clampScore(
                    Number(
                      data.analysis
                        .sections
                        ?.certifications
                        ?.score
                    )
                  ),

                count:
                  Number(
                    data.analysis
                      .sections
                      ?.certifications
                      ?.count || 0
                  ),

                suggestions:
                  Array.isArray(
                    data.analysis
                      .sections
                      ?.certifications
                      ?.suggestions
                  )
                    ? data.analysis
                        .sections
                        .certifications
                        .suggestions
                    : [],
              },
            },

            suggestions:
              Array.isArray(
                data.analysis
                  .suggestions
              )
                ? data.analysis
                    .suggestions
                : [],

            analyzedAt:
              data.analysis
                .analyzedAt ||
              new Date().toISOString(),
          };

        // ---------------------------------------------
        // SAVE RESULT
        // ---------------------------------------------

        setProfile(
          cleanedProfile
        );

        setResult(
          normalizedResult
        );

        setSuccess(
          "Your LinkedIn profile has been analyzed successfully."
        );

        // ---------------------------------------------
        // SCROLL TO RESULT
        // ---------------------------------------------

        setTimeout(() => {
          document
            .getElementById(
              "linkedin-analysis-results"
            )
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        }, 100);
      } catch (err) {
        console.error(
          "LinkedIn analysis error:",
          err
        );

        if (
          err instanceof TypeError &&
          err.message
            .toLowerCase()
            .includes("fetch")
        ) {
          setError(
            `Unable to connect to CareerPilot AI backend. Make sure the backend is running on ${API_BASE_URL}.`
          );
        } else if (
          err instanceof Error
        ) {
          setError(
            err.message
          );
        } else {
          setError(
            "Unable to analyze your LinkedIn profile. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white px-4 py-6 md:px-8 lg:px-10">

      {/* ==================================================
          TOP BAR
      ================================================== */}

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-900/30">

            <FaLinkedin className="text-white text-xl" />

          </div>

          <div>

            <h1 className="text-xl font-bold">
              LinkedIn Optimizer
            </h1>

            <p className="text-xs text-slate-500">
              AI-powered profile improvement
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/dashboard")
          }
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-700
            bg-slate-900
            px-5
            py-3
            text-sm
            font-semibold
            text-slate-200
            hover:bg-slate-800
            hover:border-blue-500/40
            transition
          "
        >
          <FaHome />
          Dashboard
        </button>

      </div>

      <main className="max-w-7xl mx-auto">

        {/* ==================================================
            HERO
        ================================================== */}

        <section className="text-center max-w-4xl mx-auto">

          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-5 py-2 text-blue-400 text-sm font-medium">

            <FaLinkedin />

            AI Powered LinkedIn Analysis

          </div>

          <h2 className="mt-6 text-4xl md:text-6xl font-bold">

            Optimize Your{" "}

            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">

              LinkedIn Profile

            </span>

          </h2>

          <p className="mt-5 text-lg text-slate-400 leading-8">

            Connect your LinkedIn account or enter your
            profile information manually. CareerPilot AI
            will analyze your profile and provide targeted
            improvement suggestions.

          </p>

        </section>

        {/* ==================================================
            PROFILE INPUT
        ================================================== */}

        <section className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 md:p-10 shadow-2xl">

          <div className="flex items-center gap-3 mb-8">

            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">

              <FaUserTie className="text-blue-400 text-xl" />

            </div>

            <div>

              <h3 className="text-2xl font-bold">
                Your LinkedIn Profile
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Use your real information for a meaningful analysis.
              </p>

            </div>

          </div>

          {/* ==================================================
              LINKEDIN URL
          ================================================== */}

          <div>

            <label className="block text-sm font-semibold text-slate-300 mb-2">
              LinkedIn Profile URL
            </label>

            <div className="relative">

              <FaLinkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />

              <input
                type="url"
                value={
                  profile.linkedinUrl
                }
                onChange={(e) =>
                  updateField(
                    "linkedinUrl",
                    e.target.value
                  )
                }
                placeholder="https://www.linkedin.com/in/your-profile"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-700
                  bg-slate-950
                  py-4
                  pl-12
                  pr-4
                  text-white
                  outline-none
                  placeholder:text-slate-600
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                "
              />

            </div>

            <p className="mt-2 text-xs text-slate-500">
              Your URL identifies your LinkedIn profile. Connecting LinkedIn is required if you want the backend to receive permitted account information through OAuth.
            </p>

            {/* ==================================================
                LINKEDIN OAUTH
            ================================================== */}

            <div className="mt-5">

              <div className="relative flex items-center py-2">

                <div className="flex-grow border-t border-slate-800" />

                <span className="px-4 text-xs text-slate-600">
                  OR
                </span>

                <div className="flex-grow border-t border-slate-800" />

              </div>

              <button
                type="button"
                onClick={
                  connectLinkedIn
                }
                disabled={
                  linkedinConnecting
                }
                className="
                  mt-4
                  w-full
                  rounded-2xl
                  border
                  border-blue-500/30
                  bg-blue-500/10
                  px-5
                  py-4
                  flex
                  items-center
                  justify-center
                  gap-3
                  text-blue-400
                  font-semibold
                  hover:bg-blue-500/20
                  hover:border-blue-500/50
                  transition
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >

                <FaLinkedin className="text-xl" />

                {linkedinConnecting
                  ? "Connecting to LinkedIn..."
                  : linkedinConnected
                  ? "LinkedIn Connected ✓"
                  : "Connect LinkedIn Account"}

              </button>

              <p className="mt-2 text-center text-xs text-slate-500">

                {linkedinConnected
                  ? "LinkedIn authorization completed successfully."
                  : "You will be redirected to LinkedIn to authorize CareerPilot AI."}

              </p>

            </div>

          </div>

          {/* ==================================================
              BASIC INFORMATION
          ================================================== */}

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <div>

              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={
                  profile.fullName
                }
                onChange={(e) =>
                  updateField(
                    "fullName",
                    e.target.value
                  )
                }
                placeholder="Your full name"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-700
                  bg-slate-950
                  px-4
                  py-4
                  text-white
                  outline-none
                  focus:border-blue-500
                  placeholder:text-slate-600
                "
              />

            </div>

            <div>

              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Professional Headline
              </label>

              <input
                type="text"
                value={
                  profile.headline
                }
                onChange={(e) =>
                  updateField(
                    "headline",
                    e.target.value
                  )
                }
                placeholder="e.g. Full Stack Developer | React | Node.js"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-700
                  bg-slate-950
                  px-4
                  py-4
                  text-white
                  outline-none
                  focus:border-blue-500
                  placeholder:text-slate-600
                "
              />

            </div>

          </div>

          {/* ==================================================
              ABOUT
          ================================================== */}

          <div className="mt-6">

            <label className="block text-sm font-semibold text-slate-300 mb-2">
              About
            </label>

            <textarea
              rows={7}
              value={
                profile.about
              }
              onChange={(e) =>
                updateField(
                  "about",
                  e.target.value
                )
              }
              placeholder="Describe your professional background, expertise, achievements, goals and the value you provide..."
              className="
                w-full
                rounded-2xl
                border
                border-slate-700
                bg-slate-950
                px-4
                py-4
                text-white
                outline-none
                resize-y
                focus:border-blue-500
                placeholder:text-slate-600
              "
            />

            <div className="mt-2 flex justify-between text-xs text-slate-500">

              <span>
                Professional summary
              </span>

              <span>
                {profile.about.length} characters
              </span>

            </div>

          </div>

          {/* ==================================================
              SKILLS
          ================================================== */}

          <div className="mt-10">

            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center gap-3">

                <FaChartLine className="text-blue-400" />

                <h3 className="text-xl font-bold">
                  Skills
                </h3>

              </div>

              <button
                type="button"
                onClick={addSkill}
                aria-label="Add skill"
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-500
                  flex
                  items-center
                  justify-center
                  transition
                "
              >

                <FaPlus />

              </button>

            </div>

            <div className="space-y-3">

              {profile.skills.map(
                (skill, index) => (

                  <div
                    key={`skill-${index}`}
                    className="flex gap-3"
                  >

                    <input
                      type="text"
                      value={skill}
                      onChange={(e) =>
                        updateSkill(
                          index,
                          e.target.value
                        )
                      }
                      placeholder="e.g. React.js"
                      className="
                        flex-1
                        min-w-0
                        rounded-xl
                        border
                        border-slate-700
                        bg-slate-950
                        px-4
                        py-3
                        text-white
                        outline-none
                        focus:border-blue-500
                        placeholder:text-slate-600
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeSkill(
                          index
                        )
                      }
                      aria-label={`Remove skill ${index + 1}`}
                      className="
                        w-12
                        flex-shrink-0
                        rounded-xl
                        bg-red-500/10
                        text-red-400
                        hover:bg-red-500/20
                        transition
                      "
                    >

                      <FaTrash className="mx-auto" />

                    </button>

                  </div>

                )
              )}

            </div>

          </div>

          {/* ==================================================
              EXPERIENCE
          ================================================== */}

          <div className="mt-10">

            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center gap-3">

                <FaBriefcase className="text-purple-400" />

                <h3 className="text-xl font-bold">
                  Experience
                </h3>

              </div>

              <button
                type="button"
                onClick={
                  addExperience
                }
                aria-label="Add experience"
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-purple-600
                  hover:bg-purple-500
                  flex
                  items-center
                  justify-center
                  transition
                "
              >

                <FaPlus />

              </button>

            </div>

            <div className="space-y-6">

              {profile.experience.map(
                (
                  experience,
                  index
                ) => (

                  <div
                    key={`experience-${index}`}
                    className="
                      rounded-2xl
                      border
                      border-slate-800
                      bg-slate-950
                      p-5
                    "
                  >

                    <div className="flex justify-between items-center mb-4">

                      <span className="text-sm text-slate-500">
                        Experience #{index + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeExperience(
                            index
                          )
                        }
                        aria-label={`Remove experience ${index + 1}`}
                        className="text-red-400 hover:text-red-300"
                      >

                        <FaTrash />

                      </button>

                    </div>

                    <div className="grid md:grid-cols-2 gap-4">

                      <input
                        type="text"
                        value={
                          experience.title
                        }
                        onChange={(e) =>
                          updateExperience(
                            index,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="Job title"
                        className="
                          rounded-xl
                          border
                          border-slate-700
                          bg-slate-900
                          px-4
                          py-3
                          text-white
                          outline-none
                          focus:border-purple-500
                        "
                      />

                      <input
                        type="text"
                        value={
                          experience.company
                        }
                        onChange={(e) =>
                          updateExperience(
                            index,
                            "company",
                            e.target.value
                          )
                        }
                        placeholder="Company"
                        className="
                          rounded-xl
                          border
                          border-slate-700
                          bg-slate-900
                          px-4
                          py-3
                          text-white
                          outline-none
                          focus:border-purple-500
                        "
                      />

                      <input
                        type="text"
                        value={
                          experience.duration
                        }
                        onChange={(e) =>
                          updateExperience(
                            index,
                            "duration",
                            e.target.value
                          )
                        }
                        placeholder="e.g. Jan 2025 - Present"
                        className="
                          md:col-span-2
                          rounded-xl
                          border
                          border-slate-700
                          bg-slate-900
                          px-4
                          py-3
                          text-white
                          outline-none
                          focus:border-purple-500
                        "
                      />

                    </div>

                    <textarea
                      rows={5}
                      value={
                        experience.description
                      }
                      onChange={(e) =>
                        updateExperience(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Describe responsibilities, achievements and measurable results..."
                      className="
                        mt-4
                        w-full
                        rounded-xl
                        border
                        border-slate-700
                        bg-slate-900
                        px-4
                        py-3
                        text-white
                        outline-none
                        resize-y
                        focus:border-purple-500
                      "
                    />

                  </div>

                )
              )}

            </div>

          </div>

          {/* ==================================================
              EDUCATION
          ================================================== */}

          <div className="mt-10">

            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center gap-3">

                <FaGraduationCap className="text-cyan-400" />

                <h3 className="text-xl font-bold">
                  Education
                </h3>

              </div>

              <button
                type="button"
                onClick={
                  addEducation
                }
                aria-label="Add education"
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-cyan-600
                  hover:bg-cyan-500
                  flex
                  items-center
                  justify-center
                  transition
                "
              >

                <FaPlus />

              </button>

            </div>

            <div className="space-y-4">

              {profile.education.map(
                (
                  education,
                  index
                ) => (

                  <div
                    key={`education-${index}`}
                    className="
                      rounded-2xl
                      border
                      border-slate-800
                      bg-slate-950
                      p-5
                    "
                  >

                    <div className="grid md:grid-cols-3 gap-4">

                      <input
                        type="text"
                        value={
                          education.degree
                        }
                        onChange={(e) =>
                          updateEducation(
                            index,
                            "degree",
                            e.target.value
                          )
                        }
                        placeholder="Degree"
                        className="
                          rounded-xl
                          border
                          border-slate-700
                          bg-slate-900
                          px-4
                          py-3
                          text-white
                          outline-none
                          focus:border-cyan-500
                        "
                      />

                      <input
                        type="text"
                        value={
                          education.institution
                        }
                        onChange={(e) =>
                          updateEducation(
                            index,
                            "institution",
                            e.target.value
                          )
                        }
                        placeholder="Institution"
                        className="
                          rounded-xl
                          border
                          border-slate-700
                          bg-slate-900
                          px-4
                          py-3
                          text-white
                          outline-none
                          focus:border-cyan-500
                        "
                      />

                      <div className="flex gap-3">

                        <input
                          type="text"
                          value={
                            education.year
                          }
                          onChange={(e) =>
                            updateEducation(
                              index,
                              "year",
                              e.target.value
                            )
                          }
                          placeholder="Year"
                          className="
                            flex-1
                            min-w-0
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-900
                            px-4
                            py-3
                            text-white
                            outline-none
                            focus:border-cyan-500
                          "
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeEducation(
                              index
                            )
                          }
                          aria-label={`Remove education ${index + 1}`}
                          className="
                            w-12
                            flex-shrink-0
                            rounded-xl
                            bg-red-500/10
                            text-red-400
                            hover:bg-red-500/20
                          "
                        >

                          <FaTrash className="mx-auto" />

                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

          {/* ==================================================
              CERTIFICATIONS
          ================================================== */}

          <div className="mt-10">

            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center gap-3">

                <FaCertificate className="text-yellow-400" />

                <h3 className="text-xl font-bold">
                  Certifications
                </h3>

              </div>

              <button
                type="button"
                onClick={
                  addCertification
                }
                aria-label="Add certification"
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-500
                  flex
                  items-center
                  justify-center
                  transition
                "
              >

                <FaPlus />

              </button>

            </div>

            <div className="space-y-4">

              {profile.certifications.map(
                (
                  certification,
                  index
                ) => (

                  <div
                    key={`certification-${index}`}
                    className="
                      flex
                      flex-col
                      md:flex-row
                      gap-3
                    "
                  >

                    <input
                      type="text"
                      value={
                        certification.name
                      }
                      onChange={(e) =>
                        updateCertification(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Certification / Course"
                      className="
                        flex-1
                        rounded-xl
                        border
                        border-slate-700
                        bg-slate-950
                        px-4
                        py-3
                        text-white
                        outline-none
                        focus:border-blue-500
                      "
                    />

                    <input
                      type="text"
                      value={
                        certification.issuer
                      }
                      onChange={(e) =>
                        updateCertification(
                          index,
                          "issuer",
                          e.target.value
                        )
                      }
                      placeholder="Issuing organization"
                      className="
                        flex-1
                        rounded-xl
                        border
                        border-slate-700
                        bg-slate-950
                        px-4
                        py-3
                        text-white
                        outline-none
                        focus:border-blue-500
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeCertification(
                          index
                        )
                      }
                      aria-label={`Remove certification ${index + 1}`}
                      className="
                        w-full
                        md:w-12
                        min-h-12
                        rounded-xl
                        bg-red-500/10
                        text-red-400
                        hover:bg-red-500/20
                      "
                    >

                      <FaTrash className="mx-auto" />

                    </button>

                  </div>

                )
              )}

            </div>

          </div>

          {/* ==================================================
              PROJECTS
          ================================================== */}

          <div className="mt-10">

            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center gap-3">

                <FaBriefcase className="text-pink-400" />

                <h3 className="text-xl font-bold">
                  Projects
                </h3>

              </div>

              <button
                type="button"
                onClick={addProject}
                aria-label="Add project"
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-pink-600
                  hover:bg-pink-500
                  flex
                  items-center
                  justify-center
                  transition
                "
              >

                <FaPlus />

              </button>

            </div>

            {profile.projects.length === 0 ? (

              <p className="text-sm text-slate-600">
                Add projects to make your profile more complete.
              </p>

            ) : (

              <div className="space-y-5">

                {profile.projects.map(
                  (
                    project,
                    index
                  ) => (

                    <div
                      key={`project-${index}`}
                      className="
                        rounded-2xl
                        border
                        border-slate-800
                        bg-slate-950
                        p-5
                      "
                    >

                      <div className="flex justify-between items-center mb-4">

                        <span className="text-sm text-slate-500">
                          Project #{index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeProject(
                              index
                            )
                          }
                          aria-label={`Remove project ${index + 1}`}
                          className="text-red-400 hover:text-red-300"
                        >

                          <FaTrash />

                        </button>

                      </div>

                      <div className="grid md:grid-cols-2 gap-4">

                        <input
                          type="text"
                          value={
                            project.name
                          }
                          onChange={(e) =>
                            updateProject(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Project name"
                          className="
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-900
                            px-4
                            py-3
                            text-white
                            outline-none
                            focus:border-pink-500
                          "
                        />

                        <input
                          type="url"
                          value={
                            project.url ||
                            ""
                          }
                          onChange={(e) =>
                            updateProject(
                              index,
                              "url",
                              e.target.value
                            )
                          }
                          placeholder="Project URL (optional)"
                          className="
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-900
                            px-4
                            py-3
                            text-white
                            outline-none
                            focus:border-pink-500
                          "
                        />

                      </div>

                      <textarea
                        rows={4}
                        value={
                          project.description
                        }
                        onChange={(e) =>
                          updateProject(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe the project, technologies used and results..."
                        className="
                          mt-4
                          w-full
                          rounded-xl
                          border
                          border-slate-700
                          bg-slate-900
                          px-4
                          py-3
                          text-white
                          outline-none
                          resize-y
                          focus:border-pink-500
                        "
                      />

                    </div>

                  )
                )}

              </div>

            )}

          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (

            <div
              role="alert"
              className="
                mt-8
                flex
                items-start
                gap-3
                rounded-2xl
                border
                border-red-500/30
                bg-red-500/10
                p-5
              "
            >

              <FaExclamationTriangle className="text-red-400 mt-1 flex-shrink-0" />

              <div>

                <p className="font-semibold text-red-300">
                  Something went wrong
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {error}
                </p>

              </div>

            </div>

          )}

          {/* ==================================================
              SUCCESS
          ================================================== */}

          {success && (

            <div
              role="status"
              className="
                mt-8
                flex
                items-start
                gap-3
                rounded-2xl
                border
                border-green-500/30
                bg-green-500/10
                p-5
              "
            >

              <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />

              <div>

                <p className="font-semibold text-green-300">
                  Success
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {success}
                </p>

              </div>

            </div>

          )}

          {/* ==================================================
              ANALYZE BUTTON
          ================================================== */}

          <div className="mt-10 text-center">

            <button
              type="button"
              disabled={loading}
              onClick={
                analyzeProfile
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-3
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-violet-600
                px-6
                sm:px-10
                py-4
                text-base
                sm:text-lg
                font-bold
                text-white
                shadow-lg
                shadow-blue-900/30
                hover:scale-[1.02]
                transition
                disabled:opacity-60
                disabled:hover:scale-100
                disabled:cursor-not-allowed
              "
            >

              <FaChartLine />

              {loading
                ? "Analyzing Profile..."
                : "Analyze My LinkedIn Profile"}

            </button>

            <p className="mt-4 text-xs text-slate-500">
              Your submitted information is sent securely to the CareerPilot AI backend for analysis.
            </p>

          </div>

        </section>

        {/* ==================================================
            RESULTS
        ================================================== */}

        {result && (

          <section
            id="linkedin-analysis-results"
            className="mt-12 pb-16"
          >

            <div className="flex items-center gap-3 mb-7">

              <FaCheckCircle className="text-green-400 text-2xl flex-shrink-0" />

              <div>

                <h2 className="text-3xl font-bold">
                  LinkedIn Profile Analysis
                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  Analyzed{" "}

                  {result.analyzedAt
                    ? new Date(
                        result.analyzedAt
                      ).toLocaleString()
                    : "Just now"}

                </p>

              </div>

            </div>

            {/* ==================================================
                SCORE CARDS
            ================================================== */}

            <div className="grid md:grid-cols-2 gap-5">

              <ScoreCard
                title="Profile Score"
                score={
                  result.profileScore
                }
                icon={
                  <FaChartLine />
                }
              />

              <ScoreCard
                title="Completeness Score"
                score={
                  result.completenessScore
                }
                icon={
                  <FaCheckCircle />
                }
              />

            </div>

            {/* ==================================================
                SECTION ANALYSIS
            ================================================== */}

            <div className="mt-8 grid md:grid-cols-2 gap-6">

              <AnalysisCard
                title="Headline"
                score={
                  result.sections
                    .headline.score
                }
                suggestions={
                  result.sections
                    .headline
                    .suggestions
                }
              />

              <AnalysisCard
                title="About"
                score={
                  result.sections
                    .about.score
                }
                suggestions={
                  result.sections
                    .about
                    .suggestions
                }
              />

              <AnalysisCard
                title="Skills"
                score={
                  result.sections
                    .skills.score
                }
                count={
                  result.sections
                    .skills.count
                }
                suggestions={
                  result.sections
                    .skills
                    .suggestions
                }
              />

              <AnalysisCard
                title="Experience"
                score={
                  result.sections
                    .experience
                    .score
                }
                count={
                  result.sections
                    .experience
                    .count
                }
                suggestions={
                  result.sections
                    .experience
                    .suggestions
                }
              />

              <AnalysisCard
                title="Education"
                score={
                  result.sections
                    .education.score
                }
                count={
                  result.sections
                    .education.count
                }
                suggestions={
                  result.sections
                    .education
                    .suggestions
                }
              />

              <AnalysisCard
                title="Certifications"
                score={
                  result.sections
                    .certifications
                    .score
                }
                count={
                  result.sections
                    .certifications
                    .count
                }
                suggestions={
                  result.sections
                    .certifications
                    .suggestions
                }
              />

            </div>

            {/* ==================================================
                OVERALL SUGGESTIONS
            ================================================== */}

            <div
              className="
                mt-8
                rounded-3xl
                border
                border-slate-800
                bg-slate-900
                p-7
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-yellow-500/10
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                >

                  <FaLightbulb className="text-yellow-400" />

                </div>

                <div>

                  <h3 className="text-2xl font-bold">
                    Priority Improvements
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Suggestions generated from your submitted profile data.
                  </p>

                </div>

              </div>

              <div className="mt-6 space-y-3">

                {result.suggestions.length >
                0 ? (

                  result.suggestions.map(
                    (
                      suggestion,
                      index
                    ) => (

                      <div
                        key={`suggestion-${index}`}
                        className="
                          flex
                          gap-3
                          rounded-xl
                          border
                          border-slate-800
                          bg-slate-950
                          p-4
                        "
                      >

                        <span className="font-bold text-blue-400 flex-shrink-0">
                          {index + 1}.
                        </span>

                        <p className="text-slate-300">
                          {suggestion}
                        </p>

                      </div>

                    )
                  )

                ) : (

                  <div className="flex items-center gap-2 text-green-400">

                    <FaCheckCircle />

                    <span>
                      No additional suggestions were returned.
                    </span>

                  </div>

                )}

              </div>

            </div>

            {/* ==================================================
                PROFILE URL
            ================================================== */}

            {profile.linkedinUrl && (

              <div className="mt-6 text-center">

                <a
                  href={
                    profile.linkedinUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-blue-400
                    hover:text-blue-300
                    transition
                  "
                >

                  <FaLinkedin />

                  Open LinkedIn Profile

                  <FaExternalLinkAlt className="text-xs" />

                </a>

              </div>

            )}

          </section>

        )}

      </main>

    </div>
  );
}

// ======================================================
// SCORE CARD
// ======================================================

interface ScoreCardProps {
  title: string;
  score: number;
  icon: React.ReactNode;
}

function ScoreCard({
  title,
  score,
  icon,
}: ScoreCardProps) {
  const safeScore =
    clampScore(score);

  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-800
        bg-slate-900
        p-7
      "
    >

      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-5xl font-bold text-blue-400">
            {safeScore}%
          </p>

        </div>

        <div className="text-blue-400 text-4xl">
          {icon}
        </div>

      </div>

      <div className="mt-6 h-2 rounded-full bg-slate-800 overflow-hidden">

        <div
          className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-blue-500
            to-violet-500
            transition-all
            duration-700
          "
          style={{
            width:
              `${safeScore}%`,
          }}
        />

      </div>

    </div>
  );
}

// ======================================================
// ANALYSIS CARD
// ======================================================

interface AnalysisCardProps {
  title: string;
  score: number;
  count?: number;
  suggestions: string[];
}

function AnalysisCard({
  title,
  score,
  count,
  suggestions,
}: AnalysisCardProps) {
  const safeScore =
    clampScore(score);

  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-800
        bg-slate-900
        p-7
      "
    >

      <div className="flex items-start justify-between gap-4">

        <div>

          <h3 className="text-xl font-bold">
            {title}
          </h3>

          {typeof count ===
            "number" && (

            <p className="mt-1 text-sm text-slate-500">

              {count} item
              {count === 1
                ? ""
                : "s"}{" "}
              found

            </p>

          )}

        </div>

        <div
          className="
            rounded-xl
            bg-blue-500/10
            px-3
            py-2
            text-blue-400
            font-bold
            flex-shrink-0
          "
        >
          {safeScore}%
        </div>

      </div>

      <div
        className="
          mt-5
          h-2
          rounded-full
          bg-slate-800
          overflow-hidden
        "
      >

        <div
          className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-blue-500
            to-violet-500
            transition-all
            duration-700
          "
          style={{
            width:
              `${safeScore}%`,
          }}
        />

      </div>

      <div className="mt-5 space-y-3">

        {suggestions.length >
        0 ? (

          suggestions.map(
            (
              suggestion,
              index
            ) => (

              <div
                key={`${title}-suggestion-${index}`}
                className="
                  flex
                  gap-3
                  rounded-xl
                  bg-slate-950
                  p-3
                "
              >

                <FaLightbulb className="text-yellow-400 mt-1 flex-shrink-0" />

                <p className="text-sm text-slate-400">
                  {suggestion}
                </p>

              </div>

            )
          )

        ) : (

          <div className="flex items-center gap-2 text-green-400 text-sm">

            <FaCheckCircle />

            <span>
              No major issues detected.
            </span>

          </div>

        )}

      </div>

    </div>
  );
}

export default LinkedInOptimizer;