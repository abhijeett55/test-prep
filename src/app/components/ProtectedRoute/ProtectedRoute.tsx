import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../config/auth/AuthContext";
import { ROLE_HOME_PATH, type Role } from "../../api/auth/roleRouting";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: Role[];
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  // Not signed in → role picker.
  if (!user) {
    return <Navigate to="/role" replace />;
  }

  // Signed in as a different role → send to their own dashboard.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME_PATH[user.role]} replace />;
  }

  // Must change password before using the app.
  if (
    user.must_change_password &&
    location.pathname !== "/change-password"
  ) {
    return <Navigate to="/change-password" replace />;
  }

  return <>{children}</>;
}