const axios = require("axios");

const PADDLE_ENVIRONMENT =
  process.env.PADDLE_ENVIRONMENT || "sandbox";

const PADDLE_API_KEY =
  process.env.PADDLE_API_KEY;

const PADDLE_BASE_URL =
  PADDLE_ENVIRONMENT === "sandbox"
    ? "https://sandbox-api.paddle.com"
    : "https://api.paddle.com";

const paddleClient = axios.create({
  baseURL: PADDLE_BASE_URL,
  timeout: 15000,
  headers: {
    Authorization: `Bearer ${PADDLE_API_KEY}`,
    "Content-Type": "application/json",
  },
});

const isPaddleConfigured = () => {
  return Boolean(
    PADDLE_API_KEY &&
      process.env.PADDLE_MONTHLY_PRICE_ID &&
      process.env.PADDLE_YEARLY_PRICE_ID
  );
};

const createCheckoutTransaction = async ({
  priceId,
  userEmail,
  userId,
  plan,
}) => {
  if (!isPaddleConfigured()) {
    throw new Error(
      "Paddle is not fully configured."
    );
  }

  if (!priceId) {
    throw new Error(
      "Paddle price ID is required."
    );
  }

  if (!userEmail) {
    throw new Error(
      "User email is required."
    );
  }

  const response = await paddleClient.post(
    "/transactions",
    {
      items: [
        {
          price_id: priceId,
          quantity: 1,
        },
      ],

      custom_data: {
        user_id: userId || "",
        user_email: userEmail,
        plan: plan || "monthly",
      },

      checkout: {},
    }
  );

  return response.data.data;
};

const getTransaction = async (
  transactionId
) => {
  if (!transactionId) {
    throw new Error(
      "Transaction ID is required."
    );
  }

  const response = await paddleClient.get(
    `/transactions/${transactionId}`
  );

  return response.data.data;
};

const getPaddleSubscription = async (
  subscriptionId
) => {
  if (!subscriptionId) {
    throw new Error(
      "Subscription ID is required."
    );
  }

  const response = await paddleClient.get(
    `/subscriptions/${subscriptionId}`
  );

  return response.data.data;
};

module.exports = {
  isPaddleConfigured,
  createCheckoutTransaction,
  getTransaction,
  getPaddleSubscription,
};