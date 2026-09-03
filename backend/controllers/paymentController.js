const {
  createCheckoutTransaction,
  isPaddleConfigured,
} = require("../services/paymentService");

const createCheckout = async (req, res) => {
  try {
    if (!isPaddleConfigured()) {
      return res.status(503).json({
        success: false,
        message: "Paddle payment system is not configured.",
      });
    }

    const {
      email,
      userId,
      plan = "monthly",
    } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User email is required.",
      });
    }

    if (plan !== "monthly" && plan !== "yearly") {
      return res.status(400).json({
        success: false,
        message: "Plan must be monthly or yearly.",
      });
    }

    const priceId =
      plan === "yearly"
        ? process.env.PADDLE_YEARLY_PRICE_ID
        : process.env.PADDLE_MONTHLY_PRICE_ID;

    if (!priceId) {
      return res.status(503).json({
        success: false,
        message: `Paddle ${plan} price is not configured.`,
      });
    }

    const transaction =
      await createCheckoutTransaction({
        priceId,
        userEmail: email,
        userId,
        plan,
      });

    return res.status(201).json({
      success: true,
      transactionId: transaction.id,
      checkoutUrl: transaction.checkout?.url || null,
      status: transaction.status,
      data: transaction,
    });
  } catch (error) {
    console.error(
      "Paddle checkout creation error:",
      error.response?.data || error.message
    );

    return res.status(
      error.response?.status || 500
    ).json({
      success: false,
      message:
        error.response?.data?.error?.detail ||
        "Unable to create Paddle checkout.",
    });
  }
};

module.exports = {
  createCheckout,
};