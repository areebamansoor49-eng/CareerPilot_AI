const Subscription = require("../models/Subscription");

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

  const subscriptionId = data.id || null;

  if (!subscriptionId) {
    console.warn(
      "Paddle webhook does not contain subscription ID."
    );
    return;
  }

  const email =
    data.customer?.email ||
    data.email ||
    data.custom_data?.user_email ||
    data.custom_data?.email ||
    null;

  if (!email) {
    console.warn(
      "Paddle webhook does not contain customer email."
    );
    return;
  }

  const normalizedEmail =
    String(email)
      .trim()
      .toLowerCase();

  let status = "unknown";

  switch (eventData.event_type) {
    case "subscription.created":
      status = "created";
      break;

    case "subscription.activated":
      status = "active";
      break;

    case "subscription.updated":
      status =
        data.status === "active"
          ? "active"
          : data.status || "updated";
      break;

    case "subscription.canceled":
      status = "canceled";
      break;

    case "subscription.paused":
      status = "paused";
      break;

    case "subscription.resumed":
      status = "active";
      break;

    case "subscription.past_due":
      status = "past_due";
      break;

    default:
      status =
        data.status || "unknown";
  }

  const userId =
    data.custom_data?.user_id ||
    null;

  const plan =
    data.items?.[0]?.price?.name ||
    data.items?.[0]?.price?.description ||
    data.custom_data?.plan ||
    null;

  const priceId =
    data.items?.[0]?.price?.id ||
    data.items?.[0]?.price_id ||
    null;

  const subscription =
    await Subscription.findOneAndUpdate(
      {
        email: normalizedEmail,
      },
      {
        userId,
        email: normalizedEmail,
        subscriptionId,
        plan,
        priceId,
        status,
        updatedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

  console.log(
    "Subscription saved to MongoDB:",
    subscription
  );

  return subscription;
};

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
      }).lean();

    const subscribed =
      subscription?.status === "active";

    return res.status(200).json({
      success: true,
      subscribed,
      status:
        subscription?.status ||
        "inactive",
      subscription,
    });
  } catch (error) {
    console.error(
      "Subscription status error:",
      error.message
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