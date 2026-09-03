import { useState } from "react";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaClock,
  FaSearch,
  FaExternalLinkAlt,
  FaBriefcase,
  FaMoneyBillWave,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

interface Job {
  id: string | number;
  title: string;
  company: string;
  location: string;
  description: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryIsPredicted: boolean;
  contractType: string | null;
  contractTime: string | null;
  category: string | null;
  created: string | null;
  redirectUrl: string;
  source: string;
}

interface JobsResponse {
  success: boolean;
  count: number;
  jobs: Job[];
  message?: string;
}

function OpportunityFinder() {
  const [search, setSearch] = useState("jobs");
  const [location, setLocation] = useState("");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const resultsPerPage = 20;

  // =========================================================
  // FETCH OPPORTUNITIES
  // =========================================================

  const fetchJobs = async (
    currentPage: number,
    currentSearch: string,
    currentLocation: string
  ) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set(
        "query",
        currentSearch.trim() || "jobs"
      );

      if (currentLocation.trim()) {
        params.set(
          "location",
          currentLocation.trim()
        );
      }

      params.set(
        "page",
        String(currentPage)
      );

      const url = `http://localhost:5000/api/jobs/search?${params.toString()}`;

      const response = await fetch(url);

      let data: JobsResponse;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Backend returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to fetch opportunities."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Opportunity search failed."
        );
      }

      setJobs(
        Array.isArray(data.jobs)
          ? data.jobs
          : []
      );

      setTotalJobs(
        data.count || 0
      );

      setPage(currentPage);
      setHasSearched(true);
    } catch (err) {
      console.error(
        "Opportunity search error:",
        err
      );

      setJobs([]);
      setTotalJobs(0);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while finding opportunities."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // NEW SEARCH
  // OPPORTUNITY FINDER = COMPLETELY FREE & UNLIMITED
  // =========================================================

  const handleSearch = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!search.trim()) {
      setError(
        "Please enter a job title, skill or keyword."
      );
      return;
    }

    // No subscription check.
    // No usage limit.
    // No feature tracking.
    // Opportunity Finder is completely free.

    fetchJobs(
      1,
      search,
      location
    );
  };

  // =========================================================
  // SALARY
  // =========================================================

  const formatSalary = (
    job: Job
  ) => {
    const min = job.salaryMin;
    const max = job.salaryMax;

    if (
      min == null &&
      max == null
    ) {
      return "Salary not specified";
    }

    if (
      min != null &&
      max != null
    ) {
      return `${min.toLocaleString()} - ${max.toLocaleString()}`;
    }

    if (min != null) {
      return `From ${min.toLocaleString()}`;
    }

    if (max != null) {
      return `Up to ${max.toLocaleString()}`;
    }

    return "Salary not specified";
  };

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (
    date: string | null
  ) => {
    if (!date) {
      return "Recently posted";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Recently posted";
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // DESCRIPTION
  // =========================================================

  const shortenDescription = (
    description: string
  ) => {
    if (!description) {
      return "No opportunity description available.";
    }

    const cleanText =
      description
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();

    if (
      cleanText.length <= 180
    ) {
      return cleanText;
    }

    return `${cleanText.substring(
      0,
      180
    )}...`;
  };

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.ceil(
    totalJobs / resultsPerPage
  );

  const nextPage = () => {
    if (page < totalPages) {
      fetchJobs(
        page + 1,
        search,
        location
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const previousPage = () => {
    if (page > 1) {
      fetchJobs(
        page - 1,
        search,
        location
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen w-full bg-[#020617] text-white">

      <div className="relative overflow-hidden">

        {/* Background */}

        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="pointer-events-none absolute top-96 -left-40 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="pointer-events-none absolute top-[900px] -right-40 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

        <section className="relative mx-auto max-w-7xl px-6 py-16">

          {/* HERO */}

          <div className="mx-auto max-w-5xl text-center">

            <div className="font-semibold tracking-wide text-blue-400">
              AI OPPORTUNITY FINDER
            </div>

            <h1 className="mt-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
              Find Opportunities That Match Your Skills
            </h1>

            <p className="mt-6 text-xl text-slate-400">
              Discover jobs, internships and career opportunities
              based on your skills, interests and career goals.
            </p>

            <p className="mt-4 text-sm font-medium text-cyan-400">
              🌎 Worldwide opportunities • 100% Free • Unlimited Searches
            </p>

          </div>

          {/* SEARCH */}

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 max-w-5xl"
          >

            <div className="grid gap-4 md:grid-cols-[1fr_0.7fr_auto]">

              {/* SEARCH INPUT */}

              <div className="flex items-center rounded-2xl bg-white px-5 shadow-xl">

                <FaSearch className="mr-3 shrink-0 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setError("");
                  }}
                  placeholder="Job title, skills or keywords..."
                  className="w-full bg-transparent py-5 text-lg text-black outline-none placeholder:text-slate-400"
                />

              </div>

              {/* LOCATION */}

              <div className="flex items-center rounded-2xl bg-white px-5 shadow-xl">

                <FaMapMarkerAlt className="mr-3 shrink-0 text-slate-400" />

                <input
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setError("");
                  }}
                  placeholder="City, country or worldwide"
                  className="w-full bg-transparent py-5 text-lg text-black outline-none placeholder:text-slate-400"
                />

              </div>

              {/* SEARCH BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-5 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-600 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Searching..."
                  : "Find Opportunities"}
              </button>

            </div>

            {!location.trim() && (
              <p className="mt-4 text-center text-sm text-cyan-400">
                🌎 Worldwide search enabled — leave location blank
                to search across available markets.
              </p>
            )}

          </form>

          {/* ERROR */}

          {error && (
            <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-5 text-red-300">

              <p className="font-semibold">
                Opportunity search failed
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>

            </div>
          )}

          {/* SUMMARY */}

          {hasSearched &&
            !loading &&
            !error && (
              <div className="mt-16 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                  <h2 className="text-3xl font-bold">
                    Career Opportunities
                  </h2>

                  <p className="mt-2 text-slate-400">

                    {totalJobs.toLocaleString()} opportunities found
                    for{" "}

                    <span className="text-blue-400">
                      {search}
                    </span>

                    {" in "}

                    <span className="text-cyan-400">
                      {location.trim() || "Worldwide"}
                    </span>

                  </p>

                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <FaBriefcase />
                  Real-time results
                </div>

              </div>
            )}

          {/* LOADING */}

          {loading && (
            <div className="mt-20 grid gap-8 md:grid-cols-3">

              {[1, 2, 3, 4, 5, 6].map(
                (item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-8"
                  >
                    <div className="h-12 w-12 rounded-xl bg-slate-800" />

                    <div className="mt-6 h-7 w-4/5 rounded bg-slate-800" />

                    <div className="mt-4 h-4 w-2/5 rounded bg-slate-800" />

                    <div className="mt-6 h-4 w-full rounded bg-slate-800" />

                    <div className="mt-3 h-4 w-5/6 rounded bg-slate-800" />

                    <div className="mt-8 h-10 rounded-xl bg-slate-800" />
                  </div>
                )
              )}

            </div>
          )}

          {/* OPPORTUNITY CARDS */}

          {!loading &&
            !error &&
            jobs.length > 0 && (
              <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="group flex flex-col rounded-3xl border border-white/10 bg-slate-900/60 p-7 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/50 hover:bg-slate-900/80"
                  >

                    <div className="flex items-start justify-between">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl text-blue-400">
                        <FaBuilding />
                      </div>

                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                        {job.source || "Opportunity Source"}
                      </span>

                    </div>

                    <h2 className="mt-6 text-xl font-bold leading-snug transition group-hover:text-blue-400">
                      {job.title}
                    </h2>

                    <p className="mt-3 font-medium text-blue-400">
                      {job.company || "Company not specified"}
                    </p>

                    <div className="mt-5 space-y-3 text-sm text-slate-400">

                      <p className="flex items-center gap-3">
                        <FaMapMarkerAlt className="shrink-0 text-blue-400" />
                        {job.location || "Location not specified"}
                      </p>

                      <p className="flex items-center gap-3">
                        <FaMoneyBillWave className="shrink-0 text-green-400" />
                        {formatSalary(job)}
                      </p>

                      <p className="flex items-center gap-3">
                        <FaClock className="shrink-0 text-purple-400" />
                        {formatDate(job.created)}
                      </p>

                    </div>

                    <p className="mt-6 text-sm leading-6 text-slate-400">
                      {shortenDescription(job.description)}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">

                      {job.category && (
                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                          {job.category}
                        </span>
                      )}

                      {job.contractTime && (
                        <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-300">
                          {job.contractTime.replace("_", " ")}
                        </span>
                      )}

                      {job.contractType && (
                        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                          {job.contractType}
                        </span>
                      )}

                    </div>

                    <div className="mt-auto pt-7">

                      <a
                        href={job.redirectUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02]"
                      >
                        View & Apply
                        <FaExternalLinkAlt className="text-sm" />
                      </a>

                    </div>

                  </div>
                ))}

              </div>
            )}

          {/* NO RESULTS */}

          {!loading &&
            !error &&
            hasSearched &&
            jobs.length === 0 && (
              <div className="mt-20 text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-3xl text-slate-500">
                  <FaBriefcase />
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                  No opportunities found
                </h2>

                <p className="mt-3 text-slate-400">
                  Try another job title, skill, internship,
                  or location.
                </p>

              </div>
            )}

          {/* PAGINATION */}

          {!loading &&
            !error &&
            jobs.length > 0 &&
            totalPages > 1 && (
              <div className="mt-14 flex items-center justify-center gap-5">

                <button
                  type="button"
                  onClick={previousPage}
                  disabled={page === 1}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-slate-300 transition hover:border-blue-500 hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaChevronLeft />
                  Previous
                </button>

                <span className="text-slate-400">
                  Page{" "}
                  <span className="font-semibold text-white">
                    {page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-white">
                    {totalPages}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={nextPage}
                  disabled={page >= totalPages}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-slate-300 transition hover:border-blue-500 hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <FaChevronRight />
                </button>

              </div>
            )}

          {/* Attribution */}

          {!loading &&
            jobs.length > 0 && (
              <div className="mt-12 text-center text-xs text-slate-500">
                Job listings provided by real job sources.
              </div>
            )}

        </section>

      </div>

    </div>
  );
}

export default OpportunityFinder;