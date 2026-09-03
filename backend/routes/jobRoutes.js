const express = require("express");

const router = express.Router();

const { getJobs } = require("../controllers/jobController");

router.get("/search", getJobs);

module.exports = router;