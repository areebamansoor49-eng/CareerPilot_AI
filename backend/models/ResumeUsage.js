const mongoose = require("mongoose");

const resumeUsageSchema =
  new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        index: true,
      },

      analysisCount: {
        type: Number,
        default: 0,
        min: 0,
      },

      firstUsedAt: {
        type: Date,
        default: null,
      },

      lastUsedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "ResumeUsage",
    resumeUsageSchema
  );
