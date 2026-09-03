import { Navigate, useLocation } from "react-router-dom";

interface PremiumRouteProps {
  children: React.ReactNode;
}

function PremiumRoute({ children }: PremiumRouteProps) {
  const location = useLocation();

  const isSubscribed =
    localStorage.getItem("subscription") === "active";

  if (!isSubscribed) {
    return (
      <Navigate
        to="/subscription"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
}

export default PremiumRoute;