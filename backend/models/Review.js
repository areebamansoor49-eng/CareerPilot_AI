const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // ====================================================
    // USER EMAIL
    // ====================================================

    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // ====================================================
    // USER NAME
    // ====================================================

    userName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "CareerPilot User",
    },

    // ====================================================
    // RATING
    // ====================================================

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // ====================================================
    // FEEDBACK / COMMENT
    // ====================================================

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // ====================================================
    // FEATURE USED
    // ====================================================

    featureUsed: {
      type: String,
      enum: [
        "resume",
        "jobs",
        "linkedin",
        "career-roadmap",
        "other",
      ],
      default: "other",
    },

    // ====================================================
    // APPROVAL STATUS
    // ====================================================

    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ========================================================
// ONE REVIEW PER EMAIL
// ========================================================

reviewSchema.index(
  { userEmail: 1 },
  { unique: true }
);

// ========================================================
// EXPORT MODEL
// ========================================================

module.exports = mongoose.model(
  "Review",
  reviewSchema
);