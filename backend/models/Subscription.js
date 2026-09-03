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
        default: null,
      },

      priceId: {
        type: String,
        default: null,
      },

      status: {
        type: String,
        required: true,
        default: "unknown",
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