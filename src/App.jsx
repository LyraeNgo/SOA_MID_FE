import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/protectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PaymentForm from "./pages/PaymentForm";
import OTPVerification from "./pages/OTPVerification";
import PaymentSuccess from "./pages/PaymentSuccess";
import TransactionHistory from "./pages/TransactionHistory";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/otp-verification"
          element={
            <ProtectedRoute>
              <OTPVerification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transaction-history"
          element={
            <ProtectedRoute>
              <TransactionHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
