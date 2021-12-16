import React, { useContext } from "react";
import { Route, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function AuthRoutes({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (user) {
    return <Navigate to="/" state={{ from: location }} />;
  }
  return children;
}

export function PrivacyRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (user) {
    return children;
  }
  return <Navigate to="/login" state={{ from: location }} />;
}
