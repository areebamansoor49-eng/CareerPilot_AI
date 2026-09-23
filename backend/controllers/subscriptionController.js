const Subscription = require("../models/Subscription");

// ========================================================
// HELPERS
// ========================================================

const normalizeEmail = (email) => {
  if (!email) {
    return null;
  }

  return String(email)
    .trim()
    .toLowerCase();
};

const toDateOrNull = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
};

const getPlanFromPrice = (priceId, customData = {}) => {
  const monthlyPriceId =
    process.env.PADDLE_MONTHLY_PRICE_ID;

  const yearlyPriceId =
    process.env.PADDLE_YEARLY_PRICE_ID;

  if (
    priceId &&
    monthlyPriceId &&
    priceId === monthlyPriceId
  ) {
    return "monthly";
  }

  if (
    priceId &&
    yearlyPriceId &&
    priceId === yearlyPriceId
  ) {
    return "yearly";
  }

  if (
    customData?.plan === "monthly" ||
    customData?.plan === "yearly"
  ) {
    return customData.plan;
  }

  return null;
};

const getSubscriptionItem = (data) => {
  if (!Array.isArray(data?.items)) {
    return null;
  }

  return (
    data.items.find(
      (item) => item?.recurring !== false
    ) ||
    data.items[0] ||
    null
  );
};

// ========================================================
// PADDLE WEBHOOK → MONGODB
// ========================================================

const updateSubscriptionFromWebhook = async (
  eventData
) => {
  if (!eventData || !eventData.data) {
    console.warn(
      "Paddle webhook has no data."
    );

    return;
  }

  const data = eventData.data;

  const subscriptionId =
    data.id || null;

  if (!subscriptionId) {
    console.warn(
      "Paddle webhook does not contain subscription ID."
    );

    return;
  }

  const customData =
    data.custom_data || {};

  // ======================================================
  // EMAIL
  // ======================================================

  const email =
    data.customer?.email ||
    data.email ||
    customData.user_email ||
    customData.email ||
    null;

  const normalizedEmail =
    normalizeEmail(email);

  // ======================================================
  // USER ID
  // ======================================================

  const userId =
    customData.user_id ||
    null;

  // ======================================================
  // STATUS
  // ======================================================

  const paddleStatus =
    data.status || "unknown";

  const allowedStatuses = [
    "trialing",
    "active",
    "past_due",
    "paused",
    "canceled",
  ];

  const status =
    allowedStatuses.includes(
      paddleStatus
    )
      ? paddleStatus
      : "unknown";

  // ======================================================
  // SUBSCRIPTION ITEM
  // ======================================================

  const subscriptionItem =
    getSubscriptionItem(data);

  const price =
    subscriptionItem?.price ||
    null;

  // ======================================================
  // PRICE ID
  // ======================================================

  const priceId =
    price?.id ||
    subscriptionItem?.price_id ||
    null;

  // ======================================================
  // PLAN
  // ======================================================

  const plan =
    getPlanFromPrice(
      priceId,
      customData
    ) ||
    price?.name ||
    price?.description ||
    null;

  // ======================================================
  // TRIAL DATES
  // Paddle puts trial dates on the subscription item.
  // ======================================================

  const trialDates =
    subscriptionItem?.trial_dates ||
    null;

  const trialStartDate =
    toDateOrNull(
      trialDates?.starts_at
    );

  const trialEndDate =
    toDateOrNull(
      trialDates?.ends_at
    );

  // ======================================================
  // NEXT BILLING DATE
  // ======================================================

  const nextBilledAt =
    toDateOrNull(
      data.next_billed_at ||
        subscriptionItem?.next_billed_at
    );

  // ======================================================
  // CANCELLATION DATE
  // ======================================================

  const canceledAt =
    toDateOrNull(
      data.canceled_at
    );

  // ======================================================
  // UPDATE DATA
  // ======================================================

  const updateData = {
    subscriptionId,
    status,
    priceId,
    updatedAt: new Date(),
  };

  if (plan) {
    updateData.plan = plan;
  }

  if (userId) {
    updateData.userId = userId;
  }

  if (normalizedEmail) {
    updateData.email = normalizedEmail;
  }

  if (trialStartDate) {
    updateData.trialStartDate =
      trialStartDate;
  }

  if (trialEndDate) {
    updateData.trialEndDate =
      trialEndDate;
  }

  if (nextBilledAt) {
    updateData.nextBilledAt =
      nextBilledAt;
  }

  if (canceledAt) {
    updateData.canceledAt =
      canceledAt;
  }

  // ======================================================
  // FIND EXISTING SUBSCRIPTION
  // ======================================================

  let subscription =
    await Subscription.findOne({
      subscriptionId,
    });

  // ======================================================
  // UPDATE EXISTING
  // ======================================================

  if (subscription) {
    Object.assign(
      subscription,
      updateData
    );

    subscription =
      await subscription.save();
  }

  // ======================================================
  // CREATE NEW
  // ======================================================

  else {
    if (!normalizedEmail) {
      console.warn(
        "Cannot create subscription record because customer email is missing."
      );

      return;
    }

    subscription =
      await Subscription.create({
        ...updateData,
        email: normalizedEmail,
      });
  }

  // ======================================================
  // LOG
  // ======================================================

  console.log(
    "================================="
  );

  console.log(
    "CareerPilot Paddle Subscription Updated"
  );

  console.log(
    `Event: ${
      eventData.event_type ||
      "UNKNOWN"
    }`
  );

  console.log(
    `Subscription ID: ${
      subscription.subscriptionId
    }`
  );

  console.log(
    `Email: ${
      subscription.email
    }`
  );

  console.log(
    `User ID: ${
      subscription.userId ||
      "N/A"
    }`
  );

  console.log(
    `Plan: ${
      subscription.plan ||
      "N/A"
    }`
  );

  console.log(
    `Price ID: ${
      subscription.priceId ||
      "N/A"
    }`
  );

  console.log(
    `Status: ${
      subscription.status
    }`
  );

  console.log(
    `Trial Start: ${
      subscription.trialStartDate ||
      "N/A"
    }`
  );

  console.log(
    `Trial End: ${
      subscription.trialEndDate ||
      "N/A"
    }`
  );

  console.log(
    `Next Billed At: ${
      subscription.nextBilledAt ||
      "N/A"
    }`
  );

  console.log(
    "================================="
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
    const email = normalizeEmail(
      req.query.email
    );

    if (!email) {
      return res.status(400).json({
        success: false,
        subscribed: false,
        trialing: false,
        premiumAccess: false,
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

    const status =
      subscription?.status ||
      "inactive";

    // ====================================================
    // PREMIUM ACCESS
    //
    // trialing = 7-day Paddle trial
    // active   = successfully paid subscription
    // ====================================================

    const trialing =
      status === "trialing";

    const active =
      status === "active";

    const premiumAccess =
      trialing || active;

    return res.status(200).json({
      success: true,

      subscribed:
        active,

      trialing,

      premiumAccess,

      status,

      trialEndDate:
        subscription?.trialEndDate ||
        null,

      nextBilledAt:
        subscription?.nextBilledAt ||
        null,

      subscription:
        subscription || null,
    });
  } catch (error) {
    console.error(
      "Subscription status error:",
      error
    );

    return res.status(500).json({
      success: false,
      subscribed: false,
      trialing: false,
      premiumAccess: false,
      status: "error",
      subscription: null,
    });
  }
};

module.exports = {
  updateSubscriptionFromWebhook,
  getSubscriptionStatus,
};
