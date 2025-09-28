import React from "react";
import { Navigate } from "react-router-dom";
export const SessionRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");

  // Nếu chưa có token thì quay lại trang login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Nếu có token thì render tiếp children (nội dung của route đó)
  return children;
};
