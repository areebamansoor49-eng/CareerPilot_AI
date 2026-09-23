import {
  FaArrowLeft,
  FaArrowRight,
  FaBrain,
  FaBriefcase,
  FaBullseye,
  FaCertificate,
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaLightbulb,
  FaRoad,
  FaRocket,
  FaSearch,
  FaTools,
  FaTrophy,
} from "react-icons/fa";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

import {
  getCurrentUserEmail,
  getSubscriptionStatus,
} from "../utils/subscription";
import SubscriptionModal from "../components/SubscriptionModal";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/* =========================================================
   TYPES
========================================================= */

interface RoadmapForm {
  careerField: string;
  targetRole: string;
  currentLevel: string;
  education: string;
  experience: string;
  skills: string;
  interests: string;
  careerGoal: string;
  weeklyHours: string;
  preferredLearning: string;
}

interface RoadmapResponse {
  success: boolean;
  message?: string;
  source?: "openai" | "fallback" | string;
  roadmap?: unknown;
}

type JsonObject = Record<string, unknown>;

interface RoadmapData extends JsonObject {
  careerOverview?: unknown;
  skillAssessment?: unknown;
  roadmap?: unknown;
  learningPlan?: unknown;
  projectsAndExperience?: unknown;
  certifications?: unknown;
  careerPreparation?: unknown;
  milestones?: unknown;
  nextSteps?: unknown;
}

/* =========================================================
   CONSTANTS
========================================================= */

const STORAGE_KEY = "careerRoadmap";
const SOURCE_STORAGE_KEY = "careerRoadmapSource";

const careerFields = [
  "Technology / IT",
  "Software Development",
  "Web Development",
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Mobile App Development",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Data Analytics",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "Database Administration",
  "UI/UX Design",
  "Graphic Design",
  "Digital Marketing",
  "Business",
  "Finance",
  "Accounting",
  "Human Resources",
  "Project Management",
  "Product Management",
  "Sales",
  "Marketing",
  "Entrepreneurship",
  "Healthcare",
  "Medicine",
  "Nursing",
  "Pharmacy",
  "Law",
  "Education",
  "Research",
  "Engineering",
  "Civil Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Architecture",
  "Media & Communication",
  "Content Creation",
  "Journalism",
  "Other",
];

const currentLevels = [
  "Complete Beginner",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Professional",
];

const learningOptions = [
  "Video Courses",
  "Hands-on Projects",
  "Books & Articles",
  "Interactive Practice",
  "Mentorship",
  "Mixed / Combination",
];

const processSteps = [
  {
    icon: FaSearch,
    title: "Tell Us About You",
    description:
      "Share your current skills, education, interests and career goals.",
  },
  {
    icon: FaBrain,
    title: "AI Analyzes Your Profile",
    description:
      "Your profile is evaluated to identify strengths, gaps and priorities.",
  },
  {
    icon: FaRoad,
    title: "Get Your Roadmap",
    description:
      "Receive a structured career path with practical learning steps.",
  },
  {
    icon: FaRocket,
    title: "Start Growing",
    description:
      "Follow your roadmap, build projects and prepare for real opportunities.",
  },
];

/* =========================================================
   SAFE DATA HELPERS
========================================================= */

const isObject = (value: unknown): value is JsonObject =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value);

const getObject = (value: unknown): JsonObject =>
  isObject(value) ? value : {};

const getString = (
  value: unknown,
  fallback = ""
): string => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return fallback;
};

const getArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

const getStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (
        typeof item === "number" ||
        typeof item === "boolean"
      ) {
        return String(item);
      }

      if (isObject(item)) {
        return (
          getString(item.title) ||
          getString(item.name) ||
          getString(item.skill) ||
          getString(item.action) ||
          getString(item.description) ||
          getString(item.task) ||
          getString(item.item) ||
          ""
        );
      }

      return "";
    })
    .filter(Boolean);
};

const prettyLabel = (key: string): string => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
};

const hasContent = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (isObject(value)) {
    return Object.keys(value).length > 0;
  }

  return true;
};

/* =========================================================
   GENERIC CONTENT COMPONENTS
========================================================= */

function ValueList({
  value,
  emptyText = "No information available.",
}: {
  value: unknown;
  emptyText?: string;
}) {
  const items = getStringArray(value);

  if (items.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        {emptyText}
      </p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex items-start gap-3 text-sm leading-6 text-slate-300"
        >
          <FaCheckCircle className="mt-1 shrink-0 text-emerald-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ObjectDetails({
  value,
}: {
  value: unknown;
}) {
  const object = getObject(value);

  const entries = Object.entries(object).filter(
    ([, entryValue]) => hasContent(entryValue)
  );

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-5">
      {entries.map(([key, entryValue]) => {
        if (Array.isArray(entryValue)) {
          return (
            <div key={key}>
              <h4 className="mb-2 text-sm font-semibold text-slate-200">
                {prettyLabel(key)}
              </h4>

              <ValueList value={entryValue} />
            </div>
          );
        }

        if (isObject(entryValue)) {
          return (
            <div
              key={key}
              className="rounded-xl border border-white/10 bg-[#050b18] p-4"
            >
              <h4 className="mb-3 text-sm font-semibold text-slate-200">
                {prettyLabel(key)}
              </h4>

              <ObjectDetails value={entryValue} />
            </div>
          );
        }

        return (
          <div key={key}>
            <h4 className="mb-1 text-sm font-semibold text-slate-200">
              {prettyLabel(key)}
            </h4>

            <p className="text-sm leading-6 text-slate-400">
              {getString(entryValue)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof FaBrain;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
        <Icon />
      </div>

      <div>
        <h2 className="text-xl font-bold text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm leading-6 text-slate-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ROADMAP PHASE CARD
========================================================= */

function RoadmapPhaseCard({
  phase,
  index,
}: {
  phase: unknown;
  index: number;
}) {
  if (!isObject(phase)) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0b1224] p-6 shadow-lg shadow-black/20">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white">
            {index + 1}
          </span>

          <h3 className="font-bold text-white">
            Phase {index + 1}
          </h3>
        </div>

        <p className="text-sm leading-6 text-slate-300">
          {getString(phase)}
        </p>
      </div>
    );
  }

  const phaseName =
    getString(phase.phase) ||
    getString(phase.title) ||
    getString(phase.name) ||
    `Phase ${index + 1}`;

  const duration =
    getString(phase.duration) ||
    getString(phase.timeframe) ||
    getString(phase.timeline);

  const focus =
    getString(phase.focus) ||
    getString(phase.description) ||
    getString(phase.goal);

  const skills =
    getStringArray(phase.skills).length > 0
      ? getStringArray(phase.skills)
      : getStringArray(phase.skillFocus);

  const actions =
    getStringArray(phase.actions).length > 0
      ? getStringArray(phase.actions)
      : getStringArray(phase.tasks);

  const resources = getStringArray(
    phase.resources
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1224] p-6 shadow-lg shadow-black/20">
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-cyan-400" />

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 pl-2">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white">
            {index + 1}
          </span>

          <div>
            <h3 className="text-lg font-bold text-white">
              {phaseName}
            </h3>

            {duration && (
              <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-400">
                <FaClock />
                {duration}
              </div>
            )}
          </div>
        </div>
      </div>

      {focus && (
        <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
          <p className="text-sm leading-6 text-blue-100">
            {focus}
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {skills.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              <FaTools className="text-blue-400" />
              Skills
            </h4>

            <ValueList value={skills} />
          </div>
        )}

        {actions.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              <FaCheckCircle className="text-emerald-400" />
              Actions
            </h4>

            <ValueList value={actions} />
          </div>
        )}

        {resources.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              <FaGraduationCap className="text-cyan-400" />
              Resources
            </h4>

            <ValueList value={resources} />
          </div>
        )}
      </div>

      {skills.length === 0 &&
        actions.length === 0 &&
        resources.length === 0 && (
          <ObjectDetails value={phase} />
        )}
    </div>
  );
}

/* =========================================================
   PROJECT CARD
========================================================= */

function ProjectCard({
  project,
  index,
}: {
  project: unknown;
  index: number;
}) {
  if (!isObject(project)) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0b1224] p-5 shadow-lg shadow-black/20">
        <h3 className="mb-2 font-semibold text-white">
          Project {index + 1}
        </h3>

        <p className="text-sm leading-6 text-slate-300">
          {getString(project)}
        </p>
      </div>
    );
  }

  const title =
    getString(project.project) ||
    getString(project.title) ||
    getString(project.name) ||
    `Project ${index + 1}`;

  const purpose =
    getString(project.purpose) ||
    getString(project.description) ||
    getString(project.goal);

  const skills = getStringArray(
    project.skills
  );

  const outcome =
    getString(project.outcome) ||
    getString(project.result);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1224] p-5 shadow-lg shadow-black/20">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
          <FaBriefcase />
        </div>

        <div>
          <h3 className="font-bold text-white">
            {title}
          </h3>

          {purpose && (
            <p className="mt-1 text-sm leading-6 text-slate-400">
              {purpose}
            </p>
          )}
        </div>
      </div>

      {skills.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            Skills Used
          </h4>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, skillIndex) => (
              <span
                key={`${skill}-${skillIndex}`}
                className="rounded-full border border-white/10 bg-[#050b18] px-3 py-1 text-xs font-medium text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {outcome && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
          <p className="text-sm leading-6 text-emerald-300">
            <strong>Expected outcome:</strong>{" "}
            {outcome}
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   CERTIFICATION CARD
========================================================= */

function CertificationCard({
  certification,
  index,
}: {
  certification: unknown;
  index: number;
}) {
  if (!isObject(certification)) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#0b1224] p-5 shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <FaCertificate className="text-amber-400" />

          <p className="text-sm font-semibold text-slate-200">
            {getString(certification) ||
              `Certification ${index + 1}`}
          </p>
        </div>
      </div>
    );
  }

  const name =
    getString(certification.name) ||
    getString(certification.title) ||
    getString(certification.certification) ||
    `Certification ${index + 1}`;

  const reason =
    getString(certification.reason) ||
    getString(certification.description);

  const when =
    getString(certification.when) ||
    getString(certification.timeframe) ||
    getString(certification.timing);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1224] p-5 shadow-lg shadow-black/20">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
          <FaCertificate />
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-white">
            {name}
          </h3>

          {when && (
            <p className="mt-1 text-xs font-medium text-slate-400">
              Recommended: {when}
            </p>
          )}

          {reason && (
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {reason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CareerRoadmap() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RoadmapForm>({
    careerField: "",
    targetRole: "",
    currentLevel: "",
    education: "",
    experience: "",
    skills: "",
    interests: "",
    careerGoal: "",
    weeklyHours: "10",
    preferredLearning: "Mixed / Combination",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [roadmap, setRoadmap] =
    useState<RoadmapData | null>(null);

  const [roadmapSource, setRoadmapSource] =
    useState<string>("");

  /* =======================================================
     SUBSCRIPTION STATE
  ======================================================= */

  const [checkingSubscription, setCheckingSubscription] =
    useState(false);

  const [isSubscribed, setIsSubscribed] =
    useState(false);

  const [showSubscriptionModal, setShowSubscriptionModal] =
    useState(false);

  /* =======================================================
     FORM HELPERS
  ======================================================= */

  const updateField = (
    field: keyof RoadmapForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setRoadmap(null);
    setRoadmapSource("");
    setShowSubscriptionModal(false);

    setIsSubscribed(false);

    setSuccess("");
    setError("");
  };

  const parsedSkills = useMemo(() => {
    return form.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }, [form.skills]);

  const parsedInterests = useMemo(() => {
    return form.interests
      .split(",")
      .map((interest) => interest.trim())
      .filter(Boolean);
  }, [form.interests]);

  /* =======================================================
     CHECK SUBSCRIPTION
  ======================================================= */

  const checkRoadmapSubscription = async () => {
    setCheckingSubscription(true);

    try {
      const subscription =
        await getSubscriptionStatus();

      const subscribed = Boolean(
        subscription.success &&
        (
          subscription.premiumAccess ||
          subscription.trialing ||
          subscription.status === "trialing" ||
          subscription.status === "active"
        )
      );

      setIsSubscribed(subscribed);

      if (!subscribed) {
        setShowSubscriptionModal(true);
      } else {
        setShowSubscriptionModal(false);
      }

      return subscribed;
    } catch (subscriptionError) {
      console.error(
        "Career Roadmap subscription check failed:",
        subscriptionError
      );

      setIsSubscribed(false);
      setShowSubscriptionModal(true);

      return false;
    } finally {
      setCheckingSubscription(false);
    }
  };

  /* =======================================================
     GENERATE ROADMAP
  ======================================================= */

  const generateRoadmap = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setShowSubscriptionModal(false);

    if (!form.careerField) {
      setError(
        "Please select your career field."
      );
      return;
    }

    if (!form.targetRole.trim()) {
      setError(
        "Please enter your target role."
      );
      return;
    }

    if (!form.currentLevel) {
      setError(
        "Please select your current level."
      );
      return;
    }

    if (!form.education.trim()) {
      setError(
        "Please enter your education."
      );
      return;
    }

    if (parsedSkills.length === 0) {
      setError(
        "Please enter at least one current skill."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/career-roadmap/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: getCurrentUserEmail(),
            careerField: form.careerField,
            targetRole: form.targetRole.trim(),
            currentLevel: form.currentLevel,
            education: form.education.trim(),
            experience: form.experience.trim(),
            skills: parsedSkills,
            interests: parsedInterests,
            careerGoal: form.careerGoal.trim(),
            weeklyHours: form.weeklyHours,
            preferredLearning:
              form.preferredLearning,
          }),
        }
      );

      let data: RoadmapResponse;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to generate your career roadmap."
        );
      }

      if (
        !data.roadmap ||
        !isObject(data.roadmap)
      ) {
        throw new Error(
          "The roadmap was generated, but no roadmap data was returned."
        );
      }

      const generatedRoadmap =
        data.roadmap as RoadmapData;

      setRoadmap(generatedRoadmap);

      const premiumAccess = Boolean(
        (
          data as typeof data & {
            premiumAccess?: boolean;
          }
        ).premiumAccess
      );

      setIsSubscribed(premiumAccess);

      if (!premiumAccess) {
        setShowSubscriptionModal(true);
      } else {
        setShowSubscriptionModal(false);
      }

      const source =
        data.source === "openai"
          ? "openai"
          : "fallback";

      setRoadmapSource(source);

      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(generatedRoadmap)
      );

      sessionStorage.setItem(
        SOURCE_STORAGE_KEY,
        source
      );

      setSuccess(
        data.message ||
          "Your personalized career roadmap has been generated successfully."
      );

      window.setTimeout(() => {
        document
          .getElementById("generated-roadmap")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 150);
    } catch (requestError) {
      console.error(
        "Career roadmap generation error:",
        requestError
      );

      if (
        requestError instanceof TypeError
      ) {
        setError(
          "Unable to connect to the CareerPilot server. Please make sure your backend is running on port 5000."
        );
      } else {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Something went wrong while generating your roadmap."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     SUBSCRIPTION MODAL CLOSE
  ======================================================= */

  const handleSubscriptionClose = async () => {
    setShowSubscriptionModal(false);
    setCheckingSubscription(true);

    try {
      const subscription =
        await getSubscriptionStatus();

      const subscribed = Boolean(
        subscription.success &&
        (
          subscription.premiumAccess ||
          subscription.trialing ||
          subscription.status === "trialing" ||
          subscription.status === "active"
        )
      );

      setIsSubscribed(subscribed);

      if (subscribed) {
        setShowSubscriptionModal(false);
      } else {
        setShowSubscriptionModal(false);
      }
    } catch (subscriptionError) {
      console.error(
        "Career Roadmap subscription re-check failed:",
        subscriptionError
      );

      setIsSubscribed(false);
      setShowSubscriptionModal(false);
    } finally {
      setCheckingSubscription(false);
    }
  };

  /* =======================================================
     DOWNLOAD ROADMAP PDF
  ======================================================= */

  const downloadRoadmapPDF = () => {
    if (!roadmap || !isSubscribed) {
      return;
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 18;
    const contentWidth = pageWidth - margin * 2;

    let y = 20;

    const addPageNumber = () => {
      const pageCount = pdf.getNumberOfPages();

      for (let page = 1; page <= pageCount; page += 1) {
        pdf.setPage(page);

        pdf.setFontSize(8);
        pdf.setTextColor(120, 130, 145);

        pdf.text(
          `CareerPilot AI • Career Roadmap • Page ${page} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      }
    };

    const ensureSpace = (height: number) => {
      if (y + height > pageHeight - 22) {
        pdf.addPage();
        y = 20;
      }
    };

    const addTitle = (
      title: string,
      subtitle?: string
    ) => {
      ensureSpace(18);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(15);
      pdf.setTextColor(20, 45, 90);
      pdf.text(title, margin, y);

      y += 7;

      if (subtitle) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(95, 105, 120);

        const lines = pdf.splitTextToSize(
          subtitle,
          contentWidth
        );

        pdf.text(lines, margin, y);

        y += lines.length * 4.5 + 4;
      } else {
        y += 4;
      }
    };

    const addParagraph = (
      text: string,
      fontSize = 9.5
    ) => {
      const value = String(text || "").trim();

      if (!value) {
        return;
      }

      const lines = pdf.splitTextToSize(
        value,
        contentWidth
      );

      const height =
        lines.length * (fontSize * 0.45) + 4;

      ensureSpace(height);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(fontSize);
      pdf.setTextColor(55, 65, 80);

      pdf.text(lines, margin, y);

      y += height;
    };

    const addBulletList = (
      items: string[],
      maxItems = 20
    ) => {
      const cleanItems = items
        .map((item) => String(item || "").trim())
        .filter(Boolean)
        .slice(0, maxItems);

      cleanItems.forEach((item) => {
        const lines = pdf.splitTextToSize(
          item,
          contentWidth - 7
        );

        const height =
          lines.length * 4.2 + 2;

        ensureSpace(height);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(55, 65, 80);

        pdf.text("•", margin, y);
        pdf.text(lines, margin + 5, y);

        y += height;
      });

      y += 2;
    };

    const getText = (
      value: unknown,
      fallback = ""
    ): string => {
      if (
        value === null ||
        value === undefined
      ) {
        return fallback;
      }

      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        return String(value);
      }

      return fallback;
    };

    const getList = (
      value: unknown
    ): string[] => {
      return getStringArray(value)
        .map((item) => String(item).trim())
        .filter(Boolean);
    };

    const overview = getObject(
      roadmap.careerOverview
    );

    const assessment = getObject(
      roadmap.skillAssessment
    );

    const learningPlan = getObject(
      roadmap.learningPlan
    );

    const careerPreparation = getObject(
      roadmap.careerPreparation
    );

    const phases = getArray(
      roadmap.roadmap
    );

    const projects = getArray(
      roadmap.projectsAndExperience
    );

    const certifications = getArray(
      roadmap.certifications
    );

    const milestones = getArray(
      roadmap.milestones
    );

    const nextSteps = getList(
      roadmap.nextSteps
    );

    /* =====================================================
       COVER
    ===================================================== */

    pdf.setFillColor(7, 20, 47);
    pdf.rect(0, 0, pageWidth, 58, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.setTextColor(255, 255, 255);

    pdf.text(
      "CareerPilot AI",
      margin,
      25
    );

    pdf.setFontSize(17);
    pdf.text(
      "Your Career Roadmap",
      margin,
      37
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(190, 205, 225);

    pdf.text(
      "A personalized career development plan",
      margin,
      46
    );

    y = 72;

    const targetRole =
      getText(
        overview.targetRole,
        form.targetRole
      );

    const field =
      getText(
        overview.field,
        form.careerField
      );

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.setTextColor(20, 45, 90);

    pdf.text(
      targetRole || "Career Development Plan",
      margin,
      y
    );

    y += 7;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(90, 100, 115);

    pdf.text(
      field,
      margin,
      y
    );

    y += 12;

    /* =====================================================
       PROFILE SUMMARY
    ===================================================== */

    addTitle(
      "Profile Summary",
      "The information used to personalize your roadmap."
    );

    const profileRows = [
      ["Current Level", form.currentLevel],
      ["Education", form.education],
      ["Experience", form.experience],
      ["Career Goal", form.careerGoal],
      ["Weekly Learning Time", `${form.weeklyHours} hours`],
      ["Learning Preference", form.preferredLearning],
    ];

    profileRows.forEach(([label, value]) => {
      if (!String(value || "").trim()) {
        return;
      }

      ensureSpace(7);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8.5);
      pdf.setTextColor(70, 80, 95);

      pdf.text(`${label}:`, margin, y);

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(55, 65, 80);

      const lines = pdf.splitTextToSize(
        String(value),
        contentWidth - 38
      );

      pdf.text(
        lines,
        margin + 38,
        y
      );

      y += Math.max(
        5,
        lines.length * 4.2
      );
    });

    /* =====================================================
       CAREER OVERVIEW
    ===================================================== */

    addTitle(
      "Career Overview"
    );

    addParagraph(
      getText(
        overview.startingPoint
      )
    );

    addParagraph(
      getText(
        overview.careerDirection
      )
    );

    /* =====================================================
       SKILL ASSESSMENT
    ===================================================== */

    addTitle(
      "Skill Assessment",
      "Strengths, gaps and priority areas for development."
    );

    addParagraph("Existing Strengths");

    addBulletList(
      getList(
        assessment.existingStrengths ||
          assessment.currentStrengths ||
          assessment.existingSkills ||
          assessment.currentSkills
      )
    );

    addParagraph("Skill Gaps");

    addBulletList(
      getList(
        assessment.skillGaps ||
          assessment.gaps
      )
    );

    addParagraph("Priority Skills");

    addBulletList(
      getList(
        assessment.prioritySkills
      )
    );

    /* =====================================================
       ROADMAP PHASES
    ===================================================== */

    addTitle(
      "Roadmap Phases",
      "Follow these phases progressively and track your development."
    );

    phases.forEach((phase, index) => {
      if (!isObject(phase)) {
        return;
      }

      const phaseNumber =
        typeof phase.phase === "number"
          ? String(phase.phase)
          : getText(
              phase.phase,
              String(index + 1)
            );

      const title =
        getText(
          phase.title,
          `Phase ${index + 1}`
        );

      const duration =
        getText(
          phase.duration
        );

      ensureSpace(30);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(20, 45, 90);

      pdf.text(
        `Phase ${phaseNumber}: ${title}`,
        margin,
        y
      );

      y += 6;

      if (duration) {
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(8.5);
        pdf.setTextColor(90, 100, 115);

        pdf.text(
          `Timeline: ${duration}`,
          margin,
          y
        );

        y += 5;
      }

      const objective =
        getText(
          phase.objective
        );

      if (objective) {
        addParagraph(
          `Objective: ${objective}`
        );
      }

      const phaseSkills =
        getList(
          phase.skills ||
            phase.skillFocus
        );

      if (phaseSkills.length) {
        addParagraph("Skills to Develop");
        addBulletList(phaseSkills);
      }

      const learningActions =
        getList(
          phase.learningActions
        );

      if (learningActions.length) {
        addParagraph("Learning Actions");
        addBulletList(learningActions);
      }

      const practicalExperience =
        getList(
          phase.practicalExperience
        );

      if (practicalExperience.length) {
        addParagraph("Practical Experience");
        addBulletList(
          practicalExperience
        );
      }

      const phaseMilestones =
        getList(
          phase.milestones
        );

      if (phaseMilestones.length) {
        addParagraph("Phase Milestones");
        addBulletList(
          phaseMilestones
        );
      }

      y += 3;
    });

    /* =====================================================
       LEARNING PLAN
    ===================================================== */

    if (
      Object.keys(learningPlan).length > 0
    ) {
      addTitle(
        "Learning Plan"
      );

      addParagraph(
        "Core Topics"
      );

      addBulletList(
        getList(
          learningPlan.coreTopics
        )
      );

      addParagraph(
        "Recommended Learning Methods"
      );

      addBulletList(
        getList(
          learningPlan.recommendedLearningMethods
        )
      );

      addParagraph(
        "Practice Strategy"
      );

      addParagraph(
        getText(
          learningPlan.practiceStrategy
        )
      );
    }

    /* =====================================================
       PROJECTS
    ===================================================== */

    if (projects.length > 0) {
      addTitle(
        "Projects & Practical Experience",
        "Build practical evidence of your capabilities."
      );

      projects.forEach((project, index) => {
        if (!isObject(project)) {
          return;
        }

        const title =
          getText(
            project.title ||
              project.project ||
              project.name,
            `Project ${index + 1}`
          );

        const description =
          getText(
            project.description ||
              project.purpose ||
              project.goal
          );

        const difficulty =
          getText(
            project.difficulty
          );

        const outcome =
          getText(
            project.outcome ||
              project.result
          );

        ensureSpace(25);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(20, 45, 90);

        pdf.text(
          `${index + 1}. ${title}`,
          margin,
          y
        );

        y += 6;

        if (difficulty) {
          addParagraph(
            `Difficulty: ${difficulty}`
          );
        }

        if (description) {
          addParagraph(
            description
          );
        }

        const skills =
          getList(
            project.skillsDeveloped ||
              project.skills
          );

        if (skills.length) {
          addParagraph(
            "Skills Developed"
          );

          addBulletList(skills);
        }

        if (outcome) {
          addParagraph(
            `Expected Outcome: ${outcome}`
          );
        }

        y += 2;
      });
    }

    /* =====================================================
       CERTIFICATIONS
    ===================================================== */

    if (certifications.length > 0) {
      addTitle(
        "Recommended Certifications"
      );

      certifications.forEach(
        (certification, index) => {
          if (
            typeof certification ===
            "string"
          ) {
            addBulletList([
              certification,
            ]);

            return;
          }

          if (
            !isObject(certification)
          ) {
            return;
          }

          const title =
            getText(
              certification.title ||
                certification.name ||
                certification.certification,
              `Certification ${index + 1}`
            );

          const description =
            getText(
              certification.description ||
                certification.purpose
            );

          addParagraph(
            title
          );

          if (description) {
            addParagraph(
              description
            );
          }
        }
      );
    }

    /* =====================================================
       CAREER PREPARATION
    ===================================================== */

    if (
      Object.keys(careerPreparation)
        .length > 0
    ) {
      addTitle(
        "Career Preparation"
      );

      Object.entries(
        careerPreparation
      ).forEach(([key, value]) => {
        const label =
          key
            .replace(
              /([A-Z])/g,
              " $1"
            )
            .replace(
              /^./,
              (letter) =>
                letter.toUpperCase()
            );

        if (
          Array.isArray(value)
        ) {
          addParagraph(label);
          addBulletList(
            value.map((item) =>
              String(item)
            )
          );
        } else {
          const valueText =
            getText(value);

          if (valueText) {
            addParagraph(
              `${label}: ${valueText}`
            );
          }
        }
      });
    }

    /* =====================================================
       MILESTONES
    ===================================================== */

    if (milestones.length > 0) {
      addTitle(
        "Milestones",
        "Track these outcomes as you progress."
      );

      milestones.forEach(
        (milestone, index) => {
          if (
            typeof milestone ===
            "string"
          ) {
            addBulletList([
              `${index + 1}. ${milestone}`,
            ]);

            return;
          }

          if (
            !isObject(milestone)
          ) {
            return;
          }

          const title =
            getText(
              milestone.milestone ||
                milestone.title ||
                milestone.name,
              `Milestone ${index + 1}`
            );

          const outcome =
            getText(
              milestone.expectedOutcome ||
                milestone.successCriteria
            );

          const timeframe =
            getText(
              milestone.timeframe ||
                milestone.duration
            );

          addParagraph(
            `${index + 1}. ${title}`
          );

          if (timeframe) {
            addParagraph(
              `Timeframe: ${timeframe}`
            );
          }

          if (outcome) {
            addParagraph(
              `Expected Outcome: ${outcome}`
            );
          }
        }
      );
    }

    /* =====================================================
       NEXT STEPS
    ===================================================== */

    if (nextSteps.length > 0) {
      addTitle(
        "Next Steps",
        "Start with these actions after reviewing your roadmap."
      );

      addBulletList(
        nextSteps
      );
    }

    /* =====================================================
       FINAL NOTE
    ===================================================== */

    ensureSpace(28);

    pdf.setDrawColor(
      210,
      220,
      235
    );

    pdf.line(
      margin,
      y,
      pageWidth - margin,
      y
    );

    y += 8;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(20, 45, 90);

    pdf.text(
      "CareerPilot AI",
      margin,
      y
    );

    y += 5;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 110, 125);

    const note =
      "This roadmap is a personalized planning resource based on the information provided. Career requirements, certifications and licensing rules may vary by country, employer and profession.";

    const noteLines =
      pdf.splitTextToSize(
        note,
        contentWidth
      );

    pdf.text(
      noteLines,
      margin,
      y
    );

    addPageNumber();

    const safeRole =
      (targetRole || "Career-Roadmap")
        .replace(
          /[^a-z0-9]+/gi,
          "-"
        )
        .replace(
          /^-+|-+$/g,
          ""
        )
        .toLowerCase();

    pdf.save(
      `CareerPilot-${safeRole || "Roadmap"}.pdf`
    );
  };

  /* =======================================================
     CLEAR ROADMAP
  ======================================================= */

  const clearRoadmap = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(
      SOURCE_STORAGE_KEY
    );

    setRoadmap(null);
    setRoadmapSource("");
    setSuccess("");
    setError("");
    setIsSubscribed(false);
    setShowSubscriptionModal(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     ROADMAP DATA
  ======================================================= */

  const careerOverview = getString(
    roadmap?.careerOverview
  );

  const skillAssessment = getObject(
    roadmap?.skillAssessment
  );

  const aiStrengths =
    getStringArray(
      skillAssessment.currentStrengths
    ).length > 0
      ? getStringArray(
          skillAssessment.currentStrengths
        )
      : getStringArray(
          skillAssessment.strengths
        );

  const alternativeStrengths =
    getStringArray(
      skillAssessment.existingSkills
    ).length > 0
      ? getStringArray(
          skillAssessment.existingSkills
        )
      : getStringArray(
          skillAssessment.currentSkills
        );

  const strengths =
    aiStrengths.length > 0
      ? aiStrengths
      : alternativeStrengths.length > 0
      ? alternativeStrengths
      : parsedSkills;

  const strengthsAreFromProfile =
    aiStrengths.length === 0 &&
    alternativeStrengths.length === 0 &&
    parsedSkills.length > 0;

  const skillGaps =
    getStringArray(
      skillAssessment.skillGaps
    ).length > 0
      ? getStringArray(
          skillAssessment.skillGaps
        )
      : getStringArray(
          skillAssessment.gaps
        );

  const prioritySkills = getStringArray(
    skillAssessment.prioritySkills
  );

  const phases = getArray(
    roadmap?.roadmap
  );

  const learningPlan = getObject(
    roadmap?.learningPlan
  );

  const projects = getArray(
    roadmap?.projectsAndExperience
  );

  const certifications = getArray(
    roadmap?.certifications
  );

  const careerPreparation = getObject(
    roadmap?.careerPreparation
  );

  const milestones = getArray(
    roadmap?.milestones
  );

  const nextSteps = getStringArray(
    roadmap?.nextSteps
  );

  const hasStructuredRoadmap =
    Boolean(careerOverview) ||
    strengths.length > 0 ||
    skillGaps.length > 0 ||
    prioritySkills.length > 0 ||
    phases.length > 0 ||
    Object.keys(learningPlan).length > 0 ||
    projects.length > 0 ||
    certifications.length > 0 ||
    Object.keys(careerPreparation).length >
      0 ||
    milestones.length > 0 ||
    nextSteps.length > 0;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* ===================================================
          HERO
      =================================================== */}

      <section className="border-b border-white/10 bg-[#020617]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
              <FaBrain />
              AI Career Planning
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Build Your Personalized Career Roadmap
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Tell CareerPilot where you are today
              and where you want to go. Your
              personalized roadmap will turn your
              career goal into practical learning,
              projects and career preparation steps.
            </p>

            {roadmap && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400">
                  <FaCheckCircle />
                  Roadmap generated
                </span>

                {roadmapSource === "openai" && (
                  <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-400">
                    AI-powered roadmap
                  </span>
                )}

                {roadmapSource === "fallback" && (
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-400">
                    Personalized roadmap
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ALERTS */}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-400" />

            <div>
              <p className="font-semibold">
                Success
              </p>

              <p className="mt-1">
                {success}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            <FaBullseye className="mt-0.5 shrink-0 text-red-400" />

            <div>
              <p className="font-semibold">
                Something went wrong
              </p>

              <p className="mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* FORM */}

        <section
          id="roadmap-form"
          className="mb-14"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">
              Tell Us About Yourself
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              The more accurate information you
              provide, the more useful your
              personalized roadmap will be.
            </p>
          </div>

          <form
            onSubmit={generateRoadmap}
            className="rounded-3xl border border-white/10 bg-[#0b1224] p-6 shadow-xl shadow-black/20 sm:p-8"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {/* Career Field */}
              <div>
                <label
                  htmlFor="careerField"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Career Field *
                </label>

                <select
                  id="careerField"
                  value={form.careerField}
                  onChange={(event) =>
                    updateField(
                      "careerField",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#050b18] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option
                    value=""
                    className="bg-[#050b18]"
                  >
                    Select your career field
                  </option>

                  {careerFields.map((field) => (
                    <option
                      key={field}
                      value={field}
                      className="bg-[#050b18]"
                    >
                      {field}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Role */}
              <div>
                <label
                  htmlFor="targetRole"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Target Role *
                </label>

                <input
                  id="targetRole"
                  type="text"
                  value={form.targetRole}
                  onChange={(event) =>
                    updateField(
                      "targetRole",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Full Stack Developer"
                  className="w-full rounded-xl border border-white/10 bg-[#050b18] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Current Level */}
              <div>
                <label
                  htmlFor="currentLevel"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Current Level *
                </label>

                <select
                  id="currentLevel"
                  value={form.currentLevel}
                  onChange={(event) =>
                    updateField(
                      "currentLevel",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#050b18] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option
                    value=""
                    className="bg-[#050b18]"
                  >
                    Select your level
                  </option>

                  {currentLevels.map((level) => (
                    <option
                      key={level}
                      value={level}
                      className="bg-[#050b18]"
                    >
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Education */}
              <div>
                <label
                  htmlFor="education"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Education *
                </label>

                <input
                  id="education"
                  type="text"
                  value={form.education}
                  onChange={(event) =>
                    updateField(
                      "education",
                      event.target.value
                    )
                  }
                  placeholder="e.g. BS Computer Science"
                  className="w-full rounded-xl border border-white/10 bg-[#050b18] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Experience */}
              <div>
                <label
                  htmlFor="experience"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Experience
                </label>

                <input
                  id="experience"
                  type="text"
                  value={form.experience}
                  onChange={(event) =>
                    updateField(
                      "experience",
                      event.target.value
                    )
                  }
                  placeholder="e.g. 1 year internship experience"
                  className="w-full rounded-xl border border-white/10 bg-[#050b18] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Weekly Hours */}
              <div>
                <label
                  htmlFor="weeklyHours"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Weekly Learning Hours
                </label>

                <input
                  id="weeklyHours"
                  type="number"
                  min="1"
                  max="80"
                  value={form.weeklyHours}
                  onChange={(event) =>
                    updateField(
                      "weeklyHours",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#050b18] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Skills */}
              <div className="md:col-span-2">
                <label
                  htmlFor="skills"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Current Skills *
                </label>

                <input
                  id="skills"
                  type="text"
                  value={form.skills}
                  onChange={(event) =>
                    updateField(
                      "skills",
                      event.target.value
                    )
                  }
                  placeholder="e.g. HTML, CSS, JavaScript, React"
                  className="w-full rounded-xl border border-white/10 bg-[#050b18] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Separate multiple skills with commas.
                </p>
              </div>

              {/* Interests */}
              <div className="md:col-span-2">
                <label
                  htmlFor="interests"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Interests
                </label>

                <input
                  id="interests"
                  type="text"
                  value={form.interests}
                  onChange={(event) =>
                    updateField(
                      "interests",
                      event.target.value
                    )
                  }
                  placeholder="e.g. AI, startups, web applications"
                  className="w-full rounded-xl border border-white/10 bg-[#050b18] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Separate multiple interests with commas.
                </p>
              </div>

              {/* Career Goal */}
              <div className="md:col-span-2">
                <label
                  htmlFor="careerGoal"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Career Goal
                </label>

                <textarea
                  id="careerGoal"
                  rows={4}
                  value={form.careerGoal}
                  onChange={(event) =>
                    updateField(
                      "careerGoal",
                      event.target.value
                    )
                  }
                  placeholder="Describe what you want to achieve in your career..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#050b18] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Learning Preference */}
              <div className="md:col-span-2">
                <label
                  htmlFor="preferredLearning"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Preferred Learning Style
                </label>

                <select
                  id="preferredLearning"
                  value={form.preferredLearning}
                  onChange={(event) =>
                    updateField(
                      "preferredLearning",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#050b18] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  {learningOptions.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                        className="bg-[#050b18]"
                      >
                        {option}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-500">
                Your information is used to create a
                personalized career plan.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Generating Roadmap...
                  </>
                ) : (
                  <>
                    <FaRocket />
                    Generate My Roadmap
                    <FaArrowRight />
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* =================================================
            GENERATED ROADMAP
        ================================================= */}

        {roadmap && (
          <>
            {/* PROCESS */}

            <section className="mb-12">
              <div className="grid gap-4 md:grid-cols-4">
                {processSteps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.title}
                      className="rounded-2xl border border-white/10 bg-[#0b1224] p-5 shadow-lg shadow-black/20"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                          <Icon />
                        </div>

                        <span className="text-xs font-bold text-slate-600">
                          0{index + 1}
                        </span>
                      </div>

                      <h3 className="font-bold text-white">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* GENERATED ROADMAP */}

            <section
              id="generated-roadmap"
              className="scroll-mt-8"
            >
              {/* ROADMAP HEADER */}

              <div className="mb-8 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-[#07142f] via-[#0a1733] to-[#03101f] p-6 text-white shadow-xl shadow-blue-950/30 sm:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-400">
                      <FaRoad />
                      Your Career Roadmap
                    </div>

                    <h2 className="text-2xl font-extrabold sm:text-3xl">
                      Your Personalized Career Plan
                    </h2>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                      This roadmap is based on the
                      information you provided and is
                      designed to give you a practical
                      path from your current level toward
                      your target career.
                    </p>

                    {!isSubscribed && (
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300">
                        <FaLockIcon />
                        Preview mode — subscribe to unlock the full roadmap
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={clearRoadmap}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-blue-400/40 hover:bg-blue-500/10"
                  >
                    <FaArrowLeft />
                    Create New Roadmap
                  </button>
                </div>
              </div>

              {/* =================================================
                  SUBSCRIBED USER
              ================================================= */}

              {isSubscribed ? (
                <>
                  {/* CAREER OVERVIEW */}

                  {careerOverview && (
                    <section className="mb-10">
                      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6">
                        <SectionHeader
                          icon={FaBullseye}
                          title="Career Overview"
                          description="Your personalized career direction based on your profile."
                        />

                        <p className="text-sm leading-7 text-blue-100">
                          {careerOverview}
                        </p>
                      </div>
                    </section>
                  )}

                  {/* SKILL ASSESSMENT */}

                  {(strengths.length > 0 ||
                    skillGaps.length > 0 ||
                    prioritySkills.length > 0) && (
                    <section className="mb-10">
                      <SectionHeader
                        icon={FaTools}
                        title="Skill Assessment"
                        description="Understand what you already have and what to prioritize next."
                      />

                      <div className="grid gap-5 md:grid-cols-3">
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-bold text-emerald-300">
                                Current Strengths
                              </h3>

                              <p className="mt-1 text-xs leading-5 text-emerald-200/60">
                                {strengthsAreFromProfile
                                  ? "Based on the skills you provided."
                                  : "Skills identified as strengths for your career direction."}
                              </p>
                            </div>

                            <FaCheckCircle className="mt-1 shrink-0 text-emerald-400" />
                          </div>

                          <ValueList
                            value={strengths}
                            emptyText="Add your current skills above to identify your strengths."
                          />

                          {strengthsAreFromProfile && (
                            <div className="mt-4 rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-3">
                              <p className="text-xs leading-5 text-emerald-200/70">
                                These strengths are derived from your
                                Current Skills. As your profile grows,
                                regenerate the roadmap to get an updated
                                AI-based assessment.
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6">
                          <h3 className="mb-4 font-bold text-amber-300">
                            Skill Gaps
                          </h3>

                          <ValueList
                            value={skillGaps}
                            emptyText="No major gaps identified."
                          />
                        </div>

                        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6">
                          <h3 className="mb-4 font-bold text-blue-300">
                            Priority Skills
                          </h3>

                          <ValueList
                            value={prioritySkills}
                            emptyText="No priority skills identified."
                          />
                        </div>
                      </div>
                    </section>
                  )}

                  {/* ROADMAP PHASES */}

                  {phases.length > 0 && (
                    <section className="mb-10">
                      <SectionHeader
                        icon={FaRoad}
                        title="Roadmap Phases"
                        description="Follow these phases in sequence and build your skills progressively."
                      />

                      <div className="space-y-5">
                        {phases.map(
                          (phase, index) => (
                            <RoadmapPhaseCard
                              key={`phase-${index}`}
                              phase={phase}
                              index={index}
                            />
                          )
                        )}
                      </div>
                    </section>
                  )}

                  {/* LEARNING PLAN */}

                  {Object.keys(learningPlan).length >
                    0 && (
                    <section className="mb-10">
                      <SectionHeader
                        icon={FaGraduationCap}
                        title="Weekly Learning Plan"
                        description="Use your available time consistently to make progress."
                      />

                      <div className="rounded-2xl border border-white/10 bg-[#0b1224] p-6 shadow-lg shadow-black/20">
                        <ObjectDetails
                          value={learningPlan}
                        />
                      </div>
                    </section>
                  )}

                  {/* PROJECTS */}

                  {projects.length > 0 && (
                    <section className="mb-10">
                      <SectionHeader
                        icon={FaBriefcase}
                        title="Projects & Experience"
                        description="Build practical proof of your skills instead of relying only on courses."
                      />

                      <div className="grid gap-5 md:grid-cols-2">
                        {projects.map(
                          (project, index) => (
                            <ProjectCard
                              key={`project-${index}`}
                              project={project}
                              index={index}
                            />
                          )
                        )}
                      </div>
                    </section>
                  )}

                  {/* CERTIFICATIONS */}

                  {certifications.length > 0 && (
                    <section className="mb-10">
                      <SectionHeader
                        icon={FaCertificate}
                        title="Recommended Certifications"
                        description="Certifications that can complement your practical experience."
                      />

                      <div className="grid gap-5 md:grid-cols-2">
                        {certifications.map(
                          (
                            certification,
                            index
                          ) => (
                            <CertificationCard
                              key={`certification-${index}`}
                              certification={
                                certification
                              }
                              index={index}
                            />
                          )
                        )}
                      </div>
                    </section>
                  )}

                  {/* CAREER PREPARATION */}

                  {Object.keys(
                    careerPreparation
                  ).length > 0 && (
                    <section className="mb-10">
                      <SectionHeader
                        icon={FaRocket}
                        title="Career Preparation"
                        description="Turn your learning into a job-ready professional profile."
                      />

                      <div className="grid gap-5 md:grid-cols-2">
                        {Object.entries(
                          careerPreparation
                        ).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="rounded-2xl border border-white/10 bg-[#0b1224] p-6 shadow-lg shadow-black/20"
                            >
                              <h3 className="mb-4 flex items-center gap-2 font-bold text-white">
                                <FaCheckCircle className="text-blue-400" />
                                {prettyLabel(key)}
                              </h3>

                              {Array.isArray(
                                value
                              ) ? (
                                <ValueList
                                  value={value}
                                />
                              ) : isObject(
                                  value
                                ) ? (
                                <ObjectDetails
                                  value={value}
                                />
                              ) : (
                                <p className="text-sm leading-6 text-slate-400">
                                  {getString(
                                    value
                                  )}
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </section>
                  )}

                  {/* MILESTONES */}

                  {milestones.length > 0 && (
                    <section className="mb-10">
                      <SectionHeader
                        icon={FaTrophy}
                        title="Career Milestones"
                        description="Use these checkpoints to measure your progress."
                      />

                      <div className="space-y-4">
                        {milestones.map(
                          (milestone, index) => {
                            if (
                              !isObject(
                                milestone
                              )
                            ) {
                              return (
                                <div
                                  key={`milestone-${index}`}
                                  className="flex gap-4 rounded-2xl border border-white/10 bg-[#0b1224] p-5 shadow-lg shadow-black/20"
                                >
                                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400">
                                    <FaTrophy />
                                  </div>

                                  <div>
                                    <h3 className="font-bold text-white">
                                      Milestone{" "}
                                      {index + 1}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                      {getString(
                                        milestone
                                      )}
                                    </p>
                                  </div>
                                </div>
                              );
                            }

                            const title =
                              getString(
                                milestone.milestone
                              ) ||
                              getString(
                                milestone.title
                              ) ||
                              getString(
                                milestone.name
                              ) ||
                              `Milestone ${
                                index + 1
                              }`;

                            const timeframe =
                              getString(
                                milestone.timeframe
                              ) ||
                              getString(
                                milestone.duration
                              );

                            const criteria =
                              getStringArray(
                                milestone.successCriteria
                              );

                            return (
                              <div
                                key={`milestone-${index}`}
                                className="flex gap-4 rounded-2xl border border-white/10 bg-[#0b1224] p-5 shadow-lg shadow-black/20"
                              >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400">
                                  <FaTrophy />
                                </div>

                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h3 className="font-bold text-white">
                                      {title}
                                    </h3>

                                    {timeframe && (
                                      <span className="rounded-full border border-white/10 bg-[#050b18] px-3 py-1 text-xs font-semibold text-slate-400">
                                        {timeframe}
                                      </span>
                                    )}
                                  </div>

                                  {criteria.length >
                                  0 ? (
                                    <div className="mt-3">
                                      <ValueList
                                        value={
                                          criteria
                                        }
                                      />
                                    </div>
                                  ) : (
                                    <div className="mt-3">
                                      <ObjectDetails
                                        value={
                                          milestone
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </section>
                  )}

                  {/* NEXT STEPS */}

                  {nextSteps.length > 0 && (
                    <section className="mb-10">
                      <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-6 text-white shadow-xl shadow-blue-950/30 sm:p-8">
                        <div className="mb-6 flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                            <FaLightbulb />
                          </div>

                          <div>
                            <h2 className="text-2xl font-bold">
                              Your Next Steps
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-blue-100">
                              Start with these actions
                              instead of trying to do
                              everything at once.
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-3">
                          {nextSteps.map(
                            (step, index) => (
                              <div
                                key={`${step}-${index}`}
                                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/10 p-4"
                              >
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-600">
                                  {index + 1}
                                </span>

                                <p className="text-sm leading-6 text-white">
                                  {step}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* UNKNOWN FALLBACK */}

                  {!hasStructuredRoadmap && (
                    <section className="mb-10">
                      <div className="rounded-2xl border border-white/10 bg-[#0b1224] p-6 shadow-lg shadow-black/20">
                        <SectionHeader
                          icon={FaRoad}
                          title="Your Roadmap"
                          description="Your personalized roadmap has been generated successfully."
                        />

                        <ObjectDetails
                          value={roadmap}
                        />
                      </div>
                    </section>
                  )}

                  {/* GENERATE AGAIN */}

                  <div className="mb-12 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#0b1224] p-8 text-center shadow-xl shadow-black/20">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400">
                      <FaRocket />
                    </div>

                    <h3 className="text-xl font-bold text-white">
                      Want to refine your career direction?
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                      Update your profile information and
                      generate a new roadmap whenever your
                      goals, skills or experience change.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        document
                          .getElementById(
                            "roadmap-form"
                          )
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-cyan-400"
                    >
                      Generate Updated Roadmap
                      <FaArrowRight />
                    </button>
                  </div>
                </>
              ) : (
                /* =================================================
                   UNSUBSCRIBED PREVIEW
                ================================================= */

                <>
                  {/* SMALL PREVIEW */}

                  <section className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          Roadmap Preview
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                          Here is a small preview of your personalized roadmap.
                        </p>
                      </div>

                      {checkingSubscription && (
                        <span className="text-xs font-semibold text-slate-500">
                          Checking subscription...
                        </span>
                      )}
                    </div>

                    {/* CAREER OVERVIEW PREVIEW */}

                    {careerOverview && (
                      <div className="mb-5 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6">
                        <SectionHeader
                          icon={FaBullseye}
                          title="Career Overview"
                          description="A preview of your personalized career direction."
                        />

                        <p className="text-sm leading-7 text-blue-100">
                          {careerOverview}
                        </p>
                      </div>
                    )}

                    {/* CURRENT STRENGTHS ONLY */}

                    {strengths.length > 0 && (
                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
                        <SectionHeader
                          icon={FaTools}
                          title="Current Strengths"
                          description="A small preview of the strengths identified from your profile."
                        />

                        <ValueList
                          value={strengths.slice(0, 3)}
                          emptyText="No strengths available."
                        />

                        {strengthsAreFromProfile && (
                          <div className="mt-4 rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-3">
                            <p className="text-xs leading-5 text-emerald-200/70">
                              These strengths are based on the
                              skills you provided.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </section>

                  {/* =================================================
                      LOCKED / BLURRED CONTENT
                  ================================================= */}

                  <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1224]">
                    <div className="pointer-events-none select-none max-h-[700px] overflow-hidden p-6 sm:p-8">
                      <div className="space-y-10 blur-[7px] opacity-50">

                        {/* SKILL ASSESSMENT - LOCKED */}

                        {(skillGaps.length > 0 ||
                          prioritySkills.length > 0) && (
                          <section>
                            <SectionHeader
                              icon={FaTools}
                              title="Skill Assessment"
                              description="Understand your skill gaps and priority skills."
                            />

                            <div className="grid gap-5 md:grid-cols-2">
                              {skillGaps.length > 0 && (
                                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6">
                                  <h3 className="mb-4 font-bold text-amber-300">
                                    Skill Gaps
                                  </h3>

                                  <ValueList
                                    value={skillGaps}
                                  />
                                </div>
                              )}

                              {prioritySkills.length > 0 && (
                                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6">
                                  <h3 className="mb-4 font-bold text-blue-300">
                                    Priority Skills
                                  </h3>

                                  <ValueList
                                    value={prioritySkills}
                                  />
                                </div>
                              )}
                            </div>
                          </section>
                        )}

                        {/* ROADMAP PHASES */}

                        {phases.length > 0 && (
                          <section>
                            <SectionHeader
                              icon={FaRoad}
                              title="Roadmap Phases"
                              description="Your personalized progression plan."
                            />

                            <div className="space-y-5">
                              {phases
                                .slice(0, 4)
                                .map(
                                  (
                                    phase,
                                    index
                                  ) => (
                                    <RoadmapPhaseCard
                                      key={`locked-phase-${index}`}
                                      phase={phase}
                                      index={index}
                                    />
                                  )
                                )}
                            </div>
                          </section>
                        )}

                        {/* LEARNING PLAN */}

                        {Object.keys(
                          learningPlan
                        ).length > 0 && (
                          <section>
                            <SectionHeader
                              icon={FaGraduationCap}
                              title="Weekly Learning Plan"
                              description="Your personalized weekly learning schedule."
                            />

                            <div className="rounded-2xl border border-white/10 bg-[#0b1224] p-6">
                              <ObjectDetails
                                value={
                                  learningPlan
                                }
                              />
                            </div>
                          </section>
                        )}

                        {/* PROJECTS */}

                        {projects.length > 0 && (
                          <section>
                            <SectionHeader
                              icon={FaBriefcase}
                              title="Projects & Experience"
                              description="Practical projects recommended for your career path."
                            />

                            <div className="grid gap-5 md:grid-cols-2">
                              {projects
                                .slice(0, 4)
                                .map(
                                  (
                                    project,
                                    index
                                  ) => (
                                    <ProjectCard
                                      key={`locked-project-${index}`}
                                      project={
                                        project
                                      }
                                      index={
                                        index
                                      }
                                    />
                                  )
                                )}
                            </div>
                          </section>
                        )}

                        {/* CERTIFICATIONS */}

                        {certifications.length >
                          0 && (
                          <section>
                            <SectionHeader
                              icon={FaCertificate}
                              title="Recommended Certifications"
                              description="Certifications selected for your career direction."
                            />

                            <div className="grid gap-5 md:grid-cols-2">
                              {certifications
                                .slice(0, 4)
                                .map(
                                  (
                                    certification,
                                    index
                                  ) => (
                                    <CertificationCard
                                      key={`locked-certification-${index}`}
                                      certification={
                                        certification
                                      }
                                      index={
                                        index
                                      }
                                    />
                                  )
                                )}
                            </div>
                          </section>
                        )}

                        {/* CAREER PREPARATION */}

                        {Object.keys(
                          careerPreparation
                        ).length > 0 && (
                          <section>
                            <SectionHeader
                              icon={FaRocket}
                              title="Career Preparation"
                              description="Your job-readiness preparation plan."
                            />

                            <div className="grid gap-5 md:grid-cols-2">
                              {Object.entries(
                                careerPreparation
                              ).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="rounded-2xl border border-white/10 bg-[#0b1224] p-6"
                                  >
                                    <h3 className="mb-4 font-bold text-white">
                                      {prettyLabel(
                                        key
                                      )}
                                    </h3>

                                    {Array.isArray(
                                      value
                                    ) ? (
                                      <ValueList
                                        value={
                                          value
                                        }
                                      />
                                    ) : isObject(
                                        value
                                      ) ? (
                                      <ObjectDetails
                                        value={
                                          value
                                        }
                                      />
                                    ) : (
                                      <p className="text-sm leading-6 text-slate-400">
                                        {getString(
                                          value
                                        )}
                                      </p>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </section>
                        )}

                        {/* MILESTONES */}

                        {milestones.length >
                          0 && (
                          <section>
                            <SectionHeader
                              icon={FaTrophy}
                              title="Career Milestones"
                              description="Your career progress checkpoints."
                            />

                            <div className="space-y-4">
                              {milestones
                                .slice(0, 4)
                                .map(
                                  (
                                    milestone,
                                    index
                                  ) => (
                                    <div
                                      key={`locked-milestone-${index}`}
                                      className="rounded-2xl border border-white/10 bg-[#0b1224] p-5"
                                    >
                                      <h3 className="font-bold text-white">
                                        Milestone{" "}
                                        {index +
                                          1}
                                      </h3>

                                      <ObjectDetails
                                        value={
                                          milestone
                                        }
                                      />
                                    </div>
                                  )
                                )}
                            </div>
                          </section>
                        )}

                        {/* NEXT STEPS */}

                        {nextSteps.length > 0 && (
                          <section>
                            <SectionHeader
                              icon={FaLightbulb}
                              title="Your Next Steps"
                              description="Actions to help you move forward."
                            />

                            <ValueList
                              value={nextSteps}
                            />
                          </section>
                        )}
                      </div>
                    </div>

                    {/* LOCK OVERLAY */}

                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45 backdrop-blur-[1px]">
                      <div className="mx-4 max-w-md rounded-3xl border border-blue-400/20 bg-[#07111f]/95 p-7 text-center shadow-2xl shadow-black/50">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10 text-blue-400">
                          <FaLockIcon />
                        </div>

                        <h3 className="text-xl font-bold text-white">
                          Full Career Roadmap Locked
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                          You can see a small preview of your
                          personalized roadmap above. Subscribe
                          to unlock the complete roadmap,
                          learning plan, projects,
                          certifications and career preparation.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            setShowSubscriptionModal(
                              true
                            )
                          }
                          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-cyan-400"
                        >
                          <FaRocket />
                          Unlock Full Roadmap
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* GENERATE AGAIN */}

                  <div className="mt-10 mb-12 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#0b1224] p-8 text-center shadow-xl shadow-black/20">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400">
                      <FaRocket />
                    </div>

                    <h3 className="text-xl font-bold text-white">
                      Want to refine your career direction?
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                      Update your profile information and
                      generate a new roadmap whenever your
                      goals, skills or experience change.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        document
                          .getElementById(
                            "roadmap-form"
                          )
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-cyan-400"
                    >
                      Generate Updated Roadmap
                      <FaArrowRight />
                    </button>
                  </div>
                </>
              )}

              {/* INFORMATION SECTION */}

              {isSubscribed && (
                <section className="rounded-3xl border border-white/10 bg-[#0b1224] p-6 shadow-xl shadow-black/20 sm:p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      What Your Career Roadmap Includes
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                      CareerPilot turns your profile into an
                      actionable career development plan
                      rather than giving you generic career
                      advice.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {[
                      {
                        icon: FaBullseye,
                        title: "Career Direction",
                        description:
                          "A clear direction based on your target role and current position.",
                      },
                      {
                        icon: FaTools,
                        title: "Skill Development",
                        description:
                          "Identify important skills and prioritize what to learn next.",
                      },
                      {
                        icon: FaBriefcase,
                        title: "Real Projects",
                        description:
                          "Build practical projects that demonstrate your capabilities.",
                      },
                      {
                        icon: FaRocket,
                        title: "Career Preparation",
                        description:
                          "Prepare your resume, portfolio, interviews and job search strategy.",
                      },
                    ].map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.title}
                          className="rounded-2xl border border-white/5 bg-[#050b18] p-5"
                        >
                          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                            <Icon />
                          </div>

                          <h3 className="font-bold text-white">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {item.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </section>
          </>
        )}

        {/* FOOTER NAVIGATION */}

        <div className="mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-cyan-400"
          >
            <FaArrowLeft />
            Go Back
          </button>
        </div>
      </main>

      {/* SUBSCRIPTION MODAL */}

      {showSubscriptionModal && !isSubscribed && (
        <SubscriptionModal
          featureName="Career Roadmap"
          onClose={handleSubscriptionClose}
        />
      )}
    </div>
  );
}

/* =========================================================
   SMALL LOCK ICON
========================================================= */

function FaLockIcon() {
  return (
    <span
      aria-hidden="true"
      className="text-lg"
    >
      🔒
    </span>
  );
}