import { useRef, useState } from "react";
import {
  FaCloudUploadAlt,
  FaFileAlt,
  FaChartLine,
  FaRobot,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCrown,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  canUseFeature,
  isSubscribed,
  markFeatureUsed,
} from "../utils/subscription";

interface ResumeAnalysis {
  atsScore: number;
  wordCount: number;
  pages: number;
  skills: string[];
  keywords: string[];
  suggestions: string[];
}

interface UploadResponse {
  success: boolean;
  message: string;
  file?: {
    originalName: string;
    filename: string;
    size: number;
    path: string;
  };
  analysis?: ResumeAnalysis | null;
}

interface ResumeData {
  uploaded: boolean;
  fileName: string;
  score: number | null;
  atsScore: number | null;
  skills: string[];
  keywords: string[];
  wordCount: number;
  pages: number;
}

function ResumeAnalyzer() {
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] =
    useState<ResumeAnalysis | null>(null);
  const [fileName, setFileName] = useState("");
  const [uploaded, setUploaded] = useState(false);

  // =========================================================
  // HANDLE RESUME UPLOAD
  // =========================================================

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // =======================================================
    // SUBSCRIPTION CHECK
    // =======================================================

    if (!canUseFeature("resumeAnalyzer")) {
      e.target.value = "";

      navigate("/subscription");

      return;
    }

    // Reset state
    setError("");
    setAnalysis(null);
    setFileName("");
    setUploaded(false);

    // =======================================================
    // PDF VALIDATION
    // =======================================================

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Please upload a PDF file only.");
      e.target.value = "";
      return;
    }

    // =======================================================
    // FILE SIZE
    // =======================================================

    const maxFileSize = 10 * 1024 * 1024;

    if (file.size > maxFileSize) {
      setError("File size must be less than 10 MB.");
      e.target.value = "";
      return;
    }

    setFileName(file.name);

    // =======================================================
    // FORM DATA
    // =======================================================

    const formData = new FormData();

    formData.append("resume", file);

    // =======================================================
    // UPLOAD
    // =======================================================

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/resume/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      let data: UploadResponse;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Backend returned an invalid response. Please check the backend server."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Resume processing failed."
        );
      }

      // =======================================================
      // SUCCESS
      // =======================================================

      setUploaded(true);

      /*
       * IMPORTANT:
       * Only mark the free attempt as used after
       * successful backend upload.
       *
       * Subscribers don't need usage tracking.
       */

      if (!isSubscribed()) {
        markFeatureUsed("resumeAnalyzer");
      }

      // =======================================================
      // NO ANALYSIS
      // =======================================================

      if (!data.analysis) {
        const resumeData: ResumeData = {
          uploaded: true,
          fileName: file.name,
          score: null,
          atsScore: null,
          skills: [],
          keywords: [],
          wordCount: 0,
          pages: 0,
        };

        localStorage.setItem(
          "resumeData",
          JSON.stringify(resumeData)
        );

        window.dispatchEvent(
          new Event("resumeDataUpdated")
        );

        setError(
          "Resume uploaded successfully, but analysis is not available yet."
        );

        return;
      }

      // =======================================================
      // CLEAN ANALYSIS
      // =======================================================

      const receivedAnalysis = data.analysis;

      const cleanedAnalysis: ResumeAnalysis = {
        atsScore:
          typeof receivedAnalysis.atsScore === "number"
            ? receivedAnalysis.atsScore
            : 0,

        wordCount:
          typeof receivedAnalysis.wordCount === "number"
            ? receivedAnalysis.wordCount
            : 0,

        pages:
          typeof receivedAnalysis.pages === "number"
            ? receivedAnalysis.pages
            : 0,

        skills: Array.isArray(receivedAnalysis.skills)
          ? receivedAnalysis.skills
          : [],

        keywords: Array.isArray(receivedAnalysis.keywords)
          ? receivedAnalysis.keywords
          : [],

        suggestions: Array.isArray(
          receivedAnalysis.suggestions
        )
          ? receivedAnalysis.suggestions
          : [],
      };

      setAnalysis(cleanedAnalysis);

      // =======================================================
      // SAVE RESUME DATA
      // =======================================================

      const resumeData: ResumeData = {
        uploaded: true,
        fileName: file.name,
        score: cleanedAnalysis.atsScore,
        atsScore: cleanedAnalysis.atsScore,
        skills: cleanedAnalysis.skills,
        keywords: cleanedAnalysis.keywords,
        wordCount: cleanedAnalysis.wordCount,
        pages: cleanedAnalysis.pages,
      };

      localStorage.setItem(
        "resumeData",
        JSON.stringify(resumeData)
      );

      window.dispatchEvent(
        new Event("resumeDataUpdated")
      );

      setError("");
    } catch (err) {
      console.error(
        "Resume processing error:",
        err
      );

      setUploaded(false);
      setAnalysis(null);

      if (
        err instanceof TypeError &&
        err.message.toLowerCase().includes("fetch")
      ) {
        setError(
          "Unable to connect to the CareerPilot backend. Please make sure the backend is running on http://localhost:5000."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Resume processing failed. Please try again."
        );
      }
    } finally {
      setLoading(false);

      e.target.value = "";
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">

      <div className="relative min-h-screen overflow-hidden">

        {/* Background */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute right-1/4 top-40 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
        </div>

        <section className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          {/* Header */}

          <div className="mx-auto max-w-4xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400">
              <FaRobot />
              AI Powered Resume Analysis
            </div>

            <h1 className="mt-7 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Build an{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-violet-500 bg-clip-text text-transparent">
                Interview Winning Resume
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
              Upload your resume and receive an ATS compatibility
              analysis, keyword detection, skills analysis and
              actionable improvement suggestions.
            </p>

          </div>

          {/* Upload Card */}

          <div className="mx-auto mt-12 max-w-4xl">

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-10 md:p-12">

              <div className="flex justify-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-900/20">
                  <FaFileAlt className="text-4xl text-blue-400" />
                </div>

              </div>

              <h2 className="mt-7 text-2xl font-bold sm:text-3xl">
                Upload your resume
              </h2>

              <p className="mt-3 text-sm text-slate-400 sm:text-base">
                PDF format only • Maximum file size 10 MB
              </p>

              {/* Free-use notice */}

              {!isSubscribed() && (
                <div className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
                  <FaCrown />
                  You have 1 free Resume Analyzer attempt.
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleUpload}
                className="hidden"
              />

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="mt-8 inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/30 transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:px-10"
              >
                <FaCloudUploadAlt className="text-lg" />

                {loading
                  ? "Processing..."
                  : "Upload Resume"}
              </button>

              {/* Selected file */}

              {fileName && (
                <div className="mx-auto mt-7 flex max-w-xl items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm">

                  <FaFileAlt className="flex-shrink-0 text-blue-400" />

                  <span className="text-slate-500">
                    Selected:
                  </span>

                  <span className="break-all font-medium text-blue-400">
                    {fileName}
                  </span>

                </div>
              )}

              {/* Success */}

              {uploaded && !loading && !error && (
                <div className="mt-8 flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-5 text-left">

                  <FaCheckCircle className="mt-1 flex-shrink-0 text-green-400" />

                  <div>
                    <p className="font-semibold text-green-300">
                      Resume uploaded successfully
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Your resume has been uploaded and analyzed successfully.
                    </p>
                  </div>

                </div>
              )}

              {/* Error */}

              {error && (
                <div className={`mt-8 flex items-start gap-3 rounded-2xl border p-5 text-left ${
                  uploaded
                    ? "border-yellow-500/20 bg-yellow-500/10"
                    : "border-red-500/20 bg-red-500/10"
                }`}>

                  <FaExclamationTriangle
                    className={`mt-1 flex-shrink-0 ${
                      uploaded
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  />

                  <div>

                    <p className={`font-semibold ${
                      uploaded
                        ? "text-yellow-300"
                        : "text-red-300"
                    }`}>
                      {uploaded
                        ? "Analysis Status"
                        : "Upload Failed"}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {error}
                    </p>

                  </div>

                </div>
              )}

            </div>

          </div>

          {/* Analysis */}

          {analysis && (
            <div className="mx-auto mt-14 max-w-6xl pb-10">

              <div className="mb-7 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                  <FaCheckCircle className="text-green-400" />
                </div>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  Resume Analysis
                </h2>

              </div>

              {/* Stats */}

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                    <FaChartLine className="text-xl text-blue-400" />
                  </div>

                  <p className="mt-4 text-sm text-slate-400">
                    ATS Score
                  </p>

                  <p className="mt-2 text-4xl font-bold text-blue-400">
                    {analysis.atsScore}%
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10">
                    <FaFileAlt className="text-xl text-purple-400" />
                  </div>

                  <p className="mt-4 text-sm text-slate-400">
                    Pages
                  </p>

                  <p className="mt-2 text-4xl font-bold">
                    {analysis.pages}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
                    <span className="text-lg font-bold text-green-400">
                      Aa
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-slate-400">
                    Words
                  </p>

                  <p className="mt-2 text-4xl font-bold">
                    {analysis.wordCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
                    <FaRobot className="text-xl text-cyan-400" />
                  </div>

                  <p className="mt-4 text-sm text-slate-400">
                    Skills Found
                  </p>

                  <p className="mt-2 text-4xl font-bold">
                    {analysis.skills.length}
                  </p>
                </div>

              </div>

              {/* Skills + Keywords */}

              <div className="mt-8 grid gap-8 md:grid-cols-2">

                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">

                  <h3 className="text-xl font-bold sm:text-2xl">
                    Detected Skills
                  </h3>

                  <div className="mt-5 flex flex-wrap gap-2">

                    {analysis.skills.length > 0 ? (
                      analysis.skills.map(
                        (skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300"
                          >
                            {skill}
                          </span>
                        )
                      )
                    ) : (
                      <p className="text-slate-400">
                        No technical skills detected.
                      </p>
                    )}

                  </div>

                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">

                  <h3 className="text-xl font-bold sm:text-2xl">
                    Resume Keywords
                  </h3>

                  <div className="mt-5 flex flex-wrap gap-2">

                    {analysis.keywords.length > 0 ? (
                      analysis.keywords.map(
                        (keyword, index) => (
                          <span
                            key={`${keyword}-${index}`}
                            className="rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300"
                          >
                            {keyword}
                          </span>
                        )
                      )
                    ) : (
                      <p className="text-slate-400">
                        No keywords detected yet.
                      </p>
                    )}

                  </div>

                </div>

              </div>

              {/* Suggestions */}

              <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">

                <h3 className="text-xl font-bold sm:text-2xl">
                  AI-Ready Improvement Suggestions
                </h3>

                <div className="mt-5 space-y-4">

                  {analysis.suggestions.length > 0 ? (
                    analysis.suggestions.map(
                      (suggestion, index) => (
                        <div
                          key={index}
                          className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                        >
                          <span className="font-bold text-blue-400">
                            {index + 1}.
                          </span>

                          <p className="leading-6 text-slate-300">
                            {suggestion}
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-slate-400">
                      No improvement suggestions available yet.
                    </p>
                  )}

                </div>

              </div>

            </div>
          )}

        </section>

      </div>

    </div>
  );
}

export default ResumeAnalyzer;