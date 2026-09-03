const { searchJobs } = require("../services/jobService");

const getJobs = async (req, res) => {
  try {
    const query =
      typeof req.query.query === "string"
        ? req.query.query.trim()
        : "internship";

    const location =
      typeof req.query.location === "string"
        ? req.query.location.trim()
        : "";

    const page =
      Number(req.query.page) || 1;

    console.log("=================================");
    console.log("JOB SEARCH REQUEST");
    console.log("Query:", query);
    console.log(
      "Location:",
      location || "WORLDWIDE"
    );
    console.log("Page:", page);
    console.log("=================================");

    const result = await searchJobs({
      query,
      location,
      page,
      resultsPerPage: 20,
    });

    return res.json({
  success: true,
  count: result.count,
  jobs: result.jobs,
  sourceStatus: result.sourceStatus || null,
});
  } catch (error) {
    console.error("=================================");
    console.error("JOB SEARCH ERROR");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch jobs.",
    });
  }
};

module.exports = {
  getJobs,
};