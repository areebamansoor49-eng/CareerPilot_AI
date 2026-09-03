const Review = require("../models/Review");

const POSITIVE_KEYWORDS = [
  "good",
  "better",
  "best",
  "helpful",
  "useful",
  "powerful",
  "amazing",
  "excellent",
  "great",
  "awesome",
  "fantastic",
  "wonderful",
  "perfect",
  "love",
  "loved",
  "like",
  "liked",
  "recommend",
  "recommended",
  "easy",
  "simple",
  "impressive",
  "valuable",
  "effective",
  "professional",
  "fast",
  "accurate",
  "amazing tool",
  "great tool",
  "helpful tool",
  "powerful tool",
  "useful tool",
  "good tool",
  "excellent tool",
  "careerpilot",
];

const NEGATIVE_KEYWORDS = [
  "bad",
  "worst",
  "poor",
  "terrible",
  "awful",
  "horrible",
  "useless",
  "waste",
  "waste of time",
  "waste of money",
  "hate",
  "hated",
  "disappointing",
  "disappointed",
  "slow",
  "broken",
  "bug",
  "bugs",
  "error",
  "errors",
  "failed",
  "failure",
  "not working",
  "doesn't work",
  "does not work",
  "unable",
  "problem",
  "problems",
  "issue",
  "issues",
  "wrong",
  "incorrect",
  "fake",
  "scam",
  "useless tool",
];

const normalizeText = (text) => {
  if (typeof text !== "string") {
    return "";
  }

  return text
    .toLowerCase()
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const containsPositiveKeyword = (text) => {
  const normalizedText = normalizeText(text);

  return POSITIVE_KEYWORDS.some((keyword) =>
    normalizedText.includes(normalizeText(keyword))
  );
};

const containsNegativeKeyword = (text) => {
  const normalizedText = normalizeText(text);

  return NEGATIVE_KEYWORDS.some((keyword) =>
    normalizedText.includes(normalizeText(keyword))
  );
};

const createReview = async (req, res) => {
  try {
    const {
      userEmail,
      userName,
      rating,
      comment,
      featureUsed,
    } = req.body;

    if (
      typeof userEmail !== "string" ||
      !userEmail.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "User email is required.",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    if (
      typeof comment !== "string" ||
      !comment.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide your feedback.",
      });
    }

    const normalizedEmail = userEmail
      .trim()
      .toLowerCase();

    const cleanUserName =
      typeof userName === "string"
        ? userName.trim()
        : "";

    const existingReview = await Review.findOne({
      userEmail: normalizedEmail,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted a review.",
      });
    }

    const cleanComment = comment.trim();

    const hasPositiveKeyword =
      containsPositiveKeyword(cleanComment);

    const hasNegativeKeyword =
      containsNegativeKeyword(cleanComment);

    const approved = numericRating >= 4;

    const review = await Review.create({
      userEmail: normalizedEmail,
      userName:
        cleanUserName || "CareerPilot User",
      rating: numericRating,
      comment: cleanComment,
      featureUsed:
        typeof featureUsed === "string" &&
        featureUsed.trim()
          ? featureUsed.trim()
          : "other",
      approved,
    });

    if (approved) {
      return res.status(201).json({
        success: true,
        approved: true,
        message:
          "Thank you! Your positive review has been submitted successfully.",
        review: {
          _id: review._id,
          userName:
            review.userName ||
            "CareerPilot User",
          rating: review.rating,
          comment: review.comment,
          featureUsed:
            review.featureUsed || "other",
          createdAt: review.createdAt,
        },
      });
    }

    return res.status(201).json({
      success: true,
      approved: false,
      message:
        "Thank you for your feedback. Your review has been submitted successfully.",
    });
  } catch (error) {
    console.error("Create review error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted a review.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to submit review.",
    });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      approved: true,
      rating: {
        $gte: 4,
      },
    })
      .select(
        "_id userName rating comment featureUsed createdAt"
      )
      .sort({
        rating: -1,
        createdAt: -1,
      })
      .limit(20)
      .lean();

    const safeReviews = reviews.map((review) => ({
      _id: review._id,
      userName:
        review.userName ||
        "CareerPilot User",
      rating: review.rating,
      comment:
        review.comment || "",
      featureUsed:
        review.featureUsed ||
        "other",
      createdAt:
        review.createdAt,
    }));

    return res.status(200).json({
      success: true,
      count: safeReviews.length,
      reviews: safeReviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews.",
    });
  }
};

module.exports = {
  createReview,
  getReviews,
};