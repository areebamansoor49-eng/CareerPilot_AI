const pdf = require("pdf-parse");
const { analyzeResume } = require("../services/resumeAnalyzer");

const ResumeUsage = require("../models/ResumeUsage");
const Subscription = require("../models/Subscription");

const normalizeEmail = (email) => {
  if (!email) {
    return null;
  }

  return String(email)
    .trim()
    .toLowerCase();
};

const hasPremiumAccess = (subscription) => {
  if (!subscription) {
    return false;
  }

  return (
    subscription.status === "trialing" ||
    subscription.status === "active"
  );
};

const uploadResume = async (req, res) => {
  try {
    /*
     * The current Resume Analyzer endpoint performs the upload
     * and analysis in one request.
     *
     * Therefore this backend access check happens immediately
     * before the actual analysis.
     */

    const email = normalizeEmail(
      req.body?.email ||
        req.headers["x-user-email"]
    );

    if (!email) {
      return res.status(401).json({
        success: false,
        code: "EMAIL_REQUIRED",
        message:
          "Your account email is required to analyze a resume.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF uploaded.",
      });
    }

    /*
     * Check Paddle-backed subscription status.
     *
     * Trialing = free trial is currently active.
     * Active = paid subscription is active.
     */
    const subscription =
      await Subscription.findOne({
        email,
      }).sort({
        updatedAt: -1,
      });

    const premiumAccess =
      hasPremiumAccess(subscription);

    /*
     * If the user does not currently have premium access,
     * they are allowed exactly one successful free analysis.
     */
    let usage = await ResumeUsage.findOne({
      email,
    });

    const analysisCount =
      usage?.analysisCount || 0;

    if (
      !premiumAccess &&
      analysisCount >= 1
    ) {
      return res.status(402).json({
        success: false,
        code: "TRIAL_REQUIRED",
        trialRequired: true,
        premiumAccess: false,
        message:
          "You have used your free Resume Analyzer attempt. Start your free 7-day trial to continue.",
        usage: {
          analysisCount,
          freeAttemptAvailable: false,
        },
      });
    }

    console.log("=================================");
    console.log("Resume received:");
    console.log("Email:", email);
    console.log("File:", req.file.originalname);
    console.log("Size:", req.file.size);
    console.log(
      "Premium access:",
      premiumAccess
    );
    console.log(
      "Previous analysis count:",
      analysisCount
    );
    console.log("=================================");

    if (
      !req.file.buffer ||
      !Buffer.isBuffer(req.file.buffer)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Uploaded PDF data could not be read.",
      });
    }

    const pdfData = await pdf(
      req.file.buffer
    );

    const resumeText =
      (pdfData.text || "").trim();

    console.log(
      "PDF pages:",
      pdfData.numpages
    );

    console.log(
      "Extracted text length:",
      resumeText.length
    );

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message:
          "The PDF was uploaded, but no readable text could be extracted.",
      });
    }

    const analysis = analyzeResume(
      resumeText,
      pdfData.numpages
    );

    console.log(
      "========== ATS ANALYSIS =========="
    );

    console.log(
      "ATS Score:",
      analysis.atsScore
    );

    console.log(
      "Word Count:",
      analysis.wordCount
    );

    console.log(
      "Skills:",
      analysis.skills
    );

    console.log(
      "Suggestions:",
      analysis.suggestions
    );

    console.log(
      "=================================="
    );

    /*
     * Only count the free attempt after a successful analysis.
     *
     * The filter analysisCount: 0 also protects against a
     * second non-premium request consuming another free attempt.
     *
     * For premium users, usage is not incremented because
     * trialing/active users have unlimited premium access.
     */
    let updatedUsage =
      await ResumeUsage.findOne({
        email,
      });

    if (!premiumAccess) {
      updatedUsage =
        await ResumeUsage.findOneAndUpdate(
          {
            email,
            analysisCount: 0,
          },
          {
            $inc: {
              analysisCount: 1,
            },
            $set: {
              lastUsedAt: new Date(),
            },
            $setOnInsert: {
              firstUsedAt: new Date(),
            },
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }
        );

      /*
       * If another request already consumed the free attempt
       * while this request was being processed, do not expose
       * the analysis as another successful free use.
       */
      if (
        !updatedUsage ||
        updatedUsage.analysisCount > 1
      ) {
        return res.status(402).json({
          success: false,
          code: "TRIAL_REQUIRED",
          trialRequired: true,
          premiumAccess: false,
          message:
            "You have used your free Resume Analyzer attempt. Start your free 7-day trial to continue.",
          usage: {
            analysisCount:
              updatedUsage?.analysisCount || 1,
            freeAttemptAvailable: false,
          },
        });
      }
    }

    const finalAnalysisCount =
      updatedUsage?.analysisCount ||
      analysisCount;

    return res.status(200).json({
      success: true,
      message:
        "Resume uploaded and analyzed successfully.",

      file: {
        originalName:
          req.file.originalname,
        size: req.file.size,
      },

      analysis,

      premiumAccess,

      usage: {
        analysisCount:
          finalAnalysisCount,
        freeAttemptAvailable:
          premiumAccess ||
          finalAnalysisCount < 1,
      },

      subscription: {
        status:
          subscription?.status || "none",
        trialEndDate:
          subscription?.trialEndDate || null,
        nextBilledAt:
          subscription?.nextBilledAt || null,
      },
    });
  } catch (error) {
    console.error(
      "Resume processing error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to process resume.",
    });
  }
};

module.exports = {
  uploadResume,
};
