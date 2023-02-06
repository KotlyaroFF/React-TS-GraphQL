/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider/AuthProvider";

const withAuth: any = (Component: React.FC) => (props: any) => {
  const { isAuth } = useAuth();
  const location = useLocation();

  if (
    isAuth &&
    (location.pathname === "/login" || location.pathname === "/confirm-invite")
  )
    return <Navigate to="/" />;

  return isAuth ||
    location.pathname === "/login" ||
    location.pathname === "/confirm-invite" ? (
    <Component {...props} />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default withAuth;
