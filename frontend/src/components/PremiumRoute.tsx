import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SubscriptionModal from "./SubscriptionModal";
import { getSubscriptionStatus } from "../utils/subscription";

interface PremiumRouteProps {
  children: ReactNode;
  featureName?: string;
}

function PremiumRoute({
  children,
  featureName = "this premium feature",
}: PremiumRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSubscription = async () => {
      setChecking(true);

      try {
        const result = await getSubscriptionStatus();

        if (!mounted) return;

        setSubscribed(Boolean(result.success && result.subscribed));
      } catch (error) {
        console.error("Subscription check failed:", error);

        if (!mounted) return;

        setSubscribed(false);
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    };

    checkSubscription();

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-5 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-400" />

          <p className="mt-3 text-sm text-slate-400">
            Checking your subscription...
          </p>
        </div>
      </div>
    );
  }

  if (!subscribed) {
    return (
      <SubscriptionModal
        featureName={featureName}
        onClose={() => navigate("/dashboard", { replace: true })}
      />
    );
  }

  return <>{children}</>;
}

export default PremiumRoute;
