import axios from "axios";

/*
=========================================================
CAREERPILOT FEATURE ACCESS
=========================================================

FREE:
1. Resume Analyzer -> 1 free successful use
2. Opportunity Finder -> unlimited

PREMIUM FROM FIRST USE:
1. AI Mock Interviews
2. Career Roadmap
3. LinkedIn Optimizer

ACTIVE SUBSCRIPTION:
Any active monthly OR yearly subscription unlocks
ALL premium features.
=========================================================
*/

export type PremiumFeature =
  | "resumeAnalyzer"
  | "opportunityFinder"
  | "aiInterview"
  | "careerRoadmap"
  | "linkedinOptimizer";

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

/*
=========================================================
GET CURRENT USER EMAIL
=========================================================
*/

export const getCurrentUserEmail =
  (): string | null => {
    try {
      const rawUser =
        localStorage.getItem("user");

      if (!rawUser) {
        return null;
      }

      const user = JSON.parse(rawUser);

      if (!user?.email) {
        return null;
      }

      return String(user.email)
        .trim()
        .toLowerCase();
    } catch (error) {
      console.error(
        "Unable to read current user:",
        error
      );

      return null;
    }
  };

/*
=========================================================
GET SUBSCRIPTION STATUS FROM BACKEND
=========================================================

IMPORTANT:

We DO NOT trust localStorage for subscription status.

The real subscription status comes from the backend /
MongoDB through:

GET /api/subscription/status?email=...
=========================================================
*/

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

      const data =
        response.data;

      return {
        success:
          Boolean(data?.success),

        subscribed:
          Boolean(data?.subscribed),

        status:
          data?.status ||
          "inactive",

        subscription:
          data?.subscription ||
          null,
      };
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

/*
=========================================================
CHECK ACTIVE SUBSCRIPTION
=========================================================

This works for BOTH:

$5/month
$50/year

As long as backend says subscription is active,
ALL premium features are unlocked.
=========================================================
*/

export const isSubscribed =
  async (): Promise<boolean> => {
    const result =
      await getSubscriptionStatus();

    return Boolean(
      result.success &&
      result.subscribed &&
      result.status === "active"
    );
  };

/*
=========================================================
FEATURE CLASSIFICATION
=========================================================
*/

/*
Opportunity Finder is completely FREE and UNLIMITED.

It does NOT consume a free attempt.
It does NOT require subscription.
*/

export const isFreeUnlimitedFeature =
  (
    feature: PremiumFeature
  ): boolean => {
    return (
      feature ===
      "opportunityFinder"
    );
  };

/*
Resume Analyzer gets exactly ONE free use.

All other features are premium from the
very first use.
*/

export const hasFreeAttempt =
  (
    feature: PremiumFeature
  ): boolean => {
    return (
      feature ===
      "resumeAnalyzer"
    );
  };

/*
=========================================================
USAGE STORAGE KEY
=========================================================

The free Resume Analyzer attempt is stored
separately for each logged-in user's email.

Example:

careerPilot_user@email.com_resumeAnalyzer_used

This prevents one user's usage from being mixed
with another user's usage on the same browser.
=========================================================
*/

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

/*
=========================================================
CHECK WHETHER FREE ATTEMPT WAS USED
=========================================================
*/

export const hasUsedFreeAttempt =
  (
    feature: PremiumFeature
  ): boolean => {
    /*
     * Opportunity Finder has unlimited free usage,
     * so it never counts as a used free attempt.
     */

    if (
      isFreeUnlimitedFeature(
        feature
      )
    ) {
      return false;
    }

    return (
      localStorage.getItem(
        getUsageKey(feature)
      ) === "true"
    );
  };

/*
=========================================================
MARK FEATURE USED
=========================================================

Only Resume Analyzer should normally call this.

Opportunity Finder will never be marked used.

Other premium features don't need free-use tracking
because they require subscription from the first use.
=========================================================
*/

export const markFeatureUsed =
  (
    feature: PremiumFeature
  ): void => {
    /*
     * NEVER consume usage for Opportunity Finder.
     */

    if (
      isFreeUnlimitedFeature(
        feature
      )
    ) {
      return;
    }

    /*
     * Only features with a free attempt
     * should be stored as used.
     */

    if (
      !hasFreeAttempt(feature)
    ) {
      return;
    }

    localStorage.setItem(
      getUsageKey(feature),
      "true"
    );
  };

/*
=========================================================
CAN USER USE FEATURE?
=========================================================

RULES:

Opportunity Finder:
    -> ALWAYS allowed

Resume Analyzer:
    -> subscribed = allowed
    -> not subscribed + free attempt unused = allowed
    -> not subscribed + free attempt used = blocked

AI Interview:
    -> subscribed = allowed
    -> not subscribed = blocked

Career Roadmap:
    -> subscribed = allowed
    -> not subscribed = blocked

LinkedIn Optimizer:
    -> subscribed = allowed
    -> not subscribed = blocked
=========================================================
*/

export const canUseFeature =
  async (
    feature: PremiumFeature
  ): Promise<boolean> => {
    try {
      /*
       * Opportunity Finder is FREE and UNLIMITED.
       *
       * Subscription check is intentionally skipped.
       */

      if (
        isFreeUnlimitedFeature(
          feature
        )
      ) {
        return true;
      }

      /*
       * All remaining features depend on
       * subscription status.
       */

      const subscribed =
        await isSubscribed();

      /*
       * Active subscription unlocks
       * EVERYTHING.
       */

      if (subscribed) {
        return true;
      }

      /*
       * Only Resume Analyzer has
       * one free attempt.
       */

      if (
        hasFreeAttempt(feature)
      ) {
        return !hasUsedFreeAttempt(
          feature
        );
      }

      /*
       * All other premium features
       * require subscription from
       * the first use.
       */

      return false;
    } catch (error) {
      console.error(
        "Feature access check failed:",
        error
      );

      return false;
    }
  };

/*
=========================================================
RESET ONE FEATURE USAGE
=========================================================
*/

export const resetFeatureUsage =
  (
    feature: PremiumFeature
  ): void => {
    /*
     * Opportunity Finder is unlimited,
     * so there is nothing to reset.
     */

    if (
      isFreeUnlimitedFeature(
        feature
      )
    ) {
      return;
    }

    localStorage.removeItem(
      getUsageKey(feature)
    );
  };

/*
=========================================================
RESET ALL FREE-USAGE DATA
=========================================================

Currently only Resume Analyzer
uses free-attempt tracking.

Opportunity Finder is unlimited and
therefore has no usage flag.
=========================================================
*/

export const resetAllFeatureUsage =
  (): void => {
    localStorage.removeItem(
      getUsageKey(
        "resumeAnalyzer"
      )
    );
  };