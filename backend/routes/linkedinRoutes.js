const express = require("express");

const {
  analyzeProfile,
  linkedinLogin,
  linkedinCallback,
} = require("../controllers/linkedinController");

const router = express.Router();

// ==========================================
// LINKEDIN OAUTH LOGIN
// GET /api/linkedin/auth
// ==========================================

router.get(
  "/auth",
  linkedinLogin
);

// ==========================================
// LINKEDIN OAUTH CALLBACK
// GET /api/linkedin/callback
// ==========================================

router.get(
  "/callback",
  linkedinCallback
);

// ==========================================
// ANALYZE LINKEDIN PROFILE
// POST /api/linkedin/analyze
// ==========================================

router.post(
  "/analyze",
  analyzeProfile
);

// ==========================================
// BACKWARD COMPATIBILITY
// GET /api/linkedin/login
// ==========================================

router.get(
  "/login",
  linkedinLogin
);

module.exports = router;