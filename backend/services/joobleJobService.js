const axios = require("axios");

// ======================================================
// JOOBLE JOB SEARCH
// ======================================================

const searchJoobleJobs = async ({
  query = "internship",
  location = "",
  page = 1,
  resultsPerPage = 20,
  radius = "",
}) => {
  const apiKey = process.env.JOOBLE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "JOOBLE_API_KEY is missing from backend/.env"
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

  const url = `https://jooble.org/api/${apiKey}`;

  console.log("=================================");
  console.log("SEARCH SOURCE: JOOBLE");
  console.log("JOOBLE QUERY:", cleanQuery);
  console.log(
    "JOOBLE LOCATION:",
    cleanLocation || "WORLDWIDE"
  );
  console.log("JOOBLE PAGE:", page);
  console.log("JOOBLE RADIUS:", radius || "none");
  console.log("=================================");

  try {
    const body = {
      keywords: cleanQuery,
      location: cleanLocation,
      page: String(page),
      ResultOnPage: resultsPerPage,
      companysearch: false,
    };

    // Jooble supports radius values such as
    // 4, 8, 16, 26, 40 and 80 km.
    if (radius) {
      body.radius = String(radius);
    }

    const response = await axios.post(
      url,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    const data = response.data || {};

    const jobs = Array.isArray(data.jobs)
      ? data.jobs
      : [];

    const totalCount =
      Number(data.totalCount) || jobs.length;

    console.log("JOOBLE TOTAL:", totalCount);
    console.log("JOOBLE RETURNED:", jobs.length);

    return {
      count: totalCount,
      jobs,
      success: true,
    };
  } catch (error) {
    console.error("---------------------------------");
    console.error("JOOBLE API ERROR");
    console.error(
      "Status:",
      error.response?.status
    );
    console.error(
      "Response:",
      error.response?.data
    );
    console.error(
      "Message:",
      error.message
    );
    console.error("---------------------------------");

    return {
      count: 0,
      jobs: [],
      success: false,
    };
  }
};

// ======================================================
// NORMALIZE JOOBLE JOB
// ======================================================

const normalizeJoobleJob = (job) => {
  return {
    id:
      `jooble-${job.id || Math.random()}`,

    title:
      job.title ||
      "Untitled Position",

    company:
      job.company ||
      "Company not specified",

    location:
      job.location ||
      "Location not specified",

    description:
      job.snippet ||
      "No description available.",

    salaryMin: null,

    salaryMax: null,

    salaryIsPredicted: false,

    contractType:
      job.type ||
      null,

    contractTime:
      job.type ||
      null,

    category: null,

    created:
      job.updated ||
      null,

    redirectUrl:
      job.link ||
      "",

    source:
      job.source ||
      "Jooble",

    country: null,
  };
};

module.exports = {
  searchJoobleJobs,
  normalizeJoobleJob,
};