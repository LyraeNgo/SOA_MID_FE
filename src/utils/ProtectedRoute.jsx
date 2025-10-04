// src/utils/protectedRoute.js
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem("token"); // ví dụ check token

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
}
