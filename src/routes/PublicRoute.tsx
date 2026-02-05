// src/routes/PublicRoute.tsx
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { ReactNode } from "react";


const PublicRoute = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector((state) => state.auth.token);
  const active_projects = useAppSelector((state) => state.auth.active_projects);

  if (token) {
    if (active_projects?.length === 0) {
      return <Navigate to="/tour" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
