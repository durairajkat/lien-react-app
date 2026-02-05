// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/index.ts";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = useSelector((state: RootState) => state.auth.token);

  if (!token) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
