import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface Props {
  children: ReactNode;
}

function ProtectedRoute({ children }: Props) {
  const location = useLocation();
  const user = localStorage.getItem("user");

  if (!user) {
    const redirectTo = `${location.pathname}${location.search}${location.hash}`;

    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectTo }}
      />
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;