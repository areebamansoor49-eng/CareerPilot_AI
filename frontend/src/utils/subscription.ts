import axios from "axios";

export type PremiumFeature =
  | "resumeAnalyzer"
  | "internshipFinder";

export type SubscriptionStatus = {
  success: boolean;
  subscribed: boolean;
  status: string;
  subscription: {
    subscriptionId?: string | null;
    plan?: string | null;
    priceId?: string | null;
    status?: string | null;
    updatedAt?: string;
  } | null;
};

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const getCurrentUserEmail =
  (): string | null => {
    try {
      const rawUser =
        localStorage.getItem("user");

      if (!rawUser) {
        return null;
      }

      const user = JSON.parse(rawUser);

      return user?.email
        ? String(user.email)
            .trim()
            .toLowerCase()
        : null;
    } catch {
      return null;
    }
  };

export const getSubscriptionStatus =
  async (): Promise<SubscriptionStatus> => {
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
        status: "error",
        subscription: null,
      };
    }
  };

export const isSubscribed =
  async (): Promise<boolean> => {
    const result =
      await getSubscriptionStatus();

    return Boolean(
      result.success &&
      result.subscribed
    );
  };

const getUsageKey = (
  feature: PremiumFeature
): string => {
  const email =
    getCurrentUserEmail();

  if (!email) {
    return `careerPilot_${feature}_used`;
  }

  return `careerPilot_${email}_${feature}_used`;
};

export const hasUsedFreeAttempt =
  (
    feature: PremiumFeature
  ): boolean => {
    return (
      localStorage.getItem(
        getUsageKey(feature)
      ) === "true"
    );
  };

export const markFeatureUsed =
  (
    feature: PremiumFeature
  ): void => {
    localStorage.setItem(
      getUsageKey(feature),
      "true"
    );
  };

export const canUseFeature =
  async (
    feature: PremiumFeature
  ): Promise<boolean> => {
    try {
      const subscribed =
        await isSubscribed();

      if (subscribed) {
        return true;
      }

      return !hasUsedFreeAttempt(
        feature
      );
    } catch (error) {
      console.error(
        "Feature access check failed:",
        error
      );

      return false;
    }
  };

export const resetFeatureUsage =
  (
    feature: PremiumFeature
  ): void => {
    localStorage.removeItem(
      getUsageKey(feature)
    );
  };

export const resetAllFeatureUsage =
  (): void => {
    localStorage.removeItem(
      getUsageKey(
        "resumeAnalyzer"
      )
    );

    localStorage.removeItem(
      getUsageKey(
        "internshipFinder"
      )
    );
  };