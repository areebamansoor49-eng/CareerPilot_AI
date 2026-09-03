const express = require("express");
const cors = require("cors");
const reviewRoutes = require("./routes/reviewRoutes");

const path = require("path");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

require("dotenv").config();
const connectDB = require("./config/db");
const {
  updateSubscriptionFromWebhook,
} = require("./controllers/subscriptionController");

const subscriptionRoutes = require("./routes/subscriptionRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const linkedinRoutes = require("./routes/linkedinRoutes");
const careerRoadmapRoutes = require("./routes/careerRoadmapRoutes");

const app = express();
connectDB();
// ========================================================
// CONFIGURATION
// ========================================================

const PORT = process.env.PORT || 5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5174";

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  FRONTEND_URL,
];

const uniqueOrigins = [...new Set(ALLOWED_ORIGINS)];

// ========================================================
// CORS
// ========================================================

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (uniqueOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ========================================================
// COOKIE PARSER
// ========================================================

app.use(
  cookieParser(
    process.env.COOKIE_SECRET ||
      "careerpilot-dev-secret"
  )
);

// ========================================================
// PADDLE WEBHOOK
// MUST BE BEFORE express.json()
// ========================================================

app.post(
  "/api/paddle/webhook",
  express.raw({
    type: "application/json",
  }),
  async (req, res) => {
    try {
      const signature =
        req.headers["paddle-signature"];

      const secretKey =
        process.env.PADDLE_WEBHOOK_SECRET;

      if (!secretKey) {
        console.error(
          "Paddle webhook secret is not configured."
        );

        return res.status(500).json({
          success: false,
          message:
            "Paddle webhook secret is not configured.",
        });
      }

      if (!signature) {
        console.error(
          "Paddle webhook rejected: missing Paddle-Signature."
        );

        return res.status(400).json({
          success: false,
          message: "Missing Paddle signature.",
        });
      }

      if (!Buffer.isBuffer(req.body)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid Paddle webhook body.",
        });
      }

      const rawBody =
        req.body.toString("utf8");

      // ====================================================
      // PARSE PADDLE SIGNATURE
      // ====================================================

      const signatureParts = {};

      String(signature)
        .split(";")
        .forEach((part) => {
          const [key, ...valueParts] =
            part.split("=");

          if (
            key &&
            valueParts.length > 0
          ) {
            signatureParts[key.trim()] =
              valueParts.join("=");
          }
        });

      const timestamp =
        signatureParts.ts;

      const receivedSignature =
        signatureParts.h1;

      if (
        !timestamp ||
        !receivedSignature
      ) {
        console.error(
          "Paddle webhook rejected: invalid signature format."
        );

        return res.status(400).json({
          success: false,
          message:
            "Invalid Paddle signature format.",
        });
      }

      // ====================================================
      // VALIDATE TIMESTAMP
      // ====================================================

      const timestampNumber =
        Number(timestamp);

      if (
        !Number.isFinite(timestampNumber)
      ) {
        console.error(
          "Paddle webhook rejected: invalid timestamp."
        );

        return res.status(400).json({
          success: false,
          message:
            "Invalid Paddle signature timestamp.",
        });
      }

      // ====================================================
      // CREATE SIGNED PAYLOAD
      // ====================================================

      const signedPayload =
        `${timestamp}:${rawBody}`;

      // ====================================================
      // CREATE EXPECTED HMAC
      // ====================================================

      const expectedSignature =
        crypto
          .createHmac(
            "sha256",
            secretKey
          )
          .update(
            signedPayload,
            "utf8"
          )
          .digest("hex");

      const expectedBuffer =
        Buffer.from(
          expectedSignature,
          "hex"
        );

      const receivedBuffer =
        Buffer.from(
          receivedSignature,
          "hex"
        );

      // ====================================================
      // COMPARE SIGNATURES
      // ====================================================

      if (
        expectedBuffer.length !==
        receivedBuffer.length
      ) {
        console.error(
          "Paddle webhook rejected: invalid signature."
        );

        return res.status(401).json({
          success: false,
          message:
            "Invalid Paddle webhook signature.",
        });
      }

      const signatureValid =
        crypto.timingSafeEqual(
          expectedBuffer,
          receivedBuffer
        );

      if (!signatureValid) {
        console.error(
          "Paddle webhook rejected: invalid signature."
        );

        return res.status(401).json({
          success: false,
          message:
            "Invalid Paddle webhook signature.",
        });
      }

      // ====================================================
      // PARSE EVENT
      // ====================================================

      const eventData =
        JSON.parse(rawBody);

      const eventType =
        eventData.event_type;

      const eventId =
        eventData.event_id;

      const notificationId =
        eventData.notification_id;

      console.log(
        "================================="
      );

      console.log(
        "PADDLE WEBHOOK VERIFIED"
      );

      console.log(
        `Event: ${eventType}`
      );

      console.log(
        `Event ID: ${eventId}`
      );

      console.log(
        `Notification ID: ${notificationId}`
      );

      console.log(
        "================================="
      );

      // ====================================================
      // UPDATE SUBSCRIPTION
      // ====================================================

      if (
        eventType &&
        eventType.startsWith(
          "subscription."
        )
      ) {
        if (
          typeof updateSubscriptionFromWebhook ===
          "function"
        ) {
          await updateSubscriptionFromWebhook(
            eventData
          );
        } else {
          console.error(
            "updateSubscriptionFromWebhook is not a function."
          );
        }
      }

      // ====================================================
      // LOG EVENTS
      // ====================================================

      switch (eventType) {
        case "subscription.created":
          console.log(
            "Paddle subscription created:",
            eventData.data?.id
          );
          break;

        case "subscription.activated":
          console.log(
            "Paddle subscription activated:",
            eventData.data?.id
          );
          break;

        case "subscription.updated":
          console.log(
            "Paddle subscription updated:",
            eventData.data?.id
          );
          break;

        case "subscription.canceled":
          console.log(
            "Paddle subscription canceled:",
            eventData.data?.id
          );
          break;

        case "subscription.past_due":
          console.log(
            "Paddle subscription past due:",
            eventData.data?.id
          );
          break;

        case "subscription.paused":
          console.log(
            "Paddle subscription paused:",
            eventData.data?.id
          );
          break;

        case "subscription.resumed":
          console.log(
            "Paddle subscription resumed:",
            eventData.data?.id
          );
          break;

        case "transaction.paid":
          console.log(
            "Paddle transaction paid:",
            eventData.data?.id
          );
          break;

        case "transaction.completed":
          console.log(
            "Paddle transaction completed:",
            eventData.data?.id
          );
          break;

        case "transaction.payment_failed":
          console.log(
            "Paddle transaction payment failed:",
            eventData.data?.id
          );
          break;

        case "transaction.past_due":
          console.log(
            "Paddle transaction past due:",
            eventData.data?.id
          );
          break;

        case "transaction.canceled":
          console.log(
            "Paddle transaction canceled:",
            eventData.data?.id
          );
          break;

        default:
          console.log(
            `Paddle event received: ${eventType}`
          );
      }

      // ====================================================
      // SUCCESS
      // ====================================================

      return res.status(200).json({
        success: true,
        message:
          "Paddle webhook verified successfully.",
      });
    } catch (error) {
      console.error(
        "Paddle webhook processing error:",
        error.message
      );

      return res.status(400).json({
        success: false,
        message:
          "Invalid Paddle webhook request.",
      });
    }
  }
);

// ========================================================
// BODY PARSERS
// ========================================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ========================================================
// STATIC UPLOADS
// ========================================================

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);

// ========================================================
// RESUME ROUTES
// ========================================================

app.use(
  "/api/resume",
  resumeRoutes
);

// ========================================================
// JOB ROUTES
// ========================================================

app.use(
  "/api/jobs",
  jobRoutes
);

// ========================================================
// LINKEDIN ROUTES
// ========================================================

app.use(
  "/api/linkedin",
  linkedinRoutes
);

// ========================================================
// CAREER ROADMAP ROUTES
// ========================================================

app.use(
  "/api/career-roadmap",
  careerRoadmapRoutes
);

// ========================================================
// SUBSCRIPTION ROUTES
// ========================================================

app.use(
  "/api/subscription",
  subscriptionRoutes
);

// ========================================================
// PAYMENT ROUTES
// ========================================================

app.use(
  "/api/payment",
  paymentRoutes
);
// ========================================================
// REVIEW ROUTES
// ========================================================

app.use(
  "/api/reviews",
  reviewRoutes
);

// ========================================================
// HEALTH CHECK
// ========================================================

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      success: true,

      message:
        "CareerPilot AI Backend is Running 🚀",

      port: PORT,

      linkedinOAuth: Boolean(
        process.env.LINKEDIN_CLIENT_ID &&
          process.env.LINKEDIN_CLIENT_SECRET &&
          process.env.LINKEDIN_REDIRECT_URI
      ),

      careerRoadmap: Boolean(
        process.env.OPENAI_API_KEY
      ),

      paddle: Boolean(
        process.env.PADDLE_API_KEY &&
          process.env.PADDLE_WEBHOOK_SECRET
      ),
    });
  }
);

// ========================================================
// API HEALTH CHECK
// ========================================================

app.get(
  "/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,

      message:
        "CareerPilot AI API is healthy.",

      timestamp:
        new Date().toISOString(),
    });
  }
);

// ========================================================
// 404 HANDLER
// ========================================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,

      message:
        `Route not found: ${req.method} ${req.originalUrl}`,
    });
  }
);

// ========================================================
// GLOBAL ERROR HANDLER
// ========================================================

app.use(
  (err, req, res, next) => {
    console.error(
      "Backend error:",
      err.message
    );

    if (
      err.message &&
      err.message.startsWith(
        "CORS blocked"
      )
    ) {
      return res.status(403).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,

      message:
        process.env.NODE_ENV ===
        "development"
          ? err.message
          : "Internal server error.",
    });
  }
);

// ========================================================
// START SERVER
// ========================================================

app.listen(
  PORT,
  () => {
    console.log(
      "================================="
    );

    console.log(
      "CareerPilot AI Backend"
    );

    console.log(
      `Server running on http://localhost:${PORT}`
    );

    console.log(
      `Frontend URL: ${FRONTEND_URL}`
    );

    console.log(
      `LinkedIn OAuth: ${
        process.env.LINKEDIN_CLIENT_ID &&
        process.env.LINKEDIN_CLIENT_SECRET &&
        process.env.LINKEDIN_REDIRECT_URI
          ? "ENABLED"
          : "NOT CONFIGURED"
      }`
    );

    console.log(
      `Career Roadmap AI: ${
        process.env.OPENAI_API_KEY
          ? "ENABLED"
          : "NOT CONFIGURED"
      }`
    );

    console.log(
      `Paddle: ${
        process.env.PADDLE_API_KEY &&
        process.env.PADDLE_WEBHOOK_SECRET
          ? "CONFIGURED"
          : "NOT CONFIGURED"
      }`
    );

    console.log(
      `Environment: ${
        process.env.NODE_ENV ||
        "development"
      }`
    );

    console.log(
      "================================="
    );
  }
);