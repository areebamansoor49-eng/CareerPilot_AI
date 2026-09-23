const mongoose = require("mongoose");

const subscriptionSchema =
  new mongoose.Schema(
    {
      userId: {
        type: String,
        default: null,
        index: true,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
      },

      subscriptionId: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      plan: {
        type: String,
        enum: [
          "monthly",
          "yearly",
          "monthly subscription",
          "yearly subscription",
          "monthly plan",
          "yearly plan",
          null,
        ],
        default: null,
      },

      priceId: {
        type: String,
        default: null,
        index: true,
      },

      status: {
        type: String,
        enum: [
          "trialing",
          "active",
          "past_due",
          "paused",
          "canceled",
          "unknown",
        ],
        required: true,
        default: "unknown",
        index: true,
      },

      trialStartDate: {
        type: Date,
        default: null,
      },

      trialEndDate: {
        type: Date,
        default: null,
      },

      nextBilledAt: {
        type: Date,
        default: null,
      },

      canceledAt: {
        type: Date,
        default: null,
      },

      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Subscription",
    subscriptionSchema
  );
