const axios = require("axios");

// ======================================================
// SERPAPI GOOGLE JOBS SEARCH
// ======================================================

const searchSerpApiJobs = async ({
  query = "internship",
  location = "",
  page = 1,
  resultsPerPage = 20,
}) => {
  const apiKey = process.env.SERPAPI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "SERPAPI_API_KEY is missing from backend/.env"
    );
  }

  const cleanQuery =
    typeof query === "string" && query.trim()
      ? query.trim()
      : "internship";

  const cleanLocation =
    typeof location === "string"
      ? location.trim()
      : "";

  console.log("---------------------------------");
  console.log("SERPAPI GOOGLE JOBS");
  console.log("QUERY:", cleanQuery);
  console.log("LOCATION:", cleanLocation || "WORLDWIDE");
  console.log("PAGE:", page);
  console.log("---------------------------------");

  try {
    /*
      Google Jobs uses start for pagination.
      SerpAPI Google Jobs normally returns a limited
      number of results per request.
    */

    const start =
      Math.max(0, Number(page) - 1) * Number(resultsPerPage);

    const params = {
      engine: "google_jobs",

      q: cleanQuery,

      hl: "en",

      api_key: apiKey,

      start,
    };

    /*
      IMPORTANT:
      Do not send an empty location to SerpAPI.
      Empty location means Google can decide the location
      itself and may return unexpected countries.
    */

    if (cleanLocation) {
      params.location = cleanLocation;
    }

    const response = await axios.get(
      "https://serpapi.com/search.json",
      {
        params,
        timeout: 30000,
      }
    );

    const data = response.data || {};

    const jobs = Array.isArray(data.jobs_results)
      ? data.jobs_results
      : [];

    console.log(
      "SERPAPI TOTAL:",
      jobs.length
    );

    console.log(
      "SERPAPI RETURNED:",
      jobs.length
    );

    return {
      count: jobs.length,

      jobs: jobs.map(
        normalizeSerpApiJob
      ),
    };
  } catch (error) {
    console.error("---------------------------------");
    console.error("SERPAPI ERROR");
    console.error(
      "Status:",
      error.response?.status || "N/A"
    );
    console.error(
      "Response:",
      error.response?.data || error.message
    );
    console.error("---------------------------------");

    return {
      count: 0,
      jobs: [],
    };
  }
};

// ======================================================
// NORMALIZE SERPAPI JOB
// ======================================================

const normalizeSerpApiJob = (job) => {
  /*
    Google Jobs can provide location in different places.
    Prefer the main location field.
  */

  let detectedLocation =
    typeof job.location === "string"
      ? job.location.trim()
      : "";

  /*
    If Google does not provide job.location,
    try extensions.
  */

  if (!detectedLocation) {
    const extensions = Array.isArray(
      job.extensions
    )
      ? job.extensions
      : [];

    const locationExtension =
      extensions.find((item) => {
        if (
          typeof item !== "string"
        ) {
          return false;
        }

        const value =
          item.toLowerCase();

        return (
          value.includes("pakistan") ||
          value.includes(
            "united arab emirates"
          ) ||
          value.includes("uae") ||
          value.includes(
            "saudi arabia"
          ) ||
          value.includes("ksa") ||
          value.includes("india") ||
          value.includes(
            "united states"
          ) ||
          value.includes("usa") ||
          value.includes("canada") ||
          value.includes(
            "united kingdom"
          ) ||
          value.includes("uk")
        );
      });

    if (locationExtension) {
      detectedLocation =
        locationExtension;
    }
  }

  if (!detectedLocation) {
    detectedLocation =
      "Location not specified";
  }

  /*
    Google Jobs may expose application links
    in apply_options.
  */

  let redirectUrl = "";

  if (
    Array.isArray(
      job.apply_options
    ) &&
    job.apply_options.length > 0
  ) {
    redirectUrl =
      job.apply_options[0]?.link ||
      "";
  }

  if (!redirectUrl) {
    redirectUrl =
      job.share_link || "";
  }

  /*
    detected_extensions can contain schedule,
    posted time, etc.
  */

  const detectedExtensions =
    job.detected_extensions || {};

  const scheduleType =
    detectedExtensions.schedule_type ||
    null;

  const postedAt =
    detectedExtensions.posted_at ||
    null;

  return {
    id:
      `serpapi-${
        job.job_id ||
        `${job.title || "job"}-${Math.random()
          .toString(36)
          .substring(2, 10)}`
      }`,

    title:
      job.title ||
      "Untitled Position",

    company:
      job.company_name ||
      "Company not specified",

    location:
      detectedLocation,

    description:
      job.description ||
      "No description available.",

    salaryMin:
      null,

    salaryMax:
      null,

    salaryIsPredicted:
      false,

    contractType:
      scheduleType,

    contractTime:
      scheduleType,

    category:
      null,

    created:
      postedAt,

    redirectUrl,

    source:
      "Google Jobs",

    country:
      getCountryCode(
        detectedLocation
      ),
  };
};

// ======================================================
// COUNTRY DETECTOR
// ======================================================

const getCountryCode = (
  location = ""
) => {
  const value =
    String(location)
      .trim()
      .toLowerCase();

  // ---------------- PAKISTAN ----------------

  if (
    value.includes("pakistan") ||
    value.includes("karachi") ||
    value.includes("lahore") ||
    value.includes("islamabad") ||
    value.includes("rawalpindi") ||
    value.includes("faisalabad") ||
    value.includes("multan") ||
    value.includes("peshawar") ||
    value.includes("quetta") ||
    value.includes("sialkot") ||
    value.includes("gujranwala") ||
    value.includes("hyderabad")
  ) {
    return "PK";
  }

  // ---------------- UAE ----------------

  if (
    value.includes(
      "united arab emirates"
    ) ||
    value.includes("uae") ||
    value.includes("dubai") ||
    value.includes("abu dhabi") ||
    value.includes("sharjah") ||
    value.includes("ajman")
  ) {
    return "AE";
  }

  // ---------------- SAUDI ----------------

  if (
    value.includes(
      "saudi arabia"
    ) ||
    value.includes("ksa") ||
    value.includes("riyadh") ||
    value.includes("jeddah") ||
    value.includes("makkah") ||
    value.includes("madinah") ||
    value.includes("madina") ||
    value.includes("medina")
  ) {
    return "SA";
  }

  // ---------------- INDIA ----------------

  if (
    value.includes("india") ||
    value.includes("mumbai") ||
    value.includes("delhi") ||
    value.includes("bangalore") ||
    value.includes("bengaluru") ||
    value.includes("hyderabad")
  ) {
    return "IN";
  }

  // ---------------- USA ----------------

  if (
    value.includes(
      "united states"
    ) ||
    value.includes("usa") ||
    value.includes("new york") ||
    value.includes("los angeles") ||
    value.includes("chicago") ||
    value.includes("texas") ||
    value.includes("california")
  ) {
    return "US";
  }

  // ---------------- CANADA ----------------

  if (
    value.includes("canada") ||
    value.includes("toronto") ||
    value.includes("vancouver") ||
    value.includes("montreal")
  ) {
    return "CA";
  }

  // ---------------- UK ----------------

  if (
    value.includes(
      "united kingdom"
    ) ||
    value.includes("uk") ||
    value.includes("london") ||
    value.includes("manchester") ||
    value.includes("birmingham")
  ) {
    return "GB";
  }

  // ---------------- AUSTRALIA ----------------

  if (
    value.includes("australia") ||
    value.includes("sydney") ||
    value.includes("melbourne") ||
    value.includes("brisbane")
  ) {
    return "AU";
  }

  return "";
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  searchSerpApiJobs,
  normalizeSerpApiJob,
};