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


  if (!user) {
    return <Navigate to="/role" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME_PATH[user.role]} replace />;
  }

  if (
    user.must_change_password &&
    !location.pathname.endsWith("/change-password")
  ) {
    return <Navigate to={`/dashboard/${user.role}/change-password`} replace />;
  }

  return <>{children}</>;
}