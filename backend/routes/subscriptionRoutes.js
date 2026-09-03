const express = require("express");

const {
  getSubscriptionStatus,
} = require("../controllers/subscriptionController");

const router = express.Router();

router.get("/status", getSubscriptionStatus);

module.exports = router;