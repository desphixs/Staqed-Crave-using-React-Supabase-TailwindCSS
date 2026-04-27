import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute component that redirects unauthenticated users to the login page.
 * It uses the global Auth context to check the current user's authentication status.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Show nothing (or a loading spinner) while we check the auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  // If there is no user logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children (the protected page)
  return <>{children}</>;
};

export default ProtectedRoute;
