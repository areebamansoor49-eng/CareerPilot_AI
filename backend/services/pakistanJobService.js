// ======================================================
// PAKISTAN JOB SERVICE
// ======================================================

const searchPakistanJobs = async ({
  query = "internship",
  location = "",
  page = 1,
  resultsPerPage = 20,
}) => {
  console.log("=================================");
  console.log("PAKISTAN JOB SEARCH");
  console.log("Query:", query);
  console.log("Location:", location || "ALL PAKISTAN");
  console.log("Page:", page);
  console.log("=================================");

  /*
   * IMPORTANT:
   * Keep Pakistan source isolated here.
   *
   * We are NOT returning fake jobs.
   * Once a legitimate Pakistan API/source is connected,
   * its response will be normalized here.
   */

  return {
    count: 0,
    jobs: [],
  };
};

module.exports = {
  searchPakistanJobs,
};