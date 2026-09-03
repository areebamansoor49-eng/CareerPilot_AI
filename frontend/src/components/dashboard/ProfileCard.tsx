import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaFileAlt,
  FaGraduationCap,
  FaChartLine,
} from "react-icons/fa";

interface ResumeData {
  uploaded?: boolean;
  fileName?: string;
  score?: number | null;
  atsScore?: number | null;
  skills?: string[];
  keywords?: string[];
  wordCount?: number;
  pages?: number;
}

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

function ProfileCard() {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [resumeData, setResumeData] =
    useState<ResumeData | null>(null);

  // ==========================================
  // LOAD USER + RESUME DATA
  // ==========================================

  useEffect(() => {
    const loadData = () => {
      const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      const storedResume = JSON.parse(
        localStorage.getItem("resumeData") || "null"
      );

      setUser(storedUser);
      setResumeData(storedResume);
    };

    // Initial load
    loadData();

    // Listen for ResumeAnalyzer updates
    window.addEventListener(
      "resumeDataUpdated",
      loadData
    );

    return () => {
      window.removeEventListener(
        "resumeDataUpdated",
        loadData
      );
    };
  }, []);

  if (!user) return null;

  // ==========================================
  // DYNAMIC RESUME DATA
  // ==========================================

  const hasResume =
    resumeData?.uploaded === true;

  const atsScore =
    typeof resumeData?.atsScore === "number"
      ? resumeData.atsScore
      : typeof resumeData?.score === "number"
      ? resumeData.score
      : null;

  const skills = Array.isArray(resumeData?.skills)
    ? resumeData.skills
    : [];

  // ==========================================
  // PROFILE COMPLETION
  // ==========================================

  const profileCompletion = hasResume
    ? skills.length > 0
      ? Math.min(
          100,
          50 + Math.min(skills.length * 5, 50)
        )
      : 50
    : 0;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">

      {/* ==========================================
          COVER
      ========================================== */}

      <div className="h-28 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600"></div>

      {/* ==========================================
          AVATAR
      ========================================== */}

      <div className="-mt-14 flex justify-center">
        <img
          src={user.picture}
          alt={user.name}
          className="h-28 w-28 rounded-full border-[5px] border-slate-900 object-cover"
        />
      </div>

      {/* ==========================================
          USER INFO
      ========================================== */}

      <div className="px-6 pb-8">

        <div className="mt-4 text-center">

          <div className="flex items-center justify-center gap-2">

            <h2 className="text-2xl font-bold text-white">
              {user.name}
            </h2>

            <FaCheckCircle className="text-blue-400" />

          </div>

          <p className="mt-2 break-all text-slate-400">
            {user.email}
          </p>

        </div>

        {/* ==========================================
            STATS
        ========================================== */}

        <div className="mt-8 grid grid-cols-3 gap-3">

          {/* RESUME */}

          <div className="rounded-2xl bg-slate-800 p-4 text-center">

            <FaFileAlt className="mx-auto text-xl text-blue-400" />

            <p className="mt-2 text-2xl font-bold text-white">
              {hasResume ? "1" : "0"}
            </p>

            <p className="text-xs text-slate-400">
              Resume
            </p>

          </div>

          {/* PROFILE */}

          <div className="rounded-2xl bg-slate-800 p-4 text-center">

            <FaGraduationCap className="mx-auto text-xl text-green-400" />

            <p className="mt-2 text-2xl font-bold text-white">
              {profileCompletion}%
            </p>

            <p className="text-xs text-slate-400">
              Profile
            </p>

          </div>

          {/* ATS */}

          <div className="rounded-2xl bg-slate-800 p-4 text-center">

            <FaChartLine className="mx-auto text-xl text-purple-400" />

            <p className="mt-2 text-2xl font-bold text-white">
              {atsScore !== null
                ? `${atsScore}%`
                : "--"}
            </p>

            <p className="text-xs text-slate-400">
              ATS
            </p>

          </div>

        </div>

        {/* ==========================================
            PROFILE COMPLETION
        ========================================== */}

        <div className="mt-8">

          <div className="mb-2 flex justify-between">

            <span className="text-slate-400">
              Profile Completion
            </span>

            <span className="font-semibold text-blue-400">
              {profileCompletion}%
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
              style={{
                width: `${profileCompletion}%`,
              }}
            ></div>

          </div>

        </div>

        {/* ==========================================
            RESUME STATUS
        ========================================== */}

        {hasResume ? (

          <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-4">

            <div className="flex items-start gap-3">

              <FaCheckCircle className="mt-1 flex-shrink-0 text-green-400" />

              <div className="min-w-0">

                <p className="font-semibold text-green-300">
                  Resume Uploaded
                </p>

                <p className="mt-1 break-all text-sm text-slate-400">
                  {resumeData?.fileName ||
                    "Resume successfully uploaded."}
                </p>

                {atsScore !== null && (
                  <p className="mt-2 font-medium text-green-400">
                    ATS Score: {atsScore}%
                  </p>
                )}

              </div>

            </div>

          </div>

        ) : (

          <div className="mt-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">

            <p className="font-semibold text-white">
              No Resume Uploaded
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Upload your PDF resume to generate your
              ATS score, skills analysis and AI
              recommendations.
            </p>

          </div>

        )}

        {/* ==========================================
            SKILLS
        ========================================== */}

        <div className="mt-8">

          <h3 className="mb-3 font-semibold text-white">
            Skills
          </h3>

          {skills.length > 0 ? (

            <div className="flex flex-wrap gap-2">

              {skills
                .slice(0, 8)
                .map((skill, index) => (

                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-300"
                  >
                    {skill}
                  </span>

                ))}

            </div>

          ) : (

            <p className="text-slate-400">
              No skills detected yet.
            </p>

          )}

        </div>

        {/* ==========================================
            ACCOUNT STATUS
        ========================================== */}

        <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-4">

          <div className="flex items-center gap-3">

            <FaCheckCircle className="text-green-400" />

            <div>

              <p className="font-semibold text-white">
                Google Account Verified
              </p>

              <p className="text-sm text-slate-400">
                Your account is securely connected.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProfileCard;