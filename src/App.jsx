import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/protectedRoute";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PaymentForm from "./pages/PaymentForm";
import OTPVerification from "./pages/OTPVerification";
import PaymentSuccess from "./pages/PaymentSuccess";
import TransactionHistory from "./pages/TransactionHistory";
import { History } from "./pages/History";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Login không dùng layout */}
        <Route path="/" element={<Login />} />

        {/* Các route cần layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
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
        >
          <Route path="/home" element={<Home />} />
          <Route path="/history" element={<History />}></Route>
          {/* Có thể thêm nhiều route khác ở đây */}
        </Route>
      </Routes>
    </Router>
  );
}
