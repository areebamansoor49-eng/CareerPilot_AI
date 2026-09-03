import axios from "axios";

// ========================================================
// API
// ========================================================

const API_URL = "http://localhost:5000";

// ========================================================
// GET CURRENT USER EMAIL
// ========================================================

const getCurrentUserEmail = () => {
try {
const rawUser =
localStorage.getItem("user");

if (!rawUser) {
  return null;
}

const user =
  JSON.parse(rawUser);

return user?.email || null;


} catch (error) {
console.error(
"Unable to read current user:",
error
);

return null;


}
};

// ========================================================
// GET SUBSCRIPTION STATUS
// ========================================================

export const getSubscriptionStatus =
async () => {
const email =
getCurrentUserEmail();

if (!email) {
  return {
    success: false,
    subscribed: false,
    status: "unauthenticated",
    subscription: null,
  };
}

try {
  const response =
    await axios.get(
      `${API_URL}/api/subscription/status`,
      {
        params: {
          email,
        },
      }
    );

  return response.data;
} catch (error) {
  console.error(
    "Subscription status request failed:",
    error
  );

  return {
    success: false,
    subscribed: false,
    status: "error",
    subscription: null,
  };
}


};

// ========================================================
// CHECK SUBSCRIPTION
// ========================================================

export const isSubscribed =
async () => {
try {
const result =
await getSubscriptionStatus();

  return Boolean(
    result.subscribed
  );
} catch (error) {
  console.error(
    "Subscription check failed:",
    error
  );

  return false;
}


};

// ========================================================
// OLD LOCALSTORAGE ACTIVATION
// DO NOT USE
// ========================================================

export const activateSubscription =
() => {
console.warn(
"activateSubscription() is disabled. Subscription is activated by Paddle webhook."
);
};

// ========================================================
// OLD LOCALSTORAGE CANCELLATION
// DO NOT USE
// ========================================================

export const cancelSubscription =
() => {
console.warn(
"cancelSubscription() is disabled. Subscription status is controlled by Paddle."
);
};