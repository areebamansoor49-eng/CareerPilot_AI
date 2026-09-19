const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

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

const uniqueOrigins = [
  ...new Set(ALLOWED_ORIGINS.filter(Boolean)),
];

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

      const timestampNumber =
        Number(timestamp);

      if (
        !Number.isFinite(timestampNumber)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid Paddle signature timestamp.",
        });
      }

      const timestampAge =
        Math.abs(
          Date.now() / 1000 -
            timestampNumber
        );

      if (timestampAge > 300) {
        console.error(
          "Paddle webhook rejected: timestamp is too old."
        );

        return res.status(401).json({
          success: false,
          message:
            "Expired Paddle webhook signature.",
        });
      }

      const signedPayload =
        `${timestamp}:${rawBody}`;

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

      if (
        expectedBuffer.length !==
        receivedBuffer.length
      ) {
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
        return res.status(401).json({
          success: false,
          message:
            "Invalid Paddle webhook signature.",
        });
      }

      let eventData;

      try {
        eventData =
          JSON.parse(rawBody);
      } catch (parseError) {
        console.error(
          "Paddle webhook JSON parse error:",
          parseError.message
        );

        return res.status(400).json({
          success: false,
          message:
            "Invalid Paddle webhook JSON.",
        });
      }

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
        `Event: ${eventType || "UNKNOWN"}`
      );

      console.log(
        `Event ID: ${eventId || "N/A"}`
      );

      console.log(
        `Notification ID: ${
          notificationId || "N/A"
        }`
      );

      console.log(
        "================================="
      );

      if (
        eventType &&
        eventType.startsWith(
          "subscription."
        )
      ) {
        const {
          updateSubscriptionFromWebhook,
        } = require(
          "./controllers/subscriptionController"
        );

        if (
          typeof updateSubscriptionFromWebhook ===
          "function"
        ) {
          await updateSubscriptionFromWebhook(
            eventData
          );
        }
      }

      console.log(
        `Paddle event received: ${
          eventType || "UNKNOWN"
        }`
      );

      return res.status(200).json({
        success: true,
        message:
          "Paddle webhook verified successfully.",
      });
    } catch (error) {
      console.error(
        "Paddle webhook processing error:",
        error
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
// HEALTH CHECKS
// These are intentionally registered before lazy routes.
// ========================================================

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      success: true,

      message:
        "CareerPilot AI Backend is Running",

      environment:
        process.env.NODE_ENV ||
        "development",

      frontendUrl:
        FRONTEND_URL,

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
// LAZY ROUTE LOADING
// ========================================================

let routesLoaded = false;
let routeLoadError = null;

function loadRoutes() {
  if (routesLoaded) {
    return;
  }

  if (routeLoadError) {
    throw routeLoadError;
  }

  try {
    console.log(
      "Loading CareerPilot backend routes..."
    );

    const reviewRoutes =
      require("./routes/reviewRoutes");

    const subscriptionRoutes =
      require("./routes/subscriptionRoutes");

    const paymentRoutes =
      require("./routes/paymentRoutes");

    const resumeRoutes =
      require("./routes/resumeRoutes");

    const jobRoutes =
      require("./routes/jobRoutes");

    const linkedinRoutes =
      require("./routes/linkedinRoutes");

    const careerRoadmapRoutes =
      require("./routes/careerRoadmapRoutes");

    app.use(
      "/api/resume",
      resumeRoutes
    );

    app.use(
      "/api/jobs",
      jobRoutes
    );

    app.use(
      "/api/linkedin",
      linkedinRoutes
    );

    app.use(
      "/api/career-roadmap",
      careerRoadmapRoutes
    );

    app.use(
      "/api/subscription",
      subscriptionRoutes
    );

    app.use(
      "/api/payment",
      paymentRoutes
    );

    app.use(
      "/api/reviews",
      reviewRoutes
    );

    routesLoaded = true;

    console.log(
      "CareerPilot backend routes loaded successfully."
    );
  } catch (error) {
    routeLoadError = error;

    console.error(
      "Failed to load backend routes:",
      error
    );

    throw error;
  }
}

// ========================================================
// LAZY ROUTE INITIALIZER
// ========================================================

app.use(
  (req, res, next) => {
    const isHealthRoute =
      req.path === "/" ||
      req.path === "/api/health";

    const isPaddleWebhook =
      req.path === "/api/paddle/webhook";

    if (
      isHealthRoute ||
      isPaddleWebhook
    ) {
      return next();
    }

    try {
      loadRoutes();
      return next();
    } catch (error) {
      return next(error);
    }
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
      err
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
// LOCAL SERVER
// ========================================================

if (require.main === module) {
  connectDB()
    .then(() => {
      loadRoutes();

      app.listen(
        PORT,
        "0.0.0.0",
        () => {
          console.log(
            "================================="
          );

          console.log(
            "CareerPilot AI Backend"
          );

          console.log(
            `Server listening on port ${PORT}`
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
    })
    .catch((error) => {
      console.error(
        "Failed to start backend:",
        error
      );

      process.exit(1);
    });
}

// ========================================================
// EXPORT APP FOR VERCEL
// ========================================================

module.exports = app;