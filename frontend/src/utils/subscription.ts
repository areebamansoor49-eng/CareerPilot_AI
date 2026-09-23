import axios from "axios";

export type PremiumFeature =
  | "resumeAnalyzer"
  | "careerRoadmap"
  | "linkedinOptimizer"
  | "aiInterview";

export type SubscriptionStatus = {
  success: boolean;
  subscribed: boolean;
  trialing?: boolean;
  premiumAccess?: boolean;
  status: string;
  trialEndDate?: string | null;
  nextBilledAt?: string | null;
  subscription: {
    subscriptionId?: string | null;
    plan?: string | null;
    priceId?: string | null;
    status?: string | null;
    trialStartDate?: string | null;
    trialEndDate?: string | null;
    nextBilledAt?: string | null;
    canceledAt?: string | null;
    updatedAt?: string;
  } | null;
};

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const getCurrentUserEmail = (): string | null => {
  try {
    const rawUser = localStorage.getItem("user");

    if (!rawUser) {
      return null;
    }

    const user = JSON.parse(rawUser);

    return user?.email
      ? String(user.email).trim().toLowerCase()
      : null;
  } catch {
    return null;
  }
};

export const isLoggedIn = (): boolean => {
  return Boolean(localStorage.getItem("user"));
};

export const getSubscriptionStatus =
  async (): Promise<SubscriptionStatus> => {
    const email = getCurrentUserEmail();

    if (!email) {
      return {
        success: false,
        subscribed: false,
        trialing: false,
        premiumAccess: false,
        status: "unauthenticated",
        trialEndDate: null,
        nextBilledAt: null,
        subscription: null,
      };
    }

    try {
      const response = await axios.get(
        `${API_URL}/api/subscription/status`,
        {
          params: { email },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to get subscription status:",
        error
      );

      return {
        success: false,
        subscribed: false,
        trialing: false,
        premiumAccess: false,
        status: "error",
        trialEndDate: null,
        nextBilledAt: null,
        subscription: null,
      };
    }
  };

/**
 * Returns true only when the subscription is actively paid.
 * Trialing users are handled separately by hasPremiumAccess().
 */
export const isSubscribed =
  async (): Promise<boolean> => {
    const result = await getSubscriptionStatus();

    return Boolean(
      result.success &&
        result.subscribed &&
        result.status === "active"
    );
  };

/**
 * Returns true when the user can access premium features.
 *
 * Both an active paid subscription and an active
 * 7-day trial provide full premium access.
 */
export const hasPremiumAccess =
  async (): Promise<boolean> => {
    const result = await getSubscriptionStatus();

    return Boolean(
      result.success &&
        (
          result.premiumAccess ||
          result.trialing ||
          result.status === "trialing" ||
          result.status === "active"
        )
    );
  };

const getUsageKey = (
  feature: PremiumFeature
): string => {
  const email = getCurrentUserEmail();

  if (!email) {
    return `careerPilot_${feature}_used`;
  }

  return `careerPilot_${email}_${feature}_used`;
};

/**
 * Local usage tracking is only a UI fallback.
 * The backend remains the authoritative source for
 * Resume Analyzer usage and premium access.
 */
export const hasUsedFreeAttempt = (
  feature: PremiumFeature
): boolean => {
  return (
    localStorage.getItem(
      getUsageKey(feature)
    ) === "true"
  );
};

export const markFeatureUsed = (
  feature: PremiumFeature
): void => {
  localStorage.setItem(
    getUsageKey(feature),
    "true"
  );
};

export const canUseFeature = async (
  feature: PremiumFeature
): Promise<boolean> => {
  try {
    const premiumAccess =
      await hasPremiumAccess();

    if (premiumAccess) {
      return true;
    }

    return !hasUsedFreeAttempt(feature);
  } catch (error) {
    console.error(
      "Feature access check failed:",
      error
    );

    return false;
  }
};

export const resetFeatureUsage = (
  feature: PremiumFeature
): void => {
  localStorage.removeItem(
    getUsageKey(feature)
  );
};

export const resetAllFeatureUsage = (): void => {
  resetFeatureUsage("resumeAnalyzer");
};