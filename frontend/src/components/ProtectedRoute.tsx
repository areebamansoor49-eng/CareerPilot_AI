import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function ProtectedRoute({ children }: Props) {
  // Check whether the user is authenticated
  const user = localStorage.getItem("user");

  // If user is NOT logged in,
  // always redirect to the Home page.
  // Do NOT redirect to /login because after logout
  // the user should see the Home page.
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated → allow access
  return <>{children}</>;
}

export default ProtectedRoute;