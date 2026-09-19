const Subscription = require("../models/Subscription");

const updateSubscriptionFromWebhook = async (eventData) => {
  if (!eventData || !eventData.data) {
    console.warn("Paddle webhook has no data.");
    return;
  }

  const data = eventData.data;

  const subscriptionId = data.id || null;

  if (!subscriptionId) {
    console.warn(
      "Paddle webhook does not contain subscription ID."
    );
    return;
  }

  // ======================================================
  // EMAIL
  // ======================================================

  const email =
    data.customer?.email ||
    data.email ||
    data.custom_data?.user_email ||
    data.custom_data?.email ||
    null;

  const normalizedEmail = email
    ? String(email).trim().toLowerCase()
    : null;

  // ======================================================
  // USER ID
  // ======================================================

  const userId =
    data.custom_data?.user_id ||
    null;

  // ======================================================
  // PADDLE STATUS
  // ======================================================

  const paddleStatus =
    data.status || "unknown";

  // ======================================================
  // APPLICATION STATUS
  // ======================================================

  let status = paddleStatus;

  if (paddleStatus === "trialing") {
    status = "trialing";
  } else if (paddleStatus === "active") {
    status = "active";
  } else if (paddleStatus === "canceled") {
    status = "canceled";
  } else if (paddleStatus === "paused") {
    status = "paused";
  } else if (paddleStatus === "past_due") {
    status = "past_due";
  }

  // ======================================================
  // PLAN
  // ======================================================

  const price =
    data.items?.[0]?.price || null;

  const plan =
    price?.name ||
    price?.description ||
    data.custom_data?.plan ||
    null;

  // ======================================================
  // PRICE ID
  // ======================================================

  const priceId =
    price?.id ||
    data.items?.[0]?.price_id ||
    null;

  // ======================================================
  // UPDATE DATA
  // ======================================================

  const updateData = {
    subscriptionId,
    status,
    plan,
    priceId,
    updatedAt: new Date(),
  };

  if (userId) {
    updateData.userId = userId;
  }

  if (normalizedEmail) {
    updateData.email = normalizedEmail;
  }

  // ======================================================
  // SAVE SUBSCRIPTION
  // ======================================================

  let subscription =
    await Subscription.findOne({
      subscriptionId,
    });

  if (subscription) {
    Object.assign(
      subscription,
      updateData
    );

    subscription =
      await subscription.save();
  } else {
    if (!normalizedEmail) {
      console.warn(
        "Cannot create subscription record because customer email is missing."
      );

      return;
    }

    subscription =
      await Subscription.create(
        updateData
      );
  }

  console.log(
    "Subscription saved to MongoDB:",
    {
      subscriptionId:
        subscription.subscriptionId,

      email:
        subscription.email,

      userId:
        subscription.userId,

      plan:
        subscription.plan,

      priceId:
        subscription.priceId,

      status:
        subscription.status,
    }
  );

  return subscription;
};

// ========================================================
// GET SUBSCRIPTION STATUS
// ========================================================

const getSubscriptionStatus = async (
  req,
  res
) => {
  try {
    const email = String(
      req.query.email || ""
    )
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        subscribed: false,
        status: "unauthenticated",
        subscription: null,
      });
    }

    const subscription =
      await Subscription.findOne({
        email,
      })
        .sort({
          updatedAt: -1,
        })
        .lean();

    const subscribed =
      subscription?.status === "active";

    return res.status(200).json({
      success: true,
      subscribed,
      status:
        subscription?.status ||
        "inactive",

      subscription: subscription || null,
    });
  } catch (error) {
    console.error(
      "Subscription status error:",
      error
    );

    return res.status(500).json({
      success: false,
      subscribed: false,
      status: "error",
      subscription: null,
    });
  }
};

module.exports = {
  updateSubscriptionFromWebhook,
  getSubscriptionStatus,
};