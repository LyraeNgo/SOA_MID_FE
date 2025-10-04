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
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/payment" element={<PaymentForm />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Routes>
    </Router>
  );
}
