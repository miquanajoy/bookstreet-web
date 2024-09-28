import { FC, PropsWithChildren, useEffect } from "react";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/userAuth";
type ProtectedRouteProps = PropsWithChildren;

export default function AuthGuard({ children }: ProtectedRouteProps) {
  const user = useAuth();

  if (!user.isInitialized) {
    return <Navigate to={"/"} />
  }

  return <>{children}</>;
}
