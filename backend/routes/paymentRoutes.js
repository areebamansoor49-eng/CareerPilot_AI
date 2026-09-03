const express = require("express");

const {
  createCheckout,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/checkout", createCheckout);

module.exports = router;