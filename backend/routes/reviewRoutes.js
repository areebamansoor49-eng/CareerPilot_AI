const express = require("express");

const {
  createReview,
  getReviews,
} = require("../controllers/reviewController");

const router = express.Router();

// Submit a review
router.post("/", createReview);

// Get public reviews
router.get("/", getReviews);

module.exports = router;
